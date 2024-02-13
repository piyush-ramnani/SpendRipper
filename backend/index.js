const express = require("express");
const app = express();
const cors = require("cors");

//---local middlewares---
app.use(cors());
app.use(express.json());

const userRouter = require("./routes/userRouter");
const accountRouter = require("./routes/accountRouter");

app.get("/", (req, res) => {
  res.redirect("/api/v1");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/account", accountRouter);

app.listen(3000, () => {
  console.log(`Server is running on port: http://localhost:3000/`);
});
