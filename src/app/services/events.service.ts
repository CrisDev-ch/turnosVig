import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Event } from '../models/event.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private firestoreService: FirestoreService) {}

  async addEvent(eventData: Omit<Event, 'id'>): Promise<string> {
    return this.firestoreService.addEvent(eventData);
  }

  async addMultipleEvents(dates: string[], baseEventData: Omit<Event, 'id' | 'date'>): Promise<void> {
    for (const date of dates) {
      await this.addEvent({ ...baseEventData, date });
    }
  }

  async loadEvents(): Promise<void> {
    return this.firestoreService.loadAllEvents();
  }

  async updateEventStatus(eventId: string, status: 'approved' | 'rejected'): Promise<void> {
    return this.firestoreService.updateEvent(eventId, { status });
  }

  async deleteEvent(eventId: string): Promise<void> {
    return this.firestoreService.deleteEvent(eventId);
  }

  getEvents(): Event[] {
    return this.firestoreService.getEvents();
  }

  getEvents$(): Observable<Event[]> {
    return this.firestoreService.events$;
  }

  getEventsByUserId(userId: string): Event[] {
    return this.getEvents().filter(e => e.user_id === userId);
  }

  getEventsByDate(date: string): Event[] {
    return this.getEvents().filter(e => e.date === date);
  }

  getApprovedEvents(): Event[] {
    return this.getEvents().filter(e => e.status === 'approved');
  }

  getPendingRequests(): Event[] {
    return this.getEvents().filter(e => e.type !== 'shift' && e.status === 'pending');
  }
}
