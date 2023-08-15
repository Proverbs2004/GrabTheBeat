import React, { Component, useEffect } from "react";
import { getRefreshToken } from "../storage/Cookie";
import axios from "axios";

/**
 * - Auth -
 * 인증 페이지
 * 
 * @param {Component} SpecificComponent : 감싸질 컴포넌트
 * @param {Boolean} option : 출입 가능 여부
 *                      null: 아무나 출입이 가능한 페이지
 *                      true: 로그인한 유저만 출입이 가능한 페이지
 *                      false: 로그인한 유저는 출입 불가능한 페이지
 * @param {Boolean} adminRoute : admin 유저만 출입 가능 여부
 *                      null: 모두가 출입 가능한 페이지
 *                      true: admin 유저만 들어갈 수 있는 페이지
 * @returns 감싼 컴포넌트
 */
function Auth(SpecificComponent, option, adminRoute = null) {

    // 감쌀 컴포넌트 생성
    function AuthenticationCheck(props) {
        // 백엔드에게 요청(Request)하여 유저의 현재 상태를 가져오기 위해 useEffect 사용
        useEffect(() => {
            let access_token = localStorage.getItem('access_token');

            if (access_token) {
            axios.post('http://localhost:8080/api/auth', {
                accessToken: access_token
            })
                .then(response => {
                    access_token = response.data.accessToken;
                    localStorage.setItem('access_token', access_token);
                    return;
                })
                .catch(error => {
                    const refresh_token = getRefreshToken();
                    if (error.response.status === 401 && refresh_token) {
                        axios.post('http://localhost:8080/api/token', {
                            refreshToken: refresh_token
                        })
                            .then(result => {
                                localStorage.setItem('access_token', result.data.accessToken);
                                return;
                            })
                    }
                });
            }

                // const refresh_token = getRefreshToken();
                // if (response.status === 401 && refresh_token) {
                //     axios.post('http://localhost:8080/api/token', {
                //         refreshToken: refresh_token
                //     })
                //         .then(result => { // 재발급이 성공하면 로컬 스토리지값을 새로운 액세스 토큰으로 교체
                //             localStorage.setItem('access_token', result.data.accessToken);
                //             return;
                //         })
                // }
        }, []);

        return <SpecificComponent />;
    }

    return AuthenticationCheck;
}

export default Auth;