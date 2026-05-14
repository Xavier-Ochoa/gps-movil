import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface UbicacionSupabase {
  latitud: number;
  longitud: number;
  nombre: string;
  fecha_hora: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async guardarUbicacion(latitud: number, longitud: number, nombre: string): Promise<void> {
    const record: UbicacionSupabase = {
      latitud,
      longitud,
      nombre,
      fecha_hora: new Date().toISOString()
    };

    const { error } = await this.client
      .from('ubicaciones')
      .insert([record]);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
  }
}
