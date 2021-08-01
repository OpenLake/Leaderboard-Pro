import requests 
from bs4 import BeautifulSoup 
from datetime import date
from datetime import timedelta
from requests.auth import HTTPBasicAuth


def Open_lake_commits():
	repo_names = requests.get('https://api.github.com/users/OpenLake/repos',auth = HTTPBasicAuth('Username',"Password"))


	repo_list = []
	# # These are the names of the repo

	today = date.today()
	days = []
	# To make the range of dates
	print("You want to see the commits for the last", end = " ")
	print("days")
	dates = int(input("\n))

	for z in range(dates):
		diff = str(today - timedelta(days = z))
		print(f'ON {diff}')
		print()
		#To get the commit list FOR EACH REPOSITORY
		for reponame in repo_list:
			gh_user = {}
			commits_that_day = 0
			commit = requests.get(f"https://api.github.com/repos/OpenLake/{reponame}/commits", auth = HTTPBasicAuth('Username',"Password"))
			for x in commit.json():
				if x["commit"]["author"]["date"][0:10] == str(diff):
					commits_that_day = commits_that_day + 1
					if x['commit']['author']['name'] not in gh_user:
						gh_user[x['commit']['author']['name']] = 1
					else:
						gh_user[x['commit']['author']['name']] += 1 

			if commits_that_day:
				print(f'There were a total of {commits_that_day} commits on {reponame}!')
				print()
			commits_that_day = 0
			for m in gh_user:
				print(f'{m} made {gh_user[m]} commits to {reponame}')
			print()
			print()

