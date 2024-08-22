import { TestBed } from '@angular/core/testing';
import { StoragesvService } from './storagesv.service';
import { of } from 'rxjs';

describe('StoragesvService', () => {
  let service: StoragesvService;
  const mockLocalStorage = (() => {
    const store: { [key: string]: string } = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { for (const key in store) { delete store[key]; } }
    };
  })();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoragesvService);

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set item in localStorage', () => {
    const key = 'testKey';
    const value = { test: 'data' };
    service.setItem(key, value);

    expect(localStorage.getItem(key)).toBe(JSON.stringify(value));
  });

  it('should get item from localStorage', () => {
    const key = 'testKey';
    const value = { test: 'data' };
    localStorage.setItem(key, JSON.stringify(value));

    const result = service.getItem<typeof value>(key);
    expect(result).toEqual(value);
  });

  it('should return null for non-existent item', () => {
    const result = service.getItem('nonExistentKey');
    expect(result).toBeNull();
  });

  it('should remove item from localStorage', () => {
    const key = 'testKey';
    localStorage.setItem(key, JSON.stringify({ test: 'data' }));
    service.removeItem(key);

    expect(localStorage.getItem(key)).toBeNull();
  });

  it('should clear all items from localStorage', () => {
    localStorage.setItem('key1', JSON.stringify({ test: 'data1' }));
    localStorage.setItem('key2', JSON.stringify({ test: 'data2' }));
    service.clear();

    expect(localStorage.getItem('key1')).toBeNull();
    expect(localStorage.getItem('key2')).toBeNull();
  });

});
