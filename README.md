# 📍 MiUbicacion GPS App

> Aplicación Ionic + Angular que registra tu geolocalización en Firebase y Supabase, y genera un link directo a Google Maps.

---

## ✨ Características

- Obtención de coordenadas GPS con alta precisión
- Guardado manual con nombre/etiqueta personalizada
- Escritura simultánea en **Firebase Firestore** y **Supabase**
- Generación de link de Google Maps con las coordenadas actuales
- Botón para abrir Google Maps directamente en el navegador
- Botón para copiar el link al portapapeles
- Estados visuales de carga, éxito y error por cada base de datos

---

## 🛠 Stack tecnológico

| Tecnología | Versión |
|---|---|
| Ionic | ^8 |
| Angular | ^20 |
| Capacitor | ^7 |
| Firebase (Firestore) | ^10 |
| @supabase/supabase-js | ^2 |
| TypeScript | ~5.8 |

---

## 🚀 Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en el navegador
ionic serve
```

> **Requisitos previos:** Node.js e Ionic CLI (`npm install -g @ionic/cli`)

---

## ⚠️ Fix de TypeScript requerido

Supabase necesita los tipos de Node. Ejecuta:

```bash
npm i --save-dev @types/node
```

Luego en `tsconfig.app.json` agrega `"node"` en types:

```json
"types": ["node"]
```

---

## 🗄️ Configuración de Supabase

### 1. Crear la tabla

Ve a tu proyecto en [supabase.com](https://supabase.com) → **SQL Editor** y ejecuta:

```sql
CREATE TABLE ubicaciones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  latitud double precision NOT NULL,
  longitud double precision NOT NULL,
  nombre text NOT NULL,
  fecha_hora timestamptz NOT NULL
);
```

### 2. Desactivar RLS (Row Level Security)

Por defecto Supabase activa RLS, lo que bloquea los inserts sin autenticación. Tienes dos opciones:

**Opción A — Desactivar RLS completamente (más simple, para pruebas):**

```sql
ALTER TABLE ubicaciones DISABLE ROW LEVEL SECURITY;
```

**Opción B — Mantener RLS con políticas permisivas:**

```sql
ALTER TABLE ubicaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert" ON ubicaciones
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_select" ON ubicaciones
  FOR SELECT USING (true);
```

> También puedes desactivarlo desde la interfaz: **Table Editor → ubicaciones → ícono de escudo → desactivar RLS**

---

## 🔥 Configuración de Firebase

### 1. Habilitar Firestore

En [console.firebase.google.com](https://console.firebase.google.com) → tu proyecto → **Firestore Database** → Crear base de datos.

> La colección `ubicaciones` se crea automáticamente al guardar el primer registro. No necesitas crearla manualmente.

### 2. Reglas de Firestore (desarrollo)

Ve a **Firestore → Reglas** y usa:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ubicaciones/{doc} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ Estas reglas son abiertas. Para producción, restringe el acceso con autenticación.

---

## 🗂 Estructura de datos

Cada registro guardado en ambas bases de datos contiene:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid / auto | Identificador único |
| `latitud` | float8 | Latitud GPS |
| `longitud` | float8 | Longitud GPS |
| `nombre` | text | Etiqueta del usuario |
| `fecha_hora` | timestamptz | Fecha y hora del registro |

---

## 📱 Uso de la app

1. Al abrir la app se solicitan permisos de GPS automáticamente
2. Presiona **"Actualizar ubicación"** para obtener las coordenadas
3. Escribe una etiqueta opcional (ej: `Casa`, `Trabajo`)
4. Presiona **"Guardar en Firebase y Supabase"**
5. Usa **"Abrir en Google Maps"** o **"Copiar link"** para compartir tu posición

---

## 📁 Archivos principales modificados

```
src/
├── environments/
│   └── environment.ts           # Credenciales Firebase y Supabase
├── app/
│   ├── services/
│   │   ├── firebase.service.ts  # Guarda en Firestore
│   │   ├── supabase.service.ts  # Guarda en Supabase
│   │   └── location.ts          # GPS + link Google Maps
│   └── home/
│       ├── home.page.ts         # Lógica principal
│       ├── home.page.html       # UI
│       └── home.page.scss       # Estilos
```
