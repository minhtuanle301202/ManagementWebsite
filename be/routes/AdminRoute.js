const express = require('express');
const router = express.Router();
const adminControler = require('../Controllers/AdminController');
const middleware = require('../middleware/authMiddleware');
const userController = require('../controllers/UserController');
const userValidation = require('../validations/userValidation');
const monitoringStatusController = require('../controllers/MonitoringStatusController');
const notificationController = require('../controllers/NotificationController');

router.post('/login',adminControler.login);
router.post('/register',adminControler.register);
router.post('/logout',adminControler.logout);
router.get('/check-auth',middleware.authMiddlewareAdmin,adminControler.checkAuth);
router.post('/users',middleware.authMiddlewareAdmin,userValidation.validateRegister,userController.register);
router.get('/users',middleware.authMiddlewareAdmin,userController.getAllUsers);
router.patch('/users/:cardId',middleware.authMiddlewareAdmin,userController.updateUser);
router.get('/monitoringStatus',middleware.authMiddlewareAdmin,monitoringStatusController.getAllMonitoringStatus);
router.get('/notifications',middleware.authMiddlewareAdmin,notificationController.getAllNotifications);



module.exports = router;