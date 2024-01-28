var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/sign_in', function(req, res, next) {
  res.render('sign_in', { title: 'sign_in' });
});


router.get('/sign_up', function(req, res, next) {
  res.render('sign_up', { title: 'sign_up' });
});
router.get('/foncier', function(req, res, next) {
  res.render('foncier', { title: 'foncier' });
});

router.get('/services', function(req, res, next) {
  res.render('services', { title: 'services' });
});


router.get('/about', function(req, res, next) {
  res.render('design', { title: 'design' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard' });
});
module.exports = router;
