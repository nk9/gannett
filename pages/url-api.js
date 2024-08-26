import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LogoHeader from 'components/LogoHeader';
import Para from 'components/Para';
import Section from 'components/Section';
import Head from 'next/head';
import Link from '/src/Link';

function URI({ children }) {
    return (
        <Box component='span'
            p={1}
            sx={{
                fontFamily: "monospace",
                color: "#555",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px"
            }}>
            {children}
        </Box>)
}

function Param({ children }) {
    return (
        <Box component='span'
            sx={{
                fontFamily: "monospace",
                fontWeight: "bold",
                color: "rebeccapurple",
                textTransform: "uppercase"
            }}>
            {'{'}{children}{'}'}
        </Box>)
}

export default function API() {
    return (
        <Container maxWidth="sm">
            <Head>
                <title>URL API | Gannett.cc</title>
            </Head>
            <Box sx={{ py: 3 }}>
                <LogoHeader headline="URL API" />
                <Para>
                    Gannett supports a special URL syntax to launch the site zoomed in to a specific Enumeration District. This is also called deep linking. You have two formats for providing the information.
                </Para>
                <Section anchor="ed-name">
                    Enumeration District name
                </Section>
                <Para>
                    <URI>gannett.cc/?year=<Param>year</Param>&state=<Param>state</Param>&ed=<Param>ed-name</Param></URI>
                </Para>
            </Box>
        </Container>
    );
}
