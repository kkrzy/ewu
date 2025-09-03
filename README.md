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
1. **Pracownik** - składanie i przeglądanie własnych wniosków
2. **Manager** - zarządzanie wnioskami podwładnych – akceptacja/odrzucenie/wycofanie
3. **Administrator** - pełny dostęp do wszystkich funkcji 

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
└── src/main/
    ├── java/com/paw/ewu/
    │   ├── configuration/  # Konfiguracje (Firebase, Security)
    │   ├── controller/     # Kontrolery REST API
    │   ├── dto/            # Obiekty transferu danych
    │   ├── entity/         # Encje bazodanowe
    │   ├── exception/      # Obsługa wyjątków
    │   ├── repository/     # Repozytoria JPA
    │   ├── service/        # Warstwa logiki biznesowej
    │   └── PawApplication.java
    └── resources/
        └── application.yml # Główna konfiguracja aplikacji
sql/
└── schema.sql              # Skrypt SQL tworzy bazę dbo, tabele oraz wypełnia przykładowymi danymi
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
  <img width="1094" height="600" alt="image" src="https://github.com/user-attachments/assets/8217c7ab-89d5-4f52-994e-537d88438848" />

- `/` - Dashboard
  <img width="1147" height="634" alt="image" src="https://github.com/user-attachments/assets/42aa66f2-e112-48e5-bd68-9d99b7ba3f39" />

- `/employees` - Pracownicy
  <img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/e0231008-3730-47c5-9525-c9b2f58e298a" />

- `/leaves` - Wnioski urlopowe
  <img width="1378" height="851" alt="image" src="https://github.com/user-attachments/assets/b2b25d7f-6147-4d60-a95d-60b5ef043f91" />

- `/calendar` - Kalendarz
  <img width="1372" height="1032" alt="image" src="https://github.com/user-attachments/assets/f16c7309-903c-428a-8280-cadb8282a019" />


## Testowanie

Użyj przykładowych danych logowania z sql/schema.sql:

- Pracownik: `adam.nowak@firma.pl / password`
- Manager: `jan.kowalski@firma.pl / password`
- Administrator: `admin@firma.pl / password`

Przetestuj kluczowe funkcje:

- Zaloguj się do aplikacji jako pracownik / manager / administrator.
- Złóż wniosek urlopowy jako pracownik.
- Zaakceptuj/odrzuć wnioski jako manager.
- Sprawdź kalendarz.
- Dodaj nowego pracownika jako administrator.
