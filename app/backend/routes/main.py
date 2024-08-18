from flask import Blueprint, render_template, request
from flask_login import login_required
from flask_restful import abort
from werkzeug.exceptions import NotFound, InternalServerError, MethodNotAllowed, Unauthorized

main = Blueprint('main_bp', __name__)


# @main.route("/")
@login_required
def home():
    abort(404)
    return render_template('home_page.html')


@main.route("/")
@main.route("/activities")
@login_required
def activity():
    next_page = request.args.get('next')
    return render_template('activities.html')


@main.route("/records")
@login_required
def records():
    return render_template("history_quiz.html")


@main.route("/records/<int:id>/details")
@login_required
def details(id):
    return render_template("history_quiz_detail.html", record_quiz_id=id)


@main.route("/classes")
@login_required
def classes():
    abort(404)
    return render_template("classes.html")


@main.route("/quiz/<int:id>/edit")
@login_required
def create_quiz(id):
    return render_template('create_quiz.html', quiz_id=id)


@main.route("/quiz/<int:id>/play")
@login_required
def play_quiz(id):
    return render_template('play_quiz.html', quiz_id=id)


@main.errorhandler(NotFound)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('error_handler.html', status_code=404, status_message="NOT FOUND"), 404


@main.errorhandler(InternalServerError)
def bad_server(e):
    return render_template('error_handler.html', status_code=500, status_message="BAD SERVER"), 500


@main.errorhandler(MethodNotAllowed)
def method_not_allowed(e):
    return render_template('error_handler.html', status_code=405, status_message="METHOD NOT ALLOWED"), 405


@main.errorhandler(Unauthorized)
def user_unauthorized(e):
    return render_template('error_handler.html', status_code=401, status_message="UNAUTHORIZED"), 401
