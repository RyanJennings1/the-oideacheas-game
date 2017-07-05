var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('scores');

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

    db.scores.findOne({ username: username }, function (err, user) {
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
}
*/

function getAll() {
    var deferred = Q.defer();

    db.scores.find().toArray(function (err, scores) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(scores);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.scores.findById(_id, function (err, score) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (score) {
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

function create(scoreParam, flag) {
    var deferred = Q.defer();
    console.log("scoreParam", scoreParam);
    console.log("flag", flag);
    createScore();

    function createScore() {
        if (flag) {
          // set user object to scoreParam without the cleartext password
          // var user = _.omit(scoreParam, 'password', 'passwordConfirm');
          var score = scoreParam;

          // add hashed password to user object
          // user.hash = bcrypt.hashSync(scoreParam.password, 10);

          db.scores.insert(
              score,
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

function update(_id, scoreParam) {
    var deferred = Q.defer();

    function updateScore() {
        // fields to update
        var set = {
            name: scoreParam.name,
            age: scoreParam.age,
            time: scoreParam.time,
            score: scoreParam.score,
        };

        db.scores.update(
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

    db.scores.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
