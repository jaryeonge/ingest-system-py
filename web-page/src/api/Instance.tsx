import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

const TISAxios: AxiosInstance = axios.create();

TISAxios.interceptors.request.use(
    async config => {
        const accessToken: string | null = window.sessionStorage.getItem('accessToken');
        config.headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        return config
    },
    error => {
        return Promise.reject(error);
    }
)

TISAxios.interceptors.response.use(
    (response) => {
    return response;
},
    async function (error) {
    if (error.response.status === 401) {
        const originalRequest: AxiosRequestConfig = error.config;

        await axios.post(`/is/security/reissue`, {
            'accessToken': window.sessionStorage.getItem('accessToken'),
            'refreshToken': window.sessionStorage.getItem('refreshToken')
        }).then(function (response) {
            if (response.data !== undefined) {
                let accessToken: string = response.data.accessToken;
                let refreshToken: string = response.data.refreshToken;

                window.sessionStorage.removeItem('accessToken')
                window.sessionStorage.removeItem('refreshToken')
                window.sessionStorage.setItem('accessToken', accessToken);
                window.sessionStorage.setItem('refreshToken', refreshToken);
                window.location.reload();
            }
            else {
                return Promise.reject("waiting...");
            }
        }).catch(function (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    window.sessionStorage.removeItem('accessToken')
                    window.sessionStorage.removeItem('refreshToken')
                    window.location.reload();
                    return Promise.reject("로그인 시간이 만료되었습니다. 재 로그인 해주세요.");
                } else {
                    return Promise.reject("Internal Error");
                }
            } else {
                return Promise.reject("Internal Error");
            }
        });

        if (originalRequest.url != null && originalRequest.data !== undefined) {
            await TISAxios.post(originalRequest.url, originalRequest.data
            ).then(function (response) {
                return response;
            }).catch(function (error) {
                if (error.response.data) {
                    return Promise.reject(error.data.toString);
                } else {
                    return Promise.reject("Internal Error");
                }
            });
        } else {
            return Promise.reject("Internal Error");
        }
    } else if (error.response.status === 403) {
        window.sessionStorage.removeItem('accessToken')
        window.sessionStorage.removeItem('refreshToken')
        window.location.reload();
        return Promise.reject("로그인 시간이 만료되었습니다. 재 로그인 해주세요.");
    } else if (error.response.status === 400) {
        return Promise.reject(error.response.data.toString());
    } else {
        return Promise.reject("Internal Error");
    }
})

export default TISAxios;