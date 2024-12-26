# ember-gh-repos

This project is a GitHub Repository Explorer built with EmberJS. View repositories and their details from any GitHub organization
Uses the GitHub API (https://docs.github.com/en/rest) to get this information.

Play Mode: Two players take turns to play the game.
Play Against AI Mode: A single player competes against an AI opponent.

## Features

Users are able to enter GitHub organization name and the app should show their repositories.
For each repository, you can get the following information:
- Name
- Link to the repository’s GitHub page
- Number of branches
- List of branch names and links
- Programming language
- Whether it is private or public

Also;
- The user can expand each repository to see the names of the branches
- The user able to choose whether to show private and/or public repositories
- The user able to filter the repositories by programming language

### Side note
Github token is implemented to use .env files but since this info is user specific, I implemented client side storage aswell. We will be storing your token in cookies and use it. 
And since on the server (netlify), there is no .env variable, cookie token will be used.

We can implement OAuth for future implementations

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://cli.emberjs.com/release/)
* [Netlify CLI](https://docs.netlify.com/cli/get-started/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* Install Netlify CLI from `https://docs.netlify.com/cli/get-started/`
* `cd ember-gh-repos`
* `npm install`

## Running / Development
This project requires netlify functions so there is no way to use without netlify cli on local.
The reason is explained in `Netlify` section
* `netlify dev`
* Visit your app at [http://localhost:8888](http://localhost:8888).

## Netlify
> [!IMPORTANT]  
> This project is depending on Netlify. Please carefully read below

This project is depending on Netlify. Ideally external API calls should be done on server side to hide the api tokens on FE side (to not expose).
So initially it was implemented to use netlify functions because it is deployed.
But project has client side token storage so, we actually dont need.
If you want to run it without netlify, just move netlify functions under /app so your requests (to 3rd party) will be made on client side.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `npm run test`
* `npm run test:ember -- --server`

### Linting

* `npm run lint`
* `npm run lint:fix`

### Building

* `npm exec ember build` (development)
* `npm run build` (production)

### Deploying

Currently deployed to [https://ember-gh-repos.netlify.app/](https://ember-gh-repos.netlify.app/)


If you face any problem you can ask owner of this repo.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://cli.emberjs.com/release/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
