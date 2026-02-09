import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';
import { Event, EVENT_TYPES } from '../../models/event.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: false
})
export class RequestsPage implements OnInit {
  currentUser: User | null = null;
  isAdmin: boolean = false;
  pendingRequests: Event[] = [];
  processedRequests: Event[] = [];
  
  segment: string = 'pending';

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
    private toastService: ToastService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin';
    this.loadRequests();
  }

  loadRequests() {
    const allEvents = this.eventsService.getEvents();
    
    let requests: Event[];
    if (this.isAdmin) {
      requests = allEvents.filter(e => e.type !== 'shift');
    } else {
      requests = allEvents.filter(e => e.user_id === this.currentUser?.id && e.type !== 'shift');
    }

    this.pendingRequests = requests.filter(r => r.status === 'pending');
    this.processedRequests = requests.filter(r => r.status !== 'pending');
  }

  async updateEventStatus(eventId: string | undefined, status: 'approved' | 'rejected') {
    if (!eventId) return;

    try {
      await this.eventsService.updateEventStatus(eventId, status);
      await this.toastService.success(
        status === 'approved' ? 'Solicitud aprobada' : 'Solicitud rechazada'
      );
      this.loadRequests();
    } catch (error) {
      console.error('Error updating event:', error);
      await this.toastService.error('Error al actualizar solicitud');
    }
  }

  getEventColor(eventType: string): string {
    return EVENT_TYPES[eventType as keyof typeof EVENT_TYPES]?.color || '#000';
  }

  getEventTypeLabel(eventType: string): string {
    return EVENT_TYPES[eventType as keyof typeof EVENT_TYPES]?.label || eventType;
  }

  goBack() {
    this.router.navigate(['/calendar']);
  }
}
