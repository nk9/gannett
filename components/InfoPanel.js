import { useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { sprintf } from 'sprintf-js';

import { resourceFormats, zoomThreshold } from "@/constants";
import District from 'src/District';
import Link from 'src/Link';
import styles from "./InfoPanel.module.scss";
import InfoPanelDescription from './InfoPanelDescription';
import Para from './Para';
import useMapState from '/stores/mapStore';

export default function InfoPanel({ metroInfo, bottom }) {
    const currentZoomLevel = useMapState('currentZoomLevel')
    const selectedDistrict = useMapState('selectedDistrict')
    const selectedDistrictResources = useMapState('selectedDistrictResources')
    const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

    const [isHoveringLinkButton, setIsHoveringLinkButton] = useState(false);

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

                    if (["1880", "1940"].includes(selectedDistrict.props.year)
                        && res.source == "ANC") {
                        pay = " ($)";
                    }
                    return (
                        <ListItem key={index} sx={{ pl: .5, pb: 0, pt: 0, display: "list-item" }}>
                            <Link href={href} target="_blank">{form.title + pay}</Link>
                            <OpenInNewIcon fontSize="xsmall" sx={{ position: "relative", bottom: "-3px", left: "3px" }} />
                        </ListItem>);
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
            
            var ed_name_link = (<>{dist.name} {pageLinkButton}
                <br />
                {dist.metro}, {dist.state}</>);

            if (bottom) {
                ed_name_link = (<>
                    <strong>{dist.name}</strong> — {dist.metro}, {dist.state}
                    {pageLinkButton}
                </>);
            }

            panel = (<>
                <Para sx={{
                    ml: { xs: 2, sm: 0 },
                    mt: { xs: 2, sm: 0 }
                }}>{ed_name_link}</Para>
                <Typography variant='h6' sx={{
                    ml: { xs: 2, sm: 0 },
                    mt: { xs: 1, sm: 2 }
                }}>Census pages</Typography>
                <List sx={{ listStyle: "disc", pl: { xs: 6, sm: 4 }, mt: 0 }}>
                    {census_links}
                </List>
                <Typography variant='h6' sx={{
                    ml: { xs: 2, sm: 0 },
                    mt: { xs: 1, sm: 2 }
                }}>Description</Typography>
                <InfoPanelDescription district={dist} />
                <Typography variant='h6' sx={{
                    ml: { xs: 2, sm: 0 },
                    mt: { xs: 1, sm: 2 }
                }}>Something wrong?</Typography>
                <Para sx={{ ml: { xs: 2, sm: 0 }, mt: 0 }}> If you see any problems with this Enumeration District, <Link href="/contact">please get in touch</Link>. Include a clear explanation of what's wrong and a link to the ED.
                </Para>
            </>);

        }
    } else if (currentZoomLevel() >= zoomThreshold) {
        panel = (<>
            <Para sx={{ m: { xs: 2, sm: 0 } }}>Click within an Enumeration District to learn more about it.</Para>
        </>);
    } else {
        panel = (<>
            <Para sx={{ m: { xs: 2, sm: 0 } }}>Click a city to zoom in.</Para >
            <Para>This is a tool to find census population schedules for large cities by address. For more information, <Link href="/docs">see the docs</Link>.</Para>
        </>);
    }

    return (
        <div className={styles.infoPanel}>
            {panel}
        </div>)
}
