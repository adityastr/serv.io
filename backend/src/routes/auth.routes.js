const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { login, logout, me } = require("../controllers/auth.controller");

const router = express.Router();

router.post(
    "/login",
    [
        body("email").notEmpty().withMessage("Email wajib diisi"),
        body("password").notEmpty().withMessage("Password wajib diisi"),
    ],
    validate,
    login
);

router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

module.exports = router;
