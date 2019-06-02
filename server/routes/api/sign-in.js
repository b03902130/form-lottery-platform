const User = require('../../models/User');
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
          
          var mailOptions = {
            from: 'cnl4ntucsie@gmail.com',
            to: newUser.email,
            subject: 'Activation Link',
            text: `Click to activate: http://${process.env.HOST}:${process.env.PORT}/api/account/activate?token=${newUser.activation}`
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              res.status(500).send({message: 'Email fail to send'})
            } else {
              console.log('Email sent: ' + info.response);
              newUser.save((err, user) => {
                if (err) {
                  return res.status(500).send({
                    message: 'Error: Server Error',
                  });
                }
                else {
                  return res.status(200).send({
                    message: "Signed Up",
                  });
                }
              });
            }
          });
        }
      });
  });

  app.get('/api/account/activate', (req, res, next) => {
    let token = req.query.token
    User.findOneAndUpdate({activation: token}, {isActivated: true}).catch(err => {console.log(err)}).then(doc => {
      if (doc === null) {
        return res.status(400).send('<h1>Account not existed</h1>')
      }
      else {
        return res.status(200).send(`<h1>Account activated</h1><p style="margin-left:10px">You can <a href="http://${process.env.HOST}:${process.env.FRONTEND_PORT}">login</a> now</p>`);
      }
    })
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
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: server error',
          respId: 'LIE3',
        });
      }

      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Account not existed',
          respId: 'LIE4',
        });
      } else {
        const user = users[0];
        if (!user.isActivated) {
          return res.send({
            success: false,
            message: `Error: Account not activated`,
            respId: 'LIE5',
          });
        }

        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            message: 'Error: Wrong Email or Password',
            respId: 'LIE5',
          });
        } else {
          req.session.userId = user._id
          req.session.name = user.name
          return res.send({
            success: true,
            message: 'Valid sign in',
            respId: 'LIS',
          });
        }
      }
    });
  });

  app.get('/api/account/logout', (req, res, next) => {
    req.session.destroy(() => {
      return res.redirect(`http://${process.env.HOST}:${process.env.FRONTEND_PORT}`);
    })
  })

  app.get('/api/account/verify', (req, res, next) => {
    // Verify the token is one of a kind and it's not deleted.
    if (req.session.userId) {
      return res.send({
        success: true,
        message: 'Good'
      });
    }
    else {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    }
  });
};
