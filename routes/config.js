var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');
var multer = require('multer');
var util = require('util');
var fs = require('fs');

const mysqlConnection = require('../database');
const f = require('session-file-store');
const { render } = require('../app');
const { decodeBase64 } = require('bcryptjs');
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage });


var configRouter = express.Router();
configRouter.use(express.json());

configRouter.route('/')
.get((req, res) =>  {
    mysqlConnection.query('select * FROM config', (err,rows,fields) => {
        if(!err){
          res.json(rows);
        }else{
          console.log(err);
        }
    })
})

.post(async(req, res) => {
    const newEvento = req.body;
    mysqlConnection.query('INSERT INTO config SET ?', [newEvento]);
    res.json({
        message: "New Envent Created"
    })
/*     try{
        var data = {
            id : req.body.id_evento,
            name : req.body.name_event,
            paneles : req.body.n_paneles,
            image : req.file
        }
        console.log(data);
        let result = await mysqlConnection.query('INSERT INTO config SET ?', [data], (res, err) => {
            if (err) {
                res.send({
                    message: "An Error Was Ocurred",
                })
            }
            else{
                res.send({
                    message: "Succesfully created Event with id:" + id,
                })
            }
        })
    }
    catch(err) {
        console.log(err)
    }
}) */
/*     const newEvento = req.body;
    mysqlConnection.query('INSERT INTO config SET ?', [newEvento], (err, res) => {
        if(err){
            res.send({
                message: "An error was ocurred"
            })
        }
        else{
            res.send({message: "new Event was created"})
        }
    }) */
}) 


configRouter.route('/settings')
.delete((req, res) => {
    mysqlConnection.query('DELETE * FROM config');
});

configRouter.route('/:id')
.get(async(req, res) => {
    const {id} = req.params;
    console.log(`El id es: ${id}`)
    try {
        let sql = `select * from config where id_evento = ${mysqlConnection.escape(id)}`;
        const rows = await query(sql);
        res.json(rows);
    } catch (error) {
        console.log(`Hay un error: ${error}`)
    }
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
});

configRouter.route('/upload')
.get(async (req, res) => {
    const id = req.params.id;
    const con = mysqlConnection;
    const evento =  await con.query("SELECT * FROM config WHERE id_evento = ?", [id]);
    console.log(evento)
    return res.json(evento);
})

.post(upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(file.filename);
    if (!file){
        const error = new Error('Please Upload an Image');
        error.statusCode = 400;
        return next(error)
    }
    else{
        res.send(file);
    }
});


configRouter.route('/images')
.get(async (req, res) => {
    fs.readFile(`../uploads/${req.query.filename}`, (err, res) => {
        if (err) throw err;
        res.statusCode = 200;
        res.setHeader('content-type', 'image/png');
        res.end(data.String('base64'));
    })
})



module.exports = configRouter;

