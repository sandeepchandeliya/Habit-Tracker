const mongoose = require('mongoose');
exports.connectMongoose = () => {
  mongoose.set('strictQuery', false);
  mongoose
    .connect('mongodb+srv://clouduser:codingninjanodejs@cluster0.6ttptdh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true })
    .then((e) => console.log('Connected to Mongodb => Habit-Tracker'))
    .catch((err) => console.log('Mongodb Not Connect ', err));
};