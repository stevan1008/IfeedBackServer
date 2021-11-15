var express = require('express');
var router = express.Router();
const passport = require('passport');


const jwt = require('jsonwebtoken');
const mysqlConnection = require('../database');

/* GET users listing. */
router.get('/', (req,res)=>{
  mysqlConnection.query('select * from users', (err,rows,fields) => {
    if(!err){
      res.json(rows);
    }else{
      console.log(err);
    }
  })
});

router.post('/singin', (req,res) => {
  const { username, password } = req.body;
  mysqlConnection.query('select * from users where username=? and password=?',
  [username, password],
  (err,rows,fields) => {
    if(!err){
      if(rows.length >0){
        let data = JSON.stringify(rows[0]);
        const token = jwt.sign(data, 'stil');
        res.json({token});
      }else{
        res.json('Usuario o clave incorrectos');
      }
      
    }else{
      console.log(err);
    }
  }
  )
})

router.post('/test',verifyToken, (req,res) => {
  res.json('Informacion secreta');
})

function verifyToken(req,res, next){
  if(!req.headers.authorization)
   return res.status(401).json('No autorizado');

  const token = req.headers.authorization.substr(7);
  if(token!==''){
    const content = jwt.verify(token,'stil');
    req.data = content;
    next();
  }else{
    res.status(401).json('Token vacio');
  }
}



module.exports = router;
