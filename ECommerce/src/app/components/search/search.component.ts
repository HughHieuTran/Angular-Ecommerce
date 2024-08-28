import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, range, Subject } from 'rxjs';
import { SliderModule } from 'primeng/slider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ProductQueryParams } from '../../../types/types';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [InputTextModule, InputIconModule, IconFieldModule, ButtonModule, DialogModule, SliderModule, CommonModule, FormsModule, InputNumberModule, DropdownModule, CheckboxModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Input() categoriesList!: string[];
  @Output() searchOutputEvent = new EventEmitter<string>();
  @Output() queryOutputEvent = new EventEmitter<ProductQueryParams>();
  @Input() productsQueryParams!: ProductQueryParams;

  rangeValues: number[] = [0, 1000000];
  searchInput = new Subject<string>();

  constructor() {

    this.searchInput
      .pipe(debounceTime(300))
      .subscribe((searchTerm: string) => {
        this.productsQueryParams.name = searchTerm;
        this.searchOutputEvent.emit(searchTerm);
      });
  }
  isFilterShow: boolean = false;
  onSearchInputChange(searchTerm: any) {
    this.searchInput.next(searchTerm.target.value);
  }

  ngOnDestroy() {
    this.searchInput.complete();
  }

  showFilterDialog() {
    this.isFilterShow = true;
  }
  applyFilter() {
    if (!this.productsQueryParams.minPrice) this.productsQueryParams.minPrice = 0;
    if (!this.productsQueryParams.maxPrice) this.productsQueryParams.maxPrice = 1000000;

    this.queryOutputEvent.emit(this.productsQueryParams);
    this.isFilterShow = false;
  }
  clearFilter() {
    this.productsQueryParams = {
      offset: 0,
      limit: 12,
      minPrice: 0,
      maxPrice: 1000000,
      availability: [true, true],
      rating: [true, true, true, true, true, true]
    };
    this.queryOutputEvent.emit(this.productsQueryParams);
    this.isFilterShow = false;
  }
  maxChanged(event: any) {
    console.log(event.target.value.toString().replaceAll(",", ""))
    if (parseInt(event.target.value.toString().replaceAll(",", "")) < (this.productsQueryParams?.minPrice ?? 0)) this.productsQueryParams.minPrice = parseInt(event.target.value.toString().replaceAll(",", ""));
  }
}

