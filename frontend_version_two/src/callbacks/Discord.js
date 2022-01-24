import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react';

function Discord() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useRef(useNavigate());


    useEffect(() => {
        let code = searchParams.get("code");
        let accounts = JSON.parse(localStorage.getItem("accounts"));
        if (code == null) {
            navigate.current("/login");
            return;
        }

        if (accounts == null) {
            accounts = [];
        }

        if (accounts.includes(code)) {
            navigate.current("/");
            return;
        }

        accounts.push(code);
        localStorage.setItem("accounts", JSON.stringify(accounts));
        navigate.current("/");


    }, [searchParams])

    return null;

}

export default Discord;