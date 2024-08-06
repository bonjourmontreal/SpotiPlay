from django.core.management.base import BaseCommand
from quiz.models import Leaderboard

class Command(BaseCommand):
    help = 'Check leaderboard entries'

    def handle(self, *args, **kwargs):
        entries = Leaderboard.objects.all()
        if not entries:
            self.stdout.write(self.style.WARNING('No leaderboard entries found.'))
            return
        
        for entry in entries:
            self.stdout.write(f'User: {entry.user.username}, Score: {entry.score}')
