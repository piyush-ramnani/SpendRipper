const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:02041996@practisecluster.agvl9l9.mongodb.net/paytm-db?appName=mongosh+2.1.3"
);

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: [true, "can't be blank"],
  },
  balance: Number,
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
});

accountSchema.methods.debit = async function (amount) {
  this.balance -= amount;
  await this.save(); // Update the balance in the database
};

// Credit method example
accountSchema.methods.credit = async function (amount) {
  this.balance += amount;
  await this.save();
};

const userSchema = new mongoose.Schema({
  userId: String,
  firstName: { type: String, required: true },
  lastName: String,
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  account: { type: String, unique: true },
});

const transactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = {
  User,
  Account,
  Transaction,
};
