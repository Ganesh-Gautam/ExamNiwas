import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["mcq"],
      default: "mcq",
      required: true,
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) =>
          Array.isArray(options) &&
          options.length >= 2 &&
          options.every((option) => typeof option === "string" && option.trim().length > 0),
        message: "MCQ questions need at least two non-empty options",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      trim: true,
    },
    marks: {
      type: Number,
      required: [true, "Marks are required"],
      min: [1, "Marks must be at least 1"],
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.pre("validate", function () {
  if (Array.isArray(this.options)) {
    this.options = this.options.map((option) => option.trim());
  }

  if (this.correctAnswer && Array.isArray(this.options) && !this.options.includes(this.correctAnswer.trim())) {
    this.invalidate("correctAnswer", "Correct answer must match one of the options");
  }
});

export const Question = mongoose.model("Question", questionSchema);
