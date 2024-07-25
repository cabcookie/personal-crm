# Aktualisierung von Aufgaben optimieren (Version :VERSION)

- Wenn ein Meeting ausschließlich erledigte Aufgaben hatte, verschwand der Hinweis dafür auf kleineren Bildschirmen, wenn der Titel des Meetings zu breit war. Das ist nun nicht mehr der Fall.
- In der Meetingliste ist nun etwas mehr Platz zwischen den Tagen.
- Informationen zu CRM Projekten auf der Listenseite `/crm-projects` anzeigen.
- Die App hat stetig den Inbox API Endpunkt aufgerufen, nur damit Anwender einen neuen Eintrag zu der Inbox hinzufügen können. Das passiert nun nicht mehr.
- Die Einträge der Inbox wurden nicht korrekt dargestellt, weil das Feld `hasOpenTasks` für alte Einträge nicht gesetzt war.
- Personeninformationen bereits im Accordion Untertitel anzeigen (Unternehmen und Aussprache des Namens).
- Die Anzahl der API Aufrufe für Einträge in der Inbox reduziert.
- In Meetings und Projekten wurden beim Laden die nächsten Aufgaben nicht korrekt dargestellt. Wenn man eine Notiz bearbeitet und dadurch eine Aufgabe hinzufügt hat, wurden auch die nächsten Aufgaben korrekt dargestellt, nicht aber schon beim Laden.
