# Personal GitHub publishing review

Historical record of the initial 60-file publication on October 13, 2026, completed after explicit approval. The current repository tree and later commits also include interview-demo updates; this initial manifest is not the current file list.

- GitHub account: **Sangat-Singh**.
- Destination: https://github.com/Sangat-Singh/HealthEase
- Origin: `https://github.com/Sangat-Singh/HealthEase.git`.
- Visibility: **public**, verified through GitHub repository metadata.
- Branch: `main`.
- Remote state at review: no existing branches.
- History: fresh repository, one initial commit with no parents; no previous repository history included.
- Commit message: `Prepare HealthEase full-stack project for GitHub`.
- Push policy: ordinary push only after explicit approval; no force push or visibility change.

## Exact project file list (60 files)

These are the complete files in the personal repository snapshot.

```text
.env.example
.gitignore
README.md
config/db.js
controllers/appointmentController.js
controllers/departmentController.js
controllers/doctorController.js
controllers/patientController.js
controllers/paymentController.js
controllers/slotController.js
database/README.md
database/healthease.sql
docs/ATTRIBUTION.md
docs/PUBLISHING.md
docs/VALIDATION.md
healthease-frontend/.gitignore
healthease-frontend/README.md
healthease-frontend/package-lock.json
healthease-frontend/package.json
healthease-frontend/public/favicon.ico
healthease-frontend/public/images/departments/cardiology.png
healthease-frontend/public/images/departments/dermatology.png
healthease-frontend/public/images/departments/generalmedicine.png
healthease-frontend/public/images/departments/neurology.png
healthease-frontend/public/images/departments/orthopedic.png
healthease-frontend/public/images/departments/pediatric.png
healthease-frontend/public/images/departments/psychology.png
healthease-frontend/public/index.html
healthease-frontend/public/logo.png
healthease-frontend/public/logo192.png
healthease-frontend/public/logo512.png
healthease-frontend/public/manifest.json
healthease-frontend/public/robots.txt
healthease-frontend/src/App.css
healthease-frontend/src/App.js
healthease-frontend/src/App.test.js
healthease-frontend/src/index.css
healthease-frontend/src/index.js
healthease-frontend/src/logo.svg
healthease-frontend/src/pages/BookAppointment.js
healthease-frontend/src/pages/Departments.js
healthease-frontend/src/pages/Doctors.js
healthease-frontend/src/pages/MyAppointments.js
healthease-frontend/src/reportWebVitals.js
healthease-frontend/src/services/api.js
healthease-frontend/src/setupTests.js
models/appointmentModel.js
models/departmentModel.js
models/doctorModel.js
models/patientModel.js
models/paymentModel.js
package-lock.json
package.json
routes/appointmentRoutes.js
routes/departmentRoutes.js
routes/doctorRoutes.js
routes/patientRoutes.js
routes/paymentRoutes.js
routes/slotRoutes.js
server.js
```

## Exclusions and preservation

- Root and frontend `node_modules/`: excluded. Installed packages and their genuine license notices remain on disk and in the complete local backup.
- Local `.env` and other environment files: excluded. Only the placeholder `.env.example` is included.
- Frontend `build/`, coverage, logs, caches, and other generated output: excluded.
- Local editor configuration, private key/certificate files, credential JSON files, and unreviewed database dumps: excluded.
- Previous Git metadata and complete backup: retained outside this repository; neither is part of the fresh history or publication.
- Source database records: never exported. The SQL contains verified schema definitions and clearly synthetic demo records.
- All application source, SQL, frontend assets, manifests, and lockfiles: retained without alteration during personal repository preparation.
- Collaborative credit and existing licensing declarations: preserved; see [ATTRIBUTION.md](ATTRIBUTION.md).

## Local backup

A complete sibling backup was made before changing Git history. All 51,669 files matched the original by SHA-256, with zero mismatches. It includes local private files, installed dependencies, build output, and the original Git history. It remains local and must not be published. The old live Git metadata was also archived inside that backup before fresh initialization.

## Approval and validation

The initial snapshot was approved and published to the **public personal destination**. Subsequent updates preserve that history and use ordinary pushes. Authentication uses the existing Git setup; never supply a password or token in chat. See [the README](../README.md), [the SQL export](../database/healthease.sql), and [current validation results](VALIDATION.md).

Backend syntax, the API status route, and frontend production build passed during the original preparation. Frontend tests failed before execution, the appointment PATCH handlers then lacked a database import, and database restoration was untested. The import was subsequently fixed and covered by isolated route tests; current results are recorded in VALIDATION.md.
