import * as React from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

//border-[#276749] bg-[#5DAE86] hover:bg-[#2F855A]
const PrettoSlider = styled(Slider)({
  color: '#5DAE86',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

interface Props {
  defaultValue: number
  setValue: (value: number) => void
  disabled: boolean
}

export default function CustomizedSlider({defaultValue, setValue, disabled}: Props) {

  const marks = [
    {
      value: 0,
      label: 'Disagree',
    },
    {
      value: 100,
      label: 'Agree',
    },
  ];

  
  const handleChange = (event: Event, newValue: number | number[]) => {
    event.preventDefault();
    setValue(newValue as number);
  };

  return (
    <Box sx={{ width: 320 }}>
      <PrettoSlider
        disabled={disabled}
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={20}
        value={defaultValue}
        onChange={handleChange}
        marks={marks}
      />
    </Box>
  );
}