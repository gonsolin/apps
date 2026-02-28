/* ================================================
   WhatsApp Chat Viewer — Main Application v0.2
   Multi-chat architecture with iPad sidebar
   ================================================ */

(function () {
  'use strict';

  // ===================== I18N SYSTEM =====================
  const I18N = {
    fr_FR: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'Glissez votre export WhatsApp (.zip) ici',
      dropHint: 'ou',
      dropButton: 'Choisir des fichiers',
      dropFormats: 'Formats supportés : iOS & Android',
      loadingText: 'Chargement de la conversation...',
      sidebarTitle: 'Discussions',
      sidebarEmpty: 'Ajoutez un export WhatsApp (.zip) avec le bouton +',
      senderPickerTitle: 'Qui êtes-vous ?',
      senderPickerSubtitle: 'Sélectionnez votre nom pour afficher vos messages à droite',
      msgSuffix: 'msg',
      participantsSuffix: 'participants',
      participantsPopupTitle: 'Participants',
      youTag: 'Vous',
      searchPlaceholder: 'Rechercher...',
      searchResult: 'résultat',
      searchResults: 'résultats',
      chatEmptyState: 'Sélectionnez une discussion',
      alertZipOnly: 'Veuillez sélectionner des fichiers .zip',
      alertZipOnlySingle: 'Veuillez sélectionner un fichier .zip',
      alertNoChatFile: 'Aucun fichier de chat trouvé dans le ZIP. Assurez-vous que le fichier contient _chat.txt.',
      alertParseError: 'Impossible de parser le chat. Vérifiez le format du fichier.',
      alertLoadError: 'Erreur lors du chargement du fichier : ',
      mediaImage: '📷 Image non incluse',
      mediaVideo: '🎥 Vidéo non incluse',
      mediaAudio: '🎵 Audio non inclus',
      mediaSticker: '🏷️ Autocollant non inclus',
      mediaDocument: '📄 Document non inclus',
      mediaGif: '🎬 GIF non inclus',
      mediaContact: '👤 Carte de contact non incluse',
      mediaUnknown: '📎 Média non inclus',
      months: ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'],
      howItWorksTitle: 'Comment ça marche ?',
      howStep1Title: 'Préparez l\'archive',
      howStep1Desc: 'Sur votre téléphone, ouvrez WhatsApp → ouvrez la conversation → appuyez sur ⋮ (menu) → « Exporter la discussion » → choisissez « Joindre les médias » (ou sans médias pour un fichier plus léger). Cela crée un fichier .zip.',
      howStep2Title: 'Transférez sur votre ordinateur',
      howStep2Desc: 'Envoyez le fichier .zip par e-mail, AirDrop, Google Drive, câble USB ou tout autre moyen de transfert.',
      howStep3Title: 'Visualisez dans l\'application',
      howStep3Desc: 'Glissez le fichier .zip sur cette page (ou cliquez sur « Choisir des fichiers »). Sélectionnez votre nom dans la liste, et votre conversation s\'affiche exactement comme sur votre téléphone.',
      aboutTitle: 'À propos de l\'auteur',
      releaseTitle: 'Notes de version',
      releaseV02Date: 'Février 2026',
      releaseCurrentLabel: 'Version actuelle',
      releaseV012Date: 'Février 2026',
      releaseV011Date: 'Février 2026',
      releaseV010Date: 'Février 2026',
      releaseInitialLabel: 'Version initiale',
      releaseV02_1: 'Support multilingue (anglais, français, espagnol, italien, allemand, corse)',
      releaseV02_2: 'Page d\'accueil avec sections « Comment ça marche », « À propos » et « Notes de version »',
      releaseV02_3: 'Défilement ticker pour les noms de groupes longs et les noms dans la barre latérale',
      releaseV02_4: 'Numéro de version affiché sur la page d\'accueil',
      releaseV012_1: 'Nom du groupe exclu du sélecteur d\'expéditeur',
      releaseV012_2: 'Horloge en temps réel dans la barre d\'état',
      releaseV012_3: 'Icônes Wi-Fi et batterie en direct reflétant l\'état de l\'appareil',
      releaseV012_4: 'Mentions @en gras avec couleur style WhatsApp',
      releaseV012_5: 'Nombre de participants cliquable affichant la liste complète',
      releaseV012_6: 'Support de l\'upload de plusieurs fichiers sur la page d\'accueil',
      releaseV012_7: 'Ticker d\'actualités pour les noms de chats trop longs (en-tête et barre latérale)',
      releaseV011_1: 'Vue iPad paysage avec panneau latéral gauche',
      releaseV011_2: 'Support de la barre latérale en mode plein écran',
      releaseV011_3: 'Suppression des icônes d\'appel et de paramètres non fonctionnels en mode iPad/plein écran',
      releaseV011_4: 'Détection du nom de groupe et exclusion du sélecteur d\'expéditeur',
      releaseV010_1: 'Visionneuse d\'export de chat WhatsApp (.zip) avec affichage style téléphone',
      releaseV010_2: 'Support des formats d\'export iOS et Android',
      releaseV010_3: 'Bulles de messages avec alignement gauche/droite selon l\'expéditeur sélectionné',
      releaseV010_4: 'Support des médias : images (avec lightbox), vidéos, audio/messages vocaux, documents',
      releaseV010_5: 'Support des chats de groupe avec noms d\'expéditeurs colorés',
      releaseV010_6: 'Fonctionnalité de recherche avec surlignage et navigation',
      releaseV010_7: 'Mode plein écran',
      releaseV010_8: 'Thème sombre WhatsApp',
      releaseV010_9: 'Interface en français',
    },
    en_GB: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'Drop your WhatsApp export (.zip) here',
      dropHint: 'or',
      dropButton: 'Choose files',
      dropFormats: 'Supported formats: iOS & Android',
      loadingText: 'Loading conversation...',
      sidebarTitle: 'Chats',
      sidebarEmpty: 'Add a WhatsApp export (.zip) using the + button',
      senderPickerTitle: 'Who are you?',
      senderPickerSubtitle: 'Select your name to display your messages on the right',
      msgSuffix: 'msg',
      participantsSuffix: 'participants',
      participantsPopupTitle: 'Participants',
      youTag: 'You',
      searchPlaceholder: 'Search...',
      searchResult: 'result',
      searchResults: 'results',
      chatEmptyState: 'Select a chat',
      alertZipOnly: 'Please select .zip files',
      alertZipOnlySingle: 'Please select a .zip file',
      alertNoChatFile: 'No chat file found in the ZIP. Make sure the file contains _chat.txt.',
      alertParseError: 'Unable to parse the chat. Please check the file format.',
      alertLoadError: 'Error loading file: ',
      mediaImage: '📷 Image not included',
      mediaVideo: '🎥 Video not included',
      mediaAudio: '🎵 Audio not included',
      mediaSticker: '🏷️ Sticker not included',
      mediaDocument: '📄 Document not included',
      mediaGif: '🎬 GIF not included',
      mediaContact: '👤 Contact card not included',
      mediaUnknown: '📎 Media not included',
      months: ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],
      howItWorksTitle: 'How it works',
      howStep1Title: 'Prepare the archive',
      howStep1Desc: 'On your phone, open WhatsApp → open the chat → tap ⋮ (menu) → "Export chat" → choose "Include media" (or without media for a smaller file). This creates a .zip file.',
      howStep2Title: 'Transfer to your computer',
      howStep2Desc: 'Send the .zip to yourself via email, AirDrop, Google Drive, USB cable, or any file transfer method.',
      howStep3Title: 'View in the app',
      howStep3Desc: 'Drag the .zip file onto this page (or click "Choose files"). Select your name from the list, and your chat appears exactly as it looked on your phone.',
      aboutTitle: 'About the author',
      releaseTitle: 'Release notes',
      releaseV02Date: 'February 2026',
      releaseCurrentLabel: 'Current version',
      releaseV012Date: 'February 2026',
      releaseV011Date: 'February 2026',
      releaseV010Date: 'February 2026',
      releaseInitialLabel: 'Initial release',
      releaseV02_1: 'Multi-language support (English, French, Spanish, Italian, German, Corsican)',
      releaseV02_2: 'Landing page with "How it works", "About", and "Release notes" sections',
      releaseV02_3: 'News ticker scrolling for long group names and sidebar chat names',
      releaseV02_4: 'Version number displayed on landing page',
      releaseV012_1: 'Group name excluded from sender picker',
      releaseV012_2: 'Real-time clock in status bar',
      releaseV012_3: 'Live WiFi and battery status icons reflecting device state',
      releaseV012_4: '@Mentions displayed in bold with WhatsApp-style colouring',
      releaseV012_5: 'Clickable participant count showing popup with full list',
      releaseV012_6: 'Multiple file upload support on landing page',
      releaseV012_7: 'News ticker for overflowing chat names (header and sidebar)',
      releaseV011_1: 'iPad landscape view with left chat panel sidebar',
      releaseV011_2: 'Sidebar support in fullscreen view',
      releaseV011_3: 'Removed non-functional call and settings icons in iPad/fullscreen modes',
      releaseV011_4: 'Group chat name detection and exclusion from sender picker',
      releaseV010_1: 'WhatsApp chat export (.zip) viewer with phone-style display',
      releaseV010_2: 'Support for iOS and Android export formats',
      releaseV010_3: 'Message bubbles with correct left/right alignment based on sender selection',
      releaseV010_4: 'Media support: images (with lightbox), videos, audio/voice notes, documents',
      releaseV010_5: 'Group chat support with coloured sender names',
      releaseV010_6: 'Search functionality with highlighting and navigation',
      releaseV010_7: 'Fullscreen view mode',
      releaseV010_8: 'WhatsApp dark theme',
      releaseV010_9: 'French UI',
    },
    en_US: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'Drop your WhatsApp export (.zip) here',
      dropHint: 'or',
      dropButton: 'Choose files',
      dropFormats: 'Supported formats: iOS & Android',
      loadingText: 'Loading conversation...',
      sidebarTitle: 'Chats',
      sidebarEmpty: 'Add a WhatsApp export (.zip) using the + button',
      senderPickerTitle: 'Who are you?',
      senderPickerSubtitle: 'Select your name to display your messages on the right',
      msgSuffix: 'msg',
      participantsSuffix: 'participants',
      participantsPopupTitle: 'Participants',
      youTag: 'You',
      searchPlaceholder: 'Search...',
      searchResult: 'result',
      searchResults: 'results',
      chatEmptyState: 'Select a chat',
      alertZipOnly: 'Please select .zip files',
      alertZipOnlySingle: 'Please select a .zip file',
      alertNoChatFile: 'No chat file found in the ZIP. Make sure the file contains _chat.txt.',
      alertParseError: 'Unable to parse the chat. Please check the file format.',
      alertLoadError: 'Error loading file: ',
      mediaImage: '📷 Image not included',
      mediaVideo: '🎥 Video not included',
      mediaAudio: '🎵 Audio not included',
      mediaSticker: '🏷️ Sticker not included',
      mediaDocument: '📄 Document not included',
      mediaGif: '🎬 GIF not included',
      mediaContact: '👤 Contact card not included',
      mediaUnknown: '📎 Media not included',
      months: ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],
      howItWorksTitle: 'How it works',
      howStep1Title: 'Prepare the archive',
      howStep1Desc: 'On your phone, open WhatsApp → open the chat → tap ⋮ (menu) → "Export chat" → choose "Include media" (or without media for a smaller file). This creates a .zip file.',
      howStep2Title: 'Transfer to your computer',
      howStep2Desc: 'Send the .zip to yourself via email, AirDrop, Google Drive, USB cable, or any file transfer method.',
      howStep3Title: 'View in the app',
      howStep3Desc: 'Drag the .zip file onto this page (or click "Choose files"). Select your name from the list, and your chat appears exactly as it looked on your phone.',
      aboutTitle: 'About the author',
      releaseTitle: 'Release notes',
      releaseV02Date: 'February 2026',
      releaseCurrentLabel: 'Current version',
      releaseV012Date: 'February 2026',
      releaseV011Date: 'February 2026',
      releaseV010Date: 'February 2026',
      releaseInitialLabel: 'Initial release',
      releaseV02_1: 'Multi-language support (English, French, Spanish, Italian, German, Corsican)',
      releaseV02_2: 'Landing page with "How it works", "About", and "Release notes" sections',
      releaseV02_3: 'News ticker scrolling for long group names and sidebar chat names',
      releaseV02_4: 'Version number displayed on landing page',
      releaseV012_1: 'Group name excluded from sender picker',
      releaseV012_2: 'Real-time clock in status bar',
      releaseV012_3: 'Live WiFi and battery status icons reflecting device state',
      releaseV012_4: '@Mentions displayed in bold with WhatsApp-style coloring',
      releaseV012_5: 'Clickable participant count showing popup with full list',
      releaseV012_6: 'Multiple file upload support on landing page',
      releaseV012_7: 'News ticker for overflowing chat names (header and sidebar)',
      releaseV011_1: 'iPad landscape view with left chat panel sidebar',
      releaseV011_2: 'Sidebar support in fullscreen view',
      releaseV011_3: 'Removed non-functional call and settings icons in iPad/fullscreen modes',
      releaseV011_4: 'Group chat name detection and exclusion from sender picker',
      releaseV010_1: 'WhatsApp chat export (.zip) viewer with phone-style display',
      releaseV010_2: 'Support for iOS and Android export formats',
      releaseV010_3: 'Message bubbles with correct left/right alignment based on sender selection',
      releaseV010_4: 'Media support: images (with lightbox), videos, audio/voice notes, documents',
      releaseV010_5: 'Group chat support with colored sender names',
      releaseV010_6: 'Search functionality with highlighting and navigation',
      releaseV010_7: 'Fullscreen view mode',
      releaseV010_8: 'WhatsApp dark theme',
      releaseV010_9: 'French UI',
    },
    es_ES: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'Arrastra tu exportación de WhatsApp (.zip) aquí',
      dropHint: 'o',
      dropButton: 'Elegir archivos',
      dropFormats: 'Formatos compatibles: iOS & Android',
      loadingText: 'Cargando conversación...',
      sidebarTitle: 'Chats',
      sidebarEmpty: 'Añade una exportación de WhatsApp (.zip) con el botón +',
      senderPickerTitle: '¿Quién eres tú?',
      senderPickerSubtitle: 'Selecciona tu nombre para ver tus mensajes a la derecha',
      msgSuffix: 'msg',
      participantsSuffix: 'participantes',
      participantsPopupTitle: 'Participantes',
      youTag: 'Tú',
      searchPlaceholder: 'Buscar...',
      searchResult: 'resultado',
      searchResults: 'resultados',
      chatEmptyState: 'Selecciona un chat',
      alertZipOnly: 'Por favor selecciona archivos .zip',
      alertZipOnlySingle: 'Por favor selecciona un archivo .zip',
      alertNoChatFile: 'No se encontró ningún archivo de chat en el ZIP. Asegúrate de que el archivo contiene _chat.txt.',
      alertParseError: 'No se puede analizar el chat. Verifica el formato del archivo.',
      alertLoadError: 'Error al cargar el archivo: ',
      mediaImage: '📷 Imagen no incluida',
      mediaVideo: '🎥 Vídeo no incluido',
      mediaAudio: '🎵 Audio no incluido',
      mediaSticker: '🏷️ Sticker no incluido',
      mediaDocument: '📄 Documento no incluido',
      mediaGif: '🎬 GIF no incluido',
      mediaContact: '👤 Tarjeta de contacto no incluida',
      mediaUnknown: '📎 Archivo multimedia no incluido',
      months: ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'],
      howItWorksTitle: '¿Cómo funciona?',
      howStep1Title: 'Prepara el archivo',
      howStep1Desc: 'En tu teléfono, abre WhatsApp → abre el chat → toca ⋮ (menú) → "Exportar chat" → elige "Incluir archivos multimedia" (o sin multimedia para un archivo más ligero). Esto crea un archivo .zip.',
      howStep2Title: 'Transfiere a tu ordenador',
      howStep2Desc: 'Envíate el .zip por email, AirDrop, Google Drive, cable USB o cualquier método de transferencia.',
      howStep3Title: 'Visualiza en la aplicación',
      howStep3Desc: 'Arrastra el archivo .zip a esta página (o haz clic en "Elegir archivos"). Selecciona tu nombre en la lista y tu chat aparece exactamente como en tu teléfono.',
      aboutTitle: 'Acerca del autor',
      releaseTitle: 'Notas de versión',
      releaseV02Date: 'Febrero 2026',
      releaseCurrentLabel: 'Versión actual',
      releaseV012Date: 'Febrero 2026',
      releaseV011Date: 'Febrero 2026',
      releaseV010Date: 'Febrero 2026',
      releaseInitialLabel: 'Versión inicial',
      releaseV02_1: 'Soporte multilingüe (inglés, francés, español, italiano, alemán, corso)',
      releaseV02_2: 'Página de inicio con secciones "Cómo funciona", "Sobre" y "Notas de versión"',
      releaseV02_3: 'Desplazamiento ticker para nombres de grupos largos y nombres en la barra lateral',
      releaseV02_4: 'Número de versión mostrado en la página de inicio',
      releaseV012_1: 'Nombre del grupo excluido del selector de remitente',
      releaseV012_2: 'Reloj en tiempo real en la barra de estado',
      releaseV012_3: 'Iconos de WiFi y batería en vivo reflejando el estado del dispositivo',
      releaseV012_4: 'Menciones @ en negrita con colores estilo WhatsApp',
      releaseV012_5: 'Recuento de participantes clicable mostrando la lista completa',
      releaseV012_6: 'Soporte de carga múltiple de archivos en la página de inicio',
      releaseV012_7: 'Ticker de noticias para nombres de chats largos (cabecera y barra lateral)',
      releaseV011_1: 'Vista iPad horizontal con panel lateral izquierdo',
      releaseV011_2: 'Soporte de barra lateral en modo pantalla completa',
      releaseV011_3: 'Eliminación de iconos de llamada y ajustes no funcionales en modos iPad/pantalla completa',
      releaseV011_4: 'Detección del nombre del grupo y exclusión del selector de remitente',
      releaseV010_1: 'Visor de exportación de chat WhatsApp (.zip) con visualización estilo teléfono',
      releaseV010_2: 'Soporte para formatos de exportación iOS y Android',
      releaseV010_3: 'Burbujas de mensajes con alineación izquierda/derecha según el remitente seleccionado',
      releaseV010_4: 'Soporte multimedia: imágenes (con lightbox), vídeos, audio/notas de voz, documentos',
      releaseV010_5: 'Soporte de chats de grupo con nombres de remitentes de colores',
      releaseV010_6: 'Función de búsqueda con resaltado y navegación',
      releaseV010_7: 'Modo pantalla completa',
      releaseV010_8: 'Tema oscuro WhatsApp',
      releaseV010_9: 'Interfaz en francés',
    },
    it_IT: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'Trascina il tuo export WhatsApp (.zip) qui',
      dropHint: 'o',
      dropButton: 'Scegli file',
      dropFormats: 'Formati supportati: iOS & Android',
      loadingText: 'Caricamento conversazione...',
      sidebarTitle: 'Chat',
      sidebarEmpty: 'Aggiungi un export WhatsApp (.zip) con il pulsante +',
      senderPickerTitle: 'Chi sei?',
      senderPickerSubtitle: 'Seleziona il tuo nome per visualizzare i tuoi messaggi a destra',
      msgSuffix: 'msg',
      participantsSuffix: 'partecipanti',
      participantsPopupTitle: 'Partecipanti',
      youTag: 'Tu',
      searchPlaceholder: 'Cerca...',
      searchResult: 'risultato',
      searchResults: 'risultati',
      chatEmptyState: 'Seleziona una chat',
      alertZipOnly: 'Seleziona file .zip',
      alertZipOnlySingle: 'Seleziona un file .zip',
      alertNoChatFile: 'Nessun file di chat trovato nel ZIP. Assicurati che il file contenga _chat.txt.',
      alertParseError: 'Impossibile analizzare la chat. Verifica il formato del file.',
      alertLoadError: 'Errore durante il caricamento del file: ',
      mediaImage: '📷 Immagine non inclusa',
      mediaVideo: '🎥 Video non incluso',
      mediaAudio: '🎵 Audio non incluso',
      mediaSticker: '🏷️ Sticker non incluso',
      mediaDocument: '📄 Documento non incluso',
      mediaGif: '🎬 GIF non inclusa',
      mediaContact: '👤 Scheda contatto non inclusa',
      mediaUnknown: '📎 Media non incluso',
      months: ['GENNAIO','FEBBRAIO','MARZO','APRILE','MAGGIO','GIUGNO','LUGLIO','AGOSTO','SETTEMBRE','OTTOBRE','NOVEMBRE','DICEMBRE'],
      howItWorksTitle: 'Come funziona',
      howStep1Title: 'Prepara l\'archivio',
      howStep1Desc: 'Sul tuo telefono, apri WhatsApp → apri la chat → tocca ⋮ (menu) → "Esporta chat" → scegli "Includi media" (o senza media per un file più leggero). Questo crea un file .zip.',
      howStep2Title: 'Trasferisci sul computer',
      howStep2Desc: 'Invia il .zip a te stesso tramite email, AirDrop, Google Drive, cavo USB o qualsiasi metodo di trasferimento.',
      howStep3Title: 'Visualizza nell\'app',
      howStep3Desc: 'Trascina il file .zip su questa pagina (o clicca su "Scegli file"). Seleziona il tuo nome dall\'elenco e la tua chat appare esattamente come sul telefono.',
      aboutTitle: 'Informazioni sull\'autore',
      releaseTitle: 'Note di rilascio',
      releaseV02Date: 'Febbraio 2026',
      releaseCurrentLabel: 'Versione corrente',
      releaseV012Date: 'Febbraio 2026',
      releaseV011Date: 'Febbraio 2026',
      releaseV010Date: 'Febbraio 2026',
      releaseInitialLabel: 'Versione iniziale',
      releaseV02_1: 'Supporto multilingue (inglese, francese, spagnolo, italiano, tedesco, corso)',
      releaseV02_2: 'Pagina iniziale con sezioni "Come funziona", "Info" e "Note di rilascio"',
      releaseV02_3: 'Scorrimento ticker per nomi di gruppo lunghi e nomi nella barra laterale',
      releaseV02_4: 'Numero di versione visualizzato nella pagina iniziale',
      releaseV012_1: 'Nome del gruppo escluso dal selettore mittente',
      releaseV012_2: 'Orologio in tempo reale nella barra di stato',
      releaseV012_3: 'Icone WiFi e batteria in tempo reale che riflettono lo stato del dispositivo',
      releaseV012_4: 'Menzioni @ in grassetto con colori stile WhatsApp',
      releaseV012_5: 'Conteggio partecipanti cliccabile con popup della lista completa',
      releaseV012_6: 'Supporto caricamento file multipli nella pagina iniziale',
      releaseV012_7: 'Ticker di notizie per nomi chat troppo lunghi (intestazione e barra laterale)',
      releaseV011_1: 'Vista iPad orizzontale con pannello laterale sinistro',
      releaseV011_2: 'Supporto barra laterale in modalità schermo intero',
      releaseV011_3: 'Rimozione icone chiamata e impostazioni non funzionali in modalità iPad/schermo intero',
      releaseV011_4: 'Rilevamento nome gruppo ed esclusione dal selettore mittente',
      releaseV010_1: 'Visualizzatore di export chat WhatsApp (.zip) con display stile telefono',
      releaseV010_2: 'Supporto per formati di export iOS e Android',
      releaseV010_3: 'Bolle di messaggi con allineamento sinistra/destra in base al mittente selezionato',
      releaseV010_4: 'Supporto media: immagini (con lightbox), video, audio/note vocali, documenti',
      releaseV010_5: 'Supporto chat di gruppo con nomi mittente colorati',
      releaseV010_6: 'Funzione di ricerca con evidenziazione e navigazione',
      releaseV010_7: 'Modalità schermo intero',
      releaseV010_8: 'Tema scuro WhatsApp',
      releaseV010_9: 'Interfaccia in francese',
    },
    de_DE: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'WhatsApp-Export (.zip) hier ablegen',
      dropHint: 'oder',
      dropButton: 'Dateien auswählen',
      dropFormats: 'Unterstützte Formate: iOS & Android',
      loadingText: 'Konversation wird geladen...',
      sidebarTitle: 'Chats',
      sidebarEmpty: 'Füge einen WhatsApp-Export (.zip) mit der + Schaltfläche hinzu',
      senderPickerTitle: 'Wer bist du?',
      senderPickerSubtitle: 'Wähle deinen Namen aus, um deine Nachrichten rechts anzuzeigen',
      msgSuffix: 'Nachr.',
      participantsSuffix: 'Teilnehmer',
      participantsPopupTitle: 'Teilnehmer',
      youTag: 'Du',
      searchPlaceholder: 'Suchen...',
      searchResult: 'Ergebnis',
      searchResults: 'Ergebnisse',
      chatEmptyState: 'Chat auswählen',
      alertZipOnly: 'Bitte .zip-Dateien auswählen',
      alertZipOnlySingle: 'Bitte eine .zip-Datei auswählen',
      alertNoChatFile: 'Keine Chat-Datei im ZIP gefunden. Stelle sicher, dass die Datei _chat.txt enthält.',
      alertParseError: 'Chat konnte nicht verarbeitet werden. Bitte überprüfe das Dateiformat.',
      alertLoadError: 'Fehler beim Laden der Datei: ',
      mediaImage: '📷 Bild nicht enthalten',
      mediaVideo: '🎥 Video nicht enthalten',
      mediaAudio: '🎵 Audio nicht enthalten',
      mediaSticker: '🏷️ Sticker nicht enthalten',
      mediaDocument: '📄 Dokument nicht enthalten',
      mediaGif: '🎬 GIF nicht enthalten',
      mediaContact: '👤 Visitenkarte nicht enthalten',
      mediaUnknown: '📎 Medien nicht enthalten',
      months: ['JANUAR','FEBRUAR','MÄRZ','APRIL','MAI','JUNI','JULI','AUGUST','SEPTEMBER','OKTOBER','NOVEMBER','DEZEMBER'],
      howItWorksTitle: 'Wie es funktioniert',
      howStep1Title: 'Das Archiv vorbereiten',
      howStep1Desc: 'Öffne auf deinem Telefon WhatsApp → öffne den Chat → tippe auf ⋮ (Menü) → „Chat exportieren" → wähle „Medien einschließen" (oder ohne Medien für eine kleinere Datei). Dadurch wird eine .zip-Datei erstellt.',
      howStep2Title: 'Auf den Computer übertragen',
      howStep2Desc: 'Sende die .zip per E-Mail, AirDrop, Google Drive, USB-Kabel oder eine andere Übertragungsmethode an dich selbst.',
      howStep3Title: 'In der App anzeigen',
      howStep3Desc: 'Ziehe die .zip-Datei auf diese Seite (oder klicke auf „Dateien auswählen"). Wähle deinen Namen aus der Liste – dein Chat erscheint genau so, wie er auf deinem Telefon aussah.',
      aboutTitle: 'Über den Autor',
      releaseTitle: 'Versionshinweise',
      releaseV02Date: 'Februar 2026',
      releaseCurrentLabel: 'Aktuelle Version',
      releaseV012Date: 'Februar 2026',
      releaseV011Date: 'Februar 2026',
      releaseV010Date: 'Februar 2026',
      releaseInitialLabel: 'Erstveröffentlichung',
      releaseV02_1: 'Mehrsprachige Unterstützung (Englisch, Französisch, Spanisch, Italienisch, Deutsch, Korsisch)',
      releaseV02_2: 'Startseite mit Abschnitten „Wie es funktioniert", „Über" und „Versionshinweise"',
      releaseV02_3: 'Ticker-Scrolling für lange Gruppennamen und Namen in der Seitenleiste',
      releaseV02_4: 'Versionsnummer auf der Startseite angezeigt',
      releaseV012_1: 'Gruppenname aus der Absenderauswahl ausgeschlossen',
      releaseV012_2: 'Echtzeituhr in der Statusleiste',
      releaseV012_3: 'Live-WLAN- und Batteriesymbole, die den Gerätestatus widerspiegeln',
      releaseV012_4: '@Erwähnungen fett mit WhatsApp-Farbgebung',
      releaseV012_5: 'Anklickbare Teilnehmeranzahl mit vollständiger Liste',
      releaseV012_6: 'Unterstützung für mehrfachen Datei-Upload auf der Startseite',
      releaseV012_7: 'Newsticker für zu lange Chat-Namen (Kopfzeile und Seitenleiste)',
      releaseV011_1: 'iPad-Querformat mit linkem Chat-Panel',
      releaseV011_2: 'Seitenleistenunterstützung im Vollbildmodus',
      releaseV011_3: 'Nicht funktionsfähige Anruf- und Einstellungssymbole im iPad/Vollbildmodus entfernt',
      releaseV011_4: 'Gruppennamenerkennung und Ausschluss aus der Absenderauswahl',
      releaseV010_1: 'WhatsApp-Chat-Export (.zip) Viewer mit telefonähnlicher Anzeige',
      releaseV010_2: 'Unterstützung für iOS- und Android-Exportformate',
      releaseV010_3: 'Nachrichtenblasen mit korrekter Links/Rechts-Ausrichtung basierend auf der Absenderauswahl',
      releaseV010_4: 'Medienunterstützung: Bilder (mit Lightbox), Videos, Audio/Sprachnachrichten, Dokumente',
      releaseV010_5: 'Gruppenunterstützung mit farbigen Absendernamen',
      releaseV010_6: 'Suchfunktion mit Hervorhebung und Navigation',
      releaseV010_7: 'Vollbildmodus',
      releaseV010_8: 'WhatsApp-Dunkelthema',
      releaseV010_9: 'Französische Benutzeroberfläche',
    },
    co_FR: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'Trascina u to\' esportu WhatsApp (.zip) quì',
      dropHint: 'o',
      dropButton: 'Sceglite i schedari',
      dropFormats: 'Formati supportati: iOS & Android',
      loadingText: 'Caricamentu di a cunversazione...',
      sidebarTitle: 'Discussioni',
      sidebarEmpty: 'Aghjunghjite un esportu WhatsApp (.zip) cù u buttone +',
      senderPickerTitle: 'Chì sì tù?',
      senderPickerSubtitle: 'Sceglite u vostru nome per mustrà i vostri messaghji à diritta',
      msgSuffix: 'msg',
      participantsSuffix: 'participanti',
      participantsPopupTitle: 'Participanti',
      youTag: 'Voi',
      searchPlaceholder: 'Circhà...',
      searchResult: 'risultatu',
      searchResults: 'risultati',
      chatEmptyState: 'Sceglite una discussione',
      alertZipOnly: 'Per piacè sceglite schedari .zip',
      alertZipOnlySingle: 'Per piacè sceglite un schedariu .zip',
      alertNoChatFile: 'Nisunu schedariu di chat trovu in u ZIP. Assicuratevi chì u schedariu cuntene _chat.txt.',
      alertParseError: 'Impussibule d\'analizà u chat. Verificate u formatu di u schedariu.',
      alertLoadError: 'Errore durante u caricamentu di u schedariu: ',
      mediaImage: '📷 Imaghjne micca inclusa',
      mediaVideo: '🎥 Video micca inclusu',
      mediaAudio: '🎵 Audiu micca inclusu',
      mediaSticker: '🏷️ Sticker micca inclusu',
      mediaDocument: '📄 Documentu micca inclusu',
      mediaGif: '🎬 GIF micca inclusu',
      mediaContact: '👤 Carta di cuntattu micca inclusa',
      mediaUnknown: '📎 Media micca inclusu',
      months: ['GHJENNAGHJU','FERRAGHJU','MARZU','APRILE','MAGHJU','GHJUGNU','LUGLIU','AOSTU','SETTEMBRE','UTTOBRE','NUVEMBRE','DICEMBRE'],
      howItWorksTitle: 'Cumu funziona?',
      howStep1Title: 'Pripara l\'archiviu',
      howStep1Desc: 'In u to telefunu, apre WhatsApp → apre a cunversazione → toca ⋮ (menu) → "Esportà u chat" → sceglite "Includite i media" (o senza media per un schedariu più liggeru). Questu crèa un schedariu .zip.',
      howStep2Title: 'Trasferisce à u to ordinatore',
      howStep2Desc: 'Manda u .zip à tè stessu per email, AirDrop, Google Drive, cavu USB o qualsiasi mèzzu di trasferta.',
      howStep3Title: 'Vedete in l\'applicazione',
      howStep3Desc: 'Trascina u schedariu .zip nant\'à sta pagina (o clicca "Sceglite i schedari"). Sceglite u vostru nome in a lista, è u vostru chat appare esattamente cum\'in u to telefunu.',
      aboutTitle: 'À prupòsitu di l\'autore',
      releaseTitle: 'Note di versione',
      releaseV02Date: 'Ferraghju 2026',
      releaseCurrentLabel: 'Versione attuale',
      releaseV012Date: 'Ferraghju 2026',
      releaseV011Date: 'Ferraghju 2026',
      releaseV010Date: 'Ferraghju 2026',
      releaseInitialLabel: 'Prima versione',
      releaseV02_1: 'Supportu multilingue (inglese, francese, spagnolu, italiano, tedescu, corsu)',
      releaseV02_2: 'Pagina d\'accoglienza cù sezioni "Cumu funziona", "À prupòsitu" è "Note di versione"',
      releaseV02_3: 'Scurruta ticker per i nomi di gruppu lunghi è i nomi in a barra laterale',
      releaseV02_4: 'Numeru di versione mustratu in a pagina d\'accoglienza',
      releaseV012_1: 'Nome di gruppu escluso da u selettore di mittente',
      releaseV012_2: 'Orologhju in tempu reale in a barra di statu',
      releaseV012_3: 'Icone WiFi è batteria in direttu chì riflettenu u statu di u dispositivu',
      releaseV012_4: 'Menzzione @ in grassettu cù culori WhatsApp',
      releaseV012_5: 'Cuntaré di participanti clicabile cù lista cumpleta',
      releaseV012_6: 'Supportu caricamentu ficheri multipli in a pagina d\'accoglienza',
      releaseV012_7: 'Ticker di nutizie per i nomi di chat troppu lunghi (intestazione è barra laterale)',
      releaseV011_1: 'Vista iPad in orizzontale cù pannellu laterale mancinu',
      releaseV011_2: 'Supportu barra laterale in modu schermo interu',
      releaseV011_3: 'Eliminazione di icone di chiamata è impostazioni micca funziunali in modu iPad/schermo interu',
      releaseV011_4: 'Rilevazione nome di gruppu è esclusione da u selettore di mittente',
      releaseV010_1: 'Visulaizzatore di esportu chat WhatsApp (.zip) cù visualizazione stile telefunu',
      releaseV010_2: 'Supportu per i formati di esportu iOS è Android',
      releaseV010_3: 'Bolle di messaghji cù allineamentu mancinu/diritta sicondu u mittente sceltu',
      releaseV010_4: 'Supportu media: imaghjne (cù lightbox), video, audiu/note vocale, documenti',
      releaseV010_5: 'Supportu chat di gruppu cù nomi di mittente culori',
      releaseV010_6: 'Funzione di ricerca cù evidenziazione è navigazione',
      releaseV010_7: 'Modu schermo interu',
      releaseV010_8: 'Tema scuru WhatsApp',
      releaseV010_9: 'Interfaccia in francese',
    },
  };

  let currentLocale = 'fr_FR';

  function t(key) {
    return (I18N[currentLocale] && I18N[currentLocale][key] !== undefined)
      ? I18N[currentLocale][key]
      : (I18N['fr_FR'][key] || key);
  }

  function setLocale(locale) {
    if (!I18N[locale]) return;
    currentLocale = locale;
    applyLocale();
    // Update lang picker active state
    document.querySelectorAll('.lang-picker-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.locale === locale);
    });
  }

  function applyLocale() {
    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== undefined) el.textContent = val;
    });
    // Update all data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key);
      if (val !== undefined) el.placeholder = val;
    });
    // Update sidebar empty state if visible
    const sidebarEmptyEl = document.querySelector('.sidebar-empty p');
    if (sidebarEmptyEl) sidebarEmptyEl.textContent = t('sidebarEmpty');
    // Update chat empty state
    const chatEmptyEl = document.querySelector('.chat-empty-state-text');
    if (chatEmptyEl) chatEmptyEl.textContent = t('chatEmptyState');
    // Update loading text
    const loadingTextEl = document.querySelector('.loading-text');
    if (loadingTextEl) loadingTextEl.textContent = t('loadingText');
    // Update sender picker if visible
    const sptEl = document.querySelector('.sender-picker-title');
    if (sptEl) sptEl.textContent = t('senderPickerTitle');
    const spsEl = document.querySelector('.sender-picker-subtitle');
    if (spsEl) spsEl.textContent = t('senderPickerSubtitle');
    // Update participants popup if open
    const ppTitle = document.querySelector('.participants-popup-title');
    if (ppTitle) ppTitle.textContent = t('participantsPopupTitle');
    // Update header status if group chat is active
    const chat = getActiveChat();
    if (chat) {
      const isGroup = chat.senders.length > 2;
      if (isGroup) {
        headerStatus.textContent = chat.senders.length + ' ' + t('participantsSuffix');
      }
      // Refresh header marquee text for group chats
      updateHeaderNameText(chat);
    }
    // Refresh search count if search is open
    if (searchState.results.length > 0 && searchState.isOpen) {
      if (searchState.index >= 0) {
        searchCount.textContent = (searchState.index + 1) + '/' + searchState.results.length;
      } else {
        const n = searchState.results.length;
        searchCount.textContent = n + ' ' + (n !== 1 ? t('searchResults') : t('searchResult'));
      }
    }
    // Refresh picker msg suffix
    document.querySelectorAll('.picker-count').forEach(el => {
      const n = parseInt(el.dataset.count || '0', 10);
      el.textContent = n + ' ' + t('msgSuffix');
    });
    // Refresh "Vous" tag in participants popup
    document.querySelectorAll('.participants-you-tag').forEach(el => {
      el.textContent = t('youTag');
    });
  }

  // ===================== MULTI-CHAT STATE =====================
  const chats = [];
  let activeChatId = null;

  // Search state (per-session, reset on chat switch)
  const searchState = {
    results: [],
    index: -1,
    term: '',
    isOpen: false,
  };

  // Sender name colors for group chats
  const SENDER_COLORS = [
    '#25d366', '#53bdeb', '#e6c84f', '#ff7eb3', '#ff6b6b',
    '#7c4dff', '#ffa726', '#26c6da', '#ef5350', '#66bb6a',
    '#ab47bc', '#29b6f6', '#ec407a', '#8d6e63', '#78909c',
  ];

  // ===================== DOM REFS =====================
  const $ = (id) => document.getElementById(id);
  const dropZoneScreen = $('drop-zone-screen');
  const chatScreen = $('chat-screen');
  const dropZone = $('drop-zone');
  const fileInput = $('file-input');
  const loadingOverlay = $('loading-overlay');
  const chatArea = $('chat-area');
  const messagesContainer = $('messages-container');
  const headerName = $('header-name');
  const headerStatus = $('header-status');
  const stickyDate = $('sticky-date');
  const scrollBottomBtn = $('scroll-bottom-btn');
  const searchBtn = $('search-btn');
  const searchBar = $('search-bar');
  const searchInput = $('search-input');
  const searchCount = $('search-count');
  const searchCloseBtn = $('search-close-btn');
  const searchUpBtn = $('search-up-btn');
  const searchDownBtn = $('search-down-btn');
  const chatHeader = $('chat-header');
  const backBtn = $('back-btn');
  const lightbox = $('lightbox');
  const lightboxImg = $('lightbox-img');
  const lightboxClose = $('lightbox-close');
  const senderPickerOverlay = $('sender-picker');
  const senderPickerList = $('sender-picker-list');
  const sidebar = $('sidebar');
  const sidebarList = $('sidebar-list');
  const sidebarAddBtn = $('sidebar-add-btn');
  const sidebarFileInput = $('sidebar-file-input');
  const chatEmptyState = $('chat-empty-state');
  const ipadFrame = $('ipad-frame');

  // Update status bar time — live clock
  function updateStatusTime() {
    const now = new Date();
    $('status-time').textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }
  updateStatusTime();
  setInterval(updateStatusTime, 10000);

  // Live WiFi icon
  function updateWifiIcon() {
    const wifiSvg = document.querySelector('.status-icons .status-icon:first-child');
    if (!wifiSvg) return;
    const online = navigator.onLine;
    wifiSvg.style.opacity = online ? '1' : '0.3';
  }
  updateWifiIcon();
  window.addEventListener('online', updateWifiIcon);
  window.addEventListener('offline', updateWifiIcon);
  if (navigator.connection) {
    navigator.connection.addEventListener('change', updateWifiIcon);
  }

  // Live Battery icon
  function updateBatteryIcon(battery) {
    const battSvg = document.querySelector('.status-icons .status-icon:last-child');
    if (!battSvg) return;
    const level = battery.level;
    const charging = battery.charging;
    const fillHeight = Math.round(level * 14);
    const fillY = 6 + (14 - fillHeight);
    const fillColor = level <= 0.2 ? '#ef5350' : (charging ? '#25d366' : 'currentColor');
    battSvg.innerHTML = '<rect x="7" y="4" width="10" height="18" rx="1" ry="1" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
      '<rect x="10" y="2" width="4" height="2" rx="0.5" fill="currentColor"/>' +
      '<rect x="8.5" y="' + fillY + '" width="7" height="' + fillHeight + '" rx="0.5" fill="' + fillColor + '"/>' +
      (charging ? '<path d="M12 10l-2 4h2l-1 3 3-4h-2l1-3z" fill="#fff" opacity="0.9"/>' : '');
  }
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      updateBatteryIcon(battery);
      battery.addEventListener('levelchange', () => updateBatteryIcon(battery));
      battery.addEventListener('chargingchange', () => updateBatteryIcon(battery));
    });
  }

  // ===================== CHUNK RENDERING CONFIG =====================
  const CHUNK_SIZE = 100;
  const INITIAL_RENDER = 150;
  let allRenderedElements = [];
  let topLoadingMore = false;

  // ===================== HELPERS =====================
  function getActiveChat() {
    return chats.find(c => c.id === activeChatId) || null;
  }

  function generateId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  // ===================== FILE DROP / UPLOAD (main drop zone) =====================
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) handleMultipleFiles(files);
  });

  dropZone.addEventListener('click', (e) => {
    if (e.target.closest('.file-input-btn')) return;
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleMultipleFiles(e.target.files);
  });

  // Sidebar add button
  sidebarAddBtn.addEventListener('click', () => {
    sidebarFileInput.click();
  });

  sidebarFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
    sidebarFileInput.value = '';
  });

  // ===================== MULTIPLE FILE HANDLER =====================
  let fileQueue = [];
  let processingQueue = false;

  async function handleMultipleFiles(fileList) {
    const zipFiles = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.zip'));
    if (zipFiles.length === 0) {
      alert(t('alertZipOnly'));
      return;
    }
    fileQueue.push(...zipFiles);
    if (!processingQueue) {
      processingQueue = true;
      while (fileQueue.length > 0) {
        const file = fileQueue.shift();
        await handleFile(file);
        if (pendingChat) {
          await new Promise(resolve => {
            const check = setInterval(() => {
              if (!pendingChat) {
                clearInterval(check);
                resolve();
              }
            }, 200);
          });
        }
      }
      processingQueue = false;
    }
  }

  // ===================== MAIN FILE HANDLER =====================
  let pendingChat = null;

  async function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      alert(t('alertZipOnlySingle'));
      return;
    }

    loadingOverlay.classList.remove('hidden');

    try {
      const zip = await JSZip.loadAsync(file);
      let chatText = null;
      const mediaEntries = {};

      zip.forEach((relativePath, entry) => {
        if (entry.dir) return;
        const name = relativePath.split('/').pop();
        const nameLower = name.toLowerCase();

        if (nameLower === '_chat.txt' || nameLower === 'chat.txt' || nameLower.endsWith('_chat.txt') || nameLower === 'whatsapp chat.txt') {
          chatText = entry;
        } else {
          mediaEntries[name] = { zipEntry: entry, blobUrl: null };
          if (relativePath !== name) {
            mediaEntries[relativePath] = { zipEntry: entry, blobUrl: null };
          }
        }
      });

      if (!chatText) {
        zip.forEach((relativePath, entry) => {
          if (!entry.dir && relativePath.toLowerCase().endsWith('.txt')) {
            if (!chatText) chatText = entry;
          }
        });
      }

      if (!chatText) {
        alert(t('alertNoChatFile'));
        loadingOverlay.classList.add('hidden');
        return;
      }

      const text = await chatText.async('string');
      const messages = parseWhatsAppChat(text);

      if (messages.length === 0) {
        alert(t('alertParseError'));
        loadingOverlay.classList.add('hidden');
        return;
      }

      const senderSet = new Set();
      for (const msg of messages) {
        if (msg.sender && !msg.isSystem) senderSet.add(msg.sender);
      }
      const senders = Array.from(senderSet);

      let detectedGroupName = null;
      for (const msg of messages) {
        const fullText = msg.text || '';
        const gm = fullText.match(/created group \u201c(.+?)\u201d/i) ||
                   fullText.match(/created group "(.+?)"/i) ||
                   fullText.match(/a cr\u00e9\u00e9 le groupe \u201c(.+?)\u201d/i) ||
                   fullText.match(/a créé le groupe "(.+?)"/i) ||
                   fullText.match(/changed the subject.*to \u201c(.+?)\u201d/i) ||
                   fullText.match(/changed the subject.*to "(.+?)"/i) ||
                   fullText.match(/a modifié l'objet.*en \u201c(.+?)\u201d/i) ||
                   fullText.match(/a modifié l'objet.*en "(.+?)"/i) ||
                   fullText.match(/changed the group name to \u201c(.+?)\u201d/i) ||
                   fullText.match(/changed the group name to "(.+?)"/i) ||
                   fullText.match(/(?:named the group|group named) \u201c(.+?)\u201d/i) ||
                   fullText.match(/(?:named the group|group named) "(.+?)"/i);
        if (gm) {
          detectedGroupName = gm[1];
        }
      }

      if (!detectedGroupName && chatText.name) {
        const fnm = chatText.name.match(/WhatsApp Chat (?:with|con|avec|mit) (.+)\.txt$/i);
        if (fnm) {
          detectedGroupName = fnm[1].trim();
        }
      }

      let filteredSenders = senders;
      if (detectedGroupName) {
        const gnLower = detectedGroupName.toLowerCase();
        filteredSenders = senders.filter(s => s.toLowerCase() !== gnLower);
      }
      if (filteredSenders.length > 2) {
        const senderMsgCounts = {};
        for (const msg of messages) {
          if (msg.sender && !msg.isSystem) {
            senderMsgCounts[msg.sender] = (senderMsgCounts[msg.sender] || 0) + 1;
          }
        }
        filteredSenders = filteredSenders.filter(s => (senderMsgCounts[s] || 0) > 0);
      }

      pendingChat = {
        id: generateId(),
        messages: messages,
        mediaFiles: mediaEntries,
        chatName: '',
        senders: filteredSenders,
        allSenders: senders,
        detectedGroupName: detectedGroupName,
        mySender: null,
        senderColors: {},
        renderedRange: { start: 0, end: 0 },
        lastMessage: '',
        lastTime: '',
      };

      const lastMsg = messages.filter(m => !m.isSystem && m.sender).pop();
      if (lastMsg) {
        pendingChat.lastMessage = (lastMsg.text || '').slice(0, 60);
        pendingChat.lastTime = lastMsg.timeStr;
      }

      showSenderPicker(pendingChat);

    } catch (err) {
      console.error('Error loading ZIP:', err);
      alert(t('alertLoadError') + err.message);
    }

    loadingOverlay.classList.add('hidden');
  }

  // ===================== SENDER PICKER =====================
  function showSenderPicker(chat) {
    senderPickerList.innerHTML = '';

    const counts = {};
    for (const msg of chat.messages) {
      if (msg.sender && !msg.isSystem) {
        counts[msg.sender] = (counts[msg.sender] || 0) + 1;
      }
    }

    for (const sender of chat.senders) {
      const btn = document.createElement('button');
      btn.className = 'sender-picker-btn';

      const initials = sender.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
      const count = counts[sender] || 0;

      btn.innerHTML =
        '<span class="picker-avatar">' + escapeHtml(initials) + '</span>' +
        '<span class="picker-name">' + escapeHtml(sender) + '</span>' +
        '<span class="picker-count" data-count="' + count + '">' + count + ' ' + t('msgSuffix') + '</span>';

      btn.addEventListener('click', () => selectSender(sender));
      senderPickerList.appendChild(btn);
    }

    senderPickerOverlay.classList.remove('hidden');
  }

  function selectSender(sender) {
    if (!pendingChat) return;

    pendingChat.mySender = sender;
    senderPickerOverlay.classList.add('hidden');

    pendingChat.senderColors = {};
    let colorIdx = 0;
    for (const s of pendingChat.senders) {
      if (s === sender) continue;
      pendingChat.senderColors[s] = SENDER_COLORS[colorIdx % SENDER_COLORS.length];
      colorIdx++;
    }

    extractChatName(pendingChat);

    chats.push(pendingChat);

    if (!chatScreen.classList.contains('active')) {
      dropZoneScreen.classList.remove('active');
      chatScreen.classList.add('active');
    }

    refreshSidebar();
    setActiveChat(pendingChat.id);

    pendingChat = null;
  }

  function extractChatName(chat) {
    if (chat.detectedGroupName) {
      chat.chatName = chat.detectedGroupName;
      return;
    }

    const isGroup = chat.senders.length > 2;

    for (const msg of chat.messages) {
      if (msg.isSystem) {
        const m = msg.text.match(/created group "(.+?)"/i) ||
                  msg.text.match(/a créé le groupe "(.+?)"/i) ||
                  msg.text.match(/changed the subject.*to "(.+?)"/i) ||
                  msg.text.match(/a modifié l'objet.*en "(.+?)"/i);
        if (m) {
          chat.chatName = m[1];
          return;
        }
      }
    }

    if (isGroup) {
      const others = chat.senders.filter(s => s !== chat.mySender);
      chat.chatName = others.slice(0, 3).join(', ') + (others.length > 3 ? '...' : '');
    } else {
      const other = chat.senders.find(s => s !== chat.mySender);
      chat.chatName = other || chat.mySender || 'Chat';
    }
  }

  // ===================== HEADER NAME TEXT FOR GROUP CHATS =====================
  function updateHeaderNameText(chat) {
    if (!chat) return;
    const isGroup = chat.senders.length > 2;
    if (isGroup) {
      // Show full title AND all members in ticker
      headerName.textContent = chat.chatName + ' — ' + chat.senders.join(', ');
    } else {
      headerName.textContent = chat.chatName;
    }
    setupHeaderMarquee();
  }

  // ===================== SIDEBAR =====================
  function refreshSidebar() {
    sidebarList.innerHTML = '';

    if (chats.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sidebar-empty';
      empty.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg><p>' + escapeHtml(t('sidebarEmpty')) + '</p>';
      sidebarList.appendChild(empty);
      return;
    }

    for (const chat of chats) {
      const item = document.createElement('div');
      item.className = 'sidebar-chat-item' + (chat.id === activeChatId ? ' active' : '');
      item.dataset.chatId = chat.id;

      const initials = chat.chatName.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();

      let preview = chat.lastMessage || '';
      let time = chat.lastTime || '';
      if (!preview) {
        const lastMsg = chat.messages.filter(m => !m.isSystem && m.sender).pop();
        if (lastMsg) {
          preview = lastMsg.text ? lastMsg.text.slice(0, 60) : (lastMsg.media ? '📎 Média' : '');
          time = lastMsg.timeStr;
        }
      }

      item.innerHTML =
        '<div class="sidebar-chat-avatar">' + escapeHtml(initials) + '</div>' +
        '<div class="sidebar-chat-info">' +
          '<div class="sidebar-chat-top">' +
            '<span class="sidebar-chat-name">' + escapeHtml(chat.chatName) + '</span>' +
            '<span class="sidebar-chat-time">' + escapeHtml(time) + '</span>' +
          '</div>' +
          '<div class="sidebar-chat-preview">' + escapeHtml(preview) + '</div>' +
        '</div>';

      item.addEventListener('click', () => setActiveChat(chat.id));
      sidebarList.appendChild(item);

      // Check if chat name overflows and needs marquee
      requestAnimationFrame(() => {
        const nameEl = item.querySelector('.sidebar-chat-name');
        if (nameEl && nameEl.scrollWidth > nameEl.clientWidth + 2) {
          nameEl.classList.add('sidebar-marquee');
          const offset = -(nameEl.scrollWidth - nameEl.clientWidth);
          nameEl.style.setProperty('--sidebar-marquee-offset', offset + 'px');
          const duration = Math.max(4, nameEl.scrollWidth / 25);
          nameEl.style.setProperty('--sidebar-marquee-duration', duration + 's');
        }
      });
    }
  }

  // ===================== ACTIVATE A CHAT =====================
  function setActiveChat(chatId) {
    activeChatId = chatId;
    const chat = getActiveChat();
    if (!chat) return;

    closeSearch();

    sidebarList.querySelectorAll('.sidebar-chat-item').forEach(el => {
      el.classList.toggle('active', el.dataset.chatId === chatId);
    });

    // Update header — group chats show name + all members in ticker
    updateHeaderNameText(chat);

    const isGroup = chat.senders.length > 2;
    headerStatus.textContent = isGroup ? chat.senders.length + ' ' + t('participantsSuffix') : '';
    headerStatus.classList.toggle('clickable-participants', isGroup);
    headerStatus.onclick = isGroup ? () => showParticipantsPopup(chat) : null;

    chatArea.classList.remove('hidden');
    chatHeader.classList.remove('hidden');
    chatEmptyState.classList.add('hidden');

    renderMessages(chat);

    requestAnimationFrame(() => {
      chatArea.scrollTop = chatArea.scrollHeight;
    });
  }

  // ===================== SHOW CHAT SCREEN (from drop zone) =====================
  function showChatScreen() {
    dropZoneScreen.classList.remove('active');
    chatScreen.classList.add('active');
  }

  // ===================== VIRTUAL / CHUNK RENDERING =====================
  function renderMessages(chat) {
    messagesContainer.innerHTML = '';
    allRenderedElements = [];

    const total = chat.messages.length;
    const startIdx = Math.max(0, total - INITIAL_RENDER);
    chat.renderedRange = { start: startIdx, end: total };

    renderChunk(chat, startIdx, total);

    chatArea.removeEventListener('scroll', handleScroll);
    chatArea.addEventListener('scroll', handleScroll, { passive: true });
  }

  function renderChunk(chat, start, end) {
    const fragment = document.createDocumentFragment();
    let prevDate = null;
    let prevSender = null;

    if (start > 0) {
      prevDate = getDateKey(chat.messages[start - 1].date);
    }

    for (let i = start; i < end; i++) {
      const msg = chat.messages[i];
      const currentDateKey = getDateKey(msg.date);

      if (currentDateKey !== prevDate) {
        const sep = createDateSeparator(msg.dateStr, currentDateKey);
        fragment.appendChild(sep);
        prevDate = currentDateKey;
        prevSender = null;
      }

      const el = createMessageElement(msg, prevSender, chat);
      el.dataset.msgId = i;
      fragment.appendChild(el);
      allRenderedElements.push({ idx: i, el });
      prevSender = msg.sender;
    }

    if (start < chat.renderedRange.start || messagesContainer.children.length === 0) {
      const scrollHeightBefore = messagesContainer.scrollHeight;
      messagesContainer.prepend(fragment);
      const diff = messagesContainer.scrollHeight - scrollHeightBefore;
      chatArea.scrollTop += diff;
    } else {
      messagesContainer.appendChild(fragment);
    }
  }

  function handleScroll() {
    const chat = getActiveChat();
    if (!chat) return;

    const scrollTop = chatArea.scrollTop;
    const scrollHeight = chatArea.scrollHeight;
    const clientHeight = chatArea.clientHeight;

    if (scrollTop < 200 && chat.renderedRange.start > 0 && !topLoadingMore) {
      topLoadingMore = true;
      const newStart = Math.max(0, chat.renderedRange.start - CHUNK_SIZE);
      const oldStart = chat.renderedRange.start;
      chat.renderedRange.start = newStart;
      renderChunk(chat, newStart, oldStart);
      topLoadingMore = false;
    }

    if (scrollHeight - scrollTop - clientHeight > 300) {
      scrollBottomBtn.classList.remove('hidden');
    } else {
      scrollBottomBtn.classList.add('hidden');
    }

    updateStickyDate();
  }

  function updateStickyDate() {
    const containers = messagesContainer.children;
    const areaRect = chatArea.getBoundingClientRect();
    let currentDate = null;

    for (let i = 0; i < containers.length; i++) {
      const el = containers[i];
      if (el.classList.contains('date-separator')) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= areaRect.top + 40) {
          currentDate = el.dataset.dateLabel;
        } else {
          break;
        }
      }
    }

    if (currentDate) {
      stickyDate.textContent = currentDate;
      stickyDate.classList.remove('hidden');
    } else {
      stickyDate.classList.add('hidden');
    }
  }

  function getDateKey(date) {
    if (!(date instanceof Date) || isNaN(date)) return 'unknown';
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  // ===================== CREATE DOM ELEMENTS =====================
  function createDateSeparator(label, dateKey) {
    const div = document.createElement('div');
    div.className = 'date-separator';
    div.dataset.dateLabel = label;
    div.dataset.dateKey = dateKey;
    div.innerHTML = '<span class="date-separator-pill">' + escapeHtml(label) + '</span>';
    return div;
  }

  function createMessageElement(msg, prevSender, chat) {
    if (msg.isSystem) {
      const div = document.createElement('div');
      div.className = 'system-message';
      div.innerHTML = '<span class="system-message-text">' + escapeHtml(msg.text) + '</span>';
      return div;
    }

    const isOutgoing = msg.sender === chat.mySender;
    const isGroup = chat.senders.length > 2;
    const showTail = msg.sender !== prevSender;

    const row = document.createElement('div');
    row.className = 'message-row ' + (isOutgoing ? 'outgoing' : 'incoming') + (showTail ? ' has-tail' : '');

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    if (isGroup && !isOutgoing && showTail) {
      const sName = document.createElement('span');
      sName.className = 'sender-name';
      sName.textContent = msg.sender;
      sName.style.color = chat.senderColors[msg.sender] || SENDER_COLORS[0];
      bubble.appendChild(sName);
    }

    if (msg.media) {
      const mediaEl = createMediaElement(msg.media, chat);
      bubble.appendChild(mediaEl);
    }

    if (msg.text && msg.text.trim()) {
      const textSpan = document.createElement('span');
      textSpan.className = 'message-text';
      textSpan.innerHTML = linkify(escapeHtml(msg.text));
      bubble.appendChild(textSpan);
    }

    const meta = document.createElement('span');
    meta.className = 'message-meta';
    const timeEl = document.createElement('span');
    timeEl.className = 'message-time';
    timeEl.textContent = msg.timeStr;
    meta.appendChild(timeEl);

    if (isOutgoing) {
      const check = document.createElement('span');
      check.className = 'message-check';
      check.innerHTML = '<svg viewBox="0 0 16 11" fill="currentColor"><path d="M11.07.66L5.71 6.04 3.54 3.87l-1.41 1.41L5.71 8.87l6.78-6.78z"/><path d="M7.71 8.87l6.78-6.78-1.41-1.41-5.39 5.38-.7-.71-1.41 1.41z"/></svg>';
      meta.appendChild(check);
    }
    bubble.appendChild(meta);

    row.appendChild(bubble);
    return row;
  }

  function createMediaElement(media, chat) {
    if (media.type === 'omitted') {
      const div = document.createElement('div');
      div.className = 'media-omitted';
      const labels = {
        image: t('mediaImage'),
        video: t('mediaVideo'),
        audio: t('mediaAudio'),
        sticker: t('mediaSticker'),
        document: t('mediaDocument'),
        gif: t('mediaGif'),
        contact: t('mediaContact'),
        unknown: t('mediaUnknown'),
      };
      div.textContent = labels[media.mediaType] || labels.unknown;
      return div;
    }

    const entry = findMediaFile(media.filename, chat);

    if (media.mediaType === 'image') {
      const container = document.createElement('div');
      container.className = 'media-container';
      const img = document.createElement('img');
      img.alt = media.filename;
      img.loading = 'lazy';

      if (entry) {
        img.dataset.filename = media.filename;
        img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="260" height="180"><rect fill="#1a2a33" width="260" height="180"/><text fill="#5a6a73" x="130" y="95" text-anchor="middle" font-size="13">Chargement...</text></svg>');
        loadMediaBlob(media.filename, entry).then(url => {
          img.src = url;
        });
        img.addEventListener('click', () => openLightbox(img.src));
      } else {
        img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="260" height="180"><rect fill="#1a2a33" width="260" height="180"/><text fill="#5a6a73" x="130" y="95" text-anchor="middle" font-size="13">Image non disponible</text></svg>');
      }
      container.appendChild(img);
      return container;
    }

    if (media.mediaType === 'video') {
      const container = document.createElement('div');
      container.className = 'media-container';
      const video = document.createElement('video');
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;

      if (entry) {
        loadMediaBlob(media.filename, entry).then(url => {
          video.src = url;
        });
      }
      container.appendChild(video);
      return container;
    }

    if (media.mediaType === 'audio') {
      const container = document.createElement('div');
      container.className = 'voice-note';

      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      const playBtn = document.createElement('button');
      playBtn.className = 'voice-note-btn';
      playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

      const waveContainer = document.createElement('div');
      waveContainer.className = 'voice-note-wave';
      const barCount = 30;
      for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'voice-note-bar';
        const h = 4 + Math.random() * 20;
        bar.style.height = h + 'px';
        waveContainer.appendChild(bar);
      }

      const durationEl = document.createElement('span');
      durationEl.className = 'voice-note-duration';
      durationEl.textContent = '0:00';

      if (entry) {
        loadMediaBlob(media.filename, entry).then(url => {
          audio.src = url;
          audio.addEventListener('loadedmetadata', () => {
            const dur = audio.duration;
            if (isFinite(dur)) {
              const m = Math.floor(dur / 60);
              const s = Math.floor(dur % 60);
              durationEl.textContent = m + ':' + String(s).padStart(2, '0');
            }
          });
        });
      }

      let isPlaying = false;
      playBtn.addEventListener('click', () => {
        if (isPlaying) {
          audio.pause();
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        } else {
          audio.play().catch(() => {});
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        }
        isPlaying = !isPlaying;
      });

      audio.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        waveContainer.querySelectorAll('.voice-note-bar').forEach(b => b.classList.remove('played'));
      });

      audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        const progress = audio.currentTime / audio.duration;
        const bars = waveContainer.querySelectorAll('.voice-note-bar');
        const activeCount = Math.floor(progress * bars.length);
        bars.forEach((b, idx) => {
          if (idx < activeCount) b.classList.add('played');
          else b.classList.remove('played');
        });
      });

      container.appendChild(playBtn);
      container.appendChild(waveContainer);
      container.appendChild(durationEl);
      container.appendChild(audio);
      audio.style.display = 'none';
      return container;
    }

    const docDiv = document.createElement('div');
    docDiv.className = 'document-attachment';

    const ext = media.filename.split('.').pop().toUpperCase();
    const iconDiv = document.createElement('div');
    iconDiv.className = 'document-icon';
    iconDiv.textContent = ext;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'document-info';
    const nameSpan = document.createElement('div');
    nameSpan.className = 'document-name';
    nameSpan.textContent = media.filename;
    const sizeSpan = document.createElement('div');
    sizeSpan.className = 'document-size';
    sizeSpan.textContent = 'Document';

    infoDiv.appendChild(nameSpan);
    infoDiv.appendChild(sizeSpan);
    docDiv.appendChild(iconDiv);
    docDiv.appendChild(infoDiv);

    return docDiv;
  }

  function findMediaFile(filename, chat) {
    if (!filename) return null;
    const mf = chat.mediaFiles;

    if (mf[filename]) return mf[filename];

    const baseName = filename.split('/').pop();
    if (mf[baseName]) return mf[baseName];

    const filenameLower = filename.toLowerCase();
    for (const key in mf) {
      if (key.toLowerCase() === filenameLower || key.split('/').pop().toLowerCase() === filenameLower) {
        return mf[key];
      }
    }

    const nameWithoutExt = baseName.replace(/\.\w+$/, '').toLowerCase();
    for (const key in mf) {
      const keyBase = key.split('/').pop().replace(/\.\w+$/, '').toLowerCase();
      if (keyBase === nameWithoutExt) {
        return mf[key];
      }
    }

    return null;
  }

  async function loadMediaBlob(filename, entry) {
    if (entry.blobUrl) return entry.blobUrl;

    try {
      const blob = await entry.zipEntry.async('blob');
      const url = URL.createObjectURL(blob);
      entry.blobUrl = url;
      return url;
    } catch (e) {
      console.error('Error loading media:', filename, e);
      return '';
    }
  }

  // ===================== LIGHTBOX =====================
  function openLightbox(src) {
    if (!src || src.startsWith('data:')) return;
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
  }

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add('hidden');
      lightboxImg.src = '';
    }
  });

  // ===================== SEARCH =====================
  searchBtn.addEventListener('click', () => {
    searchState.isOpen = true;
    chatHeader.classList.add('hidden');
    searchBar.classList.remove('hidden');
    searchInput.focus();
  });

  searchCloseBtn.addEventListener('click', closeSearch);

  function closeSearch() {
    searchState.isOpen = false;
    searchBar.classList.add('hidden');
    chatHeader.classList.remove('hidden');
    searchInput.value = '';
    searchCount.textContent = '';
    searchState.results = [];
    searchState.index = -1;
    searchState.term = '';
    clearSearchHighlights();
  }

  searchInput.addEventListener('input', debounce(() => {
    const term = searchInput.value.trim();
    if (term.length < 2) {
      clearSearchHighlights();
      searchCount.textContent = '';
      searchState.results = [];
      searchState.index = -1;
      searchState.term = '';
      return;
    }
    performSearch(term);
  }, 300));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) navigateSearch(-1);
      else navigateSearch(1);
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });

  searchUpBtn.addEventListener('click', () => navigateSearch(-1));
  searchDownBtn.addEventListener('click', () => navigateSearch(1));

  function performSearch(term) {
    const chat = getActiveChat();
    if (!chat) return;

    searchState.term = term;
    searchState.results = [];
    const lower = term.toLowerCase();

    for (let i = 0; i < chat.messages.length; i++) {
      const msg = chat.messages[i];
      if (msg.text && msg.text.toLowerCase().includes(lower)) {
        searchState.results.push(i);
      }
    }

    const n = searchState.results.length;
    searchCount.textContent = n + ' ' + (n !== 1 ? t('searchResults') : t('searchResult'));

    highlightSearchResults();

    if (searchState.results.length > 0) {
      searchState.index = searchState.results.length - 1;
      scrollToSearchResult(searchState.index);
    } else {
      searchState.index = -1;
    }
  }

  function highlightSearchResults() {
    clearSearchHighlights();
    if (!searchState.term) return;

    const elements = messagesContainer.querySelectorAll('.message-text');
    const term = searchState.term;
    const regex = new RegExp('(' + escapeRegex(term) + ')', 'gi');

    elements.forEach(el => {
      const original = el.textContent;
      if (original.toLowerCase().includes(term.toLowerCase())) {
        el.innerHTML = linkify(escapeHtml(original).replace(regex, '<mark class="search-highlight">$1</mark>'));
      }
    });
  }

  function clearSearchHighlights() {
    const elements = messagesContainer.querySelectorAll('.message-text');
    elements.forEach(el => {
      if (el.querySelector('.search-highlight')) {
        const text = el.textContent;
        el.innerHTML = linkify(escapeHtml(text));
      }
    });
  }

  function navigateSearch(direction) {
    if (searchState.results.length === 0) return;

    searchState.index += direction;
    if (searchState.index < 0) searchState.index = searchState.results.length - 1;
    if (searchState.index >= searchState.results.length) searchState.index = 0;

    searchCount.textContent = (searchState.index + 1) + '/' + searchState.results.length;
    scrollToSearchResult(searchState.index);
  }

  function scrollToSearchResult(searchIdx) {
    const chat = getActiveChat();
    if (!chat) return;

    const msgIdx = searchState.results[searchIdx];

    if (msgIdx < chat.renderedRange.start) {
      const newStart = Math.max(0, msgIdx - 20);
      const oldStart = chat.renderedRange.start;
      chat.renderedRange.start = newStart;
      renderChunk(chat, newStart, oldStart);
    }

    const msgEl = messagesContainer.querySelector('[data-msg-id="' + msgIdx + '"]');
    if (msgEl) {
      msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      highlightSearchResults();
      const marks = msgEl.querySelectorAll('.search-highlight');
      if (marks.length > 0) {
        marks[0].classList.add('active');
      }
    }
  }

  // ===================== SCROLL TO BOTTOM =====================
  scrollBottomBtn.addEventListener('click', () => {
    chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
  });

  // ===================== BACK BUTTON =====================
  backBtn.addEventListener('click', () => {
    if (currentView === 'ipad' || currentView === 'full') {
      activeChatId = null;
      messagesContainer.innerHTML = '';
      chatArea.classList.add('hidden');
      chatHeader.classList.add('hidden');
      chatEmptyState.classList.remove('hidden');
      closeSearch();
      refreshSidebar();
    } else {
      if (chats.length <= 1) {
        chats.length = 0;
        activeChatId = null;
        allRenderedElements = [];
        messagesContainer.innerHTML = '';
        closeSearch();
        chatScreen.classList.remove('active');
        chatScreen.classList.remove('fullscreen-mode');
        chatScreen.classList.remove('ipad-mode');
        dropZoneScreen.classList.add('active');
      } else {
        switchView('ipad');
      }
    }
  });

  // ===================== WHATSAPP CHAT PARSER =====================
  function parseWhatsAppChat(text) {
    const messages = [];
    const lines = text.split('\n');

    // Working regexes for iOS and Android WhatsApp export formats
    const iosRe = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*[AaPp]\.?\s*[Mm]\.?)?)\]\s*/;
    const androidRe = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*[AaPp]\.?\s*[Mm]\.?)?)\s*[\-–]\s*/;
    const altDateRe = /^(\d{1,2}[.\-]\d{1,2}[.\-]\d{2,4}),?\s+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*[AaPp]\.?\s*[Mm]\.?)?)\s*[\-–]\s*/;

    const cleanLine = (l) => l.replace(/[\u200E\u200F\u200B\u200D\u2069\u2066\uFEFF]/g, '');

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (!line.trim()) continue;

      const cleaned = cleanLine(line);
      let match = null;
      let dateStr, timeStr, rest;

      match = cleaned.match(iosRe);
      if (match) {
        dateStr = match[1];
        timeStr = match[2];
        rest = cleaned.slice(match[0].length);
      }

      if (!match) {
        match = cleaned.match(androidRe);
        if (match) {
          dateStr = match[1];
          timeStr = match[2];
          rest = cleaned.slice(match[0].length);
        }
      }

      if (!match) {
        match = cleaned.match(altDateRe);
        if (match) {
          dateStr = match[1].replace(/[.\-]/g, '/');
          timeStr = match[2];
          rest = cleaned.slice(match[0].length);
        }
      }

      if (match) {
        const parsedDate = parseDate(dateStr);
        const parsedTime = parseTime(timeStr);

        const colonIdx = rest.indexOf(': ');

        let sender = null;
        let text = '';

        if (colonIdx > 0 && colonIdx < 80) {
          sender = rest.slice(0, colonIdx).trim();
          text = rest.slice(colonIdx + 2);
        } else {
          text = rest;
        }

        if (sender && isSystemMessage(sender, text)) {
          sender = null;
          text = rest;
        }

        messages.push({
          id: messages.length,
          date: parsedDate,
          time: parsedTime,
          timeStr: formatTime(parsedTime),
          dateStr: formatDateLocale(parsedDate),
          sender: sender,
          text: text,
          isSystem: sender === null,
          media: null,
        });
      } else {
        if (messages.length > 0 && cleaned.trim()) {
          messages[messages.length - 1].text += '\n' + cleaned;
        }
      }
    }

    for (const msg of messages) {
      msg.media = detectMedia(msg.text);
      if (msg.media && msg.media.type !== 'omitted') {
        if (isMediaOnlyText(msg.text)) {
          msg.text = '';
        }
      }
    }

    return messages;
  }

  function isSystemMessage(sender, text) {
    const systemPatterns = [
      /^Messages and calls are end-to-end encrypted/i,
      /^Les messages et les appels sont chiffrés/i,
      /^Nachrichten und Anrufe sind/i,
      /created group/i,
      /a créé le groupe/i,
      /added/i,
      /a ajouté/i,
      /removed/i,
      /a retiré/i,
      /left$/i,
      /a quitté$/i,
      /changed the subject/i,
      /a modifié l'objet/i,
      /changed this group/i,
      /changed the group/i,
      /now an admin/i,
      /Your security code/i,
      /Votre code de sécurité/i,
      /disappeared/i,
      /message timer/i,
      /les messages éphémères/i,
      /You're now an admin/i,
    ];

    const full = sender + ': ' + text;
    if (/^Messages and calls|^Les messages|^Nachrichten|^You changed|^Vous avez/.test(sender)) {
      return true;
    }
    for (const p of systemPatterns) {
      if (p.test(full) || p.test(sender)) return true;
    }
    return false;
  }

  function detectMedia(text) {
    if (!text) return null;

    let m = text.match(/<(?:attached|joint):\s*(.+?)>/i);
    if (m) return buildMediaInfo(m[1].trim());

    m = text.match(/^(.+?\.\w{2,5})\s*\(file attached\)/i);
    if (m) return buildMediaInfo(m[1].trim());

    m = text.match(/^(.+?\.\w{2,5})\s*\(fichier joint\)/i);
    if (m) return buildMediaInfo(m[1].trim());

    if (/image omitted|imagen omitida|image absente|Bild weggelassen/i.test(text)) {
      return { type: 'omitted', mediaType: 'image', filename: null };
    }
    if (/video omitted|vídeo omitido|vidéo absente|Video weggelassen/i.test(text)) {
      return { type: 'omitted', mediaType: 'video', filename: null };
    }
    if (/audio omitted|áudio omitido|audio absent|Audio weggelassen/i.test(text)) {
      return { type: 'omitted', mediaType: 'audio', filename: null };
    }
    if (/sticker omitted|autocollant omis|Sticker weggelassen/i.test(text)) {
      return { type: 'omitted', mediaType: 'sticker', filename: null };
    }
    if (/document omitted|documento omitido|document absent|Dokument weggelassen/i.test(text)) {
      return { type: 'omitted', mediaType: 'document', filename: null };
    }
    if (/GIF omitted|GIF omis|GIF weggelassen/i.test(text)) {
      return { type: 'omitted', mediaType: 'gif', filename: null };
    }
    if (/Contact card omitted|carte de contact omise/i.test(text)) {
      return { type: 'omitted', mediaType: 'contact', filename: null };
    }
    if (/\bomitted\b|\bomis\b|\babsent[e]?\b|\bweggelassen\b/i.test(text)) {
      return { type: 'omitted', mediaType: 'unknown', filename: null };
    }

    return null;
  }

  function buildMediaInfo(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'];
    const videoExts = ['mp4', 'mov', 'avi', 'mkv', '3gp', 'webm'];
    const audioExts = ['opus', 'mp3', 'wav', 'ogg', 'm4a', 'aac'];

    let mediaType = 'document';
    if (imageExts.includes(ext)) mediaType = 'image';
    else if (videoExts.includes(ext)) mediaType = 'video';
    else if (audioExts.includes(ext)) mediaType = 'audio';

    return { type: 'file', mediaType, filename };
  }

  function isMediaOnlyText(text) {
    if (!text) return true;
    const cleaned = text.trim();
    if (/<(?:attached|joint):\s*.+?>/i.test(cleaned) && cleaned.match(/<(?:attached|joint):\s*.+?>/i)[0].length >= cleaned.length - 5) return true;
    if (/^.+?\.\w{2,5}\s*\((?:file attached|fichier joint)\)$/i.test(cleaned)) return true;
    if (/^.?\s*(?:image|video|audio|sticker|document|GIF|Contact card)\s*(?:omitted|omis|absent[e]?|weggelassen)/i.test(cleaned)) return true;
    return false;
  }

  function parseDate(str) {
    const parts = str.split('/');
    if (parts.length !== 3) return new Date();

    let a = parseInt(parts[0], 10);
    let b = parseInt(parts[1], 10);
    let c = parseInt(parts[2], 10);

    if (c < 100) c += 2000;

    let day, month, year;

    if (a > 12) {
      day = a; month = b; year = c;
    } else if (b > 12) {
      month = a; day = b; year = c;
    } else {
      day = a; month = b; year = c;
    }

    return new Date(year, month - 1, day);
  }

  function parseTime(str) {
    let cleaned = str.trim();
    cleaned = cleaned.replace(/\ba\.?\s*m\.?/i, 'AM').replace(/\bp\.?\s*m\.?/i, 'PM');
    const isPM = /PM/i.test(cleaned);
    const isAM = /AM/i.test(cleaned);
    const timePart = cleaned.replace(/\s*[AaPp][Mm]/i, '').replace(/\s*AM|PM/gi, '').trim();
    const parts = timePart.split(/[:.]/) ;

    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parts[2] ? parseInt(parts[2], 10) : 0;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return { hours, minutes, seconds };
  }

  function formatTime(timeObj) {
    return String(timeObj.hours).padStart(2, '0') + ':' + String(timeObj.minutes).padStart(2, '0');
  }

  function formatDateLocale(date) {
    if (!(date instanceof Date) || isNaN(date)) return '';
    const months = I18N[currentLocale] ? I18N[currentLocale].months : I18N['fr_FR'].months;
    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
  }

  // ===================== UTILITY FUNCTIONS =====================
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function linkify(html) {
    let result = html.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#53bdeb;text-decoration:underline;">$1</a>'
    );
    result = result.replace(
      /@(\+?[\w\u00C0-\u024F\u0400-\u04FF]+(?: [\w\u00C0-\u024F\u0400-\u04FF]+)*)/g,
      '<span class="wa-mention">@$1</span>'
    );
    return result;
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ===================== VIEW TOGGLE =====================
  const viewToggle = $('view-toggle');
  const btnPhone = $('btn-phone');
  const btnIpad = $('btn-ipad');
  const btnFull = $('btn-full');
  let currentView = 'phone';

  btnPhone.addEventListener('click', () => switchView('phone'));
  btnIpad.addEventListener('click', () => switchView('ipad'));
  btnFull.addEventListener('click', () => switchView('full'));

  function switchView(mode) {
    if (mode === currentView) return;
    currentView = mode;

    const scrollRatio = chatArea.scrollHeight > chatArea.clientHeight
      ? chatArea.scrollTop / (chatArea.scrollHeight - chatArea.clientHeight)
      : 1;

    btnPhone.classList.toggle('active', mode === 'phone');
    btnIpad.classList.toggle('active', mode === 'ipad');
    btnFull.classList.toggle('active', mode === 'full');

    chatScreen.classList.remove('fullscreen-mode', 'ipad-mode');

    if (mode === 'full') {
      chatScreen.classList.add('fullscreen-mode');
      refreshSidebar();

      if (!activeChatId && chats.length > 0) {
        chatArea.classList.add('hidden');
        chatHeader.classList.add('hidden');
        chatEmptyState.classList.remove('hidden');
      } else if (activeChatId) {
        chatArea.classList.remove('hidden');
        chatHeader.classList.remove('hidden');
        chatEmptyState.classList.add('hidden');
      }
    } else if (mode === 'ipad') {
      chatScreen.classList.add('ipad-mode');
      refreshSidebar();

      if (!activeChatId && chats.length > 0) {
        chatArea.classList.add('hidden');
        chatHeader.classList.add('hidden');
        chatEmptyState.classList.remove('hidden');
      } else if (activeChatId) {
        chatArea.classList.remove('hidden');
        chatHeader.classList.remove('hidden');
        chatEmptyState.classList.add('hidden');
      }
    }

    if (mode === 'phone') {
      chatEmptyState.classList.add('hidden');
      if (activeChatId) {
        chatArea.classList.remove('hidden');
        chatHeader.classList.remove('hidden');
      }
    }

    requestAnimationFrame(() => {
      const newMax = chatArea.scrollHeight - chatArea.clientHeight;
      chatArea.scrollTop = scrollRatio * newMax;
    });
  }

  // ===================== PARTICIPANTS POPUP =====================
  function showParticipantsPopup(chat) {
    const existing = document.querySelector('.participants-popup-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'participants-popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'participants-popup';

    const header = document.createElement('div');
    header.className = 'participants-popup-header';
    header.innerHTML = '<span class="participants-popup-title">' + escapeHtml(t('participantsPopupTitle')) + '</span>';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'participants-popup-close';
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    closeBtn.addEventListener('click', () => overlay.remove());
    header.appendChild(closeBtn);
    popup.appendChild(header);

    const list = document.createElement('div');
    list.className = 'participants-popup-list';
    for (const sender of chat.senders) {
      const item = document.createElement('div');
      item.className = 'participants-popup-item';
      const initials = sender.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
      const isMe = sender === chat.mySender;
      item.innerHTML = '<span class="participants-popup-avatar">' + escapeHtml(initials) + '</span>' +
        '<span class="participants-popup-name">' + escapeHtml(sender) + (isMe ? ' <span class="participants-you-tag">' + escapeHtml(t('youTag')) + '</span>' : '') + '</span>';
      list.appendChild(item);
    }
    popup.appendChild(list);
    overlay.appendChild(popup);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  // ===================== HEADER MARQUEE FOR LONG NAMES =====================
  function setupHeaderMarquee() {
    requestAnimationFrame(() => {
      const el = headerName;
      el.classList.remove('marquee-scroll');
      el.style.removeProperty('--marquee-offset');
      el.style.removeProperty('--marquee-duration');

      if (el.scrollWidth > el.clientWidth + 2) {
        const offset = -(el.scrollWidth - el.clientWidth + 10);
        el.style.setProperty('--marquee-offset', offset + 'px');
        const duration = Math.max(5, Math.abs(offset) / 25);
        el.style.setProperty('--marquee-duration', duration + 's');
        el.classList.add('marquee-scroll');
      }
    });
  }

  // ===================== LANGUAGE PICKER =====================
  document.querySelectorAll('.lang-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLocale(btn.dataset.locale);
    });
  });

  // setLocale updates active state on ALL lang-picker-btn elements
  // (already handled in setLocale via querySelectorAll)

  // ===================== COLLAPSIBLE SECTIONS (landing page) =====================
  window.toggleSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.classList.toggle('open');
  };

  // ===================== KEYBOARD SHORTCUTS =====================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!lightbox.classList.contains('hidden')) {
        lightbox.classList.add('hidden');
        lightboxImg.src = '';
      }
      const popup = document.querySelector('.participants-popup-overlay');
      if (popup) popup.remove();
    }
  });

  // ===================== INITIAL LOCALE APPLY =====================
  applyLocale();

})();
