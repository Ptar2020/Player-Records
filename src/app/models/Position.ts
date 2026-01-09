import { models, model, Schema } from "mongoose";

const PositionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    shortName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 4,
    },
  },
  { timestamps: true }
);

PositionSchema.index({ shortName: 1 });

const Position = models.Position || model("Position", PositionSchema);

export default Position;