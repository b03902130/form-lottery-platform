var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// mongoose schema
var Form = require('../models/Form');
var Answer = require('../models/Answer')


// RESTFUL API

// list all forms and organize with 3 categories: filled, notfilled, isDue
router.get('/', (req, res, next) => {
  // todo
})

// list all forms created by request user
router.get('/my', (req, res, next) => {
  // todo
})


// make a form due, select 3 people who wins, and email them
router.get('/:id/due', (req, res, next) => {
  // todo
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



module.exports = router;

