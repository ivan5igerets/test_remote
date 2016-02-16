var express = require('express');
var app = express();

var loadRepo = require('./load-repo');
var commitsProcessor = require('./process-commits');
var commitsDB = {};
var allCommits = [];

loadRepo.then(commits => {
    console.log(`Loaded ${commits.length} commits`);
    allCommits = commits;
    commitsDB = commitsProcessor(commits);
});

var authorCommits = (authorEmail) => {
    if (commitsDB[authorEmail]) {
        return commitsDB[authorEmail];
    } else {
        return [];
    }
};

var shaEndsWithNumber = (sha) => {
    var lastChar = sha.charAt(sha.length - 1);
    return /[0-9]/.test(lastChar);
};

var printCommit = (commit) => {
    var response = '';
    if (shaEndsWithNumber(commit.sha)) {
        response += `<tr bgcolor="#E6F1F6">`;
    } else {
        response += `<tr>`;
    }
    response += `<td>${commit.sha}</td>`;
    response += `<td>${commit.email}</td>`;
    response += `<td>${commit.message}</td>`;
    response += `<tr/>`;
    return response;
};

var printCommits = (cmts) => {
    var response = '';
    response += '<table>';
    response += `<tr> <th>SHA</th> <th>Email</th> <th>Message</th> </tr>`;
    response += cmts.map(printCommit).join('\n');
    response += '</table>';
    return response;
};

app.get('/commits/:email', function (req, res) {
    var cmts = authorCommits(req.params.email);
    var response = '';
    response += 'Commits:';
    response += '<br>';
    response += printCommits(cmts);
    res.send(response);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});