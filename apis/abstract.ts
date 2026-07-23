// import axios from 'axios';
// import * as SecureStore from 'expo-secure-store';
// import { router } from 'expo-router';
// import { Alert } from 'react-native';

// import router from '@/router';
// import { showMessage } from '@/utils';
// import { APP_TOKEN_NAME } from '@/config/constants';
// import { i18n } from '@/utils/i18n';

// const apiUrl = import.meta.env.VITE_APP_API_URL;

// const Service = axios.create({
//     baseURL: apiUrl,
//     headers: {
//         Accept: 'application/json'
//     }
// });

// let isRefreshing = false;
// let failedQueue = [];
// let isInvalid = false;
// const processQueue = (error, token = null) => {
//     failedQueue.forEach((prom) => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     });

//     failedQueue = [];
// };

// Service.interceptors.request.use(
//     (config) => {
//         const accessToken = window.$cookies.get(APP_TOKEN_NAME);

//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error.response || error.message);
//     }
// );
// Service.interceptors.response.use(
//     (response) => {
//         isInvalid = false;
//         return response;
//     },
//     async (err) => {
//         let originalRequest = err.config;
//         if (err.response.status === 401 && err?.response?.data?.messages[0] === 'token.expired' && !originalRequest._retry) {
//             try {
//                 if (isRefreshing) {
//                     return new Promise(function (resolve, reject) {
//                         failedQueue.push({
//                             resolve,
//                             reject
//                         });
//                     })
//                         .then(async (token) => {
//                             originalRequest.headers['Authorization'] = `Bearer ${token}`;
//                             return axios(originalRequest);
//                         })
//                         .catch((err) => {
//                             return Promise.reject(err);
//                         });
//                 }
//                 originalRequest._retry = true;
//                 isRefreshing = true;
//                 const newToken = await refreshAccessToken();
//                 if (newToken) {
//                     isRefreshing = false;
//                     originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//                     processQueue(null, newToken);
//                     return axios(originalRequest);
//                 }
//             } catch (_error) {
//                 processQueue(_error, null);
//             }
//         }

//         if (err.response.status === 401 && err?.response?.data?.messages[0] === 'token.invalid') {
//             let isReturnCallBack = isInvalid;
//             isInvalid = true;
//             if (!isReturnCallBack) {
//                 return errorResponseCallback(err);
//             }
//         } else {
//             isInvalid = false;
//         }

//         if (isInvalid) {
//             return Promise.reject(err);
//         } else {
//             return errorResponseCallback(err);
//         }
//     }
// );

// let errorResponseCallback = (error) => {
//     switch (error?.response?.status) {
//         case 401:
//             switch (error?.response?.data?.messages[0]) {
//                 case 'token.expired':
//                     break;
//                 case 'auth.invalid':
//                     showMessage('error', i18n.global.t('text.error'), i18n.global.t(error?.response?.data?.messages[0]));
//                     break;
//                 case 'token.invalid':
//                 case 'auth.unauthorized':
//                 case 'token.blacklist':
//                 default:
//                     showMessage('error', i18n.global.t('text.error'), i18n.global.t(error?.response?.data?.messages[0]));
//                     sessionStorage.clear();
//                     localStorage.clear();
//                     window.$cookies.keys().forEach((cookie) => window.$cookies.remove(cookie));
//                     router.push('/login').catch(() => {});
//                     break;
//             }
//             break;
//         case 400:
//         case 404:
//         case 429:
//         case 403:
//         case 500:
//             if (error?.response?.data?.messages) {
//                 showMessage('error', i18n.global.t('text.error'), i18n.global.t(error?.response?.data?.messages[0]));
//             } else {
//                 showMessage('error', i18n.global.t('text.error'), i18n.global.t('common.system_error'));
//             }
//             break;
//         default:
//             break;
//     }
//     return Promise.reject(error);
// };

// async function getNewRefreshToken() {
//     return axios
//         .post(
//             `${import.meta.env.VITE_APP_API_URL}/auth/refresh`,
//             {},
//             {
//                 headers: {
//                     Authorization: `Bearer ${window.$cookies.get(APP_TOKEN_NAME)}`
//                 }
//             }
//         )
//         .catch(function (error) {
//             return errorResponseCallback(error);
//         });
// }

// const refreshAccessToken = async function () {
//     const newRefreshToken = await getNewRefreshToken();

//     const newToken = newRefreshToken?.data?.data?.access_token;
//     if (newToken) {
//         let d = new Date();
//         d.setUTCHours(23, 59, 59, 999);
//         window.$cookies.set(APP_TOKEN_NAME, newToken, d.toUTCString());
//         return newToken;
//     }
//     return null;
// };

// export default Service;
