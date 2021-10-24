import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showCustomers = false;
  constructor(private _storageService: StorageService) {}

  ngOnInit(): void {
    this._storageService.loggedIn.subscribe((data) => {
      if (data === 'superadmin' || data === 'admin') {
        this.showCustomers = true;
      } else {
        this.showCustomers = false;
      }
    });
  }
}
