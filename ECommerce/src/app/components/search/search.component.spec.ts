import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { ProductQueryParams } from '../../../types/types';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let categoriesList: string[];
  let productQueryParams: ProductQueryParams;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    categoriesList = ["shirt", "hat"];
    productQueryParams = {
      name: 'A',
      limit: 12,
      offset: 0,
      availability: [true, true],
      rating: [true, true, true, true, true, true]
    };
    component.categoriesList = categoriesList;
    component.productsQueryParams = productQueryParams;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
