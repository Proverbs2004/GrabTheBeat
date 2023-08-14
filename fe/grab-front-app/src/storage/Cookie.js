import { Cookies } from 'react-cookie';

const cookies = new Cookies();

// // Refresh Token을 쿠키로 저장
// export const setRefreshToken = (refreshToken) => {
//     const today = new Date();
//     const expireData = today.setDate(today.getDate() + 7);

//     return cookies.set('refresh_token', refreshToken, {
//         sameSite: 'strict',
//         path: "/",
//         expires: new Date(expireDate)
//     });
// }

// 쿠키로부터 Refresh Token 가져오기
export const getRefreshToken = () => {
    return cookies.get('refresh_token');
}

// 쿠키에 있는 Refresh Token 삭제
// 로그아웃 시, 사용
export const removeRefreshToken = () => {
    return cookies.remove('refresh_token', { sameSite: 'strict', path: "/" });
}

