# Guia de 20 Plugins Capacitor - HTML2APK

## Tabla de Contenido
- [Informacion General](#informacion-general)
- [Como Usar en tu HTML](#como-usar-en-tu-html)
- [Plugins](#plugins)
  - [1. App](#1-app)
  - [2. Browser](#2-browser)
  - [3. Camera](#3-camera)
  - [4. Clipboard](#4-clipboard)
  - [5. Device](#5-device)
  - [6. Dialogs](#6-dialogs)
  - [7. Filesystem](#7-filesystem)
  - [8. Geolocation](#8-geolocation)
  - [9. Haptics](#9-haptics)
  - [10. Keyboard](#10-keyboard)
  - [11. Local Notifications](#11-local-notifications)
  - [12. Network](#12-network)
  - [13. Preferences](#13-preferences)
  - [14. Push Notifications](#14-push-notifications)
  - [15. Screen Orientation](#15-screen-orientation)
  - [16. Share](#16-share)
  - [17. Splash Screen](#17-splash-screen)
  - [18. Status Bar](#18-status-bar)
  - [19. Text Zoom](#19-text-zoom)
  - [20. Toast](#20-toast)
- [Permisos Android](#permisos-android)

---

## Informacion General

Este proyecto usa **Capacitor 8** con **20 plugins oficiales** del equipo de Capacitor (Ionic).

### Estructura del proyecto
```
baseapk/
  package.json          - Dependencias (20 plugins)
  capacitor.config.json - Configuracion de plugins
  app.config.json       - Permisos Android
  www/
    index.html          - App de pruebas con GUI
    style.css           - Estilos
    plugins-test.js     - Funciones de prueba
  GUIA_PLUGINS.md       - Esta guia
```

### Build
El proyecto se compila con GitHub Actions (`build.yml`). No requiere instalacion local.
Solo edita los archivos en `www/` y haz push. El build automatico genera el APK.

---

## Como Usar en tu HTML

### Patron basico
Cada plugin se accede via `window.Capacitor.Plugins.NombrePlugin`. Verifica disponibilidad primero:

```javascript
// Verificar si el plugin esta disponible
if (window.Capacitor.isPluginAvailable("Camera")) {
  // Usar el plugin
  const photo = await window.Capacitor.Plugins.Camera.getPhoto({
    quality: 90,
    resultType: "uri",
    source: "PROMPT"
  });
} else {
  console.log("Camera no disponible");
}
```

### Manejo de errores
Siempre usa try/catch con los plugins:

```javascript
try {
  const result = await window.Capacitor.Plugins.NombrePlugin.metodo();
} catch (error) {
  console.error("Error:", error.message);
}
```

### Permisos
Algunos plugins requieren permisos. Solicitalos antes de usar:

```javascript
const perm = await window.Capacitor.Plugins.Geolocation.requestPermissions();
if (perm.location === "granted") {
  // Ahora puedes usar geolocation
}
```

---

## Plugins

### 1. App

Obtiene informacion de la app y maneja eventos del ciclo de vida.

**Documentacion:** https://capacitorjs.com/docs/apis/app

```javascript
// Obtener info de la app
const info = await window.Capacitor.Plugins.App.getInfo();
console.log(info.name);       // "html2apk"
console.log(info.version);    // "1.0.0"
console.log(info.build);      // "1"
console.log(info.id);         // "html2apk.josevdr95.basehtml2apk"

// Obtener estado de la app
const state = await window.Capacitor.Plugins.App.getState();
console.log(state.isActive);  // true/false

// Escuchar cuando la app vuelve al foreground
window.Capacitor.Plugins.App.addListener("appStateChange", function(state) {
  if (state.isActive) {
    console.log("App activa");
  } else {
    console.log("App en background");
  }
});

// Abrir URL en la app (deep linking)
await window.Capacitor.Plugins.App.openUrl({ url: "https://ejemplo.com" });

// Salir de la app (solo Android)
await window.Capacitor.Plugins.App.exitApp();
```

---

### 2. Browser

Abre URLs en un navegador in-app (Chrome Custom Tabs en Android).

**Documentacion:** https://capacitorjs.com/docs/apis/browser

```javascript
// Abrir URL
await window.Capacitor.Plugins.Browser.open({
  url: "https://capacitorjs.com"
});

// Con opciones
await window.Capacitor.Plugins.Browser.open({
  url: "https://ejemplo.com",
  toolbarColor: "#667eea",
  presentationStyle: "popover"  // o "fullscreen"
});

// Escuchar eventos del navegador
window.Capacitor.Plugins.Browser.addListener("browserFinished", function() {
  console.log("Navegador cerrado");
});

// Cerrar programaticamente
await window.Capacitor.Plugins.Browser.close();
```

---

### 3. Camera

Toma fotos con la camara o selecciona de la galeria.

**Documentacion:** https://capacitorjs.com/docs/apis/camera

```javascript
// Tomar foto o seleccionar (dialogo nativo)
const photo = await window.Capacitor.Plugins.Camera.getPhoto({
  quality: 90,
  allowEditing: false,
  resultType: "uri"  // "base64" o "uri" o "dataUrl"
});

// Solo camara
const photo = await window.Capacitor.Plugins.Camera.getPhoto({
  quality: 80,
  source: "CAMERA",
  resultType: "uri"
});

// Solo galeria
const photo = await window.Capacitor.Plugins.Camera.getPhoto({
  quality: 80,
  source: "PHOTOS",
  resultType: "uri"
});

// Con edicion habilitada
const photo = await window.Capacitor.Plugins.Camera.getPhoto({
  quality: 100,
  allowEditing: true,
  resultType: "base64",
  source: "CAMERA",
  width: 1024,
  height: 1024
});

// Obtener multiples fotos de galeria
const photos = await window.Capacitor.Plugins.Camera.pickImages({
  quality: 80,
  limit: 5
});
photos.photos.forEach(function(p) {
  console.log(p.webPath);
});

// Resultado del photo:
// photo.webPath - URL para usar en <img src="">
// photo.base64String - Datos base64
// photo.format - "jpeg" o "png"
// photo.saved - si se guardo en galeria
```

**Permisos Android:** `CAMERA`, `READ_MEDIA_IMAGES`

---

### 4. Clipboard

Lee y escribe en el portapapeles del dispositivo.

**Documentacion:** https://capacitorjs.com/docs/apis/clipboard

```javascript
// Escribir texto
await window.Capacitor.Plugins.Clipboard.write({
  string: "Texto a copiar"
});

// Leer texto
const result = await window.Capacitor.Plugins.Clipboard.read();
console.log(result.value);  // "Texto a copiar"

// Escribir URL
await window.Capacitor.Plugins.Clipboard.write({
  url: "https://ejemplo.com"
});

// Leer y verificar tipo
const result = await window.Capacitor.Plugins.Clipboard.read();
console.log(result.type);   // "text/plain", "url", "image"
console.log(result.value);
```

---

### 5. Device

Obtiene informacion del dispositivo fisico.

**Documentacion:** https://capacitorjs.com/docs/apis/device

```javascript
// Info del dispositivo
const info = await window.Capacitor.Plugins.Device.getInfo();
console.log(info.name);              // "sdk_gphone64_arm64"
console.log(info.model);             // "Pixel 6"
console.log(info.platform);          // "android"
console.log(info.operatingSystem);   // "android"
console.log(info.osVersion);         // "14"
console.log(info.manufacturer);      // "Google"
console.log(info.isVirtual);         // true si es emulador
console.log(info.memUsed);           // RAM usada en bytes
console.log(info.diskFree);          // Espacio libre en bytes
console.log(info.diskTotal);         // Espacio total en bytes
console.log(info.webViewVersion);    // Version del WebView

// Info de bateria
const battery = await window.Capacitor.Plugins.Device.getBatteryInfo();
console.log(battery.batteryLevel);   // 0.0 a 1.0 (ej: 0.85 = 85%)
console.log(battery.isCharging);     // true/false

// ID unico del dispositivo
const id = await window.Capacitor.Plugins.Device.getId();
console.log(id.identifier);  // UUID unico del dispositivo
```

---

### 6. Dialogs

Muestra dialogos nativos de Android (alert, confirm, prompt, acciones).

**Documentacion:** https://capacitorjs.com/docs/apis/dialogs

```javascript
// Alert
await window.Capacitor.Plugins.Dialog.alert({
  title: "Titulo",
  message: "Mensaje del alert"
});

// Confirm
const result = await window.Capacitor.Plugins.Dialog.confirm({
  title: "Confirmar",
  message: "Estas seguro?",
  okButtonTitle: "Si",
  cancelButtonTitle: "No"
});
console.log(result.value);  // true = Si, false = No

// Prompt (input)
const result = await window.Capacitor.Plugins.Dialog.prompt({
  title: "Ingresar",
  message: "Escribe tu nombre:",
  okButtonTitle: "Aceptar",
  cancelButtonTitle: "Cancelar",
  inputPlaceholder: "Nombre...",
  inputType: "text"  // "text", "password", "email", "number", "url"
});
console.log(result.cancelled);  // true/false
console.log(result.value);      // texto ingresado

// Sheet de acciones
const result = await window.Capacitor.Plugins.Dialog.showActions({
  title: "Seleccionar opcion",
  message: "Elige una accion:",
  options: [
    { title: "Opcion 1" },
    { title: "Opcion 2" },
    { title: "Cancelar", style: "destructive" }
  ]
});
console.log(result.index);  // 0, 1, 2
```

---

### 7. Filesystem

Acceso completo al sistema de archivos del dispositivo.

**Documentacion:** https://capacitorjs.com/docs/apis/filesystem

```javascript
// Directorios disponibles:
// "DOCUMENTS"  - carpeta Documents de la app
// "DATA"       - directorio interno de datos
// "CACHE"      - directorio cache
// "EXTERNAL"   - almacenamiento externo
// "EXTERNAL_STORAGE" - SD card

// Escribir archivo de texto
await window.Capacitor.Plugins.Filesystem.writeFile({
  path: "datos/miarchivo.txt",
  data: "Contenido del archivo",
  directory: "DOCUMENTS",
  encoding: "utf8",
  recursive: true  // crear carpetas si no existen
});

// Leer archivo
const result = await window.Capacitor.Plugins.Filesystem.readFile({
  path: "datos/miarchivo.txt",
  directory: "DOCUMENTS",
  encoding: "utf8"
});
console.log(result.data);

// Escribir archivo base64 (imagen, etc)
await window.Capacitor.Plugins.Filesystem.writeFile({
  path: "imagen.png",
  data: "iVBORw0KGgo...",  // base64 puro
  directory: "DOCUMENTS"
});

// Leer como base64
const result = await window.Capacitor.Plugins.Filesystem.readFile({
  path: "imagen.png",
  directory: "DOCUMENTS"
});

// Obtener info del archivo
const stat = await window.Capacitor.Plugins.Filesystem.stat({
  path: "datos/miarchivo.txt",
  directory: "DOCUMENTS"
});
console.log(stat.type);     // "file" o "directory"
console.log(stat.size);     // bytes
console.log(stat.mtime);    // ultima modificacion
console.log(stat.uri);      // URI completa

// Listar directorio
const dir = await window.Capacitor.Plugins.Filesystem.readdir({
  path: "datos",
  directory: "DOCUMENTS"
});
dir.files.forEach(function(f) {
  console.log(f.name, f.type);
});

// Crear directorio
await window.Capacitor.Plugins.Filesystem.mkdir({
  path: "nueva_carpeta",
  directory: "DOCUMENTS",
  recursive: false
});

// Eliminar archivo
await window.Capacitor.Plugins.Filesystem.deleteFile({
  path: "datos/miarchivo.txt",
  directory: "DOCUMENTS"
});

// Eliminar directorio
await window.Capacitor.Plugins.Filesystem.rmdir({
  path: "datos",
  directory: "DOCUMENTS",
  recursive: true
});

// Copiar archivo
await window.Capacitor.Plugins.Filesystem.copy({
  from: "origen.txt",
  to: "destino.txt",
  directory: "DOCUMENTS"
});

// Renombrar
await window.Capacitor.Plugins.Filesystem.rename({
  from: "viejo.txt",
  to: "nuevo.txt",
  directory: "DOCUMENTS"
});

// URI a ruta (para compartir archivos)
const uri = await window.Capacitor.Plugins.Filesystem.getUri({
  path: "imagen.png",
  directory: "DOCUMENTS"
});
console.log(uri.uri);  // file:///...
```

---

### 8. Geolocation

Obtiene la ubicacion GPS del dispositivo.

**Documentacion:** https://capacitorjs.com/docs/apis/geolocation

```javascript
// Primero solicitar permisos
const perm = await window.Capacitor.Plugins.Geolocation.requestPermissions();
if (perm.location === "granted") {

  // Obtener ubicacion actual
  const pos = await window.Capacitor.Plugins.Geolocation.getCurrentPosition({
    enableHighAccuracy: true,  // GPS preciso (mas lento y consume mas bateria)
    timeout: 10000             // timeout en ms
  });
  console.log(pos.coords.latitude);    // latitud
  console.log(pos.coords.longitude);   // longitud
  console.log(pos.coords.accuracy);    // precision en metros
  console.log(pos.coords.altitude);    // altitud en metros
  console.log(pos.coords.speed);       // velocidad m/s
  console.log(pos.coords.heading);     // direccion 0-360
  console.log(pos.coords.altitudeAccuracy); // precision altitud
  console.log(pos.timestamp);          // timestamp ms
}

// Escuchar ubicacion en tiempo real
const watchId = await window.Capacitor.Plugins.Geolocation.watchPosition({
  enableHighAccuracy: true,
  timeout: 10000
}, function(position, err) {
  if (err) {
    console.error("Error GPS:", err.message);
    return;
  }
  console.log("Nueva ubicacion:", position.coords.latitude, position.coords.longitude);
});

// Detener watch
await window.Capacitor.Plugins.Geolocation.clearWatch({ id: watchId });
```

**Permisos Android:** `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`

---

### 9. Haptics

Control de vibracion y feedback tactil.

**Documentacion:** https://capacitorjs.com/docs/apis/haptics

```javascript
// Impacto (vibracion corta con estilo)
await window.Capacitor.Plugins.Haptics.impact({ style: "heavy" });
// styles: "heavy", "medium", "light"

// Notificacion (vibracion de tipo de notificacion)
await window.Capacitor.Plugins.Haptics.notification({ type: "success" });
// types: "success", "warning", "error"

// Vibracion por duracion (solo Android)
await window.Capacitor.Plugins.Haptics.vibrate({ duration: 500 });

// Selection start/change/end (para pickers)
await window.Capacitor.Plugins.Haptics.selectionStart();
await window.Capacitor.Plugins.Haptics.selectionChanged();
await window.Capacitor.Plugins.Haptics.selectionEnd();
```

---

### 10. Keyboard

Control del teclado virtual.

**Documentacion:** https://capacitorjs.com/docs/apis/keyboard

```javascript
// Mostrar teclado
await window.Capacitor.Plugins.Keyboard.show();

// Ocultar teclado
await window.Capacitor.Plugins.Keyboard.hide();

// Obtener altura del teclado
window.Capacitor.Plugins.Keyboard.addListener("keyboardWillShow", function(info) {
  console.log("Teclado altura:", info.keyboardHeight);
});

window.Capacitor.Plugins.Keyboard.addListener("keyboardWillHide", function() {
  console.log("Teclado oculto");
});

// Cambiar estilo del teclado
await window.Capacitor.Plugins.Keyboard.setStyle({ style: "dark" });
// styles: "light", "dark"

// Deshabilitar scroll automatico
await window.Capacitor.Plugins.Keyboard.setScroll({ isDisabled: true });

// Modo fullscreen
await window.Capacitor.Plugins.Keyboard.setResizeMode({ mode: "native" });
// modes: "native", "body", "none"
```

---

### 11. Local Notifications

Notificaciones locales programadas.

**Documentacion:** https://capacitorjs.com/docs/apis/local-notifications

```javascript
// Solicitar permisos
await window.Capacitor.Plugins.LocalNotifications.requestPermissions();

// Programar notificacion
await window.Capacitor.Plugins.LocalNotifications.schedule({
  notifications: [
    {
      id: 1,
      title: "Recordatorio",
      body: "Tienes una tarea pendiente",
      schedule: {
        at: new Date(Date.now() + 60000)  // en 1 minuto
      },
      extra: { dato: "valor" },
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF"
    }
  ]
});

// Notificacion recurrente
await window.Capacitor.Plugins.LocalNotifications.schedule({
  notifications: [{
    id: 2,
    title: "Diario",
    body: "Notificacion diaria",
    schedule: {
      on: { hour: 9, minute: 0 },  // cada dia a las 9:00
      allowWhileIdle: true
    }
  }]
});

// Escuchar cuando se toca la notificacion
window.Capacitor.Plugins.LocalNotifications.addListener(
  "localNotificationActionPerformed",
  function(notification) {
    console.log("Notificacion tocada:", notification.notification.extra);
  }
);

// Cancelar notificacion
await window.Capacitor.Plugins.LocalNotifications.cancel({
  notifications: [{ id: 1 }]
});

// Obtener notificaciones pendientes
const pending = await window.Capacitor.Plugins.LocalNotifications.getPending();
console.log(pending.notifications);

// Verificar permisos
const perm = await window.Capacitor.Plugins.LocalNotifications.checkPermissions();
console.log(perm.display);  // "granted", "denied", "prompt"
```

---

### 12. Network

Monitorea el estado de la conexion a internet.

**Documentacion:** https://capacitorjs.com/docs/apis/network

```javascript
// Obtener estado actual
const status = await window.Capacitor.Plugins.Network.getStatus();
console.log(status.connected);        // true/false
console.log(status.connectionType);   // "wifi", "cellular", "none", "unknown"

// Escuchar cambios de conexion
window.Capacitor.Plugins.Network.addListener("networkStatusChange", function(status) {
  if (status.connected) {
    console.log("Conectado via:", status.connectionType);
  } else {
    console.log("Sin conexion");
  }
});

// Verificar si hay internet
function checkInternet() {
  return navigator.onLine;  // fallback del navegador
}
```

---

### 13. Preferences

Almacenamiento clave-valor persistente (reemplazo de localStorage para nativo).

**Documentacion:** https://capacitorjs.com/docs/apis/preferences

```javascript
// Guardar valor
await window.Capacitor.Plugins.Preferences.set({
  key: "usuario_nombre",
  value: "Juan"
});

// Leer valor
const result = await window.Capacitor.Plugins.Preferences.get({
  key: "usuario_nombre"
});
console.log(result.value);  // "Juan" (o null si no existe)

// Guardar objeto (como JSON)
await window.Capacitor.Plugins.Preferences.set({
  key: "config",
  value: JSON.stringify({ tema: "oscuro", idioma: "es" })
});

// Leer objeto
const result2 = await window.Capacitor.Plugins.Preferences.get({ key: "config" });
const config = JSON.parse(result2.value);

// Eliminar clave
await window.Capacitor.Plugins.Preferences.remove({ key: "usuario_nombre" });

// Listar todas las claves
const keys = await window.Capacitor.Plugins.Preferences.keys();
console.log(keys.keys);  // ["config", "usuario_nombre", ...]

// Limpiar todo
await window.Capacitor.Plugins.Preferences.clear();

// Configurar grupo (namespace) - compatibilidad con cordova-plugin-nativestorage
await window.Capacitor.Plugins.Preferences.configure({
  group: "NativeStorage"
});
// Despues de configure, todas las operaciones usan ese grupo
```

---

### 14. Push Notifications

Notificaciones push via Firebase Cloud Messaging (FCM).

**Documentacion:** https://capacitorjs.com/docs/apis/push-notifications

```javascript
// Solicitar permisos y registrar
const perm = await window.Capacitor.Plugins.PushNotifications.requestPermissions();
if (perm.receive === "granted") {
  await window.Capacitor.Plugins.PushNotifications.register();
}

// Obtener token FCM
window.Capacitor.Plugins.PushNotifications.addListener("registration", function(token) {
  console.log("Token FCM:", token.value);
  // Enviar este token a tu servidor
});

// Error de registro
window.Capacitor.Plugins.PushNotifications.addListener("registrationError", function(err) {
  console.error("Error registro:", err.error);
});

// Notificacion recibida (app en foreground)
window.Capacitor.Plugins.PushNotifications.addListener("pushNotificationReceived", function(notification) {
  console.log("Push recibida:", notification.title, notification.body);
  console.log("Datos:", notification.data);
});

// Usuario toco la notificacion
window.Capacitor.Plugins.PushNotifications.addListener("pushNotificationActionPerformed", function(notification) {
  console.log("Push accionada:", notification.notification.title);
  console.log("Datos:", notification.notification.data);
});

// Obtener notificaciones no leidas
const delivered = await window.Capacitor.Plugins.PushNotifications.getDeliveredNotifications();
console.log(delivered.notifications);

// Eliminar notificacion entregada
await window.Capacitor.Plugins.PushNotifications.removeDeliveredNotifications({
  notifications: [{ id: "1" }]
});

// Badge (solo iOS, en Android se maneja aparte)
await window.Capacitor.Plugins.PushNotifications.removeAllDeliveredNotifications();
```

**Configuracion FCM requerida:**
- Descargar `google-services.json` de Firebase Console
- Colocar en `android/app/`
- Configurar server key en tu backend

---

### 15. Screen Orientation

Bloquea o desbloquea la orientacion de la pantalla.

**Documentacion:** https://capacitorjs.com/docs/apis/screen-orientation

```javascript
// Obtener orientacion actual
const current = await window.Capacitor.Plugins.ScreenOrientation.orientation();
console.log(current.type);  // "portrait-primary", "landscape-primary", etc.

// Bloquear en portrait
await window.Capacitor.Plugins.ScreenOrientation.lock({
  orientation: "portrait"
});

// Bloquear en landscape
await window.Capacitor.Plugins.ScreenOrientation.lock({
  orientation: "landscape"
});

// Orientaciones disponibles:
// "portrait"           - cualquier portrait
// "landscape"          - cualquier landscape
// "portrait-primary"   - portrait normal
// "portrait-secondary" - portrait invertido
// "landscape-primary"  - landscape normal
// "landscape-secondary" - landscape invertido
// "natural"            - orientacion natural del dispositivo
// "any"                - permitir cualquier orientacion

// Desbloquear (permitir rotacion libre)
await window.Capacitor.Plugins.ScreenOrientation.unlock();

// Escuchar cambios de orientacion
window.Capacitor.Plugins.ScreenOrientation.addListener("screenOrientationChange", function(orientation) {
  console.log("Nueva orientacion:", orientation.type);
});
```

---

### 16. Share

Comparte contenido via el share sheet nativo de Android.

**Documentacion:** https://capacitorjs.com/docs/apis/share

```javascript
// Compartir texto
await window.Capacitor.Plugins.Share.share({
  title: "Compartir",
  text: "Mira esto!",
  dialogTitle: "Compartir con..."
});

// Compartir con URL
await window.Capacitor.Plugins.Share.share({
  title: "HTML2APK",
  text: "Crea apps Android con HTML!",
  url: "https://ejemplo.com",
  dialogTitle: "Compartir via..."
});

// Manejar cancelacion
try {
  await window.Capacitor.Plugins.Share.share({
    text: "Compartir test"
  });
} catch (error) {
  if (error.message.includes("canceled")) {
    console.log("Usuario cancelo");
  }
}
```

---

### 17. Splash Screen

Controla la pantalla de carga inicial.

**Documentacion:** https://capacitorjs.com/docs/apis/splash-screen

```javascript
// Mostrar splash
await window.Capacitor.Plugins.SplashScreen.show({
  showDuration: 3000,      // duracion en ms
  fadeInDuration: 500,     // fade in ms
  fadeOutDuration: 500,    // fade out ms
  autoHide: true           // ocultar automaticamente
});

// Mostrar sin auto-hide
await window.Capacitor.Plugins.SplashScreen.show({
  autoHide: false
});

// Ocultar manualmente
await window.Capacitor.Plugins.SplashScreen.hide({
  fadeOutDuration: 500
});

// Configuracion en capacitor.config.json:
// "SplashScreen": {
//   "launchShowDuration": 2000,
//   "launchAutoHide": true,
//   "backgroundColor": "#000000",
//   "androidSplashResourceName": "splash",
//   "androidScaleType": "CENTER_CROP"
// }
```

---

### 18. Status Bar

Controla la barra de estado de Android.

**Documentacion:** https://capacitorjs.com/docs/apis/status-bar

```javascript
// Cambiar estilo del texto (LIGHT = texto negro, DARK = texto blanco)
await window.Capacitor.Plugins.StatusBar.setStyle({ style: "LIGHT" });
await window.Capacitor.Plugins.StatusBar.setStyle({ style: "DARK" });
// Estilos disponibles: "LIGHT", "DARK", "DEFAULT"

// Cambiar color de fondo (no disponible en Android 15+)
await window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: "#667eea" });

// Ocultar barra de estado
await window.Capacitor.Plugins.StatusBar.hide();

// Mostrar barra de estado
await window.Capacitor.Plugins.StatusBar.show();

// Obtener info actual
const info = await window.Capacitor.Plugins.StatusBar.getInfo();
console.log(info.visible);  // true/false
console.log(info.height);   // altura en pixels
console.log(info.style);    // "LIGHT", "DARK", "DEFAULT"
console.log(info.color);    // color hex actual
console.log(info.overlays); // true/false

// Overlay (barra sobre el contenido) - no disponible en Android 15+
await window.Capacitor.Plugins.StatusBar.setOverlaysWebView({ overlay: true });
```

---

### 19. Text Zoom

Controla el zoom de texto del sistema (accesibilidad).

**Documentacion:** https://capacitorjs.com/docs/apis/text-zoom

```javascript
// Obtener zoom actual (valor decimal: 1.0 = 100%)
const current = await window.Capacitor.Plugins.TextZoom.get();
console.log(current.value);  // 1.0 por defecto

// Cambiar zoom (valor decimal: 0.5 = 50%, 1.5 = 150%)
await window.Capacitor.Plugins.TextZoom.set({ value: 1.5 });

// Restaurar a 100%
await window.Capacitor.Plugins.TextZoom.set({ value: 1.0 });

// Ejemplo: boton de aumentar/disminuir texto
let zoomLevel = 1.0;
function increaseText() {
  zoomLevel = Math.min(zoomLevel + 0.25, 3.0);
  window.Capacitor.Plugins.TextZoom.set({ value: zoomLevel });
}
function decreaseText() {
  zoomLevel = Math.max(zoomLevel - 0.25, 0.5);
  window.Capacitor.Plugins.TextZoom.set({ value: zoomLevel });
}

// Mostrar como porcentaje en UI
console.log(Math.round(current.value * 100) + "%");  // "150%"
```

---

### 20. Toast

Muestra mensajes toast nativos de Android.

**Documentacion:** https://capacitorjs.com/docs/apis/toast

```javascript
// Toast basico
await window.Capacitor.Plugins.Toast.show({
  text: "Mensaje de prueba"
});

// Toast con opciones
await window.Capacitor.Plugins.Toast.show({
  text: "Mensaje largo",
  duration: "long",    // "short" (2s) o "long" (3.5s)
  position: "bottom"   // "top", "center", "bottom"
});

// Toast en centro
await window.Capacitor.Plugins.Toast.show({
  text: "Operacion completada",
  duration: "short",
  position: "center"
});
```

---

## Permisos Android

Los siguientes permisos estan configurados en `app.config.json`:

| Permiso | Plugin(s) | Uso |
|---------|-----------|-----|
| `INTERNET` | Network, todos | Conexion a internet |
| `ACCESS_NETWORK_STATE` | Network | Estado de red |
| `CAMERA` | Camera | Tomar fotos |
| `READ_MEDIA_IMAGES` | Camera | Leer imagenes (Android 13+) |
| `READ_EXTERNAL_STORAGE` | Filesystem, Camera | Leer almacenamiento |
| `WRITE_EXTERNAL_STORAGE` | Filesystem | Escribir almacenamiento |
| `ACCESS_FINE_LOCATION` | Geolocation | GPS preciso |
| `ACCESS_COARSE_LOCATION` | Geolocation | GPS aproximado |
| `POST_NOTIFICATIONS` | Notifications | Notificaciones (Android 13+) |
| `VIBRATE` | Haptics, Notifications | Vibracion |
| `RECEIVE_BOOT_COMPLETED` | Notifications | Notificaciones al iniciar |
| `WAKE_LOCK` | Notifications | Mantener despierto |
| `FOREGROUND_SERVICE` | Notifications | Servicio en background |
| `USE_FULL_SCREEN_INTENT` | Notificaciones | Pantalla completa |
| `SCHEDULE_EXACT_ALARM` | LocalNotifications | Alarmas exactas |
| `USE_BIOMETRIC` | Referencia | Biometria |
| `READ_CONTACTS` | Referencia | Contactos |
| `NFC` | Referencia | NFC |

---

## Flujo de Build (GitHub Actions)

El proyecto se compila automaticamente con `build.yml`:

1. Push a la rama
2. GitHub Actions instala dependencias (`npm install`)
3. Sincroniza Capacitor (`npx cap sync android`)
4. Compila APK (`cd android && ./gradlew assembleDebug`)
5. El APK se sube como artefacto

No necesitas instalar nada localmente. Solo edita los archivos en `www/` y haz push.
