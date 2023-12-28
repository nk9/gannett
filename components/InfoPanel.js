import District from '/src/District';
import { USStates } from "@/constants";


export default function InfoPanel({ metroInfo, districtDict }) {
    console.log(metroInfo, districtDict)
    let dist = new District(districtDict)

    if (Object.keys(metroInfo).length > 1 && Object.keys(districtDict).length > 1) {
        const { nara_ed_maps_link, ancestry_ed_maps_link, state, county } = metroInfo[dist.metro_id]

        var query = new URLSearchParams({
            fullstate: USStates[state],
            state: state,
            year: dist.year,
            county: county,
            ed: dist.district,
            image: 1,
            countyNumber: dist.metro_code
        })
        var fs_census = new URL('https://stevemorse.org/census/familysearch/dynamicfs.php')
        fs_census.search = query
        var ancestry_census = new URL('https://stevemorse.org/census/ancestry/dynamic.php')
        ancestry_census.search = query

        return (<>
            <h2>ED Finder</h2>
            <p>{dist.name}</p>
            <h3>Census pages</h3>
            <ul>
                <li><a href={fs_census} target="_blank">Family Search</a></li>
                <li><a href={ancestry_census} target="_blank">Ancestry ($)</a></li>
            </ul>
            <h3>Maps</h3>
            <ul>
                {nara_ed_maps_link && <li><a href={nara_ed_maps_link} target="_blank">NARA</a></li>}
                {ancestry_ed_maps_link && <li><a href={ancestry_ed_maps_link} target="_blank">Ancestry ($)</a></li>}
            </ul>
        </>
        )
    } else {
        return <>
            <h2>ED Finder</h2>
            <p>Click a city to zoom in.</p>
        </>
    }
}
