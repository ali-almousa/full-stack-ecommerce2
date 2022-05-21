export class Product {
    // I needed to this id for the routerLink in product-list.component.html to work properly
    // previously it was throwing this error: "Property 'id' does not exist on type 'Product'."
    // great!!! he actually went back to solve this issue and added the same line of code but with string instead
    // id: number;
    id: string;

    sku: string;
    name: string;
    description: string;
    unitPrice: number;
    imageUrl: string;
    active: boolean;
    unitsInStock: number;
    dateCreated: Date;
    lastUpdated: Date;
    // ! added newly check if any incompatibilities exist
    categoryId: number;
}
