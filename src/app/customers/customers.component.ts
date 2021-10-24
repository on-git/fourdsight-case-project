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
  roles = [{ name: '' }];
  invalidUsername = false;
  constructor(private _storageService: StorageService) {}

  ngOnInit(): void {
    this.storageData = this._storageService.loadInfo('username');
    this._storageService.loggedIn.subscribe((data) => {
      if (data === 'superadmin') {
        this.users = this.storageData.users.filter(function (x: any) {
          return x.role !== 'superadmin';
        });
        this.roles = [{ name: 'admin' }, { name: 'customer' }];
      } else {
        this.users = this.storageData.users.filter(function (x: any) {
          return x.role !== 'superadmin' && x.role !== 'admin';
        });
        this.roles = [{ name: 'customer' }];
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
      role: new FormControl(
        this.roles.filter(function (r) {
          return r.name == user.role;
        })[0]
      ),
    });
  }

  updateInfo() {
    let data = this._storageService.loadInfo('username');
    const formValue = this.angForm2.value;
    let users = data.users.filter(function (user: any) {
      return user.id === formValue.id;
    });
    let updatedUsers: any[];
    if (formValue.username.trim().length === 0) {
      this.invalidUsername = true;
    } else {
      if (users.length === 0) {
        updatedUsers = [
          ...data.users,
          {
            id: data.users[data.users.length - 1].id + 1,
            username: formValue.username,
            role: formValue.role.name,
          },
        ];
      } else {
        updatedUsers = data.users.map(function (user: any) {
          if (user.id === formValue.id) {
            user.username = formValue.username;
            user.role = formValue.role.name;
          }
          return user;
        });
      }
      users = updatedUsers;
      this._storageService.setInfo('username', { users });
      this.showForm = !this.showForm;
      this.updateList();
    }
  }

  addNewItem() {
    this.showForm = !this.showForm;
    this.angForm2 = new FormGroup({
      id: new FormControl(-1),
      username: new FormControl(''),
      role: new FormControl(this.roles[0]),
    });
  }

  deleteItem(user: any) {
    let data = this._storageService.loadInfo('username');
    let userInfo = data.users.filter(function (u: any) {
      return u.id !== user.id;
    });
    let users = userInfo;
    this._storageService.setInfo('username', { users });
    this.updateList();
  }

  updateList() {
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

  hideWarning() {
    this.invalidUsername = false;
  }
}
