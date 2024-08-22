import { DateFormatterPipe } from './date-formatter.pipe';

describe('DateFormatterPipe', () => {

  let pipe: DateFormatterPipe;

  beforeEach(() => {
    pipe = new DateFormatterPipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should format date string correctly', () => {
    const dateStr = '2024-08-22T14:30:00Z';
    const expectedOutput = 'August 22, 2024 at 09:30:00 PM GMT+7'; 

    const result = pipe.transform(dateStr);
    expect(result).toBe(expectedOutput);
  });

  it('should handle invalid date input', () => {
    const invalidDateStr = 'invalid-date';
    const result = pipe.transform(invalidDateStr);
    expect(result).toBe('Invalid Date'); 
  });

  it('should format date according to locale', () => {
    const dateStr = '2024-08-22T14:30:00Z';
    const expectedOutput = 'August 22, 2024 at 09:30:00 PM GMT+7'; 

    const result = pipe.transform(dateStr);
    expect(result).toBe(expectedOutput);
  });

});
