const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Grade", gradeSchema);