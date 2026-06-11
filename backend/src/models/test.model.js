import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Test title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [80, "Subject cannot exceed 80 characters"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    negativeMarkingEnabled: {
      type: Boolean,
      default: false,
    },
    negativeMarkingValue: {
      type: Number,
      default: 0,
      min: [0, "Negative marking cannot be negative"],
    },
    randomizeQuestions: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

testSchema.pre("validate", function () {
  if (this.startTime && this.endTime && this.endTime <= this.startTime) {
    this.invalidate("endTime", "End time must be after start time");
  }

  if (!this.negativeMarkingEnabled) {
    this.negativeMarkingValue = 0;
  }
});

export const Test = mongoose.model("Test", testSchema);
