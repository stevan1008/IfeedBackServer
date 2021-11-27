var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');
var multer = require('multer');
var util = require('util');

const mysqlConnection = require('../database');
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

var panelTresRouter = express.Router();
panelTresRouter.use(express.json());

panelTresRouter.route('/')
.get((req, res) => {
    mysqlConnection.query('SELECT * FROM panel_3', (err, rows, fields) => {
        if(!err){
            res.json(rows)
        }
        else{
            console.log(err)
        }
    })
})

.post((req, res) => {
    const newPanel3 = req.body;
    mysqlConnection.query('INSERT INTO panel_3 SET ?', [newPanel3]);
    res.json(newPanel3)
});

panelTresRouter.route('/:id')
.get(async(req, res) => {
    const {id} = req.params;
    try {
        let sql = `SELECT * FROM panel_3 WHERE id = ${mysqlConnection.escape(id)}`;
        const rows = await query(sql);
        res.json(rows);
  } catch (error) {
        console.log(`Hay un error: ${error}`);    
    }
})

.put((req, res) => {
    const id = req.params.id;
    const updatedPanelTres = req.body;
    mysqlConnection.query('UPDATE panel_3 set ? WHERE id = ?', [updatedPanelTres, id]);
    res.json({
        message: "Panel 3 was Succesfully Updated"
    })
})

.delete((req, res) => {
    const id = req.params.id;
    mysqlConnection.query("DELETE FROM panel_3 WHERE id = ?", [id]);
    res.json({
        message: "Panel 3 was Deleted Succesfully"
    })
})

module.exports = panelTresRouter;