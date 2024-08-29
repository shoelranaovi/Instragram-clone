const moongose = require("mongoose");

async function ConnectDb() {
  try {
    await moongose.connect(process.env.MONGOURL);
    console.log("server connected");
  } catch (error) {
    console.log(error);
  }
}
module.exports = ConnectDb;
