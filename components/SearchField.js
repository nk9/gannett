// Based on the Google Maps example in MUI Autocomplete docs:
// https://mui.com/material-ui/react-autocomplete/#google-maps-place

import { useRef, useState } from 'react';

import { faCity, faHouseChimney, faLocationDot, faRoad } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { parseJsonStream, streamToIterable } from "json-stream-es";
import Image from 'next/image';

import { zoomLevel } from '@/constants';
import useMapState from '/stores/mapStore';

function DebounceInput(props) {
    const { handleDebounce, debounceTimeout, ...rest } = props;

    const timerRef = useRef();

    const handleChange = (event) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            await handleDebounce(event.target.value);
        }, debounceTimeout);
    };

    return <TextField {...rest} onChange={handleChange} />;
}

export default function SearchField({}) {
    const year = useMapState('year')
    const setMapView = useMapState('setMapView')
    const setMarkerCoords = useMapState('setMarkerCoords')
    const searchInputValue = useMapState('searchInputValue')
    const setSearchInputValue = useMapState('setSearchInputValue')
    const setSearchValue = useMapState('setSearchValue')

    const [options, setOptions] = useState([]);

    async function doSearch(query) {
        const response = await fetch('/api/search?' + new URLSearchParams({
            q: query,
            year: year
        }))

        const values = response.body
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(parseJsonStream(undefined, { multi: true }));

        let results = [];

        for await (const decodedValue of streamToIterable(values)) {
            console.log(decodedValue);

            // Merge new results
            results = [...results, ...decodedValue.result];
            setOptions(results); // Update the UI incrementally
        }
    };

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
                <DebounceInput {...params}
                    debounceTimeout={500}
                    handleDebounce={doSearch}
                    label={searchInputValue ? "" : "Search address, city, ED, or street"}
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
                    icon = <Image alt="ED" src="/ed-icon.svg" width={40} height={40} />
                } else if (option.type == 'address') {
                    icon = <FontAwesomeIcon icon={faHouseChimney} size='xl' />
                } else if (option.type == 'coordinate') {
                    icon = <FontAwesomeIcon icon={faLocationDot} size='xl' />
                }
                 
                const liProps = { ...props, key: option.key }
                return (
                    <li {...liProps}>
                        <Grid container columnSpacing={2} alignItems="center">
                            <Grid item sx={{ display: 'flex', width: "50px" }}>
                                {icon}
                            </Grid>
                            <Grid item sx={{ width: 'calc(100% - 50px)', height: '45px' }}>
                                <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {parts.map((part, index) => (
                                        <Box
                                            key={index}
                                            component="span"
                                            sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                                        >
                                            {part.text}
                                        </Box>
                                    ))}
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
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
