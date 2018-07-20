const express = require('express');
const router = express.Router();
const login = require('./login');

module.exports = router;

router.post('/login', (request, response) => {
    login.login(request, (err, token) => {
        if (err || token.length === 0) {
            response.sendStatus(403);
        } else {
            response.status(200);
            response.json({
                token
            });
        }
    });
});

router.get('/logout', (request, response) => {
    response.send("LOGGED OUT");
});
