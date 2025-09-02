# Elektroniczny wniosek urlopowy

Aplikacja do zarządzania wnioskami urlopowymi w organizacji, wykorzystująca React, TypeScript, Java i Firebase.

## Funkcjonalności

- Zarządzanie wnioskami urlopowymi (dodawanie, edycja, usuwanie)
- Akceptacja/odrzucanie wniosków przez przełożonych
- Kalendarz urlopów pracowników
- Zarządzanie pracownikami i strukturą organizacyjną (dodawanie, edycja pracownika)
- Autentykacja użytkowników przez Firebase
- Responsywny interfejs

## Technologia

- Node.js (v16 lub wyższa)
- npm (v7 lub wyższa)
- Java 17+
- Spring Boot
- Spring Data JPA (dostęp do bazy danych)
- Maven (zarządzanie projektem)
- Baza danych (MySQL)
- Firebase account

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/kkrzy/ewu.git
cd ewu
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację:
```bash
npm run dev
```

## Struktura projektu

```
client/
├── src/
│   ├── app/                # Główne komponenty aplikacji
│   ├── assets/             # Zasoby statyczne
│   ├── components/         # Komponenty wielokrotnego użytku
│   ├── firebase/           # Konfiguracja Firebase
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Komponenty stron
│   └── types/              # Interfejsy i typy TypeScript
└── public/                 # Pliki publiczne
server/
├── src/main/
│   ├── java/com/paw/ewu/
│   │   ├── configuration/  # Konfiguracje (Firebase, Security)
│   │   ├── controller/     # Kontrolery REST API
│   │   ├── dto/            # Obiekty transferu danych
│   │   ├── entity/         # Encje bazodanowe
│   │   ├── exception/      # Obsługa wyjątków
│   │   ├── repository/     # Repozytoria JPA
│   │   ├── service/        # Warstwa logiki biznesowej
│   │   └── PawApplication.java
│   └── resources/
│       └── application.yml # Główna konfiguracja aplikacji
sql/
└── schema.sql              # Skrypt SQL tworzy tabele na bazie danych MySQL oraz wypełnia je przykładowymi danymi
```

## Uprawnienia

System posiada trzy poziomy uprawnień:
1. **Admin** - pełny dostęp do wszystkich funkcji
2. **Manager** - zarządzanie podwładnymi – akceptacja/odrzucenie ich wniosków
3. **Pracownik** - składanie i przeglądanie własnych wniosków

## Dostępne widoki

- `/login` - Strona logowania
- `/` - Dashboard
- `/employees` - Zarządzanie pracownikami
- `/leaves` - Wnioski urlopowe
- `/calendar` - Kalendarz urlopów
