var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('questions');

var service = {};

// service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

/*
function authenticate(username, password) {
    var deferred = Q.defer();

    db.questions.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}*/

function getAll() {
    var deferred = Q.defer();

    db.questions.find().toArray(function (err, questions) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(questions);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.questions.findById(_id, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (question) {
            // return user (without hashed password)
            // deferred.resolve(_.omit(user, 'hash'/*, 'password', 'passwordConfirm'*/));
            deferred.resolve();
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(questionParam, flag) {
    var deferred = Q.defer();

    // validation
    db.questions.findOne(
        { q: questionParam.q },
        function (err, question) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (question) {
                // username already exists
                deferred.reject('Question "' + questionParam.q + '" is already taken');
            } else {
                //flag = true;
                createQuestion();
            }
        });

    function createQuestion() {
        if (flag) {
          var question = questionParam;

          db.questions.insert(
              question,
              function (err, doc) {
                  if (err) deferred.reject(err.name + ': ' + err.message);

                  deferred.resolve();
              });
        }

        if (!flag) {
          deferred.resolve();
        }
    }
    return deferred.promise;
}

function update(_id, questionParam) {
    var deferred = Q.defer();

    // validation
    db.questions.findById(_id, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (question.q !== questionParam.q) {
            // username has changed so check if the new username is already taken
            db.questions.findOne(
                { q: questionParam.q },
                function (err, question) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (question) {
                        // username already exists
                        deferred.reject('Question "' + req.body.q + '" is already taken')
                    } else {
                        updateQuestion();
                    }
                });
        } else {
            updateQuestion();
        }
    });

    function updateQuestion() {
        // fields to update
        var set = {
            q: questionParam.q,
            ans1: questionParam.ans1,
            ans2: questionParam.ans2,
            ans3: questionParam.ans3,
            ans4: questionParam.ans4,
            rightAnswer: questionParam.rightAnswer,
            topic: questionParam.topic,
        };

        // update password if it was entered
        /*
        if (questionParam.password) {
            set.hash = bcrypt.hashSync(questionParam.password, 10);
        }*/

        db.questions.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.questions.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
