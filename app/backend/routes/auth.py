from urllib.parse import urljoin, urlparse
from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import current_user
from flask_restful import abort

auth = Blueprint('auth_bp', __name__)


def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))

    return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc


@ auth.route('/login', methods=['GET'])
def login():
    next = request.args.get('next')
    if not is_safe_url(next):
        abort(400)
    if current_user.is_authenticated:
        return redirect(next or url_for('main_bp.activity'))
    return render_template('login.html', next=next)
