// Based on the Google Maps example in MUI Autocomplete docs:
// https://mui.com/material-ui/react-autocomplete/#google-maps-place

import { useState, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity, faRoad } from '@fortawesome/free-solid-svg-icons';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';

import useMapStore from '/stores/mapStore';

export default function SearchField({}) {
    const year = useMapStore((s) => s.year)

    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
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

            if (inputValue === '') {
                setOptions(value ? [value] : []);
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
            doSearch({ input: inputValue }, (results) => {
                if (active) {
                    setOptions(results)
                }
            })
            console.log("call fetch API route")

            var results = await fetch('/api/search?' + new URLSearchParams({
                q: inputValue,
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
    }, [value, inputValue]);

    return (
        <Autocomplete
            id="gannett-search"
            sx={{ width: 300 }}
            style={{ position: "relative", top: 15, left: 15, backgroundColor: "white" }}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            autoComplete
            freeSolo
            includeInputInList
            filterSelectedOptions
            options={options}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            noOptionsText="No results"
            renderInput={(params) => (
                <TextField {...params}
                    label={inputValue ? "" : "Search"}
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
                if (option.type == 'metro') {
                    icon = faCity
                } else if (option.type == 'road') {
                    icon = faRoad
                }
                 
                console.log('"""props', props)
                const liProps = { ...props, key: option.key }
                return (
                    <li {...liProps}>
                        <Grid container alignItems="center">
                            <Grid item sx={{ display: 'flex', width: 44 }}>
                                <FontAwesomeIcon icon={icon} />
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
