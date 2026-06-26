const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { adminDashboard, teknisiDashboard, teknisiList, exportActivities } = require("../controllers/dashboard.controller");

const router = express.Router();

router.use(authenticate);

router.get("/admin", authorize("admin"), adminDashboard);
router.get("/teknisi", authorize("teknisi"), teknisiDashboard);
router.get("/teknisi-list", authorize("admin"), teknisiList);
router.get("/activities/export", authorize("admin"), exportActivities);

module.exports = router;
