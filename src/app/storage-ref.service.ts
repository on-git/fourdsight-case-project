import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageRefService {
  constructor() {}

  get getLocalStorage() {
    return window['localStorage'];
  }
}
