import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { environment } from '../../environments/environment';

export interface UbicacionRecord {
  latitud: number;
  longitud: number;
  nombre: string;
  fecha_hora: any;
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.db = getFirestore(this.app);
  }

  async guardarUbicacion(latitud: number, longitud: number, nombre: string): Promise<string> {
    const record: UbicacionRecord = {
      latitud,
      longitud,
      nombre,
      fecha_hora: serverTimestamp()
    };
    const colRef = collection(this.db, 'ubicaciones');
    const docRef = await addDoc(colRef, record);
    return docRef.id;
  }
}
