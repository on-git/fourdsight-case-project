import { TestBed } from '@angular/core/testing';

import { StorageRefService } from './storage-ref.service';

describe('StorageRefService', () => {
  let service: StorageRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageRefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
