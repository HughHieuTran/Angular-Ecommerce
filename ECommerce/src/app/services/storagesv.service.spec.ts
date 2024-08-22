import { TestBed } from '@angular/core/testing';

import { StoragesvService } from './storagesv.service';

describe('StoragesvService', () => {
  let service: StoragesvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoragesvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
