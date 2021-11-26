var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');
var multer = require('multer');
var util = require('util');

const mysqlConnection = require('../database');
const f = require('session-file-store');
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

var conferencistasRouter = express.Router();
conferencistasRouter.use(express.json());

conferencistasRouter.route('/')
.get((req, res) => {
    mysqlConnection.query('SELECT * FROM conferencistas', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err)
        }
    })
})

.post((req, res) => {
    const newConference = req.body;
    mysqlConnection.query('INSERT INTO conferencistas SET ?', [newConference]);
    res.json({
        message: "Nuevo conferencista creado"
    });
})

conferencistasRouter.route("/:id")
.get(async(req, res) => {
    const {id} = req.params;
    try {
        let sql = `select * from conferencistas where id_conferencista = ${mysqlConnection.escape(id)}`;
        const rows = await query(sql);
        res.json(rows);
    } catch (error) {
        console.log(error);
    }
})

.put((req, res) => {
    const id = req.params.id;
    const conferenceUpdate = req.body;
    mysqlConnection.query('UPDATE conferencistas set ? WHERE id_conferencista = ?', [conferenceUpdate, id]);
    res.json({
        message: "El conferencista fue existosamente actualizado"
    })
})

.delete((req, res) => {
    const id = req.params.id;
    mysqlConnection.query('DELETE FROM conferencistas WHERE id_conferencistas = ?', [id]);
    res.json({
        message: "Conferencista fue eliminado"
    })
})


module.exports = conferencistasRouter;