import { Fragment } from 'react';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/system";
import Link from 'src/Link';

function InfoPanelDescription({ className, district: dist, description_links: links }) {
    var ed_desc_url = `https://stevemorse.org/ed/ed2.php?year=${dist.year}&state=${dist.state}&ed=`;

    if ([1930, 1940].includes(dist.year)) {
        ed_desc_url += dist.name.toUpperCase();
    } else if ([1880, 1900, 1910, 1920].includes(dist.year)) {
        ed_desc_url += `${dist.county}-${dist.district.toUpperCase()}`;
    }

    var full_text_links = "";
    if (links.length) {
        full_text_links = <>
            <Typography variant='body'>Full text: {links.reduce((acc, curr, index) => {
                acc.push(<Fragment key={`descr-link-${index}`}>{curr}</Fragment>);
                
                if (index < links.length - 1) {
                    acc.push(", ");
                }
                return acc;
            }, [])}</Typography>
            <OpenInNewIcon fontSize="xsmall" sx={{ position: "relative", bottom: "-3px", left: "3px" }} />
        </>
    }



    return (<Box className={className}>
        {ed_desc_url && <>
            <Link href={ed_desc_url} target="_blank">Text SteveMorse.org</Link>
            <OpenInNewIcon fontSize="xsmall" sx={{ position: "relative", bottom: "-3px", left: "1px" }} /></>
        }
        {full_text_links}
 
    </Box>)
}
const StyledInfoPanelDescription = styled(InfoPanelDescription)``;
export default StyledInfoPanelDescription;
