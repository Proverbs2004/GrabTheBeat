import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from './Auth';

// Auth의 TokenReducer를 사용하기 위한 함수
export default configureStore({
    reducer: {
        authToken: tokenReducer,
    }
})