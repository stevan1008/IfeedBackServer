var express = require('express');
const { accessSync } = require('fs');
var router = express.Router();
const passport = require('passport');
var multer = require('multer');
var util = require('util');
var fs = require('fs');

const mysqlConnection = require('../database');
const f = require('session-file-store');
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

