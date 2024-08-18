import os
import redis
from datetime import timedelta

# Create a secret key
# import secrets
# secrets.token_hex()
SECRET_KEY = '9bfbd9206f66186dfeb7f3adacf5aa6d18a328eccbde494a1e9158a6e02d4626'

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

# Enable debug mode.
DEBUG = True

# Connect to the database
SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:akuhebat11@localhost/quiz'

# Enable Flask-SQLAlchemy logging
# SQLALCHEMY_ECHO = True

# Turn off the Flask-SQLAlchemy event system and warning
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Enable error custom message
BUNDLE_ERRORS = True

# Configure Redis for storing the session data on the server-side
SESSION_TYPE = 'redis'
# SESSION_PERMANENT = True
# PERMANENT_SESSION_LIFETIME = timedelta(days=365)
SESSION_USE_SIGNER = True
SESSION_REDIS = redis.from_url('redis://localhost:6379')


SESSION_COOKIE_SECURE = True,
SESSION_COOKIE_HTTPONLY = True,
SESSION_COOKIE_SAMESITE = 'Lax'

# PERMANENT_SESSION_LIFETIME = timedelta(days=365)
