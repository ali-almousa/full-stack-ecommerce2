import { Injectable } from '@angular/core';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { User } from '../common/user';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthRouteService extends KeycloakAuthGuard{

  user = new User();
  public userProfile: KeycloakProfile | null = null;

  constructor(
    // ! override 
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot)
     {
    
      // force the user to login if currently unauthenticated
      if (!this.authenticated) {
        await this.keycloak.login({
          redirectUri: window.location.origin + state.url,
        });
      }
      else{
        this.userProfile = await this.keycloak.loadUserProfile();
        this.user.authStatus = 'AUTH';
        this.user.name = this.userProfile.firstName!;
        this.user.email = this.userProfile.email!;
        window.sessionStorage.setItem('userdetails', JSON.stringify(this.user));
      }

      // get the roles required from the route
      const requiredRoles = route.data['roles'];

      // allow the user to proceed if no additional roles are required to access the route
      if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
        return true;
      }

      // allow the user to proceed if all the required roles are present
      // ! this here refers to whom??
      return requiredRoles.some((role) => this.roles.includes(role));

  }
}
