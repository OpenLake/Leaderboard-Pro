from django.db import models
from datetime import datetime, timezone, timedelta
from django.contrib.auth.models import User
from datetime import datetime
from django.utils import timezone

from django.contrib.postgres.fields import ArrayField


class githubUser(models.Model):
    username = models.CharField(max_length=64, unique=True)
    contributions = models.PositiveIntegerField(default=0)
    repositories = models.PositiveIntegerField(default=0)
    stars = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    avatar = models.CharField(max_length=256, default="")
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


class openlakeContributor(models.Model):
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


class codeforcesUser(models.Model):
    username = models.CharField(max_length=64, unique=True)
    max_rating = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    last_activity = models.BigIntegerField(
        default=timezone.datetime.max.replace(tzinfo=timezone.utc).timestamp()
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


class codechefUser(models.Model):
    username = models.CharField(max_length=64, unique=True)
    max_rating = models.PositiveIntegerField(default=0)
    Global_rank = models.CharField(max_length=10, default="NA")
    Country_rank = models.CharField(max_length=10, default="NA")
    rating = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    avatar = models.CharField(max_length=256, default="")
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
    return codeforcesUser.objects.get_or_create(username="tourist")[0]


class codeforcesUserRatingUpdate(models.Model):
    cf_user = models.ForeignKey(
        codeforcesUser,
        default=get_default_cf_user,
        on_delete=models.CASCADE,
        related_name="rating_updates",
    )
    index = models.PositiveIntegerField(default=0)
    prev_index = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    timestamp = models.BigIntegerField(default=0)
    def __str__(self):
        return f"{self.cf_user.username}.{self.index} {self.rating}"

    class Meta:
        ordering = ["timestamp"]
class LeetcodeUser(models.Model):
    username = models.CharField(max_length=64, unique=True)
    ranking = models.PositiveIntegerField(default=0)
    easy_solved = models.PositiveIntegerField(default=0)
    medium_solved = models.PositiveIntegerField(default=0)
    hard_solved = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    avatar = models.CharField(max_length=256, default="")
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
        ordering = ["ranking"]

class UserNames(models.Model):
    user =models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    cc_uname = models.CharField(max_length=64)
    cf_uname = models.CharField(max_length=64)
    gh_uname = models.CharField(max_length=64)
    lt_uname = models.CharField(max_length=64,default="")