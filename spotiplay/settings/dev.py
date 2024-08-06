# dev.py

from .base import *

DEBUG = True
# Enable detailed error pages for development.

ALLOWED_HOSTS = ['*']
# Allow all hosts for local testing.

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
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

# Development secret key (use environment variable for production).
SECRET_KEY = config('DEV_SECRET_KEY')

SESSION_COOKIE_SECURE = False
# Disable HTTPS requirement for cookies in development.

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# Print emails to console for testing.



