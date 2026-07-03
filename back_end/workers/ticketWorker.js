const { Worker } = require("bullmq");
const { redisConnection } = require("../config/queue");
const { sequelize } = require("../config/config");
const { TicketType, Transaction, TransactionItem } = require("../models/associations");

const ticketWorker = new Worker(
  "ticket-transactions",
  async (job) => {
    const { transaction_id, payment_method, items } = job.data;
    console.log(`[Worker] Memproses transaksi ID: ${transaction_id}`);

    const dbTx = await sequelize.transaction();

    try {
      let total = 0;
      const preparedItems = [];

      // Logika pengecekan kuota Anda yang dulu (tetap dipertahankan di sini)
      for (const item of items) {
        const ticketType = await TicketType.findByPk(item.ticket_type_id, {
          transaction: dbTx,
          lock: dbTx.LOCK.UPDATE,
        });

        if (!ticketType || ticketType.sold_out || ticketType.quota < item.quantity) {
          throw new Error(`Tiket ${item.ticket_type_id} habis atau tidak ditemukan.`);
        }

        const price = Number(ticketType.price);
        const subtotal = price * item.quantity;
        total += subtotal;
        preparedItems.push({ ticketType, quantity: item.quantity, subtotal });
      }

      // Update transaksi tiruan tadi dari "in_queue" menjadi "pending" (menunggu pembayaran)
      const transaction = await Transaction.findByPk(transaction_id, { transaction: dbTx });
      await transaction.update({
        total_amount: total,
        status: "pending" 
      }, { transaction: dbTx });

      // Simpan item transaksi
      for (const item of preparedItems) {
        await TransactionItem.create({
          transaction_id: transaction.transaction_id,
          ticket_type_id: item.ticketType.ticket_type_id,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }, { transaction: dbTx });

        // Potong kuota tiket
        const newQuota = item.ticketType.quota - item.quantity;
        await item.ticketType.update({
          quota: newQuota,
          sold_out: newQuota <= 0
        }, { transaction: dbTx });
      }

      await dbTx.commit();
      console.log(`[Worker] Selesai! Transaksi ID ${transaction_id} BERHASIL.`);
    } catch (err) {
      await dbTx.rollback();
      console.log(`[Worker] Gagal! Transaksi ID ${transaction_id} DIBATALKAN: ${err.message}`);
      
      // Update status transaksi di DB menjadi failed jika kuota habis
      await Transaction.update({ status: "failed" }, { where: { transaction_id } });
    }
  },
  { connection: redisConnection }
);

module.exports = ticketWorker;