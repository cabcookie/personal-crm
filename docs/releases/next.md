# Mehr Details zu Personen dokumentieren (Version :VERSION)

- Bei Meetings, Personen und Accounts den Titel korrigiert, so dass nicht "undefined" angezeigt wird, wenn die Daten noch geladen werden.
- Bei Notizen zu Personen, Meetings und Accounts sind die Notizen nun auch in einem Accordion Eintrag hinterlegt und dieser zeigt eine kurze Zusammenfassung der Notizen (außer bei Accounts).
- Details zu Personen ermöglichen (Account-Zugehörigkeit, Kontaktdetails).
- Point-in-time recovery für alle DynamoDB Tabellen aktiviert.
- Sortierung von Aktivitäten in Notizen einer Person korrigiert.
- Import-Skripte angepasst, so dass bestehende Daten für Personen importiert werden können.

In Arbeit:

- Details zu Personen ermöglichen (Gelerntes zur Person).
- Details zu Personen ermöglichen (Geschenkideen, Gebetsanliegen, Beziehung zu anderen Personen).
- Ein Meetng sollte mehr Details zu einer Person anzeigen können (Accordions).
- In der Meeting Liste ist das Accordion für Teilnehmer nicht korrekt implementiert. Es fehlt der Kopf.
- Bei Accounts sollten nun auch Personen angezeigt werden können, die damit in Beziehung stehen.
- Bei Accounts sollte im Accordion für Projekte eine Vorschau für offene Projekte existieren. (???)
- Bei Kontaktdetails Links hinzufügen (E-Mail schreiben, PhoneTool, Slack Message, Profil öffnen)

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
