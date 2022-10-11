from django.db import models
from datetime import datetime, timezone, timedelta


class gitHubUser(models.Model):
    username = models.CharField(max_length=64, unique=True)
    contributions = models.PositiveIntegerField(default=0)
    repositories = models.PositiveIntegerField(default=0)
    stars = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    @property
    def is_outdated(self):
        if datetime.now(tz=timezone.utc) - self.last_updated > timedelta(
            minutes=1
        ):
            return True
        else:
            return False

    def __str__(self):
        return f"{self.username}"


class openLakeContributor(models.Model):
    username = models.CharField(max_length=64, unique=True)
    contributions = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    @property
    def is_outdated(self):
        if datetime.now(tz=timezone.utc) - self.last_updated > timedelta(
            minutes=1
        ):
            return True
        else:
            return False

    def __str__(self):
        return f"{self.username}"

    class Meta:
        ordering = ["-contributions"]


class codeForcesUser(models.Model):
    username = models.CharField(max_length=64, unique=True)
    max_rating = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    last_activity = models.PositiveIntegerField(
        default=datetime.max.timestamp()
    )
    last_updated = models.DateTimeField(auto_now=True)
    avatar = models.CharField(max_length=256, default="")

    @property
    def is_outdated(self):
        if datetime.now(tz=timezone.utc) - self.last_updated > timedelta(
            minutes=1
        ):
            return True
        else:
            False

    def __str__(self):
        return f"{self.username} ({self.rating})"

    class Meta:
        ordering = ["-rating"]


class codeChefUser(models.Model):
    username = models.CharField(max_length=64, unique=True)
    max_rating = models.PositiveIntegerField(default=0)
    Global_rank = models.CharField(max_length=10, default="NA")
    Country_rank = models.CharField(max_length=10, default="NA")
    rating = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    @property
    def is_outdated(self):
        if datetime.now(tz=timezone.utc) - self.last_updated > timedelta(
            minutes=3
        ):
            return True
        else:
            False

    def __str__(self):
        return f"{self.username} ({self.rating})"

    class Meta:
        ordering = ["-rating"]


def get_default_cf_user():
    return codeForcesUser.objects.get_or_create(username="tourist")[0]


class codeForcesUserRatingUpdate(models.Model):
    cf_user = models.ForeignKey(
        codeForcesUser,
        default=get_default_cf_user,
        on_delete=models.CASCADE,
        related_name="rating_updates",
    )
    index = models.PositiveIntegerField(default=0)
    prev_index = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    timestamp = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.cf_user.username}.{self.index} {self.rating}"

    class Meta:
        ordering = ["timestamp"]
    