from flask import Flask
from flask_cors import CORS

from backend.api.api_root import root_bp          # home y /user/login
from backend.api.api_auth import auth_bp          # /auth/google/upsert (nuevo)

app = Flask(__name__)
CORS(app)

# registra rutas
app.register_blueprint(root_bp)               # /
app.register_blueprint(auth_bp, url_prefix="/auth")  # /auth/...

if __name__ == "__main__":
    app.run(debug=True, port=5000)