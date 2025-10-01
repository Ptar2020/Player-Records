import { models, model, Schema } from "mongoose";

const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    position: {
      type: Schema.Types.ObjectId,
      ref: "Position",
    },
    country: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    phone: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      // required: true,
    },
  },
  { timestamps: true }
);

const Player = models.Player || model("Player", playerSchema);

export default Player;
