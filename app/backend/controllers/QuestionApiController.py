from flask_restful import Resource, reqparse, marshal
from flask_login import login_required
from app.backend.models.Quiz import QuizModel
from app.backend.models.Question import QuestionModel, question_fields


parser = reqparse.RequestParser()
parser.add_argument('quiz_id', type=int, location='json',
                    help='{error_msg}', required=True)
parser.add_argument('question', type=str, location='json',
                    help='{error_msg}', required=True)


class QuestionCreateResource(Resource):
    @login_required
    def post(self):
        args = parser.parse_args()
        quiz_id = args['quiz_id']
        question = args['question']
        quiz = QuizModel.query.\
            filter_by(id=quiz_id).\
            first()
        if not quiz:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Kuis tidak ada!"
                }
            }, 404
        new_question = QuestionModel(question, quiz)
        new_question.save()
        return {
            "payload": {
                "status_code": 201,
                "data": marshal(new_question, question_fields),
                "message": "Kuis berhasil dicreate!"
            }
        }, 201


class QuestionGetAllResource(Resource):
    @login_required
    def get(self, quiz_id):
        quiz = QuizModel.query.get(quiz_id)
        if quiz is None:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Kuis Tidak Ada!"
                }
            }, 404
        questions = QuestionModel.query.\
            join(QuizModel.questions).\
            filter(QuizModel.id == quiz_id).\
            all()
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(questions, question_fields),
                "message": "Daftar pertanyaan kuis yang tersedia!"
            }
        }, 200


class QuestionGetSingleResource(Resource):
    @login_required
    def get(self, question_id):
        questions = QuestionModel.query.\
            filter_by(id=question_id).first()
        if not questions:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Pertanyaan kuis tidak ada!"
                }
            }, 404
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(questions, question_fields),
                "message": "Daftar pertanyaan kuis yang tersedia!"
            }
        }, 200


class QuestionUpdateResource(Resource):
    @login_required
    def put(self, question_id):
        args = parser.parse_args()
        new_question = args['question']
        question = QuestionModel.query.\
            filter_by(id=question_id).\
            first_or_404(description="Resource not found")
        if not question:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Pertanyaan kuis tidak ada!"
                }
            }, 404
        question.update(new_question)
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(question, question_fields),
                "message": "Pertanyaan kuis berhasil diubah!"
            }
        }, 200

    @login_required
    def delete(self, question_id):
        question = QuestionModel.query.\
            filter_by(id=question_id).first()
        if not question:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Pertanyaan kuis tidak ada!"
                }
            }, 404
        question.delete()
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(question, question_fields),
                "message": "Pertanyaan kuis berhasil dihapus!"
            }
        }, 200
