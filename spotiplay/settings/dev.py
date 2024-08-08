# dev.py

from .base import *
from django.conf import settings


DEBUG = True
# Enable detailed error pages for development.

ALLOWED_HOSTS = ['*']
# Allow all hosts for local testing.

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

# Determine the database to use based on an environment variable
use_sqlite = config('USE_SQLITE', default='True', cast=lambda x: x.lower() == 'true')

if use_sqlite:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(settings.BASE_DIR, 'db.sqlite3'),
        }
    }
    # print("Using SQLite database")
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('LOCAL_DB_NAME'),
            'USER': config('LOCAL_DB_USER'),
            'PASSWORD': config('LOCAL_DB_PASSWORD'),
            'HOST': config('LOCAL_DB_HOST'),
            'PORT': config('LOCAL_DB_PORT'),
        }
    }
    # print("Using PostgreSQL database")

# Development secret key (use environment variable for production).
SECRET_KEY = config('DEV_SECRET_KEY')

# Disable HTTPS requirement for cookies in development.
SESSION_COOKIE_SECURE = False

# Print emails to console for testing.
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


# Toggle the debug toolbar
ENABLE_DEBUG_TOOLBAR = False  # Change this to False to disable the toolbar

if ENABLE_DEBUG_TOOLBAR:
    INSTALLED_APPS.append('debug_toolbar')
    MIDDLEWARE.append('debug_toolbar.middleware.DebugToolbarMiddleware')

# Debug Toolbar settings
INTERNAL_IPS = [
    '127.0.0.1',
]

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG and ENABLE_DEBUG_TOOLBAR,
}

