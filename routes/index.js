/**
 * 首页
 */
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  next();
});

// 测试git提交
router.get('/getToken', function(req, res, next){
    
})

module.exports = router;
