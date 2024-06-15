// Based on the Google Maps example in MUI Autocomplete docs:
// https://mui.com/material-ui/react-autocomplete/#google-maps-place

import { useEffect, useMemo, useState } from 'react';

import { faCity, faRoad } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { debounce } from '@mui/material/utils';
import parse from 'autosuggest-highlight/parse';

import Image from 'next/image';

import { zoomLevel } from '@/constants';
import useMapState from '/stores/mapStore';

export default function SearchField({}) {
    const year = useMapState('year')
    const setSelectedDistrict = useMapState('setSelectedDistrict')
    const setMapView = useMapState('setMapView')
    const setMarkerCoords = useMapState('setMarkerCoords')
    const searchInputValue = useMapState('searchInputValue')
    const setSearchInputValue = useMapState('setSearchInputValue')
    const searchValue = useMapState('searchValue')
    const setSearchValue = useMapState('setSearchValue')

    const [options, setOptions] = useState([]);

    const doSearch = useMemo(
        () =>
            debounce((request) => {
                // autocompleteService.current.getPlacePredictions(request, callback);
                fetch('/api/search?' + new URLSearchParams({
                    q: request.input,
                    year: year
                }))
            }, 400),
        [],
    );

    useEffect(() => {
        async function fetchData() {
            let active = true;

            // if (!autocompleteService.current && window.google) {
            //     autocompleteService.current =
            //         new window.google.maps.places.AutocompleteService();
            // }
            // if (!autocompleteService.current) {
            //     return undefined;
            // }
            console.log("fetchData in SearchField")

            if (searchInputValue === '') {
                setOptions(searchValue ? [searchValue] : []);
                return undefined;
            }

            // fetch({ input: inputValue }, (results) => {
            //     if (active) {
            //         let newOptions = [];

            //         if (value) {
            //             newOptions = [value];
            //         }

            //         if (results) {
            //             newOptions = [...newOptions, ...results];
            //         }

            //         setOptions(newOptions);
            //     }
            // });
            doSearch({ input: searchInputValue }, (results) => {
                if (active) {
                    setOptions(results)
                }
            })
            console.log("call fetch API route")

            var results = await fetch('/api/search?' + new URLSearchParams({
                q: searchInputValue,
                year: year
            }))
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        console.log("results:", data.results)
                        setOptions(data.results)
                    }
                });


            return () => {
                active = false;
            };
            // return result
        }
        fetchData();
    }, [searchValue, searchInputValue]);

    return (
        <Autocomplete
            id="gannett-search"
            sx={{ width: { xs: 250, sm: 300 } }}
            style={{ position: "relative", backgroundColor: "white", borderRadius: 5 }}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            autoComplete
            freeSolo
            includeInputInList
            filterSelectedOptions
            options={options}
            onChange={(event, selectedOption) => {
                setSearchValue(selectedOption);
                
                if (selectedOption?.point) {
                    setMapView({
                        center: selectedOption.point.coordinates,
                        zoom: zoomLevel[selectedOption.type]
                    })
                    setMarkerCoords({
                        longitude: selectedOption.point.coordinates[0],
                        latitude: selectedOption.point.coordinates[1]
                    });
                }
            }}
            inputValue={searchInputValue}
            onInputChange={(event, newInputValue) => {
                setSearchInputValue(newInputValue);
            }}
            noOptionsText="No results"
            renderInput={(params) => (
                <TextField {...params}
                    label={searchInputValue ? "" : "Search"}
                    InputLabelProps={{ shrink: false }}
                    fullWidth />
            )}
            renderOption={(props, option) => {
                const matches =
                    option.structured_formatting.main_text_matched_substrings || [];

                const parts = parse(
                    option.structured_formatting.main_text,
                    matches
                );

                var icon = null;
                if (option.type == 'road') {
                    icon = <FontAwesomeIcon icon={faRoad} size='xl' />
                } else if (option.type == 'metro') {
                    icon = <FontAwesomeIcon icon={faCity} size='xl' />
                } else if (option.type == 'district') {
                    icon = <Image alt="ED" src="/ed-icon.svg" width={30} height={30} />
                }
                 
                const liProps = { ...props, key: option.key }
                return (
                    <li {...liProps}>
                        <Grid container alignItems="center">
                            <Grid item sx={{ display: 'flex', width: 44 }}>
                                {icon}
                            </Grid>
                            <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                {parts.map((part, index) => (
                                    <Box
                                        key={index}
                                        component="span"
                                        sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                                    >
                                        {part.text}
                                    </Box>
                                ))}
                                <Typography variant="body2" color="text.secondary">
                                    {option.structured_formatting.secondary_text}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    )
}
