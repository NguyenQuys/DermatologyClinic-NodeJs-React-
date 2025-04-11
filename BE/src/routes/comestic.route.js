const express = require("express");
const comesticController = require("../controllers/comestic.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userRole = require("../enums/userRole.enum");

// Products
router.get("/getAll", comesticController.getAll);
router.get("/getById/:id", comesticController.getById);
router.get("/getBySlug/:slug", comesticController.getBySlug);
router.post("/add", comesticController.addComestic);
router.post("/searchByName", comesticController.searchByName);
router.post("/sort", comesticController.sortByPrice);
router.put(
  "/update/:id",
  //authMiddleware.verifyRoles(userRole.ADMIN),
  comesticController.updateComestic
);
router.delete(
  "/delete/:id",
  authMiddleware.verifyRoles(userRole.ADMIN),
  comesticController.deleteComestic
);

// Reviews
router.post(
  "/review",
  authMiddleware.verifyRoles(userRole.CUSTOMER),
  comesticController.addReview
);
router.put(
  "/review",
  authMiddleware.verifyRoles(userRole.CUSTOMER),
  comesticController.updateReview
);
router.delete(
  "/review",
  authMiddleware.verifyRoles(userRole.CUSTOMER),
  comesticController.deleteReview
);

module.exports = router;
