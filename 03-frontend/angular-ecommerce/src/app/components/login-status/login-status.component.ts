import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/user';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  user = new User();
  public isLoggedIn = false;
  public userProfile : KeycloakProfile | null = null;


  constructor(private readonly keycloak: KeycloakService) { }


  public async ngOnInit() {

    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
      this.user.authStatus = 'AUTH';
      this.user.name = this.userProfile?.firstName!;
      window.sessionStorage.setItem("userdetails", JSON.stringify(this.user));
    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }
  

}
