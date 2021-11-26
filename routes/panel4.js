var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');
var multer = require('multer');
var util = require('util');

const mysqlConnection = require('../database');
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

var panelCuatroRouter = express.Router();
panelCuatroRouter.use(express.json());

panelCuatroRouter.route('/')
.get((req, res) => {
    mysqlConnection.query('SELECT * FROM panel_4', (err, rows, fields) => {
        if(!err){
            res.json(rows)
        }
        else{
            console.log(err)
        }
    })
})

.post((req, res) => {
    const newPanel4 = req.body;
    mysqlConnection.query('INSERT INTO panel_4 SET ?', [newPanel4]);
    res.json(newPanel4)
});

panelCuatroRouter.route('/:id')
.get(async(req, res) => {
    const {id} = req.params;
    try {
        let sql = `SELECT * FROM panel_4 WHERE id = ${mysqlConnection.escape(id)}`;
        const rows = await query(sql);
        res.json(rows);
  } catch (error) {
        console.log(`Hay un error: ${error}`);    
    }
})

.put((req, res) => {
    const id = req.params.id;
    const updatedPanelCuatro = req.body;
    mysqlConnection.query('UPDATE panel_4 set ? WHERE id = ?', [updatedPanelCuatro, id]);
    res.json({
        message: "Panel 1 was Succesfully Updated"
    })
})

.delete((req, res) => {
    const id = req.params.id;
    mysqlConnection.query("DELETE FROM panel_4 WHERE id = ?", [id]);
    res.json({
        message: "Panel4 was Deleted Succesfully"
    })
})

module.exports = panelCuatroRouter;