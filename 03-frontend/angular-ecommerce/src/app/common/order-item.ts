import { CartItem } from "./cart-item";

export class OrderItem {

    imageUrl: string;
    unitPrice: number;
    quantity: number;
    // productId: number;
    productId: string; // since id in cartItem is string

    // build an orderItem from a cartItem object
    constructor(cartItem: CartItem){
        this.imageUrl = cartItem.imageUrl;
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.productId = cartItem.id;
    }
}
