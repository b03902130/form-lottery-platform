var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// mongoose schema
var Form = require('../models/Form');


// RESTFUL API

// create
router.post('/', (req, res, next) => {
  const form = new Form({ ...req.body, owner: req.session.userId });
  form.save().catch(err => {console.log(err); res.status(500).send({success: false});}).then(doc => {
    res.status(200).send({ success: true, formid: doc.id });
  });
});

// // edit: cause teacher information is public, no need to check the authorization
// router.get('/:id/edit/', (req, res, next) => {
//   Teacher.where("_id", req.params.id).exec().catch(err => { dealServerError(err, res); }).then(docs => {
//     docs = organizeOutputTeacher(docs);
//     if (docs.length === 0) {
//       res.status(400).send("Teacher unexisted");
//     }
//     else {
//       res.status(200).send({ info: docs[0] });
//     }
//   });
// });

// // show the course of a specific teacher
// router.get('/:id/courses/', (req, res, next) => {
//   Course.where("teacherid", req.params.id).populate("teacherid").exec().catch(err => { dealServerError(err, res); }).then(docs => {
//     docs = organizeOutputCourse(docs);
//     res.status(200).send({ courses: docs });
//   });
// });

// // update
// router.post('/:id/put/', checkSession, checkTeacherId, organizeInputTeacher, (req, res, next) => {
//   Teacher.updateOne({ _id: req.params.id }, req.body.data).exec().catch(err => { dealServerError(err, res); }).then(docs => {
//     if (docs.length === 0) {
//       res.status(400).send("Teacher unexisted");
//     }
//     res.status(200).send();
//   });
// });

// // destroy
// router.get('/:id/delete/', checkSession, checkTeacherId, (req, res, next) => {
//   Teacher.deleteMany({ _id: req.params.id }).catch(err => { dealServerError(err, res); }).then(docs => {
//     Course.deleteMany({ teacherid: req.params.id }).catch(err => { dealServerError(err, res); }).then(docs => {
//       res.status(200).send();
//     });
//   });
// });

module.exports = router;

