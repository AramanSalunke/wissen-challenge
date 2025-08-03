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
  validationError: string = '';
  nextExecutions: string[] = [];
  private calculateTimeout: any;

  onCronChange(value: string | Event) {
    const expression = typeof value === 'string' ? value : (value.target as HTMLInputElement).value;
    
    const trimmed = expression.trim();
    
    if (!trimmed) {
      this.resetFields();
      this.validationError = '';
      this.nextExecutions = [];
      return;
    }
    
    const parts = trimmed.split(/\s+/).filter(part => part.length > 0);
    
    if (parts.length !== 6) {
      this.resetFields();
      this.validationError = `Invalid expression: Expected 6 fields but got ${parts.length}. Format: seconds minutes hours days month dayOfWeek`;
      this.nextExecutions = [];
      return;
    }
    
    const validationResult = this.validateCronExpression(parts);
    if (!validationResult.isValid) {
      this.validationError = validationResult.error;
      this.resetFields();
      this.nextExecutions = [];
      return;
    }
    
    this.validationError = '';
    
    this.cronFields.seconds = parts[0];
    this.cronFields.minutes = parts[1];
    this.cronFields.hours = parts[2];
    this.cronFields.days = parts[3];
    this.cronFields.month = parts[4];
    this.cronFields.dayOfWeek = parts[5];
    
    this.activeFields.seconds = parts[0] !== '*';
    this.activeFields.minutes = parts[1] !== '*';
    this.activeFields.hours = parts[2] !== '*';
    this.activeFields.days = parts[3] !== '*';
    this.activeFields.month = parts[4] !== '*';
    this.activeFields.dayOfWeek = parts[5] !== '*';
    
    if (this.calculateTimeout) {
      clearTimeout(this.calculateTimeout);
    }
    
    this.nextExecutions = ['Calculating...'];
    
    this.calculateTimeout = setTimeout(() => {
      this.calculateNextExecutions();
    }, 300);
  }
  
  private resetFields() {
    this.cronFields = {
      seconds: '*',
      minutes: '*',
      hours: '*',
      days: '*',
      month: '*',
      dayOfWeek: '*'
    };
    
    this.activeFields = {
      seconds: false,
      minutes: false,
      hours: false,
      days: false,
      month: false,
      dayOfWeek: false
    };
  }

  validateCronExpression(parts: string[]): { isValid: boolean; error: string } {
    const validations = [
      { field: 'seconds', value: parts[0], min: 0, max: 59 },
      { field: 'minutes', value: parts[1], min: 0, max: 59 },
      { field: 'hours', value: parts[2], min: 0, max: 23 },
      { field: 'days', value: parts[3], min: 1, max: 31 },
      { field: 'month', value: parts[4], min: 1, max: 12 },
      { field: 'dayOfWeek', value: parts[5], min: 0, max: 7 }
    ];

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (const { field, value, min, max } of validations) {
      if (value === '*') continue;
      
      if (value.includes('-')) {
        const [start, end] = value.split('-');
        if (!this.isValidNumber(start, min, max) || !this.isValidNumber(end, min, max)) {
          return { isValid: false, error: `Invalid range in ${field}: ${value}` };
        }
        continue;
      }
      
      if (value.includes('/')) {
        const [range, step] = value.split('/');
        if (range !== '*' && !this.isValidNumber(range, min, max)) {
          return { isValid: false, error: `Invalid value in ${field}: ${value}` };
        }
        if (!this.isValidNumber(step, 1, max)) {
          return { isValid: false, error: `Invalid step in ${field}: ${value}` };
        }
        continue;
      }
      
      if (value.includes(',')) {
        const values = value.split(',');
        for (const v of values) {
          if (!this.isValidNumber(v, min, max)) {
            return { isValid: false, error: `Invalid value in ${field}: ${v}` };
          }
        }
        continue;
      }
      
      if (field === 'month' && monthNames.includes(value.toUpperCase())) {
        continue;
      }
      
      if (field === 'dayOfWeek' && dayNames.includes(value.toUpperCase())) {
        continue;
      }
      
      if (!this.isValidNumber(value, min, max)) {
        return { isValid: false, error: `Invalid value in ${field}: ${value} (must be ${min}-${max})` };
      }
    }
    
    return { isValid: true, error: '' };
  }

  private isValidNumber(value: string, min: number, max: number): boolean {
    const num = parseInt(value);
    return !isNaN(num) && num >= min && num <= max;
  }

  calculateNextExecutions() {
    try {
      const now = new Date();
      const executions = [];
      let currentDate = new Date(now);
      currentDate.setMilliseconds(0);
      
      currentDate.setSeconds(currentDate.getSeconds() + 1);
      
      let count = 0;
      let iterations = 0;
      const maxIterations = 10000;
      
      while (count < 5 && iterations < maxIterations) {
        iterations++;
        
        if (this.matchesCronExpression(currentDate)) {
          executions.push(new Date(currentDate).toLocaleString());
          count++;
        }
        
        currentDate = this.getNextPossibleDate(currentDate);
      }
      
      this.nextExecutions = executions;
    } catch (error) {
      console.error('Error calculating next executions:', error);
      this.nextExecutions = [];
    }
  }

  private getNextPossibleDate(date: Date): Date {
    const nextDate = new Date(date);
    
    if (this.cronFields.days !== '*' && !this.cronFields.days.includes('/') && !this.cronFields.days.includes(',') && !this.cronFields.days.includes('-')) {
      const targetDay = parseInt(this.cronFields.days);
      const currentDay = nextDate.getDate();
      
      if (currentDay > targetDay || (currentDay === targetDay && !this.timeMatchesForToday(nextDate))) {
        nextDate.setDate(1);
        nextDate.setMonth(nextDate.getMonth() + 1);
        
        const daysInMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
        if (targetDay <= daysInMonth) {
          nextDate.setDate(targetDay);
        } else {
          nextDate.setMonth(nextDate.getMonth() + 1);
          nextDate.setDate(targetDay);
        }
        
        nextDate.setHours(0, 0, 0, 0);
        
        if (this.cronFields.hours !== '*' && !this.cronFields.hours.includes('/')) {
          nextDate.setHours(parseInt(this.cronFields.hours));
        }
        if (this.cronFields.minutes !== '*' && !this.cronFields.minutes.includes('/')) {
          nextDate.setMinutes(parseInt(this.cronFields.minutes));
        }
        if (this.cronFields.seconds !== '*' && !this.cronFields.seconds.includes('/')) {
          nextDate.setSeconds(parseInt(this.cronFields.seconds));
        }
        return nextDate;
      }
      
      if (currentDay < targetDay) {
        nextDate.setDate(targetDay);
        nextDate.setHours(0, 0, 0, 0);
        
        if (this.cronFields.hours !== '*' && !this.cronFields.hours.includes('/')) {
          nextDate.setHours(parseInt(this.cronFields.hours));
        }
        if (this.cronFields.minutes !== '*' && !this.cronFields.minutes.includes('/')) {
          nextDate.setMinutes(parseInt(this.cronFields.minutes));
        }
        if (this.cronFields.seconds !== '*' && !this.cronFields.seconds.includes('/')) {
          nextDate.setSeconds(parseInt(this.cronFields.seconds));
        }
        return nextDate;
      }
    }
    
    if (this.cronFields.hours !== '*' && !this.cronFields.hours.includes('/') && !this.cronFields.hours.includes(',') && !this.cronFields.hours.includes('-')) {
      const targetHour = parseInt(this.cronFields.hours);
      if (nextDate.getHours() > targetHour || 
          (nextDate.getHours() === targetHour && !this.minuteAndSecondMatchForThisHour(nextDate))) {
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate.setHours(targetHour, 0, 0, 0);
        
        if (this.cronFields.minutes !== '*' && !this.cronFields.minutes.includes('/')) {
          nextDate.setMinutes(parseInt(this.cronFields.minutes));
        }
        if (this.cronFields.seconds !== '*' && !this.cronFields.seconds.includes('/')) {
          nextDate.setSeconds(parseInt(this.cronFields.seconds));
        }
        return nextDate;
      }
    }
    
    if (this.cronFields.seconds !== '*' && !this.cronFields.seconds.includes('/') && !this.cronFields.seconds.includes(',') && !this.cronFields.seconds.includes('-')) {
      const targetSecond = parseInt(this.cronFields.seconds);
      if (nextDate.getSeconds() >= targetSecond) {
        nextDate.setMinutes(nextDate.getMinutes() + 1);
        nextDate.setSeconds(targetSecond);
        return nextDate;
      }
    }
    
    if (this.cronFields.seconds === '*' || this.cronFields.seconds.includes('/') || this.cronFields.seconds.includes(',') || this.cronFields.seconds.includes('-')) {
      nextDate.setSeconds(nextDate.getSeconds() + 1);
      return nextDate;
    }
    
    if (this.cronFields.minutes !== '*' && !this.cronFields.minutes.includes('/') && !this.cronFields.minutes.includes(',') && !this.cronFields.minutes.includes('-')) {
      const targetMinute = parseInt(this.cronFields.minutes);
      if (nextDate.getMinutes() > targetMinute) {
        nextDate.setHours(nextDate.getHours() + 1);
        nextDate.setMinutes(targetMinute);
        nextDate.setSeconds(parseInt(this.cronFields.seconds) || 0);
        return nextDate;
      }
    }
    
    nextDate.setSeconds(nextDate.getSeconds() + 1);
    return nextDate;
  }

  private timeMatchesForToday(date: Date): boolean {
    const now = new Date();
    if (date.getDate() !== now.getDate()) return true;
    
    if (this.cronFields.hours !== '*' && !this.cronFields.hours.includes('/')) {
      const targetHour = parseInt(this.cronFields.hours);
      if (now.getHours() > targetHour) return false;
      if (now.getHours() === targetHour) {
        if (this.cronFields.minutes !== '*' && !this.cronFields.minutes.includes('/')) {
          const targetMinute = parseInt(this.cronFields.minutes);
          if (now.getMinutes() > targetMinute) return false;
          if (now.getMinutes() === targetMinute) {
            if (this.cronFields.seconds !== '*' && !this.cronFields.seconds.includes('/')) {
              const targetSecond = parseInt(this.cronFields.seconds);
              if (now.getSeconds() >= targetSecond) return false;
            }
          }
        }
      }
    }
    return true;
  }

  private minuteAndSecondMatchForThisHour(date: Date): boolean {
    if (this.cronFields.minutes !== '*' && !this.cronFields.minutes.includes('/')) {
      const targetMinute = parseInt(this.cronFields.minutes);
      if (date.getMinutes() > targetMinute) return false;
      if (date.getMinutes() === targetMinute) {
        if (this.cronFields.seconds !== '*' && !this.cronFields.seconds.includes('/')) {
          const targetSecond = parseInt(this.cronFields.seconds);
          if (date.getSeconds() >= targetSecond) return false;
        }
      }
    }
    return true;
  }

  private matchesCronExpression(date: Date): boolean {
    const second = date.getSeconds();
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();
    
    return this.matchesField(this.cronFields.seconds, second, 0, 59) &&
           this.matchesField(this.cronFields.minutes, minute, 0, 59) &&
           this.matchesField(this.cronFields.hours, hour, 0, 23) &&
           this.matchesField(this.cronFields.days, dayOfMonth, 1, 31) &&
           this.matchesField(this.cronFields.month, month, 1, 12) &&
           this.matchesDayOfWeek(this.cronFields.dayOfWeek, dayOfWeek);
  }

  private matchesField(cronValue: string, actualValue: number, min: number, max: number): boolean {
    if (cronValue === '*') return true;
    
    if (cronValue.includes('/')) {
      const [range, step] = cronValue.split('/');
      const stepNum = parseInt(step);
      
      if (range === '*') {
        return actualValue % stepNum === 0;
      } else {
        const rangeStart = parseInt(range);
        return actualValue >= rangeStart && (actualValue - rangeStart) % stepNum === 0;
      }
    }
    
    if (cronValue.includes('-')) {
      const [start, end] = cronValue.split('-').map(v => parseInt(v));
      return actualValue >= start && actualValue <= end;
    }
    
    if (cronValue.includes(',')) {
      const values = cronValue.split(',').map(v => parseInt(v));
      return values.includes(actualValue);
    }
    
    if (min === 1 && max === 12) {
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthIndex = monthNames.indexOf(cronValue.toUpperCase());
      if (monthIndex !== -1) {
        return actualValue === monthIndex + 1;
      }
    }
    
    return actualValue === parseInt(cronValue);
  }

  private matchesDayOfWeek(cronValue: string, actualValue: number): boolean {
    if (cronValue === '*') return true;
    
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let processedValue = cronValue;
    
    dayNames.forEach((day, index) => {
      processedValue = processedValue.replace(new RegExp(day, 'gi'), index.toString());
    });
    
    if (processedValue === '7' && actualValue === 0) return true;
    
    return this.matchesField(processedValue, actualValue, 0, 7);
  }

  applyPreset(expression: string) {
    this.cronExpression = expression;
    this.onCronChange(expression);
  }

  copyToClipboard(text: string) {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}