import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public afAuth: AngularFireAuth,
    private userSvc: UserService
  ) {
    console.log(afAuth);
  }

  login() {
    this.userSvc.login();
  }

  logout() {
    this.userSvc.logout();
  }

}
