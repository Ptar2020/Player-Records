import { models, model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,trim:true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase:true, 
      trim:true
    },
    role: {
      type: String,
      enum: ["coach", "admin", "player"],
      default: "coach",
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
    },
    name: { type: String, required: true },

    last_login: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
