import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';
import { LoadingController } from '@ionic/angular';
import { User } from '../../models/user.model';
import { SHIFT_SCHEDULES } from '../../models/event.model';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
  standalone: false
})
export class CreateEventPage implements OnInit {
  currentUser: User | null = null;
  isAdmin: boolean = false;
  workers: User[] = [];
  
  selectedUser: string = '';
  selectedType: string = '';
  startDate: string = '';
  endDate: string = '';
  startTime: string = '';
  endTime: string = '';
  notes: string = '';
  
  SHIFT_SCHEDULES = SHIFT_SCHEDULES;
  
  showScheduleSelect: boolean = false;

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
    private usersService: UsersService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin';
    
    if (this.isAdmin) {
      this.workers = this.usersService.getWorkers();
    } else {
      this.selectedUser = this.currentUser?.id || '';
    }
  }

  handleEventTypeChange() {
    this.showScheduleSelect = this.selectedType === 'shift';
  }

  handleScheduleChange(event: any) {
    const [start, end] = event.detail.value.split('|');
    this.startTime = start;
    this.endTime = end;
  }

  async handleEventSubmit() {
    if (!this.selectedUser || !this.selectedType || !this.startDate || !this.endDate || !this.startTime || !this.endTime) {
      await this.toastService.error('Por favor complete todos los campos requeridos');
      return;
    }

    const start = new Date(this.startDate + 'T00:00:00');
    const end = new Date(this.endDate + 'T00:00:00');

    if (end < start) {
      await this.toastService.error('La fecha de término debe ser posterior a la fecha de inicio');
      return;
    }

    // Generate all dates between start and end
    const dates: string[] = [];
    const currentDateIter = new Date(start);
    while (currentDateIter <= end) {
      dates.push(currentDateIter.toISOString().split('T')[0]);
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    const loader = await this.loadingController.create({
      message: 'Creando evento...',
    });
    await loader.present();

    try {
      const selectedUserObj = this.usersService.getUsers().find(u => u.id === this.selectedUser);
      const userName = selectedUserObj?.name || this.currentUser?.name || '';

      const eventData = {
        type: this.selectedType as any,
        user_id: this.selectedUser,
        user_name: userName,
        start_time: this.startTime,
        end_time: this.endTime,
        status: (this.isAdmin ? 'approved' : 'pending') as any,
        notes: this.notes,
        created_at: new Date().toISOString()
      };

      await this.eventsService.addMultipleEvents(dates, eventData);
      await this.eventsService.loadEvents();

      await loader.dismiss();
      await this.toastService.success(
        this.isAdmin ? 'Evento creado exitosamente' : 'Solicitud enviada exitosamente'
      );
      this.router.navigate(['/calendar']);
    } catch (error: any) {
      await loader.dismiss();
      console.error('Error creating event:', error);
      await this.toastService.error('Error al crear evento: ' + error.message);
    }
  }

  goBack() {
    this.router.navigate(['/calendar']);
  }
}
