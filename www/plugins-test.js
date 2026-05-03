// ============================================================
// HTML2APK - Plugin Test Suite (20 Plugins Capacitor.)
// ============================================================

const PLUGINS_CONFIG = {
  docs: {
    app: "https://capacitorjs.com/docs/apis/app",
    browser: "https://capacitorjs.com/docs/apis/browser",
    camera: "https://capacitorjs.com/docs/apis/camera",
    clipboard: "https://capacitorjs.com/docs/apis/clipboard",
    device: "https://capacitorjs.com/docs/apis/device",
    dialogs: "https://capacitorjs.com/docs/apis/dialogs",
    filesystem: "https://capacitorjs.com/docs/apis/filesystem",
    geolocation: "https://capacitorjs.com/docs/apis/geolocation",
    haptics: "https://capacitorjs.com/docs/apis/haptics",
    keyboard: "https://capacitorjs.com/docs/apis/keyboard",
    localNotifications: "https://capacitorjs.com/docs/apis/local-notifications",
    network: "https://capacitorjs.com/docs/apis/network",
    preferences: "https://capacitorjs.com/docs/apis/preferences",
    pushNotifications: "https://capacitorjs.com/docs/apis/push-notifications",
    screenOrientation: "https://capacitorjs.com/docs/apis/screen-orientation",
    share: "https://capacitorjs.com/docs/apis/share",
    splashScreen: "https://capacitorjs.com/docs/apis/splash-screen",
    statusBar: "https://capacitorjs.com/docs/apis/status-bar",
    textZoom: "https://capacitorjs.com/docs/apis/text-zoom",
    toast: "https://capacitorjs.com/docs/apis/toast"
  }
};

function updateResult(id, status, message) {
  const el = document.getElementById("result-" + id);
  if (!el) return;
  el.className = "result " + status;
  el.innerHTML = (status === "success" ? "&#10004; " : status === "error" ? "&#10008; " : "&#9888; ") + message;
}

function openDocs(pluginKey) {
  var url = PLUGINS_CONFIG.docs[pluginKey];
  if (window.Capacitor && window.Capacitor.isPluginAvailable("Browser")) {
    window.Capacitor.Plugins.Browser.open({ url: url });
  } else {
    window.open(url, "_blank");
  }
}

// Helper: check if online
function isOnline() {
  return navigator.onLine;
}

// ============================================================
// 1. APP
// ============================================================
async function testApp() {
  updateResult("app", "info", "Probando...");
  try {
    const info = await window.Capacitor.Plugins.App.getInfo();
    updateResult("app", "success",
      "Nombre: " + info.name +
      " | Version: " + info.version +
      " | Build: " + info.build +
      " | ID: " + info.id
    );
  } catch (e) {
    updateResult("app", "error", "Error: " + e.message);
  }
}

// ============================================================
// 2. BROWSER
// ============================================================
async function testBrowser() {
  updateResult("browser", "info", "Probando...");
  try {
    await window.Capacitor.Plugins.Browser.open({ url: "https://capacitorjs.com" });
    updateResult("browser", "success", "Navegador in-app abierto correctamente");
  } catch (e) {
    updateResult("browser", "error", "Error: " + e.message);
  }
}

// ============================================================
// 3. CAMERA
// ============================================================
async function testCamera() {
  updateResult("camera", "info", "Probando...");
  try {
    const photo = await window.Capacitor.Plugins.Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: "uri",
      source: "PROMPT"
    });
    updateResult("camera", "success",
      "Foto obtenida | Path: " + (photo.path || photo.webPath || "N/A") +
      " | Formato: " + (photo.format || "N/A")
    );
  } catch (e) {
    updateResult("camera", "error", "Error: " + e.message);
  }
}

// ============================================================
// 4. CLIPBOARD
// ============================================================
async function testClipboard() {
  updateResult("clipboard", "info", "Probando...");
  try {
    const testText = "HTML2APK Clipboard Test " + Date.now();
    await window.Capacitor.Plugins.Clipboard.write({ string: testText });
    const result = await window.Capacitor.Plugins.Clipboard.read();
    if (result.value === testText) {
      updateResult("clipboard", "success",
        "Escribir: OK | Leer: OK | Valor: " + result.value.substring(0, 40) + "..."
      );
    } else {
      updateResult("clipboard", "warn",
        "Escrito pero lectura difiere | Escrito: " + testText.substring(0, 30) + " | Leido: " + (result.value || "N/A").substring(0, 30)
      );
    }
  } catch (e) {
    updateResult("clipboard", "error", "Error: " + e.message);
  }
}

// ============================================================
// 5. DEVICE
// ============================================================
async function testDevice() {
  updateResult("device", "info", "Probando...");
  try {
    const info = await window.Capacitor.Plugins.Device.getInfo();
    const battery = await window.Capacitor.Plugins.Device.getBatteryInfo();
    updateResult("device", "success",
      "Modelo: " + info.model +
      " | OS: " + info.operatingSystem + " " + info.osVersion +
      " | Fabricante: " + info.manufacturer +
      " | Bateria: " + (battery.batteryLevel != null ? Math.round(battery.batteryLevel * 100) + "%" : "N/A") +
      " | Cargando: " + (battery.isCharging ? "Si" : "No")
    );
  } catch (e) {
    updateResult("device", "error", "Error: " + e.message);
  }
}

// ============================================================
// 6. DIALOGS
// ============================================================
async function testDialogs() {
  updateResult("dialogs", "info", "Probando...");
  try {
    await window.Capacitor.Plugins.Dialog.alert({
      title: "HTML2APK",
      message: "Este es un dialogo nativo de prueba!"
    });
    const confirm = await window.Capacitor.Plugins.Dialog.confirm({
      title: "Confirmacion",
      message: "Esto es una confirmacion nativa",
      okButtonTitle: "Si",
      cancelButtonTitle: "No"
    });
    const prompt = await window.Capacitor.Plugins.Dialog.prompt({
      title: "Prompt",
      message: "Escribe algo:",
      okButtonTitle: "OK",
      cancelButtonTitle: "Cancelar",
      inputPlaceholder: "Tu texto aqui..."
    });
    updateResult("dialogs", "success",
      "Alert: OK | Confirm: " + (confirm.value ? "Si" : "No") +
      " | Prompt: " + (prompt.cancelled ? "Cancelado" : "Valor=" + prompt.value)
    );
  } catch (e) {
    updateResult("dialogs", "error", "Error: " + e.message);
  }
}

// ============================================================
// 7. FILESYSTEM
// ============================================================
async function testFilesystem() {
  updateResult("filesystem", "info", "Probando...");
  try {
    const testContent = "HTML2APK Filesystem Test " + Date.now();
    await window.Capacitor.Plugins.Filesystem.writeFile({
      path: "test_plugin.txt",
      data: testContent,
      directory: "Cache",
      encoding: "utf8"
    });
    const read = await window.Capacitor.Plugins.Filesystem.readFile({
      path: "test_plugin.txt",
      directory: "Cache",
      encoding: "utf8"
    });
    const stat = await window.Capacitor.Plugins.Filesystem.stat({
      path: "test_plugin.txt",
      directory: "Cache"
    });
    await window.Capacitor.Plugins.Filesystem.deleteFile({
      path: "test_plugin.txt",
      directory: "Cache"
    });
    updateResult("filesystem", "success",
      "Write: OK | Read: " + (read.data === testContent ? "OK" : "FAIL") +
      " | Size: " + stat.size + " bytes | Delete: OK"
    );
  } catch (e) {
    updateResult("filesystem", "error", "Error: " + e.message);
  }
}

// ============================================================
// 8. GEOLOCATION
// ============================================================
async function testGeolocation() {
  updateResult("geolocation", "info", "Obteniendo ubicacion...");
  try {
    if (!isOnline()) {
      updateResult("geolocation", "warn", "Sin conexion a internet - GPS puede ser impreciso");
    }
    const pos = await window.Capacitor.Plugins.Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000
    });
    updateResult("geolocation", "success",
      "Lat: " + pos.coords.latitude.toFixed(6) +
      " | Lng: " + pos.coords.longitude.toFixed(6) +
      " | Precision: " + Math.round(pos.coords.accuracy) + "m" +
      " | Altitud: " + (pos.coords.altitude != null ? Math.round(pos.coords.altitude) + "m" : "N/A")
    );
  } catch (e) {
    updateResult("geolocation", "error", "Error: " + e.message + " - Verifica permisos de ubicacion");
  }
}

// ============================================================
// 9. HAPTICS
// ============================================================
async function testHaptics() {
  updateResult("haptics", "info", "Probando...");
  try {
    await window.Capacitor.Plugins.Haptics.impact({ style: "medium" });
    await new Promise(r => setTimeout(r, 300));
    await window.Capacitor.Plugins.Haptics.notification({ type: "success" });
    await new Promise(r => setTimeout(r, 300));
    await window.Capacitor.Plugins.Haptics.vibrate({ duration: 500 });
    await new Promise(r => setTimeout(r, 300));
    await window.Capacitor.Plugins.Haptics.selectionStart();
    await window.Capacitor.Plugins.Haptics.selectionChanged();
    await window.Capacitor.Plugins.Haptics.selectionEnd();
    updateResult("haptics", "success",
      "Impact: OK | Notification: OK | Vibrate: OK | Selection: OK"
    );
  } catch (e) {
    updateResult("haptics", "error", "Error: " + e.message);
  }
}

// ============================================================
// 10. KEYBOARD
// ============================================================
async function testKeyboard() {
  updateResult("keyboard", "info", "Probando...");
  try {
    const state = await window.Capacitor.Plugins.Keyboard.show();
    await new Promise(r => setTimeout(r, 1500));
    await window.Capacitor.Plugins.Keyboard.hide();
    const style = await window.Capacitor.Plugins.Keyboard.setStyle({ style: "dark" });
    await window.Capacitor.Plugins.Keyboard.setScroll({ isDisabled: false });
    updateResult("keyboard", "success",
      "Show: OK | Hide: OK | Style: dark | Scroll: enabled"
    );
  } catch (e) {
    updateResult("keyboard", "error", "Error: " + e.message);
  }
}

// ============================================================
// 11. LOCAL NOTIFICATIONS
// ============================================================
async function testLocalNotifications() {
  updateResult("local-notifications", "info", "Probando...");
  try {
    const perm = await window.Capacitor.Plugins.LocalNotifications.requestPermissions();
    if (perm.display === "granted" || perm.display === "prompt-with-rationale") {
      await window.Capacitor.Plugins.LocalNotifications.schedule({
        notifications: [{
          title: "HTML2APK Test",
          body: "Notificacion local de prueba!",
          id: 99999,
          schedule: { at: new Date(Date.now() + 3000) },
          extra: { source: "plugin-test" }
        }]
      });
      updateResult("local-notifications", "success",
        "Permisos: Concedido | Notificacion programada para 3 segundos"
      );
    } else {
      updateResult("local-notifications", "warn",
        "Permisos denegados: " + perm.display
      );
    }
  } catch (e) {
    updateResult("local-notifications", "error", "Error: " + e.message);
  }
}

// ============================================================
// 12. NETWORK
// ============================================================
async function testNetwork() {
  updateResult("network", "info", "Probando...");
  try {
    const status = await window.Capacitor.Plugins.Network.getStatus();
    const connType = status.connectionType || "unknown";
    updateResult("network", "success",
      "Connected: " + status.connected +
      " | Tipo: " + connType +
      " | Conexion: " + (status.connected ? "Activa" : "Sin conexion")
    );

    if (!status.connected) {
      updateResult("network", "warn",
        "SIN CONEXION A INTERNET - Algunos plugins requieren conexion"
      );
    }
  } catch (e) {
    updateResult("network", "error", "Error: " + e.message);
  }
}

// ============================================================
// 13. PREFERENCES
// ============================================================
async function testPreferences() {
  updateResult("preferences", "info", "Probando...");
  try {
    const testKey = "html2apk_test";
    const testValue = "valor_prueba_" + Date.now();
    await window.Capacitor.Plugins.Preferences.set({
      key: testKey,
      value: testValue
    });
    const read = await window.Capacitor.Plugins.Preferences.get({ key: testKey });
    const keys = await window.Capacitor.Plugins.Preferences.keys();
    await window.Capacitor.Plugins.Preferences.remove({ key: testKey });
    updateResult("preferences", "success",
      "Set: OK | Get: " + (read.value === testValue ? "OK" : "FAIL") +
      " | Keys: " + keys.keys.length + " | Remove: OK"
    );
  } catch (e) {
    updateResult("preferences", "error", "Error: " + e.message);
  }
}

// ============================================================
// 14. PUSH NOTIFICATIONS
// ============================================================
async function testPushNotifications() {
  updateResult("push-notifications", "info", "Probando...");
  try {
    const perm = await window.Capacitor.Plugins.PushNotifications.requestPermissions();
    if (perm.receive === "granted") {
      await window.Capacitor.Plugins.PushNotifications.register();
      updateResult("push-notifications", "success",
        "Permisos: Concedido | Registro: Solicitado | Esperando token FCM..."
      );

      window.Capacitor.Plugins.PushNotifications.addListener("registration", function(token) {
        updateResult("push-notifications", "success",
          "Token FCM: " + token.value.substring(0, 40) + "..."
        );
      });

      window.Capacitor.Plugins.PushNotifications.addListener("registrationError", function(err) {
        updateResult("push-notifications", "error",
          "Error registro: " + err.error
        );
      });
    } else {
      updateResult("push-notifications", "warn",
        "Permisos denegados: " + perm.receive
      );
    }
  } catch (e) {
    updateResult("push-notifications", "error", "Error: " + e.message);
  }
}

// ============================================================
// 15. SCREEN ORIENTATION
// ============================================================
async function testScreenOrientation() {
  updateResult("screen-orientation", "info", "Probando...");
  try {
    const current = await window.Capacitor.Plugins.ScreenOrientation.orientation();
    await window.Capacitor.Plugins.ScreenOrientation.lock({ orientation: "landscape" });
    await new Promise(r => setTimeout(r, 1500));
    const afterLock = await window.Capacitor.Plugins.ScreenOrientation.orientation();
    await window.Capacitor.Plugins.ScreenOrientation.lock({ orientation: "portrait" });
    await new Promise(r => setTimeout(r, 1500));
    await window.Capacitor.Plugins.ScreenOrientation.unlock();
    updateResult("screen-orientation", "success",
      "Inicial: " + current.type +
      " | Landscape: " + afterLock.type +
      " | Restaurado: portrait | Unlocked: OK"
    );
  } catch (e) {
    updateResult("screen-orientation", "error", "Error: " + e.message);
  }
}

// ============================================================
// 16. SHARE
// ============================================================
async function testShare() {
  updateResult("share", "info", "Probando...");
  try {
    await window.Capacitor.Plugins.Share.share({
      title: "HTML2APK Test",
      text: "Probando plugin Share de Capacitor!",
      url: "https://capacitorjs.com",
      dialogTitle: "Compartir con..."
    });
    updateResult("share", "success", "Dialogo de compartir abierto correctamente");
  } catch (e) {
    if (e.message && e.message.includes("canceled")) {
      updateResult("share", "warn", "Compartir cancelado por el usuario");
    } else {
      updateResult("share", "error", "Error: " + e.message);
    }
  }
}

// ============================================================
// 17. SPLASH SCREEN
// ============================================================
async function testSplashScreen() {
  updateResult("splash-screen", "info", "Probando...");
  try {
    await window.Capacitor.Plugins.SplashScreen.show({
      showDuration: 2000,
      fadeInDuration: 500,
      fadeOutDuration: 500,
      autoHide: true
    });
    updateResult("splash-screen", "success",
      "Splash mostrado por 2 segundos con fade"
    );
  } catch (e) {
    updateResult("splash-screen", "error", "Error: " + e.message);
  }
}

// ============================================================
// 18. STATUS BAR
// ============================================================
async function testStatusBar() {
  updateResult("status-bar", "info", "Probando...");
  try {
    await window.Capacitor.Plugins.StatusBar.setStyle({ style: "LIGHT" });
    await new Promise(r => setTimeout(r, 800));
    await window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: "#667eea" });
    await new Promise(r => setTimeout(r, 800));
    const info = await window.Capacitor.Plugins.StatusBar.getInfo();
    await window.Capacitor.Plugins.StatusBar.setStyle({ style: "DARK" });
    await window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: "#0a0e17" });
    updateResult("status-bar", "success",
      "Style: LIGHT->DARK | Color: #667eea->#0a0e17" +
      " | Visible: " + info.visible +
      " | Height: " + info.height
    );
  } catch (e) {
    updateResult("status-bar", "error", "Error: " + e.message);
  }
}

// ============================================================
// 19. TEXT ZOOM
// ============================================================
async function testTextZoom() {
  updateResult("text-zoom", "info", "Probando...");
  try {
    const original = await window.Capacitor.Plugins.TextZoom.get();
    await window.Capacitor.Plugins.TextZoom.set({ value: 1.5 });
    await new Promise(r => setTimeout(r, 1000));
    const current = await window.Capacitor.Plugins.TextZoom.get();
    await window.Capacitor.Plugins.TextZoom.set({ value: original.value || 1.0 });
    updateResult("text-zoom", "success",
      "Original: " + Math.round((original.value || 1.0) * 100) + "%" +
      " | Test: " + Math.round(current.value * 100) + "%" +
      " | Restaurado: " + Math.round((original.value || 1.0) * 100) + "%"
    );
  } catch (e) {
    updateResult("text-zoom", "error", "Error: " + e.message);
  }
}

// ============================================================
// 20. TOAST
// ============================================================
async function testToast() {
  updateResult("toast", "info", "Probando...");
  try {
    await window.Capacitor.Plugins.Toast.show({
      text: "HTML2APK Toast Test - Funciona!",
      duration: "short",
      position: "bottom"
    });
    await new Promise(r => setTimeout(r, 1500));
    await window.Capacitor.Plugins.Toast.show({
      text: "Segundo toast con duracion larga",
      duration: "long",
      position: "center"
    });
    updateResult("toast", "success",
      "Toast 1: short/bottom | Toast 2: long/center | Ambos: OK"
    );
  } catch (e) {
    updateResult("toast", "error", "Error: " + e.message);
  }
}

// ============================================================
// TEST ALL PLUGINS
// ============================================================
async function testAllPlugins() {
  const btn = document.getElementById("btn-test-all");
  btn.disabled = true;
  btn.textContent = "Probando todos los plugins...";

  // First check network
  try {
    const netStatus = await window.Capacitor.Plugins.Network.getStatus();
    document.getElementById("network-global-status").textContent =
      netStatus.connected ? "Conectado (" + netStatus.connectionType + ")" : "SIN CONEXION";
    document.getElementById("network-global-status").className =
      netStatus.connected ? "net-badge online" : "net-badge offline";
  } catch (e) {
    document.getElementById("network-global-status").textContent = "No disponible";
  }

  const tests = [
    { fn: testNetwork, name: "Network" },
    { fn: testApp, name: "App" },
    { fn: testDevice, name: "Device" },
    { fn: testClipboard, name: "Clipboard" },
    { fn: testPreferences, name: "Preferences" },
    { fn: testFilesystem, name: "Filesystem" },
    { fn: testHaptics, name: "Haptics" },
    { fn: testToast, name: "Toast" },
    { fn: testTextZoom, name: "TextZoom" },
    { fn: testStatusBar, name: "StatusBar" },
    { fn: testDialogs, name: "Dialogs" },
    { fn: testKeyboard, name: "Keyboard" },
    { fn: testScreenOrientation, name: "ScreenOrientation" },
    { fn: testSplashScreen, name: "SplashScreen" },
    { fn: testLocalNotifications, name: "LocalNotifications" },
    { fn: testPushNotifications, name: "PushNotifications" },
    { fn: testCamera, name: "Camera" },
    { fn: testGeolocation, name: "Geolocation" },
    { fn: testBrowser, name: "Browser" },
    { fn: testShare, name: "Share" }
  ];

  for (let i = 0; i < tests.length; i++) {
    btn.textContent = "(" + (i + 1) + "/20) " + tests[i].name + "...";
    try {
      await tests[i].fn();
    } catch (e) {
      // individual test already handles errors
    }
    await new Promise(r => setTimeout(r, 500));
  }

  btn.disabled = false;
  btn.textContent = "Probar Todos los 20 Plugins";

  // Count results
  let success = 0, error = 0, warn = 0;
  document.querySelectorAll(".result").forEach(function(el) {
    if (el.classList.contains("success")) success++;
    else if (el.classList.contains("error")) error++;
    else if (el.classList.contains("warn")) warn++;
  });

  document.getElementById("summary").textContent =
    "Resumen: " + success + " OK | " + warn + " Advertencias | " + error + " Errores";
}

// ============================================================
// NETWORK MONITOR
// ============================================================
function initNetworkMonitor() {
  async function updateNetwork() {
    try {
      if (window.Capacitor && window.Capacitor.isPluginAvailable("Network")) {
        const status = await window.Capacitor.Plugins.Network.getStatus();
        const el = document.getElementById("network-global-status");
        if (el) {
          el.textContent = status.connected ? "Conectado (" + (status.connectionType || "?") + ")" : "SIN CONEXION";
          el.className = "net-badge " + (status.connected ? "online" : "offline");
        }
      }
    } catch (e) { /* ignore */ }
  }

  window.addEventListener("online", updateNetwork);
  window.addEventListener("offline", updateNetwork);

  if (window.Capacitor && window.Capacitor.isPluginAvailable("Network")) {
    window.Capacitor.Plugins.Network.addListener("networkStatusChange", function(status) {
      const el = document.getElementById("network-global-status");
      if (el) {
        el.textContent = status.connected ? "Conectado (" + (status.connectionType || "?") + ")" : "SIN CONEXION";
        el.className = "net-badge " + (status.connected ? "online" : "offline");
      }
    });
  }

  setTimeout(updateNetwork, 1000);
}

// Init on load
document.addEventListener("DOMContentLoaded", function() {
  initNetworkMonitor();
});
