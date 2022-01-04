import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
} from '@mui/material';
import LockOutIcon from '@mui/icons-material/LockOutlined';
import {executeJwtAuthenticationService} from '../../api/authenticateAPI';

function Login() {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: FormData = new FormData(event.currentTarget);
        const id: FormDataEntryValue | null = data.get('id');
        const password: FormDataEntryValue | null = data.get('password');

        if (id !== null && password !== null) {
            executeJwtAuthenticationService(id.toString(), password.toString()).then(value => {
                if (value) {
                    window.location.reload();
                } else {
                    alert('인증에 실패하였습니다.')
                }
            })
        } else {
            alert('Empty value!')
        }
    };

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{
                        m: 1,
                        backgroundColor: '#FF000070',
                        borderColor: '#FF000070',
                        color: '#FFFFFF',
                    }}
                >
                    <LockOutIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='id'
                        label='id'
                        name='id'
                        autoComplete='id'
                        autoFocus
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#FF000070',
                            borderColor: '#FF000070',
                            color: '#FFFFFF',
                            '&:hover': {
                                boxShadow: 'none',
                                backgroundColor: '#FF000070',
                                borderColor: '#FF000070',
                                color: '#FFFFFF',
                            },
                            '&:active': {
                                boxShadow: 'none',
                                backgroundColor: '#FF000090',
                                borderColor: '#FF000090',
                                color: '#FFFFFF',
                            },
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;