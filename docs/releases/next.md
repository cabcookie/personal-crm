# Inbox Workflow optimieren und Editieren verlässlicher machen (Version :VERSION)

## Inbox Workflow optimiert

Die UI ist optimiert. Der aktuelle Kontext wird berücksichtigt oder kann angepasst werden.

## Editieren zuverlässiger

Beim Speichern in der Datenbank gingen immer wieder die letzte Eingaben verloren. Der Prozess ist nun entkoppelt und der Editor wird nicht mehr aktualisiert, wenn die gespeicherten Einträge an die Komponente übergeben werden. Der Editor vergleicht ständig, was ihm als gespeichert übergeben wird mit dem, was er gerade für einen Inhalt hat und somit weiß der Anwender ständig, ob seine letzten Daten gespeichert sind oder nicht.
