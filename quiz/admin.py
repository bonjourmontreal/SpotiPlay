from django.contrib import admin
from .models import Leaderboard


# Register your models here.
@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'created_at')
    list_filter = ('user', 'score', 'created_at')
    search_fields = ('user__username', 'score')