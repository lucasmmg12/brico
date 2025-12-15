// ============================================
// GRUPO BRICO - Configuración de Supabase
// ============================================

// IMPORTANTE: Reemplaza estos valores con tus credenciales de Supabase
// Puedes encontrarlas en: https://app.supabase.com/project/[tu-proyecto]/settings/api

const SUPABASE_CONFIG = {
    // URL de tu proyecto Supabase
    url: 'https://fhfacchqwvzpkmxlleri.supabase.co',
    
    // Anon/Public Key (es segura para usar en el frontend)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZmFjY2hxd3Z6cGtteGxsZXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjk4MjEsImV4cCI6MjA4MTQwNTgyMX0.6gDuw58ShxvJ39f_t7Wl9PWAZWCrwHR-ogPs3MTURxU',
    
    // Nombre del bucket de Storage para comprobantes
    storageBucket: 'comprobantes'
};

// Ejemplo de cómo deberían verse tus credenciales:
// url: 'https://abcdefghijklmnop.supabase.co'
// anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// ============================================
// INSTRUCCIONES:
// ============================================
// 1. Ve a tu proyecto en Supabase
// 2. Navega a Settings > API
// 3. Copia la "Project URL" y pégala en 'url'
// 4. Copia la "anon public" key y pégala en 'anonKey'
// 5. Guarda este archivo
// ============================================
