var config = require('config.json');
var express = require('express');
var router = express.Router();
var scoreService = require('services/score.service');

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
    scoreService.authenticate(req.body.username, req.body.password)
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
}*/

function register(req, res) {
    scoreService.create(req.body.score, req.body.flag)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    scoreService.getAll()
        .then(function (scores) {
            res.send(scores);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getOne(req, res) {
    scoreService.getById(req.params._id)
        .then(function (score) {
            if (score) {
                res.send(score);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    scoreService.getById(req.score.sub)
        .then(function (score) {
            if (score) {
                res.send(score);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    scoreService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    scoreService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
