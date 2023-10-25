<h1 align="center">Welcome to the Leaderboard project 👋</h1>

## 🤔 Problem
How do people become good at something ? By doing it regularly, right ? That's why this project aims to help all the students in practicing programming regularly by maintaining a leaderboard. The website will be have **6 different leaderboards**

## ✨ Features
- LeaderBoard Website + Django backend to collect data from different sources( APIs and web scraping )
- Leaderboard type 1 : Github profile activeness (based on commits/stars etc.)
- Leaderboard type 2 : OpenLake contributions (based on commits/pull requests etc.)
- Leaderboard type 3 : Codechef ranking
- Leaderboard type 4 : Codeforces ranking
- Leaderboard Type 5 : Leetcode ranking
- Leaderboard type 6 : Leetcode contest ranking
- Students can also view the rankings of the latest LeetCode contests, their institute rank and visualise contest performance through graph.
- Students will get notified(through email) whenever their rank is decreasing (because they aren't active)
- Our metrics will promote consistent work instead of bulk work at once.
- Tech Stack : React, Django, PostgreSQL, MongoDB (for Friend's Table)

## 📝 Setup instructions
- Install `pnpm`, To obtain installation instructions for the pnpm package manager on your operating system, please refer to the following [link](https://pnpm.io/installation).
- Install `python3.7`
    - Ensure that you are in project folder
    - Create a virtual Environment
        ```
        python3 -m venv <ENVIRONMENT_NAME>
        ```
    - Activate the virtual Environment
        ```
        source <ENVIRONMENT_NAME>/bin/activate
        ```
- Install `make`
    - For Ubuntu:
        ```
        sudo apt update
        sudo apt install make
        ```
    - For Windows, follow the [link](https://linuxhint.com/install-use-make-windows/)
- Install Redis 
    - For Ubuntu, follow the [link](https://redis.io/docs/install/install-redis/install-redis-on-linux/)
    - For Windows, follow the [link](https://redis.io/docs/install/install-redis/install-redis-on-windows/)
- Replace database credentials
    - Create a new project on Supabase
    - Go to `Project Settings > Database`
    - Open the project in prefered code-editor
    - Go to `Leaderboard-Pro > api > leaderboard > settings.py`, scroll down to `DATABASES` variable and change the `NAME`, `USER`, `PASSWORD`, `HOST` and `PORT` as on the Supabase Database page. 
- Run the following commands in the same order:
    ```
    make install
    make migrate
    make dev
    ```
- Visit http://localhost:8000/ and http://localhost:3000/

## 🧑‍💻 Maintainers
- [Gopal Ramesh Dahale](https://github.com/Gopal-Dahale)
- [Kumar Shivendu](https://github.com/KShivendu)
- [Aayush Krishnan](https://github.com/krishnan05)
- [Aditya Dubey](https://github.com/Aditya062003)

## 💻 Contributing Guidelines
- Read [contributing guidelines](https://github.com/OpenLake/Leaderboard-Pro/blob/main/.github/CONTRIBUTING.md)

## 👀 Hosted App
[https://openlake-leaderboardpro.vercel.app](https://openlake-leaderboardpro.vercel.app)
