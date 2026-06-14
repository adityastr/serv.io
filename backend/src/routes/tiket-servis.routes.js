const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");
const { getAll, getById, create, update } = require("../controllers/tiket-servis.controller");

const router = express.Router();

router.use(authenticate);

const tiketValidation = [
    body("perangkat_id").notEmpty().withMessage("Perangkat wajib dipilih"),
    body("keluhan").notEmpty().withMessage("Keluhan wajib diisi"),
];

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authorize("admin"), tiketValidation, validate, create);
router.put("/:id", authorize("admin", "teknisi"), update);

module.exports = router;
