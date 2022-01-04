import axios from 'axios';

export async function executeJwtAuthenticationService(username: string, password: string) {
    let status: boolean = false;
    await axios.post(`/is/security/authenticate`, {
        'username': username,
        'password': password
    }).then(function (response) {
        console.log(response.data);
        if (response.status === 200) {
            let accessToken: string = response.data.accessToken;
            let refreshToken: string = response.data.refreshToken;
            window.sessionStorage.setItem('accessToken', accessToken);
            window.sessionStorage.setItem('refreshToken', refreshToken);

            console.log(accessToken);
            console.log(refreshToken);

            status = true;
        }
    }).catch(function (error) {
        if (error.response) {
            if (error.response.status === 403) {
                status = false;
            }
        }
    });
    return status;
}

export function isUserLoggedIn() {
    const accessToken: string | null = window.sessionStorage.getItem('accessToken');
    return accessToken != null;
}