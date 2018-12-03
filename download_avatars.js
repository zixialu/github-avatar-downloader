require('dotenv').config()
var request = require('request');


// MARK: - Constants
const urlPrefix = 'https://api.github.com/repos/';


// MARK: Download
console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // e.g. https://api.github.com/repos/jquery/jquery/contributors
  const options = {
    url:`${urlPrefix}${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'github-avatar-downloader',
      Authorization: 'token ' + process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    }
  };
  request(options, (err, response, body) => {
    if (!response || response.statusCode !== 200) {
      console.log('An error has occured: ' + response.statusCode);
      return;
    }

    // Call callback
    cb(err, JSON.parse(body));

  });
}

// MARK: - Test
getRepoContributors("jquery", "jquery", function(err, result) {
  if (err) { throw err; }

  for (contributor of result) {
    console.log(contributor.avatar_url);
  }
});
