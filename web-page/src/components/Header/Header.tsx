import React from 'react';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import {styled} from '@mui/material/styles';
import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ConstructionIcon from '@mui/icons-material/Construction';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {Link} from 'react-router-dom';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const drawerWidth: number = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(7),
                },
            }),
        },
    }),
);

function Header() {
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    }

    const handleLogout = () => {
        window.sessionStorage.removeItem('accessToken')
        window.sessionStorage.removeItem('refreshToken')
        window.location.reload();
    }

    return (
        <div>
            <AppBar position='absolute' open={open}>
                <Toolbar
                    sx={{
                        pr: '24px',
                    }}
                >
                    <IconButton
                        edge='start'
                        color='inherit'
                        aria-label='open drawer'
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component='h1'
                        variant='h6'
                        color='inherit'
                        noWrap
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        Ingest System
                    </Typography>
                    <IconButton
                        onClick={handleLogout}
                        color="inherit"
                    >
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant='permanent' open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton
                        onClick={toggleDrawer}
                        sx={{
                            ...(!open && { display: 'none' }),
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>
                    <ListItem button component={Link} to='/'>
                        <ListItemIcon>
                            <ConstructionIcon />
                        </ListItemIcon>
                        <ListItemText primary='Configuration' />
                    </ListItem>
                    <ListItem button component={Link} to='/process'>
                        <ListItemIcon>
                            <PlayCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary='Process' />
                    </ListItem>
                    <ListItem button component={Link} to='/since'>
                        <ListItemIcon>
                            <BookmarkBorderIcon />
                        </ListItemIcon>
                        <ListItemText primary='Since' />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}

export default Header;