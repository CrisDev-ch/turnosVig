import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';
import { User } from '../../models/user.model';
import { Event, EVENT_TYPES } from '../../models/event.model';

@Component({
  selector: 'app-general-day-detail',
  templateUrl: './general-day-detail.page.html',
  styleUrls: ['./general-day-detail.page.scss'],
  standalone: false
})
export class GeneralDayDetailPage implements OnInit {
  selectedDate: string = '';
  dayEvents: Event[] = [];
  currentUser: User | null = null;
  eventsByUser: { [key: string]: Event[] } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['date'];
      this.loadDayEvents();
    });
  }

  loadDayEvents() {
    this.dayEvents = this.eventsService.getEvents().filter(
      e => e.date === this.selectedDate && e.status === 'approved'
    );

    // Group events by user
    this.eventsByUser = {};
    this.dayEvents.forEach(event => {
      if (!this.eventsByUser[event.user_name]) {
        this.eventsByUser[event.user_name] = [];
      }
      this.eventsByUser[event.user_name].push(event);
    });
  }

  getEventColor(eventType: string): string {
    return EVENT_TYPES[eventType as keyof typeof EVENT_TYPES]?.color || '#000';
  }

  getEventTypeLabel(eventType: string): string {
    return EVENT_TYPES[eventType as keyof typeof EVENT_TYPES]?.label || eventType;
  }

  get userNames(): string[] {
    return Object.keys(this.eventsByUser);
  }

  goBack() {
    this.router.navigate(['/general-calendar']);
  }
}
