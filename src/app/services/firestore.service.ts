import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  Firestore,
  initializeFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Query,
  DocumentData,
  writeBatch
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private db: Firestore;
  private usersSubject = new BehaviorSubject<User[]>([]);
  private eventsSubject = new BehaviorSubject<Event[]>([]);

  public users$ = this.usersSubject.asObservable();
  public events$ = this.eventsSubject.asObservable();

  constructor() {
    const app = initializeApp(environment.firebase);
    this.db = initializeFirestore(app, {});
  }

  // User operations
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const usersRef = collection(this.db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(this.db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async createUser(userId: string, userData: Omit<User, 'id'>): Promise<void> {
    try {
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, userData as any);
    } catch (error) {
      // If document doesn't exist, create it
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, userData as any).catch(async () => {
        // Create new document if it doesn't exist
        const userRef = doc(this.db, 'users', userId);
        await updateDoc(userRef, userData as any);
      });
    }
  }

  async setUserData(userId: string, userData: Omit<User, 'id'>): Promise<void> {
    try {
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, userData as any);
    } catch (error) {
      // Fallback: try to set using a batch
      const batch = writeBatch(this.db);
      const userRef = doc(this.db, 'users', userId);
      batch.set(userRef, userData);
      await batch.commit();
    }
  }

  async loadAllUsers(): Promise<void> {
    try {
      const usersRef = collection(this.db, 'users');
      const snapshot = await getDocs(usersRef);
      const users: User[] = [];
      
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });
      
      this.usersSubject.next(users);
    } catch (error) {
      console.error('Error loading users:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(this.db, 'users', userId);
      await deleteDoc(userRef);
      await this.loadAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Event operations
  async addEvent(eventData: Omit<Event, 'id'>): Promise<string> {
    try {
      const eventsRef = collection(this.db, 'events');
      const docRef = await addDoc(eventsRef, {
        ...eventData,
        created_at: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  async loadAllEvents(): Promise<void> {
    try {
      const eventsRef = collection(this.db, 'events');
      const snapshot = await getDocs(eventsRef);
      const events: Event[] = [];
      
      snapshot.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() } as Event);
      });
      
      this.eventsSubject.next(events);
    } catch (error) {
      console.error('Error loading events:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, updates: Partial<Event>): Promise<void> {
    try {
      const eventRef = doc(this.db, 'events', eventId);
      await updateDoc(eventRef, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      await this.loadAllEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const eventRef = doc(this.db, 'events', eventId);
      await deleteDoc(eventRef);
      await this.loadAllEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  getUsers(): User[] {
    return this.usersSubject.value;
  }

  getEvents(): Event[] {
    return this.eventsSubject.value;
  }
}
