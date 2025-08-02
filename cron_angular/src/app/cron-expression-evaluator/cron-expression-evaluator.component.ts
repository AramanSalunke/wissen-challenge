import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cron-expression-evaluator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cron-expression-evaluator.component.html',
  styleUrls: ['./cron-expression-evaluator.component.css']
})
export class CronExpressionEvaluatorComponent {
  cronExpression: string = '';
  cronFields = { seconds: '*', minutes: '*', hours: '*', days: '*', month: '*', dayOfWeek: '*' };
  activeFields = { seconds: false, minutes: false, hours: false, days: false, month: false, dayOfWeek: false };

  onCronChange(value: string | Event) {

/*

Create Cron Expression Parsing function that has the following functionalities.

1. Renders cron expression input field

2. Parses and displays individual cron fields accurately

Example:
Input: '0 15 12 1 JAN MON'
Output:
Seconds: 0 (active)
Minutes: 15 (active)
Hours: 12 (active)
Days: 1 (active)
Month: JAN (active)
Day of Week: MON (active)

3. Handles default values appropriately when * is used

Example:
Input: '* * * * * *'
Output:
Seconds: *
Minutes: *
Hours: *
Days: *
Month: *
Day of Week: *

4. Resets all fields gracefully when an invalid cron expression is detected (e.g., incorrect number of parts)

Example:
Input: '0 15 12 1 JAN'
Output:
Seconds: *
Minutes: *
Hours: *
Days: *
Month: *
Day of Week: *

5. Trims extra spaces and still parses the expression correctly

Example:
Input: '    0    15   12    1    JAN    MON   '
Output:
Seconds: 0 (active)
Minutes: 15 (active)
Hours: 12 (active)
Days: 1 (active)
Month: JAN (active)
Day of Week: MON (active)

NOTE: You are free to implement the task in any other way as well but shouldn't be hardcoded.

*/

  }
}
