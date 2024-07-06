# Mehr Details zu Personen dokumentieren (Version :VERSION)

- Bei Meetings, Personen und Accounts den Titel korrigiert, so dass nicht "undefined" angezeigt wird, wenn die Daten noch geladen werden.
- Bei Notizen zu Personen, Meetings und Accounts sind die Notizen nun auch in einem Accordion Eintrag hinterlegt und dieser zeigt eine kurze Zusammenfassung der Notizen (außer bei Accounts).
- Details zu Personen ermöglichen (Account-Zugehörigkeit).
- Point-in-time recovery für alle DynamoDB Tabellen aktiviert.

In Arbeit:

- Details zu Personen ermöglichen (Kontaktdetails, Geschenkideen, Gebetsanliegen, Gelerntes zur Person, Beziehung zu anderen Personen).

Später:

- Ein Meeting soll eine feste Struktur haben:
  - Name des Meetings
  - Datum/Uhrzeit
  - Teilnehmer
  - Agenda
  - Notizen zu jedem Agendapunkt, inkl. Vereinbarungen und wer diese verantwortet
- Ein Meeting soll nur ein einziges Notizfeld haben, in dem alle Infos bearbeitet werden können.
- Meetingzusammenfassung mithilfe von Bedrock erstellen lassen
- Unterstützung für Bilder in Notizen ermöglichen.
