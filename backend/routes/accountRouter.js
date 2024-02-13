const express = require("express");
const { Router } = require("express");
const router = Router();

router.use(express.json());

const { User, Account, Transaction } = require("../db/db");
const { authMiddleware } = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");

router.get("/balance", authMiddleware, async (req, res) => {
  const username = req.authData; //username from auth.js

  try {
    const existingUser = await User.findOne({ username: username }); //---(1)
    if (existingUser) {
      const account = existingUser.account;
      const accDetails = await Account.findOne({ accountNumber: account }); //---(2)
      if (accDetails) {
        res
          .status(200)
          .send({ balance: accDetails.balance, owner: accDetails.owner });
      } else {
        res.status(404).send({ message: "Account not found" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const username = req.authData;
  const { amount, to } = req.body;

  const session = await mongoose.startSession();

  session.startTransaction();
  console.log("session Transaction starts...");
  try {
    const existingUser = await User.findOne({ username: username }).session(
      session
    );

    //sender acc details
    const userAcc = await Account.findOne({
      accountNumber: existingUser.account,
    }).session(session);

    console.log("senders account: ", userAcc);

    //receiver acc details
    const receiverAcc = await Account.findOne({ accountNumber: to }).session(
      session
    );

    console.log("receiver's acc: ", receiverAcc);

    if (!receiverAcc || userAcc.balance < amount) {
      await session.abortTransaction();
      return res.status(404).json({
        error: "Problem verifying account details, please try again!",
      });
    }

    await Promise.all([userAcc.debit(amount), receiverAcc.credit(amount)]);
    //If the accounts are valid, it debits the amount from the user's account and credits it to the receiver's account in a single atomic operation

    //Change balances
    // await Account.updateOne(
    //   { accountNumber: userAcc.accountNumber },
    //   { $inc: { balance: -amount } }
    // ).session(session);
    // await Account.updateOne(
    //   { accountNumber: receiverAcc.accountNumber },
    //   { $inc: { balance: amount } }
    // ).session(session);

    const transactionRecord = await Transaction.create({
      from: userAcc.accountNumber,
      to: receiverAcc.accountNumber,
      amount,
    });

    if (!transactionRecord) {
      session.abortTransaction();
      throw new Error("Something went wrong while creating a transaction log");
    }

    await session.commitTransaction();
    session.endSession();

    return res.send("Transaction successful!");
  } catch (error) {
    console.error("Error in transfer: ", error);
    return res.status(500).json(error);
  }
});

module.exports = router;

/* ---(1)
existingUser:  {
  _id: new ObjectId('65cbc39f93cc71c934f7dae9'),
  firstName: 'demo',
  lastName: 'user',
  username: 'demo@user1.com',
  password: 'demouser',
  account: '1707852703213',
  __v: 0
}
*/

/* ---(2)
accDetails:  {
  _id: new ObjectId('65cbc39f93cc71c934f7dae7'),
  accountNumber: '1707852703213',
  balance: 2414,
  owner: new ObjectId('65cbc39f93cc71c934f7dae9'),
  __v: 0
}
*/
