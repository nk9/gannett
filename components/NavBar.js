import { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from '/src/Link';

export default function NavBar() {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const router = useRouter()

    const drawerWidth = 240;
    const toggleDrawer = (isOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setMenuIsOpen(isOpen);
    };

    const makeItem = (name, icon) => {
        return (<ListItem key={name} disablePadding>
            <ListItemButton onClick={() => router.push(`/${name.replace(/ /g, '_').toLowerCase()}`)}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={name} />
            </ListItemButton>
        </ListItem>
        )
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{
                    justifyContent: "space-between"
                }}>
                    <Link href="/" style={{
                        textDecoration: 'none',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Image alt="Diving Gannett logo" src={"/logo-dive.svg"} width={36} height={36} sizes='100vw' />
                        <Typography variant="h6"
                            nowrap="true"
                            component="div"
                            sx={{
                                fontFamily: ["American Typewriter"],
                                fontWeight: 600,
                                fontSize: "22pt",
                                display: 'inline',
                            }}>
                            Gannett
                        </Typography>
                    </Link>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(!menuIsOpen)}
                    >
                        {menuIsOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={menuIsOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar /> {/*Push the list down below the toolbar, LOL*/}
                <Box
                    sx={{ overflow: 'auto' }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}

                >
                    <List>
                        {makeItem("Home", <HomeIcon />)}
                        {makeItem("FAQ", <HelpIcon />)}
                        {makeItem("About", <InfoIcon />)}
                        <Divider />
                        {makeItem("GitHub", <GitHubIcon />)}
                        {makeItem("Contact", <MailIcon />)}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
