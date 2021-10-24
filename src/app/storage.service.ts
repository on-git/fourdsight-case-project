import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageRefService } from './storage-ref.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _localStorage: any;
  loggedIn = new BehaviorSubject('noone');

  constructor(private _localStorageRef: StorageRefService) {
    this._localStorage = _localStorageRef.getLocalStorage;
  }

  setInfo(key: string, data: any) {
    const jsonData = JSON.stringify(data);
    this._localStorage.setItem(key, jsonData);
  }

  loadInfo(key: string) {
    return JSON.parse(this._localStorage.getItem(key));
  }

  clearInfo(key: string) {
    this._localStorage.removeItem(key);
  }

  clearAllLocalStorage() {
    this._localStorage.clear();
  }
}
