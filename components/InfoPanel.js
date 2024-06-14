import { useState } from 'react';

import { resourceFormats, zoomThreshold } from "@/constants";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { sprintf } from 'sprintf-js';
import District from 'src/District';
import Link from 'src/Link';
import styles from "./InfoPanel.module.scss";
import useMapState from '/stores/mapStore';

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
                    var pay = "";

                    if (selectedDistrict.props.year != "1940" && res.source == "ANC") {
                        pay = " ($)";
                    }
                    return (
                        <li key={index}><Link href={href} target="_blank">{form.title + pay}</Link>
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
                    <Typography variant='h6'>Census pages</Typography>
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
                    <Typography variant='h6'>Census pages</Typography>
                    <ul>
                        {census_links}
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
