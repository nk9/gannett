import { supabase } from '@/supabase';
import match from 'autosuggest-highlight/match';

function preprocessQuery(query) {
    return query.split(' ').map((word) => word + ":*").join(" & ")
}

async function runMetroSearch(query) {
    console.log(`Looking for '${query}'`)
    const { data, error } = await supabase.from('metros').select().ilike('name', `%${query}%`)
    const matches = (val) => match(val, query, { insideWords: true })

    const results = data.map((res) => ({
        type: 'metro',
        key: `city-${res.id}`,
        description: res.name,
        structured_formatting: {
            main_text: res.name,
            main_text_matched_substrings: matches(res.name),
            secondary_text: "somewhere"
        }
    }))
    return results
}

async function runRoadSearch(year, query) {
    var results = []

    if (query.length >= 3) {
        const processedQuery = preprocessQuery(query)
        const { data, error } = await supabase.rpc('search_roads_for_year', { _year: year, query: processedQuery })
        console.log('#### search_roads_for_year', data)
        const matches = (val) => match(val, query)

        if (!error) {
            results = data.map((res) => ({
                type: 'road',
                key: `road-${res.road_id}`,
                description: res.road_name,
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


export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' })
        return
    }

    const { q: query, year } = req.query ?? {};
    console.log("search handler running with query:", query)
    var tasks = [
        async () => {
            return await runMetroSearch(query)
        },
        async () => {
            return await runRoadSearch(year, query)
        }
    ]

    var test = await Promise.all(tasks.map(p => p()))
    var flattened = test.flat()
    console.log('$$$$', flattened)
    const result = {
        "results": flattened
    }

    var status_code = 200
    res.status(status_code).json(result)
}
