from django.db import models
from datetime import datetime, timezone, timedelta
# from django.contrib.auth.models import User



from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from djongo import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email=email, password=password)
        user.is_admin = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser):
    id = models.ObjectIdField(primary_key=True)
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin


# from django.contrib.auth import get_user_model
# User = get_user_model()


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
    timestamp = models.PositiveIntegerField(default=0)
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
    user =models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
    cc_uname = models.CharField(max_length=64)
    cf_uname = models.CharField(max_length=64)
    gh_uname = models.CharField(max_length=64)
    lt_uname = models.CharField(max_length=64,default="")

class GithubFriends(models.Model):
    user =models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
    ghFriend_uname=models.CharField(max_length=64)
class LeetcodeFriends(models.Model):
    user =models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
    ltFriend_uname=models.CharField(max_length=64)
class CodeforcesFriends(models.Model):
    user =models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
    cfFriend_uname=models.CharField(max_length=64)
class CodechefFriends(models.Model):
    user =models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
    ccFriend_uname=models.CharField(max_length=64)
class OpenlakeFriends(models.Model):
    user =models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
    olFriend_uname=models.CharField(max_length=64)