import requests 
from bs4 import BeautifulSoup 
from datetime import date
from datetime import timedelta
from requests.auth import HTTPBasicAuth
repo_names = requests.get('https://api.github.com/users/OpenLake/repos',auth = HTTPBasicAuth('Username',"Password"))


repo_list = []
# # These are the names of the repo
# for rep in repo_names.json():
# 	print(f'The repo {rep["name"]} is added to the list')
# 	print()
# 	# Save these names in the list
# 	repo_list.append(rep["name"])

today = date.today()
days = []
# To make the range of dates
print("You want to see the commits for the last", end = " ")
print("days")
dates = int(input())

print()

for z in range(dates):
	diff = str(today - timedelta(days = z))
	print(f'ON {diff}')
	print()
	#To get the commit list FOR EACH REPOSITORY
	for reponame in repo_list:
		guys = {}
		commits_that_day = 0
		commit = requests.get(f"https://api.github.com/repos/OpenLake/{reponame}/commits", auth = HTTPBasicAuth('Username',"Password"))
		for x in commit.json():
			if x["commit"]["author"]["date"][0:10] == str(diff):
				commits_that_day = commits_that_day + 1
				if x['commit']['author']['name'] not in guys:
					guys[x['commit']['author']['name']] = 1
				else:
					guys[x['commit']['author']['name']] += 1 

		if commits_that_day:
			print(f'There were a total of {commits_that_day} commits on {reponame}!')
			print()
		commits_that_day = 0
		for m in guys:
			print(f'{m} made {guys[m]} commits to {reponame}')
		print()
		print()
	