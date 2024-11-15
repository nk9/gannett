import { supabase } from '@/supabase';
import match from 'autosuggest-highlight/match';

function toTSQueryFormat(query) {
    return query.split(' ').map((word) => word + ":*").join(" & ")
}

async function runMetroSearch(year, query) {
    const likeQuery = query + '%';
    const { data, error } = await supabase.rpc('search_metros_for_year', { _year: year, query: likeQuery })
    // const { data, error } = await supabase.from('metros').select().ilike('name', `%${query}%`)
    const matches = (val) => match(val, query, { insideWords: true })

    const results = data.map((res) => ({
        type: 'metro',
        key: `city-${res.metro_id}`,
        description: res.name,
        point: res.geom,
        structured_formatting: {
            main_text: res.name,
            main_text_matched_substrings: matches(res.name),
            secondary_text: `${res.county} County, ${res.state}`
        }
    }))
    return results
}

async function runRoadSearch(year, query) {
    var results = []

    if (query.length >= 3) {
        const tsQuery = toTSQueryFormat(query)
        const { data, error } = await supabase.rpc('search_roads_for_year', { _year: year, query: tsQuery })
        const matches = (val) => match(val, query)

        if (!error) {
            results = data.map((res) => ({
                type: 'road',
                key: `road-${res.road_id}`,
                description: res.road_name,
                point: res.point,
                structured_formatting: {
                    main_text: res.road_name,
                    main_text_matched_substrings: matches(res.road_name),
                    secondary_text: `${res.metro_name}, ${res.state}`
                }
            }))
        }
    }
    return results
}

async function runDistrictSearch(year, query) {
    var results = []

    if (query.length >= 3) {
        var edRegex = /^\s*(\d+\-\d+)\s*$/;
        var edName = query.match(edRegex)

        if (edName) {
            const likeQuery = edName[0] + '%'
            const { data, error } = await supabase.rpc('search_districts_for_year', { _year: year, query: likeQuery })
            const matches = (val) => match(val, query)
        
            if (!error) {
                results = data.map((res) => ({
                    type: 'district',
                    key: `district-${res.district_id}`,
                    description: res.name,
                    point: res.point,
                    structured_formatting: {
                        main_text: res.name,
                        main_text_matched_substrings: matches(res.name),
                        secondary_text: `${res.metro_name}, ${res.state}, ${res.county} County`
                    }
                }))
            } else {
                console.log(error)
            }
        }
    }
    return results
}

async function parseCoordinates(query) {
    var results = []

    if (query.length >= 6) {
        var coordRegex = /^\s*(\d{2,3}(\.\d*)?),\s*(\-\d{2,3}(\.\d*)?)\s*$/;
        var coords = query.match(coordRegex)

        if (coords && coords.length == 5) {
            const [a, lat, b, long, c] = coords
            const lat_short = parseFloat(lat).toLocaleString(undefined, { maximumFractionDigits: 6 })
            const long_short = parseFloat(long).toLocaleString(undefined, { maximumFractionDigits: 6 })
            const coordStr = `${lat_short}, ${long_short}`;

            results = [{
                type: 'coordinate',
                key: 'coordinate',
                description: coordStr,
                point: { 
                    coordinates: [long, lat]
                },
                structured_formatting: {
                    main_text: coordStr
                }

            }]
        }
    }

    return results
}

async function runAddressSearch(query) {
    var results = []

    if (query.length >= 6 && query.includes(' ')) {
        results = await fetch('https://api.mapbox.com/search/geocode/v6/forward?' + new URLSearchParams({
            q: query,
            types: "address",
            country: "us",
            limit: 1,
            access_token: process.env.MAPBOX_PRIVATE_ACCESS_TOKEN,
        }))
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    if ('error_code' in data) {
                        console.log("Address search failed:", data);
                        return []
                    } else {
                        return data.features.map((res) => {
                            let prop = res.properties
                            return {
                                type: 'address',
                                key: `address-1`,
                                description: prop.full_address,
                                point: { 
                                    coordinates: res.geometry.coordinates
                                },
                                structured_formatting: {
                                    main_text: prop.name,
                                    // main_text_matched_substrings: matches(res.name),
                                    secondary_text: [
                                        prop.context.place.name,
                                        prop.context.region.region_code,
                                        prop.context.postcode.name
                                    ].join(', ')
                                }
                            }
                        })
                    }
                }
            });
    }
    return results
}

// [
//             {
//                 "description": "Test1",
//                 "structured_formatting": {
//                     "main_text": "Hoboken",
//                     "main_text_matched_substrings": [{ offset: 0, length: 2 }],
//                     "secondary_text": "New Jersey"
//                 }
//             },
//             {
//                 "description": "Test2",
//                 "structured_formatting": {
//                     "main_text": "Holland Park",
//                     "main_text_matched_substrings": [{ offset: 0, length: 2 }],
//                     "secondary_text": "London, UK"
//                 }
//             }]


// export default async function handler(req, res) {
//     if (req.method !== 'GET') {
//         res.status(405).send({ message: 'Only GET requests allowed' })
//         return
//     }

//     const { q: query, year } = req.query ?? {};
//     var tasks = [
//         async () => {
//             return await parseCoordinates(query)
//         },
//         async () => {
//             return await runAddressSearch(query)
//         },
//         async () => {
//             return await runMetroSearch(year, query)
//         },
//         async () => {
//             return await runRoadSearch(year, query)
//         },
//         async () => {
//             return await runDistrictSearch(year, query)
//         },
//     ]

//     var test = await Promise.all(tasks.map(p => p()))
//     var flattened = test.flat()
//     const result = {
//         "results": flattened
//     }

//     var status_code = 200
//     res.status(status_code).json(result)
// }


export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    const { q: query, year } = req.query ?? {};

    // Define the tasks to run concurrently
    const tasks = [
        async () => ({ type: 'coordinates', result: await parseCoordinates(query) }),
        async () => ({ type: 'address', result: await runAddressSearch(query) }),
        async () => ({ type: 'metro', result: await runMetroSearch(year, query) }),
        async () => ({ type: 'road', result: await runRoadSearch(year, query) }),
        async () => ({ type: 'district', result: await runDistrictSearch(year, query) }),
    ];

    // Set up a ReadableStream to respond incrementally
    const stream = new ReadableStream({
        async start(controller) {
            const taskPromises = tasks.map((task, index) =>
                task().then(
                    (result) => ({ status: 'fulfilled', index, ...result }),
                    (error) => ({ status: 'rejected', index, error })
                )
            );

            // Process each task as it finishes
            for (const taskPromise of taskPromises) {
                const result = await taskPromise;

                if (result.status === 'fulfilled') {
                    controller.enqueue(
                        JSON.stringify({ type: result.type, result: result.result }) + '\n'
                    );
                } else {
                    controller.enqueue(
                        JSON.stringify({ type: result.type, error: result.error.toString() }) + '\n'
                    );
                }
            }

            controller.close();
        },
    });

    // res.setHeader('Content-Type', 'text/plain'); // Streaming JSON could be separated by newline for each item
    // res.setHeader('Transfer-Encoding', 'chunked');
    // stream.pipeTo(res);

    return new Response(stream)
}

