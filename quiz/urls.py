from django.urls import path, include
from django.conf import settings
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('auth', views.spotify_auth, name='spotify_auth'),
    path('spotify/callback', views.spotify_callback, name='spotify_callback'),
    path('profile', views.profile, name='profile'),
    path('logout', views.logout, name='logout'),
    path('welcome', views.welcome, name='welcome'),
    path('quiz', views.quiz, name='quiz'),
    path('api/quiz-data', views.quiz_data, name='quiz_data'),
    path('submit-score', views.submit_score, name='submit_score'),
    path('results', views.results, name='results'),
    path('leaderboard', views.leaderboard, name='leaderboard'),
    path('quiz/leaderboard', views.get_leaderboard, name='get_leaderboard'),
    path('quiz/total-leaderboard', views.get_total_leaderboard, name='get_total_leaderboard'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]