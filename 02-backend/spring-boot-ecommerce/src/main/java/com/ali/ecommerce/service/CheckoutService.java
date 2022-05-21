package com.ali.ecommerce.service;

import com.ali.ecommerce.dto.Purchase;
import com.ali.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
