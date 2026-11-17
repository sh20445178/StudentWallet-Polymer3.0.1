# Student Wallet (Polymer 3)

A student wallet web app built with the [Polymer 3](https://polymer-library.polymer-project.org/3.0/docs/about_30) JavaScript library.

## Features

1. **Student Registration**: register a student with name, email, phone, date of birth, course, year of study and an optional initial wallet deposit. The form validates required fields, email and phone formats, and duplicate emails.
2. **Student Profiles**: browse every registered student with search and a course filter, plus totals for students and wallet balance. Open a profile to:
   - view the student's details
   - add money to the wallet or spend from it, with a check for insufficient balance
   - view transaction history
   - delete the student

Data is stored in the browser's `localStorage`. There is no backend.

## Getting started

```bash
npm install
npm start        # opens http://localhost:8000
```

`@web/dev-server` resolves Polymer's bare module imports (`--node-resolve`), so no build step is needed.

## Project structure

```
index.html                     App entry point
src/
  student-wallet-app.js        App shell, navigation and hash routing
  student-registration.js      Registration form and validation
  student-profiles.js          List of registered students (search/filter)
  student-profile-detail.js    Single profile, wallet transactions, delete
  student-store.js             localStorage persistence layer
  shared-styles.js             Shared component styles
  format.js                    Currency/date helpers
```

Routes: `#register`, `#profiles`, `#profile/<studentId>`.
