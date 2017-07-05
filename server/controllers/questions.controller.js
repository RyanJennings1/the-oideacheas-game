var config = require('config.json');
var express = require('express');
var router = express.Router();
var questionService = require('services/question.service');

// routes
// router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/:_id', getOne);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

/*
function authenticate(req, res) {
    questionService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
*/

function register(req, res) {
    questionService.create(req.body.question, req.body.flag)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    questionService.getAll()
        .then(function (questions) {
            res.send(questions);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getOne(req, res) {
    questionService.getById(req.params._id)
        .then(function (question) {
            if (question) {
                res.send(question);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    questionService.getById(req.question.sub)
        .then(function (question) {
            if (question) {
                res.send(question);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    questionService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    questionService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
