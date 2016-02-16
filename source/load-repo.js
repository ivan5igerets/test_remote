var Octokat = require('octokat');
var octo = new Octokat({
  token: 'f40931d39e1b2434e4e4936ac80d4932ebd8c913'
});

var allCommits = [];

var shorterCommit = (commit) => {

    return {
        sha: commit.sha,
        committer: commit.commit.committer.name,
        email: commit.commit.committer.email,
        message: commit.commit.message
    };
};

var processCommits = commits => {
    var shortifiedCommits = commits.map(shorterCommit);
    allCommits = allCommits.concat(shortifiedCommits);
    return commits.nextPage();
};

var promise = octo.repos('nodejs', 'node').commits.fetch()
    .then(processCommits)
    .then(processCommits)
    .then(processCommits)
    .then(commits => {
        return allCommits;
    });

module.exports = promise;