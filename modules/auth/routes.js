const express = require('express');
const router = express.Router();
const login = require('./login');

module.exports = router;

router.post('/login', (request, response) => {
    login.login(request, (err, results) => {
        if (err || !results.token || results.token.length === 0) {
            response.status(500);
            response.json({
                message: "Invalid credentials"
            })
        } else {
            let status = results.status ? results.status : 200;
            response.status(status);
            response.json({
                results
            });
        }
    });
});