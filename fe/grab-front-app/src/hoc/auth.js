import React, { Component, useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

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
        const dispatch = useDispatch();
        const navigate = useNavigate();

        // 백엔드에게 요청(Request)하여 유저의 현재 상태를 가져오기 위해 useEffect 사용
        useEffect(() => {
            dispatch(auth()).then((response) => {
                console.log(response);

                // 로그인 하지 않은 상태
                if (!response.payload.isAuth) {
                    // option이 true인 페이지를 접근하려고 할 때,
                    // navigate를 통해서 "/login"으로 이동시킴.
                    if (option) {
                        navigate("/login");
                    }

                // 로그인 한 상태
                } else {
                    // admin이 아닌 유저가 adminPage에 접근하려고 할 때,
                    // adminRoute가 true인 페이지를 접근하려고 하는데 해당 유저는 Admin이 아닐 때,
                    // navigate를 통해서 "/login"으로 이동시킴.
                    if (adminRoute && !response.payload.isAdmin) {
                        navigate("/");

                    // 로그인한 유저가 출입 불가능한 페이지에 접근하려고 할 때,
                    } else {
                        if (!option) {
                            navigate("/");
                        }
                    }
                }
            })
        }, []);

        return <SpecificComponent />;
    }

    return AuthenticationCheck;
}

export default Auth;