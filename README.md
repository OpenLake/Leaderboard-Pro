<h1 align="center">Welcome to the LeaderboardPro project 👋</h1>

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
  - For Mac OS:
    - In the terminal window, run the command `xcode-select --install`
    - In the windows that pops up, click Install, and agree to the Terms of Service.
  - For Windows, follow the [link](https://linuxhint.com/install-use-make-windows/)
- Install Redis
  - For Ubuntu, follow the [link](https://redis.io/docs/install/install-redis/install-redis-on-linux/)
  - For MacOS, follow the [link](https://redis.io/docs/install/install-redis/install-redis-on-mac-os/)
  - For Windows, follow the [link](https://redis.io/docs/install/install-redis/install-redis-on-windows/)
- Replace database credentials
  - Create a new project on Supabase
  - Go to `Project Settings > Database`
  - Open the project in prefered code-editor
  - Go to `Leaderboard-Pro > api > leaderboard > settings.py`, scroll down to `DATABASES` variable and change the `NAME`, `USER`, `PASSWORD`, `HOST` and `PORT` as on the Supabase Database page.
- Run the following commands in the same order:
  ```
  make install
  make dev
  ```
- Visit http://localhost:8000/ and http://localhost:3000/

## 🐳 Running with Docker

Docker provides a consistent and isolated environment for running the Leaderboard project, ensuring that it works the same way on every machine. Follow these steps to get the application up and running with Docker:

### Prerequisites

- Ensure you have Docker installed on your machine. To install Docker, follow the instructions on the [Docker website](https://docs.docker.com/get-docker/).

### Building the Docker Image

1. Clone the repository (if you haven't already):

   ```
   git clone https://github.com/your-username/Leaderboard-Pro.git
   cd Leaderboard-Pro
   ```

2. Build the Docker image:

   ```
   docker build -t leaderboard-pro .
   ```

   This command builds a Docker image named `leaderboard-pro` based on the instructions in the Dockerfile.

### Running the Application in a Docker Container

1. To start the application in a Docker container, run:

   ```
   docker run -p 8000:8000 -p 3000:3000 leaderboard-pro
   ```

   This command starts the Docker container and maps the ports so that you can access the Django backend at `http://localhost:8000/` and the React frontend at `http://localhost:3000/`.

2. Visit the URLs in your web browser to interact with the application:
   - Django Backend: [http://localhost:8000/](http://localhost:8000/)
   - React Frontend: [http://localhost:3000/](http://localhost:3000/)

### Stopping the Container

- To stop the Docker container, you can press `Ctrl+C` in the terminal where the container is running. Alternatively, you can stop the container from another terminal using the `docker stop` command with the container ID.

## 🧑‍💻 Maintainers

- [Sumagna Das](https://github.com/sumagnadas)

## 💻 Contributing Guidelines

- Read the [contributing guidelines](https://github.com/OpenLake/Leaderboard-Pro/blob/main/.github/CONTRIBUTING.md)
- Understand the [directory structure](https://github.com/OpenLake/Leaderboard-Pro/blob/main/.github/DIRECTORY.md)
- Agree to the [code of conduct](https://github.com/OpenLake/Leaderboard-Pro/blob/main/.github/CODE_OF_CONDUCT.md)

## 👀 Hosted App

[https://leaderboardpro.vercel.app](https://leaderboardpro.vercel.app)
