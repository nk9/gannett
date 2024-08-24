import { supabase } from '@/supabase';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid } from '@mui/x-data-grid';
import { columnGroupsStateInitializer } from '@mui/x-data-grid/internals';
import LogoHeader from 'components/LogoHeader';
import Para from 'components/Para';
import Head from 'next/head';
import Link from '/src/Link';

export default function Coverage() {
    const [rows, setRows] = useState([]);
    const theme = createTheme();
    const isXs = useMediaQuery(theme.breakpoints.not('xs'));

    useEffect(() => {
        async function fetchAllMetros() {
            let { data, error } = await supabase
                .from('metro_years')
                .select('year, state, county, name')
                .order('year')
                .order('state')
                .order('county')
                .order('name')
                ;
            console.log(error, data);

            setRows(data.map((r) => ({
                id: r.year + r.state + r.county + r.name,
                name: r.name,
                year: r.year,
                state: r.state,
                county: r.county,
                link: `/?year=${r.year}&state=${r.state}&metro=${r.name}`
            })))
        }
        fetchAllMetros();
    }, []);

    const columns = [
        { field: 'year', headerName: 'Year', width: 100 },
        { field: 'state', headerName: 'State', width: 110 },
        { field: 'county', headerName: 'County', width: 150 },
        {
            field: 'name', headerName: 'City', width: 120, renderCell: (params) => (
                <Link href={params.row.link} target="_blank">
                    {params.value}
                </Link>)
        },
    ]

    return (
        <Container maxWidth="sm">
            <Head>
                <title>Coverage | Gannett.cc</title>
            </Head>
            <Box sx={{ py: 3 }}>
                <LogoHeader headline="ED City Coverage" />
                <Para>
                    There are quite literally hundreds of thousands of Enumeration Districts in each census. Unfortunately, Gannett.cc is not able to display anywhere close to all of them. You can learn more about the project which produced this data on <Link href="/about">the About page</Link>.
                </Para>
                <Para>
                    Here is a list of the cities that <strong>are</strong> included, broken up by year.
                </Para>
                <Box mt={3}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 12,
                                },
                            },
                        }}
                        columnVisibilityModel={{
                            county: isXs
                        }}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>
        </Container >
    );
}
