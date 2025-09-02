# Elektroniczny wniosek urlopowy

Aplikacja webowa do obsługi wniosków urlopowych.  
Backend oparty na **Spring Boot + MySQL + Firebase**, frontend w **React + TypeScript + Vite**.

## Funkcjonalności

- Zarządzanie wnioskami urlopowymi (dodawanie, edycja, usuwanie)
- Akceptacja/odrzucanie wniosków przez przełożonych
- Kalendarz urlopów pracowników
- Zarządzanie pracownikami i strukturą organizacyjną (dodawanie, edycja pracownika)
- Autentykacja użytkowników przez Firebase
- Responsywny interfejs

## Technologie

- **Frontend**: React, TypeScript, Vite
- **Backend**: Java 17, Spring Boot, Maven
- **Database**: MySQL
- **Authentication**: Firebase Authentication

## Uprawnienia

System posiada trzy poziomy uprawnień:
1. **Administrator** - pełny dostęp do wszystkich funkcji
2. **Manager** - zarządzanie podwładnymi – akceptacja/odrzucenie ich wniosków
3. **Pracownik** - składanie i przeglądanie własnych wniosków

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
└── schema.sql              # Skrypt SQL tworzy bazę dbo, tabele na bazie  oraz wypełnia tabele przykładowymi danymi
```

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/kkrzy/ewu.git
cd ewu
```

2. Skonfiguruj bazę danych:
   - Uruchom lokalny serwer MySQL.
   - Utwórz bazę danych `dbo`:
     ```sql
     CREATE DATABASE dbo;
     ```
   - Zaimportuj schemat i przykładowe dane:
     ```bash
     mysql -u root -p dbo < sql/schema.sql
     ```
   - Domyślna konfiguracja w `server/src/main/resources/application.yml` zakłada:
     ```yaml
     spring:
       datasource:
         url: jdbc:mysql://localhost:3306/dbo
         username: root
         password: root
     ```
     Jeśli masz inną bazę lub inne dane dostępu, zmień dane w tym pliku.

3. Skonfiguruj Firebase:
   Na potrzeby prezentacji ("obrony") konfiguracja jest umieszczona w projekcie.
   
4. Uruchom backend: <br> Domyślnie działa pod adresem:➡️ http://localhost:8080
```bash
cd server
mvn spring-boot:run
```

5. Przejdź do folderu klienta i zainstaluj zależności:
```bash
cd client
npm install
```

6. Uruchom frontend: <br> Domyślnie startuje na:➡️ http://localhost:5173
```bash
npm run dev
```

## Dostępne widoki

- `/login` - Strona logowania
- `/` - Dashboard
- `/employees` - Zarządzanie pracownikami
- `/leaves` - Wnioski urlopowe
- `/calendar` - Kalendarz urlopów

## Testowanie

Użyj przykładowych danych logowania z sql/schema.sql:

- Administrator: `admin@firma.pl / password`
- Pracownik: `adam.nowak@firma.pl / password`
- Manager: `jan.kowalski@firma.pl / password`

Przetestuj kluczowe funkcje:

- Zaloguj się do aplikacji jako pracownik / manager / administrator.
- Złóż wniosek urlopowy jako pracownik.
- Zaakceptuj/odrzuć wnioski jako manager.
- Sprawdź kalendarz.
- Dodaj nowego pracownika jako administrator.
