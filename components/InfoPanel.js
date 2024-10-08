import { useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { sprintf } from 'sprintf-js';

import { resourceFormats, zoomThreshold } from "@/constants";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import District from 'src/District';
import Link from 'src/Link';
import styles from "./InfoPanel.module.scss";
import InfoPanelDescription from './InfoPanelDescription';
import OpenInNewIcon from './OpenInNewIcon';
import Para from './Para';
import useMapState from '/stores/mapStore';

export default function InfoPanel({ metroInfo, bottom }) {
    const currentZoomLevel = useMapState('currentZoomLevel')
    const selectedDistrict = useMapState('selectedDistrict')
    const markerCoords = useMapState('markerCoords')
    const selectedDistrictResources = useMapState('selectedDistrictResources')
    const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
    const router = useRouter();

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
    var street_view_link = markerCoords && `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${markerCoords.latitude},${markerCoords.longitude}`;

    if (Object.keys(metroInfo).length > 1 && Object.keys(selectedDistrict).length > 1) {
        let dist = new District(selectedDistrict)
        if (dist && dist.metro_id in metroInfo) {
            const { state, county } = metroInfo[dist.metro_id]
    
            var census_links = [];
            var description_links = [];
            // console.log("selectedDistrictResources:", selectedDistrictResources)
            if (selectedDistrictResources) {
                var descr_count = 1;
                selectedDistrictResources.map((res, index) => {
                    if (res.type == "CENSUS") {
                        let form = resourceFormats[res.source][res.type];
                        let href = sprintf(form.format, res.value);
                        var pay = "";
                    
                        if (["1880", "1940"].includes(selectedDistrict.props.year)
                            && res.source == "ANC") {
                            pay = " ($)";
                        }
                        census_links.push(
                            <ListItem key={index} sx={{ pl: .5, pb: 0, pt: 0, display: "list-item" }}>
                                <Tooltip title={res.name} placement='right'>
                                    <Link href={href} target="_blank">{form.title + pay}</Link>
                                </Tooltip>
                                <OpenInNewIcon />
                            </ListItem>);
                    } else if (res.type == "DESCR") {
                        let form = resourceFormats[res.source][res.type];
                        let href = sprintf(form.format, res.value);

                        description_links.push(
                            <Link href={href} target="_blank">{descr_count}</Link>
                        )
                        descr_count += 1;
                    }
                })
                // console.log("links:", census_links, description_links)
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
                <Para sx={{ ml: { xs: 2, sm: 0 }, mt: 0 }}>These links require creating free accounts.
                </Para>
                <List sx={{ listStyle: "disc", pl: { xs: 6, sm: 4 }, pt: 0, pb: 0 }}>
                    {census_links}
                </List>

                <Typography variant='h6' sx={{
                    ml: { xs: 2, sm: 0 },
                    mt: { xs: 1, sm: 2 }
                }}>Description<IconButton aria-label="link" size="small" color="primary"
                    sx={{ position: "relative", bottom: "2px", left: "2px" }}
                    onClick={() => router.push("/docs#ed-descriptions")}
                >
                        
                        <HelpOutlineIcon fontSize='small' />
                        
                    </IconButton></Typography>
                <InfoPanelDescription district={dist} description_links={description_links} sx={{ ml: { xs: 2, sm: 0 }, mt: 0 }} />

                <Typography variant='h6' sx={{
                    ml: { xs: 2, sm: 0 },
                    mt: { xs: 1, sm: 2 }
                }}>Maps</Typography>
                <Para sx={{
                    ml: { xs: 2, sm: 0 },
                    mt: { xs: 2, sm: 0 }
                }}><Link href={street_view_link} target="_blank">Google Street View</Link>
                    <OpenInNewIcon /></Para>

                <Typography variant='h6' sx={{
                    ml: { xs: 2, sm: 0 },
                    mt: { xs: 1, sm: 2 }
                }}>Something wrong?</Typography>
                <Para sx={{ ml: { xs: 2, sm: 0 }, mt: 0 }}> If you see any <Link href="/docs#errors">problems</Link> with this Enumeration District, <Link href="/contact">please get in touch</Link>. Include a clear explanation of what's wrong and a link to the ED.
                </Para>
            </>);

        }
    } else if (currentZoomLevel() >= zoomThreshold) {
        panel = (<>
            <Para sx={{ m: { xs: 2, sm: 0 } }}>Click within an Enumeration District (blue dashed lines) to learn more about it.</Para>
            <Para>No districts? Try a different year. Otherwise, have a look at <Link href="/coverage">the Coverage page</Link> to learn which city/year combinations are available at this time.</Para>
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
