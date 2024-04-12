// Importing mongoose library
const mongoose = require('mongoose');
// Getting Schema class from mongoose
const Schema = mongoose.Schema;

// Defining the habit schema
const habitSchema = new Schema(
  {
    content: { type: String, required: true },
    dates: [
      {
        date: String,
        complete: String,
      },
    ],
  },
  // Automatically add createdAt and updatedAt timestamps to each document
  { timestamps: true }
);

// Creating and exporting the Habit model using the habitSchema
module.exports = mongoose.model('Habit', habitSchema);
