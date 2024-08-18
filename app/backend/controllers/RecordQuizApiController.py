from flask import abort
from flask_restful import Resource, marshal_with, reqparse, inputs, marshal
from flask_login import login_required
from app.backend.models.Record_Quiz import RecordQuizModel, record_quiz_fields

parser = reqparse.RequestParser()
parser.add_argument('quiz_id', type=int, location='json',
                    help='{error_msg}', required=True)
parser.add_argument('pengerja_id', type=int, location='json',
                    help='{error_msg}', required=True)
parser.add_argument('nilai', type=float, location='json',
                    help='{error_msg}', required=True)
parser.add_argument('tanggal_kerja', type=inputs.datetime_from_iso8601, location='json',
                    help='{error_msg}', required=True)

page_parse = reqparse.RequestParser()
page_parse.add_argument('page', type=int, location='args', required=False)


class RecordQuizCreateResource(Resource):
    @login_required
    @marshal_with(record_quiz_fields)
    def post(self):
        args = parser.parse_args()
        quiz_id = args['quiz_id']
        pengerja_id = args['pengerja_id']
        tanggal_kerja = args['tanggal_kerja']
        nilai = args['nilai']
        new_record_quiz = RecordQuizModel(
            quiz_id, pengerja_id, nilai, tanggal_kerja)
        new_record_quiz.save()
        return new_record_quiz, 201


class RecordQuizGetAllResource(Resource):
    @login_required
    def get(self):
        args = page_parse.parse_args()
        page = args['page'] if args['page'] is not None else 1
        per_page = 5
        records = RecordQuizModel.query.paginate(page, per_page, error_out=False)
        return {
            "payload": {
                "status_code": 200,
                "data": marshal(records.items, record_quiz_fields),
                "message": "Daftar riwayat kuis yang tersedia!",
                "pagination": {
                    "prev": records.prev_num,
                    "next": records.next_num,
                    "total_pages": records.pages,
                    "current_page": records.page
                }
            }
        }, 200
        # records = RecordQuizModel.query.all()
        # if not records:
        #     abort(404, description="Resource not found")
        # return records, 200


class RecordQuizGetSingleResource(Resource):
    @login_required
    @marshal_with(record_quiz_fields)
    def get(self, record_quiz_id):
        record_quiz = RecordQuizModel.query.\
            filter_by(id=record_quiz_id).\
            first_or_404(
                description=f'Resources Not Found!')
        return record_quiz, 200
