import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // our shopping cart: an empty array of cartItems 
  // ?why not making this a subject as well?
  // I think: that for price and quantity we need to publish the end event once after doing a lot of calculations
  // whilst for the cartItems every time there is a change we need to update the UI in the cart-details-component
  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable
  // used to publish events in our code (programmatically)
  // the events are then sent to all of the subscribers 
  // later components will need to call computeTotals() to get the latest update about the totals 
  // which is not efficient as the cart might have a lot of items
  // * Subject:
  // * - Does not keep buffer of previous events/messages
  // * - Subscribers only receives new events after they are subscribed
  // !totalPrice: Subject<number> = new Subject<number>();
  // !totalQuantity: Subject<number> = new Subject<number>();
  //
  // since components instantiated later in the application (such as the checkout) it will miss out on 
  // previous events/messages coming form Subjects (totalPrice, totalQuantity).
  // thus we need to get a replay of the messages missed using, ReplaySubject which is a 
  // subclass of Subject that will replay events/messages for new subscribers who join later 
  // and also will keep a buffer of previous events/messages and send to new subscribers
  // * ReplaySubject:
  // * - has a buffer of all previous events/messages
  // * - once subscribed, subscriber receives a replay of all previous events/messages
  // !totalPrice: Subject<number> = new ReplaySubject<number>();
  // !totalQuantity: Subject<number> = new ReplaySubject<number>();
  //
  // the most alternative for our case since we don't care about every single update of the totals we only need the last update
  // thus we can use BehaviorSubject which is a subclass of Subject that will store the latest event/message and sends to new subscribers
  // (components coming late). BehaviorSubjects are useful for representing "values over time". For instance, an event stream of birthdays is a Subject, but
  // the stream of a person's age would be a BehaviorSubject since we only care about the latest age. 0 is the initial value.
  // * BehaviorSubject:
  // * - has a buffer of the last event/message
  // * - once subscribed, subscriber receives the latest event/message sent prior to subscribing
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {

    // search if the item already in shopping cart and return a referece to it if found
    const foundInCart = this.isFoundInCart(theCartItem);

    // if item is already in the shopping cart icrement the quantiy
    if (foundInCart != undefined) {
      foundInCart.quantity++;
    }
    // new item then add to cart
    else {
      this.cartItems.push(theCartItem);
    }

    // update cart quantity and cart total
    this.computeCartTotals();
  }

  isFoundInCart(theCartItem: CartItem): CartItem {
    // another sol: make the return type of the method CartItem | undefined and remove the ! mark
    // ! tells the compiler that this experssion can't be 
    // undefined or null  so don't complain about the possibility
    // of it being null or undefined." Sometimes the type checker
    // is unable to make that determination itself.
    let cartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {
      // find will execute the test for each element and return the first element that passes 
      // otherwise it will return undefined
      cartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;
    }

    console.log(cartItem);
    return cartItem;
  }

  decrementQuantity(cartItem: CartItem): void {

    // no need to get a reference to the cart item from the shopping cart since 
    // the cartItem passed is actually a reference to the cart item itself from the shopping cart
    // const theCartItem: CartItem = this.isFoundInCart(cartItem);

    // decrement the quantity
    cartItem.quantity--;

    // if the quantity is zero then remove the cart item from the shopping cart
    if (cartItem.quantity === 0) {
      // ?why removing a element from the cartItems list would trigger the 
      // ?the cart-details-component to update UI accordingly? even though the list is not a subject and thus no publishing of events and no subscribers?
      this.removeFromCart(cartItem);
    }

    // otherwise, update cart quantity and cart total
    else {
      this.computeCartTotals();
    }
  }

  removeFromCart(cartItem: CartItem): void {
    // find the index of the item in the cart
    // * using indexOf(target, startIndex):
    // const index = this.cartItems.indexOf(cartItem, 0);
    // * using findIndex:
    const index = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    // remove the item from the cart if found
    if (index > -1) {
      // 1 : means only remove one item
      this.cartItems.splice(index, 1);
    }

    // in case I removed an item with many quantity
    // then I need to update the total quantity and total price
    this.computeCartTotals(); 
  }

  computeCartTotals() {
    let totalPriceValue: number = 0
    let totalQuantityValue: number = 0

    for (let item of this.cartItems) {
      totalPriceValue += item.unitPrice * item.quantity;
      totalQuantityValue += item.quantity;
    }

    // next: publish/send event to subscribers 
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
