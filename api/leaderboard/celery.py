import os
from celery import Celery
import requests
import logging
from celery import shared_task
import datetime
logger = logging.getLogger(__name__)



os.environ.setdefault("DJANGO_SETTINGS_MODULE", "leaderboard.settings")
app = Celery("leaderboard")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

def listToString(s):
    str1 = ""
    for ele in s:
        str1 += ele
    return str1

@app.task(bind=True)
def codechef_user_update(self):
    from leaderboard.models import codechefUser
    from bs4 import BeautifulSoup

    cc_users = codechefUser.objects.all()
    for i, cc_user in enumerate(cc_users):
        if cc_user.is_outdated:
            url = "https://www.codechef.com/users/{}".format(cc_user.username)
            page = requests.get(url)
            
            data_cc = BeautifulSoup(page.text, "html.parser")
            
            try:
                cc_user.rating = data_cc.find("div", class_="rating-number").text
                container_highest_rating = data_cc.find(
                    "div", class_="rating-header"
                )
                ttg = data_cc.findAll("img", class_="profileImage")
                cc_user.avatar=ttg[-1]['src']
                cc_user.max_rating = (
                    container_highest_rating.find_next("small")
                    .text.split()[-1]
                    .rstrip(")")
                )
                container_ranks = data_cc.find("div", class_="rating-ranks")
                ranks = container_ranks.find_all("a")
                cc_user.Global_rank = ranks[0].strong.text
                cc_user.Country_rank = ranks[1].strong.text
                cc_user.save()
                # logger.info(cc_user)
            except:
                pass


@app.task(bind=True)
def github_user_update(self):
    from leaderboard.models import githubUser
    from bs4 import BeautifulSoup

    gh_users = githubUser.objects.all()
    for i, gh_user in enumerate(gh_users):
        if gh_user.is_outdated:
            url = "https://github.com/{}".format(gh_user.username)
            page = requests.get(url)
            data_gh = BeautifulSoup(page.text, "html.parser")
            a = data_gh.find("div", class_="js-yearly-contributions")
            b = a.find("h2", class_="f4 text-normal mb-2").text
            gh_user.contributions = int(b.split(" ")[6])
            url = f"https://api.github.com/users/{gh_user.username}/repos"
            response = requests.get(url).json()
            gh_user.repositories = len(response)
            ttg = data_gh.findAll("img", class_="avatar avatar-user width-full border color-bg-default")
            gh_user.avatar=ttg[-1]['src']
            stars = 0
            # logger.info(response)
            for i in range(len(response)):
                stars = stars + response[i]["stargazers_count"]
            gh_user.stars = stars
            gh_user.save()

@app.task(bind=True)
def leetcode_user_update(self):
    from leaderboard.models import LeetcodeUser
    from bs4 import BeautifulSoup
    # print("running-----1")
    lt_users = LeetcodeUser.objects.all()
    # print("running-----2")
    for i, lt_user in enumerate(lt_users):
        # print("running-----3")
        if lt_user.is_outdated:
            url = "https://leetcode.com/{}".format(lt_user.username)
            page = requests.get(url)
            data_cc = BeautifulSoup(page.text, "html.parser")
            ttg = data_cc.findAll("img", class_="h-20 w-20 rounded-lg object-cover")
            lt_ranking = data_cc.find("span", class_="ttext-label-1 dark:text-dark-label-1 font-medium")
            lt_questions=data_cc.findAll("span", class_="mr-[5px] text-base font-medium leading-[20px] text-label-1 dark:text-dark-label-1")
            lt_user.ranking = int(listToString(lt_ranking.text.split(',')))
            lt_user.easy_solved=int(listToString(lt_questions[0].text.split(',')))
            lt_user.medium_solved=int(listToString(lt_questions[1].text.split(',')))
            lt_user.hard_solved=int(listToString(lt_questions[2].text.split(',')))
            lt_user.avatar=ttg[-1]['src']
            lt_user.save()

            
@app.task(bind=True)
def openlake_contributor__update(self):
    from leaderboard.models import openlakeContributor
    
    updated_list = {}
    url = "https://api.github.com/users/OpenLake/repos"
    response = requests.get(url).json()
    # logger.info(response)
    print(len(response))
    logger.info(response)
    for i in range(len(response)):
        repo_url = str(response[i]["contributors_url"])
        print(repo_url)
        try:
            repo_response = requests.get(repo_url).json()
            for j in range(len(repo_response)):
                try:
                    print(repo_response[j]["login"])
                    print(updated_list)
                    if repo_response[j]["login"] in updated_list.keys():
                        updated_list[repo_response[j]["login"]] = (
                            updated_list[repo_response[j]["login"]]
                            + repo_response[j]["contributions"]
                        )
                    else:
                        updated_list[
                            repo_response[j]["login"]
                        ] = repo_response[j]["contributions"]
                except Exception as ex:
                    print("=========================", ex)
                    continue
        except Exception as ex:
            print("=========================", ex)
            continue
    openlakeContributor.objects.all().delete()
    for i in updated_list.keys():
        ol_contributor = openlakeContributor()
        ol_contributor.username = i
        ol_contributor.contributions = updated_list[i]
        ol_contributor.save()

@shared_task
def get_ranking(contest, usernames):
    API_URL_FMT = 'https://leetcode.com/contest/api/ranking/{}/?pagination={}&region=global'
    page = 1
    total_rank = []
    retry_cnt = 0
    while True:
        try:
            url = API_URL_FMT.format(contest, page)
            logger.info(url)
            resp = requests.get(url).json()
            page_rank = resp['total_rank']
            if len(page_rank) == 0:
                break
            total_rank.extend(page_rank)
            print(f'Retrieved ranking from page {page}. {len(total_rank)} retrieved.')
            page += 1
            retry_cnt = 0
        except:
            print(f'Failed to retrieve data of page {page}...retry...{retry_cnt}')
            retry_cnt += 1

    # Discard and transform fields
    for rank in total_rank:
        rank.pop('contest_id', None)
        rank.pop('user_slug', None)
        rank.pop('country_code', None)
        rank.pop('global_ranking', None)
        finish_timestamp = rank.pop('finish_time', None)
        if finish_timestamp:
            rank['finish_time'] = datetime.datetime.fromtimestamp(int(finish_timestamp)).isoformat()

    # Filter rankings based on usernames
    filtered_rankings = [rank for rank in total_rank if rank['username'] in usernames]

    return filtered_rankings