const express = require("express");
const router = express.Router();
const comissionController = require("../controllers/Comissions/comissionController");
const { validarJWT } = require("../middlewares/validar-jwt");

router.get("/commissions", validarJWT, comissionController.getAllComs);
router.get("/commissions/:id", validarJWT, comissionController.getComsById);
router.post("/commissions", validarJWT, comissionController.createComs);
router.get("/commissions/employee/:id", comissionController.getComsEmploy);
router.get(
  "/commissions/filterEmployee/:dateToString",
  comissionController.getAllEmployeesFiltered
);
router.get("/commissions/detail/:id", comissionController.getComsDetailId);
router.get(
  "/commissions/orders/:id_employee/:month",
  comissionController.getSalesByEmployeeAndMonth
);

module.exports = router;
