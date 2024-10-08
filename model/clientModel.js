import mongoose from "mongoose";
import slugify from "slugify";

const clientSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Client Name is required"],

      collation: { locale: "en", strength: 2 },
    },
    email: {
      type: String,
      required: [true, "Client Email is required"],
    },
    phone: {
      type: Number,
      required: [true, "Client Number is required"],
    },
    consultant: { type: mongoose.Schema.ObjectId, ref: "User" },
    clientNote: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    visaType: String,
    city: String,
    province: String,
    postalCode: String,
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    isLead: {
      type: Boolean,
      default: true,
    },
    lastUpdatedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    lastUpdatedAt: Date, 
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Populate
clientSchema.virtual("cases", {
  ref: "Case",
  foreignField: "client",
  localField: "_id",
});

clientSchema.virtual("tasks", {
  ref: "Task",
  foreignField: "client",
  localField: "_id",
});

clientSchema.index({ createdAt: -1 });
clientSchema.index({ slug: 1 });

clientSchema.pre("save", async function (next) {
  if (!this.id) {
    const count = await mongoose.model("Client").countDocuments();
    const uniquePart = Date.now().toString().slice(-4);
    this.id = `I${10 + count + 1}${uniquePart}`;
  }
  next();
});

clientSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

clientSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Check if the name field is being modified
  if (update.name) {
    // Generate a new slug
    update.slug = slugify(update.name, { lower: true });
  }

  next();
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
