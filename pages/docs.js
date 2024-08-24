import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ImageWithCaption from 'components/ImageWithCaption';
import LogoHeader from 'components/LogoHeader';
import NestedList from 'components/NestedList';
import Para from 'components/Para';
import Quote from 'components/Quote';
import Section from 'components/Section';
import Head from 'next/head';
import * as React from 'react';
import Link from 'src/Link';

export default function Docs() {
    return (
        <Container maxWidth="sm">
            <Head>
                <title>Documentation | Gannett.cc</title>
            </Head>
            <Box sx={{ py: 3 }}>
                <LogoHeader headline="Gannett Documentation" />
                <Quote
                    sourceTitle="National Archives"
                    sourceHref="https://www.archives.gov/research/census/1950/ed-maps">
                    An Enumeration District was an area that an enumerator (census taker) could completely cover within two weeks in cities and within four weeks in rural areas.
                </Quote>
                <Para>
                    Every genealogist who has family in the United States after the mid-19th Century will have encountered <Link href="https://www.familysearch.org/en/wiki/United_States_Federal_Census#Enumeration_Districts">Enumeration Districts</Link> (EDs), even if they don’t realize it. This is how counties and cities are split up into smaller regions of a few hundred people. The exact shape of each ED determines which one you need to look in to find records for people living at a certain address.
                </Para>
                <ImageWithCaption 
                    src="/ed.jpg"
                    href="https://catalog.archives.gov/id/286184794"
                    alt="A close-up grid of streets with red and orange pencil lines dividing the grid into numbered districts"
                >
                    Enumeration District map, Palo Alto, CA (1930)
                </ImageWithCaption>
                <Para>
                    Gannett is a tool which shows the EDs for large metro areas. It allows you to reach the census population schedule for the correct ED on Ancestry or FamilySearch. Please note that, unfortunately, <em>most cities are not available in most census years.</em> Here is a list of <Link href="/coverage">which cities/year combinations are available</Link>. To learn more about where the data for this tool comes from, please read the <Link href="/about">About page</Link>.
                </Para>
                <Section anchor="finding">
                    Finding the right ED
                </Section>
                <NestedList>
                    <ol>
                        <li>Select the census year. Note that the cities available for that year will update on the map. Of course, <Link href="https://www.familysearch.org/en/wiki/United_States_Census_1890#1890_Surviving_Population_Schedules">1890 is missing</Link>.</li>
                        <li>
                            <ol>
                                <li>Click one of the orange dots to zoom into that city. Alternatively, you can zoom and pan around the map, including pinch-to-zoom on mobile.</li>
                                <li>Search for a street name, city, or ED number in the map’s search bar.</li>
                            </ol>
                        </li>
                        <li>Find the neighborhood you’re interested in and click to place a marker at the correct address.</li>
                        <li>In the info panel, click the link for the service you want to see the population schedule on.</li>
                        <li>To see the ED for that address in a different year, just click the appropriate year at the top of the map. Note that most cities don’t have data for all 6 census years. Learn more on the <Link href="/coverage">coverage page</Link>.</li>
                    </ol>
                </NestedList>
                <Section>
                    Searching
                </Section>
                <Para>
                    You can search for city names, street names, 2-letter state abbreviations, and ED numbers (full numbers, including the county prefix).
                </Para>
                <ul>Examples:
                    <li>howard san (will find <strong>Howard St, San Francisco, CA</strong>)</li>
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
                <Section anchor="errors">
                    Errors and Inconsistencies
                </Section>
                <Para>
                    Turning tens of thousands of pages of maps and textual descriptions into hundreds of Shapefiles has been an enormous amount of work, and I’m grateful to <Link href="/about">John and his team</Link> for the years of effort they’ve put in! In any project of this size, though, there will be some things that slip through the cracks. Some of these will have been added by me while processing the GIS files. A surprising number are actually due to errors in the original data from the Census! Examples of issues include:
                </Para>
                <ul>
                    <li>Duplicate EDs</li>
                    <li>Overlapping EDs</li>
                    <li>EDs with holes in them which shouldn’t be there</li>
                    <li>EDs with incorrect borders</li>
                    <li>EDs which are missing names</li>
                    <li>EDs which are missing FamilySearch and/or Ancestry links</li>
                    <li>EDs which are on the Gannett map but which have a different name in the population schedules</li>
                </ul>
                <Para>
                    The more obvious of these are easy to search for in the data, and I’m slowly working on resolving the issues. However, if you find something obscure, or if one of these problems is blocking you, please <Link href="/contact">reach out</Link> and provide a link to the ED in question. I will help if I can.
                </Para>
                <Section anchor="ed-names">
                    Enumeration District names
                </Section>
                <Para>
                    Between 1900 and 1950, EDs look like this: <Link href="/?year=1940&state=CA&ed=38-236">38-236</Link> or sometimes <Link href="/?year=1940&state=CA&ed=38-68A">38-68A</Link>. The piece before the hyphen is usually a county number. (However, as cities grew, they increasingly received their own numbers.) The second number, with or without a letter, is the district number. In order to uniquely refer to an ED, it’s necessary to have both parts of the ED number as well as the census year and the state.
                </Para>
                <Para>
                    Districts in 1880 were not given county integers, and in many places you will see them referred to as e.g. “Alameda-15”. However, Steve Morse’s <Link href="https://stevemorse.org">One Step</Link> website assigned numbers to the 1880 counties based on the 1900 numbers. This worked well, as the numbers were assigned alphabetically. Most county names and borders were fixed by the late 1800s. I have used these same county numbers to simplify referring and linking to 1880 EDs.
                </Para>
                <Section anchor="ed-descriptions">
                    Enumeration District descriptions
                </Section>
                <Para>
                    EDs are displayed in Gannett as boundaries on a web map. Sometimes, this is based on maps produced by the Census Department. However, not every ED has a map. From 1830–1950, a more consistent source for the boundaries is the textual descriptions available in <Link href="https://www.archives.gov/files/research/microfilm/t1224.pdf">NARA microfilm series T1224</Link>. (T1210 for 1900.) In cities, these tend to use city blocks, described by the bounding streets and then numbered.
                </Para>
                <Para>
                    Images of the descriptions through 1930 are available for free <Link href="https://www.familysearch.org/search/catalog/results?count=20&query=%2Bsubject_id%3A870702">on FamilySearch</Link>, broken up by census year. For 1940 and 1950, <Link href="https://stevemorse.org/census/eddef1224.html">SteveMorse.org has a tool</Link> to show the images. Where possible, Gannett provides direct links to images of these textual descriptions to aid in determining an ED’s correct boundary.
                </Para>
                <Para>
                    NARA’s <Link href="https://www.archives.gov/publications/prologue/2016/spring/archivist.html">History Hub</Link> site has <Link href="https://historyhub.history.gov/genealogy/census-records/b/census-blog/posts/1950-census-how-to-read-written-enumeration-district-descriptions">a really helpful article by archivist Claire Kluskens</Link> which goes into plenty of detail about how to interpret these ED description records.
                </Para>
                <Para>
                    Unfortunately, we do sometimes find that the textual description, the map, and the list of people actually enumerated on the population schedule do not agree. Given the hundreds of thousands of districts in a given census, this is hardly surprising! These cases are rare, but it’s important to keep this in mind. Check everything, and explore any inconsistencies to see if the person you’re looking for may be hiding in a slightly mis-filed location.
                </Para>
                <Section anchor="1960">
                    EDs in 1960 and beyond
                </Section>
                <Para>
                    Dr. Joel Weintraub has done an excellent <Link href="https://youtu.be/u45LBnra1Ko">video deep dive</Link> into what we can expect from Enumeration Districts in the 1960 Census. Spoiler alert: it is far, far more complicated than it was in earlier years. Simple 1:1 associations between addresses and EDs may no longer be achievable.
                </Para>

            </Box>
        </Container >);
}
