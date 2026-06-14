const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");
const { getAll, getById, create, update, remove } = require("../controllers/perangkat.controller");

const router = express.Router();

router.use(authenticate);

const perangkatValidation = [
    body("customer_id").notEmpty().withMessage("Customer wajib dipilih"),
    body("jenis_perangkat").notEmpty().withMessage("Jenis perangkat wajib diisi"),
    body("merek").notEmpty().withMessage("Merek wajib diisi"),
    body("model").notEmpty().withMessage("Model wajib diisi"),
];

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authorize("admin"), perangkatValidation, validate, create);
router.put("/:id", authorize("admin"), perangkatValidation, validate, update);
router.delete("/:id", authorize("admin"), remove);

module.exports = router;
