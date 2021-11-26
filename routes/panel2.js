var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');
var multer = require('multer');
var util = require('util');

const mysqlConnection = require('../database');
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

var panelDosRouter = express.Router();
panelDosRouter.use(express.json());

panelDosRouter.route('/')
.get((req, res) => {
    mysqlConnection.query('SELECT * FROM panel_2', (err, rows, fields) => {
        if(!err){
            res.json(rows)
        }
        else{
            console.log(err)
        }
    })
})

.post((req, res) => {
    const newPanel2 = req.body;
    mysqlConnection.query('INSERT INTO panel_2 SET ?', [newPanel2]);
    res.json(newPanel2)
});

panelDosRouter.route('/:id')
.get(async(req, res) => {
    const {id} = req.params;
    try {
        let sql = `SELECT * FROM panel_2 WHERE id = ${mysqlConnection.escape(id)}`;
        const rows = await query(sql);
        res.json(rows);
  } catch (error) {
        console.log(`Hay un error: ${error}`);    
    }
})

.put((req, res) => {
    const id = req.params.id;
    const updatedPanelDos = req.body;
    mysqlConnection.query('UPDATE panel_2 set ? WHERE id = ?', [updatedPanelDos, id]);
    res.json({
        message: "Panel 2 was Succesfully Updated"
    })
})

.delete((req, res) => {
    const id = req.params.id;
    mysqlConnection.query("DELETE FROM panel_2 WHERE id = ?", [id]);
    res.json({
        message: "Panel2 was Deleted Succesfully"
    })
})

module.exports = panelDosRouter;