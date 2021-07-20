from django.db import models
from datetime import datetime, timezone, timedelta

class CodeforcesUser(models.Model):
    username = models.CharField(max_length=64, unique=True)
    max_rating = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    last_activity = models.PositiveIntegerField(default=datetime.max.timestamp())
    last_updated = models.DateTimeField(auto_now=True)

    @property
    def is_outdated(self):
        if datetime.now(tz=timezone.utc) - self.last_updated > timedelta(minutes=1):
            return True
        else:
            False

    class Meta:
        ordering = ['-rating']
