import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  loggedIn: any;
  constructor(private _storageService: StorageService) {}

  ngOnInit(): void {
    this._storageService.setInfo('username', {
      users: [
        { id: 1, username: 'superadmin', role: 'superadmin' },
        { id: 2, username: 'admin', role: 'admin' },
        { id: 3, username: 'customer1', role: 'customer' },
      ],
    });
    this._storageService.loggedIn.subscribe((data) => {
      if (data !== 'noone') {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }
}
