var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');
var multer = require('multer');
var util = require('util');

const mysqlConnection = require('../database');
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

var panelUnoRouter = express.Router();
panelUnoRouter.use(express.json());

panelUnoRouter.route('/')
.get((req, res) => {
    mysqlConnection.query('SELECT * FROM panel_1', (err, rows, fields) => {
        if(!err){
            res.json(rows)
        }
        else{
            console.log(err)
        }
    })
})

.post((req, res) => {
    const newPanel1 = req.body;
    mysqlConnection.query('INSERT INTO panel_1 SET ?', [newPanel1]);
    res.json(newPanel1)
});

panelUnoRouter.route('/:id')
.get(async(req, res) => {
    const {id} = req.params;
    try {
        let sql = `SELECT * FROM panel_1 WHERE id = ${mysqlConnection.escape(id)}`;
        const rows = await query(sql);
        res.json(rows);
  } catch (error) {
        console.log(`Hay un error: ${error}`);    
    }
})

.put((req, res) => {
    const id = req.params.id;
    const updatedPanelUno = req.body;
    mysqlConnection.query('UPDATE panel_1 set ? WHERE id = ?', [updatedPanelUno, id]);
    res.json({
        message: "Panel 1 was Succesfully Updated"
    })
})

.delete((req, res) => {
    const id = req.params.id;
    mysqlConnection.query("DELETE FROM panel_1 WHERE id = ?", [id]);
    res.json({
        message: "Panel1 was Deleted Succesfully"
    })
})

module.exports = panelUnoRouter;