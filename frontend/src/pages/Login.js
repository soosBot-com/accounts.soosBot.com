import { motion } from "framer-motion";
import PageAnimator from "../components/PageAnimator";

function Login() {
    return (
        <>
            <PageAnimator>
                <div className="content">
                <div className="login">
                    <div className="login-header">
                        <h1>Login</h1>
                    </div>
                    <div className="login_methods">
                        <div className="discord">
                            <button onClick={DiscordLogin}>Login with discord</button>
                        </div>
                        <div className="google"></div>
                        <div className="apple"></div>
                    </div>
                </div>
                </div>
            </PageAnimator>
            <div className="soosBot">
                <span>soosBot</span>
            </div>
        </>
    );
}

function DiscordLogin() {
    window.location.href = "https://discord.com/api/oauth2/authorize?client_id=762361400903204925&redirect_uri=http%3A%2F%2F192.168.1.224%3A8172%2Fcallback&response_type=code&scope=identify%20connections%20guilds"
}

export default Login;