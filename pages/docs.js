import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import NestedList from 'components/NestedList';
import Para from 'components/Para';
import Quote from 'components/Quote';
import Section from 'components/Section';
import Image from 'next/image';
import * as React from 'react';
import Link from 'src/Link';

export default function Docs() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Image alt="Diving Gannet logo"
                        src={"/logo-dive.svg"}
                        width={100}
                        height={130}
                        sizes='100vw' />
                </Box>
                <Typography variant="h4" gutterBottom>
                    Gannett Documentation
                </Typography>
                <Quote>
                    An Enumeration District was an area that an enumerator (census taker) could completely cover within two weeks in cities and within four weeks in rural areas. <br />
                    — <Link href="https://www.archives.gov/research/census/1950/ed-maps">National Archives</Link>
                </Quote>
                <Para>
                    Every genealogist who has family in the United States after the mid-19th Century will have encountered <Link href="https://www.familysearch.org/en/wiki/United_States_Federal_Census#Enumeration_Districts">Enumeration Districts</Link> (EDs), even if they don’t realize it. This is how counties and cities are split up into smaller regions of a few hundred people, and the exact shape of each ED determines which one you need to look in to find records for people living at a certain address.
                </Para>
                <Para>
                    Gannett is a tool to go from a neighbourhood or street name in a large metro area, directly to the census Population Schedule for the correct ED on Ancestry or FamilySearch. Please note that, unfortunately, <em>most cities are not available in most census years.</em> To learn more about where the data for this tool comes from, please read the <Link href="/about">About page</Link>.
                </Para>
                <Section anchor="finding">
                    Finding the right ED
                </Section>
                <NestedList>
                    <ol>
                        <li>Select the census year. Note that the cities available for that year will update on the map. Of course, <Link href="https://www.familysearch.org/en/wiki/United_States_Census_1890#1890_Surviving_Population_Schedules">1890 is missing</Link>.</li>
                        <li>
                            <ol>
                                <li>Click one of the red dots to zoom into that city. Alternatively, you can use a mouse (on a desktop), scrolling (on a desktop or laptop) or double-tapping/pinch to zoom on mobile.</li>
                                <li>Search for a street name, city, or ED number in the map’s search bar.</li>
                            </ol>
                        </li>
                        <li>Find the neighborhood you’re interested in and click on the correct enumeration district.</li>
                        <li>In the info panel, click the link for the service you want to see the Population Scheudle on.</li>
                    </ol>
                </NestedList>
                <Section>
                    Searching
                </Section>
                <Para>
                    You can search for city names, street names, 2-letter state abbreviations, and ED numbers (full numbers, including the county prefix).
                </Para>
                <ul>Examples:
                    <li>howard san (will find <strong>Howard St, San Francisco</strong>)</li>
                    <li>Pittsburgh PA</li>
                    <li>cin (will find <strong>Cincinnatti, OH</strong>)</li>
                    <li>41-19 (will find ED 19 in county 41, e.g. <strong>Spokane, WA</strong> in 1940)</li>
                </ul>
                <Section>
                    Linking
                </Section>
                <Para>
                    Once you’ve found an ED, you can link to it by clicking the link button next to the ED number in the info panel. You can then share that link with anyone else. They will be taken directly to the ED when they enter the link in their browser.
                </Para>
            </Box>
        </Container >);
}
