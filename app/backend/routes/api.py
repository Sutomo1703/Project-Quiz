from flask import Blueprint
from app.backend.controllers.QuizApiController import QuizResource, QuizzesResource
from app.backend.controllers.QuestionApiController import QuestionCreateResource, QuestionGetAllResource, QuestionGetSingleResource, QuestionUpdateResource
from app.backend.controllers.ChoiceApiController import ChoiceCreateResource, ChoiceGetAllResource, ChoiceGetSingleResource, ChoiceUpdateResource
from app.backend.controllers.RecordQuizApiController import RecordQuizCreateResource, RecordQuizGetAllResource, RecordQuizGetSingleResource
from app.backend.controllers.RecordQuizDetailsApiController import RecordQuizDetailsCreateResource, RecordQuizDetailsGetAllResource
from app.backend.controllers.UserApiController import UserCreateRescource, UserLoginResource, UserLogoutResource
from app import api

api_bp = Blueprint('api_bp', __name__)
api.init_app(api_bp)

''' Quiz route endpoint '''
api.add_resource(QuizzesResource, '/quizzes',
                 methods=['GET', 'POST'])
api.add_resource(QuizResource, '/quizzes/<int:quiz_id>',
                 methods=['GET', 'PUT', 'DELETE'])

''' Question route endpoint '''
api.add_resource(QuestionCreateResource,
                 '/questions',
                 methods=['POST'])
api.add_resource(QuestionGetAllResource,
                 '/quizzes/<int:quiz_id>/questions',
                 methods=['GET'])
api.add_resource(QuestionGetSingleResource,
                 '/questions/<int:question_id>',
                 methods=['GET'])
api.add_resource(QuestionUpdateResource,
                 '/questions/<int:question_id>',
                 methods=['PUT', 'DELETE'])

''' Choice route endpoint '''
api.add_resource(ChoiceCreateResource,
                 '/choices',
                 methods=['POST'])
api.add_resource(ChoiceGetAllResource,
                 '/questions/<int:question_id>/choices',
                 methods=['GET'])
api.add_resource(ChoiceGetSingleResource,
                 '/choices/<int:choice_id>',
                 methods=['GET'])
api.add_resource(ChoiceUpdateResource,
                 '/choices/<int:choice_id>',
                 methods=['PUT', 'DELETE'])

''' Record quiz endpoint '''
api.add_resource(RecordQuizCreateResource, '/records', methods=['POST'])
api.add_resource(RecordQuizGetAllResource,
                 '/records', methods=['GET'])
api.add_resource(RecordQuizGetSingleResource,
                 '/records/<int:record_quiz_id>', methods=['GET'])

''' Record quiz details endpoint '''
api.add_resource(RecordQuizDetailsCreateResource, '/details', methods=['POST'])
api.add_resource(RecordQuizDetailsGetAllResource,
                 '/records/<int:record_quiz_id>/details')


''' User endpoint '''
api.add_resource(UserCreateRescource, '/users/register', methods=['POST'])
api.add_resource(UserLoginResource, '/users/login', methods=['POST', 'GET'])
api.add_resource(UserLogoutResource, '/users/logout', methods=['DELETE'])
