# Matrix AI Agent Platformu

## Proje Genel Bakış

Matrix, kullanıcıların dinamik yeteneklere sahip birden fazla AI ajanı oluşturmasına, etkileşime geçmesine ve yönetmesine olanak tanıyan yenilikçi bir AI ajan yönetim platformudur. Platform, akıllı yönlendirme ve ajan üretim mekanizmaları ile sofistike bir ajan ekosistemi sunar.

## XGO - Otomatik Kod Üretme Motoru

Matrix'in güçlü özelliklerinden biri olan XGO (eXtensible Generator Operations), projelerin otomatik olarak oluşturulmasını ve yönetilmesini sağlayan akıllı bir kod üretme motorudur.

### XGO Özellikleri

1. **Proje Şablonları**

   - Önceden tanımlanmış proje şablonları (CRM, E-ticaret vb.)
   - Özelleştirilebilir model ve ilişki tanımları
   - Dinamik sayfa ve bileşen üretimi

2. **Otomatik Kod Üretimi**

   - Next.js proje yapısı oluşturma
   - Model bazlı CRUD işlemleri
   - API endpoint'leri
   - TypeScript tip tanımlamaları
   - Postman koleksiyonu oluşturma

3. **Akıllı Şablon Sistemi**
   - Modüler template yapısı
   - İlişkisel model desteği
   - Özelleştirilebilir UI bileşenleri

## Teknoloji Yığını

- **Frontend**: Next.js 14, TypeScript, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Veritabanı**: MongoDB, Mongoose
- **AI Entegrasyonu**: OpenAI Servisleri
- **Kimlik Doğrulama**: JWT tabanlı auth sistemi

## Proje Yapısı

### Src Dizin Yapısı

```
src/
├── app/                    # Next.js 14 App Router yapısı
│   ├── (root)/            # Ana uygulama rotaları
│   ├── api/               # API endpoint'leri
│   └── globals.css        # Global stil tanımları
├── components/            # Yeniden kullanılabilir UI bileşenleri
│   ├── ui/               # Temel UI bileşenleri
│   ├── sidebar/          # Kenar çubuğu bileşenleri
│   ├── modals/           # Modal bileşenleri
│   └── theme/            # Tema ile ilgili bileşenler
├── lib/                   # Temel kütüphane kodları
│   ├── actions/          # Sunucu aksiyonları
│   ├── constants/        # Sabit değerler
│   ├── models/           # Mongoose modelleri
│   ├── services/         # Servis katmanı
│   ├── middlewares/      # Middleware fonksiyonları
│   └── types/            # TypeScript tip tanımlamaları
└── hooks/                # React custom hook'ları
```

## Özellikler

### Kullanıcı Deneyimi

1. **Kullanıcı Yönetimi**

   - JWT tabanlı güvenli kimlik doğrulama
   - Rol tabanlı yetkilendirme (admin/user)
   - Çoklu workspace desteği

2. **Ajan Yönetimi**

   - Özelleştirilebilir AI ajanları oluşturma
   - Varsayılan "Alfred" ajanı
   - Dinamik ajan keşfi ve üretimi
   - Workspace bazlı ajan izolasyonu

3. **Akıllı Ajan Yönlendirme**
   - Kullanıcı isteğine göre dinamik ajan seçimi
   - Ajan bulunamadığında otomatik ajan üretimi
   - Çoklu ajan koordinasyonu

### Teknik Özellikler

- Server-Side Rendering (SSR) desteği
- Optimized MongoDB bağlantı yönetimi
- Middleware tabanlı güvenlik kontrolleri
- Modüler ve ölçeklenebilir mimari
- TypeScript ile tam tip güvenliği

## Kurulum

### 1. Gereksinimleri Yükleme

- Node.js (v18+)
- MongoDB (v5+)
- OpenAI API Anahtarı

### 2. Ortam Değişkenleri

Gerekli `.env` değişkenleri:

```env
MONGODB_URI=
OPENAI_API_KEY=
JWT_SECRET=
```

### 3. Geliştirme Sunucusunu Başlatma

```bash
npm install
npm run dev
```

## Güvenlik

- JWT tabanlı oturum yönetimi
- Middleware seviyesinde yetkilendirme
- API rate limiting
- Güvenli OpenAI API key yönetimi

## Performans Optimizasyonları

- MongoDB connection pooling
- Önbellekleme stratejileri
- Lazy loading bileşenler
- Optimize edilmiş API çağrıları

## Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inize push yapın
5. Pull request oluşturun

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

## Contact

For questions or support, contact: [your-email@example.com]
