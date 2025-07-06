# Profa za osnovce

Ovaj repozitorijum sadrži početni kod za edukativnu mobilnu aplikaciju namenjenu učenicima od 6. do 8. razreda koji pohađaju privatne časove matematike. Aplikacija koristi Firebase za autentifikaciju, bazu podataka i skladište.

## Struktura

- `mobile/ProfaZaOsnovce` – React Native (Expo) projekat sa osnovnim ekranima (lekcije, kalendar, domaći zadaci, chat, profil).
- `admin/` – jednostavan web panel za administraciju sadržaja (dodavanje lekcija itd.).

## Pokretanje mobilne aplikacije

1. Instalirati [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) i Node.js.
2. U direktorijumu `mobile/ProfaZaOsnovce` pokrenuti `npm install` da bi se preuzle sve zavisnosti.
3. Popuniti fajl `firebase.js` sopstvenim Firebase parametrima.
4. Pokrenuti `npm start` i slediti instrukcije Expo alata.

## Pokretanje admin panela

Admin panel je uprošćena React aplikacija bez build procesa. Dovoljno je otvoriti `admin/index.html` u pregledaču. Pre toga u `admin/app.js` upisati Firebase konfiguraciju i autorizovati se kao profesor.

## Pokretanje web verzije

1. U direktorijumu `mobile/ProfaZaOsnovce` pokrenuti `npm run build:web` kako bi se pripremila statička verzija aplikacije u folderu `dist`.
2. Na vrhu repozitorijuma izvršiti `npm install` da se instalira Express server.
3. Pokrenuti `npm start` i otvoriti `http://localhost:3000` u pregledaču. Admin panel je dostupan na `http://localhost:3000/admin`.

## Napomena

Kod predstavlja osnovu i služi kao polazna tačka. Za kompletnu funkcionalnost potrebno je dodatno razviti logiku na klijentu i u Firestore-u, kao i proširiti dizajn prema sopstvenim potrebama.
