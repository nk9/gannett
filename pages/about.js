import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from '../src/Link';


export default function About() {
    let styles = {
        p: { mt: 3 },
        blockquote: {
            fontSize: '16pt',
            fontFamily: ['serif'],
            borderLeft: 'solid #F5C402',
            paddingLeft: '1rem'
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Image alt="Diving Gannett logo"
                        src={"/logo-dive.svg"}
                        width={100}
                        height={130}
                        sizes='100vw' />
                </Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    About Gannett
                </Typography>
                <Typography variant="body1" component="blockquote" sx={styles.blockquote}>
                    An Enumeration District was an area that an enumerator (census taker) could completely cover within two weeks in cities and within four weeks in rural areas. <br />
                    — <Link href="https://www.archives.gov/research/census/1950/ed-maps">National Archives</Link>
                </Typography>
                <Typography variant='body1' sx={styles.p}>
                    Ever since I first encountered <Link href="https://www.familysearch.org/en/wiki/United_States_Federal_Census#Enumeration_Districts">Enumeration Districts</Link> (EDs) in the 1990s, I've been wanting a way to visualize them. It seemed crazy to me that such a fundamentally geospatial construct was rendered entirely in textual descriptions and endless lists of names and addresses. I knew that <Link href="https://www.archives.gov/research/census/1950/ed-maps">maps existed</Link> for many census years, though not all places in all years. But only a few were availble online, and then only as images, <Link href="https://catalog.archives.gov/id/5836711?objectPage=37">usually black and white</Link>—even when the maps required color to be able to tell the various lines apart!
                </Typography>
                <Typography variant='body1' sx={styles.p}>
                    Over the years, I looked from time to time to see if anyone had put together digital versions of the ED maps from various census years. The closest I could find was the very nice Ancestry.com <Link href="https://support.ancestry.com/s/article/Census-District-Finder?language=en_US">1950 Census District Finder</Link>, which combined georeferenced ED maps with an address search field and district borders. However, this was only for the most recent 1950 data.
                </Typography>
                <Typography variant='body1' sx={styles.p}>
                    In mid-December 2023, I stumbled upon the <Link href="https://www.brown.edu/academics/spatial-structures-in-social-sciences/urban-transition-historical-gis-project">Urban Transitions Project</Link>, led by <Link href="https://www.brown.edu/academics/spatial-structures-in-social-sciences/people/john-r-logan">John Logan</Link> at Brown University. Here, finally, was the data I'd been looking for! Using a series of grants, and working closely with <Link href="https://stevemorse.org/">Steve Morse</Link> and <Link href="https://www.youtube.com/channel/UCTyvL4MKwcPnDSz0FTLZf6Q/about">Joel Weintraub</Link>, John has spent years turning ED maps and descriptions from the largest cities into ESRI Shapefiles. Putting it all together, his team has amassed an impressive collection of <Link href="https://en.wikipedia.org/wiki/Geographic_information_system" title="Geographic Information System">GIS</Link> EDs for 179 city/census year pairs (e.g. Buffalo, NY/1880, Cincinnatti, OH/1920).
                </Typography>
            </Box>
        </Container >
    );
}
