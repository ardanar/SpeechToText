# 📖 İnteraktif Okuma Pratiği

Web Speech API kullanarak gerçek zamanlı okuma kontrolü yapan, telaffuz geliştirmenize yardımcı olan modern bir web uygulaması.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)

## ✨ Özellikler

- 🎯 **Gerçek Zamanlı Okuma Kontrolü** - Kelime kelime kontrol ile anlık geri bildirim
- 🚀 **Hızlı Algılama** - Minimum gecikme ile akıcı okuma deneyimi
- 📊 **Görsel Geri Bildirim** - Tamamlanan, mevcut ve bekleyen kelimeler için renkli gösterim
- ❌ **Hata Yönetimi** - Yanlış okunan kelimelerde otomatik durma ve uyarı
- 🔄 **Tekrar Deneme** - Yanlış kelime için kolayca tekrar deneme imkanı
- 🔢 **Türkçe Sayı Desteği** - Rakam ve yazı formları arasında otomatik eşleştirme (örn: "3" ↔ "üç")
- 🛡️ **Akıllı Alternatif Eşleştirme** - API yanlış algılamalarına karşı alternatif kelime desteği
- 📱 **Responsive Tasarım** - Mobil ve masaüstü uyumlu modern arayüz

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js (v12 veya üzeri)
- npm veya yarn
- Modern web tarayıcı (Chrome, Edge önerilir)

### Kurulum

1. **Depoyu klonlayın**
```bash
git clone https://github.com/kullaniciadi/speech-reading-practice.git
cd speech-reading-practice
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Sunucuyu başlatın**
```bash
npm start
```

4. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📖 Kullanım

### Temel Kullanım

1. **Metin Girişi**: "Okunacak Metin" alanına okumak istediğiniz metni yazın veya "Örnek Metin" butonunu kullanın

2. **Okumaya Başlama**: "Başla" butonuna tıklayın ve mikrofon erişimi için izin verin

3. **Okuma**: Metni normal hızınızda okuyun - sistem kelime kelime kontrol eder

4. **Hata Durumu**: Yanlış kelime okunduğunda sistem durur ve uyarı gösterir

5. **Tekrar Deneme**: "Tekrar Dene" butonuna tıklayarak aynı kelimeyi tekrar okuyabilirsiniz

6. **Tamamlama**: Tüm metni doğru okuduğunuzda başarı mesajı gösterilir

### Görsel Göstergeler

- 🟢 **Yeşil**: Tamamlanan kelimeler
- 🔵 **Mavi (Vurgulu)**: Şu an okunan kelime
- ⚪ **Gri**: Bekleyen kelimeler

## 🛠️ Teknolojiler

- **Node.js** - Backend runtime
- **Express.js** - Web sunucusu
- **Web Speech API** - Gerçek zamanlı ses tanıma
- **Vanilla JavaScript** - Modern ES6+ özellikleri ile
- **CSS3** - Gradient ve animasyonlar ile modern tasarım

## 🌐 Tarayıcı Desteği

### Desteklenen Tarayıcılar

- ✅ **Chrome** (Önerilen - En iyi performans)
- ✅ **Edge** (Chromium tabanlı)
- ⚠️ **Safari** (Sınırlı destek)
- ❌ **Firefox** (Web Speech API desteği yok)

### Dil Desteği

- 🇹🇷 **Türkçe** (`tr-TR`) - Tam destek
- 🔢 Türkçe sayılar için otomatik rakam-yazı eşleştirmesi

## 📝 Örnek Kullanım Senaryoları

### Senaryo 1: Telaffuz Pratiği
```
Metin: "Türkiye, Asya ve Avrupa kıtalarında yer alan güzel bir ülkedir."
→ Her kelimeyi doğru telaffuz ederek okuyun
```

### Senaryo 2: Sayı Okuma Pratiği
```
Metin: "Bu yıl 2025, 3 yıl önce 2022 idi."
→ Rakamları hem yazı hem rakam olarak söyleyebilirsiniz
```

## 🔧 Geliştirme

### Geliştirme Modu

Hot reload ile geliştirme yapmak için:

```bash
npm run dev
```

### Proje Yapısı

```
speech-reading-practice/
├── public/
│   ├── index.html      # Ana HTML dosyası
│   ├── app.js          # Ana JavaScript kodu
│   └── style.css       # Stil dosyası
├── server.js           # Express sunucusu
├── package.json        # Proje bağımlılıkları
└── README.md           # Bu dosya
```

## 🎯 Özellik Detayları

### Gerçek Zamanlı Kontrol
- Her kelime anında kontrol edilir
- 50ms kontrol aralığı ile minimum gecikme
- Interim results kullanarak daha hızlı geri bildirim

### Akıllı Eşleştirme
- Türkçe sayılar için rakam-yazı dönüşümü
- API yanlış algılamaları için alternatif kelime desteği
- Önceki kelime tekrarını önleme

### Hata Yönetimi
- Alakasız kelimeleri filtreleme
- Gerçek hatalarda net uyarı mesajları
- Tekrar deneme imkanı
