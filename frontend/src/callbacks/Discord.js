import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Discord() {
    const navigate = useNavigate();

    useEffect(() => {
        // Get "code" from the URL, append it to localStorage variable "accounts" and redirect to /
        let code = window.location.search.split("=")[1];
        let accounts = JSON.parse(localStorage.getItem("accounts"));
        if (accounts === null) {
            accounts = [];
        }
        // Check if the code is already in the array
        if (accounts.indexOf(code) === -1) {
            accounts.push(code);
            localStorage.setItem("accounts", JSON.stringify(accounts));
        }
        navigate("/");
    }, []);

    return (
        "hmmm"
    )
}

export default Discord;