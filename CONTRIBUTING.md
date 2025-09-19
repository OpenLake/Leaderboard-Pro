# CONTRIBUTION GUIDELINES

## Before contributing

Welcome to [OpenLake/Contributors-Leaderboard](https://github.com/OpenLake/Contributors-Leaderboard)! Before submitting pull requests, please make sure that you have **read the guidelines**. If you have any doubts about this contribution guidelines, please open [an issue](https://github.com/OpenLake/Contributors-Leaderboard/issues/new) and clearly state your concerns.

## Pull Requests

Checkout the [PR Format Guidelines](https://github.com/OpenLake/Contributors-Leaderboard/wiki/PR-Format-Guidelines) and [pull request template](https://github.com/OpenLake/Contributors-Leaderboard/blob/main/.github/pull_request_template.md)

## Setting up the project
- Fork and clone the repository.
- Create a new branch for the feature you are working on. Name of the branch should be the feature that you are working on 

  `git checkout -b <branch-name>`
- Now, you can make the changes in the project.

## Guidelines to be followed

- Keep updating your branch with the latest `main` at regular intervals.
- Coding style should be clean and clear.
- Follow the coding [guidelines](https://google.github.io/styleguide/jsguide.html) given here.
- Follow the coding [guidelines](https://google.github.io/styleguide/pyguide.html) given here for Python
- Write proper comments along with the code.
- Use extensions in your editor (preferably VSCode)
  - Prettier
  - EsLint
- Naming conventions to be followed:
  - Package names are all `lowerCamelCase`.
  - Class, interface, record, and typedef names are written in `UpperCamelCase`.
  - Method names are written in `lowerCamelCase`.
  - Enum names are written in `UpperCamelCase`, similar to classes, and should generally be singular nouns. Individual items within the enum are named in `CONSTANT_CASE`.
  - Constant names use `CONSTANT_CASE`: all uppercase letters, with words separated by underscores.
  - Non-constant field names (static or otherwise) are written in `lowerCamelCase`.
  - Parameter names are written in `lowerCamelCase`.
  - Local variable names are written in `lowerCamelCase`.
- Set up [YAPF](https://github.com/google/yapf) for auto-formatting Python code. Set the following in VSCode settings:
  - `"python.linting.enabled": true`
  - `"python.formatting.provider": "yapf"`
  - `"python.formatting.yapfArgs": "based_on_style: google"`
- Set tab spacing size to 2 in your editor.
- Use [pylint](https://pypi.org/project/pylint/) as the linter.
- Try to avoid platform-specific code as much as possible.
- Always make sure that the code behaves in a responsive manner for different screen sizes.
- Check for prettier, ESLint errors and correct them.
- Keep pushing your code to the remote branch at regular intervals.

## Writing a commit message
- To write a git commit message, start by typing `git commit` on your Terminal or Command Prompt which brings up a Vim/ VSCode interface for entering the commit message.
- Type the subject of your commit on the first line. Remember to keep it short (not more than 50 characters). Use only present tense for it. Leave a blank line after.
- Write a detailed description of what happened in the committed change. Use multiple paragraphs and bullet points to give a detailed breakdown. Don’t write
everything out on one line, instead, wrap text at 72 characters.
- Save and exit.
- The commit message should be written in the imperative mood, i.e. present tense. For example: 'Fix bug', not 'Fixed bug' or 'Fixes bug'.

Following is a template for writing a commit message


> First line, no more than 50 characters
> 
> Details section, as long as you want. Not always necessary, but available if you need it. Wrapped at 72 characters. Present imperative tense is preferred for commits. 
> - Use bullets if you need
> - Bullets are a good way to summarize a few things.
> 
> If you have too much info here, it might be a good candidate to break down into multiple commits.


## Adding a Reviewer
- Click the Pull Requests tab under the repository name.
- In the list of pull requests, click the pull request that you'd like to ask a specific person to review.
- Navigate to Reviewers in the right sidebar.
- To request a review from a suggested person under Reviewers, next to their username, click Request. You can also type the name of the person to request the review.

Most Importantly, Happy coding!!!
