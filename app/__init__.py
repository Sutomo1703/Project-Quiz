from flask import Flask, request, abort, redirect, session, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_login import LoginManager
from flask_session import Session
from http import HTTPStatus

# create object flask-restful
api = Api()

# create object SQLAlchemy
db = SQLAlchemy()

# create object flask-migrate
migrate = Migrate()

login_manager = LoginManager()

server_session = Session()


def create_app():
    app = Flask(__name__, template_folder="frontend/templates",
                static_folder="frontend/static")
    CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5000"}},
         supports_credentials=True)
    app.config.from_object('config')

    # Register api_blueprint into blueprint
    from app.backend.routes.api import api_bp as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    # Register main_blueprint into blueprint
    from app.backend.routes.main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    # Register auth_blueprint into blueprint
    from app.backend.routes.auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from app.backend.routes.main import page_not_found, bad_server, method_not_allowed, user_unauthorized
    app.register_error_handler(404, page_not_found)
    app.register_error_handler(401, user_unauthorized)
    app.register_error_handler(405, method_not_allowed)
    app.register_error_handler(500, bad_server)

    # Lazy init db SQLAlchemy
    db.init_app(app)

    # Lazy init Flask-Migrate
    migrate.init_app(app, db)

    # Create tables
    from app.backend.models.Quiz import QuizModel
    from app.backend.models.Question import QuestionModel
    from app.backend.models.Choice import ChoiceModel
    from app.backend.models.Record_Quiz import RecordQuizModel
    from app.backend.models.Record_Answer import RecordAnswerModel
    from app.backend.models.Quiz_instance import QuizInstance
    from app.backend.models.User import UserModel

    server_session.init_app(app)

    login_manager.session_protection = None
    login_manager.login_view = 'auth_bp.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return UserModel.query.get(user_id)

    @login_manager.unauthorized_handler
    def unauthorized():
        if request.blueprint == 'api_bp':
            abort(HTTPStatus.UNAUTHORIZED)
        return redirect(url_for('auth_bp.login', next=request.full_path))
    # create_db(app)

    return app


def create_db(app):
    db.create_all(app=app)
    print("Database created!!")
