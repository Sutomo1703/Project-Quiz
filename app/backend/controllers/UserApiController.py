from flask import session
from flask_restful import Resource, reqparse, marshal
from werkzeug.security import generate_password_hash, check_password_hash
from app.backend.models.User import UserModel, user_fields
from flask_login import current_user, login_user, login_required, logout_user

login_parser = reqparse.RequestParser()
login_parser.add_argument('nrp', type=str, location='json',
                          help='{error_msg}', required=True)
login_parser.add_argument('password', type=str, location='json',
                          help='{error_msg}', required=True)

register_parser = reqparse.RequestParser()
register_parser.add_argument('nrp', type=str, location='json',
                             help='{error_msg}', required=True)
register_parser.add_argument('nama', type=str, location='json',
                             help='{error_msg}', required=True)
register_parser.add_argument('password', type=str, location='json',
                             help='{error_msg}', required=True)


class UserCreateRescource(Resource):
    def post(self):
        args = register_parser.parse_args()
        nrp = args['nrp']
        nama = args['nama']
        password = args['password']
        user = UserModel.query.filter_by(nrp=nrp).first()
        if user:
            return {
                "payload": {
                    "status_code": 400,
                    "message": f"User {nrp} sudah terdaftar!"
                }
            }, 400
        new_user = UserModel(nrp, nama, generate_password_hash(password))
        new_user.save()
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(new_user, user_fields),
                "message": "Berhasil Create User!"
            }
        }, 200


class UserLoginResource(Resource):
    def post(self):
        args = login_parser.parse_args()
        nrp = args['nrp']
        password = args['password']
        user = UserModel.query.\
            filter_by(nrp=nrp).\
            first()
        if not user or not check_password_hash(user.password, password):
            return {
                "payload": {
                    "status_code": 401,
                    "message": "Nrp atau Password Salah!"
                }
            }, 401
        login_user(user, remember=True)
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(user, user_fields),
                "message": "Berhasil Login!"
            }
        }, 200


class UserLogoutResource(Resource):
    @login_required
    def delete(self):
        user = marshal(current_user, user_fields)
        session.clear()
        logout_user()
        return {
            "payload": {
                "status_code": 200,
                "data": user,
                "message": "Berhasil logout!"
            }
        }, 200
