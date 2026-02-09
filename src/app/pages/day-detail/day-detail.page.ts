import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';
import { Event, EVENT_TYPES } from '../../models/event.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.page.html',
  styleUrls: ['./day-detail.page.scss'],
  standalone: false
})
export class DayDetailPage implements OnInit {
  selectedDate: string = '';
  dayEvents: Event[] = [];
  currentUser: User | null = null;
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private eventsService: EventsService,
    private toastService: ToastService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin';

    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['date'];
      this.loadDayEvents();
    });
  }

  loadDayEvents() {
    const allEvents = this.eventsService.getEvents();
    
    if (this.isAdmin) {
      this.dayEvents = allEvents.filter(e => e.date === this.selectedDate && e.status === 'approved');
    } else {
      this.dayEvents = allEvents.filter(e => e.date === this.selectedDate && e.user_id === this.currentUser?.id);
    }
  }

  getEventColor(eventType: string): string {
    return EVENT_TYPES[eventType as keyof typeof EVENT_TYPES]?.color || '#000';
  }

  getEventTypeLabel(eventType: string): string {
    return EVENT_TYPES[eventType as keyof typeof EVENT_TYPES]?.label || eventType;
  }

  async deleteEvent(eventId: string | undefined) {
    if (!eventId) return;

    const alert = await this.alertController.create({
      header: '¿Eliminar evento?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.eventsService.deleteEvent(eventId);
              await this.toastService.success('Evento eliminado');
              this.router.navigate(['/calendar']);
            } catch (error) {
              console.error('Error deleting event:', error);
              await this.toastService.error('Error al eliminar evento');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  goBack() {
    this.router.navigate(['/calendar']);
  }
}
