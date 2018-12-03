require('dotenv').config();
var request = require('request');
var fs = require('fs');


// MARK: - Constants

// The directory in which to save images.
const FILE_DIRECTORY = './avatars/';


// MARK: Download
console.log('Welcome to the GitHub Avatar Downloader!');

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

function downloadImageByURL(url, filePath) {
  request.get(url).on('error', err => {
    throw err;
  }).on('response', response => {
    console.log('Response Status Code: ', response.statusCode);
    console.log('Response Status Message: ', response.statusMessage);
    console.log('Content Type: ', response.headers['content-type']);
  }).pipe(fs.createWriteStream(filePath));
}


// MARK: - Run

// [repoOwner, repoName]
const args = process.argv.slice(2);

if (!args[0] || !args[1]) {
  console.log('Please provide repository owner and name as arguments.');
} else {
  getRepoContributors(args[0], args[1], (err, result) => {
    if (err) { throw err; }

    // Loop through contributors and download their images.
    // Name images by their login name and assume .jpg
    for (contributor of result) {
      console.log(contributor.avatar_url);
      const filePath = FILE_DIRECTORY + contributor.login + '.jpg';
      downloadImageByURL(contributor.avatar_url, filePath);
    }
  });
}

