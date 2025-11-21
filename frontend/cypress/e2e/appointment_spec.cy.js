describe('HYS Randevu Sistemi E2E Testi', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('Hasta başarılı bir şekilde randevu alabilmeli', () => {
    // Yarın için tarih belirle
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().slice(0, 16);

    cy.get('input[type="datetime-local"]').type("2025-12-26T10:00");
    cy.contains('Doktor Ara').click();

    // Doktor seç ve al
    cy.get('select').should('be.visible').select(1);
    cy.contains('Randevuyu Onayla').click();
    cy.contains('Randevunuz başarıyla oluşturuldu').should('be.visible');
  });

  it('Çakışma Senaryosu: Aynı saate iki kez randevu alınamamalı', () => {
    // Sabit bir tarih belirle
    const targetTime = "2025-12-27T15:00";

    // --- ADIM 1: İlk Randevuyu Al (Veritabanını Doldur) ---
    cy.get('input[type="datetime-local"]').type(targetTime);
    cy.contains('Doktor Ara').click();

    // Eğer veritabanı boşsa doktor gelmeli
    cy.get('select').should('be.visible').select(1);

    // Seçilen doktorun ismini al
    cy.get('select option:checked').invoke('text').then((doctorText) => {
      const doctorName = doctorText.trim();
      cy.log('Seçilen Doktor:', doctorName);

      cy.contains('Randevuyu Onayla').click();

      // İlk işlemin başarısını doğrula
      cy.contains('Randevunuz başarıyla oluşturuldu').should('be.visible');

      // --- ADIM 2: Sayfayı Yenile ve Tekrar Dene ---
      cy.reload(); // State'i sıfırla
      cy.get('input[type="datetime-local"]').type(targetTime);
      cy.contains('Doktor Ara').click();

      // --- ADIM 3: Akıllı Kontrol ---
      // Burada iki doğru davranış olabilir:
      // A) Backend 'available_at' scope'u çalışır -> Doktor listede ÇIKMAZ (Müsait doktor yok uyarısı) -> DOĞRU
      // B) Scope çalışmaz ama Validation çalışır -> Doktor çıkar, seçince HATA verir -> DOĞRU

      cy.get('body').then(($body) => {
        // Doktor listede var mı kontrol et
        // Not: $body.find ile option ararken text içeriğine bakıyoruz
        const isDoctorInList = $body.find(`option:contains("${doctorName}")`).length > 0;

        if (!isDoctorInList) {
          cy.log('Başarılı: Doktor listeden filtrelendi (Scope çalışıyor)');
        } else {
          // Doktor listede varsa, seçip hata almayı bekle
          cy.get('select').select(doctorName);
          cy.contains('Randevuyu Onayla').click();
          // Backend validasyon hatasını bekle
          cy.contains('Doctor is not available').should('be.visible');
        }
      });
    });
  });
});