const express = require('express');
const router = express.Router();
const login = require('./login');

module.exports = router;

router.post('/login', (request, response) => {
    login.login(request, (err, results) => {
        if (err || !results.token || results.token.length === 0) {
            response.status(403);
            response.json({
                message: "Invalid credentials"
            })
        } else {
            response.status(200);
            response.json({
                results
            });
        }
    });
});

router.get('/logout', (request, response) => {
    response.send("LOGGED OUT");
});
