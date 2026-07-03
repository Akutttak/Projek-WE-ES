const { sequelize } = require("../config/config");
const { ticketQueue } = require("../config/queue");
const {
  TicketType,
  Transaction,
  TransactionItem,
} = require("../models/associations");

function canAccessTransaction(req, transaction) {
  return req.user.role === "admin" || transaction.user_id === req.user.user_id;
}

// async function createTransaction(req, res) {
//   const dbTx = await sequelize.transaction();

//   try {
//     const { payment_method, items } = req.body;
//     console.log("=== CONTROLLER TRANSACTION: ISI REQ.USER ===", req.user);
//     console.log("=== CONTROLLER TRANSACTION: ISI REQ.YANGLOGIN ===", req.yanglogin);

//     // Jalur aman: Ambil dari req.user jika ada, jika tidak ada ambil dari req.yanglogin
//     const currentUser = req.user || req.yanglogin;

//     if (!currentUser) {
//       await dbTx.rollback();
//       return res.status(401).json({ message: "Data pengguna yang login tidak menerus ke controller." });
//     }

//     let total = 0;
//     const preparedItems = [];

//     for (const item of items) {
//       const ticketType = await TicketType.findByPk(item.ticket_type_id, {
//         transaction: dbTx,
//         lock: dbTx.LOCK.UPDATE,
//       });

//       if (!ticketType) {
//         await dbTx.rollback();
//         return res.status(404).json({ message: `Ticket type ${item.ticket_type_id} not found.` });
//       }

//       if (ticketType.sold_out || ticketType.quota < item.quantity) {
//         await dbTx.rollback();
//         return res.status(409).json({ message: `${ticketType.category_name} quota is not enough.` });
//       }

//       const price = Number(ticketType.price);
//       const subtotal = price * item.quantity;
//       total += subtotal;
//       preparedItems.push({ ticketType, quantity: item.quantity, subtotal });
//     }

//     const transaction = await Transaction.create(
//       {
//         user_id: currentUser.user_id,
//         total_amount: total,
//         payment_method,
//         status: "pending",
//       },
//       { transaction: dbTx },
//     );

//     for (const item of preparedItems) {
//       await TransactionItem.create(
//         {
//           transaction_id: transaction.transaction_id,
//           ticket_type_id: item.ticketType.ticket_type_id,
//           quantity: item.quantity,
//           subtotal: item.subtotal,
//         },
//         { transaction: dbTx },
//       );

//       const newQuota = item.ticketType.quota - item.quantity;
//       await item.ticketType.update(
//         { quota: newQuota, sold_out: newQuota <= 0 },
//         { transaction: dbTx },
//       );
//     }

//     await dbTx.commit();
//     const result = await Transaction.findByPk(transaction.transaction_id, {
//       include: [{ model: TransactionItem, as: "items" }],
//     });
//     return res.status(201).json({ message: "Transaction created.", transaction: result });
//   } catch (err) {
//     await dbTx.rollback();
//     return res.status(500).json({ message: "Create transaction failed.", details: err.message });
//   }
// }

async function createTransaction(req, res) { 
  // Biarkan transaksi database diurusi oleh Worker saja nanti.

  try {
    const { payment_method, items } = req.body;
    
    const currentUser = req.user || req.yanglogin;
    if (!currentUser) {
      return res.status(401).json({ message: "Data pengguna yang login tidak menerus ke controller." });
    }

    // Langsung buat record transaksi "kosong" dengan status antre.
    // Kita set total_amount menjadi 0 dulu, nanti Worker yang menghitung total aslinya.
    const transaction = await Transaction.create({
      user_id: currentUser.user_id,
      total_amount: 0,
      payment_method,
      status: "in_queue",
    });

    // Masukkan job ke BullMQ Redis. 
    // Data inilah yang akan dibaca dan dieksekusi satu per satu oleh Worker di background.
    await ticketQueue.add("process-ticket", {
      transaction_id: transaction.transaction_id,
      user_id: currentUser.user_id,
      payment_method,
      items,
    });

    // Hitung posisi antrean di depan dia
    const jobCounts = await ticketQueue.getJobCounts();
    const orangDiDepan = jobCounts.waiting || 0;

    // Langsung kembalikan respon ke user (Sangat cepat!).
    return res.status(202).json({ 
      message: "Anda telah masuk dalam antrean pembelian tiket.",
      transaction_id: transaction.transaction_id,
      status: "in_queue",
      queue_position: orangDiDepan, 
    });

  } catch (err) {
    // Jika gagal memasukkan data ke antrean Redis
    return res.status(500).json({ message: "Create transaction failed.", details: err.message });
  }
}

async function listTransactions(req, res) {
  try {
    const where = req.user.role === "admin" ? {} : { user_id: req.user.user_id };
    const transactions = await Transaction.findAll({
      where,
      include: [{ model: TransactionItem, as: "items" }],
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json({ transactions });
  } catch (err) {
    return res.status(500).json({ message: "Fetch transactions failed.", details: err.message });
  }
}

async function detailTransaction(req, res) {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [{ model: TransactionItem, as: "items" }],
    });
    if (!transaction) return res.status(404).json({ message: "Transaction not found." });
    if (!canAccessTransaction(req, transaction)) {
      return res.status(403).json({ message: "Access forbidden." });
    }
    return res.status(200).json({ transaction });
  } catch (err) {
    return res.status(500).json({ message: "Fetch transaction failed.", details: err.message });
  }
}

async function updateTransactionStatus(req, res) {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found." });
    await transaction.update({ status: req.body.status });
    return res.status(200).json({ message: "Transaction updated.", transaction });
  } catch (err) {
    return res.status(500).json({ message: "Update transaction failed.", details: err.message });
  }
}

async function deleteTransaction(req, res) {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found." });
    await transaction.destroy();
    return res.status(200).json({ message: "Transaction deleted." });
  } catch (err) {
    return res.status(500).json({ message: "Delete transaction failed.", details: err.message });
  }
}

module.exports = {
  createTransaction,
  listTransactions,
  detailTransaction,
  updateTransactionStatus,
  deleteTransaction,
};
