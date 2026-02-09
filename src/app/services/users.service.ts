import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  async loadUsers(): Promise<void> {
    return this.firestoreService.loadAllUsers();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.firestoreService.getUserByEmail(email);
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.firestoreService.getUserById(userId);
  }

  async createUser(userId: string, userData: Omit<User, 'id'>): Promise<void> {
    return this.firestoreService.setUserData(userId, userData);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.firestoreService.deleteUser(userId);
  }

  getUsers(): User[] {
    return this.firestoreService.getUsers();
  }

  getUsers$(): Observable<User[]> {
    return this.firestoreService.users$;
  }

  getWorkers(): User[] {
    return this.getUsers().filter(u => u.role === 'worker');
  }
}
