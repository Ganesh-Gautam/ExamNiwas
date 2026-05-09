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
      enum: ["mcq", "written"],
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
      default: [],
      validate: {
        validator: function (options) {
          if (this.type !== "mcq") {
            return true;
          }
          return (
            Array.isArray(options) &&
            options.length >= 2 &&
            options.every((option) => typeof option === "string" && option.trim().length > 0)
          );
        },
        message: "MCQ questions need at least two non-empty options",
      },
    },
    correctAnswer: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "mcq";
      },
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

  if (this.type === "written") {
    this.options = [];
    this.correctAnswer = undefined;
  }

  if (
    this.type === "mcq" &&
    this.correctAnswer &&
    Array.isArray(this.options) &&
    !this.options.includes(this.correctAnswer.trim())
  ) {
    this.invalidate("correctAnswer", "Correct answer must match one of the options");
  }
});

export const Question = mongoose.model("Question", questionSchema);
