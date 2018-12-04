require('dotenv').config();
var request = require('request');
var getRepoContributors = require('./getRepoContributors');


var starredRepos = {};


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
  getRepoContributors(args[0], args[1], (err, result) => {
    if (err) { throw err; }

    // Iterate over contributors, then starred repos and counts them
    for (contributor of result) {
      getStarredProjects(contributor.login, (err, result) => {
        if (err) { throw err; }

        for (let repo of result) {
          if (!starredRepos[repo.id]) {
            starredRepos[repo.id] = {
              name: repo.name,
              owner: owner.login,
              count: 1
            };
          } else {
            starredRepos[repo.id].count++;
          }
        }
      });
    }

    // Find the most counted repos
    for(repo in starredRepos) {
      // TODO: move repo objects into an array sorted by most starred
    }

    // Print results


  });
}

function getStarredProjects(login, cb) {

  // Make headers
  const options = {
    url: `https://api.github.com/users/${contributor.login}/starred`,
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
