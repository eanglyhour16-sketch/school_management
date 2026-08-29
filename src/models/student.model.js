const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Student code is required"],
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female"],
    },

    class_id: {
      type: Number,
      required: [true, "Class ID is required"],
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);