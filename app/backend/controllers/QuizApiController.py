from flask_login import login_required
from flask_restful import Resource, marshal, marshal_with, reqparse
from app.backend.models.Quiz import QuizModel, quiz_fields

parser = reqparse.RequestParser()
parser.add_argument('quiz_name', type=str, location='json',
                    help='{error_msg}', required=True)

page_parse = reqparse.RequestParser()
page_parse.add_argument('page', type=int, location='args', required=False)


class QuizResource(Resource):
    @login_required
    def get(self, quiz_id):
        quiz = QuizModel.query.filter_by(id=quiz_id).first()
        if not quiz:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Kuis Tidak Ada!"
                }
            }, 404
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(quiz, quiz_fields),
                "message": "Daftar kuis yang tersedia!"
            }
        }, 200

    @marshal_with(quiz_fields)
    @login_required
    def put(self, quiz_id):
        args = parser.parse_args()
        new_quiz_name = args['quiz_name']
        quiz = QuizModel.query.filter_by(id=quiz_id).\
            first_or_404(description="Resource not found")
        quiz.update(new_quiz_name)
        return quiz, 200

    @login_required
    def delete(self, quiz_id):
        quiz = QuizModel.query.filter_by(id=quiz_id).first()
        if not quiz:
            return {
                "payload": {
                    "status_code": 404,
                    "message": "Kuis Tidak Ada!"
                }
            }, 404
        quiz.delete()
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(quiz, quiz_fields),
                "message": "Kuis berhasil dihapus!"
            }
        }, 200


class QuizzesResource(Resource):
    @login_required
    def get(self):
        args = page_parse.parse_args()
        page = args['page'] if args['page'] is not None else 1
        per_page = 5
        quiz = QuizModel.query.paginate(page, per_page, error_out=False)
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(quiz.items, quiz_fields),
                "message": "Daftar kuis yang tersedia!",
                "pagination": {
                    "prev": quiz.prev_num,
                    "next": quiz.next_num,
                    "total_pages": quiz.pages,
                    "current_page": quiz.page
                }
            }
        }, 200

    @login_required
    def post(self):
        args = parser.parse_args()
        quiz_name = args['quiz_name']
        new_quiz = QuizModel(quiz_name)
        new_quiz.save()
        return {
            "payload": {
                "status_code": 201,
                "data": marshal(new_quiz, quiz_fields),
                "message": "Kuis berhasil dicreate!"
            }
        }, 201
