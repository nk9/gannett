import { supabase } from '@/supabase';

async function runSearch(query) {
    console.log(`Looking for '${query}' (but not really)`)
    return {
        "results": [
            {
                "structured_formatting": {
                    "main_text": "Hoboken",
                    "main_text_matched_substrings": "Ho",
                    "secondary": "New Jersey"
                }
            },
            {
                "structured_formatting": {
                    "main_text": "Holland Park",
                    "main_text_matched_substrings": "Ho",
                    "secondary": "London, UK"
                }
            }]
    }
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' })
        return
    }

    const query = req.query ?? "";
    console.log("search handler running with query:", query)
    var result = await runSearch(query)
    console.log(result)

    var status_code = 200
    res.status(status_code).json(result)
}
