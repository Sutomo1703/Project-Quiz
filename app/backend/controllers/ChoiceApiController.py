from flask_restful import Resource, marshal_with, reqparse, marshal
from flask_login import login_required
from app.backend.models.Question import QuestionModel
from app.backend.models.Choice import ChoiceModel, choice_fields

parser = reqparse.RequestParser()
parser.add_argument('question_id', type=int,
                    location='json', help='{error_msg}', required=True)
parser.add_argument('choice', type=str, location='json',
                    help='{error_msg}', required=True)
parser.add_argument('is_correct', type=bool,
                    location='json', help='{error_msg}', required=True)


class ChoiceCreateResource(Resource):
    @login_required
    def post(self):
        args = parser.parse_args()
        question_id = args['question_id']
        choice = args['choice']
        is_correct = args['is_correct']
        question = QuestionModel.query.\
            filter_by(id=question_id).first()
        if not question:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Pertanyaan kuis tidak ada!"
                }
            }, 404
        new_choice = ChoiceModel(choice, question, is_correct)
        new_choice.save()
        return {
            "payload": {
                "status_code": 201,
                "data": marshal(new_choice, choice_fields),
                "message": "Pilihan pertanyaan berhasil dicreate!"
            }
        }, 201


class ChoiceGetSingleResource(Resource):
    @login_required
    def get(self, choice_id):
        choice = ChoiceModel.query.\
            filter_by(id=choice_id).first()
        if not choice:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Pilihan pertanyaan kuis tidak ada!"
                }
            }, 404
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(choice, choice_fields),
                "message": "Daftar pilihan pertanyaan kuis yang tersedia!"
            }
        }, 200


class ChoiceGetAllResource(Resource):
    @login_required
    def get(self, question_id):
        question = QuestionModel.query.get(question_id)
        if question is None:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Pertanyaan kuis tidak ada!"
                }
            }, 404
        choices = ChoiceModel.query.\
            join(QuestionModel.choices).\
            filter(QuestionModel.id == question_id).\
            all()
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(choices, choice_fields),
                "message": "Daftar pilihan pertanyaan kuis yang tersedia!"
            }
        }, 200


class ChoiceUpdateResource(Resource):
    @login_required
    @marshal_with(choice_fields)
    def put(self, choice_id):
        args = parser.parse_args()
        new_choice = args['choice']
        new_is_correct = args['is_correct']
        choice = ChoiceModel.query.\
            filter_by(id=choice_id).\
            first_or_404(description="Resource not found")
        choice.update(new_choice, new_is_correct)
        return choice, 200

    @login_required
    def delete(self, choice_id):
        choice = ChoiceModel.query.\
            filter_by(id=choice_id).first()
        if not choice:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Pilihan pertanyaan kuis tidak ada!"
                }
            }, 404
        choice.delete()
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(choice, choice_fields),
                "message": "Pilihan pertanyaan berhasil dihapus!"
            }
        }, 200
