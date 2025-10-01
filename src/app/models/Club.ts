import { models, model, Schema } from "mongoose";

const clubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    level: { type: String },
  },
  { timestamps: true }
);

const Club = models.Club || model("Club", clubSchema);

export default Club;
