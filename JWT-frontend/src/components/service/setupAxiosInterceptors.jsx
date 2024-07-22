import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import UserService from './UserService';

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return authContext;
};

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(UserService.getAccessToken());

    useLayoutEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            req => {
                const token = UserService.getAccessToken();
                if (token) {
                    console.log('we are saving this access token:  ', token);
                    req.headers['Authorization'] = 'Bearer ' + token;
                }
                return req;
            },
            error => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axios.interceptors.response.use(
            response => {
                console.log('here is a successful response:  ', response);
                return response;
            },
            async error => {
                const originalConfig = error.config;
                console.log('the original error config is:  ', originalConfig);

                let accessToken = UserService.getAccessToken();
                console.log('the access token is:  ', accessToken);

                if (error.response) {
                    console.log('the error interceptor works. we got an error:  ', error.response);

                    if ((error.response.status === 401 || error.response.status === 403) && !originalConfig._retry) {
                        originalConfig._retry = true;
                        try {
                            const rs = await UserService.refreshToken();
                            console.log('we got a new access token:  ', rs);
                            const { token } = rs;

                            // Update the access token
                            accessToken = token;
                            UserService.accessToken = token;
                            setToken(token); // Update the token in the state

                            // Update the Authorization header in the original request
                            originalConfig.headers['Authorization'] = 'Bearer ' + token;

                            // Retry the original request with the new token
                            return axios(originalConfig);
                        } catch (_error) {
                            UserService.logout();
                            setToken(null); // Clear the token in the state
                            return Promise.reject(_error);
                        }
                    }
                }

                return Promise.reject(error);
            }
        );

        // Cleanup function to eject the interceptors
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;