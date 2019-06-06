var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// mongoose schema
var Form = require('../models/Form');
var Answer = require('../models/Answer')


// RESTFUL API

// create
router.post('/', (req, res, next) => {
  const form = new Form({ ...req.body, owner: req.session.userId });
  form.save().catch(err => {console.log(err); res.status(500).send({success: false});}).then(doc => {
    res.status(200).send({ success: true, formid: doc.id });
  });
});

// get form
router.get('/:id', (req, res, next) => {
  Form.where({"_id": req.params.id}).exec().catch(err => {console.log(err); res.status(500).send({success: false});}).then(docs => {
    res.status(200).send({ ...docs[0]._doc })
  });
})

// fill form
router.post('/:id', (req, res, next) => {
  const answer = new Answer({ ...req.body, form: req.params.id, owner: req.session.userId})
  answer.save().catch(err => {console.log(err); res.status(500).send({success: false});}).then(doc => {
    res.status(200).send({ success: true });
  });
})


module.exports = router;

