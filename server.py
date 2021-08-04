"""soosBot login. login.soosBot.com"""

from sanic import Sanic, response
from sanic.exceptions import SanicException
import jwt
import aiohttp
import loader
import uuid

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
        json_web_token = jwt.encode({"session": str(uuid.uuid4())}, config["secret"], algorithm="HS256")
        app.sessions[json_web_token] = data["access_token"]
        if redirect:
            return response.text(f"Redirecting to {redirect} with jwt : {json_web_token}")
        else:
            return response.text(f"Redirecting to Login with jwt : {json_web_token}")


@app.route("/favicon.ico")
async def favicon(request):
    raise SanicException("There is no favicon yet.", status_code=404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config["port"])
