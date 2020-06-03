# PlanningPoker
Ein kleiner Server auf SignalR-Basis, der zur Entwicklung von PlanningPoker-Clients verwendet werden kann.  
Dazu gibt es eine Beispiel-Implementierung in JavaScript.
Der Server soll möglichst dumm gehalten werden und leitet daher nur Nachrichten zwischen den Clients über ein Hub weiter.  
Zum Ablauf: 
- Benutzer betreten mit einem selbst gewählten Namen die Pokerrunde 
- Jeder Benutzer kann eine Abstimmungsrunde starten und die verfügbaren Karten bestimmen
- Alle zu dem Zeitpunkt anwesenden Benutzer können nun eine Karte auswählen und müssen diese "einloggen"
- Alle Benutzer können die Abstimmung jederzeit beenden
- Nach dem Ende der Abstimmung werden alle "eingeloggten" Karten aufgedeckt
## SignalR PokerHub.cs
Stellt Methoden bereit, die von einem verbundenen Client aufgerufen werden, um Nachrichten an alle Clients zu senden.  
Erreichbar unter ~/PokerHub
### Enter(string user)
Muss direkt nach dem Verbindungsaufbau aufgerufen werden und benachrichtigt alle Clients über den neuen user mit Namen und Verbindungs-Id (zur späteren Zuordnung, falls die Verbindung beendet wird).  
Löst ``ReceiveNewUser`` aus
### SendStatus(string user, bool isCardLocked)
Benachrichtigt alle Clients darüber, ob eine Karte ausgewählt wurde, oder nicht. Muss beim Auswählen einer Karte und im ``ReceiveNewUser``-Ereigniss aufgerufen werden.  
Löst ``ReceiveStatus`` aus
### StartRound(string user, string[] cards)
Startet eine neue Abstimmung und übermittelt alle gültigen Karten.  
Löst ``ReceiveStart`` aus
### EndRound(string user)
Beendet die aktuelle Abstimmung. 
Löst ``ReceiveEnd`` aus.  
Falls Clients eine Karte ausgewählt haben, wird erwartet, dass diese über ``RevealCard`` gesendet wird.
### RevealCard(string user, string card)
Benachrichtigt alle Clients über die getroffene Kartenauswahl.  
Löst ``ReceiveCard`` aus
