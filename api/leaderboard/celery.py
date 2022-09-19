import os
from celery import Celery
from dateutil import parser
from celery.utils.log import get_task_logger
import requests

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "leaderboard.settings")
app = Celery("leaderboard")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

@app.task(bind=True)
def codechef_user_update(self):
    from leaderboard.models import CodechefUser
    from bs4 import BeautifulSoup
    cc_users = CodechefUser.objects.all()
    for i, cc_user in enumerate(cc_users):
            if cc_user.is_outdated:
                url = 'https://www.codechef.com/users/{}'.format(cc_user.username)
                page = requests.get(url)
                data_cc = BeautifulSoup(page.text, 'html.parser')
                cc_user.rating = data_cc.find('div', class_='rating-number').text
                container_highest_rating = data_cc.find('div', class_='rating-header')
                cc_user.max_rating = container_highest_rating.find_next('small').text.split()[-1].rstrip(')')
                container_ranks = data_cc.find('div', class_='rating-ranks')
                ranks = container_ranks.find_all('a')
                cc_user.Global_rank = ranks[0].strong.text
                cc_user.Country_rank = ranks[1].strong.text
                cc_user.save()