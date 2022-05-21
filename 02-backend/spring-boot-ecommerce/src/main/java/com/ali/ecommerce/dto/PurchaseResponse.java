package com.ali.ecommerce.dto;

import lombok.Data;

// this class is used to send back a Java object as JSON
@Data
public class PurchaseResponse {

    // lombok will give me constructors with final fields only
    // alternatively I can use @NotNull instead of final
    private final String orderTrackingNumber;

}
