import requests
from datetime import date
from requests.auth import HTTPBasicAuth

username = input("Enter your github username: " )
today = date.today()
def checkcommits(org):
	commits_today = 0
	repos = requests.get(f"https://api.github.com/users/{org}/repos")
	for x in repos.json():
		reponame = x["name"]
		commit = requests.get(f'https://api.github.com/repos/{org}/{reponame}/commits')
		for rep in commit.json():
			if rep['commit']['author']['date'][0:10] == str(today):
				if rep["commit"]["author"]["name"] == username:
					commits_today += 1
			else:
				continue
	return commits_today
repo_names = requests.get(f"https://api.github.com/users/{username}/repos")

repos = []

for repo in repo_names.json():
	print(f'The repo {repo["name"]} is added to the list')
	repos.append(repo)
	
	
	# COMMITS IN THE PERSONAL REPOSITORIES
		# Commits on the above repo
	print(f'Commits made on {repo["name"]} on {today}')
	commit_today = 0
	commit = requests.get(f'https://api.github.com/repos/ArshpreetS/{repo["name"]}/commits')
	for x in commit.json():
		if x["commit"]["author"]["date"][0:10] == str(today):
			commit_today += 1
	print(f"I made {commit_today} on the {repo['name']} today ({today})!")
	print()

orgs = requests.get(f"https://api.github.com/users/{username}/orgs")

for i in orgs.json():
	name = i["login"] #Name of the Organisations
	commited = checkcommits(name)
	print(f"For organization {name}, {username} did {commited} commits")

