import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react';

function Discord() {
    const navigate = useRef(useNavigate());


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code')


        let accounts = JSON.parse(localStorage.getItem("accounts"));

        if (accounts == null) {
            accounts = [];
        }

        if (code == null) {
            console.log("No code found");
            navigate.current("/login");
            return;
        }

        if (accounts.includes(code)) {
            console.log(`Account ${code} already exists`);
            navigate.current("/");
            return;
        }

        accounts.push(code);
        localStorage.setItem("accounts", JSON.stringify(accounts));
        navigate.current("/");


    }, [])

    return null;

}

export default Discord;