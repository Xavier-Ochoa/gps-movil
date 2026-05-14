# Setup - MiUbicación GPS App

## 1. Instalar dependencias

```bash
npm install
```

## 2. Crear tabla en Supabase

En tu proyecto de Supabase ve a **SQL Editor** y ejecuta:

```sql
CREATE TABLE ubicaciones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  latitud double precision NOT NULL,
  longitud double precision NOT NULL,
  nombre text NOT NULL,
  fecha_hora timestamptz NOT NULL
);

-- Permitir inserciones públicas (sin autenticación)
ALTER TABLE ubicaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert" ON ubicaciones
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_select" ON ubicaciones
  FOR SELECT USING (true);
```

## 3. Colección en Firebase (Firestore)

No requiere setup manual. La colección **`ubicaciones`** se crea automáticamente
al guardar el primer registro. Solo asegúrate de que en Firestore las reglas
permitan escritura (para pruebas):

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

## 4. Ejecutar en desarrollo

```bash
ionic serve
```

## 5. Estructura guardada

Cada registro guardado contiene:
| Campo       | Tipo      | Descripción                     |
|-------------|-----------|----------------------------------|
| latitud     | number    | Latitud GPS                      |
| longitud    | number    | Longitud GPS                     |
| nombre      | string    | Etiqueta/nombre del punto        |
| fecha_hora  | timestamp | Fecha y hora del registro        |
