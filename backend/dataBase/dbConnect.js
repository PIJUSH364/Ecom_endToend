const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const connectDb = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_USERID}:${process.env.MONGO_PASSWORD}@cluster0.fbuliyg.mongodb.net/?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('CONNECTION SUCCESSFUL'))
    .catch((err) => console.log(err));
};
module.exports = connectDb;
