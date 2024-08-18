from flask import abort
from flask_restful import Resource, marshal_with, reqparse
from flask_login import login_required
from app.backend.models.Record_Quiz import RecordQuizModel
from app.backend.models.Record_Answer import RecordAnswerModel, record_answer_fields

parser = reqparse.RequestParser()
parser.add_argument('record_quiz_id', type=int, location='json',
                    help='{error_msg}', required=True)
parser.add_argument('question_id', type=int, location='json',
                    help='{error_msg}', required=True)
parser.add_argument('choice_id', type=int, location='json',
                    help='{error_msg}', required=True)


class RecordQuizDetailsCreateResource(Resource):
    @login_required
    @marshal_with(record_answer_fields)
    def post(self):
        args = parser.parse_args()
        record_quiz_id = args['record_quiz_id']
        question_id = args['question_id']
        choice_id = args['choice_id']
        new_record_quiz_details = RecordAnswerModel(
            record_quiz_id, question_id, choice_id)
        new_record_quiz_details.save()
        return new_record_quiz_details, 201


class RecordQuizDetailsGetAllResource(Resource):
    @login_required
    @marshal_with(record_answer_fields)
    def get(self, record_quiz_id):
        records = RecordAnswerModel.query.\
            join(RecordQuizModel).\
            filter(RecordQuizModel.id == record_quiz_id).\
            all()
        if not records:
            abort(404, description="Resource not found")
        return records, 200
