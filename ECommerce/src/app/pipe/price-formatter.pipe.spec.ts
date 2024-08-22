import { PriceFormatterPipe } from './price-formatter.pipe';

describe('PriceFormatterPipe', () => {
  let pipe: PriceFormatterPipe;

  beforeEach(() => {
    pipe = new PriceFormatterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format a number correctly', () => {
    const value = 1234567.89;
    const expectedOutput = '1,234,567.89 VNĐ';

    const result = pipe.transform(value);
    expect(result).toBe(expectedOutput);
  });

  it('should format a string number correctly', () => {
    const value = '1234567.89';
    const expectedOutput = '1,234,567.89 VNĐ';

    const result = pipe.transform(value);
    expect(result).toBe(expectedOutput);
  });

  it('should return empty string for null value', () => {
    const value = null;
    const expectedOutput = '';

    const result = pipe.transform(value);
    expect(result).toBe(expectedOutput);
  });

  it('should return empty string for undefined value', () => {
    const value = undefined;
    const expectedOutput = '';

    const result = pipe.transform(value);
    expect(result).toBe(expectedOutput);
  });

  it('should return empty string for invalid number string', () => {
    const value = 'invalid-number';
    const expectedOutput = '';

    const result = pipe.transform(value);
    expect(result).toBe(expectedOutput);
  });

  it('should handle zero correctly', () => {
    const value = 0;
    const expectedOutput = '0 VNĐ';

    const result = pipe.transform(value);
    expect(result).toBe(expectedOutput);
  });

  it('should handle negative numbers correctly', () => {
    const value = -1234567.89;
    const expectedOutput = '-1,234,567.89 VNĐ';

    const result = pipe.transform(value);
    expect(result).toBe(expectedOutput);
  });

  it('should handle non-numeric strings gracefully', () => {
    const value = 'not-a-number';
    const expectedOutput = '';

    const result = pipe.transform(value);
    expect(result).toBe(expectedOutput);
  });
});
