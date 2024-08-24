import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { MessageService } from 'primeng/api';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{
          path: '',
          component: HomeComponent,
        },
        {
          path: 'cart-details',
          component: CartDetailComponent
        },]),
        MessageService,
        provideStore(reducers, { metaReducers }),
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
