"""soosBot login. login.soosBot.com"""

from sanic import Sanic, response
from sanic.exceptions import SanicException
import jwt
import aiohttp
import loader
import uuid
from datetime import datetime

app = Sanic("soosBot login")
config = loader.load_json("./config.json")
app.sessions = {}


@app.route("/callback")
async def callback(request):
    code = request.args.get("code")
    continue_ = request.args.get("continue")
    redirect = None
    if not code:
        if request.args.get("error") == "access_denied":
            return response.html(f"<center><h1>Discord Login Failed</h1></center>",
                                 status=406)
        else:
            return response.html(f"<center><h1>No code was provided</h1><p>Your IP address : {request.ip}</p></center>",
                                 status=406)
    data = config["callback"]
    data["code"] = code
    data["redirect_uri"] = "http://192.168.1.224:3575/callback"
    if continue_:
        if continue_ == "home":
            data["redirect_uri"] = "http://192.168.1.224:3575/callback/?continue=home"
            redirect = "home"
        elif continue_ == "dash":
            data["redirect_uri"] = "http://192.168.1.224:3575/callback/?continue=dash"
            redirect = "dash"
        elif continue_ == "posts":
            data["redirect_uri"] = "http://192.168.1.224:3575/callback/?continue=posts"
            redirect = "posts"
        else:
            return response.html(f"<center><h1>Invalid continue parameter provided</h1>"
                                 f"<p>Your IP address : {request.ip}</p></center>"
                                 , status=400)

    async with aiohttp.ClientSession() as session:
        async with session.post(url=config["urls"]["callback"], data=data) as resp:
            data = await resp.json()
    if data.get("error"):
        return response.html(f"<center><h1>Invalid code provided</h1><p>Your IP address : {request.ip}</p></center>",
                             status=401)
    else:
        session_uuid = str(uuid.uuid4())
        json_web_token = jwt.encode({"session": session_uuid}, config["secret"], algorithm="HS256")
        app.sessions[session_uuid] = data["access_token"]
        resp = response.text(f"{json_web_token}")
        if redirect:
            if redirect == "home":
                resp = response.text(f"Redirecting to HomePage, jwt : {json_web_token}")
            elif redirect == "dash":
                resp = response.text(f"Redirecting to Dashboard, jwt : {json_web_token}")
            elif redirect == "posts":
                resp = response.text(f"Redirecting to soosBot Posts, jwt : {json_web_token}")
        else:
            resp = response.redirect("/")

        resp.cookies["login"] = json_web_token
        resp.cookies["login"]["httponly"] = True
        resp.cookies["login"]["samesite"] = "lax"
        resp.cookies["login"]["comment"] = "Login cookie that contains your login token. DO NOT SHARE"
        resp.cookies["login"]["expires"] = datetime(2030, 5, 17)
        return resp


@app.route("/verify")
async def verify(request):
    code = request.args.get("code")
    if not code:
        return response.html(f"<center><h1>No code was provided</h1><p>Your IP address : {request.ip}</p></center>",
                             status=406)
    try:
        session = jwt.decode(code, config["secret"], algorithms=["HS256"])["session"]
    except:
        return response.json(False)
    if app.sessions.get(session):
        return response.json(True)
    else:
        return response.json(False)


@app.route("/")
async def test(request):
    code = request.cookies.get("login")
    print(jwt)
    if not jwt:
        return response.redirect("https://discord.com/api/oauth2/authorize?client_id=762361400903204925&redirect_uri"
                                 "=http%3A%2F%2F192.168.1.224%3A3575%2Fcallback&response_type=code&scope=identify"
                                 "%20connections%20guilds")
    try:
        session = jwt.decode(code, config["secret"], algorithms=["HS256"])["session"]
    except:
        return response.redirect("https://discord.com/api/oauth2/authorize?client_id=762361400903204925&redirect_uri"
                                 "=http%3A%2F%2F192.168.1.224%3A3575%2Fcallback&response_type=code&scope=identify"
                                 "%20connections%20guilds")
    if not app.sessions.get(session):
        return response.redirect("https://discord.com/api/oauth2/authorize?client_id=762361400903204925&redirect_uri"
                                 "=http%3A%2F%2F192.168.1.224%3A3575%2Fcallback&response_type=code&scope=identify"
                                 "%20connections%20guilds")
    continue_ = request.args.get("continue")
    if continue_:
        if continue_ == "home":
            return response.text("Will redirect to home with jwt")
        elif continue_ == "posts":
            return response.text("Will redirect to posts with jwt")
        elif continue_ == "dash":
            return response.text("Will redirect to dash with jwt")
        else:
            return response.html(f"<center><h1>Invalid continue parameter provided</h1>"
                                 f"<p>Your IP address : {request.ip}</p></center>"
                                 , status=400)
    else:
        return response.text("HI! Your logged in and are not redirecting anywhere!")





@app.route("/favicon.ico")
async def favicon(request):
    raise SanicException("There is no favicon yet.", status_code=404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config["port"])
