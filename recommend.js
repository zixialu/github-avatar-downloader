require('dotenv').config();
var request = require('request');
var getRepoContributors = require('./getRepoContributors');


var starredRepos = {};
var orderedRepos = [];


// MARK: - Run

// [repoOwner, repoName]
const args = process.argv.slice(2);

// Ensure arguments are provided. Extra arguments will be ignored.
if (!args[0] || !args[1]) {
  console.log('Please provide repository owner and name as arguments.');
} else if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  // Invalid token
  console.log('Error: missing or invalid GitHub Personal Access Token!')
} else {
  console.log('Args and token OK');

  getRepoContributors(args[0], args[1], (err, contributors) => {
    if (err) { throw err; }

    // Iterate over contributors, then starred repos and counts them
    for (let contributor of contributors) {
      getStarredProjects(contributor.login, (err, repos) => {
        if (err) { throw err; }

        for (let repo of repos) {

          if (!starredRepos[repo.id]) {
            starredRepos[repo.id] = {
              name: repo.name,
              owner: repo.owner.login,
              count: 1
            };
          } else {
            starredRepos[repo.id].count++;
          }

          // TODO: Exit condition; done downloading
          if(/*EXIT CONDITION*/true) {
            getStarredReposCompletionHandler()
          }
        }
      });
    }


  });
}

function getStarredReposCompletionHandler() {
    // Copy values into an array for later sorting
    for (repo in starredRepos) {
      orderedRepos.push(starredRepos[repo]);
    };

    // Sort orderedRepos
    orderedRepos.sort((x, y) => { return x.count - y.count });

    // Print top 5 results
    orderedRepos.slice(0, 5);
    for (let repo of orderedRepos) {
      console.log(`[ ${repo.count} stars ] ${repo.owner} / ${repo.name}`);
    }
}

function getStarredProjects(login, cb) {

  // Make headers
  const options = {
    url: `https://api.github.com/users/${login}/starred`,
    headers: {
      'User-Agent': 'github-avatar-downloader',
      Authorization: 'token ' + process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    }
  };

  // Get JSON
  request(options, (err, response, body) => {

    // Make sure there's no error
    if (!response || response.statusCode !== 200) {
      console.log('An error has occured: ' + response.statusCode);
      return;
    }

    // Call callback
    cb(err, JSON.parse(body));
  });
}
