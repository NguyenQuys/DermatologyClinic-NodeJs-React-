const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const userRole = require("../enums/userRole.enum");

router.get("/getAll", userController.getAll);
router.get("/profile", authMiddleware.verifyRoles([userRole.ADMIN,userRole.CUSTOMER, userRole.DOCTOR, userRole.PHARMACIST]), userController.getProfile); 

router.post("/getById", userController.getById);
router.put("/update/:id", userController.update);
router.delete("/delete", userController.delete);

module.exports = router;
