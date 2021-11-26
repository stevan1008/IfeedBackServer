var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');
var multer = require('multer');
var util = require('util');

const mysqlConnection = require('../database');
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

var panelesRouter = express.Router();
panelesRouter.use(express.json());

panelesRouter.route('/')
.get((req, res) => {
    mysqlConnection.query('SELECT * FROM panels', (err, rows, fields) => {
        if(!err){
            res.json(rows)
        }
        else{
            console.log(err)
        }
    })
})

.post((req, res) => {
    const newPanel = req.body;
    mysqlConnection.query('INSERT INTO panels SET ?', [newPanel]);
    res.json(newPanel);
});

panelesRouter.route('/:id')
.get(async(req, res) => {
    const {id} = req.params;
    console.log(`El id es: ${id}`);
    try {
        let sql = `select * from panels where id_panel = ${mysqlConnection.escape(id)}`;
        const rows = await query(sql);
        res.json(rows);
    } catch (error) {
        console.log(`Hay un error: ${error}`)
    }
})

.put((req, res) => {
    const id = req.params.id;
    const updatePanel = req.body;
    mysqlConnection.query('UPDATE panels set ? WHERE id_panel = ?', [updatePanel, id]);
    res.json({
        message: "Panel was updated Succesfully"
    })
})

.delete((req, res) => {
    const id = req.params.id;
    mysqlConnection.query('DELETE FROM panels WHERE id_panel = ?', [id]);
    res.json({
        message: "Panel was deleted Succesfully"
    })
})


module.exports = panelesRouter;