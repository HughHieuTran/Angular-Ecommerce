import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { User } from '../../types/types';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const mockLink = 'http://localhost:3000/';
  const testUser: User = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loginUser', () => {
    it('should return an Observable<User> on successful login', () => {
      const dummyUser: User = { ...testUser, username: 'testuser' };

      service.loginUser(testUser).subscribe(user => {
        expect(user).toEqual(dummyUser);
      });

      const req = httpMock.expectOne(`${mockLink}user/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testUser);
      req.flush(dummyUser);
    });
  });

  describe('registerUser', () => {
    it('should return an Observable<User> on successful registration', () => {
      const dummyUser: User = { ...testUser, username: 'testuser' };

      service.registerUser(testUser).subscribe(user => {
        expect(user).toEqual(dummyUser);
      });

      const req = httpMock.expectOne(`${mockLink}user/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testUser);
      req.flush(dummyUser);
    });
  });
});
