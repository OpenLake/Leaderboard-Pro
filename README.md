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
- Install `pnpm`, `python3.7` and `Make` in your system
- Replace database credentials in settings.py with yours database credentials
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
