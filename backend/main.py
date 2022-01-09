from sanic import Sanic, response

app = Sanic(__name__)


@app.route('/')
async def index(request):
    return response.text('Hello World!')
