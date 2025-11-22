import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Burada event listener ekleyebilirsin (ör. test sonrası raporlama)
    },
    baseUrl: "http://localhost:5173", // testlerde cy.visit yerine kullanılabilir
    video: true,                      // video kaydını aç
    videosFolder: "cypress/videos",   // videoların kaydedileceği klasör
    screenshotsFolder: "cypress/screenshots", // ekran görüntüleri için klasör
    videoCompression: 32,             // videoları sıkıştır (0 = kapalı, 32 = varsayılan)
    chromeWebSecurity: false,         // cross-origin testlerde hata almamak için
    defaultCommandTimeout: 8000,      // komutların timeout süresi (ms)
    pageLoadTimeout: 60000            // sayfa yükleme timeout süresi (ms)
  },
});
