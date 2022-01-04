import React from 'react';
import {Box, createTheme, CssBaseline, ThemeProvider} from '@mui/material';

import Header from '../Header/Header';

const appTheme = createTheme({
    palette: {
        primary: {
            main: '#FF000070',
        },
        secondary: {
            main: '#FFFFFF',
        }
    },
});

function MainBox(props: any) {
    return (
        <ThemeProvider theme={appTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Header />
                <Box
                    component='main'
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto'
                    }}
                >
                    {props.children}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default MainBox;