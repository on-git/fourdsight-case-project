import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {}

  constructor(
    private _storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._storageService.loggedIn.next('noone');
  }
  angForm = new FormGroup({
    username: new FormControl(''),
  });

  checkInfo() {
    const { username } = this.angForm.value;
    let storageData = this._storageService.loadInfo('username');
    let user = storageData.users.filter(function (x: any) {
      return x.username === username;
    });
    if (user.length > 0) {
      this._storageService.loggedIn.next(user[0].role);
      this.router.navigate([`../home`], {
        relativeTo: this.route,
      });
    } else {
      console.log('hata');
    }
  }

  clearInfo() {
    this._storageService.clearInfo('username');
  }

  clearAll() {
    this._storageService.clearAllLocalStorage();
  }
}
