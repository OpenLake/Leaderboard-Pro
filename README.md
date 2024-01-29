# Welcome to the Leaderboard project 👋

## Problem
People become proficient at something by practicing regularly. This project facilitates regular programming practice by maintaining a leaderboard. The website will feature 6 different leaderboards:

## Features
- LeaderBoard Website with Django backend to collect data from various sources (APIs and web scraping).
- Leaderboard types:
  1. Github profile activity (based on commits/stars, etc.).
  2. OpenLake contributions (based on commits/pull requests, etc.).
  3. Codechef ranking.
  4. Codeforces ranking.
  5. Leetcode ranking.
  6. Leetcode contest ranking.
- Students can view rankings of the latest LeetCode contests, institute rank, and visualize contest performance through graphs.
- Notification system (via email) alerts students when their rank is decreasing due to inactivity.
- Metrics promote consistent work over bulk work.
- Tech Stack: React, Django, PostgreSQL, MongoDB (for Friend's Table).

## Setup Instructions
- Install `pnpm`. Refer to the [installation instructions](https://pnpm.io/installation).
- Install `python3.7`.
  - Navigate to the project folder.
  - Create a virtual environment named "overflow":
    ```
    python3 -m venv overflow
    ```
  - Activate the virtual environment:
    ```
    source overflow/bin/activate
    ```
- Install `make`.
  - For Ubuntu:
    ```
    sudo apt update
    sudo apt install make
    ```
  - For Mac OS: Run `xcode-select --install` in the terminal.
  - For Windows, follow the [installation guide](https://linuxhint.com/install-use-make-windows/).
- Install Redis. Refer to the installation guides for [Ubuntu](https://redis.io/docs/install/install-redis/install-redis-on-linux/), [MacOS](https://redis.io/docs/install/install-redis/install-redis-on-mac-os/), or [Windows](https://redis.io/docs/install/install-redis/install-redis-on-windows/).
- Replace database credentials:
  - Create a new project on Supabase.
  - Update database settings in `Leaderboard-Pro > api > leaderboard > settings.py`.
- Copy `.env.template` in the app folder and rename it to `.env`.
- Run the following commands:
```
make install
make dev
```
- Visit http://localhost:8000/ and http://localhost:3000/.

## Running with Docker
### Prerequisites
- Ensure Docker is installed. Refer to the [Docker website](https://docs.docker.com/get-docker/) for instructions.

### Building the Docker Image
1. Clone the repository:
```
git clone https://github.com/your-username/Leaderboard-Pro.git
cd Leaderboard-Pro
```
2. Copy `.env.template` in the app folder and rename it to `.env`.
3. Build the Docker image:
```
docker build -t leaderboard-pro .
```

### Running the Application in a Docker Container
1. Start the application in a Docker container:
```
docker run -p 8000:8000 -p 3000:3000 leaderboard-pro
```
2. Access the application:
- Django Backend: http://localhost:8000/
- React Frontend: http://localhost:3000/

### Stopping the Container
- To stop the Docker container, press `Ctrl+C` in the terminal or use `docker stop` with the container ID.

## Maintainers
- [Gopal Ramesh Dahale](https://github.com/Gopal-Dahale)
- [Kumar Shivendu](https://github.com/KShivendu)
- [Aayush Krishnan](https://github.com/krishnan05)
- [Aditya Dubey](https://github.com/Aditya062003)

## Contributing Guidelines
- Read the [contributing guidelines](https://github.com/OpenLake/Leaderboard-Pro/blob/main/.github/CONTRIBUTING.md)

## Hosted App
[https://openlake-leaderboardpro.vercel.app](https://openlake-leaderboardpro.vercel.app)
