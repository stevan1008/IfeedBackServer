var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');

const mysqlConnection = require('../database');

var configRouter = express.Router();
configRouter.use(express.json());


configRouter.route('/')
.get((req, res) => {
    mysqlConnection.query('select * FROM config', (err,rows,fields) => {
        if(!err){
          res.json(rows);
        }else{
          console.log(err);
        }
    })
})

.post((req, res) => {
    const newEvento = req.body;
    mysqlConnection.query('INSERT INTO config SET ?', [newEvento]);
    res.json({
        message: 'New Event Created'
    })
})

.delete((req, res) => {
    mysqlConnection.query('DELETE * FROM config');
});

configRouter.route('/:id')
.get((req, res) => {
    const id = req.params.id;
    const evento = mysqlConnection.query('SELECT * FROM config WHERE id_evento = ?', [id]);
    res.json(evento[0]);
})

.put((req, res) => {
    const id = req.params.id;
    const updateEve = req.body;
    mysqlConnection.query('UPDATE config set ? WHERE id_evento = ?', [updateEve, id]);
    res.json({
        message: 'Event Updated'
    });
})

.delete((req, res) => {
    const id = req.params.id;
    mysqlConnection.query('DELETE FROM config WHERE id_evento = ?', [id]);
    res.json({
        message: "Event was deleted"
    })
})



module.exports = configRouter;

