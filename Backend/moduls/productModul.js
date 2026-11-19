import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        productName: { type: String, require: true },
        productDesc: { type: String, require: true },

        productImg: [
            {
                url: { type: String, require: true },
                public_id: { type: String, require: true }
            }
        ],
        productPrice: { type: Number },
        category: { type: String },
        brand: { type: String }
    }, { timestamps: true }
)

export const Product = mongoose.model("Product", productSchema)