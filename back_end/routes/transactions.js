const express = require("express");
const { verifyJWT, allowRoles } = require("../middlewares/verifyJWT");
const { devBypass } = require("../middlewares/devBypass");
const { validateBody, Joi } = require("../middlewares/validators");
const controller = require("../controllers/transactionController");

const router = express.Router();

const transactionSchema = Joi.object({
  payment_method: Joi.string().valid("gopay", "ovo", "qris").required(),
  items: Joi.array()
    .items(
      Joi.object({
        ticket_type_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().min(1).max(10).required(),
      }),
    )
    .min(1)
    .required(),
});

const statusSchema = Joi.object({
  status: Joi.string().valid("pending", "success", "failed").required(),
});

router.post(
  "/api/transactions",
  devBypass,
  validateBody(transactionSchema),
  controller.createTransaction,
);
router.get("/api/transactions", verifyJWT, controller.listTransactions);
router.get("/api/transactions/queue/:id", controller.checkQueueStatus);
router.get("/api/transactions/:id", verifyJWT, controller.detailTransaction);
router.put(
  "/api/transactions/:id/status",
  verifyJWT,
  allowRoles("admin"),
  validateBody(statusSchema),
  controller.updateTransactionStatus,
);
router.delete(
  "/api/transactions/:id",
  verifyJWT,
  allowRoles("admin"),
  controller.deleteTransaction,
);
router.post("/api/transactions/midtrans/:id", verifyJWT, controller.getMidtrans);
router.get("/api/transactions/midtrans/:id", verifyJWT, controller.getMidtransStatus);

module.exports = router;
