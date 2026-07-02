const express = require("express");
const { auth, allowRoles } = require("../middlewares/auth");
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

router.post("/api/transactions", auth, validateBody(transactionSchema), controller.createTransaction);
router.get("/api/transactions", auth, controller.listTransactions);
router.get("/api/transactions/:id", auth, controller.detailTransaction);
router.put(
  "/api/transactions/:id/status",
  auth,
  allowRoles("admin"),
  validateBody(statusSchema),
  controller.updateTransactionStatus,
);
router.delete(
  "/api/transactions/:id",
  auth,
  allowRoles("admin"),
  controller.deleteTransaction,
);

module.exports = router;
