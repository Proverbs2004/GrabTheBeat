import { useNavigate } from "react-router-dom";

export default function LoginWaiting() {
    const navigate = useNavigate();

    const token = searchParam('token')

    window.history.replaceState({}, null, window.location.pathname);

    if (token) {
        localStorage.setItem("access_token", token)
    }

    function searchParam(key) {
        return new URLSearchParams(document.location.search).get(key);
    }

    setTimeout(() => navigate('/'), 3000);

    return (
        <div>
            <span>로그인 중...</span>
        </div>
    );
}