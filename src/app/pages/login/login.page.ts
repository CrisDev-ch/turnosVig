import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  async handleLogin() {
    if (!this.email || !this.password) {
      await this.toastService.error('Por favor complete todos los campos');
      return;
    }

    const loader = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loader.present();

    try {
      await this.authService.login(this.email, this.password);
      const authUser = this.authService.getAuthUser();
      
      if (!authUser) {
        await this.toastService.error('Error en la autenticación');
        await loader.dismiss();
        return;
      }

      // Try to get user from Firestore by UID first
      let user = await this.usersService.getUserById(authUser.uid);
      
      if (!user) {
        // Fallback: try to find by email
        user = await this.usersService.getUserByEmail(this.email);
        
        if (user) {
          // Sync the profile to UID for future logins
          await this.usersService.createUser(authUser.uid, {
            email: user.email,
            name: user.name,
            role: user.role,
            created_at: user.created_at
          });
        }
      }

      if (!user) {
        await this.authService.logout();
        await this.toastService.error('Perfil no encontrado en la base de datos. Contacte al administrador.');
        await loader.dismiss();
        return;
      }

      this.authService.setCurrentUser(user);
      await this.usersService.loadUsers();
      await loader.dismiss();
      
      this.router.navigate(['/calendar']);
      await this.toastService.success('Inicio de sesión exitoso');
    } catch (error: any) {
      await loader.dismiss();
      console.error('Login error:', error);
      await this.toastService.error('Error al iniciar sesión: ' + error.message);
    }
  }
}
