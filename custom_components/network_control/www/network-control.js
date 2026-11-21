(() => {
  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const stylesheet = new URL("./network-control.css", import.meta.url).href;
  const themes = {
    network: ["Network Control", "#101722", "#68def0"],
    steel: ["Brushed Steel", "#292c30", "#ad9aff"],
    relay: ["Amber Relay", "#24291f", "#ffbd5d"],
    neon: ["Neon Grid", "#070d20", "#fd86e6"],
    abyss: ["Midnight Drift", "#0b1022", "#77f1ff"],
    tide: ["Aqua Current", "#0b384b", "#7dffde"],
    mac: ["Mac Control", "#a7a89e", "#b9ff70"],
    trek: ["Star Trek", "#080706", "#ffcc66"],
    appearance: ["Follow Appearance", "#26382d", "#a6c48a"],
  };
  const languages = {"en": "English", "fr": "Français", "nl": "Nederlands", "de": "Deutsch", "es": "Español", "tl": "Tagalog", "sv": "Svenska", "it": "Italiano", "pl": "Polski", "da": "Dansk", "nb": "Norsk bokmål"};
  // Translation columns follow the language selector order, excluding English.
  const translations = {
    "Use Home Assistant language": ["Utiliser la langue de Home Assistant", "Taal van Home Assistant gebruiken", "Sprache von Home Assistant verwenden", "Usar el idioma de Home Assistant", "Gamitin ang wika ng Home Assistant", "Använd språket i Home Assistant", "Usa la lingua di Home Assistant", "Użyj języka Home Assistant", "Brug sproget i Home Assistant", "Bruk språket i Home Assistant"],
    "Action failed. Check the entity and your permissions.": ["L'action a échoué. Vérifiez l'entité et vos autorisations.", "Actie mislukt. Controleer de entiteit en uw machtigingen.", "Aktion fehlgeschlagen. Überprüfen Sie die Entität und Ihre Berechtigungen.", "La acción falló. Verifique la entidad y sus permisos.", "Nabigo ang pagkilos. Suriin ang entity at ang iyong mga pahintulot.", "Åtgärden misslyckades. Kontrollera enheten och dina behörigheter.", "Azione fallita. Controlla l'entità e le tue autorizzazioni.", "Akcja nie powiodła się. Sprawdź podmiot i swoje uprawnienia.", "Handlingen mislykkedes. Tjek entiteten og dine tilladelser.", "Handlingen mislyktes. Sjekk enheten og tillatelsene dine."],
    "Action requested": ["Action demandée", "Actie gevraagd", "Aktion angefordert", "Acción solicitada", "Hiniling ang aksyon", "Åtgärd begärd", "Azione richiesta", "Zażądano działania", "Handling anmodet", "Handling forespurt"],
    "Activity history unavailable.": ["Historique d'activité indisponible.", "Activiteitengeschiedenis niet beschikbaar.", "Aktivitätsverlauf nicht verfügbar.", "Historial de actividad no disponible.", "Hindi available ang history ng aktibidad.", "Aktivitetshistoriken är inte tillgänglig.", "Cronologia attività non disponibile.", "Historia aktywności niedostępna.", "Aktivitetshistorikken er ikke tilgængelig.", "Aktivitetsloggen er utilgjengelig."],
    "Administrator access may be required.": ["Un accès administrateur peut être requis.", "Mogelijk is beheerderstoegang vereist.", "Möglicherweise ist Administratorzugriff erforderlich.", "Es posible que se requiera acceso de administrador.", "Maaaring kailanganin ang access ng administrator.", "Administratörsåtkomst kan krävas.", "Potrebbe essere necessario l'accesso come amministratore.", "Może być wymagany dostęp administratora.", "Administratoradgang kan være påkrævet.", "Administratortilgang kan være nødvendig."],
    "Ads blocked percentage": ["Pourcentage d'annonces bloquées", "Geblokkeerd percentage advertenties", "Prozentsatz der blockierten Anzeigen", "Porcentaje de anuncios bloqueados", "Porsiyento ng mga na-block na ad", "Annonsblockerad procentandel", "Percentuale di annunci bloccati", "Procent zablokowanych reklam", "Procentdel for blokerede annoncer", "Annonser blokkert prosentandel"],
    "Always show": ["Montre toujours", "Altijd laten zien", "Immer zeigen", "mostrar siempre", "Palaging ipakita", "Visa alltid", "Mostra sempre", "Zawsze pokazuj", "Vis altid", "Vis alltid"],
    "Assign a name": ["Attribuer un nom", "Wijs een naam toe", "Vergeben Sie einen Namen", "asignar un nombre", "Magtalaga ng pangalan", "Tilldela ett namn", "Assegna un nome", "Przypisz nazwę", "Tildel et navn", "Tildel et navn"],
    "Automatic": ["Automatique", "Automatisch", "Automatisch", "Automático", "Awtomatiko", "Automatisk", "Automatico", "Automatyczny", "Automatisk", "Automatisk"],
    "Changes the label shown on the dashboard. Configure scanning in Nmap Tracker.": ["Modifie l'étiquette affichée sur le tableau de bord. Configurez l'analyse dans Nmap Tracker.", "Wijzigt het label dat op het dashboard wordt weergegeven. Configureer scannen in Nmap Tracker.", "Ändert die auf dem Dashboard angezeigte Beschriftung. Konfigurieren Sie das Scannen in Nmap Tracker.", "Cambia la etiqueta que se muestra en el tablero. Configure el escaneo en Nmap Tracker.", "Binabago ang label na ipinapakita sa dashboard. I-configure ang pag-scan sa Nmap Tracker.", "Ändrar etiketten som visas på instrumentpanelen. Konfigurera skanning i Nmap Tracker.", "Cambia l'etichetta mostrata sul dashboard. Configura la scansione in Nmap Tracker.", "Zmienia etykietę wyświetlaną na pulpicie nawigacyjnym. Skonfiguruj skanowanie w Nmap Trackerze.", "Ændrer etiketten vist på dashboardet. Konfigurer scanning i Nmap Tracker.", "Endrer etiketten som vises på dashbordet. Konfigurer skanning i Nmap Tracker."],
    "Connected": ["Connecté", "Verbonden", "Verbunden", "Conectado", "Nakakonekta", "Ansluten", "Connesso", "Połączono", "Forbundet", "Tilkoblet"],
    "Connection speed and history": ["Vitesse de connexion et historique", "Verbindingssnelheid en geschiedenis", "Verbindungsgeschwindigkeit und -verlauf", "Velocidad e historial de conexión", "Bilis ng koneksyon at kasaysayan", "Anslutningshastighet och historik", "Velocità e cronologia della connessione", "Szybkość połączenia i historia", "Forbindelseshastighed og historie", "Tilkoblingshastighet og historikk"],
    "Connection summary": ["Résumé de la connexion", "Verbindingsoverzicht", "Verbindungszusammenfassung", "Resumen de conexión", "Buod ng koneksyon", "Sammanfattning av samband", "Riepilogo della connessione", "Podsumowanie połączenia", "Sammenfatning af forbindelse", "Sammendrag av forbindelse"],
    "Could not save dashboard settings.": ["Impossible d'enregistrer les paramètres du tableau de bord.", "Kan dashboardinstellingen niet opslaan.", "Die Dashboard-Einstellungen konnten nicht gespeichert werden.", "No se pudo guardar la configuración del panel.", "Hindi ma-save ang mga setting ng dashboard.", "Det gick inte att spara instrumentpanelens inställningar.", "Impossibile salvare le impostazioni del dashboard.", "Nie można zapisać ustawień panelu.", "Dashboardindstillingerne kunne ikke gemmes.", "Kunne ikke lagre dashbordinnstillinger."],
    "Could not save name.": ["Impossible d'enregistrer le nom.", "Kan naam niet opslaan.", "Name konnte nicht gespeichert werden.", "No se pudo guardar el nombre.", "Hindi ma-save ang pangalan.", "Det gick inte att spara namnet.", "Impossibile salvare il nome.", "Nie udało się zapisać nazwy.", "Navnet kunne ikke gemmes.", "Kunne ikke lagre navnet."],
    "Could not start tracking.": ["Impossible de démarrer le suivi.", "Kon het volgen niet starten.", "Die Verfolgung konnte nicht gestartet werden.", "No se pudo iniciar el seguimiento.", "Hindi masimulan ang pagsubaybay.", "Det gick inte att börja spåra.", "Impossibile avviare il monitoraggio.", "Nie można rozpocząć śledzenia.", "Kunne ikke starte sporing.", "Kunne ikke starte sporingen."],
    "Could not verify which devices are eligible for tracking.": ["Impossible de vérifier quels appareils sont éligibles au suivi.", "Kan niet verifiëren welke apparaten in aanmerking komen voor tracking.", "Es konnte nicht überprüft werden, welche Geräte für die Nachverfolgung geeignet sind.", "No se pudo verificar qué dispositivos son elegibles para el seguimiento.", "Hindi ma-verify kung aling mga device ang kwalipikado para sa pagsubaybay.", "Det gick inte att verifiera vilka enheter som är kvalificerade för spårning.", "Impossibile verificare quali dispositivi sono idonei per il monitoraggio.", "Nie można sprawdzić, które urządzenia kwalifikują się do śledzenia.", "Kunne ikke bekræfte, hvilke enheder der er kvalificerede til sporing.", "Kunne ikke bekrefte hvilke enheter som er kvalifisert for sporing."],
    "DNS and ad blocking": ["DNS et blocage des publicités", "DNS en advertentieblokkering", "DNS und Werbeblocker", "DNS y bloqueo de publicidad", "DNS at ad blocking", "DNS och annonsblockering", "DNS e blocco degli annunci", "Blokowanie DNS i reklam", "DNS og annonceblokering", "DNS og annonseblokkering"],
    "DNS and remote access": ["DNS et accès à distance", "DNS en externe toegang", "DNS und Fernzugriff", "DNS y acceso remoto", "DNS at malayuang pag-access", "DNS och fjärråtkomst", "DNS e accesso remoto", "DNS i dostęp zdalny", "DNS og fjernadgang", "DNS og ekstern tilgang"],
    "DNS pause script": ["Script de pause DNS", "DNS-pauzescript", "DNS-Pause-Skript", "Script de pausa DNS", "DNS pause script", "DNS-pausskript", "Script di pausa DNS", "Skrypt wstrzymania DNS", "DNS pause script", "DNS-pauseskript"],
    "DNS queries (statistics window)": ["Requêtes DNS (fenêtre de statistiques)", "DNS-query's (statistiekenvenster)", "DNS-Abfragen (Statistikfenster)", "Consultas DNS (ventana de estadísticas)", "Mga query sa DNS (window ng istatistika)", "DNS-frågor (statistikfönster)", "Query DNS (finestra delle statistiche)", "Zapytania DNS (okno statystyk)", "DNS-forespørgsler (statistikvindue)", "DNS-spørringer (statistikkvindu)"],
    "DNS query count": ["Nombre de requêtes DNS", "Aantal DNS-query's", "Anzahl der DNS-Abfragen", "Recuento de consultas DNS", "Bilang ng query sa DNS", "Antal DNS-förfrågningar", "Conteggio query DNS", "Liczba zapytań DNS", "Antal DNS-forespørgsler", "Antall DNS-søk"],
    "Dashboard heading": ["Titre du tableau de bord", "Dashboardkop", "Dashboard-Überschrift", "Encabezado del panel", "Heading ng dashboard", "Instrumentpanelens rubrik", "Intestazione del dashboard", "Nagłówek deski rozdzielczej", "Dashboard overskrift", "Dashboard overskrift"],
    "Dashboard settings are unavailable.": ["Les paramètres du tableau de bord ne sont pas disponibles.", "Dashboardinstellingen zijn niet beschikbaar.", "Dashboard-Einstellungen sind nicht verfügbar.", "La configuración del panel no está disponible.", "Hindi available ang mga setting ng dashboard.", "Inställningar för instrumentpanelen är inte tillgängliga.", "Le impostazioni della dashboard non sono disponibili.", "Ustawienia panelu są niedostępne.", "Dashboard-indstillinger er ikke tilgængelige.", "Dashboard-innstillingene er utilgjengelige."],
    "Defaults to 500 ms.": ["La valeur par défaut est 500 ms.", "Standaard ingesteld op 500 ms.", "Der Standardwert ist 500 ms.", "El valor predeterminado es 500 ms.", "Default sa 500 ms.", "Standard är 500 ms.", "Il valore predefinito è 500 ms.", "Domyślnie 500 ms.", "Standard er 500 ms.", "Standard er 500 ms."],
    "Device list could not be read.": ["La liste des appareils n'a pas pu être lue.", "Apparaatlijst kan niet worden gelezen.", "Geräteliste konnte nicht gelesen werden.", "No se pudo leer la lista de dispositivos.", "Hindi mabasa ang listahan ng device.", "Enhetslistan kunde inte läsas.", "Impossibile leggere l'elenco dei dispositivi.", "Nie można odczytać listy urządzeń.", "Enhedslisten kunne ikke læses.", "Enhetslisten kunne ikke leses."],
    "Device name": ["Nom de l'appareil", "Apparaatnaam", "Gerätename", "Nombre del dispositivo", "Pangalan ng device", "Enhetens namn", "Nome del dispositivo", "Nazwa urządzenia", "Enhedens navn", "Enhetsnavn"],
    "Disabled": ["Désactivé", "Uitgeschakeld", "Deaktiviert", "Discapacitado", "Hindi pinagana", "Inaktiverad", "Disabilitato", "Niepełnosprawny", "Deaktiveret", "Deaktivert"],
    "Disabled in Home Assistant": ["Désactivé dans Home Assistant", "Uitgeschakeld in Home Assistant", "Im Home Assistant deaktiviert", "Deshabilitado en Home Assistant", "Naka-disable sa Home Assistant", "Inaktiverad i Home Assistant", "Disabilitato in Home Assistant", "Wyłączone w Asystencie domowym", "Deaktiveret i Home Assistant", "Deaktivert i Home Assistant"],
    "Disconnected": ["Déconnecté", "Verbinding verbroken", "Nicht verbunden", "desconectado", "Nadiskonekta", "Frånkopplad", "Disconnesso", "Rozłączony", "Afbrudt", "Koblet fra"],
    "Disk free space": ["Espace libre sur le disque", "Schijfvrije ruimte", "Freier Speicherplatz auf der Festplatte", "Espacio libre en disco", "Libreng espasyo sa disk", "Diskfritt utrymme", "Spazio libero su disco", "Wolne miejsce na dysku", "Disk ledig plads", "Disk ledig plass"],
    "Download speed sensor": ["Télécharger le capteur de vitesse", "Snelheidssensor downloaden", "Geschwindigkeitssensor herunterladen", "Descargar sensor de velocidad", "I-download ang sensor ng bilis", "Ladda ner hastighetssensor", "Scarica sensore di velocità", "Pobierz czujnik prędkości", "Download hastighedssensor", "Last ned hastighetssensor"],
    "Enable Home Assistant restart": ["Activer le redémarrage de Home Assistant", "Schakel het opnieuw opstarten van Home Assistant in", "Aktivieren Sie den Neustart des Home Assistant", "Habilitar el reinicio de Home Assistant", "I-enable ang pag-restart ng Home Assistant", "Aktivera omstart av Home Assistant", "Abilita il riavvio di Home Assistant", "Włącz ponowne uruchamianie Home Assistant", "Aktiver genstart af Home Assistant", "Aktiver omstart av Home Assistant"],
    "Expired": ["Expiré", "Verlopen", "Abgelaufen", "Caducado", "Nag-expire na", "Utgått", "Scaduto", "Wygasło", "Udløbet", "Utløpt"],
    "Find an entity or control": ["Rechercher une entité ou un contrôle", "Zoek een entiteit of controle", "Suchen Sie eine Entität oder Kontrolle", "Encuentre una entidad o control", "Maghanap ng entity o kontrol", "Hitta en enhet eller kontroll", "Trova un'entità o un controllo", "Znajdź jednostkę lub kontrolkę", "Find en enhed eller kontrol", "Finn en enhet eller kontroll"],
    "Guest Wi-Fi switch": ["Commutateur Wi-Fi invité", "Wi-Fi-schakelaar voor gasten", "Gast-WLAN-Schalter", "Interruptor de Wi-Fi para invitados", "Pambisitang Wi-Fi switch", "Gäst Wi-Fi switch", "Interruttore Wi-Fi ospite", "Przełącznik Wi-Fi dla gości", "Gæste Wi-Fi switch", "Gjeste-Wi-Fi-bryter"],
    "Hide": ["Masquer", "Verbergen", "Verstecken", "Ocultar", "Magtago", "Göm", "Nasconditi", "Ukryj", "Skjul", "Skjul"],
    "Host reboot button or script": ["Bouton ou script de redémarrage de l'hôte", "Knop voor het opnieuw opstarten van de host of een script", "Schaltfläche oder Skript zum Neustart des Hosts", "Botón o secuencia de comandos de reinicio del host", "Button o script ng pag-reboot ng host", "Värd omstartsknapp eller skript", "Pulsante o script di riavvio dell'host", "Przycisk lub skrypt ponownego uruchomienia hosta", "Host-genstartsknap eller script", "Verts omstartsknapp eller skript"],
    "Ink and toner sensors": ["Capteurs d'encre et de toner", "Inkt- en tonersensoren", "Tinten- und Tonersensoren", "Sensores de tinta y tóner", "Mga sensor ng tinta at toner", "Bläck- och tonersensorer", "Sensori di inchiostro e toner", "Czujniki atramentu i tonera", "Blæk- og tonersensorer", "Blekk- og tonersensorer"],
    "Internet connection and router": ["Connexion Internet et routeur", "Internetverbinding en router", "Internetverbindung und Router", "Conexión a Internet y enrutador.", "Koneksyon sa internet at router", "Internetanslutning och router", "Connessione Internet e router", "Połączenie internetowe i router", "Internetforbindelse og router", "Internett-tilkobling og ruter"],
    "Internet gateway": ["Passerelle Internet", "Internet-gateway", "Internet-Gateway", "puerta de enlace a Internet", "gateway sa internet", "Internet-gateway", "Portale Internet", "Brama internetowa", "Internet gateway", "Internett-gateway"],
    "Last seen": ["Vu pour la dernière fois", "Laatst gezien", "Zuletzt gesehen", "visto por última vez", "Huling nakita", "Senast sett", "Visto l'ultima volta", "Ostatnio widziany", "Sidst set", "Sist sett"],
    "Last successful refresh": ["Dernière actualisation réussie", "Laatste succesvolle vernieuwing", "Letzte erfolgreiche Aktualisierung", "Última actualización exitosa", "Huling matagumpay na pag-refresh", "Senaste lyckade uppdateringen", "Ultimo aggiornamento riuscito", "Ostatnie udane odświeżenie", "Sidste vellykkede opdatering", "Siste vellykkede oppdatering"],
    "Latency chart limit": ["Limite du graphique de latence", "Limiet latentiediagram", "Latenzdiagrammlimit", "Límite del gráfico de latencia", "Limitasyon ng latency chart", "Gräns för latensdiagram", "Limite del grafico di latenza", "Limit wykresu opóźnień", "Latency diagram grænse", "Latensdiagramgrense"],
    "Latency sensor": ["Capteur de latence", "Latentiesensor", "Latenzsensor", "sensor de latencia", "Sensor ng latency", "Latenssensor", "Sensore di latenza", "Czujnik opóźnienia", "Latency sensor", "Latenssensor"],
    "Latest readings remain above. History retries every 5 minutes.": ["Les dernières lectures restent ci-dessus. L'historique réessaye toutes les 5 minutes.", "De laatste metingen blijven hierboven staan. De geschiedenis wordt elke 5 minuten opnieuw uitgevoerd.", "Die neuesten Messwerte bleiben oben. Der Verlauf wird alle 5 Minuten erneut ausgeführt.", "Las últimas lecturas se mantienen por encima. El historial vuelve a intentarlo cada 5 minutos.", "Ang mga pinakabagong pagbabasa ay nananatili sa itaas. Sinusubukang muli ang kasaysayan bawat 5 minuto.", "Senaste avläsningarna finns kvar ovan. Historiken försöker igen var 5:e minut.", "Le ultime letture rimangono sopra. La cronologia riprova ogni 5 minuti.", "Najnowsze odczyty pozostają powyżej. Historia jest powtarzana co 5 minut.", "Seneste aflæsninger forbliver ovenfor. Historien prøver igen hvert 5. minut.", "Siste målinger forblir ovenfor. Historien prøver på nytt hvert 5. minutt."],
    "Layout and privacy": ["Disposition et confidentialité", "Indeling en privacy", "Layout und Privatsphäre", "Diseño y privacidad", "Layout at privacy", "Layout och integritet", "Disposizione e privacy", "Układ i prywatność", "Layout og privatliv", "Layout og personvern"],
    "Leave blank for Network / control.": ["Laissez vide pour Réseau/Contrôle.", "Laat leeg voor Netwerk/controle.", "Lassen Sie das Feld „Netzwerk/Steuerung“ leer.", "Deje en blanco para Red/control.", "Iwanang blangko para sa Network / control.", "Lämna tomt för Nätverk / kontroll.", "Lasciare vuoto per Rete/controllo.", "Pozostaw puste dla Sieć/sterowanie.", "Lad stå tomt for netværk / kontrol.", "La stå tomt for Nettverk / kontroll."],
    "Leave blank for automatic discovery.": ["Laissez vide pour la découverte automatique.", "Laat dit leeg voor automatische detectie.", "Für die automatische Erkennung leer lassen.", "Déjelo en blanco para el descubrimiento automático.", "Iwanang blangko para sa awtomatikong pagtuklas.", "Lämna tomt för automatisk upptäckt.", "Lascia vuoto per il rilevamento automatico.", "Pozostaw puste, aby umożliwić automatyczne wykrywanie.", "Lad stå tomt for automatisk registrering.", "La stå tomt for automatisk oppdagelse."],
    "Leave blank to use Network Control’s built-in speed test sensor.": ["Laissez vide pour utiliser le capteur de test de vitesse intégré de Network Control.", "Laat dit veld leeg om de ingebouwde snelheidstestsensor van Network Control te gebruiken.", "Lassen Sie das Feld leer, um den integrierten Geschwindigkeitstestsensor von Network Control zu verwenden.", "Déjelo en blanco para utilizar el sensor de prueba de velocidad integrado de Network Control.", "Iwanang blangko para gamitin ang built-in na speed test sensor ng Network Control.", "Lämna tomt för att använda Network Controls inbyggda hastighetstestsensor.", "Lascia vuoto per utilizzare il sensore di test di velocità integrato di Network Control.", "Pozostaw puste, aby użyć wbudowanego czujnika testu prędkości Network Control.", "Lad stå tomt for at bruge Network Controls indbyggede hastighedstestsensor.", "La stå tomt for å bruke Network Controls innebygde hastighetstestsensor."],
    "Live": ["En direct", "Leef", "Lebe", "en vivo", "Mabuhay", "Live", "Vivi", "Na żywo", "Live", "Live"],
    "Loading activity history…": ["Chargement de l'historique des activités…", "Activiteitsgeschiedenis laden…", "Aktivitätsverlauf wird geladen…", "Cargando historial de actividad…", "Nilo-load ang history ng aktibidad...", "Laddar aktivitetshistorik...", "Caricamento cronologia attività…", "Ładowanie historii aktywności…", "Indlæser aktivitetshistorik...", "Laster inn aktivitetsloggen …"],
    "Loading devices…": ["Chargement des appareils…", "Apparaten laden…", "Geräte werden geladen…", "Cargando dispositivos…", "Nilo-load ang mga device...", "Laddar enheter...", "Caricamento dispositivi…", "Ładuję urządzenia…", "Indlæser enheder...", "Laster inn enheter …"],
    "Loading history…": ["Chargement de l'historique…", "Geschiedenis laden…", "Verlauf wird geladen…", "Cargando historial…", "Nilo-load ang history...", "Laddar historik...", "Caricamento cronologia…", "Ładowanie historii…", "Indlæser historik...", "Laster inn loggen …"],
    "Name cleared": ["Nom effacé", "Naam gewist", "Name gelöscht", "Nombre borrado", "Na-clear ang pangalan", "Namnet har rensats", "Nome cancellato", "Imię zostało usunięte", "Navn slettet", "Navnet slettet"],
    "Name saved": ["Nom enregistré", "Naam opgeslagen", "Name gespeichert", "Nombre guardado", "Na-save ang pangalan", "Namnet har sparats", "Nome salvato", "Nazwa została zapisana", "Navn gemt", "Navnet er lagret"],
    "Name this device": ["Nommez cet appareil", "Geef dit apparaat een naam", "Benennen Sie dieses Gerät", "Nombra este dispositivo", "Pangalanan ang device na ito", "Namnge den här enheten", "Assegna un nome a questo dispositivo", "Nazwij to urządzenie", "Navngiv denne enhed", "Gi denne enheten et navn"],
    "Network Control settings": ["Paramètres de contrôle du réseau", "Netwerkcontrole-instellingen", "Netzwerksteuerungseinstellungen", "Configuración de control de red", "Mga setting ng Network Control", "Inställningar för nätverkskontroll", "Impostazioni di controllo della rete", "Ustawienia kontroli sieci", "Indstillinger for netværkskontrol", "Innstillinger for nettverkskontroll"],
    "No Nmap Tracker devices yet. Add Nmap Tracker to populate this panel.": ["Aucun appareil Nmap Tracker pour l’instant. Ajoutez Nmap Tracker pour remplir ce panneau.", "Nog geen Nmap Tracker-apparaten. Voeg Nmap Tracker toe om dit paneel te vullen.", "Noch keine Nmap Tracker-Geräte. Fügen Sie Nmap Tracker hinzu, um dieses Panel zu füllen.", "Aún no hay dispositivos Nmap Tracker. Agregue Nmap Tracker para completar este panel.", "Wala pang Nmap Tracker device. Magdagdag ng Nmap Tracker para punan ang panel na ito.", "Inga Nmap Tracker-enheter än. Lägg till Nmap Tracker för att fylla den här panelen.", "Nessun dispositivo Nmap Tracker ancora. Aggiungi Nmap Tracker per popolare questo pannello.", "Nie ma jeszcze urządzeń Nmap Tracker. Dodaj moduł śledzący Nmap, aby wypełnić ten panel.", "Ingen Nmap Tracker-enheder endnu. Tilføj Nmap Tracker for at udfylde dette panel.", "Ingen Nmap Tracker-enheter ennå. Legg til Nmap Tracker for å fylle ut dette panelet."],
    "No matches": ["Aucune correspondance", "Geen overeenkomsten", "Keine Übereinstimmungen", "No hay coincidencias", "Walang tugma", "Inga matchningar", "Nessuna corrispondenza", "Brak dopasowań", "Ingen kampe", "Ingen treff"],
    "No network controls configured": ["Aucun contrôle réseau configuré", "Geen netwerkcontroles geconfigureerd", "Keine Netzwerkkontrollen konfiguriert", "No hay controles de red configurados", "Walang mga kontrol sa network na na-configure", "Inga nätverkskontroller har konfigurerats", "Nessun controllo di rete configurato", "Nie skonfigurowano kontroli sieci", "Ingen netværkskontroller konfigureret", "Ingen nettverkskontroller er konfigurert"],
    "No new devices to track": ["Aucun nouvel appareil à suivre", "Geen nieuwe apparaten om te volgen", "Keine neuen Geräte zum Verfolgen", "No hay nuevos dispositivos para rastrear", "Walang bagong device na susubaybayan", "Inga nya enheter att spåra", "Nessun nuovo dispositivo da monitorare", "Brak nowych urządzeń do śledzenia", "Ingen nye enheder at spore", "Ingen nye enheter å spore"],
    "Offline": ["Hors ligne", "Offline", "Offline", "Sin conexión", "Offline", "Offline", "Non in linea", "Nieaktywny", "Offline", "Frakoblet"],
    "Pending": ["En attente", "In behandeling", "Ausstehend", "Pendiente", "Nakabinbin", "Väntar", "In sospeso", "Oczekujące", "Afventer", "Venter"],
    "Personal devices and readings": ["Appareils personnels et lectures", "Persoonlijke apparaten en metingen", "Persönliche Geräte und Messwerte", "Dispositivos personales y lecturas.", "Mga personal na device at pagbabasa", "Personliga enheter och avläsningar", "Dispositivi personali e letture", "Urządzenia osobiste i odczyty", "Personlige enheder og aflæsninger", "Personlige enheter og avlesninger"],
    "Personal devices, printers and scanner": ["Appareils personnels, imprimantes et scanner", "Persoonlijke apparaten, printers en scanner", "Persönliche Geräte, Drucker und Scanner", "Dispositivos personales, impresoras y escáner.", "Mga personal na device, printer at scanner", "Personliga enheter, skrivare och skanner", "Dispositivi personali, stampanti e scanner", "Urządzenia osobiste, drukarki i skaner", "Personlige enheder, printere og scanner", "Personlige enheter, skrivere og skanner"],
    "Pi-hole blocking switch": ["Interrupteur de blocage Pi-hole", "Pi-hole blokkeerschakelaar", "Pi-Hole-Blockierungsschalter", "Interruptor de bloqueo de orificio Pi", "Pi-hole blocking switch", "Pi-hole blocking switch", "Interruttore di blocco pi-hole", "Przełącznik blokujący otwór Pi", "Pi-hul blokeringsafbryder", "Pi-hull blokkeringsbryter"],
    "Primary Ops": ["Opérations principales", "Primaire operaties", "Primäre Operationen", "Operaciones primarias", "Pangunahing Ops", "Primary Ops", "Operazioni primarie", "Podstawowe operacje", "Primær Ops", "Primær Ops"],
    "Printer supplies": ["Consommables pour imprimante", "Printerbenodigdheden", "Druckerzubehör", "Suministros de impresora", "Mga supply ng printer", "Tillbehör till skrivare", "Forniture per stampanti", "Materiały eksploatacyjne do drukarek", "Printer forsyninger", "Skriverrekvisita"],
    "Private Wi-Fi address": ["Adresse Wi-Fi privée", "Privé wifi-adres", "Private WLAN-Adresse", "Dirección wifi privada", "Pribadong Wi-Fi address", "Privat Wi-Fi-adress", "Indirizzo Wi-Fi privato", "Prywatny adres Wi-Fi", "Privat Wi-Fi-adresse", "Privat Wi-Fi-adresse"],
    "Recorded download, upload and latency over 24 hours": ["Téléchargement, téléversement et latence enregistrés sur 24 heures", "Opgenomen download, upload en latentie gedurende 24 uur", "Aufgezeichneter Download, Upload und Latenz über 24 Stunden", "Descarga, carga y latencia grabadas durante 24 horas", "Naitala ang pag-download, pag-upload at latency sa loob ng 24 na oras", "Inspelad nedladdning, uppladdning och latens över 24 timmar", "Download, caricamento e latenza registrati nell'arco di 24 ore", "Nagrane pobieranie, przesyłanie i opóźnienie w ciągu 24 godzin", "Optaget download, upload og forsinkelse over 24 timer", "Registrert nedlasting, opplasting og ventetid over 24 timer"],
    "Recorded speed tests · Mbps left / ms right": ["Tests de vitesse enregistrés · Mbps gauche / ms droite", "Opgenomen snelheidstests · Mbps links / ms rechts", "Aufgezeichnete Geschwindigkeitstests · Mbit/s links / ms rechts", "Pruebas de velocidad grabadas · Mbps izquierda / ms derecha", "Naitala na mga pagsubok sa bilis · Mbps kaliwa / ms kanan", "Inspelade hastighetstester · Mbps vänster / ms höger", "Test di velocità registrati · Mbps sinistro/ms destro", "Nagrane testy prędkości · Mb/s w lewo / ms w prawo", "Optagede hastighedstests · Mbps venstre / ms højre", "Registrerte hastighetstester · Mbps venstre / ms høyre"],
    "Remote access and SSL": ["Accès à distance et SSL", "Toegang op afstand en SSL", "Fernzugriff und SSL", "Acceso remoto y SSL", "Malayong pag-access at SSL", "Fjärråtkomst och SSL", "Accesso remoto e SSL", "Zdalny dostęp i SSL", "Fjernadgang og SSL", "Fjerntilgang og SSL"],
    "Remote access or VPN status": ["Accès à distance ou statut VPN", "Toegang op afstand of VPN-status", "Fernzugriff oder VPN-Status", "Acceso remoto o estado de VPN", "Malayong pag-access o katayuan ng VPN", "Fjärråtkomst eller VPN-status", "Accesso remoto o stato VPN", "Dostęp zdalny lub status VPN", "Fjernadgang eller VPN-status", "Fjerntilgang eller VPN-status"],
    "Router display name": ["Nom d'affichage du routeur", "Weergavenaam van router", "Anzeigename des Routers", "Nombre para mostrar del enrutador", "Router display name", "Routerns visningsnamn", "Nome visualizzato del router", "Wyświetlana nazwa routera", "Routerens visningsnavn", "Ruterens visningsnavn"],
    "Router entity": ["Entité routeur", "Routerentiteit", "Router-Entität", "entidad enrutadora", "Router entity", "Routerenhet", "Entità router", "Jednostka routera", "Router enhed", "Ruterenhet"],
    "Router reboot button or script": ["Bouton ou script de redémarrage du routeur", "Router herstartknop of script", "Schaltfläche oder Skript zum Neustart des Routers", "Botón o secuencia de comandos de reinicio del enrutador", "Button o script sa pag-reboot ng router", "Omstartknapp eller skript för routern", "Pulsante o script di riavvio del router", "Przycisk lub skrypt ponownego uruchomienia routera", "Router genstart knap eller script", "Omstartknapp eller skript for ruteren"],
    "Run speed test button or script": ["Exécuter un bouton ou un script de test de vitesse", "Voer de snelheidstestknop of het script uit", "Führen Sie die Schaltfläche oder das Skript für den Geschwindigkeitstest aus", "Ejecutar botón o script de prueba de velocidad", "Patakbuhin ang speed test button o script", "Kör hastighetstestknapp eller skript", "Esegui il pulsante o lo script del test di velocità", "Uruchom przycisk lub skrypt testu szybkości", "Kør hastighedstestknap eller script", "Kjør hastighetstestknapp eller skript"],
    "SSL certificate expiry": ["Expiration du certificat SSL", "SSL-certificaat verlopen", "Ablauf des SSL-Zertifikats", "Caducidad del certificado SSL", "Pag-expire ng SSL certificate", "SSL-certifikatet löper ut", "Scadenza del certificato SSL", "Wygaśnięcie certyfikatu SSL", "SSL-certifikat udløber", "SSL-sertifikat utløper"],
    "Saving to dashboard…": ["Enregistrement dans le tableau de bord…", "Opslaan op dashboard…", "Im Dashboard speichern…", "Guardando en el panel...", "Sine-save sa dashboard…", "Sparar till instrumentpanelen...", "Salvataggio nel dashboard…", "Zapisuję w panelu…", "Gemmer på betjeningspanelet...", "Lagrer til oversikten …"],
    "Scanner label": ["Etiquette du scanner", "Scannerlabel", "Scanneretikett", "Etiqueta del escáner", "Label ng scanner", "Skanneretikett", "Etichetta dello scanner", "Etykieta skanera", "Scanner etiket", "Skanneretikett"],
    "Show device MAC addresses": ["Afficher les adresses MAC des appareils", "MAC-adressen van apparaten weergeven", "Geräte-MAC-Adressen anzeigen", "Mostrar direcciones MAC del dispositivo", "Ipakita ang mga MAC address ng device", "Visa enhetens MAC-adresser", "Mostra gli indirizzi MAC del dispositivo", "Pokaż adresy MAC urządzeń", "Vis enhedens MAC-adresser", "Vis enhetens MAC-adresser"],
    "Show public WAN address": ["Afficher l'adresse WAN publique", "Toon openbaar WAN-adres", "Öffentliche WAN-Adresse anzeigen", "Mostrar dirección WAN pública", "Ipakita ang pampublikong WAN address", "Visa offentlig WAN-adress", "Mostra l'indirizzo WAN pubblico", "Pokaż publiczny adres WAN", "Vis offentlig WAN-adresse", "Vis offentlig WAN-adresse"],
    "The dashboard changed. Close this window and try again.": ["Le tableau de bord a changé. Fermez cette fenêtre et réessayez.", "Het dashboard is veranderd. Sluit dit venster en probeer het opnieuw.", "Das Dashboard hat sich geändert. Schließen Sie dieses Fenster und versuchen Sie es erneut.", "El tablero cambió. Cierra esta ventana y vuelve a intentarlo.", "Nagbago ang dashboard. Isara ang window na ito at subukang muli.", "Instrumentpanelen ändrades. Stäng det här fönstret och försök igen.", "Il cruscotto è cambiato. Chiudi questa finestra e riprova.", "Deska rozdzielcza uległa zmianie. Zamknij to okno i spróbuj ponownie.", "Dashboardet blev ændret. Luk dette vindue og prøv igen.", "Dashbordet endret seg. Lukk dette vinduet og prøv igjen."],
    "Tracking starts in about 30 seconds": ["Le suivi commence dans environ 30 secondes", "Het volgen begint over ongeveer 30 seconden", "Die Verfolgung beginnt in etwa 30 Sekunden", "El seguimiento comienza en unos 30 segundos.", "Magsisimula ang pagsubaybay sa humigit-kumulang 30 segundo", "Spårningen startar om cirka 30 sekunder", "Il monitoraggio inizia tra circa 30 secondi", "Śledzenie rozpoczyna się za około 30 sekund", "Sporing starter om cirka 30 sekunder", "Sporing starter om omtrent 30 sekunder"],
    "Unknown": ["Inconnu", "Onbekend", "Unbekannt", "Desconocido", "Hindi alam", "Okänd", "Sconosciuto", "Nieznany", "Ukendt", "Ukjent"],
    "Unknown maker": ["Fabricant inconnu", "Onbekende maker", "Unbekannter Hersteller", "Fabricante desconocido", "Hindi kilalang gumawa", "Okänd tillverkare", "Produttore sconosciuto", "Nieznany twórca", "Ukendt producent", "Ukjent produsent"],
    "Upload speed sensor": ["Capteur de vitesse de téléchargement", "Snelheidssensor uploaden", "Geschwindigkeitssensor hochladen", "Subir sensor de velocidad", "Mag-upload ng sensor ng bilis", "Ladda upp hastighetssensor", "Carica il sensore di velocità", "Prześlij czujnik prędkości", "Upload hastighedssensor", "Last opp hastighetssensor"],
    "Valid until": ["Valable jusqu'au", "Geldig tot", "Gültig bis", "Válido hasta", "May bisa hanggang", "Gäller till kl", "Valido fino al", "Ważne do", "Gælder indtil kl", "Gyldig til kl"],
    "WAN address sensor": ["Capteur d'adresse WAN", "WAN-adressensor", "WAN-Adresssensor", "sensor de dirección WAN", "Sensor ng address ng WAN", "WAN-adresssensor", "Sensore di indirizzo WAN", "Czujnik adresu WAN", "WAN adresse sensor", "WAN-adressesensor"],
    "Wake-on-LAN buttons, switches or scripts": ["Boutons, commutateurs ou scripts Wake-on-LAN", "Wake-on-LAN-knoppen, schakelaars of scripts", "Wake-on-LAN-Tasten, Schalter oder Skripte", "Botones, interruptores o scripts de Wake-on-LAN", "Mga wake-on-LAN na button, switch o script", "Wake-on-LAN-knappar, switchar eller skript", "Pulsanti, interruttori o script di riattivazione LAN", "Przyciski, przełączniki lub skrypty Wake-on-LAN", "Wake-on-LAN knapper, switche eller scripts", "Wake-on-LAN-knapper, brytere eller skript"],
    "When unset, the section uses Automatic or keeps a previous hide setting.": ["Lorsqu'elle n'est pas définie, la section utilise Automatique ou conserve un paramètre de masquage précédent.", "Indien niet ingesteld, gebruikt de sectie Automatisch of behoudt een eerdere verberginstelling.", "Wenn die Option deaktiviert ist, verwendet der Abschnitt „Automatisch“ oder behält eine vorherige Einstellung zum Ausblenden bei.", "Cuando no está configurada, la sección usa Automático o mantiene una configuración de ocultación anterior.", "Kapag na-unset, ang seksyon ay gumagamit ng Awtomatiko o nagpapanatili ng nakaraang setting ng pagtatago.", "När den inte är inställd använder sektionen Automatisk eller behåller en tidigare göminställning.", "Quando non è impostata, la sezione utilizza Automatico o mantiene un'impostazione Nascondi precedente.", "Gdy nie jest ustawiona, sekcja korzysta z opcji Automatycznej lub zachowuje poprzednie ustawienie ukrywania.", "Når de er deaktiveret, bruger sektionen Automatisk eller beholder en tidligere skjult indstilling.", "Når den er deaktivert, bruker delen Automatisk eller beholder en tidligere skjulinnstilling."],
    "just now": ["tout à l' heure", "zojuist", "soeben", "En este momento", "ngayon lang", "just nu", "proprio adesso", "właśnie", "lige nu", "akkurat nå"],
    "Speed test schedule unavailable.": ["Planification des tests indisponible.", "Testplanning niet beschikbaar.", "Testzeitplan nicht verfügbar.", "Programación de pruebas no disponible.", "Hindi makuha ang iskedyul ng pagsubok.", "Testschema saknas.", "Programmazione test non disponibile.", "Harmonogram testów niedostępny.", "Testplan ikke tilgængelig.", "Testplan utilgjengelig."],
    "Could not save. Reopen Settings to try again.": ["Échec de l’enregistrement. Rouvrez les paramètres.", "Opslaan mislukt. Open de instellingen opnieuw.", "Speichern fehlgeschlagen. Einstellungen erneut öffnen.", "No se pudo guardar. Vuelve a abrir Ajustes.", "Hindi na-save. Buksang muli ang mga setting.", "Kunde inte spara. Öppna inställningarna igen.", "Salvataggio non riuscito. Riapri le impostazioni.", "Nie udało się zapisać. Otwórz ustawienia ponownie.", "Kunne ikke gemme. Åbn indstillinger igen.", "Kunne ikke lagre. Åpne innstillingene igjen."],
    "Reboot host": ["Redémarrer le serveur", "Host herstarten", "Host neu starten", "Reiniciar servidor", "I-restart ang host", "Starta om värden", "Riavvia host", "Uruchom ponownie hosta", "Genstart vært", "Start verten på nytt"],
    "Pause blocking for 5 minutes": ["Suspendre le blocage pendant 5 minutes", "Blokkering 5 minuten pauzeren", "Blockierung 5 Minuten pausieren", "Pausar bloqueo durante 5 minutos", "Ihinto ang pagharang nang 5 minuto", "Pausa blockering i 5 minuter", "Sospendi il blocco per 5 minuti", "Wstrzymaj blokowanie na 5 minut", "Sæt blokering på pause i 5 minutter", "Sett blokkering på pause i 5 minutter"],
    "Wake device": ["Réveiller l’appareil", "Apparaat wekken", "Gerät aufwecken", "Activar dispositivo", "Gisingin ang aparato", "Väck enhet", "Riattiva dispositivo", "Wybudź urządzenie", "Væk enhed", "Vekk enhet"],
    "Select summary": ["Sélectionner le résumé", "Overzicht selecteren", "Übersicht auswählen", "Seleccionar resumen", "Piliin ang buod", "Markera sammanfattning", "Seleziona riepilogo", "Zaznacz podsumowanie", "Vælg oversigt", "Velg sammendrag"],
    "History unavailable": ["Historique indisponible", "Geschiedenis niet beschikbaar", "Verlauf nicht verfügbar", "Historial no disponible", "Walang makuhang kasaysayan", "Historik saknas", "Cronologia non disponibile", "Historia niedostępna", "Historik ikke tilgængelig", "Historikk utilgjengelig"],
    "Follow Appearance": ["Suivre l’apparence", "Uiterlijk volgen", "Darstellung übernehmen", "Seguir apariencia", "Sundin ang hitsura", "Följ utseende", "Segui aspetto", "Użyj ustawień wyglądu", "Følg udseende", "Følg utseende"],
    "Joined": ["Connecté", "Verbonden", "Verbunden", "Conectado", "Kumonekta", "Ansluten", "Connesso", "Połączono", "Tilsluttet", "Tilkoblet"],
    "Dropped": ["Déconnecté", "Verbinding verbroken", "Getrennt", "Desconectado", "Nadiskonekta", "Frånkopplad", "Disconnesso", "Rozłączono", "Afbrudt", "Frakoblet"],
    "No devices joined or dropped off in the last 24 hours.": ["Aucune connexion ou déconnexion depuis 24 h.", "Geen apparaten verbonden of verbroken in de afgelopen 24 uur.", "Keine Gerätewechsel in den letzten 24 Stunden.", "Ningún dispositivo se conectó o desconectó en las últimas 24 horas.", "Walang aparatong kumonekta o nadiskonekta sa huling 24 oras.", "Inga enheter anslöts eller kopplades från under de senaste 24 timmarna.", "Nessun dispositivo connesso o disconnesso nelle ultime 24 ore.", "Żadne urządzenie nie połączyło się ani nie rozłączyło w ciągu ostatniej doby.", "Ingen enheder blev tilsluttet eller afbrudt de seneste 24 timer.", "Ingen enheter ble tilkoblet eller frakoblet de siste 24 timene."],
    "DNS queries": ["Requêtes DNS", "DNS-verzoeken", "DNS-Anfragen", "Consultas DNS", "Mga kahilingang DNS", "DNS-frågor", "Richieste DNS", "Zapytania DNS", "DNS-forespørgsler", "DNS-forespørsler"],
    "Ads blocked": ["Publicités bloquées", "Geblokkeerde advertenties", "Blockierte Werbung", "Anuncios bloqueados", "Mga naharang na ad", "Blockerade annonser", "Annunci bloccati", "Zablokowane reklamy", "Blokerede annoncer", "Blokkerte annonser"],
    "Remote access": ["Accès distant", "Externe toegang", "Fernzugriff", "Acceso remoto", "Malayuang access", "Fjärråtkomst", "Accesso remoto", "Dostęp zdalny", "Fjernadgang", "Fjerntilgang"],
    "SSL certificate": ["Certificat SSL", "SSL-certificaat", "SSL-Zertifikat", "Certificado SSL", "Sertipiko ng SSL", "SSL-certifikat", "Certificato SSL", "Certyfikat SSL", "SSL-certifikat", "SSL-sertifikat"],
    "Tracked devices": ["Appareils suivis", "Gevolgde apparaten", "Verfolgte Geräte", "Dispositivos seguidos", "Mga sinusubaybayang aparato", "Spårade enheter", "Dispositivi monitorati", "Śledzone urządzenia", "Sporede enheder", "Sporede enheter"],
    "Last sweep": ["Dernière analyse", "Laatste scan", "Letzter Scan", "Último escaneo", "Huling pag-scan", "Senaste skanning", "Ultima scansione", "Ostatni skan", "Seneste scanning", "Siste skanning"],
    "New devices awaiting tracking": ["Nouveaux appareils à suivre", "Nieuwe apparaten om te volgen", "Neue Geräte zur Verfolgung", "Dispositivos nuevos sin seguimiento", "Mga bagong aparato na hindi pa sinusubaybayan", "Nya enheter att spåra", "Nuovi dispositivi da monitorare", "Nowe urządzenia do śledzenia", "Nye enheder til sporing", "Nye enheter å spore"],
    "suggested": ["suggéré", "voorgesteld", "vorgeschlagen", "sugerido", "iminungkahi", "föreslagen", "suggerito", "sugerowane", "foreslået", "foreslått"],
    "Not tracked": ["Non suivi", "Niet gevolgd", "Nicht verfolgt", "Sin seguimiento", "Hindi sinusubaybayan", "Spåras inte", "Non monitorato", "Nieśledzone", "Ikke sporet", "Ikke sporet"],
    "Interval saved.": ["Intervalle enregistré.", "Interval opgeslagen.", "Intervall gespeichert.", "Intervalo guardado.", "Na-save ang agwat.", "Intervallet sparat.", "Intervallo salvato.", "Zapisano odstęp.", "Interval gemt.", "Intervall lagret."],
    "Saving…": ["Enregistrement…", "Opslaan…", "Wird gespeichert…", "Guardando…", "Sine-save…", "Sparar…", "Salvataggio…", "Zapisywanie…", "Gemmer…", "Lagrer…"],
    "Loading interval…": ["Chargement de l’intervalle…", "Interval laden…", "Intervall wird geladen…", "Cargando intervalo…", "Nilo-load ang agwat…", "Läser in intervall…", "Caricamento intervallo…", "Wczytywanie odstępu…", "Indlæser interval…", "Laster intervall…"],
    "Manage personal devices": ["Gérer les appareils personnels", "Persoonlijke apparaten beheren", "Persönliche Geräte verwalten", "Gestionar dispositivos personales", "Pamahalaan ang mga personal na aparato", "Hantera personliga enheter", "Gestisci dispositivi personali", "Zarządzaj urządzeniami osobistymi", "Administrer personlige enheder", "Administrer personlige enheter"],
    "Manage network controls": ["Gérer les commandes réseau", "Netwerkbediening beheren", "Netzwerksteuerung verwalten", "Gestionar controles de red", "Pamahalaan ang mga kontrol ng network", "Hantera nätverkskontroller", "Gestisci controlli di rete", "Zarządzaj sterowaniem siecią", "Administrer netværksstyring", "Administrer nettverkskontroller"],
    "Search names or entity IDs": ["Rechercher un nom ou un ID d’entité", "Zoek namen of entiteits-ID’s", "Namen oder Entitäts-IDs suchen", "Buscar nombres o ID de entidades", "Maghanap ng pangalan o entity ID", "Sök namn eller entitets-ID", "Cerca nomi o ID entità", "Szukaj nazw lub identyfikatorów encji", "Søg navne eller entitets-id’er", "Søk etter navn eller entitets-ID-er"],
    "Recorded speed tests · Mbps left / ms right · Latency above {cap} ms omitted": ["Tests enregistrés · Mbit/s à gauche / ms à droite · Latences supérieures à {cap} ms exclues", "Opgeslagen tests · Mbps links / ms rechts · Latentie boven {cap} ms weggelaten", "Gespeicherte Tests · Mbit/s links / ms rechts · Latenz über {cap} ms ausgeblendet", "Pruebas registradas · Mbps a la izquierda / ms a la derecha · Se omite la latencia superior a {cap} ms", "Mga naitalang pagsubok · Mbps sa kaliwa / ms sa kanan · Hindi kasama ang lampas {cap} ms", "Sparade tester · Mbit/s till vänster / ms till höger · Latens över {cap} ms utelämnas", "Test registrati · Mbps a sinistra / ms a destra · Latenza oltre {cap} ms esclusa", "Zapisane testy · Mb/s po lewej / ms po prawej · Pominięto opóźnienia powyżej {cap} ms", "Gemte test · Mbit/s til venstre / ms til højre · Latenstid over {cap} ms udeladt", "Lagrede tester · Mbit/s til venstre / ms til høyre · Forsinkelse over {cap} ms utelatt"],
    "No devices match this filter.": ["Aucun appareil correspondant.", "Geen overeenkomende apparaten.", "Keine passenden Geräte.", "Ningún dispositivo coincide.", "Walang tumutugmang aparato.", "Inga enheter matchar.", "Nessun dispositivo corrispondente.", "Brak pasujących urządzeń.", "Ingen enheder matcher.", "Ingen samsvarende enheter."],
    "No new devices awaiting tracking.": ["Aucun nouvel appareil à suivre.", "Geen nieuwe apparaten om te volgen.", "Keine neuen Geräte zur Verfolgung.", "No hay dispositivos nuevos sin seguimiento.", "Walang bagong aparatong susubaybayan.", "Inga nya enheter att spåra.", "Nessun nuovo dispositivo da monitorare.", "Brak nowych urządzeń do śledzenia.", "Ingen nye enheder til sporing.", "Ingen nye enheter å spore."],
    "Reboot router": ["Redémarrer le routeur", "Router herstarten", "Router neu starten", "Reiniciar router", "I-restart ang router", "Starta om routern", "Riavvia router", "Uruchom ponownie router", "Genstart router", "Start ruteren på nytt"],
    "Toggle guest Wi-Fi": ["Activer/désactiver le Wi-Fi invité", "Gastwifi omschakelen", "Gast-WLAN umschalten", "Alternar Wi-Fi de invitados", "I-toggle ang Wi-Fi ng bisita", "Växla gäst-Wi-Fi", "Attiva/disattiva Wi-Fi ospiti", "Przełącz Wi-Fi dla gości", "Skift gæste-wifi", "Bytt gjeste-Wi-Fi"],
    "Settings": ["Paramètres", "Instellingen", "Einstellungen", "Ajustes", "Mga setting", "Inställningar", "Impostazioni", "Ustawienia", "Indstillinger", "Innstillinger"],
    "Language": ["Langue", "Taal", "Sprache", "Idioma", "Wika", "Språk", "Lingua", "Język", "Sprog", "Språk"],
    "Theme": ["Thème", "Thema", "Design", "Tema", "Tema", "Tema", "Tema", "Motyw", "Tema", "Tema"],
    "Close": ["Fermer", "Sluiten", "Schließen", "Cerrar", "Isara", "Stäng", "Chiudi", "Zamknij", "Luk", "Lukk"],
    "Download": ["Débit descendant", "Download", "Download", "Descarga", "Download", "Nedladdning", "Download", "Pobieranie", "Download", "Nedlasting"],
    "Upload": ["Débit montant", "Upload", "Upload", "Subida", "Upload", "Uppladdning", "Upload", "Wysyłanie", "Upload", "Opplasting"],
    "Latency": ["Latence", "Latentie", "Latenz", "Latencia", "Latensiya", "Latens", "Latenza", "Opóźnienie", "Latenstid", "Forsinkelse"],
    "Connection history": ["Historique de connexion", "Verbindingsgeschiedenis", "Verbindungsverlauf", "Historial de conexión", "Kasaysayan ng koneksyon", "Anslutningshistorik", "Cronologia connessione", "Historia połączenia", "Forbindelseshistorik", "Tilkoblingshistorikk"],
    "LAST 24 HOURS": ["24 DERNIÈRES HEURES", "AFGELOPEN 24 UUR", "LETZTE 24 STUNDEN", "ÚLTIMAS 24 HORAS", "HULING 24 ORAS", "SENASTE 24 TIMMARNA", "ULTIME 24 ORE", "OSTATNIE 24 GODZINY", "SENESTE 24 TIMER", "SISTE 24 TIMER"],
    "24-hour history": ["Historique sur 24 h", "Geschiedenis (24 uur)", "24-Stunden-Verlauf", "Historial de 24 h", "Kasaysayan ng 24 oras", "Historik för 24 timmar", "Cronologia di 24 ore", "Historia z 24 godzin", "Historik for 24 timer", "Historikk for 24 timer"],
    "Personal devices": ["Appareils personnels", "Persoonlijke apparaten", "Persönliche Geräte", "Dispositivos personales", "Mga personal na aparato", "Personliga enheter", "Dispositivi personali", "Urządzenia osobiste", "Personlige enheder", "Personlige enheter"],
    "Network scanner": ["Analyseur réseau", "Netwerkscanner", "Netzwerkscanner", "Escáner de red", "Scanner ng network", "Nätverksskanner", "Scanner di rete", "Skaner sieci", "Netværksscanner", "Nettverksskanner"],
    "Host health": ["État du serveur", "Hoststatus", "Hostzustand", "Estado del servidor", "Kalagayan ng host", "Värdstatus", "Stato del sistema", "Stan hosta", "Værtsstatus", "Vertsstatus"],
    "Telemetry": ["Télémétrie", "Telemetrie", "Telemetrie", "Telemetría", "Telemetriya", "Telemetri", "Telemetria", "Telemetria", "Telemetri", "Telemetri"],
    "Network controls": ["Commandes réseau", "Netwerkbediening", "Netzwerksteuerung", "Controles de red", "Mga kontrol ng network", "Nätverkskontroller", "Controlli di rete", "Sterowanie siecią", "Netværksstyring", "Nettverkskontroller"],
    "Manage": ["Gérer", "Beheren", "Verwalten", "Gestionar", "Pamahalaan", "Hantera", "Gestisci", "Zarządzaj", "Administrer", "Administrer"],
    "Devices": ["Appareils", "Apparaten", "Geräte", "Dispositivos", "Mga aparato", "Enheter", "Dispositivi", "Urządzenia", "Enheder", "Enheter"],
    "Activity": ["Activité", "Activiteit", "Aktivität", "Actividad", "Aktibidad", "Aktivitet", "Attività", "Aktywność", "Aktivitet", "Aktivitet"],
    "New devices": ["Nouveaux appareils", "Nieuwe apparaten", "Neue Geräte", "Dispositivos nuevos", "Mga bagong aparato", "Nya enheter", "Nuovi dispositivi", "Nowe urządzenia", "Nye enheder", "Nye enheter"],
    "Online": ["En ligne", "Online", "Online", "En línea", "Online", "Anslutna", "Online", "Online", "Online", "Tilkoblet"],
    "Dropped off": ["Déconnectés", "Verbinding verbroken", "Getrennt", "Desconectados", "Nadiskonekta", "Frånkopplade", "Disconnessi", "Rozłączone", "Afbrudt", "Frakoblet"],
    "Unnamed": ["Sans nom", "Naamloos", "Unbenannt", "Sin nombre", "Walang pangalan", "Namnlösa", "Senza nome", "Bez nazwy", "Unavngivne", "Uten navn"],
    "Filter devices": ["Filtrer les appareils", "Apparaten filteren", "Geräte filtern", "Filtrar dispositivos", "Salain ang mga aparato", "Filtrera enheter", "Filtra dispositivi", "Filtruj urządzenia", "Filtrer enheder", "Filtrer enheter"],
    "Local network": ["Réseau local", "Lokaal netwerk", "Lokales Netzwerk", "Red local", "Lokal na network", "Lokalt nätverk", "Rete locale", "Sieć lokalna", "Lokalt netværk", "Lokalt nettverk"],
    "Last speed test": ["Dernier test de débit", "Laatste snelheidstest", "Letzter Geschwindigkeitstest", "Última prueba de velocidad", "Huling pagsubok ng bilis", "Senaste hastighetstest", "Ultimo test di velocità", "Ostatni test prędkości", "Seneste hastighedstest", "Siste hastighetstest"],
    "CPU usage": ["Utilisation CPU", "CPU-gebruik", "CPU-Auslastung", "Uso de CPU", "Paggamit ng CPU", "CPU-belastning", "Uso CPU", "Użycie CPU", "CPU-forbrug", "CPU-bruk"],
    "RAM usage": ["Utilisation RAM", "RAM-gebruik", "RAM-Auslastung", "Uso de RAM", "Paggamit ng RAM", "RAM-användning", "Uso RAM", "Użycie RAM", "RAM-forbrug", "RAM-bruk"],
    "Disk free": ["Espace disque libre", "Vrije schijfruimte", "Freier Speicherplatz", "Espacio libre", "Libreng espasyo", "Ledigt diskutrymme", "Spazio libero", "Wolne miejsce", "Ledig diskplads", "Ledig diskplass"],
    "CPU temperature": ["Température CPU", "CPU-temperatuur", "CPU-Temperatur", "Temperatura de CPU", "Temperatura ng CPU", "CPU-temperatur", "Temperatura CPU", "Temperatura CPU", "CPU-temperatur", "CPU-temperatur"],
    "System uptime": ["Temps de fonctionnement", "Systeemlooptijd", "Systemlaufzeit", "Tiempo de actividad", "Tagal ng paggana", "Drifttid", "Tempo di attività", "Czas pracy", "Oppetid", "Oppetid"],
    "Connection snapshot": ["Aperçu de connexion", "Verbindingsoverzicht", "Verbindungsübersicht", "Resumen de conexión", "Buod ng koneksyon", "Anslutningsöversikt", "Riepilogo connessione", "Podsumowanie połączenia", "Forbindelsesoversigt", "Tilkoblingsoversikt"],
    "Refresh history": ["Actualiser l’historique", "Geschiedenis vernieuwen", "Verlauf aktualisieren", "Actualizar historial", "I-refresh ang kasaysayan", "Uppdatera historik", "Aggiorna cronologia", "Odśwież historię", "Opdater historik", "Oppdater historikk"],
    "Find a device": ["Rechercher un appareil", "Apparaat zoeken", "Gerät suchen", "Buscar dispositivo", "Maghanap ng aparato", "Hitta en enhet", "Cerca dispositivo", "Znajdź urządzenie", "Find en enhed", "Finn en enhet"],
    "Recent activity": ["Activité récente", "Recente activiteit", "Letzte Aktivität", "Actividad reciente", "Kamakailang aktibidad", "Senaste aktivitet", "Attività recente", "Ostatnia aktywność", "Seneste aktivitet", "Nylig aktivitet"],
    "Run speed test": ["Tester le débit", "Snelheid testen", "Geschwindigkeit testen", "Probar velocidad", "Subukan ang bilis", "Testa hastigheten", "Verifica velocità", "Sprawdź prędkość", "Test hastighed", "Test hastighet"],
    "Restart Home Assistant": ["Redémarrer Home Assistant", "Home Assistant herstarten", "Home Assistant neu starten", "Reiniciar Home Assistant", "I-restart ang Home Assistant", "Starta om Home Assistant", "Riavvia Home Assistant", "Uruchom ponownie Home Assistant", "Genstart Home Assistant", "Start Home Assistant på nytt"],
    "Automatic speed tests": ["Tests de débit automatiques", "Automatische snelheidstests", "Automatische Geschwindigkeitstests", "Pruebas de velocidad automáticas", "Mga awtomatikong pagsubok ng bilis", "Automatiska hastighetstester", "Test automatici di velocità", "Automatyczne testy prędkości", "Automatiske hastighedstest", "Automatiske hastighetstester"],
    "Interval in minutes": ["Intervalle en minutes", "Interval in minuten", "Intervall in Minuten", "Intervalo en minutos", "Agwat sa minuto", "Intervall i minuter", "Intervallo in minuti", "Odstęp w minutach", "Interval i minutter", "Intervall i minutter"],
    "Save interval": ["Enregistrer l’intervalle", "Interval opslaan", "Intervall speichern", "Guardar intervalo", "I-save ang agwat", "Spara intervall", "Salva intervallo", "Zapisz odstęp", "Gem interval", "Lagre intervall"],
    "Enter 0 for manual tests only.": ["Saisissez 0 pour les tests manuels uniquement.", "Vul 0 in voor alleen handmatige tests.", "0 für ausschließlich manuelle Tests eingeben.", "Introduce 0 para usar solo pruebas manuales.", "Ilagay ang 0 para sa manu-manong pagsubok lamang.", "Ange 0 för enbart manuella tester.", "Inserisci 0 per i soli test manuali.", "Wpisz 0, aby testować tylko ręcznie.", "Angiv 0 for kun manuelle test.", "Angi 0 for kun manuelle tester."],
    "Automation examples ↗": ["Exemples d’automatisations ↗", "Automatiseringsvoorbeelden ↗", "Automatisierungsbeispiele ↗", "Ejemplos de automatización ↗", "Mga halimbawa ng automation ↗", "Automationsexempel ↗", "Esempi di automazioni ↗", "Przykłady automatyzacji ↗", "Automatiseringseksempler ↗", "Automasjonseksempler ↗"],
    "Now": ["Maintenant", "Nu", "Jetzt", "Ahora", "Ngayon", "Nu", "Ora", "Teraz", "Nu", "Nå"],
    "24h ago": ["Il y a 24 h", "24 uur geleden", "Vor 24 Std.", "Hace 24 h", "24 oras ang nakalipas", "För 24 h sedan", "24 ore fa", "24 godz. temu", "For 24 t siden", "For 24 t siden"],
    "12h ago": ["Il y a 12 h", "12 uur geleden", "Vor 12 Std.", "Hace 12 h", "12 oras ang nakalipas", "För 12 h sedan", "12 ore fa", "12 godz. temu", "For 12 t siden", "For 12 t siden"],
    "No reading": ["Aucune mesure", "Geen meting", "Kein Messwert", "Sin lectura", "Walang sukat", "Inget mätvärde", "Nessuna lettura", "Brak odczytu", "Ingen måling", "Ingen måling"],
    "Entity not configured": ["Entité non configurée", "Entiteit niet ingesteld", "Entität nicht eingerichtet", "Entidad sin configurar", "Hindi nakatakda ang entity", "Entitet ej konfigurerad", "Entità non configurata", "Encja nieskonfigurowana", "Entitet ikke konfigureret", "Entitet ikke konfigurert"],
    "No history yet": ["Aucun historique", "Nog geen geschiedenis", "Noch kein Verlauf", "Sin historial aún", "Wala pang kasaysayan", "Ingen historik ännu", "Nessuna cronologia", "Brak historii", "Ingen historik endnu", "Ingen historikk ennå"],
    "Save": ["Enregistrer", "Opslaan", "Speichern", "Guardar", "I-save", "Spara", "Salva", "Zapisz", "Gem", "Lagre"],
    "Cancel": ["Annuler", "Annuleren", "Abbrechen", "Cancelar", "Kanselahin", "Avbryt", "Annulla", "Anuluj", "Annuller", "Avbryt"],
    "Restore defaults": ["Rétablir les valeurs par défaut", "Standaardwaarden herstellen", "Standard wiederherstellen", "Restablecer valores", "Ibalik ang mga default", "Återställ standardvärden", "Ripristina predefiniti", "Przywróć domyślne", "Gendan standarder", "Gjenopprett standardvalg"],
    "Track all": ["Tout suivre", "Alles volgen", "Alle verfolgen", "Seguir todos", "Subaybayan lahat", "Spåra alla", "Monitora tutti", "Śledź wszystkie", "Spor alle", "Spor alle"],
    "Track": ["Suivre", "Volgen", "Verfolgen", "Seguir", "Subaybayan", "Spåra", "Monitora", "Śledź", "Spor", "Spor"],
    "DNS & ad blocking": ["DNS et blocage publicitaire", "DNS en advertentieblokkering", "DNS und Werbeblocker", "DNS y bloqueo de anuncios", "DNS at pagharang ng ad", "DNS och annonsblockering", "DNS e blocco annunci", "DNS i blokowanie reklam", "DNS og annonceblokering", "DNS og annonseblokkering"],
    "Remote access & SSL": ["Accès distant et SSL", "Externe toegang en SSL", "Fernzugriff und SSL", "Acceso remoto y SSL", "Malayuang access at SSL", "Fjärråtkomst och SSL", "Accesso remoto e SSL", "Dostęp zdalny i SSL", "Fjernadgang og SSL", "Fjerntilgang og SSL"],
  };
  const scannerPlatforms = new Set(["network_control", "nmap_tracker"]);
  const themeKey = "network-control.theme";
  const speedDefaults = [
    "sensor.speedtest_download",
    "sensor.speedtest_upload",
    "sensor.speedtest_ping",
  ];
  const builtInSpeed = ["download", "upload", "ping"].map((key) => "sensor.network_control_" + key);
  const speedKeys = ["download_sensor", "upload_sensor", "latency_sensor"];
  const missing = "Entity not configured";
  const available = (state) =>
    state && !["unknown", "unavailable", ""].includes(state.state);
  const colors = [
    "var(--yanke-accent)",
    "var(--yanke-success)",
    "var(--yanke-warning)",
  ];
  const field = (name, label, selector, helper) => ({
    name,
    label,
    selector,
    helper,
  });
  const entity = (name, label, domains, multiple = false, helper) =>
    field(name, label, { entity: { domain: domains, multiple } }, helper);
  const toggle = (name, label, helper) =>
    field(name, label, { boolean: {} }, helper);
  const visibility = (name, label) =>
    field(
      "show_" + name,
      label,
      {
        select: {
          mode: "dropdown",
          options: [
            { value: "auto", label: "Automatic" },
            { value: "always", label: "Always show" },
            { value: "never", label: "Hide" },
          ],
        },
      },
      "When unset, the section uses Automatic or keeps a previous hide setting.",
    );
  const group = (name, title, schema) => ({
    type: "expandable",
    name,
    title,
    flatten: true,
    schema,
  });

  const sections = {
    connection: {
      label: "Connection speed and history",
      panels: ["speed-metrics", "history"],
      wide: true,
    },
    personal: { label: "Personal devices" },
    printer: { label: "Printer supplies" },
    scanner: { label: "Network scanner" },
    host: { label: "Host health" },
    dns: { label: "DNS and ad blocking" },
    remote: { label: "Remote access and SSL" },
    controls: { label: "Network controls" },
  };
  const defaultOrder = Object.keys(sections);
  const form = [
    group("layout", "Layout and privacy", [
      field(
        "title",
        "Dashboard heading",
        { text: {} },
        "Leave blank for Network / control.",
      ),
      ...defaultOrder.map((id) => visibility(id, sections[id].label)),
      toggle("show_wan_ip", "Show public WAN address"),
      toggle("show_mac", "Show device MAC addresses"),
    ]),
    group("internet", "Internet connection and router", [
      field("router_name", "Router display name", { text: {} }),
      entity("router_entity", "Router entity", [
        "sensor",
        "binary_sensor",
        "device_tracker",
      ]),
      entity("wan_sensor", "WAN address sensor", "sensor"),
      entity(
        "download_sensor",
        "Download speed sensor",
        "sensor",
        false,
        "Leave blank to use Network Control’s built-in speed test sensor.",
      ),
      entity("upload_sensor", "Upload speed sensor", "sensor"),
      entity("latency_sensor", "Latency sensor", "sensor"),
      field(
        "latency_max_ms",
        "Latency chart limit",
        {
          number: { min: 10, step: 1, mode: "box", unit_of_measurement: "ms" },
        },
        "Defaults to 500 ms.",
      ),
      entity("speedtest_action_entity", "Run speed test button or script", [
        "button",
        "script",
      ]),
    ]),
    group("devices", "Personal devices, printers and scanner", [
      entity(
        "personal_entities",
        "Personal devices and readings",
        ["person", "device_tracker", "sensor", "binary_sensor"],
        true,
        "Leave blank for automatic discovery.",
      ),
      entity(
        "printer_entities",
        "Ink and toner sensors",
        "sensor",
        true,
        "Leave blank for automatic discovery.",
      ),
      field(
        "scan_subnet",
        "Scanner label",
        { text: {} },
        "Changes the label shown on the dashboard. Configure scanning in Nmap Tracker.",
      ),
    ]),
    group("system", "Host health", [
      entity("cpu_sensor", "CPU usage", "sensor"),
      entity("memory_sensor", "RAM usage", "sensor"),
      entity("disk_sensor", "Disk free space", "sensor"),
      entity("temperature_sensor", "CPU temperature", "sensor"),
      entity("uptime_sensor", "System uptime", "sensor"),
    ]),
    group("access", "DNS and remote access", [
      entity("dns_queries_sensor", "DNS query count", "sensor"),
      entity("dns_blocked_sensor", "Ads blocked percentage", "sensor"),
      entity("remote_access_entity", "Remote access or VPN status", [
        "sensor",
        "binary_sensor",
      ]),
      entity("ssl_entity", "SSL certificate expiry", [
        "sensor",
        "binary_sensor",
      ]),
    ]),
    group("control", "Network controls", [
      entity("pihole_switch", "Pi-hole blocking switch", "switch"),
      entity("dns_pause_script", "DNS pause script", "script"),
      entity("router_reboot_entity", "Router reboot button or script", [
        "button",
        "script",
      ]),
      entity("guest_wifi_entity", "Guest Wi-Fi switch", "switch"),
      entity(
        "wake_entities",
        "Wake-on-LAN buttons, switches or scripts",
        ["button", "switch", "script"],
        true,
      ),
      toggle("enable_restart", "Enable Home Assistant restart"),
      entity("host_reboot_entity", "Host reboot button or script", [
        "button",
        "script",
      ]),
    ]),
  ];
  let lastProfileLanguage;
  function savedLanguage() {
    try {
      const code = localStorage.getItem("network-control.language");
      if (Object.hasOwn(languages, code)) return code;
    } catch { /* Browser storage may be disabled. */ }
    return "auto";
  }
  function profileLanguage(hass) {
    return hass?.locale?.language || hass?.language;
  }
  function resolveLanguage(choice, profile) {
    if (choice !== "auto") return choice;
    const base = profile?.toLowerCase().split(/[-_]/)[0];
    if (base === "fil") return "tl";
    if (base === "no") return "nb";
    return Object.hasOwn(languages, base) ? base : "en";
  }
  function translate(key, language) {
    return translations[key]?.[Object.keys(languages).indexOf(language) - 1] ?? key;
  }
  function editorFields(fields, language) {
    return fields.map(field => {
      const localized = { ...field };
      for (const key of ["label", "title", "helper"])
        if (field[key]) localized[key] = translate(field[key], language);
      if (field.schema) localized.schema = editorFields(field.schema, language);
      const select = field.selector?.select;
      if (select?.options) localized.selector = { select: { ...select, options:
        select.options.map(option => ({ ...option, label: translate(option.label, language) })) } };
      return localized;
    });
  }
  class NetworkConsole extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.languageChoice = savedLanguage();
      this.language = resolveLanguage(this.languageChoice, lastProfileLanguage);
      this.theme = "network";
      try {
        const saved = localStorage.getItem(themeKey);
        if (Object.hasOwn(themes, saved)) this.theme = saved;
      } catch { /* Keep the default when browser storage is disabled. */ }
      this.syncAppearance = () => {
        if (this.theme === "appearance" && this._hass)
          window.YankeAppearance?.apply(this.root?.querySelector(".shell"), this._hass);
      };
      const legacyKey = "network-control.panels:" + location.pathname;
      this.legacyPanelPreferences = {};
      this.panelPreferences = {};
      try {
        const saved = JSON.parse(localStorage.getItem(legacyKey));
        for (const panel of ["personal", "controls"]) {
          if (Array.isArray(saved?.[panel]))
            this.legacyPanelPreferences[panel] = saved[panel].filter((id) => typeof id === "string");
        }
      } catch { /* Default to discovery when saved preferences are unavailable. */ }
      this.reg = {};
      this.scan = {
        tab: "devices",
        filter: "all",
        q: "",
        editing: null,
        events: [],
        lastIp: {},
        sig: "",
      };
      this.shadowRoot.addEventListener("click", (e) => {
        const manage = e.target.closest("[data-manage-panel]");
        if (manage) {
          if (!this.preview) this.managePanel(manage);
          return;
        }
        const shortcut = e.target.closest("[data-network-shortcut]");
        if (shortcut) {
          if (!this.preview)
            this.runShortcut(shortcut.dataset.networkShortcut);
          return;
        }
        const action = e.target.closest("[data-action]");
        if (action) {
          if (this.preview) return;
          this.runAction(action);
          return;
        }
        if (this.scanClick(e)) return;
        const b = e.target.closest("[data-entity]");
        if (b)
          this.dispatchEvent(
            new CustomEvent("hass-more-info", {
              detail: { entityId: b.dataset.entity },
              bubbles: true,
              composed: true,
            }),
          );
      });
    }
    setConfig(config) {
      const scannerWasHidden = this.mode("scanner") === "never";
      const before = JSON.stringify([
        this.speed,
        this.latencyCap,
        this.mode("connection"),
      ]);
      this.config = config;
      this.panelPreferences = config.panel_preferences ?? this.legacyPanelPreferences;
      this.selectSpeedSensors();
      const cap = Number(config.latency_max_ms ?? 500);
      this.latencyCap = Number.isFinite(cap) && cap >= 10 ? cap : 500;
      if (this.root) {
        if (
          scannerWasHidden &&
          this.mode("scanner") !== "never" &&
          !this.regOk
        ) {
          this.loadRegistry().then(() => this.loadActivity());
        }
        this.update();
        this.renderScan(true);
        if (
          before !==
          JSON.stringify([this.speed, this.latencyCap, this.mode("connection")])
        ) {
          this.loadHistory();
        }
      }
    }
    static getConfigForm() {
      return {
        schema: editorFields(form, resolveLanguage(savedLanguage(),
          profileLanguage(document.querySelector("home-assistant")?.hass) || lastProfileLanguage || document.documentElement.lang)),
        computeLabel: (field) => field.label,
        computeHelper: (field) => field.helper,
      };
    }
    static getStubConfig() {
      return { latency_max_ms: 500 };
    }
    getCardSize() {
      return 12;
    }
    selectSpeedSensors() {
      this.speed = speedKeys.map((key, index) => this.config[key] ||
        (this._hass?.states[builtInSpeed[index]] ? builtInSpeed[index] : speedDefaults[index]));
    }
    set hass(hass) {
      this._hass = hass;
      lastProfileLanguage = profileLanguage(hass) || document.documentElement.lang;
      const nextLanguage = resolveLanguage(this.languageChoice, lastProfileLanguage);
      const languageChanged = this.language !== nextLanguage;
      this.language = nextLanguage;
      if (languageChanged && this.root) {
        this.applyLanguage();
        this.historyVisibilityKey = null;
      }
      this.selectSpeedSensors();
      if (!this.root) {
        this.build();
        this.loadRegistry().then(() => this.loadActivity());
      }
      this.syncAppearance();
      this.update();
      this.renderScan(languageChanged);
    }
    connectedCallback() {
      window.addEventListener("yanke-appearance-ready", this.syncAppearance);
      this.timer = setInterval(() => {
        if (this._hass) {
          this.loadHistory();
          this.update();
        }
      }, 300000);
      this.scanTimer = setInterval(() => {
        if (this._hass && this.root) {
          this.loadRegistry().then(() => this.loadActivity());
        }
      }, 60000);
    }
    disconnectedCallback() {
      window.removeEventListener("yanke-appearance-ready", this.syncAppearance);
      clearInterval(this.timer);
      clearInterval(this.scanTimer);
    }
    state(id) {
      return this._hass.states[id];
    }
    value(id, d = 0) {
      const s = this.state(id);
      return s &&
        !["unknown", "unavailable", ""].includes(s.state) &&
        Number.isFinite(Number(s.state))
        ? Number(s.state).toFixed(d)
        : "—";
    }
    build() {
      this.shadowRoot.innerHTML = `<link rel="stylesheet" href="${stylesheet}"><div class="shell"><div class="wrap"><header><h1 id="dashboard-title">Network Control</h1><div class="head-right"><span class="trek-ops">Primary Ops</span><button type="button" class="theme-button">Settings</button><div class="topline"><span id="router"></span><span class="ip" id="ip"></span></div></div></header><div class="grid"><div class="metrics" id="speed-metrics">${["Download", "Upload", "Latency"].map((n, i) => `<button class="metric" data-entity="${esc(this.speed[i])}"><div class="label">${n}<span style="color:${colors[i]}">${["↓", "↑", "↔"][i]}</span></div><div class="value" style="color:${colors[i]}"><span id="v${i}">—</span><span class="unit">${i === 2 ? "ms" : "Mbps"}</span></div><div class="sub" id="s${i}"></div></button>`).join("")}</div><div class="main" id="main"><section class="panel hist" id="history"><div class="heading"><h2>Connection history</h2><span class="tag">LAST 24 HOURS</span></div><div class="chart"><div class="legend">${["Download", "Upload", "Latency"].map((n, i) => `<span><i style="background:${colors[i]}"></i>${n}</span>`).join("")}</div><div class="plotwrap"><div class="plot" id="plot"><div class="empty">Loading history…</div></div><span class="yl tl" id="yl0"></span><span class="yl bl" id="yl1"></span><span class="yl tr" id="yl2"></span><span class="yl br" id="yl3"></span></div><div class="axis"><span>24h ago</span><span>12h ago</span><span>Now</span></div><div class="chartnote" id="chartnote">Recorded speed tests · Mbps left / ms right</div></div></section><div class="side" id="side"><section class="panel" id="personal-panel"><div class="heading"><h2>Personal devices</h2><button type="button" class="manage-panel" data-manage-panel="personal" aria-label="Manage personal devices">Manage</button></div><div id="personal" class="readings"></div></section><section class="panel" id="printers" hidden><div class="heading"><h2>Printer supplies</h2></div><div id="supplies" class="readings"></div></section></div></div><section class="panel scan" id="scanner" hidden><div class="heading"><h2>Network scanner</h2><span class="tag" id="scantag">${esc(this.config.scan_subnet || this.t("Local network"))}</span></div><div class="scanstats">${[
        ["online", "Online", "ok"],
        ["offline", "Dropped off", "warn"],
        ["unnamed", "Unnamed", ""],
      ]
        .map(
          (f) =>
            `<button class="stat" data-filter="${f[0]}"><b class="${f[2]}" id="n_${f[0]}">—</b><small>${f[1]}</small></button>`,
        )
        .join(
          "",
        )}</div><div class="scanbar"><div class="tabs"><button data-tab="devices" class="on">Devices</button><button data-tab="activity">Activity</button><button data-tab="new">New devices</button></div><input class="search" id="scansearch" type="search" placeholder="Filter devices" aria-label="Filter devices"></div><div id="pending"></div><div class="scanlist" id="scanlist"><div class="none">Loading devices…</div></div><div class="scanfoot"><span id="scanfoot"></span><span id="scanerr"></span></div></section><div class="support" id="support">
 <section class="panel" id="host-panel"><div class="heading"><h2>Host health</h2><span class="tag">24-hour history</span></div><div id="host" class="readings"></div><svg class="trek-ship" viewBox="0 0 430 80" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"><path d="M8 44 Q96 37 182 43 L199 49 L186 57 L28 56Z M23 48H184 M37 53H176 M183 52 L235 60 L270 43 M176 57 L219 69 L265 66 L299 40 M217 68 L215 75 H264 L278 64 M230 71H266 M246 58 L277 32 Q311 13 355 11 Q398 12 425 33 L413 41 L315 46 L270 40Z M273 32 Q349 24 425 33 M283 37 Q354 41 413 37 M308 24 Q356 17 396 25 M334 16 L331 42 M365 14 L372 43 M289 30 L282 40 M252 58 L281 47 M266 62 L288 49"/><path opacity=".42" d="M48 46V55 M69 45V55 M95 45V55 M121 44V55 M147 45V55 M172 45V55 M240 65V74 M251 65V74 M264 61V70 M305 28V43 M317 23V44 M349 14V44 M382 17V43 M399 23V42 M278 35H420 M296 27H401"/></g></svg></section>
 <section class="panel" id="dns-panel"><div class="heading"><h2>DNS &amp; ad blocking</h2></div><div id="dns" class="readings"></div></section>
 <section class="panel" id="remote-panel"><div class="heading"><h2>Remote access &amp; SSL</h2></div><div id="remote" class="readings"></div></section>
 <section class="panel" id="actions-panel"><div class="heading"><h2>Network controls</h2><button type="button" class="manage-panel" data-manage-panel="controls" aria-label="Manage network controls">Manage</button></div><div id="actions" class="actions"></div><div class="feedback" id="feedback" role="status"></div></section>
 </div></div></div></div>`;
      this.root = this.shadowRoot;
      this.setupSettings();
      this.setupHostTooltip();
      this.root.getElementById("scansearch").addEventListener("input", (e) => {
        this.scan.q = e.target.value.trim().toLowerCase();
        this.renderScan(true);
      });
      this.root.getElementById("scanlist").addEventListener("keydown", (e) => {
        if (!e.target.classList.contains("rename")) return;
        if (e.key === "Enter") {
          e.preventDefault();
          this.saveName(e.target.dataset.id, e.target.value);
        } else if (e.key === "Escape") {
          this.scan.editing = null;
          this.renderScan(true);
        }
      });
    }
    discovered(platform, pattern) {
      return Object.keys(this._hass.states).find(
        (id) =>
          this._hass.entities?.[id]?.platform === platform && pattern.test(id),
      );
    }
    t(key) {
      return translate(key, this.language);
    }
    // Bind only template text, before any user-provided device names are inserted.
    bindLabels(root) {
      const labels = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const source = node.data;
        const key = source.trim();
        if (Object.hasOwn(translations, key))
          labels.push(() => { node.data = source.replace(key, this.t(key)); });
      }
      for (const el of root.querySelectorAll("[placeholder],[aria-label]")) {
        for (const attr of ["placeholder", "aria-label"]) {
          const key = el.getAttribute(attr);
          if (Object.hasOwn(translations, key))
            labels.push(() => el.setAttribute(attr, this.t(key)));
        }
      }
      const apply = () => labels.forEach(bind => bind());
      apply();
      return apply;
    }
    setupSettings() {
      const shell = this.root.querySelector(".shell");
      const trigger = shell.querySelector(".theme-button");
      const dialog = document.createElement("dialog");
      dialog.className = "theme-dialog";
      dialog.setAttribute("aria-label", "Network Control settings");
      dialog.innerHTML = `<form method="dialog"><div class="theme-heading"><strong>Settings</strong><button type="submit" autofocus>Close</button></div></form>
        <label class="language-setting">Language <select></select></label><h3>Theme</h3><div class="theme-choices">${Object.entries(themes).map(([id, [name, background, accent]]) =>
          `<button type="button" data-theme-choice="${id}"><span aria-hidden="true" style="--swatch-bg:${background};--swatch-accent:${accent}"></span>${name}</button>`).join("")}</div><form class="speed-settings" hidden><h3>Automatic speed tests</h3><label>Interval in minutes <input type="number" min="0" max="10080" step="1" required disabled></label><button type="submit" disabled>Save interval</button><small>Enter 0 for manual tests only.</small><div role="status"></div></form><a class="automation-examples" href="https://github.com/yanke7/Home-Assistant-Network/blob/main/docs/automations.md" target="_blank" rel="noopener noreferrer">Automation examples ↗</a>`;
      shell.append(dialog);
      const refreshLabels = this.bindLabels(shell);
      const language = dialog.querySelector(".language-setting select");
      const automatic = new Option("", "auto");
      language.add(automatic);
      for (const [code, name] of Object.entries(languages)) language.add(new Option(name, code));
      this.applyLanguage = () => {
        const status = dialog.querySelector('.speed-settings [role="status"]');
        if (status.dataset.message) status.textContent = this.t(status.dataset.message);
        automatic.text = this.t("Use Home Assistant language");
        language.value = this.languageChoice;
        shell.lang = this.language;
        shell.querySelector("#host-panel h2").dataset.telemetry = " & " + this.t("Telemetry");
        refreshLabels();
      };
      this.applyLanguage();
      language.addEventListener("change", () => {
        this.languageChoice = language.value;
        this.language = resolveLanguage(this.languageChoice, profileLanguage(this._hass));
        try { localStorage.setItem("network-control.language", this.languageChoice); } catch { /* Session only. */ }
        this.applyLanguage();
        this.historyVisibilityKey = null;
        this.update();
        this.renderScan(true);
      });
      this.setupSpeedInterval(dialog);
      const apply = () => {
        shell.removeAttribute("style");
        shell.dataset.theme = this.theme;
        this.syncAppearance();
        for (const button of dialog.querySelectorAll("[data-theme-choice]"))
          button.setAttribute("aria-pressed", button.dataset.themeChoice === this.theme);
      };
      trigger.addEventListener("click", () => dialog.showModal());
      dialog.addEventListener("close", () => trigger.focus());
      dialog.addEventListener("click", (event) => {
        const button = event.target.closest("[data-theme-choice]");
        if (!button) return;
        this.theme = button.dataset.themeChoice;
        try { localStorage.setItem(themeKey, this.theme); } catch { /* Keep the current choice. */ }
        apply();
        dialog.close();
      });
      apply();
    }
    setupSpeedInterval(dialog) {
      const form = dialog.querySelector(".speed-settings");
      const input = form.querySelector("input");
      const save = form.querySelector("button");
      const status = form.querySelector('[role="status"]');
      const setStatus = key => { status.dataset.message = key; status.textContent = this.t(key); };
      const endpoint = "config/config_entries/options/flow";
      let flow;
      let opening = 0;
      const discard = (id) => this._hass.callApi("DELETE", `${endpoint}/${id}`).catch(() => {});
      dialog.addEventListener("close", () => {
        opening++;
        if (flow) discard(flow);
        flow = null;
      });
      this.root.querySelector(".theme-button").addEventListener("click", async () => {
        form.hidden = !this._hass.user?.is_admin;
        if (form.hidden) return;
        const request = ++opening;
        input.disabled = save.disabled = true;
        setStatus("Loading interval…");
        try {
          const entries = await this._hass.callWS({ type: "config_entries/get", domain: "network_control" });
          const entry = entries.find((item) => item.state === "loaded" && item.supports_options);
          if (!entry) throw Error("Options unavailable");
          const result = await this._hass.callApi("POST", endpoint, { handler: entry.entry_id });
          if (request !== opening || !dialog.open) {
            if (result.flow_id) discard(result.flow_id);
            return;
          }
          flow = result.flow_id;
          const field = result.data_schema?.find((item) => item.name === "speed_test_interval");
          if (!field || result.type !== "form") throw Error("Options unavailable");
          input.value = field.default ?? 60;
          input.disabled = save.disabled = false;
          setStatus("");
        } catch {
          if (request === opening) setStatus("Speed test schedule unavailable.");
        }
      });
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!flow) return;
        const request = opening;
        const id = flow;
        flow = null;
        input.disabled = save.disabled = true;
        setStatus("Saving…");
        try {
          const result = await this._hass.callApi("POST", `${endpoint}/${id}`, {
            speed_test_interval: input.valueAsNumber,
          });
          if (result.type !== "create_entry") throw Error("Save incomplete");
          if (request === opening) setStatus("Interval saved.");
        } catch {
          discard(id);
          if (request === opening) setStatus("Could not save. Reopen Settings to try again.");
        }
      });
    }
    reading(label, id) {
      const entity = this.state(id);
      const unit = entity?.attributes?.unit_of_measurement;
      const date =
        entity?.attributes.device_class === "timestamp"
          ? Date.parse(entity.state)
          : NaN;
      const age = Math.floor((Date.now() - date) / 3600000);
      const value =
        label === "System uptime" && Number.isFinite(age) && age >= 0
          ? this.duration(age * 60)
          : label === "SSL certificate" && Number.isFinite(age)
            ? date > Date.now()
              ? this.t("Valid until") + " " + new Date(date).toLocaleDateString(this.language)
              : this.t("Expired")
            : label === "Remote access" &&
                entity?.entity_id?.startsWith("binary_sensor.") &&
                available(entity)
              ? entity.state === "on"
                ? this.t("Connected")
                : this.t("Disconnected")
              : available(entity)
                ? [entity.state, unit].filter(Boolean).join(" ")
                : entity
                  ? "No reading"
                  : missing;
      const percent = Number(entity?.state);
      const meter = unit === "%" && available(entity) && Number.isFinite(percent)
        ? `<i class="usage-meter" aria-hidden="true" style="--fill:${Math.min(100, Math.max(0, percent))}%"></i>` : "";
      const content = `<span>${esc(this.t(label) || entity?.attributes.friendly_name || id)}</span><span>${meter}${esc(available(entity) ? value : this.t(value))}</span>`;
      return entity
        ? `<button class="reading" data-entity="${esc(id)}">${content}</button>`
        : `<div class="reading">${content}</div>`;
    }
    rows(element, rows) {
      const html =
        rows.map(([label, id]) => this.reading(label, id)).join("") ||
        `<div class="hint">${this.t(missing)}</div>`;
      this.renderMarkup(element, html);
    }
    renderMarkup(id, html) {
      this.markup ??= {};
      if (this.markup[id] === html) return;
      this.markup[id] = html;
      this.root.getElementById(id).innerHTML = html;
    }
    mode(section) {
      return (
        this.config?.["show_" + section] ||
        (this.config?.["hide_" + section] ? "never" : "auto")
      );
    }
    sectionHidden(section, hasContent) {
      const mode = this.mode(section);
      return mode === "never" || (mode !== "always" && !hasContent);
    }
    updateSection(section, panel, target, rows) {
      const hasContent = rows.some(([, id]) => this.state(id));
      const hidden = this.sectionHidden(section, hasContent);
      this.root.getElementById(panel).hidden = hidden;
      if (!hidden) this.rows(target, hasContent ? rows : []);
      return hidden;
    }
    update() {
      const config = this.config;
      const hide = (id, hidden) => {
        this.root.getElementById(id).hidden = Boolean(hidden);
      };
      this.renderMarkup(
        "dashboard-title",
        config.title?.trim()
          ? esc(config.title.trim())
          : "Network Control",
      );
      const activeSpeed = this.speed.filter((id) => this.state(id));
      const connectionHidden = this.sectionHidden(
        "connection",
        activeSpeed.length > 0,
      );
      hide("speed-metrics", connectionHidden);
      hide("history", connectionHidden);
      const historyKey = JSON.stringify([connectionHidden, activeSpeed]);
      if (this.historyVisibilityKey !== historyKey) {
        this.historyVisibilityKey = historyKey;
        this.loadHistory();
      }
      const canManage = Boolean(this.dashboardCard());
      for (const button of this.root.querySelectorAll("[data-manage-panel]"))
        button.hidden = !canManage;
      const ids = Object.keys(this._hass.states);
      const routerId =
        config.wan_sensor ||
        ids.find((id) =>
          /^sensor\..*(?:external_ip|wan_ip)(?:_address)?$/.test(id),
        );
      const router = this.state(config.router_entity || routerId);
      const device =
        this._hass.devices?.[
          this._hass.entities?.[router?.entity_id]?.device_id
        ];
      this.root.getElementById("router").textContent =
        config.router_name ||
        device?.name_by_user ||
        device?.name ||
        (config.router_entity && router?.attributes.friendly_name) ||
        (router ? this.t("Internet gateway") : "");
      const wan = this.state(routerId);
      this.root.getElementById("ip").textContent =
        config.show_wan_ip && available(wan) ? "WAN / " + wan.state : "";
      this.speed.forEach((id, index) => {
        this.root.getElementById("v" + index).closest("button").dataset.entity =
          id;
        this.root.getElementById("v" + index).textContent = this.value(
          id,
          index === 2 ? 0 : 1,
        );
        this.root.getElementById("s" + index).textContent = this.t(!this.state(id)
          ? missing
          : this.value(id) === "—"
            ? "No reading"
            : "Last speed test");
      });

      this.defaultPersonal =
        config.personal_entities ??
        ids.filter(
          (id) =>
            id.startsWith("person.") ||
            (this._hass.entities?.[id]?.platform === "mobile_app" &&
              /_(battery_level|storage)$/.test(id)),
        );
      const personal = this.panelPreferences.personal ?? this.defaultPersonal;
      let personalHidden = this.updateSection(
        "personal",
        "personal-panel",
        "personal",
        personal.map((id) => [null, id]),
      );
      if (this.panelPreferences.personal && this.mode("personal") !== "never") {
        personalHidden = false;
        hide("personal-panel", false);
        this.rows("personal", personal.map((id) => [null, id]));
      }
      const supplies =
        config.printer_entities ??
        ids.filter((id) =>
          /^sensor\..*_(ink|toner)(?:_(remaining|level))?$/.test(id),
        );
      const printerHidden = this.updateSection(
        "printer",
        "printers",
        "supplies",
        supplies.map((id) => [null, id]),
      );
      const sideHidden = personalHidden && printerHidden;
      hide("side", sideHidden);
      hide("main", connectionHidden && sideHidden);
      this.root
        .getElementById("main")
        .classList.toggle("single-column", sideHidden || connectionHidden);

      const hostRows = [
        [
          "CPU usage",
          config.cpu_sensor || this.hostSensor("host_cpu") ||
            this.discovered("systemmonitor", /_processor_use$/),
        ],
        [
          "RAM usage",
          config.memory_sensor || this.hostSensor("host_memory") ||
            this.discovered("systemmonitor", /_memory_usage$/),
        ],
        [
          "Disk free",
          config.disk_sensor || this.hostSensor("host_disk_free") || this.discovered("systemmonitor", /_disk_free/),
        ],
        [
          "CPU temperature",
          config.temperature_sensor || this.hostSensor("host_cpu_temperature") ||
            this.discovered("systemmonitor", /_processor_temperature$/),
        ],
        [
          "System uptime",
          config.uptime_sensor || this.hostSensor("host_boot_time") ||
            this.discovered("systemmonitor", /_last_boot$/) ||
            this.discovered("uptime", /^sensor\./),
        ],
      ];
      const hostHidden = this.sectionHidden("host", hostRows.some(([, id]) => this.state(id)));
      hide("host-panel", hostHidden);
      if (!hostHidden) this.renderHostHealth(hostRows);
      const dnsPlatform = ["adguard", "pi_hole"].find((platform) =>
        this.discovered(platform, /_(dns_)?queries(?:_today)?$/),
      );
      const dnsHidden = this.updateSection("dns", "dns-panel", "dns", [
        [
          dnsPlatform === "adguard"
            ? "DNS queries (statistics window)"
            : "DNS queries",
          config.dns_queries_sensor ||
            this.discovered(
              dnsPlatform || "adguard",
              /_(dns_)?queries(?:_today)?$/,
            ),
        ],
        [
          "Ads blocked",
          config.dns_blocked_sensor ||
            this.discovered(
              dnsPlatform || "adguard",
              /_(ratio|percentage|percent|ads_percentage_blocked_today|ads_percentage_today|percent_ads_blocked)$/,
            ),
        ],
      ]);
      const remoteHidden = this.updateSection(
        "remote",
        "remote-panel",
        "remote",
        [
          ["Remote access", config.remote_access_entity],
          [
            "SSL certificate",
            config.ssl_entity || this.discovered("cert_expiry", /^sensor\./),
          ],
        ],
      );
      this.renderActions();
      const controlsHidden = this.sectionHidden(
        "controls",
        this.availableActions.length > 0 || this.visibleShortcuts.length > 0 || Boolean(this.panelPreferences.controls),
      );
      hide("actions-panel", controlsHidden);
      hide(
        "support",
        hostHidden && dnsHidden && remoteHidden && controlsHidden,
      );
    }
    hostSensor(key) {
      const id = "sensor.network_control_" + key;
      return this.state(id)?.entity_id ? id : undefined;
    }

    setupHostTooltip() {
      const host = this.root.getElementById("host");
      const tooltip = document.createElement("div");
      tooltip.className = "host-tooltip";
      tooltip.hidden = true;
      tooltip.setAttribute("role", "tooltip");
      this.root.querySelector(".shell").append(tooltip);
      host.addEventListener("pointermove", (event) => {
        const plot = event.target.closest(".instrument-plot");
        const id = plot?.closest("[data-entity]")?.dataset.entity;
        const history = this.hostHistory;
        const samples = history?.samples?.[id];
        if (!samples?.length) {
          tooltip.hidden = true;
          return;
        }
        const rect = plot.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const target = history.start + fraction * 86400000;
        const sample = samples.reduce((nearest, point) =>
          Math.abs(point.time - target) < Math.abs(nearest.time - target) ? point : nearest);
        const label = plot.closest("button").querySelector(".instrument-label").textContent;
        const unit = this.state(id)?.attributes.unit_of_measurement;
        const value = sample.duration
          ? Math.floor(sample.value * 60).toLocaleString(this.language, { style:"unit", unit:"minute" })
          : sample.raw + (unit === "%" ? "%" : unit ? " " + unit : "");
        tooltip.textContent = `${label} · ${value} · ${new Date(sample.time).toLocaleString(this.language)}`;
        tooltip.hidden = false;
        tooltip.style.left = Math.max(8, Math.min(event.clientX + 12, window.innerWidth - tooltip.offsetWidth - 8)) + "px";
        tooltip.style.top = Math.max(8, rect.top - tooltip.offsetHeight - 5) + "px";
      });
      host.addEventListener("pointerleave", () => { tooltip.hidden = true; });
    }
    renderHostHealth(rows) {
      const ids = rows.map(([, id]) => id).filter((id) => this.state(id));
      const key = ids.join(",");
      if (this.hostHistoryKey !== key || Date.now() - (this.hostHistoryAt || 0) >= 300000) {
        this.hostHistoryKey = key;
        this.hostHistoryAt = Date.now();
        this.hostHistory = this.hostHistory?.key === key ? this.hostHistory : { key, series: {} };
        if (key) this.fetchHostHistory(ids, key);
      }
      const diskUseId = rows[2][1]?.replace(/_disk_free(?=_|$)/, "_disk_use");
      const diskUse = diskUseId !== rows[2][1] ? this.state(diskUseId) : null;
      const markup = rows.map(([label, id], index) => {
        const state = this.state(id);
        const unit = state?.attributes.unit_of_measurement || "";
        const number = Number(state?.state);
        const numeric = available(state) && Number.isFinite(number);
        const boot = index === 4 && !numeric ? Date.parse(state?.state) : NaN;
        const minutes = Math.max(0, Math.floor((Date.now() - boot) / 60000));
        const value = Number.isFinite(boot)
          ? this.duration(minutes)
          : available(state) ? `${state.state}${unit === "%" ? "%" : unit ? " " + unit : ""}` : "—";
        let fraction = numeric && unit === "%" ? number / 100 : null;
        if (index === 2 && numeric && Number.isFinite(state.attributes.free_percent))
          fraction = state.attributes.free_percent / 100;
        else if (index === 2 && numeric && available(diskUse) && diskUse.attributes.unit_of_measurement === "%")
          fraction = 1 - Number(diskUse.state) / 100;
        if (index === 3 && numeric && ["°C", "°F"].includes(unit))
          fraction = (unit === "°F" ? (number - 32) * 5 / 9 : number) / 100;
        const fill = Number.isFinite(fraction) ? Math.max(0, Math.min(1, fraction)) : 0;
        const graph = this.hostHistory.series[id] || "";
        return `<button type="button" class="host-instrument instrument-${index}" ${state ? `data-entity="${esc(id)}"` : "disabled"}>
          <span class="instrument-label">${esc(this.t(label))}</span>
          <span class="instrument-display"><i class="instrument-arc" aria-hidden="true" style="--level:${fill}"></i><strong>${esc(value)}</strong></span>
          <span class="instrument-plot" role="img" aria-label="${esc(this.t("24-hour history"))}">${graph || `<span class="instrument-empty">${this.t(state ? "No history yet" : "Entity not configured")}</span>`}</span>
        </button>`;
      }).join("");
      this.renderMarkup("host", markup);
    }
    async fetchHostHistory(ids, key) {
      const end = Date.now();
      const start = end - 86400000;
      const series = {};
      const samples = {};
      try {
        const rows = await this._hass.callApi("GET", `history/period/${new Date(start).toISOString()}?filter_entity_id=${encodeURIComponent(ids.join(","))}&end_time=${new Date(end).toISOString()}&minimal_response&no_attributes`);
        for (const records of rows) {
          const id = records[0]?.entity_id;
          if (!id) continue;
          const points = records.map((record) => {
            const time = Date.parse(record.last_changed || record.last_updated);
            const value = record.state?.trim() ? Number(record.state) : NaN;
            const boot = Date.parse(record.state);
            return [time, Number.isFinite(value) ? value : (time - boot) / 3600000];
          });
          samples[id] = points.flatMap(([time, value], index) => {
            if (!Number.isFinite(time + value)) return [];
            const raw = records[index].state;
            return [{ time, value, raw, duration: !Number.isFinite(Number(raw)) }];
          });
          if (points.length && Number.isFinite(points.at(-1)[1])) {
            const boot = Date.parse(records.at(-1).state);
            points.push([end, Number.isFinite(Number(records.at(-1).state)) ? points.at(-1)[1] : (end - boot) / 3600000]);
          }
          const values = points.filter(([time, value]) => Number.isFinite(time + value)).map(([, value]) => value);
          if (!values.length) continue;
          const low = Math.min(...values), range = Math.max(1, Math.max(...values) - low);
          let pen = false;
          const path = points.map(([time, value]) => {
            if (!Number.isFinite(time + value)) { pen = false; return ""; }
            const command = pen ? "L" : "M";
            pen = true;
            return command + Math.max(0, Math.min(200, (time - start) * 200 / 86400000)).toFixed(1) + "," + (19 - (value - low) * 16 / range).toFixed(1);
          }).join(" ");
          series[id] = `<svg class="instrument-history" viewBox="0 0 200 22" preserveAspectRatio="none" role="img" aria-hidden="true"><path d="${path}" vector-effect="non-scaling-stroke"/></svg>`;
        }
      } catch { /* Keep the live gauges usable when Recorder history is unavailable. */ }
      if (this.hostHistoryKey !== key) return;
      this.hostHistory = { key, series, samples, start };
      this.update();
    }
    actions() {
      const config = this.config;
      const services = this._hass.services || {};
      const actions = [];
      const add = (label, domain, service, target, data, confirm = false) => {
        if (
          services[domain]?.[service] &&
          (!target ||
            (this.state(target) && this.state(target).state !== "unavailable"))
        ) {
          actions.push({ label, domain, service, target, data, confirm });
        }
      };
      const entityAction = (label, id, confirm = false) => {
        const domain = id?.split(".")[0];
        const service = {
          button: "press",
          script: "turn_on",
          switch: "toggle",
        }[domain];
        if (service) add(label, domain, service, id, undefined, confirm);
      };
      if (config.speedtest_action_entity)
        entityAction("Run speed test", config.speedtest_action_entity);
      else if (this.speed.every((id, index) => id === builtInSpeed[index]))
        entityAction("Run speed test", "button.network_control_run_speed_test");
      else if (
        this._hass.entities?.[this.speed[0]]?.platform === "speedtestdotnet" ||
        this.speed[0] === speedDefaults[0]
      )
        add("Run speed test", "homeassistant", "update_entity", this.speed[0]);
      if (config.dns_pause_script)
        entityAction(
          "Pause blocking for 5 minutes",
          config.dns_pause_script,
          true,
        );
      else if (config.pihole_switch)
        add(
          "Pause blocking for 5 minutes",
          "pi_hole",
          "disable",
          config.pihole_switch,
          { duration: "00:05:00" },
          true,
        );
      entityAction("Reboot router", config.router_reboot_entity, true);
      entityAction("Toggle guest Wi-Fi", config.guest_wifi_entity, true);
      for (const id of config.wake_entities ?? [])
        entityAction(
          this.state(id)?.attributes.friendly_name || "Wake device",
          id,
        );
      if (config.enable_restart && this._hass.user?.is_admin)
        add(
          "Restart Home Assistant",
          "homeassistant",
          "restart",
          undefined,
          undefined,
          true,
        );
      if (this._hass.user?.is_admin)
        entityAction("Reboot host", config.host_reboot_entity, true);
      return actions;
    }
    shortcuts() {
      const shortcuts = [];
      if (this.speed.some((id) => this.state(id))) {
        shortcuts.push(["snapshot", "Connection snapshot", "mdi:clipboard-pulse-outline"]);
        if (this.mode("connection") !== "never")
          shortcuts.push(["refresh", "Refresh history", "mdi:chart-timeline-variant"]);
      }
      const hasDevices = Object.keys(this.reg).length > 0 ||
        Object.entries(this._hass.entities || {}).some(([id, entity]) =>
          id.startsWith("device_tracker.") && scannerPlatforms.has(entity.platform));
      if (!this.sectionHidden("scanner", hasDevices)) {
        shortcuts.push(["find", "Find a device", "mdi:magnify"]);
        shortcuts.push(["activity", "Recent activity", "mdi:timeline-clock-outline"]);
      }
      return shortcuts;
    }

    async runShortcut(shortcut) {
      if (shortcut === "refresh") {
        this.historyRequest = null;
        await this.loadHistory();
        this.root.getElementById("history").scrollIntoView({ block: "nearest" });
        return;
      }
      if (shortcut === "snapshot") {
        const dialog = document.createElement("dialog");
        dialog.className = "theme-dialog snapshot-dialog";
        dialog.setAttribute("aria-label", this.t("Connection snapshot"));
        dialog.innerHTML = '<div class="theme-heading"><strong>Connection snapshot</strong><form method="dialog"><button autofocus>Close</button></form></div><textarea readonly aria-label="Connection summary"></textarea><button type="button" class="select-summary">Select summary</button>';
        this.bindLabels(dialog);
        const summary = dialog.querySelector("textarea");
        const labels = ["Download", "Upload", "Latency"];
        summary.value = [new Date().toLocaleString(this.language), ...this.speed.map((id, index) => {
          const value = this.value(id, index === 2 ? 0 : 1);
          return `${this.t(labels[index])}: ${value === "—" ? this.t("No reading") : value + (index === 2 ? " ms" : " Mbps")}`;
        })].join("\n");
        dialog.querySelector(".select-summary").onclick = () => { summary.focus(); summary.select(); };
        const trigger = this.root.querySelector('[data-network-shortcut="snapshot"]');
        dialog.addEventListener("close", () => { dialog.remove(); trigger?.focus(); }, { once: true });
        this.root.querySelector(".shell").append(dialog);
        dialog.showModal();
        return;
      }
      const scanner = this.root.getElementById("scanner");
      if (scanner.hidden) return;
      const tab = shortcut === "activity" ? "activity" : "devices";
      scanner.querySelector(`[data-tab="${tab}"]`).click();
      scanner.scrollIntoView({ block: "nearest" });
      (tab === "devices" ? this.root.getElementById("scansearch") : scanner.querySelector('[data-tab="activity"]')).focus();
    }

    controlKey(action) {
      return `service:${action.domain}.${action.service}:${action.target || ""}:${action.label}`;
    }

    dashboardCard() {
      if (this.preview || !this._hass?.user?.is_admin) return null;
      for (let node = this.parentNode; node; node = node.parentNode || node.host) {
        if (node.localName !== "hui-panel-view") continue;
        const { lovelace } = node;
        if (lovelace?.mode !== "storage") return null;
        const viewIndex = node.path?.[1] ?? node.index;
        const cards = lovelace.rawConfig?.views?.[viewIndex]?.cards;
        const card = cards?.[0];
        if (cards?.length !== 1 || card?.type !== "custom:yanke-network-control") return null;
        return { lovelace, viewIndex, card };
      }
      return null;
    }

    async savePanelPreferences(panel, selected) {
      const context = this.dashboardCard();
      if (!context) throw Error("Dashboard settings are unavailable.");
      const { lovelace, viewIndex, card } = context;
      const latest = await this._hass.callWS({ type: "lovelace/config", url_path: lovelace.urlPath });
      const cards = latest.views?.[viewIndex]?.cards;
      if (cards?.length !== 1 || JSON.stringify(cards[0]) !== JSON.stringify(card))
        throw Error("The dashboard changed. Close this window and try again.");
      const preferences = { ...(card.panel_preferences ?? this.legacyPanelPreferences) };
      if (selected === null) delete preferences[panel];
      else preferences[panel] = selected;
      cards[0] = { ...cards[0], panel_preferences: preferences };
      await lovelace.saveConfig(latest);
      if (this.isConnected) this.setConfig(cards[0]);
    }

    managePanel(trigger) {
      const panel = trigger.dataset.managePanel;
      const personal = panel === "personal";
      const shortcuts = this.shortcuts();
      const actions = this.actions();
      const defaultSelection = personal ? this.defaultPersonal : [
        ...shortcuts.map(([id]) => "shortcut:" + id),
        ...actions.map((action) => this.controlKey(action)),
      ];
      const selected = new Set(this.panelPreferences[panel] ?? defaultSelection);
      const choices = new Map();
      if (!personal) {
        for (const [id, label] of shortcuts) choices.set("shortcut:" + id, this.t(label));
        for (const action of actions) choices.set(this.controlKey(action), this.t(action.label));
      }
      const domains = personal ? /^(person|device_tracker|sensor|binary_sensor|switch|light|input_boolean|input_number|input_select|input_text|weather|media_player)\./ : /^(button|script|switch)\./;
      for (const [id, state] of Object.entries(this._hass.states)) {
        if (domains.test(id)) choices.set(id, state.attributes.friendly_name || id);
      }
      for (const id of selected) {
        if (!choices.has(id)) choices.set(id, id.replace(/^.*:/, ""));
      }
      const dialog = document.createElement("dialog");
      dialog.className = "theme-dialog panel-manager";
      const title = personal ? "Manage personal devices" : "Manage network controls";
      dialog.setAttribute("aria-label", this.t(title));
      dialog.innerHTML = `<div class="theme-heading"><strong>${title}</strong></div>
        <input type="search" autofocus aria-label="Find an entity or control" placeholder="Search names or entity IDs">
        <div class="manage-choices"></div>
        <div role="status" class="manage-status"></div><div class="manage-footer"><button type="button" data-reset>Restore defaults</button><button type="button" data-cancel>Cancel</button><button type="button" data-save>Save</button></div>`;
      this.bindLabels(dialog);
      const search = dialog.querySelector("input");
      const list = dialog.querySelector(".manage-choices");
      const sorted = [...choices].sort(([a, aLabel], [b, bLabel]) =>
        Number(selected.has(b)) - Number(selected.has(a)) || aLabel.localeCompare(bLabel));
      const render = () => {
        const query = search.value.trim().toLowerCase();
        list.innerHTML = sorted.filter(([id, label]) => `${label} ${id}`.toLowerCase().includes(query))
          .map(([id, label]) => `<label><input type="checkbox" value="${esc(id)}" ${selected.has(id) ? "checked" : ""}><span>${esc(label)}${id.includes(":") ? "" : `<small>${esc(id)}</small>`}</span></label>`)
          .join("") || "<p>" + this.t("No matches") + "</p>";
      };
      list.addEventListener("change", (event) => {
        const { checked, value } = event.target;
        if (checked) selected.add(value);
        else selected.delete(value);
      });
      const save = async (reset) => {
        const buttons = dialog.querySelectorAll("button");
        const status = dialog.querySelector(".manage-status");
        buttons.forEach((button) => { button.disabled = true; });
        status.textContent = this.t("Saving to dashboard…");
        try {
          await this.savePanelPreferences(panel, reset ? null : [...selected]);
          dialog.close();
        } catch (error) {
          status.textContent = this.t(Object.hasOwn(translations, error?.message) ? error.message : "Could not save dashboard settings.");
          buttons.forEach((button) => { button.disabled = false; });
        }
      };
      search.addEventListener("input", render);
      dialog.querySelector("[data-reset]").onclick = () => save(true);
      dialog.querySelector("[data-cancel]").onclick = () => dialog.close();
      dialog.querySelector("[data-save]").onclick = () => save(false);
      dialog.addEventListener("close", () => { dialog.remove(); trigger.focus(); }, { once: true });
      this.root.querySelector(".shell").append(dialog);
      render();
      dialog.showModal();
    }

    renderActions() {
      const selected = this.panelPreferences.controls;
      this.availableActions = this.actions().filter((action) => !selected || selected.includes(this.controlKey(action)));
      for (const id of selected || []) {
        const state = this.state(id);
        const domain = id.split(".")[0];
        const service = { button: "press", script: "turn_on", switch: "toggle" }[domain];
        if (available(state) && service && this._hass.services?.[domain]?.[service])
          this.availableActions.push({ label: state.attributes.friendly_name || id, domain, service, target: id, confirm: true });
        else if (state?.state === "unknown" && domain === "button" && this._hass.services?.button?.press)
          this.availableActions.push({ label: state.attributes.friendly_name || id, domain, service, target: id, confirm: true });
      }
      this.visibleShortcuts = this.shortcuts().filter(([id]) => !selected || selected.includes("shortcut:" + id));
      const shortcuts = this.visibleShortcuts.map(([id, label, icon]) =>
        `<button type="button" data-network-shortcut="${id}"><ha-icon icon="${icon}" aria-hidden="true"></ha-icon>${esc(this.t(label))}</button>`).join("");
      const serviceButtons =
        this.availableActions
          .map((action, index) => {
            const active = this.activeAction === action.label;
            return `<button data-action="${index}" ${this.activeAction ? "disabled" : ""}>${active ? '<span class="spinner" aria-hidden="true"></span>' : ""}${esc(this.t(action.label) + (active ? "…" : ""))}</button>`;
          })
          .join("");
      this.renderMarkup("actions", shortcuts + serviceButtons || '<div class="hint">' + this.t("No network controls configured") + '</div>');
    }
    async runAction(button) {
      const action = this.availableActions[Number(button.dataset.action)];
      if (
        !action ||
        this.activeAction ||
        (action.confirm && !window.confirm(this.t(action.label) + "?"))
      )
        return;
      this.activeAction = action.label;
      this.renderActions();
      const feedback = this.root.getElementById("feedback");
      feedback.textContent = "";
      try {
        await this._hass.callService(
          action.domain,
          action.service,
          action.data,
          action.target ? { entity_id: action.target } : undefined,
        );
        feedback.textContent = this.t("Action requested") + " · " + this.t(action.label);
        if (action.label === "Run speed test") this.loadHistory();
      } catch {
        feedback.textContent =
          this.t(action.label) + " · " + this.t("Action failed. Check the entity and your permissions.");
      } finally {
        this.activeAction = null;
        this.renderActions();
      }
    }
    async loadHistory() {
      if (this.root.getElementById("history").hidden) {
        this.historyRequest = null;
        return;
      }
      const active = this.speed.filter((id) => this.state(id));
      const key = JSON.stringify([this.speed, this.latencyCap, active]);
      if (this.historyRequest?.key === key) return;
      this.historyRequest = null;
      const note = this.root.getElementById("chartnote");
      const axis = [0, 1, 2, 3].map((i) => this.root.getElementById("yl" + i));
      if (!active.length) {
        this.root.getElementById("plot").innerHTML =
          '<div class="empty">' + this.t("Entity not configured") + '</div>';
        axis.forEach((label) => {
          label.textContent = "";
        });
        note.textContent = "";
        return;
      }
      const request = { key };
      this.historyRequest = request;
      let end = Date.now(),
        start = end - 86400000;
      try {
        const rows = await this._hass.callApi(
          "GET",
          `history/period/${new Date(start).toISOString()}?filter_entity_id=${encodeURIComponent(active.join(","))}&end_time=${new Date(end).toISOString()}&minimal_response&no_attributes`,
        );
        if (this.historyRequest !== request) return;
        const series = this.speed.map((id, i) =>
          (rows.find((r) => r[0]?.entity_id === id) || [])
            .map((r) => ({
              t: new Date(r.last_changed || r.last_updated).getTime(),
              v: ["unknown", "unavailable", ""].includes(r.state)
                ? null
                : Number(r.state),
            }))
            .map((p) => ({
              ...p,
              v:
                p.v !== null &&
                Number.isFinite(p.v) &&
                p.v >= 0 &&
                (i !== 2 || p.v <= this.latencyCap)
                  ? p.v
                  : null,
            })),
        );
        if (!series.some((s) => s.some((p) => Number.isFinite(p.v))))
          throw Error("No recorded samples");
        let ymax = Math.max(
            10,
            ...series
              .slice(0, 2)
              .flat()
              .map((p) => p.v || 0),
          ),
          pmax = Math.max(10, ...series[2].map((p) => p.v || 0));
        ymax = Math.ceil(ymax / 10) * 10;
        pmax = Math.min(this.latencyCap, Math.ceil(pmax / 10) * 10);
        const paths = series.map((s, i) => {
          let d = "",
            pen = false;
          s.forEach((p) => {
            if (!Number.isFinite(p.v)) {
              pen = false;
              return;
            }
            let x =
                30 + Math.max(0, Math.min(1, (p.t - start) / 86400000)) * 540,
              y = 150 - (p.v / (i === 2 ? pmax : ymax)) * 138;
            d += (pen ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
            pen = true;
          });
          return `<path d="${d}" fill="none" stroke="${colors[i]}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
        });
        this.root.getElementById("plot").innerHTML =
          `<svg viewBox="0 0 600 160" preserveAspectRatio="none" role="img" aria-label="${esc(this.t("Recorded download, upload and latency over 24 hours"))}">${[12, 81, 150].map((y) => `<line x1="30" x2="570" y1="${y}" y2="${y}" stroke="var(--yanke-line)" stroke-dasharray="3 5"/>`).join("")}${paths.join("")}</svg>`;
        [ymax, 0, pmax, 0].forEach(
          (v, i) => (this.root.getElementById("yl" + i).textContent = v),
        );
        this.root.getElementById("chartnote").textContent =
          this.t("Recorded speed tests · Mbps left / ms right · Latency above {cap} ms omitted").replace("{cap}", this.latencyCap);
      } catch (e) {
        if (this.historyRequest !== request) return;
        axis.forEach((label) => {
          label.textContent = "";
        });
        this.root.getElementById("plot").innerHTML =
          '<div class="empty">' + this.t("History unavailable") + '</div>';
        this.root.getElementById("chartnote").textContent =
          this.t("Latest readings remain above. History retries every 5 minutes.");
      } finally {
        if (this.historyRequest === request) this.historyRequest = null;
      }
    }
    /* ---------- Network scanner ---------- */
    async loadRegistry() {
      if (this.mode("scanner") === "never") return;
      try {
        const all = await this._hass.callWS({
          type: "config/entity_registry/list",
        });
        const reg = {};
        all.forEach((e) => {
          if (e.entity_id.startsWith("device_tracker.") && scannerPlatforms.has(e.platform)) reg[e.entity_id] = e;
        });
        this.reg = reg;
        this.regOk = true;
      } catch (e) {
        this.regOk = false;
      }
      this.update();
      this.renderScan(true);
    }
    scanModel() {
      const h = this._hass,
        ids = new Set(Object.keys(this.reg));
      for (const id in h.states)
        if (
          id.startsWith("device_tracker.") &&
          scannerPlatforms.has(h.entities?.[id]?.platform)
        )
          ids.add(id);
      const legacyMacs = new Set([...ids].filter(id => this.reg[id]?.platform === "nmap_tracker")
        .map(id => String(h.states[id]?.attributes.mac || this.reg[id].unique_id).toLowerCase()));
      const macOwner = Object.create(null);
      for (const d of Object.values(h.devices || {}))
        for (const c of d.connections || [])
          if (c[0] === "mac")
            (macOwner[c[1].toLowerCase()] =
              macOwner[c[1].toLowerCase()] || []).push(d);
      return [...ids]
        .filter(id => this.reg[id]?.platform !== "network_control" ||
          !legacyMacs.has(this.reg[id].unique_id.toLowerCase()))
        .map((id) => {
          const r = this.reg[id] || {},
            s = h.states[id],
            a = s?.attributes || {},
            mac = String(a.mac || r.unique_id || "").toLowerCase();
          const base =
            a.friendly_name && !r.name
              ? a.friendly_name
              : r.original_name ||
                h.devices?.[r.device_id]?.name ||
                id.split(".")[1].replace(/_/g, " ");
          let vendor = String(base)
            .replace(/\s*([0-9A-F]{2}[:_ ]){2,5}[0-9A-F]{2}$/i, "")
            .trim();
          const priv = /^.[26ae]/i.test(mac);
          if (!vendor || /^nmap tracker$/i.test(vendor))
            vendor = this.t(priv ? "Private Wi-Fi address" : "Unknown maker");
          const other = (macOwner[mac] || []).find(
            (d) => d.id !== r.device_id && (d.name_by_user || d.name),
          );
          const suggested = other ? other.name_by_user || other.name : null;
          const custom =
            r.name ||
            (scannerPlatforms.has(h.entities?.[id]?.platform) &&
            !this.regOk &&
            a.friendly_name !== base
              ? a.friendly_name
              : null);
          if (a.ip) this.scan.lastIp[id] = a.ip;
          const ip = a.ip || this.scan.lastIp[id] || "";
          const status =
            r.disabled_by === "integration"
              ? "pending"
              : r.disabled_by
                ? "disabled"
                : s?.state === "home"
                  ? "online"
                  : s?.state === "not_home"
                    ? "offline"
                    : "unknown";
          return {
            id,
            mac,
            ip,
            vendor,
            name:
              custom ||
              suggested ||
              vendor +
                (this.config.show_mac && mac
                  ? " · " + mac.slice(-5).toUpperCase()
                  : ""),
            custom: !!custom,
            suggested: !custom && !!suggested,
            named: !!(custom || suggested),
            status,
            changed: s ? new Date(s.last_changed).getTime() : 0,
            seen: a.last_time_reachable
              ? new Date(a.last_time_reachable).getTime()
              : 0,
          };
        })
        .sort(
          (a, b) =>
            this.ipNum(a.ip) - this.ipNum(b.ip) || a.name.localeCompare(b.name),
        );
    }
    ipNum(ip) {
      const p = String(ip).split(".").map(Number);
      return p.length === 4 && p.every(Number.isFinite)
        ? ((p[0] * 256 + p[1]) * 256 + p[2]) * 256 + p[3]
        : Infinity;
    }
    duration(minutes) {
      const units = [[Math.floor(minutes / 1440), "day"], [Math.floor(minutes / 60) % 24, "hour"], [minutes % 60, "minute"]];
      return units.filter(([n], i) => n || (!minutes && i === 2)).map(([n, unit]) =>
        n.toLocaleString(this.language, { style:"unit", unit, unitDisplay:"narrow" })).join(" ");
    }
    ago(t) {
      if (!t) return "";
      const m = Math.max(0, Math.round((Date.now() - t) / 60000));
      return m < 1 ? this.t("just now") : this.duration(m);
    }
    clock(t) {
      const d = new Date(t),
        today = new Date().toDateString() === d.toDateString();
      return d.toLocaleString(
        this.language,
        today
          ? { hour: "numeric", minute: "2-digit" }
          : {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            },
      );
    }
    renderScan(force) {
      if (!this.root || !this._hass) return;
      const panel = this.root.getElementById("scanner");
      if (this.mode("scanner") === "never") {
        panel.hidden = true;
        return;
      }
      const list = this.root.getElementById("scanlist");
      if (!list) return;
      if (this.scan.editing && !force) return;
      const model = this.scanModel();
      panel.hidden = this.sectionHidden("scanner", model.length > 0);
      if (panel.hidden) return;
      const minute = Math.floor(Date.now() / 60000);
      const sig = JSON.stringify([
        model.map((d) => [d.id, d.status, d.ip, d.name, d.changed]),
        this.scan.tab,
        this.scan.filter,
        this.scan.q,
        this.scan.editing,
        this.scan.events.length,
        minute,
        this.regOk,
      ]);
      if (sig === this.scan.sig && !force) return;
      this.scan.sig = sig;
      this.scan.model = model;
      const tracked = model.filter(
          (d) => d.status !== "pending" && d.status !== "disabled",
        ),
        pend = model.filter((d) => d.status === "pending"),
        count = {
          online: tracked.filter((d) => d.status === "online").length,
          offline: tracked.filter((d) => d.status === "offline").length,
          unnamed: model.filter((d) => !d.custom).length,
        };
      for (const k in count)
        this.root.getElementById("n_" + k).textContent = count[k];
      this.root
        .querySelectorAll(".stat")
        .forEach((b) =>
          b.classList.toggle("on", b.dataset.filter === this.scan.filter),
        );
      this.root
        .querySelectorAll(".tabs button")
        .forEach((b) =>
          b.classList.toggle("on", b.dataset.tab === this.scan.tab),
        );
      this.root.getElementById("pending").innerHTML = pend.length
        ? `<div class="pending"><span><b>${pend.length}</b> ${this.language === "en" ? "new device" + (pend.length > 1 ? "s" : "") + " found, not tracked yet" : this.t("New devices awaiting tracking")}</span><button data-track="all">${this.t("Track all")}</button></div>`
        : "";
      const latest = Math.max(0, ...tracked.map((d) => d.seen));
      this.root.getElementById("scanfoot").textContent = model.length
        ? `${tracked.length} ${this.language === "en" ? "tracked" : this.t("Tracked devices")} · ${this.t("Last sweep")} ${latest ? this.clock(latest) : this.t("Pending")}`
        : "";
      this.root.getElementById("scantag").textContent =
        (this.config.scan_subnet || this.t("Local network")) + " · " + this.t("Live").toLocaleUpperCase(this.language);
      if (this.scan.tab === "activity") {
        list.innerHTML = this.activityMarkup(tracked);
        return;
      }
      const q = this.scan.q,
        f = this.scan.tab === "new" ? "pending" : this.scan.filter;
      const rows = model.filter(
        (d) =>
          (f === "all" || (f === "unnamed" ? !d.custom : d.status === f)) &&
          (!q ||
            (d.name + " " + d.ip + " " + d.mac + " " + d.vendor)
              .toLowerCase()
              .includes(q)),
      );
      rows.sort(
        (a, b) =>
          (a.status === "pending") - (b.status === "pending") ||
          (a.status !== "online") - (b.status !== "online") ||
          0,
      );
      if (this.scan.tab === "new" && !pend.length && this.regOk !== false) {
        list.innerHTML = `<div class="none">${this.t("No new devices awaiting tracking.")}</div>`;
        return;
      }
      if (!model.length) {
        list.innerHTML = `<div class="none">${this.t(this.regOk === false ? "Device list could not be read." : "No devices match this filter.")}</div>`;
        return;
      }
      list.innerHTML = rows.length
        ? rows
            .map((d) => {
              const cls = d.status === "pending" ? "pendingrow" : d.status;
              const when =
                d.status === "online"
                  ? `${this.t("Online")} ${this.ago(d.changed)}`
                  : d.status === "offline"
                    ? `${this.t("Dropped")} · ${this.clock(d.changed)}`
                    : d.status === "pending"
                      ? "Not tracked"
                      : d.status === "disabled"
                        ? "Disabled in Home Assistant"
                        : "No reading";
              const sub = `${esc(d.vendor)}${this.config.show_mac ? " · " + esc(d.mac.toUpperCase()) : ""}${d.status === "offline" && d.seen ? " · " + this.t("Last seen") + " " + esc(this.clock(d.seen)) : ""}`;
              if (this.scan.editing === d.id)
                return `<div class="row ${cls}"><span class="sd"></span><input class="rename" data-id="${esc(d.id)}" value="${esc(d.custom || d.suggested ? d.name : "")}" placeholder="${esc(this.t("Name this device"))} (${esc(d.ip || d.vendor)})" maxlength="60" aria-label="${esc(this.t("Device name"))}"><button class="rowbtn" data-save="${esc(d.id)}">${this.t("Save")}</button><button class="rowbtn" data-cancel="1">${this.t("Cancel")}</button></div>`;
              return `<div class="row ${cls}"><span class="sd" title="${esc(this.t(d.status[0].toUpperCase() + d.status.slice(1)))}"></span><button class="who" ${["pending", "disabled"].includes(d.status) ? "" : `data-entity="${esc(d.id)}"`}><span class="nm">${esc(d.name)}${d.custom ? "" : d.suggested ? "<em>" + this.t("suggested") + "</em>" : "<em>" + this.t("Unnamed").toLocaleLowerCase(this.language) + "</em>"}</span><span class="sub2">${sub}</span></button><div class="addr">${esc(d.ip || "—")}<small>${esc(this.t(when))}</small></div>${d.status === "disabled" ? "" : d.status === "pending" ? `<button class="rowbtn" data-track="${esc(d.id)}">${this.t("Track")}</button>` : `<button class="edit" data-edit="${esc(d.id)}" title="${esc(this.t("Assign a name"))}" aria-label="${esc(this.t("Assign a name"))} · ${esc(d.name)}"><ha-icon icon="mdi:pencil-outline"></ha-icon></button>`}</div>`;
            })
            .join("")
        : `<div class="none">${this.t("No devices match this filter.")}</div>`;
      if (this.scan.editing) {
        const inp = list.querySelector(".rename");
        if (inp && this.root.activeElement !== inp) {
          inp.focus();
          inp.select();
        }
      }
    }
    scanClick(e) {
      const t = e.target.closest(
        "[data-tab],[data-filter],[data-edit],[data-save],[data-cancel],[data-track]",
      );
      if (!t) return e.target.classList?.contains("rename");
      const d = t.dataset;
      if (d.tab) {
        this.scan.tab = d.tab;
        if (d.tab === "activity") this.loadActivity();
      } else if (d.filter) {
        this.scan.filter = this.scan.filter === d.filter ? "all" : d.filter;
        this.scan.tab = "devices";
      } else if (d.edit) {
        this.scan.editing = d.edit;
      } else if (d.cancel) {
        this.scan.editing = null;
      } else if (d.save) {
        this.saveName(d.save, this.root.querySelector(".rename")?.value ?? "");
        return true;
      } else if (d.track) {
        this.track(d.track);
        return true;
      }
      this.renderScan(true);
      return true;
    }
    note(msg) {
      const el = this.root.getElementById("scanerr");
      el.textContent = this.t(msg);
      clearTimeout(this._note);
      if (msg)
        this._note = setTimeout(() => {
          el.textContent = "";
        }, 8000);
    }
    async saveName(id, value) {
      if (this.preview) return;
      const name = String(value).trim() || null;
      try {
        const res = await this._hass.callWS({
          type: "config/entity_registry/update",
          entity_id: id,
          name,
        });
        this.reg[id] = {
          ...(this.reg[id] || {}),
          ...(res.entity_entry || {}),
          name,
        };
        this.note(name ? "Name saved" : "Name cleared");
      } catch (err) {
        console.warn("Network Control: device rename failed", err);
        this.note(
          this.t("Could not save name.") + " " + this.t("Administrator access may be required."),
        );
      }
      this.scan.editing = null;
      this.renderScan(true);
    }
    async track(which) {
      if (this.preview) return;
      await this.loadRegistry();
      if (!this.regOk) {
        this.note("Could not verify which devices are eligible for tracking.");
        return;
      }
      const ids = Object.keys(this.reg).filter(
        (id) =>
          this.reg[id].disabled_by === "integration" &&
          (which === "all" || which === id),
      );
      if (!ids.length) {
        this.note("No new devices to track");
        return;
      }
      try {
        for (const id of ids) {
          const res = await this._hass.callWS({
            type: "config/entity_registry/update",
            entity_id: id,
            disabled_by: null,
          });
          this.reg[id] = {
            ...this.reg[id],
            ...res.entity_entry,
            disabled_by: null,
          };
        }
        this.note("Tracking starts in about 30 seconds");
      } catch (err) {
        console.warn("Network Control: device tracking failed", err);
        this.note(
          this.t("Could not start tracking.") + " " + this.t("Administrator access may be required."),
        );
      }
      this.renderScan(true);
    }
    activityMarkup(tracked) {
      const names = new Map(tracked.map((device) => [device.id, device.name]));
      const cutoff = Date.now() - 86400000;
      this.scan.events = this.scan.events.filter(
        (event) => event.t > cutoff && names.has(event.id),
      );
      const rows = this.scan.events
        .map(
          (e) =>
            `<div class="ev ${e.type}"><i>${this.t(e.type === "drop" ? "Dropped" : "Joined")}</i><b>${esc(names.get(e.id))}</b><span class="t">${esc(this.clock(e.t))} · ${esc(new Intl.RelativeTimeFormat(this.language, { numeric:"auto", style:"short" }).format(-Math.round((Date.now()-e.t)/60000), "minute"))}</span></div>`,
        )
        .join("");
      if (this.activityFailed || this.regOk === false) {
        const last = this.activityUpdated
          ? ` ${this.t("Last successful refresh")}: ${esc(this.clock(this.activityUpdated))}.`
          : "";
        return (
          `<div class="none">${this.t("Activity history unavailable.")}${last}</div>` + rows
        );
      }
      if (!this.activityUpdated)
        return '<div class="none">' + this.t("Loading activity history…") + '</div>';
      return (
        rows ||
        '<div class="none">' + this.t("No devices joined or dropped off in the last 24 hours.") + '</div>'
      );
    }
    async loadActivity() {
      if (this.mode("scanner") === "never") return;
      if (!this._hass || !this.regOk) return;
      const ids = Object.keys(this.reg).filter(
        (id) => !this.reg[id].disabled_by,
      );
      if (!ids.length) {
        this.activityRequest = null;
        this.scan.events = [];
        this.activityFailed = false;
        this.activityUpdated = Date.now();
        this.renderScan(true);
        return;
      }
      const key = JSON.stringify(ids.sort());
      if (this.activityRequest?.key === key) return;
      const request = (this.activityRequest = { key });
      const end = Date.now(),
        start = end - 86400000;
      try {
        const rows = await this._hass.callApi(
          "GET",
          `history/period/${new Date(start).toISOString()}?filter_entity_id=${ids.join(",")}&end_time=${new Date(end).toISOString()}&minimal_response&no_attributes`,
        );
        if (this.activityRequest !== request) return;
        const events = [];
        for (const series of rows) {
          const id = series[0]?.entity_id;
          if (!this.reg[id] || this.reg[id].disabled_by) continue;
          let previous = null;
          series.forEach((point, index) => {
            if (point.state !== "home" && point.state !== "not_home") return;
            const time = new Date(
              point.last_changed || point.last_updated,
            ).getTime();
            const changed = previous
              ? previous !== point.state
              : index > 0 && point.state === "home" && time > start + 60000;
            if (changed && time > start && time <= end)
              events.push({
                id,
                t: time,
                type: point.state === "home" ? "join" : "drop",
              });
            previous = point.state;
          });
        }
        this.scan.events = events.sort((a, b) => b.t - a.t).slice(0, 60);
        this.activityUpdated = Date.now();
        this.activityFailed = false;
      } catch (err) {
        if (this.activityRequest === request) this.activityFailed = true;
      } finally {
        if (this.activityRequest === request) {
          this.activityRequest = null;
          this.renderScan(this.scan.tab === "activity" && !this.scan.editing);
        }
      }
    }
  }
  if (!customElements.get("yanke-network-control")) {
    customElements.define("yanke-network-control", NetworkConsole);
    window.customCards ??= [];
    window.customCards.push({
      type: "yanke-network-control",
      name: "Network Control",
      description: "Network history, presence and infrastructure controls",
      preview: true,
      documentationURL:
        "https://github.com/yanke7/Home-Assistant-Network#customize-in-home-assistant",
    });
  }
})();
