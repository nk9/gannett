import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LogoHeader from 'components/LogoHeader';
import Para from 'components/Para';
import Head from "next/head";
import Link from '/src/Link';

export default function About() {
    return (
        <Container maxWidth="sm">
            <Head>
                <title>About | Gannett.cc</title>
            </Head>
            <Box sx={{ py: 3 }}>
                <LogoHeader headline="About Gannett" />
                <Para>
                    I first encountered Enumeration Districts in the 1990s, looking through Census pages at the National Archives in Washington, DC. Right from the beginning, I’ve been wanting a way to visualize them. It seemed crazy to me that such a fundamentally geospatial construct was publicly available almost exclusively as <Link href="/docs#ed-descriptions">textual descriptions</Link> and endless lists of names and addresses. I knew that <Link href="https://www.archives.gov/research/census/1950/ed-maps">ED maps existed</Link> for many census years, though not all places in all years. But only a few were availble online, and then only as images, <Link href="https://catalog.archives.gov/id/5836711?objectPage=37">usually black and white</Link>—even when the maps required color to be able to tell the various lines apart!
                </Para>
                <Para>
                    Over the years, I looked from time to time to see if anyone had put together digital versions of the ED maps from various census years. The closest I could find was the very nice Ancestry.com <Link href="https://support.ancestry.com/s/article/Census-District-Finder?language=en_US">1950 Census District Finder</Link>, which combined georeferenced ED maps with an address search field and district borders. However, this was only for the most recent 1950 data.
                </Para>
                <Para>
                    In mid-December 2023, I stumbled upon the <Link href="https://www.brown.edu/academics/spatial-structures-in-social-sciences/urban-transition-historical-gis-project">Urban Transitions Project</Link>, led by <Link href="https://www.brown.edu/academics/spatial-structures-in-social-sciences/people/john-r-logan">John Logan</Link> at Brown University. Here, finally, was the data I’d been looking for! With help from an army of digitizers, and working closely with ED mavens <Link href="https://stevemorse.org/">Steve Morse</Link> and <Link href="https://historyhub.history.gov/members/joelweintraub">Dr. Joel Weintraub</Link> (<Link href="https://www.youtube.com/channel/UCTyvL4MKwcPnDSz0FTLZf6Q/about">YouTube</Link>), John has spent years turning ED maps and descriptions from the largest cities into ESRI Shapefiles. Different cities and years have been the focus of different projects, all of which are available on the UTP website. Putting it all together, his team has amassed an impressive collection of <Link href="https://en.wikipedia.org/wiki/Geographic_information_system" title="Geographic Information System">GIS</Link> EDs for <Link href="/coverage">218 city/census year pairs</Link> (e.g. Buffalo, NY/1880; Cincinnati, OH/1920).
                </Para>
                <Para>
                    I contacted John about the project and got to work. Just a few weeks later, the first, very limited version of Gannett was born!
                </Para>
                <Para>
                    This project has no connection to <Link href="https://en.wikipedia.org/wiki/Gannett">the newspaper company</Link>. It is named after <Link href="https://www.census.gov/history/www/census_then_now/notable_alumni/henry_gannett.html">Henry Gannett</Link>, a geographer for the US Census Bureau in the 19th Century. Gannett campaigned for years for a federal body to standardize the many competing and confusing place names. His efforts led to the establishment in 1890 of the <Link href="https://en.wikipedia.org/wiki/United_States_Board_on_Geographic_Names">US Board on Geographic Names</Link>. Gannett was its first chairman. I’m pleased to be able to pay homage to a Census Bureau geographer for this Census geography project!
                </Para>
                <Para>
                    — Nick Kocharhook
                </Para>
            </Box>
        </Container >
    );
}
