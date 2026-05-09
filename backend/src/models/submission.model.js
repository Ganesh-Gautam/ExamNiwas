import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedAnswer: {
          type: String,
          default: "",
        },
        answerText: {
          type: String,
          default: "",
          trim: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
        marksObtained: {
          type: Number,
          default: 0,
        },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    timeTaken: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["submitted", "evaluated"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ studentId: 1, testId: 1 });
submissionSchema.index({ studentId: 1, createdAt: -1 });

export const Submission = mongoose.model("Submission", submissionSchema);
