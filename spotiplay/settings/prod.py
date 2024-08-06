# prod.py

from .base import *
import dj_database_url

DEBUG = False
# Disable debug mode to prevent detailed error pages from showing in production.

ALLOWED_HOSTS = ['spotiplay.onrender.com']
# Restrict allowed hosts to your actual domain for security.

DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
}
print("Database settings:", DATABASES)

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Security settings for production
SECRET_KEY = config('PROD_SECRET_KEY')

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# Ensure cookies are only sent over HTTPS.

SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_SSL_REDIRECT = True
# Use HTTP Strict Transport Security (HSTS) to enforce HTTPS and redirect HTTP to HTTPS.

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# Configure a real email backend to send emails in production.



