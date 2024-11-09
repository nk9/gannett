import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LogoHeader from 'components/LogoHeader';
import Para from 'components/Para';
import Section from 'components/Section';
import Head from 'next/head';
import Link from '/src/Link';

var COLORS = {
    orange: { main: "#FFA500", pastel: "#FFD78E" },
    blue: { main: "#2100FF", pastel: "#84CBFF" },
    green: { main: "#00A167", pastel: "#79FBCC" },
    purple: { main: "#8F0093", pastel: "#FDAFFF" }
};

function URI({ children }) {
    return (
        <Box component='span'
            p="6px"
            sx={{
                fontFamily: "monospace",
                color: "#555",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                lineHeight: "30px"
            }}>
            {children}
        </Box>)
}

function Param({ children, color }) {
    return (
        <Box component='span'
            p="1px"
            mx="1px"
            sx={{
                fontFamily: "monospace",
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: COLORS[color].pastel,
                border: "2px solid " + COLORS[color].main,
                borderRadius: "5px",
            }}>
            {children}
        </Box>)
}

function createData(param, color, example, description) {
    return { param, color, example, description };
}

const rows = [
    createData('YEAR', 'orange', ['1940'], "The census year to use. Must be all four digits."),
    createData('STATE', 'green', ['CA'], "The two-letter state abbreviation."),
    createData('ED-NAME', 'purple', ['38-460', '2-7'], "The full ED name, including county code. For the 1880 Census, use the SteveMorse.org county codes instead of the county names."),
    createData('METRO_NAME', 'blue', ['SanFrancisco'], 'Name of the city. Use "St" for Saint and either URL-encode or just remove any spaces.'),
];


export default function API() {
    return (
        <Container maxWidth="sm">
            <Head>
                <title>URL API | Gannett.cc</title>
            </Head>
            <Box py={3}>
                <LogoHeader headline="URL API" />
                <Para>
                    Gannett supports a special URL syntax to launch the site zoomed in to a specific part of the United States. This is also called deep linking. You have two formats to choose from when providing the information:
                </Para>
                <Section anchor="ed-name">
                    Zoom to Enumeration District
                </Section>
                <Para>
                    <URI>gannett.cc/?year=<Param color="orange">year</Param>&state=<Param color="green">state</Param>&ed=<Param color="purple">ed-name</Param></URI>
                </Para>
                <Section anchor="metro-name">
                    Zoom to City/Metro
                </Section>
                <Para>
                    <URI>gannett.cc/?year=<Param color="orange">year</Param>&state=<Param color="green">state</Param>&metro=<Param color="blue">metro_name</Param></URI>
                </Para>
            </Box>

            <Box pt={2}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 400 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Parameter</TableCell>
                                <TableCell>Example</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.param}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" sx={{ verticalAlign: "top" }}>
                                        <Param color={row.color}>{row.param}</Param>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>{row.example.map((ex) => (
                                        <Typography key={ex} sx={{ fontFamily: "monospace" }}>{ex}</Typography>))}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}
