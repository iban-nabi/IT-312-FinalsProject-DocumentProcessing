const express = require('express');
const router = express.Router();
const dbservice = require("../../database_service/common_queries");

// Display the login form
router.get('/', (req, res) => {
    if (req.session.user) {
        if (req.session.user.deptName) {
            res.redirect('/reviewer-home');
        } else {
            res.redirect('/requester-home');
        }
        // User is logged in

    } else {
        res.render('index');
    }
});

// Process login form submission
router.post('/', (req, res) => {

    const { username, password } = req.body;

    const db = dbservice.getCommonService();
    const result = db.verifyUser(username, password);

    result.then(data => {
        if (data.length === 1 && data[0].acct_type != "ADMIN") {
            req.session.user = {
                username: username,
                accountID: data[0].acct_id,
                acctType: data[0].acct_type,
                deptName: data[0].dept_name,
                firstName: data[0].acct_fname,
                lastName: data[0].acct_lname
            };

            if (data[0].acct_type === "REQUESTER") {
                res.redirect('/requester-home');
            } else {
                res.redirect('/reviewer-home');
            }

        } else if (data.length === 1 && data[0].acct_type === "ADMIN") {
            res.render('index', { error: 'Website does not support admin login' });

        } else {
            // Authentication failed
            res.render('index', { error: 'Invalid username or password' });
        }
    });
});

module.exports = router;