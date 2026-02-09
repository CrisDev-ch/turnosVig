import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private adminCredentials: { email?: string; password?: string } = {};

  constructor() {
    const app = initializeApp(environment.firebase);
    this.auth = initializeAuth(app, { persistence: browserLocalPersistence });
    
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    // Set up auth state listener
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User data will be set by FirestoreService after fetching from DB
        this.currentUserSubject.next(this.currentUserSubject.value);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      await setPersistence(this.auth, browserLocalPersistence);
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Store admin credentials to re-login after creating user
      this.adminCredentials = { email, password };
      
      return null; // Will be populated by FirestoreService
    } catch (error) {
      throw error;
    }
  }

  async createUser(email: string, password: string): Promise<FirebaseUser> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // After creating the user, immediately sign back to admin
      // The re-login will happen in the UsersService after saving the new user data
      return credential.user;
    } catch (error) {
      throw error;
    }
  }

  async reLoginAdmin(): Promise<void> {
    if (this.adminCredentials.email && this.adminCredentials.password) {
      try {
        await signInWithEmailAndPassword(this.auth, this.adminCredentials.email, this.adminCredentials.password);
      } catch (error) {
        console.error('Error re-logging admin:', error);
        throw error;
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      this.adminCredentials = {};
    } catch (error) {
      throw error;
    }
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthUser() {
    return this.auth.currentUser;
  }
}

