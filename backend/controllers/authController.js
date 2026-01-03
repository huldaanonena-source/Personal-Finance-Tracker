const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => { /* ton code existant */ };
exports.login = async (req, res) => { /* ton code existant */ };
exports.getProfile = async (req, res) => { /* ton code existant */ };
