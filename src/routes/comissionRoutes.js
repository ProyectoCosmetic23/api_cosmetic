const express = require('express');
const router = express.Router();
const comissionController = require ('../controllers/Comissions/comissionController');

router.get('/commissions', comissionController.getAllComs);
router.get('/commissions/:id', comissionController.getComsById);
router.post('/commissions', comissionController.createComs);
router.get('/commissions/employee/:id', comissionController.getComsEmploy);
router.get('/commissions/detail/:id', comissionController.getComsDetailId);


module.exports = router;