import { Injector, NgModule, APP_INITIALIZER } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';

import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { AuthRouteService } from './routeguards/auth-route.service';
import { AdminControlsComponent } from './components/admin-controls/admin-controls.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { ProductsManageComponent } from './components/products-manage/products-manage.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersUpdateComponent } from './components/users-update/users-update.component';

import { FormsModule} from '@angular/forms';




// ! CONFIGURE KEYCLOAK
function initializeKeycloak(keycloak: KeycloakService){
  return () => 
    keycloak.init({
      config: {
        // base url of my keycloak 
        url: 'http://localhost:8080/',
        realm: 'shoessecurity',
        clientId: 'angularshop',
      },
      initOptions: {
        pkceMethod: 'S256',
        redirectUri: 'http://localhost:4200/'
      }, loadUserProfileAtStartUp: false // don't show the login page every time the user land on my web
    });
}

// define the routes for the application
// all instanciated components will go in place of router-outlet in
// the app.component.html file.
const routes: Routes = [
  // {path: 'login/callback', component: OktaCallbackComponent},
  {path:'admin/users/:id', component: UsersUpdateComponent, canActivate: [AuthRouteService]},
  {path:'admin/orders', component: OrderListComponent, canActivate: [AuthRouteService]},
  {path:'admin/products', component: ProductsManageComponent, canActivate: [AuthRouteService]},
  // {path:'admin/users', component: CustomerListComponent, canActivate: [AuthRouteService]},
  {path:'admin/users', component: UsersListComponent, canActivate: [AuthRouteService]},
  {path:'admin', component: AdminControlsComponent, canActivate: [AuthRouteService]},
  {path:'checkout', component: CheckoutComponent, canActivate: [AuthRouteService]},
  {path:'cart-details', component: CartDetailsComponent, canActivate: [AuthRouteService]},
  {path:'products/:id', component: ProductDetailsComponent},
  {path:'search/:keyword', component: ProductListComponent},
  {path:'category/:id/:name', component: ProductListComponent},
  {path:'category', component: ProductListComponent},
  {path:'products', component: ProductListComponent},
  {path:'', redirectTo:'/products', pathMatch:'full'},
  {path:'**', redirectTo:'/products', pathMatch:'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginStatusComponent,
    AdminControlsComponent,
    CustomerListComponent,
    ProductsManageComponent,
    OrderListComponent,
    UsersListComponent,
    UsersUpdateComponent
  ],
  imports: [
    // configure the router based on the routes
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    // exposes the exported declarations in NgbModule (classes, interfaces, constants...)
    // and make them available in the current module
    NgbModule,
    // add support fore reactive forms
    ReactiveFormsModule,
    // keycloak
    KeycloakAngularModule,
    FormsModule
  ],
  // allow us to inject this service into other parts of our project
  providers: [ProductService, 
  {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    // dependency 
    deps: [KeycloakService]
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
