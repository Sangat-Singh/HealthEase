# Database setup

`healthease.sql` contains a schema exported from the verified MySQL connection on October 13, 2026, plus explicitly synthetic demo records. No source table records were exported. The original database was not modified.

The export preserves ten tables, their keys and indexes, the `validate_appointment_time` trigger, and the `todays_appointments` view. The application uses `departments`, `doctors`, `patients`, `appointments`, and `payments`. The singular-named tables are also present in the source database and are retained without data. No routines or events were present in the dump. Account definers are removed; the view uses `SQL SECURITY INVOKER` for portability. Auto-increment counters are omitted so local demo inserts establish them.

## Import with MySQL Workbench

1. Connect to a local MySQL 8.0 instance intended for demo use.
2. Create an empty schema named `healthease_demo` with character set `utf8mb4` and collation `utf8mb4_0900_ai_ci`.
3. Open **Server > Data Import** and select **Import from Self-Contained File**.
4. Select this repository's `database/healthease.sql` and set **Default Target Schema** to `healthease_demo`.
5. Start the import, refresh Schemas, and confirm the tables, view, and trigger appear. Inspect the import log if an error occurs.
6. Configure the root `.env` for this local schema. Import requires privileges to create tables, views, and triggers; the application account needs access to read and insert records and update appointments.

The script includes `DROP TABLE` and `DROP VIEW` statements. Import only into a new, empty demo schema. It has not been executed against the source database or a temporary database during repository preparation.

Demo records use IDs 1, `Demo Patient`, and `demo.patient@example.invalid`. The appointment is dated January 15, 2030 at 09:00. These values were authored for the export and do not represent source records. Search that email in **My Appointments** after importing. The payment record demonstrates the separate payments table; the frontend Pay Now action only attempts to update appointment payment status.

## Regenerate safely in Workbench

1. Open **Server > Data Export**, select the source schema, and select all verified tables and views.
2. Choose **Dump Structure Only**, include triggers, and enable routines/events if present. Never use a structure-and-data export from a database containing private records.
3. Choose **Export to Self-Contained File** and save to `database/healthease.sql` in this repository.
4. Review the SQL locally for account definers, schema-specific references, credentials, and embedded private literals in stored object definitions. Remove account-specific definers and use invoker permissions for the view where appropriate.
5. Add only synthetic records matching the verified definitions. Never copy patient rows, payment identifiers, or other private source records. Review the complete diff before committing.
