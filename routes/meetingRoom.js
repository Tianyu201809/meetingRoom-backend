/**
 * meeting room 的增删改查情况
 */

var express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken')
const meetingRoom = require('../models/meetingRoom')