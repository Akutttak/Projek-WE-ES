const users = require("./users");
const transactions = require("./transactions");
let admin;
try {
  admin = require("./admin");
} catch (e) {
  admin = null;
}

module.exports = {
  users,
  admin,
  transactions,
};
