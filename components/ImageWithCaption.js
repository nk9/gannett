import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import React from 'react';
import Link from 'src/Link';

const ImageWithCaption = ({ src, href, alt, children }) => {
    var img = (<Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes='100vw'
        style={{
            width: '100%',
            height: 'auto'
        }}
    />);

    if (href) {
        img = <Link href={href} style={{ display: "block", width: "100%" }}>{img}</Link>
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={3} sx={{
                position: 'relative'
            }}>
            {img}
            <Typography variant="caption" component="div" mt={1}>
                {children}
            </Typography>
        </Box>
    );
};

export default ImageWithCaption;
