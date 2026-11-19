import { Card } from "../moduls/cardModul.js"
import { Product } from "../moduls/productModul.js"

export const getCard = async (req, res) => {
    try {
        const userId = req.id;

        const card = await Card.findOne({ userId }).populate("items.productId");
        if (!card) {
            return res.json({ success: true, card: [] })
        }
        res.status(200).json({
            success: true,
            card
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const addToCard = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        // cheack if product exist
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not found"
            })
        }

        // find the users card (if exists)
        let card = await Card.findOne({ userId })

        // if card do not exists, create a new one
        if (!card) {
            card = new Card({
                userId,
                items: [{ productId, quantity: 1, price: product.productPrice }],
                totalPrice: product.productPrice
            })
        } else {
            // find if product is alrody in the card
            const itemIndex = card.items.findIndex(
                (item) => item.productId.toString() === productId
            )
            if (itemIndex > -1) {
                // if product exists -> just increase quantity
                card.items[itemIndex].quantity += 1
            } else {
                // if new product -> push to card
                card.items.push({
                    productId,
                    quantity: 1,
                    price: product.productPrice,
                })
            }

            // calculate totel price
            card.totalPrice = card.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )
        }

        // save update card
        await card.save()

        // populate product details before sending response
        const populatedCard = await Card.findById(card._id).populate("items.productId")
        res.status(200).json({
            success: true,
            message: "Product Added Successfully",
            card: populatedCard
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type } = req.body;

        let card = await Card.findOne({ userId })
        if (!card) {
            return res.status(404).json({
                success: false,
                message: "Card not found"
            })
        }
        const item = card.items.find(item => item.productId.toString() === productId)
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            })
        }
        if (type === "increase") {
            item.quantity += 1
        }
        if (type === "decrease" && item.quantity > 1) {
            item.quantity -= 1;
        }

        card.totalPrice = card.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

        await card.save()
        card = await card.populate("items.productId")
        res.status(200).json({
            success: true,
            card
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const removeFromCard = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        let card = await Card.findOne({ userId });
        if (!card) {
            return res.status(404).json({
                success: false,
                message: "card not found"
            })
        }

        card.items = card.items.filter(item => item.productId.toString() !== productId)
        card.totalPrice = card.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

        card = await card.populate("items.productId")

        await card.save()
        res.status(200).json({
            success: true,
            card
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}