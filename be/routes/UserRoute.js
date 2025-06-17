const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const userValidation = require('../validations/userValidation');
const monitoringStatusController = require('../controllers/MonitoringStatusController');
const middleware = require('../middleware/authMiddleware');

router.post('/login',userValidation.validateLogin, userController.login);
router.get('/getUserById',middleware.authMiddlewareUser,userController.getUserById);
router.get('/getUserByCardId/:cardId',userController.getUserByCardId);
router.get('/getInformation',middleware.authMiddlewareUser,userController.getUserById);
router.get('/getAreaByCardId/:cardId',userController.getAreaByCardId);
router.post('/monitoringStatus',monitoringStatusController.createMonitoringStatus);
router.patch('/monitoringStatus',monitoringStatusController.updateMonitoringStatus);


module.exports = router;

