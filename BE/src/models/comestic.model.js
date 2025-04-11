const { request } = require("express");
const mongoose = require("mongoose");
const slugify = require("slugify");

const comesticSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: {
      type: String,
      unique: true,
      errorMessage: "Slug đã tồn tại",
    },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, request: true },
    quantity: { type: Number, required: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    isHidden: { type: Boolean, default: false },
    reviews: [
      {
        customer_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

comesticSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
  next();
});

comesticSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
  next();
});

const Comestic = mongoose.model("Comestic", comesticSchema);
module.exports = Comestic;
