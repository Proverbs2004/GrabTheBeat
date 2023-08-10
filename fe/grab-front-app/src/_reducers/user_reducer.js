import { LOGIN_USER, REGISTER_USER, AUTH_USER } from '../_actions/types';

const userReducer = (state = {}, action) => {
    switch (action.type) {
        // Case: LOGIN_USER
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
        // Case: REGISTER_USER
        case REGISTER_USER:
            return { ...state, register: action.payload }
        // Case: AUTH_USER
        case AUTH_USER:
            // userData에 해당하는 action의 payload에 삽입
            return { ...state, userData: action.payload };
            // 서버의 auth 부분에서 모든 것을 처리한 후,
            // User 정보를 client에게 전해주고 있기 때문에
            // action.payload에 모든 user의 정보를 포함
        default:
            return state;
    }
};

export default userReducer;