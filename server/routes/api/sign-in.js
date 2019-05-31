const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const uuidv4 = require('uuid/v4');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cnl4ntucsie@gmail.com',
        pass: 'finalproject4!'
    }
});

module.exports = (app) => {
    //SignUp
    app.post('/api/account/signup', (req, res, next) => {
        console.log(process.env.HOST)
        const body = req.body;
        console.log(body);
        const {
            password
        } = body;

        const {
            name
        } = body;

        let {
            email
        } = body;

        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }

        email = email.toLowerCase();
        email = email.trim();

        User.find(
            {
                email: email,
            },
            (err, prevUsers) => {
                console.log(prevUsers);
                if (err) {
                    return res.status(500).send({
                        message: 'Error: Server Error',
                    });
                }
                else if (prevUsers.length != 0) {
                    return res.status(200).send({
                        message: 'Error: Account Already Exists'
                    })
                }
                else {
                    const newUser = new User();
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.name = name;
                    newUser.activation = uuidv4();

                    newUser.save((err, user) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'Error: Server Error',
                            });
                        }
                        else {
                            var mailOptions = {
                                from: 'cnl4ntucsie@gmail.com',
                                to: newUser.email,
                                subject: 'Activation Link',
                                text: 'Here is your link: http://linux1.csie.ntu.edu.tw:8080/api/account/activate?token=' + newUser.activation
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });

                            return res.status(200).send({
                                message: "Signed Up",
                            });
                        }

                    });
                }
            });
    });

    app.get('/api/account/activate', (req, res, next) => {
        console.log('get activation link')
        return res.status(200).send({
            message: "Account activated"
        });
    })

    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;

        const {
            password
        } = body;

        let {
            email
        } = body;

        if (!email) {
            return res.status(300).send({
                message: 'Error: Email cannot be blank.',
                respId: 'LIE1'
            });
        }

        if (!password) {
            return res.send({
                success: false,
                message: 'Error Password cannot be blank.',
                respId: 'LIE2',
            });
        }

        email = email.toLowerCase();
        email = email.trim();

        User.find({
            email: email
        }, (err, users) => {
            if (err) {
                console.log('err2:', err);
                return res.send({
                    success: false,
                    message: 'Error: server error',
                    respId: 'LIE3',
                });
            }

            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid',
                    respId: 'LIE4',
                });
            } else {
                const user = users[0];
                console.log(password, user.password);
                if (!user.validPassword(password)) {
                    return res.send({
                        success: false,
                        message: 'Error: Wrong Email or Password',
                        respId: 'LIE5',
                    });
                } else {
                    const userSession = new UserSession();
                    userSession.userId = user._id;
                    userSession.save((err, doc) => {
                        if (err) {
                            console.log(err);
                            return res.send({
                                success: false,
                                message: 'Error: Server Error',
                                respId: 'LIE6',
                            });
                        } else {
                            return res.send({
                                success: true,
                                message: 'Valid sign in',
                                token: doc._id,
                                name: user.name,
                                respId: 'LIS',
                            });
                        }

                    });
                }
            }



        });

    });

    app.get('/api/account/logout', (req, res, next) => {
        const { query } = req;
        const { token } = query;
        UserSession.findOneAndUpdate({
            _id: token,
            isDeleted: false,
        }, {
                $set: {
                    isDeleted: true,
                }
            }, null, (err, sessions) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        success: false,
                        message: 'Error: Server Error',
                    });
                } else {
                    return res.send({
                        success: true,
                        message: 'Logged Out',
                    });
                }
            });

    });

    app.get('/api/account/verify', (req, res, next) => {
        // Get the token
        const { query } = req;
        const { token } = query;
        // ?token=test
        // Verify the token is one of a kind and it's not deleted.
        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            } else {
                // DO ACTION
                return res.send({
                    success: true,
                    message: 'Good'
                });
            }
        });
    });
};
