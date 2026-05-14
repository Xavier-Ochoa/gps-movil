import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel,
  IonInput, IonBadge, IonIcon, IonSpinner, IonText
} from '@ionic/angular/standalone';
import { NgIf, NgClass, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  locationOutline, saveOutline, mapOutline,
  checkmarkCircleOutline, alertCircleOutline, refreshOutline
} from 'ionicons/icons';

import { LocationService } from '../services/location';
import { FirebaseService } from '../services/firebase.service';
import { SupabaseService } from '../services/supabase.service';

type EstadoGuardado = 'idle' | 'guardando' | 'exito' | 'error';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonItem, IonLabel, IonInput, IonBadge,
    IonIcon, IonSpinner, IonText,
    NgIf, NgClass, FormsModule, DecimalPipe
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  watchId: string | null = null;
  errorMsg = signal<string | null>(null);

  nombreEtiqueta = '';
  estadoFirebase = signal<EstadoGuardado>('idle');
  estadoSupabase = signal<EstadoGuardado>('idle');
  mensajeFirebase = signal<string>('');
  mensajeSupabase = signal<string>('');
  googleMapsLink = signal<string | null>(null);

  constructor(
    private loc: LocationService,
    private firebaseSvc: FirebaseService,
    private supabaseSvc: SupabaseService
  ) {
    addIcons({
      locationOutline, saveOutline, mapOutline,
      checkmarkCircleOutline, alertCircleOutline, refreshOutline
    });
  }

  async ngOnInit() {
    await this.loc.ensurePermissions();
    await this.obtenerUbicacionActual();
  }

  async obtenerUbicacionActual() {
    try {
      this.errorMsg.set(null);
      const pos = await this.loc.getCurrentPosition();
      this.latitude.set(pos.coords.latitude);
      this.longitude.set(pos.coords.longitude);
      // Generar link de Google Maps automáticamente al obtener ubicación
      this.googleMapsLink.set(
        this.loc.generarLinkGoogleMaps(pos.coords.latitude, pos.coords.longitude)
      );
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'Error al obtener la ubicación actual');
    }
  }

  async guardarUbicacion() {
    const lat = this.latitude();
    const lng = this.longitude();

    if (lat === null || lng === null) {
      this.errorMsg.set('Primero obtén tu ubicación actual.');
      return;
    }

    const nombre = this.nombreEtiqueta.trim() || 'Sin etiqueta';

    // Reset estados
    this.estadoFirebase.set('guardando');
    this.estadoSupabase.set('guardando');
    this.mensajeFirebase.set('');
    this.mensajeSupabase.set('');

    // Guardar en Firebase
    this.firebaseSvc.guardarUbicacion(lat, lng, nombre)
      .then((id) => {
        this.estadoFirebase.set('exito');
        this.mensajeFirebase.set(`Guardado! ID: ${id}`);
      })
      .catch((err) => {
        this.estadoFirebase.set('error');
        this.mensajeFirebase.set(err?.message ?? 'Error en Firebase');
      });

    // Guardar en Supabase
    this.supabaseSvc.guardarUbicacion(lat, lng, nombre)
      .then(() => {
        this.estadoSupabase.set('exito');
        this.mensajeSupabase.set('Guardado correctamente');
      })
      .catch((err) => {
        this.estadoSupabase.set('error');
        this.mensajeSupabase.set(err?.message ?? 'Error en Supabase');
      });
  }

  abrirGoogleMaps() {
    const lat = this.latitude();
    const lng = this.longitude();
    if (lat !== null && lng !== null) {
      this.loc.abrirEnGoogleMaps(lat, lng);
    }
  }

  copiarLink() {
    const link = this.googleMapsLink();
    if (link) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
  }

  ngOnDestroy() {
    if (this.watchId) this.loc.clearWatch(this.watchId);
  }
}
