import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormatter',
  standalone: true
})
export class PriceFormatterPipe implements PipeTransform {

  transform(value: number | string, ...args: unknown[]): unknown {
    if (value == null) {
      return '';
    }
    let numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
      return '';
    }

    // Format number with thousand separators
    const formattedValue = numValue.toLocaleString('en-US');

    // Append 'VND'
    return `${formattedValue} VNĐ`;
  }

}
