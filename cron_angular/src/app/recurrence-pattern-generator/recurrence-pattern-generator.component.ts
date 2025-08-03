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
  weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  monthDays = Array.from({length: 31}, (_, i) => i + 1);

  pattern: string = 'daily';
  time: string = '12:00';
  date: string = '1';
  selectedDays: { [key: string]: boolean } = {
    monday: false, tuesday: false, wednesday: false,
    thursday: false, friday: false, saturday: false, sunday: false
  };
  description: string = '';
  generatedCron: string = '';

  ngOnInit() {
    this.generateDescription();
  }

  onPatternChange(value: string) {
    this.pattern = value;
    this.generateDescription();
  }

  onTimeChange(value: string) {
    this.time = value;
    this.generateDescription();
  }

  toggleDay(day: string) {
    this.selectedDays[day] = !this.selectedDays[day];
    this.generateDescription();
  }

  onDateChange(value: string) {
    this.date = value;
    this.generateDescription();
  }

  generateDescription() {
    if (!this.time) {
      this.description = 'Please select a time';
      this.generatedCron = '';
      return;
    }
    
    const [hours, minutes] = this.time.split(':');
    const hour = parseInt(hours);
    const minute = minutes;
    
    switch (this.pattern) {
      case 'daily':
        this.description = `Runs every day at ${hours}:${minute}.`;
        this.generatedCron = `0 ${minute} ${hours} * * *`;
        break;
        
      case 'weekly':
        const selectedDaysList = this.weekdays.filter(day => this.selectedDays[day]);
        
        if (selectedDaysList.length === 0) {
          this.description = `Runs every week at ${hours}:${minute}.`;
          this.generatedCron = `0 ${minute} ${hours} * * *`;
        } else {
          const daysText = selectedDaysList
            .map(day => this.capitalize(day))
            .join(', ');
          
          const dayNumbers = selectedDaysList
            .map(day => this.weekdays.indexOf(day))
            .join(',');
          
          this.description = `Runs every week on ${daysText} at ${hours}:${minute}.`;
          this.generatedCron = `0 ${minute} ${hours} * * ${dayNumbers}`;
        }
        break;
        
      case 'monthly':
        const dayWithSuffix = this.ordinalSuffix(this.date);
        this.description = `Runs every month on the ${dayWithSuffix} day at ${hours}:${minute}.`;
        this.generatedCron = `0 ${minute} ${hours} ${this.date} * *`;
        break;
        
      default:
        this.description = '';
        this.generatedCron = '';
    }
  }

  capitalize(day: string): string {
    return day.charAt(0).toUpperCase() + day.slice(1);
  }

  ordinalSuffix(day: string): string {
    const num = parseInt(day);
    
    if (num >= 11 && num <= 13) {
      return num + 'th';
    }
    
    switch (num % 10) {
      case 1:
        return num + 'st';
      case 2:
        return num + 'nd';
      case 3:
        return num + 'rd';
      default:
        return num + 'th';
    }
  }

  getDaysKeys() {
    return Object.keys(this.selectedDays);
  }

  copyDescription() {
    this.copyToClipboard(this.description);
  }

  copyCron() {
    this.copyToClipboard(this.generatedCron);
  }

  private copyToClipboard(text: string) {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}