from sanic import Sanic, response
from sanic.exceptions import SanicException
import aiohttp
import loader

app = Sanic(__name__)
config = loader.load_json('config.json')


async def verify_discord_bearer_token(token):
    async with aiohttp.ClientSession() as session:
        async with session.get(url="https://discord.com/api/v9/" + "users/@me",
                               headers={"Authorization": "Bearer " + token}) as resp:
            data = await resp.json()
            return True if data.get("id") else False


def get_redirect_uri(platform):
    if platform == "home":
        return config["redirect_uris"]["home"]
    elif platform == "dash":
        return config["redirect_uris"]["dash"]
    else:
        return config["redirect_uris"]["default"]


@app.middleware("response")
async def cors(request, resp):
    resp.headers.update({"Access-Control-Allow-Origin": "*"})


@app.route("/")
async def index(request):
    return response.redirect(
        "https://discord.com/api/oauth2/authorize?client_id=762361400903204925&redirect_uri=http%3A%2F%2F192.168.1.224%3A8172%2Fcallback&response_type=code&scope=identify%20connections%20guilds"
    )


@app.route("/callback")
async def callback(request):
    code = request.args.get('code', None)
    if not code:
        raise SanicException(status_code=400)

    data = config["default_callback_data"]
    data["code"] = code
    data["redirect_uri"] = get_redirect_uri(request.args.get("continue", None))

    async with aiohttp.ClientSession() as session:
        async with session.post(url=config["discord_oauth_url"], data=data) as resp:
            data = await resp.json()
            print(data)
    bruh = "http://192.168.1.224:3000/callbacks/discord?code=" + data["access_token"]

    return response.redirect(bruh)


@app.route("/revoke")
async def revoke(request):
    code = request.args.get('token', None)

    if not code:
        raise SanicException(status_code=400)

    return response.json(await verify_discord_bearer_token(code))


@app.route("/verify")
async def verify(request):
    secret = request.args.get('secret', None)

    if not secret:
        raise SanicException(status_code=400)

    if secret != config['secret']:
        raise SanicException(status_code=403)

    return response.json({"message": "Hello World!"})


@app.route("/profile-data")
async def profile_data(request):
    code = request.args.get('code', None)
    if not code:
        raise SanicException(status_code=400)

    async with aiohttp.ClientSession() as session:
        async with session.get(url="https://discord.com/api/v9/" + "users/@me",
                               headers={"Authorization": "Bearer " + code}) as resp:
            data = await resp.json()


    if data.get("message", None):
        return response.json({"valid:": False})
    else:
        data["valid"] = True
        return response.json(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8172)
