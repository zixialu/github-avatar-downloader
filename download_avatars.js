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
      'User-Agent': 'github-avatar-downloader'
    }
  };
  request(options, (err, response, body) => {
    cb(err, body);
  });
}

// MARK: - Test
getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});
