import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  users: any;
  displayMode = true;
  customerValue = '';
  storageData: any;
  constructor(private _storageService: StorageService) {}

  ngOnInit(): void {
    this.storageData = this._storageService.loadInfo('username');
    this._storageService.loggedIn.subscribe((data) => {
      if (data === 'superadmin') {
        this.users = this.storageData.users.filter(function (x: any) {
          return x.role !== 'superadmin';
        });
      } else {
        this.users = this.storageData.users.filter(function (x: any) {
          return x.role !== 'superadmin' && x.role !== 'admin';
        });
      }
    });
  }

  showForm: boolean = false;
  angForm2: any;

  editItem(user: any) {
    if (!this.showForm) {
      this.showForm = !this.showForm;
    }
    this.angForm2 = new FormGroup({
      id: new FormControl(user.id),
      username: new FormControl(user.username),
    });
  }

  updateInfo() {
    let data = this._storageService.loadInfo('username');
    const formValue = this.angForm2.value;
    let users = data.users.filter(function (user: any) {
      return user.id === formValue.id;
    });
    let updatedUsers: any[];
    if (users.length === 0) {
      updatedUsers = [
        ...data.users,
        {
          id: data.users[data.users.length - 1].id + 1,
          username: formValue.username,
          role: 'customer',
        },
      ];
    } else {
      updatedUsers = data.users.map(function (user: any) {
        if (user.id === formValue.id) {
          user.username = formValue.username;
        }
        return user;
      });
    }
    users = updatedUsers;
    this._storageService.setInfo('username', { users });
    this.showForm = !this.showForm;
    this._storageService.loggedIn.subscribe((data) => {
      if (data === 'superadmin') {
        this.users = this._storageService
          .loadInfo('username')
          .users.filter(function (x: any) {
            return x.role !== 'superadmin';
          });
      } else {
        this.users = this._storageService
          .loadInfo('username')
          .users.filter(function (x: any) {
            return x.role !== 'superadmin' && x.role !== 'admin';
          });
      }
    });
  }

  addNewItem() {
    this.showForm = !this.showForm;
    this.angForm2 = new FormGroup({
      id: new FormControl(-1),
      username: new FormControl(''),
    });
  }

  deleteItem(user: any) {
    let data = this._storageService.loadInfo('username');
    let userInfo = data.users.filter(function (u: any) {
      return u.id !== user.id;
    });
    let users = userInfo;
    this._storageService.setInfo('username', { users });
    this._storageService.loggedIn.subscribe((data) => {
      if (data === 'superadmin') {
        this.users = this._storageService
          .loadInfo('username')
          .users.filter(function (x: any) {
            return x.role !== 'superadmin';
          });
      } else {
        this.users = this._storageService
          .loadInfo('username')
          .users.filter(function (x: any) {
            return x.role !== 'superadmin' && x.role !== 'admin';
          });
      }
    });
  }
}
