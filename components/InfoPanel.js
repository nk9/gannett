import District from '/src/District';
import { USStates, zoomThreshold, resourceFormats } from "@/constants";
import useMapState from '/stores/mapStore';
import { sprintf } from 'sprintf-js';
import LinkIcon from '@mui/icons-material/Link';
import IconButton from '@mui/material/IconButton';


export default function InfoPanel({ metroInfo }) {
    const currentZoomLevel = useMapState('currentZoomLevel')
    const selectedDistrict = useMapState('selectedDistrict')
    const selectedDistrictResources = useMapState('selectedDistrictResources')

    const clickLinkButton = () => {
        const props = selectedDistrict.props
        
        var link = window.location.origin
        link += `/?year=${props.year}&state=${props.state}`
        link += `&ed=${props.metro_code}-${props.district}`

        navigator.clipboard.writeText(link);
    }

    if (Object.keys(metroInfo).length > 1 && Object.keys(selectedDistrict).length > 1) {
        let dist = new District(selectedDistrict)
        if (dist && dist.metro_id in metroInfo) {
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
            // var ancestry_census = new URL('https://stevemorse.org/census/ancestry/dynamic.php')
            // ancestry_census.search = query

            var census_links = []
            // console.log("selectedDistrictResources:", selectedDistrictResources)
            if (selectedDistrictResources) {
                census_links = selectedDistrictResources.map((res, index) => {
                    let form = resourceFormats[res.source][res.type]
                    let href = sprintf(form.format, res.value);
                    return (<li key={index}><a href={href} target="_blank">{form.title}</a></li>);
                })
            }
            
            return (<>
                <h2>ED Finder</h2>
                <p>{dist.name}
                    <IconButton aria-label="link" size="small" color="primary"
                        sx={{ position: "relative", bottom: "2px", left: "2px" }}
                        onClick={clickLinkButton}>
                        <LinkIcon fontSize="inherit" />
                    </IconButton>
                </p>
                <h3>Census pages</h3>
                <ul>
                    <li><a href={fs_census} target="_blank">Family Search</a></li>
                    {census_links}
                </ul>
                <h3>Maps</h3>
                <ul>
                    {nara_ed_maps_link && <li><a href={nara_ed_maps_link} target="_blank">NARA</a></li>}
                    {ancestry_ed_maps_link && <li><a href={ancestry_ed_maps_link} target="_blank">Ancestry ($)</a></li>}
                </ul>
            </>
            )
        }
    }

    if (currentZoomLevel() >= zoomThreshold) {
        return <>
            <h2>ED Finder</h2>
            <p>Click within an Enumeration District to learn more about it.</p>
        </>
    } else {
        return <>
            <h2>ED Finder</h2>
            <p>Click a city to zoom in.</p>
        </>
    }
}
