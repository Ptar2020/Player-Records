import { models, model, Schema } from "mongoose";

const PositionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Position = models.Position || model("Position", PositionSchema);

export default Position;
