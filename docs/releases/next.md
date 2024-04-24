# Stabilität von Tagesplänen und Projekten erhöhen (Version :VERSION)

## Zusammenfassung der Änderungen

Die Veränderungen sind primär interner Natur. Wenn wir Einträge von einer Tabelle abfragen und filtern (zum Beispiel nach unerledigten Aufgaben), werden 100 Zeilen von unserer Datenbank (DynamoDB) abgefragt und dann der Filter angewandt. Nach dem Filtern kann es sein, dass keine Zeile übrig bleibt und somit fehlten Einträge im Ergebnis. Wir erhalten einen Cursor (`nextToken`), den wir verwenden können, um die gleiche Abfrage noch einmal auszuführen und bei dem Cursor zu starten, um die nächsten 100 Zeilen abzurufen. Uns gefällt es nicht, dass wir für eine einzige Abfrage also jeden Eintrag in der Datenbank anfassen. Das lässt sich vermeiden, in dem wir in der Datenbank einen zweiten Index anlegen für das Feld, das wir abfragen wollen (z.B. `erledigt`). Das Problem ist in diesem [Github Issue](https://github.com/aws-amplify/amplify-category-api/issues/2443) diskutiert.

- Ein neues Datenmodell eingeführt, um Todos mit und ohne Projekt zusammenzufassen in einem Modell und entsprechend zu migrieren.
- Migration der Einträge dem Anwender anbieten.
- Überflüssige Spalten und damit auch Modelle entfernt, um das Schema etwas schlanker zu machen.
- Die Oberfläche scheint nun zuverlässiger, die erstellten Einträge anzuzeigen.
- Für die Datenmodelle, die an vielen Stellen verwendet werden, verwenden wir jetzt Kontexte, so dass sie an mehreren Stellen in der Applikation wiederverwendet werden können. Das gilt für Projekte, Accounts und für Personen.

## Bekannte Fehler

## Geplante neue Funktionen

- [ ] Markdown unterstützen
- [ ] Next Actions aus Projekten anzeigen
- [ ] Numerierte Listen unterstützen
- [ ] Tasks müssen in der Liste direkt editierbar sein, ohne dass der Task geöffnet werden muss
- [ ] Die Suche funktioniert im Moment nicht
- [ ] Hyperlinks erkennen
- [ ] Bei Task Detailseite auch die Meetings anzeigen
- [ ] Projektliste und Detailseite
- [ ] Personenliste und Detailseite
- [ ] Account-Liste und Detailseite
- [ ] Projekte sollen abgeschlossen werden können
- [ ] Tastaturbefehle anzeigen, wenn die "Control" Taste gedrückt ist
- [ ] Integration von Bildern in Notizen ermöglichen
- [ ] Über Pagination nachdenken, damit sich die Ladezeiten optimieren
- [ ] Beim Scrollen soll der Titel im Header übernommen werden
- [ ] DayProjectTask und NonProjectTask überführen in Task
- [ ] Sicherstellen, dass die Daten durch das neue Release automatisch überführt werden
- [ ] Auf dem iPhone soll es nicht den Header geben, sondern das Logo am unteren Rand des Bildschirms
- [ ] Planung eines Cycles unterstützen
- [ ] eine Inbox einführen
