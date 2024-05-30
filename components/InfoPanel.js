import { useState } from 'react';

import District from '/src/District';
import { USStates, zoomThreshold, resourceFormats } from "@/constants";
import useMapState from '/stores/mapStore';
import { sprintf } from 'sprintf-js';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import styles from "./InfoPanel.module.scss";

export default function InfoPanel({ metroInfo, bottom }) {
    const currentZoomLevel = useMapState('currentZoomLevel')
    const selectedDistrict = useMapState('selectedDistrict')
    const selectedDistrictResources = useMapState('selectedDistrictResources')
    const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

    const [isHoveringLinkButton, setIsHoveringLinkButton] = useState(false);
    var alert = (<></>);

    const clickLinkButton = () => {
        const props = selectedDistrict.props
        
        var link = window.location.origin
        link += `/?year=${props.year}&state=${props.state}`
        link += `&ed=${props.metro_code}-${props.district}`

        navigator.clipboard.writeText(link);
        if (bottom) {
            setTooltipIsOpen(true);

            setTimeout(() => {
                setTooltipIsOpen(false);
            }, 1000);
        }
    }

    var panel = <></>;

    if (Object.keys(metroInfo).length > 1 && Object.keys(selectedDistrict).length > 1) {
        let dist = new District(selectedDistrict)
        if (dist && dist.metro_id in metroInfo) {
            const { nara_ed_maps_link, ancestry_ed_maps_link, state, county } = metroInfo[dist.metro_id]
    
            var census_links = []
            // console.log("selectedDistrictResources:", selectedDistrictResources)
            if (selectedDistrictResources) {
                census_links = selectedDistrictResources.map((res, index) => {
                    let form = resourceFormats[res.source][res.type]
                    let href = sprintf(form.format, res.value);
                    return (
                        <li key={index}><a href={href} target="_blank">{form.title}</a>
                            <OpenInNewIcon fontSize="xsmall" sx={{ position: "relative", bottom: "-3px", left: "3px" }} />
                        </li>);
                })
            }

            const pageLinkButton = (
                <Tooltip
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    open={tooltipIsOpen}
                    placement='right'
                    title="Copied"
                    slotProps={{
                        popper: {
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [0, -20],
                                    },
                                },
                            ],
                        },
                    }}>
                    <IconButton aria-label="link" size="small" color="primary"
                        sx={{ position: "relative", bottom: "2px", left: "2px" }}
                        onClick={clickLinkButton}
                        onMouseEnter={() => setIsHoveringLinkButton(true)}
                        onMouseLeave={() => setIsHoveringLinkButton(false)}
                    >
                        {isHoveringLinkButton ?
                            <ContentCopyIcon fontSize="small" /> :
                            <LinkIcon fontSize="small" />
                        }
                    </IconButton>
                </Tooltip>);
            
            if (bottom) {
                panel = (<>
                    <p><strong>{dist.name}</strong> — {dist.metro}, {dist.state}
                        {pageLinkButton}
                    </p>
                    <h3>Census pages</h3>
                    <ul>
                        {census_links}
                    </ul>
                    {alert}
                </>);
            } else {
                panel = (<>
                    <p>{dist.name} {pageLinkButton}
                        <br />
                        {dist.metro}, {dist.state}
                    </p>
                    <h3>Census pages</h3>
                    <ul>
                        {census_links}
                    </ul>
                    <h3>Maps</h3>
                    <ul>
                        {nara_ed_maps_link && <li><a href={nara_ed_maps_link} target="_blank">NARA</a></li>}
                        {ancestry_ed_maps_link && <li><a href={ancestry_ed_maps_link} target="_blank">Ancestry ($)</a></li>}
                    </ul>
                    {alert}
                </>);
                
            }
        }
    } else if (currentZoomLevel() >= zoomThreshold) {
        panel = (<>
            <p>Click within an Enumeration District to learn more about it.</p>
        </>);
    } else {
        panel = (<>
            <p>Click a city to zoom in.</p>
        </>);
    }

    return (
        <div className={styles.infoPanel}>
            {panel}
        </div>)
}
