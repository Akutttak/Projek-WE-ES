const users = require("./users");
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
