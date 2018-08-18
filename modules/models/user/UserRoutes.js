const express = require('express');
const router = express.Router();
const userDb = require('./UserDb');
const mailer = require('../../mail/mailer');
const tokenGenerator = require('../../auth/tokenManager');
const crypto = require('../../crypto/crypto');
const fs = require('fs');

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
            const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
            data.forEach(user => {
                users.push({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    admin: user.admin,
                    company: user.company,
                    created_on: user.created_on,
                    _id: user._id,
                    self: baseUrl + user._id,
                    signature_image: ''
                })
            });
            res.send(users);
        }
    });
});

router.get('/:userId', function(req, res) {
    userDb.getUser({_id: req.params.userId}, function (err, data) {
        if (err) {
            console.log(err);
            let status = data.status ? data.status : 500;
            res.status(status);
            res.json(data);
        } else {
            res.status(200);
            let users = [];
            const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
            data.forEach(user => {
                users.push({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    admin: user.admin,
                    company: user.company,
                    created_on: user.created_on,
                    _id: user._id,
                    self: baseUrl + user._id,
                    signature_image: bson.deserialize(user.signature_image.data, {})
                })
            });
            res.send(users);
        }
    });
});

router.post('/password', function (req, res) {
    const user = {
        email: crypto.decrypt(req.body.email),
        password: req.body.password
    };
    userDb.updateUser(user, (err, data) => {
        if (err) {
            const status = data.status ? data.status : 500;
            res.status(status);
            res.json({data});
            return;
        }
        const status = data.status ? data.status : 200;
        res.status(status);
        if (status === 200) {
            res.json({data: data.user});
        } else {
            res.json({data: data.message});
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
            if (status === 200) {
                mailer.sendNewUserEmail(data.user);
            }
            res.status(status);
            res.send(data.message);
        }
    });
});

router.get('/password/:email', function (req, res) {
    const object = {key: Math.random().toString(36).substring(2, 12)};
    tokenGenerator.generateToken(object, (err, token) => {
        if (err) {
            res.status(500);
            res.json({
                errorMessage: "Please try again"
            });
            return;
        }
        const encryptedEmail = crypto.encrypt(req.params.email);
        mailer.sendPasswordRecoveryEmail(req.params.email, encryptedEmail, token, (err) => {
            if (err) {
                res.status(500);
                res.json({ message: 'Failed to send email.'});
            } else {
                res.status(200);
                res.json({
                    message: 'If the email exists, a message will be sent.',
                    token
                });
            }
        });
    });
});

router.patch('/:id', function (req, res) {
    userDb.updateUser(req.body, function (err, result) {
        if (err) {
            console.log(err);
            let status = data.status ? data.status : 500;
            res.status(status);
            res.json(data);
        } else {
            let status = result.status ? result.status : 200;
            res.status(status);
            res.json({user: result.user});
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

router.post('/latex', function (req, res) {
    res.send('received a POST')

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var awardType = req.body.awardType;
    var awardCreator = req.body.awardCreator;
    var datetime12 = req.body.datetime12;

    var fileContent =

        `
            \\documentclass{article}
            \\title{Cartesian closed categories and the price of eggs}
            \\author{Jane Doe}
            \\date{September 1994}
            \\begin{document}
            \\maketitle
        `
        +

        `\\noindent First Name: ` +firstName+
        `\\newline Last Name: ` +lastName+
        `\\newline Email: ` +email+
        `\\newline Award Type: ` +awardType+
        `\\newline Award Creator: ` +awardCreator+
        `\\newline Date and Time: ` +datetime12+

        `
            \\end{document}

        `


    var filePath = "form.tex"

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) throw err;
        console.log("The file was successfully created.");''
    })

    exec('pdflatex form.tex', function(error, stdout, stderr) {
        if (error) {
        console.log(error.code);
        }
    });


});