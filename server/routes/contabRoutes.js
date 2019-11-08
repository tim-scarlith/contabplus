'use strict'
const express = require('express')

const appContabController = require('../controllers/contabController');
const userController = require('../controllers/usersController')
const router = express.Router()

router.route('/user').get(userController.getUser);

router.route('/accountData').get(userController.accountData);
router.route('/account').get(userController.createAccount);
router.route('/index').get(userController.index);
router.route('/sign').get(userController.sign);
router.route('/delete').get(userController.deteleUsers);



router.route('/home').get(userController.home);

module.exports = router;