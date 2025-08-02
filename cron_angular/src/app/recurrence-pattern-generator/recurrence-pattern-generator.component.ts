import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recurrence-pattern-generator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recurrence-pattern-generator.component.html',
  styleUrls: ['./recurrence-pattern-generator.component.css']
})
export class RecurrencePatternGeneratorComponent {
  // Add this line to expose Object to the template
  Object = Object;
  
  weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  pattern: string = 'daily';
  time: string = '12:00';
  date: string = '1';
  selectedDays: { [key: string]: boolean } = {
    monday: false, tuesday: false, wednesday: false,
    thursday: false, friday: false, saturday: false, sunday: false
  };
  description: string = '';

  ngOnInit() {
    this.generateDescription();
  }

/*

Create Recurrence Pattern Description Module that has the following functionalities
Complete the following functionalities.

1 .Renders recurrence pattern select field

2 .Shows daily pattern description with the selected time

Example:
Input:
Pattern: Daily
Time: 10:30 AM
Output: Runs every day at 10:30.

3. Displays weekly pattern description with selected days and time

Example:
Input:
Pattern: Weekly
Days Selected: Monday, Friday
Time: 08:30 AM
Output: Runs every week on Monday, Friday at 08:30.

4. Falls back to a generic weekly description when no days are selected

Example:
Input:
Pattern: Weekly
Days Selected: 'None'
Time: 06:30 PM
Output: Runs every week at 18:30.

5. Shows monthly pattern description with selected date and time

Example:
Input:
Pattern: Monthly
Date Selected: 15
Time: 09:00 AM
Output: Runs every month on the 15th day at 09:00.

6. Handles ordinal suffixes correctly (e.g., 1st, 2nd, 3rd, 11th, etc.)

NOTE: You are free to implement the task in any other way as well but shouldn't be hardcoded.

*/

  onPatternChange(value: string) {}

  onTimeChange(value: string) {}

  toggleDay(day: string) { }

  onDateChange(value: string) {}

  generateDescription() {}

  capitalize(day: string): string {return 'x'}

  ordinalSuffix(day: string): string {return 'x'}

  getDaysKeys() {}

}
