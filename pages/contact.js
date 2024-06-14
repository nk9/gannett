import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Para from 'components/Para';
import * as React from 'react';
import Link from '../src/Link';

export default function About() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ py: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Get in touch
                </Typography>
                <Para>
                    I want this project to be a useful resource for the whole genealogy community. If you have thoughts on how this data could be used better, please get in touch! If you have technical skills, I’d love to hear from you. And if you’ve found a bug, please open an issue on the project’s <Link href="https://github.com/nk9/gannett">GitHub page</Link>.
                </Para>
                <Button variant="contained" component={Link} noLinkStyle href="mailto:quaver.drake.0s@icloud.com"
                    sx={{ mt: 3 }}>
                    Send Email
                </Button>
            </Box>
        </Container>
    );
}
