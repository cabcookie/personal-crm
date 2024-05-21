# Inbox einführen (Version :VERSION)

In einer Inbox können nun Gedanken gesammelt werden, die zwischendurch auftreten können aus verschiedenen Quellen: E-Mails, Anrufe, Gespräche, Gedanken. In der Inbox können solche Snippets festgehalten werden, so dass man sorgenfrei mit der eigentlichen Aufgabe weitermachen kann.

Die einzelnen Einträge in der Inbox können dann Schritt für Schritt bearbeitet werden und somit sofort erledigt, einem Projekt als Notiz hinzugefügt, ein neues Projekt angelegt oder die Todos von einem bestehenden Projekt angepasst werden.

## Weitere Aktualisierungen

Wir haben SlateJs aufgegeben. Es ist extrem umständlich, damit einen schönen Text-Editor zu bauen, da jede einfache Funktion selbst entwickelt werden muss. Mit `TipTap` fahren wir besser. Mit dem `StarterKit` bekommen wir sofort einen Text-Editor, der Markdown versteht.

## Detaillierte Erläuterungen

### TipTap statt SlateJs

Leider unterstützt `TipTap` kein Markdown, um die Inhalte zu speichern. Also haben wir in der Datenbank neue Felder eingeführt, um Notizen und Aktionen im JSON Format zu speichern. Jeder Datensatz hat nun eine Versionsnummer für die Formatierung. Version 2 steht für die Umstellung auf `TipTap`.

### Amplify Gen2 v1

Amplify Gen2 ist nun aus dem Preview Status heraus gewachsen und Version 1.0 wurde veröffentlicht. Wir haben also ein Upgrade durchgeführt und dementsprechend auch einige Änderungen am Code vornehmen müssen, um den Anforderungen der neuen Version gerecht zu werden. Wir erwarten zukünftig auch mehr Stabilität und weniger `Breaking Changes` als in der Vergangenheit.

### Code Formatting

Programmcode und Markdown werden nun durch Linter geprüft und zum Teil automatisch beim Speichern angepasst. Die Regeln sind im Repository hinterlegt, so dass auch in anderen Umgebungen das Linting funktionieren sollte.
