import { createSlice } from '@reduxjs/toolkit';

export const TOKEN_TIME_OUT = 600 * 1000;

// createSlice를 이용하여
// 간단하게 redux 액션 생성자와 전체 슬라이스에 대한
// reducer를 선언하여 사용
export const tokenSlice = createSlice({
    name: 'authToken',
    initialState: {
        authenticated: false,   // 현재 로그인 여부를 간단히 확인하기 위해 선언
        accessToken: null,      // Access Token 저장
        expireTime: null        // Access Token의 만료 시간
    },
    reducers: {
        // Access Token 정보를 저장
        SET_TOKEN: (state, action) => {
            state.authenticated = true;
            state.accessToken = action.payload;
            state.expireTime = new Date().getTime() + TOKEN_TIME_OUT;
        },
        // 값을 모두 초기화함으로써 Access Token에 대한 정보를 삭제
        DELETE_TOKEN: (state) => {
            state.authenticated = false;
            state.accessToken = null;
            state.expireTime = null;
        },
    }
});

export const { SET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;

export default tokenSlice.reducer;