import { Component, EventEmitter, Output } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [InputTextModule, InputIconModule, IconFieldModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  @Output() searchOutputEvent = new EventEmitter<string>();

  searchInput = new Subject<string>();
  constructor() {
    this.searchInput
      .pipe(debounceTime(300))
      .subscribe((searchTerm: string) => {
        // Call your search function here
        this.performSearch(searchTerm);
      });
  }

  onSearchInputChange(searchTerm: any) {
    this.searchInput.next(searchTerm.target.value);
  }

  performSearch(searchTerm: string) {
    this.searchOutputEvent.emit(searchTerm);
  }

  ngOnDestroy() {
    this.searchInput.complete();
  }

}

