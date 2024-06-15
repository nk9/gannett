import { useTransition } from 'react';

import { useRouter } from "next/navigation";

import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/system';
import styles from "./YearsPicker.module.scss";

export default function YearsPicker({ allYears, year, setYear }) {
    const theme = useTheme();
    const router = useRouter();
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

    const desktop = useMediaQuery('(min-width:630px)');

    var ui;
    if (desktop) {
        let yearTabs = Object.entries(allYears).map(
            ([y, d]) => <Tab key={y} value={y} disabled={!d}>{y}</Tab>
        );

        ui = (
            <Box className={styles["years-tabs-container"]}>
                <Tabs className={styles["years"]} value={(year || "")} onChange={handleChangeTab}>
                    <TabsList className="shadow">
                        {yearTabs}
                    </TabsList>
                </Tabs>
            </Box>
        );
    } else {
        let yearItems = Object.entries(allYears).map(
            ([y, d]) => <MenuItem key={y} value={y} disabled={!d}>{y}</MenuItem>
        );

        ui = (
            <Box className={styles["years-select-container"]} sx={{
                display: "flex",
                alignItems: "center"
            }}>
                <Select
                    value={year}
                    onChange={handleChangeSelect}
                    title="Census year"
                    className="shadow"
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        height: "36px",
                        fontWeight: 500,
                        ".MuiSelect-icon": {
                            color: "white"
                        },
                    }}>
                    {yearItems}
                </Select>
            </Box>
        );
    }

    return ui;
}

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

const Tab = styled(BaseTab)(
    ({ theme }) => `
  font-family: 'Aleo', sans-serif;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  background-color: transparent;
  width: 100%;
  padding: 6px 12px 4px;
  margin: 5px 6px;
  border: none;
  border-radius: 6px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${theme.palette.primary.light};

      &.${tabClasses.disabled} {
        background-color: transparent;
        cursor: not-allowed;
      }
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${theme.palette.primary.light};
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${theme.palette.primary.main};
  }

  &.${tabClasses.disabled} {
    color: rgba(255, 255, 255, 0.6);
  }
`);

const TabsList = styled(BaseTabsList)(
    ({ theme }) => `
  min-width: 400px;
  max-width: 600px;
  background-color: ${theme.palette.primary.main};
  border-radius: 6px;
  // margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  `,
);
