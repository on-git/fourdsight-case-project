import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  displayMode = true;
  customerValue = '';
  storageData: any;
  roles = [{ name: '' }];
  invalidUsername = false;
  userExist = false;
  loggedInUser: any;
  users: any;
  showForm: boolean = false;
  angForm2: any;
  constructor(private _storageService: StorageService) {}

  ngOnInit(): void {
    this.storageData = this._storageService.loadInfo('username');
    this._storageService.loggedIn.subscribe((data) => {
      this.loggedInUser = data;
      this.updateList();
      if (data === 'superadmin') {
        this.roles = [{ name: 'admin' }, { name: 'customer' }];
      } else {
        this.roles = [{ name: 'customer' }];
      }
    });
  }

  editItem(user: any) {
    if (!this.showForm) {
      this.showForm = !this.showForm;
    }
    this.angForm2 = new FormGroup({
      id: new FormControl(user.id),
      username: new FormControl(user.username),
      role: new FormControl(
        this.roles.filter(function (r) {
          return r.name === user.role;
        })[0]
      ),
    });
  }

  updateInfo() {
    let data = this._storageService.loadInfo('username');
    const formValue = this.angForm2.value;
    if (this.isUsernameExist(formValue.username, data)) {
      this.userExist = true;
    } else {
      let users = data.users.filter(function (user: any) {
        return user.id === formValue.id;
      });
      if (formValue.username.trim().length === 0) {
        this.invalidUsername = true;
      } else {
        if (users.length === 0) {
          users = this.newItemSet(data, formValue);
        } else {
          users = this.existingItemSet(data, formValue);
        }
        this._storageService.setInfo('username', { users });
        this.showForm = !this.showForm;
        this.updateList();
      }
    }
  }

  isUsernameExist(uName: string, data: any) {
    let users = data.users.filter(function (user: any) {
      return user.username === uName;
    });
    if (users.length > 0) return true;
    else return false;
  }

  newItemSet(data: any, formValue: any) {
    let updatedUsers = [
      ...data.users,
      {
        id: data.users[data.users.length - 1].id + 1,
        username: formValue.username,
        role: formValue.role.name,
      },
    ];

    return updatedUsers;
  }

  existingItemSet(data: any, formValue: any) {
    let updatedUsers = data.users.map(function (user: any) {
      if (user.id === formValue.id) {
        user.username = formValue.username;
        user.role = formValue.role.name;
      }
      return user;
    });

    return updatedUsers;
  }

  addNewItemToggle() {
    this.showForm = !this.showForm;
    this.angForm2 = new FormGroup({
      id: new FormControl(-1),
      username: new FormControl(''),
      role: new FormControl(this.roles[0]),
    });
    if (this.invalidUsername) {
      this.invalidUsername = false;
    }
    if (this.userExist) this.userExist = false;
  }

  deleteItem(user: any) {
    let data = this._storageService.loadInfo('username');
    let users = data.users.filter(function (u: any) {
      return u.id !== user.id;
    });
    this._storageService.setInfo('username', { users });
    this.updateList();
  }

  updateList() {
    this.users = this._storageService
      .loadInfo('username')
      .users.filter(this.filterRole, this.loggedInUser);
  }

  filterRole(item: any) {
    return item.role !== 'superadmin' && item.role !== this;
  }

  hideWarning() {
    if (this.invalidUsername) this.invalidUsername = false;
    if (this.userExist) this.userExist = false;
  }
}
