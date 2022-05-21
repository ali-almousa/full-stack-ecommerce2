import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // declare our form group
  checkoutFormGroup: FormGroup;

  // declare order details
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  // data for dropdown list
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  // inject the form builder to create our form, and the cart service to subscribe to subjects
  constructor(private formBuilder: FormBuilder, private cartService: CartService, private luv2ShopFormService: Luv2ShopFormService,
                      private checkoutService: CheckoutService, private router: Router) {}

  ngOnInit(): void {
    // update the totals
    this.reviewCartDetails();

    // populate countries
    // when the form is initially displayed, populate the countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )

    // populate the credit card months
    const startMonth: number = new Date().getMonth() + 1; // months are 0 based
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    // populate the credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        // initial value is an empty string
        // for the custom validation we only pass the name of the method without the parentheses and angular will implicitly
        // invoke the method with the current control that is being checked
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        // Validators.email is too lenient as it will allow anything that follows <someText>@<moreText>
        // "^[a-zA-Z0-9._%+-]+": start with any combination of letters and digits and optional period and other symbols
        // "\\.": a must period
        // "[a-z]{2,4}$": ends with 2 to 4 letters which is the domain extension
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country:  new FormControl('', Validators.required),
        street:  new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        city:  new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', Validators.required),
        zipCode:  new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country:  new FormControl('', Validators.required),
        street:  new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        city:  new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', Validators.required),
        zipCode:  new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', Validators.required),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{16}")]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern("[0-9]{3}")]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    })
  }

  reviewCartDetails() {

    // subscribe to subjects
    // when new events are received then update the UI
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    console.log("what the flipping", this.totalPrice)

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
  }

  onSubmit() {

    // touching all fields triggers the displays of the error messages
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }


    // ! why not const instead of let?
    //* set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    
    // ! why not let instead of const?
    //* get cart items
    const cartItems = this.cartService.cartItems;

    //* create orderItems from cartItems
    // - long way:
    /*
    let orderItems: OrderItem[] = [];
    for (let i = 0; i < orderItems.length; i++) {
      // orderItems.push(new OrderItem(cartItems[i]))
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */
    // - short way:
    //  loop over the array and return a new array by applying the function to each element in the array
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));


    //* set up purchase
    let purchase = new Purchase();

    //* populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls["customer"].value;

    //* populate purchase - shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls["shippingAddress"].value;
    // Convert a JavaScript object into a string with JSON.stringify().
    // Parse the data with JSON.parse(), and the data becomes a JavaScript object.
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //* populate purchase - billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls["billingAddress"].value;
    // Convert a JavaScript object into a string with JSON.stringify().
    // Parse the data with JSON.parse(), and the data becomes a JavaScript object.
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //* populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //* call REST AIP via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({

      // success
      next: response => {
        alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`);
        // reset cart
        this.resetCart();
      },

      // failure
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    });
    
    
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  copyShippingAddressToBillingAddress(event: any): void {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].
        setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

        // bug fix for states copy (states are not copied)
        // billingAddressStates used to populate the list of options in the form so
        // but our code not in sync not set up to have that data so
        // we need to update the array in the component with the appropriate data
        this.billingAddressStates = this.shippingAddressStates;
      }
      else {
        this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states copy (states are not copied)
      // empty the field when the box is unchecked
      this.billingAddressStates = [];
    }
  }

  // this method will update the months dropdown list 
  // according to the year selected in the form.
  // if current year is selected then the month dropdown list 
  // is populated with the current month up to 12. Otherwise, the month dropdown list
  // will start from 1 up to 12.
  handleMonthsAndYears(): void {
    // current year
    const currentYear: number = new Date().getFullYear();
    // selected year from the from
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // determine the correct start month
    let startMonth: number;
    // if the selected year is the current year then get the current month
    if (currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    // if the selected year is a future year then initialize the month to 1
    else{
      startMonth = 1;
    }

    // populate the credit card months dropdown list
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

  }

  // populate the states according to the selected country
  getStates(formGroupName: string){
    
    // get the country code from the selected form group
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    // get states form backend and update the state list of the corresponding form group
    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }

        // select first state bt default
        formGroup?.get('state')?.setValue(data[0]);

      }
    );

  }

  // define getters for the form controls
  // will use them in our html template when accessing the form
  // controls and trying to get the actual status and list of errors...
  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}
  get shippingAddressCountry() {return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressStreet() {return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity() {return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState() {return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode');}  
  get billingAddressCountry() {return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressStreet() {return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity() {return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState() {return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode() {return this.checkoutFormGroup.get('billingAddress.zipCode');}
  get cardType() {return this.checkoutFormGroup.get('creditCard.cardType');}
  get nameOnCard() {return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get cardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get securityCode() {return this.checkoutFormGroup.get('creditCard.securityCode');}
}
