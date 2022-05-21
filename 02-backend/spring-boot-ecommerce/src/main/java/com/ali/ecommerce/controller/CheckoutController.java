package com.ali.ecommerce.controller;

import com.ali.ecommerce.dto.Purchase;
import com.ali.ecommerce.dto.PurchaseResponse;
import com.ali.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    // here jakson will its work of converting JSON to POJO
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }

    @GetMapping("/purchase")
    public void dude(){

    System.out.println("alosh");
    }
}
