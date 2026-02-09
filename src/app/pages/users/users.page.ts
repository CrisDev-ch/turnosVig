import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { EventsService } from '../../services/events.service';
import { ToastService } from '../../services/toast.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false
})
export class UsersPage implements OnInit {
  workers: User[] = [];
  currentUser: User | null = null;
  
  // Form fields for creating new users
  newUserName: string = '';
  newUserEmail: string = '';
  newUserPassword: string = '';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private eventsService: EventsService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadWorkers();
  }

  loadWorkers() {
    this.workers = this.usersService.getWorkers();
  }

  async handleCreateUser() {
    if (!this.newUserName || !this.newUserEmail || !this.newUserPassword) {
      await this.toastService.error('Por favor complete todos los campos');
      return;
    }

    if (this.newUserPassword.length < 6) {
      await this.toastService.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.usersService.getUsers().some(u => u.email === this.newUserEmail)) {
      await this.toastService.error('El email ya está registrado');
      return;
    }

    const loader = await this.loadingController.create({
      message: 'Creando usuario...',
    });
    await loader.present();

    try {
      // Create user in Firebase Auth
      const userCredential = await this.authService.createUser(this.newUserEmail, this.newUserPassword);
      const newUserId = userCredential.uid;

      // Save user data to Firestore
      await this.usersService.createUser(newUserId, {
        email: this.newUserEmail,
        name: this.newUserName,
        role: 'worker',
        created_at: new Date().toISOString()
      });

      // Reload users list
      await this.usersService.loadUsers();
      this.loadWorkers();

      // Re-login as admin to maintain session
      // This is the critical fix for the session bug
      await this.authService.reLoginAdmin();
      
      // Restore admin user data
      if (this.currentUser) {
        this.authService.setCurrentUser(this.currentUser);
      }

      // Reset form
      this.newUserName = '';
      this.newUserEmail = '';
      this.newUserPassword = '';

      await loader.dismiss();
      await this.toastService.success('Usuario creado exitosamente');
    } catch (error: any) {
      await loader.dismiss();
      console.error('Error creating user:', error);
      
      // Try to restore admin session in case of error
      try {
        await this.authService.reLoginAdmin();
        if (this.currentUser) {
          this.authService.setCurrentUser(this.currentUser);
        }
      } catch (reloginError) {
        console.error('Error re-logging admin:', reloginError);
        await this.toastService.error('Sesión perdida. Por favor inicie sesión nuevamente.');
        this.router.navigate(['/login']);
        return;
      }
      
      await this.toastService.error('Error al crear usuario: ' + error.message);
    }
  }

  async confirmDeleteUser(userId: string) {
    const user = this.workers.find(u => u.id === userId);
    if (!user) return;

    const alert = await this.alertController.create({
      header: '¿Eliminar usuario?',
      message: `Se eliminarán todos los eventos asociados a ${user.name}.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteUser(userId),
        },
      ],
    });

    await alert.present();
  }

  async deleteUser(userId: string) {
    const loader = await this.loadingController.create({
      message: 'Eliminando usuario...',
    });
    await loader.present();

    try {
      // Delete user events first
      const allEvents = this.eventsService.getEvents();
      const userEvents = allEvents.filter(e => e.user_id === userId);
      
      for (const event of userEvents) {
        if (event.id) {
          await this.eventsService.deleteEvent(event.id);
        }
      }

      // Delete user from Firestore
      await this.usersService.deleteUser(userId);
      
      // Reload data
      await this.usersService.loadUsers();
      await this.eventsService.loadEvents();
      this.loadWorkers();

      await loader.dismiss();
      await this.toastService.success('Usuario eliminado');
    } catch (error: any) {
      await loader.dismiss();
      console.error('Error deleting user:', error);
      await this.toastService.error('Error al eliminar usuario: ' + error.message);
    }
  }

  goBack() {
    this.router.navigate(['/calendar']);
  }
}
