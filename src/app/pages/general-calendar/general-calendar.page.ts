import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';
import { Event, EVENT_TYPES } from '../../models/event.model';

@Component({
  selector: 'app-general-calendar',
  templateUrl: './general-calendar.page.html',
  styleUrls: ['./general-calendar.page.scss'],
  standalone: false
})
export class GeneralCalendarPage implements OnInit {
  currentDate: Date = new Date();
  currentUser: User | null = null;
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  daysInMonth: number = 0;
  firstDayOfWeek: number = 0;
  calendarDays: CalendarDay[] = [];

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
    private toastService: ToastService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    await this.eventsService.loadEvents();
    this.buildCalendar();
  }

  buildCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    this.daysInMonth = lastDay.getDate();
    this.firstDayOfWeek = firstDay.getDay();

    this.calendarDays = [];
    
    // Add empty days before month starts
    for (let i = 0; i < this.firstDayOfWeek; i++) {
      this.calendarDays.push({ day: 0, date: '', events: [] });
    }

    // Add days of the month
    for (let day = 1; day <= this.daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = this.getApprovedEventsForDate(dateStr);
      
      this.calendarDays.push({
        day,
        date: dateStr,
        events: dayEvents,
        isToday: new Date().toDateString() === new Date(year, month, day).toDateString()
      });
    }
  }

  getApprovedEventsForDate(date: string): Event[] {
    return this.eventsService.getEvents().filter(
      e => e.date === date && e.status === 'approved'
    );
  }

  changeMonth(delta: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.currentDate = new Date(this.currentDate);
    this.buildCalendar();
  }

  selectDay(date: string) {
    this.router.navigate(['/general-day-detail'], { queryParams: { date } });
  }

  goBack() {
    this.router.navigate(['/calendar']);
  }

  getEventColor(eventType: string): string {
    return EVENT_TYPES[eventType as keyof typeof EVENT_TYPES]?.color || '#000';
  }
}

interface CalendarDay {
  day: number;
  date: string;
  events: Event[];
  isToday?: boolean;
}
