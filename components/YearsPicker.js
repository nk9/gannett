import { useState, useTransition } from 'react';

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Tabs } from '@mui/base/Tabs';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import styles from "./YearsPicker.module.scss";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function YearsPicker({ allYears, year, setYear }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition(); 

    const handleChangeTab = (event, tab) => {
        setYear(tab);

        startTransition(() => {
            router.replace({ query: { ...router.query, year: tab } });
        });
    };

    const handleChangeSelect = (event) => {
        let newYear = event.target.value;
        setYear(newYear);

        startTransition(() => {
            router.replace({ query: { ...router.query, year: newYear } });
        });
    };

    const theme = useTheme();
    const desktop = useMediaQuery('(min-width:630px)');

    var ui;
    if (desktop) {
        let yearTabs = Object.entries(allYears).map(
            ([y, d]) => <Tab key={y} value={y} disabled={!d}>{y}</Tab>
        );

        ui = (
            <div className={styles["years-tabs-container"]}>
                <Tabs className={styles["years"]} value={(year || "")} onChange={handleChangeTab}>
                    <TabsList>
                        {yearTabs}
                    </TabsList>
                </Tabs>
            </div>
        );
    } else {
        let yearItems = Object.entries(allYears).map(
            ([y, d]) => <MenuItem key={y} value={y} disabled={!d}>{y}</MenuItem>
        );

        ui = (
            <div className={styles["years-select-container"]}>
                <FormControl size="small" title="Census year">
                    <Select value={year} onChange={handleChangeSelect}>
                        {yearItems}
                    </Select>
                </FormControl>
            </div>
        );
    }

    return ui;
}

const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#80BFFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
    800: '#004C99',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Tab = styled(BaseTab)`
  font-family: 'IBM Plex Sans', sans-serif;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  background-color: transparent;
  width: 100%;
  padding: 10px 12px;
  margin: 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};

      &.${tabClasses.disabled} {
        background-color: transparent;
        cursor: not-allowed;
      }
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[200]};
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${blue[600]};
  }

  &.${tabClasses.disabled} {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const TabsList = styled(BaseTabsList)(
    ({ theme }) => `
  min-width: 400px;
  max-width: 600px;
  background-color: ${blue[500]};
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);
