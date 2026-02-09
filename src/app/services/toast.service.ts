import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async show(message: string, color: string = 'success', duration: number = 3000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
      color,
    });
    await toast.present();
  }

  async success(message: string): Promise<void> {
    await this.show(message, 'success');
  }

  async error(message: string): Promise<void> {
    await this.show(message, 'danger');
  }

  async warning(message: string): Promise<void> {
    await this.show(message, 'warning');
  }

  async info(message: string): Promise<void> {
    await this.show(message, 'primary');
  }
}
