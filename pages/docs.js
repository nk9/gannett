import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Para from 'components/Para';
import Quote from 'components/Quote';
import Image from 'next/image';
import * as React from 'react';
import Link from '../src/Link';

export default function Docs() {
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
        <Typography variant="h4" gutterBottom>
          Gannett Documentation
        </Typography>
        <Quote>
          An Enumeration District was an area that an enumerator (census taker) could completely cover within two weeks in cities and within four weeks in rural areas. <br />
          — <Link href="https://www.archives.gov/research/census/1950/ed-maps">National Archives</Link>
        </Quote>
        <Para variant='body1'>
          Every genealogist who has family in the United States after the mid-19th Century will have encountered <Link href="https://www.familysearch.org/en/wiki/United_States_Federal_Census#Enumeration_Districts">Enumeration Districts</Link> (EDs), even if they don't realize it. This is how counties are split up into smaller regions of a few hundred people, and the exact shape of each ED determines where you need to look to find records for people living at a certain address.
        </Para>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Using the website
        </Typography>
        <Para>
          Blah
        </Para>
      </Box>
    </Container >);
}
