const express = require('express');
const router = express.Router();

module.exports = router;

router.post('/login', (request, response) => {
    if (request.body.password === 'password') {
        response.status(200);
        response.send('LOGGED IN');
    } else {
        response.status(403);
        response.send('Invalid login credentials');
    }
});

router.get('/logout', (request, response) => {
    response.send("LOGGED OUT");
});
