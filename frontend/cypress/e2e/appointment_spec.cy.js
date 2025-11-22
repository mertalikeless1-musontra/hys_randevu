describe('HYS Randevu Sistemi E2E Testi', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.wait(1000); // Sayfa yüklenmesi için bekleme
  });

  it('Hasta başarılı bir şekilde randevu alabilmeli', () => {
    // Yarın için tarih belirle
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().slice(0, 16);

    cy.get('input[type="datetime-local"]').type("2025-12-26T10:00");
    cy.wait(1000); // Tarih girildikten sonra bekleme
    cy.contains('Doktor Ara').click();

    // Doktor seç ve al
    cy.get('select').should('be.visible').select(1);
    cy.wait(1000); // Doktor seçildikten sonra bekleme
    cy.contains('Randevuyu Onayla').click();
    cy.wait(1000); // Onay sonrası bekleme
    cy.contains('Randevunuz başarıyla oluşturuldu').should('be.visible');
  });

  it('Çakışma Senaryosu: Aynı saate iki kez randevu alınamamalı', () => {
    const targetTime = "2025-12-27T15:00";

    // --- ADIM 1: İlk Randevuyu Al ---
    cy.get('input[type="datetime-local"]').type(targetTime);
    cy.wait(1000);
    cy.contains('Doktor Ara').click();

    cy.get('select').should('be.visible').select(1);
    cy.wait(1000);

    cy.get('select option:checked').invoke('text').then((doctorText) => {
      const doctorName = doctorText.trim();
      cy.log('Seçilen Doktor:', doctorName);

      cy.contains('Randevuyu Onayla').click();
      cy.wait(1000);

      cy.contains('Randevunuz başarıyla oluşturuldu').should('be.visible');

      // --- ADIM 2: Sayfayı Yenile ve Tekrar Dene ---
      cy.reload();
      cy.wait(1000);
      cy.get('input[type="datetime-local"]').type(targetTime);
      cy.wait(1000);
      cy.contains('Doktor Ara').click();

      // --- ADIM 3: Akıllı Kontrol ---
      cy.get('body').then(($body) => {
        const isDoctorInList = $body.find(`option:contains("${doctorName}")`).length > 0;

        if (!isDoctorInList) {
          cy.log('Başarılı: Doktor listeden filtrelendi (Scope çalışıyor)');
        } else {
          cy.get('select').select(doctorName);
          cy.wait(1000);
          cy.contains('Randevuyu Onayla').click();
          cy.wait(1000);
          cy.contains('Doctor is not available').should('be.visible');
        }
      });
    });
  });
});
