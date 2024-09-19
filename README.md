# Vokabeltrainer

Dockerisieren Sie die Applikation
1. ohne docker compose
2. mit docker compose

## Hints

* die postgres-docker.sh ist teilweise fehlerhaft
* logs lesen
* invalid ELF headers?  
  die node_modules sollten nicht in das Image kopiert werden, sondern installiert
* angular-Container startet, curl aus dem Container heraus geht, aber der Browser kann die Seite nicht laden?  
  `ng serve --host 0.0.0.0` - ansonsten ist der Server nur auf localhost **im Container** erreichbar
* angular-Container start, curl aus dem Container heraus geht, sodass das Backend antwortet, aber Browser-Probleme?
  der Browser kann die URL nicht auflösen, weil er keinen Zugriff auf den Docker DNS-hat, wir brauchen einen [nginx](https://nginx.org/en/docs/beginners_guide.html) Reverse-Proxy
* der nginx funktioniert nur fürs Frontend?  
  Ports überprüfen, sind an zwei Stellen relevant
* das Frontend sollte nie gar nicht unter keinen Umständen zur Datenbank können
* es muss genau ein einziger port geforwarded werden