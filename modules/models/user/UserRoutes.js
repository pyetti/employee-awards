const express = require('express');
const router = express.Router();
const userDb = require('./UserDb');
const mailer = require('../../mail/mailer');

module.exports = router;

router.get('/', function(req, res) {
    userDb.getUser(req.query, function (err, data) {
        if (err) {
            console.log(err);
            let status = data.status ? data.status : 500;
            res.status(status);
            res.json(data);
        } else {
            res.status(200);
            let users = [];
            data.forEach(user => {
                users.push({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    admin: user.admin,
                    company: user.company,
                    _id: user._id
                })
            });
            res.send(users);
        }
    });
});

router.post('/password', function (req, res) {
    userDb.getUser(req.body, function (err, data) {
        if (err) {
            console.log(err);
            let status = data.status ? data.status : 500;
            res.sendStatus(status);
        } else {
            const user = data[0];
            if (user) {
                mailer.sendPasswordRecoveryEmail(user.email, user.password, (err) => {
                    if (err) {
                        res.status(500);
                        res.json({ message: 'Failed to send email.'});
                    } else {
                        res.status(200);
                        res.json({ message: 'If the email exists, a message will be sent.'});
                    }
                });
            }

        }
    });
});

router.post('/user', function (req, res) {
    userDb.addUser(req, function (err, data) {
        if (err) {
            console.log(err);
            let status = data.status ? data.status : 500;
            res.status(status);
            res.json(data.message);
        } else {
            let status = data.status ? data.status : 200;
            res.status(status);
            res.send(data.message);
        }
    });
});

router.delete('/:id', function (req, res) {
    userDb.deleteUser(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            let status = data.status ? data.status : 500;
            res.status(status);
            res.json(data);
        } else {
            let status = data.status ? data.status : 200;
            res.status(status);
            res.json(data);
        }
    })
});
