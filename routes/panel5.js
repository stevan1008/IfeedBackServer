var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');
var multer = require('multer');
var util = require('util');

const mysqlConnection = require('../database');
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

var panelCincoRouter = express.Router();
panelCincoRouter.use(express.json());

panelCincoRouter.route('/')
.get((req, res) => {
    mysqlConnection.query('SELECT * FROM panel_5', (err, rows, fields) => {
        if(!err){
            res.json(rows)
        }
        else{
            console.log(err)
        }
    })
})

.post((req, res) => {
    const newPanel5 = req.body;
    mysqlConnection.query('INSERT INTO panel_5 SET ?', [newPanel5]);
    res.json(newPanel5)
});

panelCincoRouter.route('/:id')
.get(async(req, res) => {
    const {id} = req.params;
    try {
        let sql = `SELECT * FROM panel_5 WHERE id = ${mysqlConnection.escape(id)}`;
        const rows = await query(sql);
        res.json(rows);
  } catch (error) {
        console.log(`Hay un error: ${error}`);    
    }
})

.put((req, res) => {
    const id = req.params.id;
    const updatedPanelCinco = req.body;
    mysqlConnection.query('UPDATE panel_5 set ? WHERE id = ?', [updatedPanelCinco, id]);
    res.json({
        message: "Panel 5 was Succesfully Updated"
    })
})

.delete((req, res) => {
    const id = req.params.id;
    mysqlConnection.query("DELETE FROM panel_5 WHERE id = ?", [id]);
    res.json({
        message: "Panel5 was Deleted Succesfully"
    })
})

module.exports = panelCincoRouter;