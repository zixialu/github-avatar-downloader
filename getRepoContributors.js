function getRepoContributors(repoOwner, repoName, cb) {
  // Make headers
  const options = {

    // e.g. https://api.github.com/repos/jquery/jquery/contributors
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
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

module.exports = getRepoContributors;
