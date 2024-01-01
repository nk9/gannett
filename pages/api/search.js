import { supabase } from '@/supabase';
import match from 'autosuggest-highlight/match';

async function runMetroSearch(query) {
    console.log(`Looking for '${query}' (but not really)`)
    const { data, error } = await supabase.from('metros').select().ilike('name', `%${query}%`)
    const matches = (val) => match(val, query, { insideWords: true })

    const results = data.map((res) => ({
        description: res.name,
        structured_formatting: {
            main_text: res.name,
            main_text_matched_substrings: matches(res.name),
            secondary_text: "somewhere"
        }
    }))
    console.log("results:", results)
    return {
        "results": results
    }
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

    const query = req.query ?? "";
    console.log("search handler running with query:", query.q)
    var result = await runMetroSearch(query.q)
    console.log(result)

    // await Promise.all(tasks.map(p => p()))


    var status_code = 200
    res.status(status_code).json(result)
}
