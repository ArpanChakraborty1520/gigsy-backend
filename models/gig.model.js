import mongoose from "mongoose";
const { Schema } = mongoose;

const GigSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Gig",
    },
    desc: {
      type: String,
      default: "No description provided.",
    },
    price: {
      type: Number,
      default: 0,
    },
    cover: {
      type: String,
      default: "https://via.placeholder.com/600x400?text=No+Image",
    },
    images: {
      type: [String],
      default: [],
    },
    cat: {
      type: String,
      default: "general",
    },
    shortTitle: {
      type: String,
      default: "No title",
    },
    shortDesc: {
      type: String,
      default: "No short description",
    },
    deliveryDate: {
      type: Number,
      default: 1,
    },
    revisionNumber: {
      type: Number,
      default: 1,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Gig", GigSchema);
