import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },

  URN: {
    type: String,
    required: function () {
      return this.role === "student";
    },
  },

  username: {
    type: String,
    required: function () {
      return this.role === "admin";
    },
  },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },

  returnedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
    },
  ],
});

userSchema.index({ URN: 1 });
userSchema.index({ username: 1 });

export const User = mongoose.model("User", userSchema);
