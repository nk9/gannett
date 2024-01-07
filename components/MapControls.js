import React, { forwardRef } from 'react';

import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import { styled } from "@mui/material/styles";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoad } from '@fortawesome/free-solid-svg-icons';

import useMapState from '/stores/mapStore';


const ToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: '#eee'
  },
  '&.Mui-selected': {
    color: 'white',
    backgroundColor: theme.palette.primary.main,

    '&:hover': {
      backgroundColor: '#389BFF'
    }
  },
  '&.MuiToggleButton-root:not(:first-of-type)': {
    // Show the hairline between the buttons
    marginTop: 0
  }
}));


export default function MapControls({}) {
  const mapOptions = useMapState('mapOptions')
  const setMapOptions = useMapState('setMapOptions')
  
  const handleClick = (event, newOptions) => {
    setMapOptions(newOptions);
  };

  return (
    <ToggleButtonGroup 
      orientation="vertical"
      value={mapOptions}
      onChange={handleClick}
    >
      <Tooltip title="Toggle satellite basemap" placement="left" arrow value="showSatellite">
        <ToggleButton
          value="showSatellite"
          aria-label="show satellite basemap">
          <SatelliteAltIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Toggle roads" placement="left" arrow value="showRoads">
        <ToggleButton
          value="showRoads"
          aria-label="show roads"
        >
          <FontAwesomeIcon icon={faRoad} size='xl' />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  )
}
