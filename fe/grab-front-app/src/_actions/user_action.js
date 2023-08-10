import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
} from './types';

// // 사용자 로그인 Action 함수
// export function loginUser(dataToSubmit) {
//     // axios를 통해 데이터를 담아 요청(Request)
//     const request = axios.post('/api/users/login', dataToSubmit)
//             .then(response => response.data);

//     return {
//         type: LOGIN_USER,
//         payload: request
//     }
// }

// // 사용자 회원가입 Action 함수
// export function registerUser(dataToSubmit) {
//     // axios를 통해 데이터를 담아 요청(Request)
//     const request = axios.post('/api/users/register', dataToSubmit)
//             .then(response => response.data);

//     return {
//         type: REGISTER_USER,
//         payload: request
//     }
// }

// 사용자 인증 Action 함수
export function auth() {
    // axios를 통해 요청(Request)
    const request = axios.get("/api/token").then((response) => response.data);

    // 서버에서 받은 data를 payload에 담아 reducer로 반환
    return {
        type: AUTH_USER,
        payload: request,
    };
}