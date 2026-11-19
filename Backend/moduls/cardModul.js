import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
        unique: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                require: true,
            },
            quantity: {
                type: Number,
                require: true,
                default: 1
            },
            price: {
                type: Number,
                require: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export const Card = mongoose.model("Card", cardSchema);