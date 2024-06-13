import { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const router = useRouter()

    const toggleDrawer = (isOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setMenuIsOpen(isOpen);
    };
    const drawerWidth = 240;

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
                        <ListItem key="home" disablePadding>
                            <ListItemButton onClick={() => router.push('/')}>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key="FAQ" disablePadding>
                            <ListItemButton onClick={() => router.push('/faq')}>
                                <ListItemIcon>
                                    <HelpIcon />
                                </ListItemIcon>
                                <ListItemText primary="FAQ" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key="about" disablePadding>
                            <ListItemButton onClick={() => router.push('/about')}>
                                <ListItemIcon>
                                    <InfoIcon />
                                </ListItemIcon>
                                <ListItemText primary="About" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem key="contact" disablePadding>
                            <ListItemButton onClick={() => router.push('/contact')}>
                                <ListItemIcon>
                                    <MailIcon />
                                </ListItemIcon>
                                <ListItemText primary="Contact" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
