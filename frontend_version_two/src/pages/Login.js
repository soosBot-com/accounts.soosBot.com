import "../style/Login.css"
import PageAnimation from "../components/PageAnimation";
function Login() {
    return (
        <PageAnimation>
            <a href="https://discord.com/api/oauth2/authorize?client_id=762361400903204925&redirect_uri=http%3A%2F%2F192.168.1.224%3A8172%2Fcallback&response_type=code&scope=identify%20connections%20guilds">Login</a>
        </PageAnimation>
    );
}

export default Login;