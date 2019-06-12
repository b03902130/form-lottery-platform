var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// mongoose schema
var Form = require('../models/Form');
var Answer = require('../models/Answer')
var nodemailer = require('nodemailer');

// RESTFUL API

const data = {
    isFilled: false,
    isDue: false,
    winners: [],
    title: '',
    description: '',
    id: ''
};

// list all forms and organize with 3 categories: filled, notfilled, isDue
router.get('/', (req, res, next) => {
  // todo
  Form.find().sort('_id').catch(err => {console.log(err); res.status(500).send();}).then(forms => { // all forms
    Answer.find({
      'owner': req.session.userId,
    }).sort('form').catch(err => {console.log(err); res.status(500).send();}).then(answers => { // whether already filled
      let filledID = answers.map(answer => answer._doc.form.toString())
      forms = forms.map(form => ({
        isFilled: filledID.includes(form.id),
        isDue: form.isDue,
        winners: form.winners,
        title: form.title,
        description: form.description,
        id: form.id
      }))
      let due = []
      let filled = []
      let unfilled = []
      for (let form of forms) {
        if (form.isDue) {
          due.push(form)
        }
        else if (form.isFilled) {
          filled.push(form)
        }
        else {
          unfilled.push(form)
        }
      }
      res.status(200).send({
        due: due,
        filled: filled,
        unfilled: unfilled
      })
    })
  })
})

// list all forms created by request user
router.get('/my', (req, res, next) => {
  // todo
 Form.where({'owner': req.session.userId}).populate('owner').exec().catch(err => {console.log(err); res.status(500).send();}).then(forms => {
    res.status(200).send({
      form: forms
    })
  });
})

// send email
function sendEmail(transporter, email) {
  email = 'leo19941227@gmail.com'
  let mailOptions = {
    from: 'cnl4ntucsie@gmail.com',
    to: email,
    subject: 'You win a recent form filling',
    text: `Click the following link for advanced information: http://${process.env.HOST}:${process.env.FRONTEND_PORT}`
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({message: 'Email fail to send'})
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// make a form due, select 3 people who wins, and email them
router.get('/:id/due', (req, res, next) => {
  // todo
  Form.findOneAndUpdate({'_id': req.params.id}, {isDue: true}).populate('owner').exec().catch(err => {console.log(err); res.status(500).send();}).then(forms => {
    if (forms.length === 0) {
      res.status(404).send();
      return
    }
    if (forms.isDue){
      res.status(400).send('already due')	
      return
    }
    Answer.where({'form': req.params.id}).populate('owner').exec().catch(err => {console.log(err); res.status(500).send();}).then(answers => {
      var answers_num = answers.length;
      var wins = 3;
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'cnl4ntucsie@gmail.com',
          pass: 'finalproject4!'
        }
      });

      let results
      if(answers.length < wins){
        results = answers
      }
      else{
        let ran = Math.floor(Math.random() * (answers.length - wins));
        results = answers.slice(ran, wins)
      }
      results.forEach(result => {sendEmail(transporter, result.owner.email)})
      let winners = results.map(result => result.owner.name)
      Form.findOneAndUpdate({'_id': req.params.id}, {winners: winners}).catch(err => {console.log(err); res.status(500).send();}).then(docs => {
        res.status(200).send({
          winners: winners
        })
      })
    });
  });
})

// create
router.post('/', (req, res, next) => {
  const form = new Form({ ...req.body, owner: req.session.userId });
  form.save().catch(err => {console.log(err); res.status(500).send();}).then(doc => {
    res.status(200).send();
  });
});

// get specific form
router.get('/:id', (req, res, next) => {
  Form.where({"_id": req.params.id}).exec().catch(err => {console.log(err); res.status(500).send();}).then(docs => {
    if (docs.length === 0) {
      res.status(404).send()
      return 
    }
    res.status(200).send({ ...docs[0]._doc })
  });
})

// fill form
router.post('/:id', (req, res, next) => {
  const answer = new Answer({ ...req.body, form: req.params.id, owner: req.session.userId})
  answer.save().catch(err => {console.log(err); res.status(500).send();}).then(doc => {
    res.status(200).send();
  });
})

// get a form and all related answer
router.get('/:id/summary', (req, res, next) => {
  Form.where({'_id': req.params.id}).populate('owner').exec().catch(err => {console.log(err); res.status(500).send();}).then(forms => {
    if (forms.length === 0) {
      res.status(404).send();
      return
    }
    Answer.where({'form': req.params.id}).populate('owner').exec().catch(err => {console.log(err); res.status(500).send();}).then(answers => {
      res.status(200).send({
        form: forms[0]._doc,
        answers: answers.map(answer => ({ ...answer._doc, owner: answer.owner._doc}))
      })
    })
  })
})

// fill form
router.post('/:id/delete', (req, res, next) => {
  const answer = new Answer({ ...req.body, form: req.params.id, owner: req.session.userId})
  Form.findByIdAndRemove(req.params.id).catch(err => {console.log(err); res.status(500).send();}).then(doc => {
    Answer.deleteMany({ form: req.params.id}).catch(err => {console.log(err); res.status(500).send();}).then(doc => {
      res.status(200).send()
    })
  });
})


module.exports = router;

