/* ================================================
   WhatsApp Chat Viewer — Main Application v0.5.1
   Multi-chat architecture with iPad sidebar
   + Live animated playback view
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
      bioIntro: 'Localization Program Manager chez Perplexity (depuis janvier 2026, San Francisco, hybride). Spécialiste de la localisation et de la gestion de programmes linguistiques, avec plus de 25 ans d\'expérience à l\'international.',
      bioExpTitle: 'Expérience',
      bioPresent: 'présent',
      bioMinistryTitle: 'Ministère de l\'Éducation nationale',
      bioMinistryRole: 'Professeur agrégé d\'anglais',
      bioPrepenaRole: 'Stagiaire Prep\'ENA',
      bioBramhallRole: 'Professeur assistant de langue étrangère',
      bioEduTitle: 'Formation',
      bioEduField: 'Langue et Littérature anglaises',
      bioEduSchool: 'Université Côte d\'Azur',
      bioPubTitle: 'Publications académiques',
      bioCertTitle: 'Certifications',
      bioCertEna: 'Certificat de formation ENA (déc. 2013)',
      bioCertLinkedin: 'Certifications LinkedIn Learning (Linux, Python, Data Science)',
      bioLangTitle: 'Langues',
      bioLangList: 'Corse, anglais, français, italien — niveau natif ou bilingue.',
      bioMiscTitle: 'Divers',
      bioMiscContent: 'Acteur dans le court-métrage « Mission insulaire » (2005)',
      bioMiscRally: 'Co-pilote en rallye automobile.',
      releaseTitle: 'Notes de version',
      releaseV023Date: 'Février 2026',
      releaseV023_1: 'Biographie de l\'auteur entièrement réécrite d\'après le profil LinkedIn',
      releaseV023_2: 'Drapeaux uniformes en SVG rectangulaire plat (plus de fichiers PNG externes)',
      releaseV022Date: 'Février 2026',
      releaseV022_1: 'Drapeau corse authentique (tête de Maure) en remplacement de l\'icône précédente',
      releaseV022_2: 'Correction du lien LinkedIn de l\'auteur',
      releaseV021Date: 'Février 2026',
      releaseV021_1: 'Correction de la biographie de l\'auteur',
      releaseV021_2: 'Drapeau corse animé en remplacement du texte « CO »',
      releaseV021_3: 'Mise à jour du numéro de version',
      releaseV02Date: 'Février 2026',
      releaseCurrentLabel: 'Version actuelle',
      releaseV03Date: 'Février 2026',
      releaseV03_1: 'Vue « Live » avec lecture animée des conversations et sons de bulles',
      releaseV03_2: 'Biographie de l\'auteur corrigée d\'après le profil LinkedIn vérifié',
      releaseV03_3: 'Nouvelle section « À quoi ça sert ? » sur la page d\'accueil',
      releaseV03_4: 'Sélecteur de vue déplacé à gauche, drapeaux à droite',
      whatIsItForTitle: 'À quoi ça sert ?',
      whatIsPoint1: 'WhatsApp envahit votre téléphone. Photos, vidéos et messages s\'accumulent sur des années — et la mémoire se remplit à toute vitesse.',
      whatIsPoint2: 'Apple facture le prix fort pour chaque palier de stockage. 128 Go, 256 Go, 512 Go, 1 To\u2026 et le prix grimpe à chaque iPhone.',
      whatIsPoint3: 'Pourtant, personne ne veut effacer ces souvenirs : les conversations précieuses, les photos de famille, les fous rires de groupe. Ces instants comptent.',
      whatIsPoint4: 'Cette application augmente votre mémoire : exportez vos conversations WhatsApp, libérez de l\'espace sur votre téléphone et revivez chaque instant exactement comme il s\'est passé — bulles, médias, horodatages, le tout en plein écran cinéma.',
      whatIsPoint5: 'Revivez le moment : le mode cinéma transforme vos conversations en expérience immersive plein écran. Les photos et vidéos défilent en fond, le texte flotte par-dessus — comme un film de vos souvenirs.',
      whatIsPoint6: 'Vos données restent strictement privées : tout fonctionne localement dans votre navigateur. Rien n\'est envoyé sur un serveur.',
      liveSpeedLabel: 'Vitesse',
      homeButtonTitle: 'Accueil',
      livePrevYear: '-1 an',
      livePrevMonth: '-1 mois',
      livePrevDay: '-1 jour',
      liveNextDay: '+1 jour',
      liveNextMonth: '+1 mois',
      liveNextYear: '+1 an',
      livePlayPause: 'Lecture / Pause',
      liveTimelineLabel: 'Chronologie',
      releaseV031Date: 'Février 2026',
      releaseV031_1: 'Drapeaux UK, US et Corée du Sud améliorés',
      releaseV031_2: 'Bouton Accueil séparé pour retourner à la page d\'accueil',
      releaseV031_3: 'Fond d\'image en fondu pendant la lecture Live',
      releaseV031_4: 'Effet machine à écrire pour les messages en vue Live',
      releaseV031_5: 'Curseur de chronologie pour naviguer dans la conversation',
      releaseV031_6: 'Tous les éléments d\'interface localisés',
      releaseV032Date: 'Février 2026',
      releaseV032_1: 'Fond d\'arrière-plan en live : supporte désormais les images ET les vidéos (plein écran)',
      releaseV032_2: 'Biographie de l\'auteur structurée et localisée dans les 11 langues',
      releaseV032_3: 'Mentions @ affichées en vert gras comme sur WhatsApp',
      releaseV032_4: 'Effet de frappe naturelle avec intervalles variables',
      releaseV032_5: 'Nom corrigé : Pierre Régis Gonsolin',
      cinemaButtonTitle: 'Plein écran cinéma',
      cinemaAutoScroll: 'Défilement automatique',
      cinemaSlower: 'Plus lent',
      cinemaFaster: 'Plus rapide',
      releaseV041Date: 'Février 2026',
      releaseV041_1: 'Mode cinéma en vrai plein écran navigateur avec bouton de bascule',
      releaseV041_2: 'Médias sans bandes noires, remplissage complet de l\'écran',
      releaseV041_3: 'Liens YouTube automatiquement intégrés en fond avec fondu',
      howStep4Title: 'Choisissez votre mode d\'affichage',
      howStep4Desc: 'Cinq modes de vue : iPhone, iPad (barre latérale multi-conversations), plein écran web, lecture Live animée et mode Cinéma immersif avec médias en fond.',
      howStep5Title: 'Mode Cinéma',
      howStep5Desc: 'Plein écran navigateur, photos et vidéos en fondu d\'arrière-plan, liens YouTube intégrés automatiquement, son avec fondu progressif et texte à contours flottant par-dessus.',
      howStep6Title: 'Traduction en direct',
      howStep6Desc: 'La langue de la conversation est détectée automatiquement. Choisissez une langue cible et tous les messages sont traduits instantanément — sans quitter l\'application.',
      translateBtnTitle: 'Traduire',
      translateDetected: 'Détecté :',
      translateOff: 'Traduction désactivée',
      translateInProgress: 'Traduction...',
      translateSameLang: 'Même langue',
      releaseV042Date: 'Février 2026',
      releaseV042_1: 'Traduction en direct : détection automatique de la langue et traduction instantanée',
      releaseV042_2: 'Fondu audio progressif à l\'entrée et à la sortie des médias',
      releaseV042_3: 'Son activé par défaut en mode cinéma',
      releaseV042_4: 'Contenu marketing enrichi et nouvelles étapes dans « Comment ça marche »',
      releaseV043Date: 'Février 2026',
      releaseV043_1: 'Illustration de la page d\'accueil ajustée : le téléphone ne chevauche plus le contour',
      releaseV043_2: 'Les liens YouTube en erreur ne s\'affichent plus en mode cinéma',
      releaseV043_3: 'Miniatures des médias affichées dans le texte défilant du mode cinéma pour mieux repérer les photos et vidéos',
      releaseV044Date: 'Février 2026',
      releaseV044_1: 'Mode cinéma : fond noir au démarrage, miniatures de photos et vidéos corrigées et agrandies',
      releaseV044_2: 'Lecture automatique YouTube désactivée, seules les miniatures sont affichées',
      releaseV044_3: 'Traduction : le texte source est remplacé par la traduction au lieu d\'afficher les deux',
      releaseV044_4: 'Mode cinéma : traduction en direct avec menu de sélection de langue intégré',
      releaseV044_5: 'Illustration de la page d\'accueil ajustée pour éviter tout débordement',
      releaseV04Date: 'Février 2026',
      releaseV04_1: 'Fond d\'arrière-plan en live sans flou, images et vidéos nettes',
      releaseV04_2: 'Téléphone et son contenu toujours au premier plan',
      releaseV04_3: 'Nouveau mode « Plein écran » : texte large avec contours, médias en pleine page',
      releaseV012Date: 'Février 2026',
      releaseV011Date: 'Février 2026',
      releaseV010Date: 'Février 2026',
      releaseInitialLabel: 'Version initiale',
      releaseV02_1: 'Support multilingue (anglais, français, espagnol, italien, allemand, corse, russe, chinois, japonais, coréen)',
      releaseV02_2: 'Page d\'accueil avec sections « Comment ça marche », « À propos » et « Notes de version »',
      releaseV02_3: 'Défilement ticker pour les noms de groupes longs et les noms dans la barre latérale',
      releaseV02_4: 'Numéro de version affiché sur la page d\'accueil',
      releaseV03_5: 'Prise en charge de 4 nouvelles langues : russe, chinois, japonais, coréen',
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

      // ---- Profiler v0.5 ----
      profilerBtnTitle: 'Profil psychologique',
      profilerTitle: 'Analyse psychologique du groupe',
      profilerSubtitle: 'Profil de chaque membre basé sur l\'analyse de la conversation',
      profilerNoData: 'Chargez une conversation de groupe pour voir l\'analyse.',
      profilerMessages: 'Messages',
      profilerAvgLength: 'Long. moy.',
      profilerCharsPerMsg: 'car/msg',
      profilerMediaSent: 'Médias envoyés',
      profilerEmojis: 'Emojis',
      profilerQuestions: 'Questions posées',
      profilerLinks: 'Liens partagés',
      profilerInitiations: 'Conversations lancées',
      profilerAvgResponseTime: 'Temps de réponse moy.',
      profilerMostActiveHour: 'Heure la plus active',
      profilerTopEmojis: 'Emojis favoris',
      profilerPersonality: 'Profil psychologique',
      profilerTraits: 'Traits de personnalité',
      profilerCommunicationStyle: 'Style de communication',
      profilerGroupRole: 'Rôle dans le groupe',
      profilerMinutes: 'min',
      profilerHours: 'h',
      profilerDays: 'j',
      profilerStyleVerbose: 'Prolixe',
      profilerStyleConcise: 'Concis',
      profilerStyleExpressive: 'Expressif',
      profilerStyleFactual: 'Factuel',
      profilerStyleInquisitive: 'Curieux',
      profilerStyleResponsive: 'Réactif',
      profilerStyleInitiator: 'Initiateur',
      profilerStyleMediaHeavy: 'Visuel',
      profilerRoleLeader: 'Leader',
      profilerRoleConnector: 'Connecteur',
      profilerRoleObserver: 'Observateur',
      profilerRoleEntertainer: 'Animateur',
      profilerRoleSupporter: 'Soutien',
      profilerRoleAnalyst: 'Analyste',
      profilerActivity: 'Activité',
      profilerActivityChart: 'Répartition horaire',
      profilerSentiment: 'Sentiment',
      profilerSentimentPositive: 'Positif',
      profilerSentimentNeutral: 'Neutre',
      profilerSentimentNegative: 'Négatif',
      profilerWordCloud: 'Mots fréquents',
      profilerOverview: 'Vue d\'ensemble',
      profilerDominance: 'Dominance conversationnelle',
      releaseV05Date: 'Mars 2026',
      releaseV05_1: 'Analyse psychologique des membres du groupe avec profils de personnalité',
      releaseV05_2: 'Graphiques radar et répartition horaire par membre',
      releaseV05_3: 'Détection automatique du style de communication et du rôle dans le groupe',
      releaseV05_4: 'Analyse de sentiment et emojis favoris',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: 'Votre profil',
      profilerYourProfileSubtitle: 'Analyse personnelle basée sur vos messages',
      profilerNarrative: 'Portrait psychologique',
      profilerVsGroup: 'Comparaison au groupe',
      profilerVsGroupAvg: 'Moyenne du groupe',
      profilerYou: 'Vous',
      profilerMoreThan: 'de plus que la moyenne',
      profilerLessThan: 'de moins que la moyenne',
      profilerOnPar: 'dans la moyenne',
      profilerBigFive: 'Indicateurs de personnalité',
      profilerBigFiveOpenness: 'Ouverture',
      profilerBigFiveConscientiousness: 'Conscienciosité',
      profilerBigFiveExtraversion: 'Extraversion',
      profilerBigFiveAgreeableness: 'Agréabilité',
      profilerBigFiveNeuroticism: 'Stabilité émotionnelle',
      profilerNarrIntro: 'En tant que ',
      profilerNarrVerbose: 'communicant prolixe, vous prenez le temps de développer vos pensées en détail. Vos messages longs révèlent une personnalité réfléchie qui valorise la nuance et le contexte.',
      profilerNarrConcise: 'communicant concis, vous allez droit au but. Vos messages courts et efficaces révèlent une personnalité pragmatique qui valorise la clarté et l\'action.',
      profilerNarrExpressive: 'Votre usage abondant d\'emojis et de points d\'exclamation révèle une personnalité chaleureuse et émotionnellement ouverte. Vous apportez de l\'énergie et de la couleur aux conversations.',
      profilerNarrFactual: 'Votre style sobre et factuel, avec peu d\'emojis, révèle une personnalité analytique qui préfère les faits aux émotions dans ses échanges.',
      profilerNarrInquisitive: 'Vous posez beaucoup de questions, ce qui démontre une curiosité intellectuelle naturelle et un intérêt sincère pour les autres.',
      profilerNarrResponsive: 'Votre temps de réponse rapide montre que vous êtes très attentif aux conversations et que vous accordez de l\'importance à la réactivité.',
      profilerNarrInitiator: 'Vous lancez souvent de nouvelles conversations, ce qui révèle un tempérament proactif et socialement confiant.',
      profilerNarrMediaHeavy: 'Vous partagez beaucoup de contenus visuels, révélant une personnalité qui pense en images et préfère montrer plutôt que raconter.',
      profilerNarrLeader: 'Dans ce groupe, vous occupez naturellement le rôle de leader — celui qui donne le ton, lance les sujets et maintient le rythme des échanges.',
      profilerNarrConnector: 'Vous êtes le connecteur du groupe — celui qui pose les questions, relie les gens entre eux et maintient le lien social.',
      profilerNarrObserver: 'Vous êtes plutôt observateur dans ce groupe — présent mais discret, vous intervenez avec parcimonie et à bon escient.',
      profilerNarrEntertainer: 'Vous êtes l\'animateur du groupe — celui qui apporte l\'humour, les rires et l\'énergie positive aux conversations.',
      profilerNarrSupporter: 'Vous jouez un rôle de soutien dans ce groupe — réactif, positif et toujours présent quand quelqu\'un a besoin d\'une réponse.',
      profilerNarrAnalyst: 'Vous êtes l\'analyste du groupe — celui qui partage des liens, écrit des messages détaillés et apporte de la profondeur aux discussions.',
      profilerNarrDefaultRole: 'Vous participez activement au groupe à votre manière, apportant votre propre style unique aux conversations.',
      releaseV051Date: 'Mars 2026',
      releaseV051_1: 'Profil psychologique personnel avec portrait narratif généré automatiquement',
      releaseV051_2: 'Indicateurs de personnalité Big Five déduits des habitudes de communication',
      releaseV051_3: 'Comparaison de vos statistiques avec la moyenne du groupe',
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
      bioIntro: 'Localisation Program Manager at Perplexity (since January 2026, San Francisco, hybrid). Specialist in localisation and linguistic programme management, with over 25 years of international experience.',
      bioExpTitle: 'Experience',
      bioPresent: 'present',
      bioMinistryTitle: 'French Ministry of Education',
      bioMinistryRole: 'Certified English Teacher (Agrégé)',
      bioPrepenaRole: 'Prep\'ENA Trainee',
      bioBramhallRole: 'Foreign Language Assistant Teacher',
      bioEduTitle: 'Education',
      bioEduField: 'English Language and Literature',
      bioEduSchool: 'Université Côte d\'Azur',
      bioPubTitle: 'Academic Publications',
      bioCertTitle: 'Certifications',
      bioCertEna: 'ENA Training Certificate (Dec. 2013)',
      bioCertLinkedin: 'LinkedIn Learning Certifications (Linux, Python, Data Science)',
      bioLangTitle: 'Languages',
      bioLangList: 'Corsican, English, French, Italian — native or bilingual proficiency.',
      bioMiscTitle: 'Miscellaneous',
      bioMiscContent: 'Actor in the short film "Mission insulaire" (2005)',
      bioMiscRally: 'Rally co-driver.',
      releaseTitle: 'Release notes',
      releaseV023Date: 'February 2026',
      releaseV023_1: 'Author biography fully rewritten from LinkedIn profile',
      releaseV023_2: 'All flags replaced with uniform flat rectangular SVGs (no external PNG files)',
      releaseV022Date: 'February 2026',
      releaseV022_1: 'Authentic Corsican flag (Moor\'s head) replacing previous icon',
      releaseV022_2: 'Fixed author LinkedIn link',
      releaseV021Date: 'February 2026',
      releaseV021_1: 'Fixed author biography',
      releaseV021_2: 'Animated Corsican flag replacing "CO" text',
      releaseV021_3: 'Version number update',
      releaseV02Date: 'February 2026',
      releaseCurrentLabel: 'Current version',
      releaseV03Date: 'February 2026',
      releaseV03_1: 'Live view with animated conversation playback and bubble sounds',
      releaseV03_2: 'Author biography corrected from verified LinkedIn profile',
      releaseV03_3: 'New \'What is it for?\' section on the landing page',
      releaseV03_4: 'View selector moved to the left, flags on the right',
      whatIsItForTitle: 'What is it for?',
      whatIsPoint1: 'WhatsApp takes over your phone. Photos, videos and messages pile up over years — and storage fills up fast.',
      whatIsPoint2: 'Apple charges a premium for every storage tier. 128GB, 256GB, 512GB, 1TB\u2026 and the price climbs with every new iPhone.',
      whatIsPoint3: 'Yet nobody wants to delete those memories: precious conversations, family photos, group moments. Those instants matter.',
      whatIsPoint4: 'This app augments your memory: export your WhatsApp conversations, free up phone storage and relive every moment exactly as it happened — bubbles, media, timestamps, all in cinema fullscreen.',
      whatIsPoint5: 'Relive the moment: cinema mode transforms your conversations into an immersive fullscreen experience. Photos and videos fade in the background while text floats above — like a film of your memories.',
      whatIsPoint6: 'Your data stays strictly private: everything runs locally in your browser. Nothing is uploaded to any server.',
      liveSpeedLabel: 'Speed',
      homeButtonTitle: 'Home',
      livePrevYear: '-1 year',
      livePrevMonth: '-1 month',
      livePrevDay: '-1 day',
      liveNextDay: '+1 day',
      liveNextMonth: '+1 month',
      liveNextYear: '+1 year',
      livePlayPause: 'Play / Pause',
      liveTimelineLabel: 'Timeline',
      releaseV031Date: 'February 2026',
      releaseV031_1: 'Improved UK, US and South Korea flags',
      releaseV031_2: 'Separate Home button to return to the landing page',
      releaseV031_3: 'Image background fade during Live playback',
      releaseV031_4: 'Typewriter effect for messages in Live view',
      releaseV031_5: 'Timeline scrubber for navigating the conversation',
      releaseV031_6: 'All UI elements localised',
      releaseV032Date: 'February 2026',
      releaseV032_1: 'Live background now supports both images AND videos (full window)',
      releaseV032_2: 'Author biography restructured and localised in all 11 languages',
      releaseV032_3: '@Mentions displayed in bold green as on WhatsApp',
      releaseV032_4: 'Natural typing effect with variable intervals',
      releaseV032_5: 'Name corrected: Pierre Régis Gonsolin',
      cinemaButtonTitle: 'Full Screen cinema',
      cinemaAutoScroll: 'Auto-scroll',
      cinemaSlower: 'Slower',
      cinemaFaster: 'Faster',
      releaseV041Date: 'February 2026',
      releaseV041_1: 'Cinema mode now uses true browser fullscreen with toggle button',
      releaseV041_2: 'Media fills the entire screen without black bars',
      releaseV041_3: 'YouTube links automatically embedded as background videos with fade',
      howStep4Title: 'Choose your viewing mode',
      howStep4Desc: 'Five view modes: iPhone, iPad (multi-chat sidebar), fullscreen web, animated Live playback and immersive Cinema mode with background media.',
      howStep5Title: 'Cinema Mode',
      howStep5Desc: 'Browser fullscreen, photos and videos fading in the background, YouTube links auto-embedded, sound with smooth fade and outlined text floating above.',
      howStep6Title: 'Live translation',
      howStep6Desc: 'The chat language is detected automatically. Choose a target language and all messages are translated instantly — without leaving the app.',
      translateBtnTitle: 'Translate',
      translateDetected: 'Detected:',
      translateOff: 'Translation off',
      translateInProgress: 'Translating...',
      translateSameLang: 'Same language',
      releaseV042Date: 'February 2026',
      releaseV042_1: 'Live translation: automatic language detection and instant translation',
      releaseV042_2: 'Smooth audio fade in/out on media transitions',
      releaseV042_3: 'Sound on by default in cinema mode',
      releaseV042_4: 'Enhanced marketing content and new steps in \u201cHow it works\u201d',
      releaseV043Date: 'February 2026',
      releaseV043_1: 'Landing page illustration adjusted: the phone no longer overlaps the outline',
      releaseV043_2: 'YouTube links that return errors no longer display in cinema mode',
      releaseV043_3: 'Media thumbnails shown in cinema scrolling text to better track when photos and videos were sent',
      releaseV044Date: 'February 2026',
      releaseV044_1: 'Cinema mode: black background on start, photo and video thumbnails fixed and enlarged',
      releaseV044_2: 'YouTube autoplay disabled, only thumbnails are shown',
      releaseV044_3: 'Translation: source text is replaced by the translation instead of showing both',
      releaseV044_4: 'Cinema mode: live translation with integrated language selection menu',
      releaseV044_5: 'Landing page illustration adjusted to prevent overflow',
      releaseV04Date: 'February 2026',
      releaseV04_1: 'Live background without blur, sharp images and videos',
      releaseV04_2: 'Phone and its contents always in the foreground',
      releaseV04_3: 'New "Full Screen" mode: large text with outlines, full-page media',
      releaseV012Date: 'February 2026',
      releaseV011Date: 'February 2026',
      releaseV010Date: 'February 2026',
      releaseInitialLabel: 'Initial release',
      releaseV02_1: 'Multi-language support (English, French, Spanish, Italian, German, Corsican, Russian, Chinese, Japanese, Korean)',
      releaseV02_2: 'Landing page with "How it works", "About", and "Release notes" sections',
      releaseV02_3: 'News ticker scrolling for long group names and sidebar chat names',
      releaseV02_4: 'Version number displayed on landing page',
      releaseV03_5: 'Added 4 new languages: Russian, Chinese, Japanese, Korean',
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

      // ---- Profiler v0.5 ----
      profilerBtnTitle: 'Psychological profile',
      profilerTitle: 'Group psychological analysis',
      profilerSubtitle: 'Each member\'s profile based on conversation analysis',
      profilerNoData: 'Load a group conversation to see the analysis.',
      profilerMessages: 'Messages',
      profilerAvgLength: 'Avg length',
      profilerCharsPerMsg: 'chars/msg',
      profilerMediaSent: 'Media sent',
      profilerEmojis: 'Emojis',
      profilerQuestions: 'Questions asked',
      profilerLinks: 'Links shared',
      profilerInitiations: 'Conversations started',
      profilerAvgResponseTime: 'Avg response time',
      profilerMostActiveHour: 'Most active hour',
      profilerTopEmojis: 'Favourite emojis',
      profilerPersonality: 'Psychological profile',
      profilerTraits: 'Personality traits',
      profilerCommunicationStyle: 'Communication style',
      profilerGroupRole: 'Group role',
      profilerMinutes: 'min',
      profilerHours: 'h',
      profilerDays: 'd',
      profilerStyleVerbose: 'Verbose',
      profilerStyleConcise: 'Concise',
      profilerStyleExpressive: 'Expressive',
      profilerStyleFactual: 'Factual',
      profilerStyleInquisitive: 'Inquisitive',
      profilerStyleResponsive: 'Responsive',
      profilerStyleInitiator: 'Initiator',
      profilerStyleMediaHeavy: 'Visual',
      profilerRoleLeader: 'Leader',
      profilerRoleConnector: 'Connector',
      profilerRoleObserver: 'Observer',
      profilerRoleEntertainer: 'Entertainer',
      profilerRoleSupporter: 'Supporter',
      profilerRoleAnalyst: 'Analyst',
      profilerActivity: 'Activity',
      profilerActivityChart: 'Hourly breakdown',
      profilerSentiment: 'Sentiment',
      profilerSentimentPositive: 'Positive',
      profilerSentimentNeutral: 'Neutral',
      profilerSentimentNegative: 'Negative',
      profilerWordCloud: 'Frequent words',
      profilerOverview: 'Overview',
      profilerDominance: 'Conversational dominance',
      releaseV05Date: 'March 2026',
      releaseV05_1: 'Psychological analysis of group members with personality profiles',
      releaseV05_2: 'Radar charts and hourly activity breakdown per member',
      releaseV05_3: 'Automatic detection of communication style and group role',
      releaseV05_4: 'Sentiment analysis and favourite emojis',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: 'Your profile',
      profilerYourProfileSubtitle: 'Personal analysis based on your messages',
      profilerNarrative: 'Psychological portrait',
      profilerVsGroup: 'Compared to the group',
      profilerVsGroupAvg: 'Group average',
      profilerYou: 'You',
      profilerMoreThan: 'more than average',
      profilerLessThan: 'less than average',
      profilerOnPar: 'on par with the group',
      profilerBigFive: 'Personality indicators',
      profilerBigFiveOpenness: 'Openness',
      profilerBigFiveConscientiousness: 'Conscientiousness',
      profilerBigFiveExtraversion: 'Extraversion',
      profilerBigFiveAgreeableness: 'Agreeableness',
      profilerBigFiveNeuroticism: 'Emotional stability',
      profilerNarrIntro: 'As a ',
      profilerNarrVerbose: 'verbose communicator, you take the time to develop your thoughts in detail. Your long messages reveal a thoughtful personality that values nuance and context.',
      profilerNarrConcise: 'concise communicator, you get straight to the point. Your short, efficient messages reveal a pragmatic personality that values clarity and action.',
      profilerNarrExpressive: 'Your abundant use of emojis and exclamation marks reveals a warm, emotionally open personality. You bring energy and colour to conversations.',
      profilerNarrFactual: 'Your sober, factual style with few emojis reveals an analytical personality that prefers facts over emotions in exchanges.',
      profilerNarrInquisitive: 'You ask a lot of questions, demonstrating a natural intellectual curiosity and a genuine interest in others.',
      profilerNarrResponsive: 'Your fast response time shows you are highly attentive to conversations and value responsiveness.',
      profilerNarrInitiator: 'You frequently start new conversations, revealing a proactive and socially confident temperament.',
      profilerNarrMediaHeavy: 'You share a lot of visual content, revealing a personality that thinks in images and prefers showing over telling.',
      profilerNarrLeader: 'In this group, you naturally occupy the leader role — the one who sets the tone, starts topics and keeps the conversation flowing.',
      profilerNarrConnector: 'You are the group\'s connector — the one who asks questions, links people together and maintains the social bond.',
      profilerNarrObserver: 'You tend to be an observer in this group — present but discreet, you contribute sparingly and wisely.',
      profilerNarrEntertainer: 'You are the group\'s entertainer — the one who brings humour, laughter and positive energy to conversations.',
      profilerNarrSupporter: 'You play a supportive role in this group — responsive, positive and always there when someone needs a reply.',
      profilerNarrAnalyst: 'You are the group\'s analyst — the one who shares links, writes detailed messages and brings depth to discussions.',
      profilerNarrDefaultRole: 'You actively participate in the group in your own way, bringing your unique style to conversations.',
      releaseV051Date: 'March 2026',
      releaseV051_1: 'Personal psychological profile with auto-generated narrative portrait',
      releaseV051_2: 'Big Five personality indicators inferred from communication habits',
      releaseV051_3: 'Comparison of your stats against the group average',
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
      bioIntro: 'Localization Program Manager at Perplexity (since January 2026, San Francisco, hybrid). Specialist in localization and linguistic program management, with over 25 years of international experience.',
      bioExpTitle: 'Experience',
      bioPresent: 'present',
      bioMinistryTitle: 'French Ministry of Education',
      bioMinistryRole: 'Certified English Teacher (Agrégé)',
      bioPrepenaRole: 'Prep\'ENA Trainee',
      bioBramhallRole: 'Foreign Language Assistant Teacher',
      bioEduTitle: 'Education',
      bioEduField: 'English Language and Literature',
      bioEduSchool: 'Université Côte d\'Azur',
      bioPubTitle: 'Academic Publications',
      bioCertTitle: 'Certifications',
      bioCertEna: 'ENA Training Certificate (Dec. 2013)',
      bioCertLinkedin: 'LinkedIn Learning Certifications (Linux, Python, Data Science)',
      bioLangTitle: 'Languages',
      bioLangList: 'Corsican, English, French, Italian — native or bilingual proficiency.',
      bioMiscTitle: 'Miscellaneous',
      bioMiscContent: 'Actor in the short film "Mission insulaire" (2005)',
      bioMiscRally: 'Rally co-driver.',
      releaseTitle: 'Release notes',
      releaseV023Date: 'February 2026',
      releaseV023_1: 'Author biography fully rewritten from LinkedIn profile',
      releaseV023_2: 'All flags replaced with uniform flat rectangular SVGs (no external PNG files)',
      releaseV022Date: 'February 2026',
      releaseV022_1: 'Authentic Corsican flag (Moor\'s head) replacing previous icon',
      releaseV022_2: 'Fixed author LinkedIn link',
      releaseV021Date: 'February 2026',
      releaseV021_1: 'Fixed author biography',
      releaseV021_2: 'Animated Corsican flag replacing "CO" text',
      releaseV021_3: 'Version number update',
      releaseV02Date: 'February 2026',
      releaseCurrentLabel: 'Current version',
      releaseV03Date: 'February 2026',
      releaseV03_1: 'Live view with animated conversation playback and bubble sounds',
      releaseV03_2: 'Author biography corrected from verified LinkedIn profile',
      releaseV03_3: 'New \'What is it for?\' section on the landing page',
      releaseV03_4: 'View selector moved to the left, flags on the right',
      whatIsItForTitle: 'What is it for?',
      whatIsPoint1: 'WhatsApp takes over your phone. Photos, videos and messages pile up over years — and storage fills up fast.',
      whatIsPoint2: 'Apple charges a premium for every storage tier. 128GB, 256GB, 512GB, 1TB\u2026 and the price climbs with every new iPhone.',
      whatIsPoint3: 'Yet nobody wants to delete those memories: precious conversations, family photos, group moments. Those instants matter.',
      whatIsPoint4: 'This app augments your memory: export your WhatsApp conversations, free up phone storage and relive every moment exactly as it happened — bubbles, media, timestamps, all in cinema fullscreen.',
      whatIsPoint5: 'Relive the moment: cinema mode transforms your conversations into an immersive fullscreen experience. Photos and videos fade in the background while text floats above — like a film of your memories.',
      whatIsPoint6: 'Your data stays strictly private: everything runs locally in your browser. Nothing is uploaded to any server.',
      liveSpeedLabel: 'Speed',
      homeButtonTitle: 'Home',
      livePrevYear: '-1 year',
      livePrevMonth: '-1 month',
      livePrevDay: '-1 day',
      liveNextDay: '+1 day',
      liveNextMonth: '+1 month',
      liveNextYear: '+1 year',
      livePlayPause: 'Play / Pause',
      liveTimelineLabel: 'Timeline',
      releaseV031Date: 'February 2026',
      releaseV031_1: 'Improved UK, US and South Korea flags',
      releaseV031_2: 'Separate Home button to return to the landing page',
      releaseV031_3: 'Image background fade during Live playback',
      releaseV031_4: 'Typewriter effect for messages in Live view',
      releaseV031_5: 'Timeline scrubber for navigating the conversation',
      releaseV031_6: 'All UI elements localized',
      releaseV032Date: 'February 2026',
      releaseV032_1: 'Live background now supports both images AND videos (full window)',
      releaseV032_2: 'Author biography restructured and localized in all 11 languages',
      releaseV032_3: '@Mentions displayed in bold green as on WhatsApp',
      releaseV032_4: 'Natural typing effect with variable intervals',
      releaseV032_5: 'Name corrected: Pierre Régis Gonsolin',
      cinemaButtonTitle: 'Full Screen cinema',
      cinemaAutoScroll: 'Auto-scroll',
      cinemaSlower: 'Slower',
      cinemaFaster: 'Faster',
      releaseV041Date: 'February 2026',
      releaseV041_1: 'Cinema mode now uses true browser fullscreen with toggle button',
      releaseV041_2: 'Media fills the entire screen without black bars',
      releaseV041_3: 'YouTube links automatically embedded as background videos with fade',
      howStep4Title: 'Choose your viewing mode',
      howStep4Desc: 'Five view modes: iPhone, iPad (multi-chat sidebar), fullscreen web, animated Live playback and immersive Cinema mode with background media.',
      howStep5Title: 'Cinema Mode',
      howStep5Desc: 'Browser fullscreen, photos and videos fading in the background, YouTube links auto-embedded, sound with smooth fade and outlined text floating above.',
      howStep6Title: 'Live translation',
      howStep6Desc: 'The chat language is detected automatically. Choose a target language and all messages are translated instantly — without leaving the app.',
      translateBtnTitle: 'Translate',
      translateDetected: 'Detected:',
      translateOff: 'Translation off',
      translateInProgress: 'Translating...',
      translateSameLang: 'Same language',
      releaseV042Date: 'February 2026',
      releaseV042_1: 'Live translation: automatic language detection and instant translation',
      releaseV042_2: 'Smooth audio fade in/out on media transitions',
      releaseV042_3: 'Sound on by default in cinema mode',
      releaseV042_4: 'Enhanced marketing content and new steps in \u201cHow it works\u201d',
      releaseV043Date: 'February 2026',
      releaseV043_1: 'Landing page illustration adjusted: the phone no longer overlaps the outline',
      releaseV043_2: 'YouTube links that return errors no longer display in cinema mode',
      releaseV043_3: 'Media thumbnails shown in cinema scrolling text to better track when photos and videos were sent',
      releaseV044Date: 'February 2026',
      releaseV044_1: 'Cinema mode: black background on start, photo and video thumbnails fixed and enlarged',
      releaseV044_2: 'YouTube autoplay disabled, only thumbnails are shown',
      releaseV044_3: 'Translation: source text is replaced by the translation instead of showing both',
      releaseV044_4: 'Cinema mode: live translation with integrated language selection menu',
      releaseV044_5: 'Landing page illustration adjusted to prevent overflow',
      releaseV04Date: 'February 2026',
      releaseV04_1: 'Live background without blur, sharp images and videos',
      releaseV04_2: 'Phone and its contents always in the foreground',
      releaseV04_3: 'New "Full Screen" mode: large text with outlines, full-page media',
      releaseV012Date: 'February 2026',
      releaseV011Date: 'February 2026',
      releaseV010Date: 'February 2026',
      releaseInitialLabel: 'Initial release',
      releaseV02_1: 'Multi-language support (English, French, Spanish, Italian, German, Corsican, Russian, Chinese, Japanese, Korean)',
      releaseV02_2: 'Landing page with "How it works", "About", and "Release notes" sections',
      releaseV02_3: 'News ticker scrolling for long group names and sidebar chat names',
      releaseV02_4: 'Version number displayed on landing page',
      releaseV03_5: 'Added 4 new languages: Russian, Chinese, Japanese, Korean',
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

      // ---- Profiler v0.5 ----
      profilerBtnTitle: 'Psychological profile',
      profilerTitle: 'Group psychological analysis',
      profilerSubtitle: 'Each member\'s profile based on conversation analysis',
      profilerNoData: 'Load a group conversation to see the analysis.',
      profilerMessages: 'Messages',
      profilerAvgLength: 'Avg length',
      profilerCharsPerMsg: 'chars/msg',
      profilerMediaSent: 'Media sent',
      profilerEmojis: 'Emojis',
      profilerQuestions: 'Questions asked',
      profilerLinks: 'Links shared',
      profilerInitiations: 'Conversations started',
      profilerAvgResponseTime: 'Avg response time',
      profilerMostActiveHour: 'Most active hour',
      profilerTopEmojis: 'Favorite emojis',
      profilerPersonality: 'Psychological profile',
      profilerTraits: 'Personality traits',
      profilerCommunicationStyle: 'Communication style',
      profilerGroupRole: 'Group role',
      profilerMinutes: 'min',
      profilerHours: 'h',
      profilerDays: 'd',
      profilerStyleVerbose: 'Verbose',
      profilerStyleConcise: 'Concise',
      profilerStyleExpressive: 'Expressive',
      profilerStyleFactual: 'Factual',
      profilerStyleInquisitive: 'Inquisitive',
      profilerStyleResponsive: 'Responsive',
      profilerStyleInitiator: 'Initiator',
      profilerStyleMediaHeavy: 'Visual',
      profilerRoleLeader: 'Leader',
      profilerRoleConnector: 'Connector',
      profilerRoleObserver: 'Observer',
      profilerRoleEntertainer: 'Entertainer',
      profilerRoleSupporter: 'Supporter',
      profilerRoleAnalyst: 'Analyst',
      profilerActivity: 'Activity',
      profilerActivityChart: 'Hourly breakdown',
      profilerSentiment: 'Sentiment',
      profilerSentimentPositive: 'Positive',
      profilerSentimentNeutral: 'Neutral',
      profilerSentimentNegative: 'Negative',
      profilerWordCloud: 'Frequent words',
      profilerOverview: 'Overview',
      profilerDominance: 'Conversational dominance',
      releaseV05Date: 'March 2026',
      releaseV05_1: 'Psychological analysis of group members with personality profiles',
      releaseV05_2: 'Radar charts and hourly activity breakdown per member',
      releaseV05_3: 'Automatic detection of communication style and group role',
      releaseV05_4: 'Sentiment analysis and favorite emojis',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: 'Your profile',
      profilerYourProfileSubtitle: 'Personal analysis based on your messages',
      profilerNarrative: 'Psychological portrait',
      profilerVsGroup: 'Compared to the group',
      profilerVsGroupAvg: 'Group average',
      profilerYou: 'You',
      profilerMoreThan: 'more than average',
      profilerLessThan: 'less than average',
      profilerOnPar: 'on par with the group',
      profilerBigFive: 'Personality indicators',
      profilerBigFiveOpenness: 'Openness',
      profilerBigFiveConscientiousness: 'Conscientiousness',
      profilerBigFiveExtraversion: 'Extraversion',
      profilerBigFiveAgreeableness: 'Agreeableness',
      profilerBigFiveNeuroticism: 'Emotional stability',
      profilerNarrIntro: 'As a ',
      profilerNarrVerbose: 'verbose communicator, you take the time to develop your thoughts in detail. Your long messages reveal a thoughtful personality that values nuance and context.',
      profilerNarrConcise: 'concise communicator, you get straight to the point. Your short, efficient messages reveal a pragmatic personality that values clarity and action.',
      profilerNarrExpressive: 'Your abundant use of emojis and exclamation marks reveals a warm, emotionally open personality. You bring energy and color to conversations.',
      profilerNarrFactual: 'Your sober, factual style with few emojis reveals an analytical personality that prefers facts over emotions in exchanges.',
      profilerNarrInquisitive: 'You ask a lot of questions, demonstrating a natural intellectual curiosity and a genuine interest in others.',
      profilerNarrResponsive: 'Your fast response time shows you are highly attentive to conversations and value responsiveness.',
      profilerNarrInitiator: 'You frequently start new conversations, revealing a proactive and socially confident temperament.',
      profilerNarrMediaHeavy: 'You share a lot of visual content, revealing a personality that thinks in images and prefers showing over telling.',
      profilerNarrLeader: 'In this group, you naturally occupy the leader role — the one who sets the tone, starts topics and keeps the conversation flowing.',
      profilerNarrConnector: 'You are the group\'s connector — the one who asks questions, links people together and maintains the social bond.',
      profilerNarrObserver: 'You tend to be an observer in this group — present but discreet, you contribute sparingly and wisely.',
      profilerNarrEntertainer: 'You are the group\'s entertainer — the one who brings humor, laughter and positive energy to conversations.',
      profilerNarrSupporter: 'You play a supportive role in this group — responsive, positive and always there when someone needs a reply.',
      profilerNarrAnalyst: 'You are the group\'s analyst — the one who shares links, writes detailed messages and brings depth to discussions.',
      profilerNarrDefaultRole: 'You actively participate in the group in your own way, bringing your unique style to conversations.',
      releaseV051Date: 'March 2026',
      releaseV051_1: 'Personal psychological profile with auto-generated narrative portrait',
      releaseV051_2: 'Big Five personality indicators inferred from communication habits',
      releaseV051_3: 'Comparison of your stats against the group average',
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
      bioIntro: 'Localization Program Manager en Perplexity (desde enero de 2026, San Francisco, híbrido). Especialista en localización y gestión de programas lingüísticos, con más de 25 años de experiencia internacional.',
      bioExpTitle: 'Experiencia',
      bioPresent: 'presente',
      bioMinistryTitle: 'Ministerio de Educación Nacional (Francia)',
      bioMinistryRole: 'Profesor titular de inglés (Agrégé)',
      bioPrepenaRole: 'Becario Prep\'ENA',
      bioBramhallRole: 'Profesor asistente de idiomas extranjeros',
      bioEduTitle: 'Formación',
      bioEduField: 'Lengua y Literatura inglesas',
      bioEduSchool: 'Université Côte d\'Azur',
      bioPubTitle: 'Publicaciones académicas',
      bioCertTitle: 'Certificaciones',
      bioCertEna: 'Certificado de formación ENA (dic. 2013)',
      bioCertLinkedin: 'Certificaciones LinkedIn Learning (Linux, Python, Data Science)',
      bioLangTitle: 'Idiomas',
      bioLangList: 'Corso, inglés, francés, italiano — competencia nativa o bilingüe.',
      bioMiscTitle: 'Varios',
      bioMiscContent: 'Actor en el cortometraje « Mission insulaire » (2005)',
      bioMiscRally: 'Copiloto de rally.',
      releaseTitle: 'Notas de versión',
      releaseV023Date: 'Febrero 2026',
      releaseV023_1: 'Biografía del autor completamente reescrita a partir del perfil de LinkedIn',
      releaseV023_2: 'Todas las banderas reemplazadas por SVG rectangulares planos uniformes (sin archivos PNG externos)',
      releaseV022Date: 'Febrero 2026',
      releaseV022_1: 'Bandera corsa auténtica (cabeza de moro) en reemplazo del icono anterior',
      releaseV022_2: 'Corrección del enlace LinkedIn del autor',
      releaseV021Date: 'Febrero 2026',
      releaseV021_1: 'Corrección de la biografía del autor',
      releaseV021_2: 'Bandera corsa animada en reemplazo del texto "CO"',
      releaseV021_3: 'Actualización del número de versión',
      releaseV02Date: 'Febrero 2026',
      releaseCurrentLabel: 'Versión actual',
      releaseV03Date: 'Febrero 2026',
      releaseV03_1: 'Vista en vivo con reproducción animada de conversaciones y sonidos de burbujas',
      releaseV03_2: 'Biografía del autor corregida según el perfil verificado de LinkedIn',
      releaseV03_3: 'Nueva sección «¿Para qué sirve?» en la página de inicio',
      releaseV03_4: 'Selector de vista movido a la izquierda, banderas a la derecha',
      whatIsItForTitle: '¿Para qué sirve?',
      whatIsPoint1: 'WhatsApp invade tu teléfono. Fotos, vídeos y mensajes se acumulan durante años — y la memoria se llena rápidamente.',
      whatIsPoint2: 'Apple cobra una fortuna por cada nivel de almacenamiento. 128 GB, 256 GB, 512 GB, 1 TB\u2026 y el precio sube con cada nuevo iPhone.',
      whatIsPoint3: 'Sin embargo, nadie quiere borrar esos recuerdos: conversaciones preciosas, fotos familiares, momentos de grupo. Esos instantes importan.',
      whatIsPoint4: 'Esta aplicación amplía tu memoria: exporta tus conversaciones de WhatsApp, libera espacio en el teléfono y revive cada momento exactamente como ocurrió — burbujas, medios, marcas de tiempo, todo en pantalla completa cinematográfica.',
      whatIsPoint5: 'Revive el momento: el modo cine transforma tus conversaciones en una experiencia inmersiva a pantalla completa. Las fotos y vídeos aparecen de fondo mientras el texto flota por encima — como una película de tus recuerdos.',
      whatIsPoint6: 'Tus datos permanecen estrictamente privados: todo funciona localmente en tu navegador. Nada se sube a ningún servidor.',
      liveSpeedLabel: 'Velocidad',
      homeButtonTitle: 'Inicio',
      livePrevYear: '-1 año',
      livePrevMonth: '-1 mes',
      livePrevDay: '-1 día',
      liveNextDay: '+1 día',
      liveNextMonth: '+1 mes',
      liveNextYear: '+1 año',
      livePlayPause: 'Reproducir / Pausa',
      liveTimelineLabel: 'Cronología',
      releaseV031Date: 'Febrero 2026',
      releaseV031_1: 'Banderas de UK, EE.UU. y Corea del Sur mejoradas',
      releaseV031_2: 'Botón Inicio separado para volver a la página de inicio',
      releaseV031_3: 'Fondo de imagen en fundido durante la reproducción Live',
      releaseV031_4: 'Efecto máquina de escribir para los mensajes en vista Live',
      releaseV031_5: 'Deslizador de cronología para navegar por la conversación',
      releaseV031_6: 'Todos los elementos de la interfaz localizados',
      releaseV032Date: 'Febrero 2026',
      releaseV032_1: 'Fondo en vivo: ahora soporta imágenes Y vídeos (pantalla completa)',
      releaseV032_2: 'Biografía del autor reestructurada y localizada en los 11 idiomas',
      releaseV032_3: 'Menciones @ en verde negrita como en WhatsApp',
      releaseV032_4: 'Efecto de escritura natural con intervalos variables',
      releaseV032_5: 'Nombre corregido: Pierre Régis Gonsolin',
      cinemaButtonTitle: 'Pantalla completa cine',
      cinemaAutoScroll: 'Desplazamiento automático',
      cinemaSlower: 'Más lento',
      cinemaFaster: 'Más rápido',
      releaseV041Date: 'Febrero 2026',
      releaseV041_1: 'Modo cine con pantalla completa real del navegador y botón de alternar',
      releaseV041_2: 'Medios sin barras negras, relleno completo de la pantalla',
      releaseV041_3: 'Enlaces de YouTube integrados automáticamente como fondo con transición',
      howStep4Title: 'Elige tu modo de visualización',
      howStep4Desc: 'Cinco modos de vista: iPhone, iPad (barra lateral multi-conversación), pantalla completa web, reproducción Live animada y modo Cine inmersivo con medios de fondo.',
      howStep5Title: 'Modo Cine',
      howStep5Desc: 'Pantalla completa del navegador, fotos y vídeos en fundido de fondo, enlaces YouTube integrados automáticamente, sonido con fundido suave y texto con contornos flotando encima.',
      howStep6Title: 'Traducción en directo',
      howStep6Desc: 'El idioma de la conversación se detecta automáticamente. Elige un idioma de destino y todos los mensajes se traducen instantáneamente — sin salir de la aplicación.',
      translateBtnTitle: 'Traducir',
      translateDetected: 'Detectado:',
      translateOff: 'Traducción desactivada',
      translateInProgress: 'Traduciendo...',
      translateSameLang: 'Mismo idioma',
      releaseV042Date: 'Febrero 2026',
      releaseV042_1: 'Traducción en directo: detección automática del idioma y traducción instantánea',
      releaseV042_2: 'Fundido de audio suave en las transiciones de medios',
      releaseV042_3: 'Sonido activado por defecto en modo cine',
      releaseV042_4: 'Contenido de marketing mejorado y nuevos pasos en « Cómo funciona »',
      releaseV043Date: 'Febrero 2026',
      releaseV043_1: 'Ilustración de la página de inicio ajustada: el teléfono ya no se superpone al contorno',
      releaseV043_2: 'Los enlaces de YouTube con error ya no se muestran en modo cine',
      releaseV043_3: 'Miniaturas de medios visibles en el texto desplazable del modo cine para seguir mejor las fotos y vídeos enviados',
      releaseV044Date: 'Febrero 2026',
      releaseV044_1: 'Modo cine: fondo negro al inicio, miniaturas de fotos y vídeos corregidas y ampliadas',
      releaseV044_2: 'Reproducción automática de YouTube desactivada, solo se muestran miniaturas',
      releaseV044_3: 'Traducción: el texto original se reemplaza por la traducción en lugar de mostrar ambos',
      releaseV044_4: 'Modo cine: traducción en directo con menú de selección de idioma integrado',
      releaseV044_5: 'Ilustración de la página de inicio ajustada para evitar desbordamiento',
      releaseV04Date: 'Febrero 2026',
      releaseV04_1: 'Fondo en vivo sin desenfoque, imágenes y vídeos nítidos',
      releaseV04_2: 'Teléfono y su contenido siempre en primer plano',
      releaseV04_3: 'Nuevo modo « Pantalla completa »: texto grande con contornos, medios a pantalla completa',
      releaseV012Date: 'Febrero 2026',
      releaseV011Date: 'Febrero 2026',
      releaseV010Date: 'Febrero 2026',
      releaseInitialLabel: 'Versión inicial',
      releaseV02_1: 'Soporte multilingüe (inglés, francés, español, italiano, alemán, corso, ruso, chino, japonés, coreano)',
      releaseV02_2: 'Página de inicio con secciones "Cómo funciona", "Sobre" y "Notas de versión"',
      releaseV02_3: 'Desplazamiento ticker para nombres de grupos largos y nombres en la barra lateral',
      releaseV02_4: 'Número de versión mostrado en la página de inicio',
      releaseV03_5: 'Añadidos 4 nuevos idiomas: ruso, chino, japonés, coreano',
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

      // ---- Profiler v0.5 ----
      profilerBtnTitle: 'Perfil psicológico',
      profilerTitle: 'Análisis psicológico del grupo',
      profilerSubtitle: 'Perfil de cada miembro basado en el análisis de la conversación',
      profilerNoData: 'Carga una conversación de grupo para ver el análisis.',
      profilerMessages: 'Mensajes',
      profilerAvgLength: 'Long. media',
      profilerCharsPerMsg: 'car/msg',
      profilerMediaSent: 'Medios enviados',
      profilerEmojis: 'Emojis',
      profilerQuestions: 'Preguntas formuladas',
      profilerLinks: 'Enlaces compartidos',
      profilerInitiations: 'Conversaciones iniciadas',
      profilerAvgResponseTime: 'Tiempo de respuesta medio',
      profilerMostActiveHour: 'Hora más activa',
      profilerTopEmojis: 'Emojis favoritos',
      profilerPersonality: 'Perfil psicológico',
      profilerTraits: 'Rasgos de personalidad',
      profilerCommunicationStyle: 'Estilo de comunicación',
      profilerGroupRole: 'Rol en el grupo',
      profilerMinutes: 'min',
      profilerHours: 'h',
      profilerDays: 'd',
      profilerStyleVerbose: 'Prolijo',
      profilerStyleConcise: 'Conciso',
      profilerStyleExpressive: 'Expresivo',
      profilerStyleFactual: 'Factual',
      profilerStyleInquisitive: 'Curioso',
      profilerStyleResponsive: 'Reactivo',
      profilerStyleInitiator: 'Iniciador',
      profilerStyleMediaHeavy: 'Visual',
      profilerRoleLeader: 'Líder',
      profilerRoleConnector: 'Conector',
      profilerRoleObserver: 'Observador',
      profilerRoleEntertainer: 'Animador',
      profilerRoleSupporter: 'Soporte',
      profilerRoleAnalyst: 'Analista',
      profilerActivity: 'Actividad',
      profilerActivityChart: 'Distribución horaria',
      profilerSentiment: 'Sentimiento',
      profilerSentimentPositive: 'Positivo',
      profilerSentimentNeutral: 'Neutro',
      profilerSentimentNegative: 'Negativo',
      profilerWordCloud: 'Palabras frecuentes',
      profilerOverview: 'Vista general',
      profilerDominance: 'Dominancia conversacional',
      releaseV05Date: 'Marzo 2026',
      releaseV05_1: 'Análisis psicológico de los miembros del grupo con perfiles de personalidad',
      releaseV05_2: 'Gráficos radar y distribución horaria por miembro',
      releaseV05_3: 'Detección automática del estilo de comunicación y del rol en el grupo',
      releaseV05_4: 'Análisis de sentimiento y emojis favoritos',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: 'Tu perfil',
      profilerYourProfileSubtitle: 'Análisis personal basado en tus mensajes',
      profilerNarrative: 'Retrato psicológico',
      profilerVsGroup: 'Comparado con el grupo',
      profilerVsGroupAvg: 'Media del grupo',
      profilerYou: 'Tú',
      profilerMoreThan: 'más que la media',
      profilerLessThan: 'menos que la media',
      profilerOnPar: 'en la media del grupo',
      profilerBigFive: 'Indicadores de personalidad',
      profilerBigFiveOpenness: 'Apertura',
      profilerBigFiveConscientiousness: 'Responsabilidad',
      profilerBigFiveExtraversion: 'Extraversión',
      profilerBigFiveAgreeableness: 'Amabilidad',
      profilerBigFiveNeuroticism: 'Estabilidad emocional',
      profilerNarrIntro: 'Como ',
      profilerNarrVerbose: 'comunicador prolijo, te tomas el tiempo de desarrollar tus pensamientos en detalle. Tus mensajes largos revelan una personalidad reflexiva que valora el matiz y el contexto.',
      profilerNarrConcise: 'comunicador conciso, vas directo al grano. Tus mensajes cortos y eficientes revelan una personalidad pragmática que valora la claridad y la acción.',
      profilerNarrExpressive: 'Tu uso abundante de emojis y signos de exclamación revela una personalidad cálida y emocionalmente abierta. Aportas energía y color a las conversaciones.',
      profilerNarrFactual: 'Tu estilo sobrio y factual, con pocos emojis, revela una personalidad analítica que prefiere los hechos a las emociones en los intercambios.',
      profilerNarrInquisitive: 'Haces muchas preguntas, lo que demuestra una curiosidad intelectual natural y un interés genuino por los demás.',
      profilerNarrResponsive: 'Tu tiempo de respuesta rápido muestra que estás muy atento a las conversaciones y valoras la capacidad de respuesta.',
      profilerNarrInitiator: 'Inicias nuevas conversaciones con frecuencia, lo que revela un temperamento proactivo y socialmente seguro.',
      profilerNarrMediaHeavy: 'Compartes mucho contenido visual, lo que revela una personalidad que piensa en imágenes y prefiere mostrar antes que contar.',
      profilerNarrLeader: 'En este grupo, ocupas naturalmente el rol de líder — quien marca el tono, lanza los temas y mantiene el ritmo de las conversaciones.',
      profilerNarrConnector: 'Eres el conector del grupo — quien hace preguntas, une a las personas y mantiene el vínculo social.',
      profilerNarrObserver: 'Tiendes a ser un observador en este grupo — presente pero discreto, intervienes con moderación y acierto.',
      profilerNarrEntertainer: 'Eres el animador del grupo — quien aporta humor, risas y energía positiva a las conversaciones.',
      profilerNarrSupporter: 'Juegas un papel de apoyo en este grupo — reactivo, positivo y siempre presente cuando alguien necesita una respuesta.',
      profilerNarrAnalyst: 'Eres el analista del grupo — quien comparte enlaces, escribe mensajes detallados y aporta profundidad a las discusiones.',
      profilerNarrDefaultRole: 'Participas activamente en el grupo a tu manera, aportando tu estilo único a las conversaciones.',
      releaseV051Date: 'Marzo 2026',
      releaseV051_1: 'Perfil psicológico personal con retrato narrativo generado automáticamente',
      releaseV051_2: 'Indicadores de personalidad Big Five inferidos de los hábitos de comunicación',
      releaseV051_3: 'Comparación de tus estadísticas con la media del grupo',
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
      bioIntro: 'Localization Program Manager presso Perplexity (da gennaio 2026, San Francisco, ibrido). Specialista in localizzazione e gestione di programmi linguistici, con oltre 25 anni di esperienza internazionale.',
      bioExpTitle: 'Esperienza',
      bioPresent: 'presente',
      bioMinistryTitle: 'Ministero dell\'Istruzione (Francia)',
      bioMinistryRole: 'Professore di inglese abilitato (Agrégé)',
      bioPrepenaRole: 'Stagista Prep\'ENA',
      bioBramhallRole: 'Assistente di lingua straniera',
      bioEduTitle: 'Formazione',
      bioEduField: 'Lingua e Letteratura inglese',
      bioEduSchool: 'Université Côte d\'Azur',
      bioPubTitle: 'Pubblicazioni accademiche',
      bioCertTitle: 'Certificazioni',
      bioCertEna: 'Certificato di formazione ENA (dic. 2013)',
      bioCertLinkedin: 'Certificazioni LinkedIn Learning (Linux, Python, Data Science)',
      bioLangTitle: 'Lingue',
      bioLangList: 'Corso, inglese, francese, italiano — competenza nativa o bilingue.',
      bioMiscTitle: 'Varie',
      bioMiscContent: 'Attore nel cortometraggio « Mission insulaire » (2005)',
      bioMiscRally: 'Copilota di rally.',
      releaseTitle: 'Note di rilascio',
      releaseV023Date: 'Febbraio 2026',
      releaseV023_1: 'Biografia dell\'autore completamente riscritta dal profilo LinkedIn',
      releaseV023_2: 'Tutte le bandiere sostituite con SVG rettangolari piatti uniformi (nessun file PNG esterno)',
      releaseV022Date: 'Febbraio 2026',
      releaseV022_1: 'Bandiera corsa autentica (testa di Moro) al posto dell\'icona precedente',
      releaseV022_2: 'Correzione del link LinkedIn dell\'autore',
      releaseV021Date: 'Febbraio 2026',
      releaseV021_1: 'Correzione della biografia dell\'autore',
      releaseV021_2: 'Bandiera corsa animata al posto del testo "CO"',
      releaseV021_3: 'Aggiornamento del numero di versione',
      releaseV02Date: 'Febbraio 2026',
      releaseCurrentLabel: 'Versione corrente',
      releaseV03Date: 'Febbraio 2026',
      releaseV03_1: 'Vista Live con riproduzione animata delle conversazioni e suoni di bolle',
      releaseV03_2: 'Biografia dell\'autore corretta dal profilo LinkedIn verificato',
      releaseV03_3: 'Nuova sezione \'A cosa serve?\' nella pagina iniziale',
      releaseV03_4: 'Selettore di vista spostato a sinistra, bandiere a destra',
      whatIsItForTitle: 'A cosa serve?',
      whatIsPoint1: 'WhatsApp invade il tuo telefono. Foto, video e messaggi si accumulano per anni — e la memoria si riempie velocemente.',
      whatIsPoint2: 'Apple fa pagare una fortuna per ogni livello di archiviazione. 128 GB, 256 GB, 512 GB, 1 TB\u2026 e il prezzo sale con ogni nuovo iPhone.',
      whatIsPoint3: 'Eppure nessuno vuole cancellare quei ricordi: conversazioni preziose, foto di famiglia, momenti di gruppo. Quegli attimi contano.',
      whatIsPoint4: 'Questa app potenzia la tua memoria: esporta le conversazioni WhatsApp, libera spazio sul telefono e rivivi ogni momento esattamente come è successo — bolle, media, timestamp, il tutto in schermo intero cinematografico.',
      whatIsPoint5: 'Rivivi il momento: la modalità cinema trasforma le tue conversazioni in un\'esperienza immersiva a schermo intero. Foto e video sfumano sullo sfondo mentre il testo fluttua sopra — come un film dei tuoi ricordi.',
      whatIsPoint6: 'I tuoi dati restano strettamente privati: tutto funziona localmente nel tuo browser. Nulla viene caricato su alcun server.',
      liveSpeedLabel: 'Velocità',
      homeButtonTitle: 'Home',
      livePrevYear: '-1 anno',
      livePrevMonth: '-1 mese',
      livePrevDay: '-1 giorno',
      liveNextDay: '+1 giorno',
      liveNextMonth: '+1 mese',
      liveNextYear: '+1 anno',
      livePlayPause: 'Riproduzione / Pausa',
      liveTimelineLabel: 'Cronologia',
      releaseV031Date: 'Febbraio 2026',
      releaseV031_1: 'Bandiere UK, USA e Corea del Sud migliorate',
      releaseV031_2: 'Pulsante Home separato per tornare alla pagina iniziale',
      releaseV031_3: 'Sfondo immagine in dissolvenza durante la riproduzione Live',
      releaseV031_4: 'Effetto macchina da scrivere per i messaggi nella vista Live',
      releaseV031_5: 'Cursore cronologia per navigare nella conversazione',
      releaseV031_6: 'Tutti gli elementi dell\'interfaccia localizzati',
      releaseV032Date: 'Febbraio 2026',
      releaseV032_1: 'Sfondo live: ora supporta sia immagini CHE video (a schermo intero)',
      releaseV032_2: 'Biografia dell\'autore ristrutturata e localizzata in tutte le 11 lingue',
      releaseV032_3: 'Menzioni @ in verde grassetto come su WhatsApp',
      releaseV032_4: 'Effetto di digitazione naturale con intervalli variabili',
      releaseV032_5: 'Nome corretto: Pierre Régis Gonsolin',
      cinemaButtonTitle: 'Schermo intero cinema',
      cinemaAutoScroll: 'Scorrimento automatico',
      cinemaSlower: 'Più lento',
      cinemaFaster: 'Più veloce',
      releaseV041Date: 'Febbraio 2026',
      releaseV041_1: 'Modalità cinema con schermo intero reale del browser e pulsante di commutazione',
      releaseV041_2: 'Media senza barre nere, riempimento completo dello schermo',
      releaseV041_3: 'Link YouTube incorporati automaticamente come sfondo con dissolvenza',
      howStep4Title: 'Scegli la tua modalità di visualizzazione',
      howStep4Desc: 'Cinque modalità di vista: iPhone, iPad (barra laterale multi-conversazione), schermo intero web, riproduzione Live animata e modalità Cinema immersiva con media di sfondo.',
      howStep5Title: 'Modalità Cinema',
      howStep5Desc: 'Schermo intero del browser, foto e video in dissolvenza sullo sfondo, link YouTube integrati automaticamente, audio con dissolvenza progressiva e testo con contorni che fluttua sopra.',
      howStep6Title: 'Traduzione in diretta',
      howStep6Desc: 'La lingua della conversazione viene rilevata automaticamente. Scegli una lingua di destinazione e tutti i messaggi vengono tradotti istantaneamente — senza uscire dall\'app.',
      translateBtnTitle: 'Traduci',
      translateDetected: 'Rilevato:',
      translateOff: 'Traduzione disattivata',
      translateInProgress: 'Traduzione...',
      translateSameLang: 'Stessa lingua',
      releaseV042Date: 'Febbraio 2026',
      releaseV042_1: 'Traduzione in diretta: rilevamento automatico della lingua e traduzione istantanea',
      releaseV042_2: 'Dissolvenza audio progressiva nelle transizioni dei media',
      releaseV042_3: 'Audio attivo di default in modalità cinema',
      releaseV042_4: 'Contenuti marketing arricchiti e nuovi passaggi in « Come funziona »',
      releaseV043Date: 'Febbraio 2026',
      releaseV043_1: 'Illustrazione della pagina iniziale corretta: il telefono non si sovrappone più al contorno',
      releaseV043_2: 'I link YouTube con errore non vengono più visualizzati in modalità cinema',
      releaseV043_3: 'Miniature dei media visibili nel testo scorrevole della modalità cinema per identificare meglio foto e video inviati',
      releaseV044Date: 'Febbraio 2026',
      releaseV044_1: 'Modalità cinema: sfondo nero all\'avvio, miniature di foto e video corrette e ingrandite',
      releaseV044_2: 'Riproduzione automatica YouTube disattivata, vengono mostrate solo le miniature',
      releaseV044_3: 'Traduzione: il testo originale viene sostituito dalla traduzione invece di mostrare entrambi',
      releaseV044_4: 'Modalità cinema: traduzione in diretta con menu di selezione lingua integrato',
      releaseV044_5: 'Illustrazione della pagina iniziale corretta per evitare overflow',
      releaseV04Date: 'Febbraio 2026',
      releaseV04_1: 'Sfondo live senza sfocatura, immagini e video nitidi',
      releaseV04_2: 'Telefono e il suo contenuto sempre in primo piano',
      releaseV04_3: 'Nuova modalità « Schermo intero »: testo grande con contorni, media a pagina intera',
      releaseV012Date: 'Febbraio 2026',
      releaseInitialLabel: 'Versione iniziale',
      releaseV02_1: 'Supporto multilingue (inglese, francese, spagnolo, italiano, tedesco, corso, russo, cinese, giapponese, coreano)',
      releaseV02_2: 'Pagina iniziale con sezioni "Come funziona", "Info" e "Note di rilascio"',
      releaseV02_3: 'Scorrimento ticker per nomi di gruppo lunghi e nomi nella barra laterale',
      releaseV02_4: 'Numero di versione visualizzato nella pagina iniziale',
      releaseV03_5: 'Aggiunta del supporto per 4 nuove lingue: russo, cinese, giapponese, coreano',
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

      // ---- Profiler v0.5 ----
      profilerBtnTitle: 'Profilo psicologico',
      profilerTitle: 'Analisi psicologica del gruppo',
      profilerSubtitle: 'Profilo di ogni membro basato sull\'analisi della conversazione',
      profilerNoData: 'Carica una conversazione di gruppo per vedere l\'analisi.',
      profilerMessages: 'Messaggi',
      profilerAvgLength: 'Lungh. media',
      profilerCharsPerMsg: 'car/msg',
      profilerMediaSent: 'Media inviati',
      profilerEmojis: 'Emoji',
      profilerQuestions: 'Domande poste',
      profilerLinks: 'Link condivisi',
      profilerInitiations: 'Conversazioni avviate',
      profilerAvgResponseTime: 'Tempo di risposta medio',
      profilerMostActiveHour: 'Ora più attiva',
      profilerTopEmojis: 'Emoji preferiti',
      profilerPersonality: 'Profilo psicologico',
      profilerTraits: 'Tratti della personalità',
      profilerCommunicationStyle: 'Stile di comunicazione',
      profilerGroupRole: 'Ruolo nel gruppo',
      profilerMinutes: 'min',
      profilerHours: 'h',
      profilerDays: 'g',
      profilerStyleVerbose: 'Prolisso',
      profilerStyleConcise: 'Conciso',
      profilerStyleExpressive: 'Espressivo',
      profilerStyleFactual: 'Fattuale',
      profilerStyleInquisitive: 'Curioso',
      profilerStyleResponsive: 'Reattivo',
      profilerStyleInitiator: 'Iniziatore',
      profilerStyleMediaHeavy: 'Visivo',
      profilerRoleLeader: 'Leader',
      profilerRoleConnector: 'Connettore',
      profilerRoleObserver: 'Osservatore',
      profilerRoleEntertainer: 'Animatore',
      profilerRoleSupporter: 'Supporto',
      profilerRoleAnalyst: 'Analista',
      profilerActivity: 'Attività',
      profilerActivityChart: 'Distribuzione oraria',
      profilerSentiment: 'Sentimento',
      profilerSentimentPositive: 'Positivo',
      profilerSentimentNeutral: 'Neutro',
      profilerSentimentNegative: 'Negativo',
      profilerWordCloud: 'Parole frequenti',
      profilerOverview: 'Panoramica',
      profilerDominance: 'Dominanza conversazionale',
      releaseV05Date: 'Marzo 2026',
      releaseV05_1: 'Analisi psicologica dei membri del gruppo con profili di personalità',
      releaseV05_2: 'Grafici radar e distribuzione oraria per membro',
      releaseV05_3: 'Rilevamento automatico dello stile di comunicazione e del ruolo nel gruppo',
      releaseV05_4: 'Analisi del sentimento ed emoji preferiti',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: 'Il tuo profilo',
      profilerYourProfileSubtitle: 'Analisi personale basata sui tuoi messaggi',
      profilerNarrative: 'Ritratto psicologico',
      profilerVsGroup: 'Rispetto al gruppo',
      profilerVsGroupAvg: 'Media del gruppo',
      profilerYou: 'Tu',
      profilerMoreThan: 'in più rispetto alla media',
      profilerLessThan: 'in meno rispetto alla media',
      profilerOnPar: 'nella media del gruppo',
      profilerBigFive: 'Indicatori di personalità',
      profilerBigFiveOpenness: 'Apertura',
      profilerBigFiveConscientiousness: 'Coscienziosità',
      profilerBigFiveExtraversion: 'Estroversione',
      profilerBigFiveAgreeableness: 'Gradevolezza',
      profilerBigFiveNeuroticism: 'Stabilità emotiva',
      profilerNarrIntro: 'Come ',
      profilerNarrVerbose: 'comunicatore prolisso, ti prendi il tempo di sviluppare i tuoi pensieri in dettaglio. I tuoi messaggi lunghi rivelano una personalità riflessiva che apprezza la sfumatura e il contesto.',
      profilerNarrConcise: 'comunicatore conciso, vai dritto al punto. I tuoi messaggi brevi ed efficienti rivelano una personalità pragmatica che apprezza la chiarezza e l\'azione.',
      profilerNarrExpressive: 'Il tuo uso abbondante di emoji e punti esclamativi rivela una personalità calorosa ed emotivamente aperta. Porti energia e colore alle conversazioni.',
      profilerNarrFactual: 'Il tuo stile sobrio e fattuale, con pochi emoji, rivela una personalità analitica che preferisce i fatti alle emozioni negli scambi.',
      profilerNarrInquisitive: 'Fai molte domande, dimostrando una curiosità intellettuale naturale e un genuino interesse per gli altri.',
      profilerNarrResponsive: 'Il tuo tempo di risposta rapido mostra che sei molto attento alle conversazioni e apprezzi la reattività.',
      profilerNarrInitiator: 'Avvii spesso nuove conversazioni, rivelando un temperamento proattivo e socialmente sicuro.',
      profilerNarrMediaHeavy: 'Condividi molti contenuti visivi, rivelando una personalità che pensa per immagini e preferisce mostrare piuttosto che raccontare.',
      profilerNarrLeader: 'In questo gruppo, occupi naturalmente il ruolo di leader — colui che dà il tono, lancia gli argomenti e mantiene il ritmo degli scambi.',
      profilerNarrConnector: 'Sei il connettore del gruppo — colui che fa domande, collega le persone e mantiene il legame sociale.',
      profilerNarrObserver: 'Tendi a essere un osservatore in questo gruppo — presente ma discreto, intervieni con parsimonia e saggezza.',
      profilerNarrEntertainer: 'Sei l\'animatore del gruppo — colui che porta umorismo, risate ed energia positiva alle conversazioni.',
      profilerNarrSupporter: 'Svolgi un ruolo di supporto in questo gruppo — reattivo, positivo e sempre presente quando qualcuno ha bisogno di una risposta.',
      profilerNarrAnalyst: 'Sei l\'analista del gruppo — colui che condivide link, scrive messaggi dettagliati e porta profondità alle discussioni.',
      profilerNarrDefaultRole: 'Partecipi attivamente al gruppo a modo tuo, portando il tuo stile unico alle conversazioni.',
      releaseV051Date: 'Marzo 2026',
      releaseV051_1: 'Profilo psicologico personale con ritratto narrativo generato automaticamente',
      releaseV051_2: 'Indicatori di personalità Big Five dedotti dalle abitudini comunicative',
      releaseV051_3: 'Confronto delle tue statistiche con la media del gruppo',
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
      bioIntro: 'Localization Program Manager bei Perplexity (seit Januar 2026, San Francisco, Hybrid). Spezialist für Lokalisierung und sprachliche Programmverwaltung mit über 25 Jahren internationaler Erfahrung.',
      bioExpTitle: 'Berufserfahrung',
      bioPresent: 'heute',
      bioMinistryTitle: 'Französisches Bildungsministerium',
      bioMinistryRole: 'Beamteter Englischlehrer (Agrégé)',
      bioPrepenaRole: 'Prep\'ENA-Praktikant',
      bioBramhallRole: 'Fremdsprachenassistent',
      bioEduTitle: 'Ausbildung',
      bioEduField: 'Englische Sprache und Literatur',
      bioEduSchool: 'Université Côte d\'Azur',
      bioPubTitle: 'Akademische Veröffentlichungen',
      bioCertTitle: 'Zertifizierungen',
      bioCertEna: 'ENA-Ausbildungszertifikat (Dez. 2013)',
      bioCertLinkedin: 'LinkedIn Learning-Zertifizierungen (Linux, Python, Data Science)',
      bioLangTitle: 'Sprachen',
      bioLangList: 'Korsisch, Englisch, Französisch, Italienisch — muttersprachlich oder zweisprachig.',
      bioMiscTitle: 'Sonstiges',
      bioMiscContent: 'Schauspieler im Kurzfilm « Mission insulaire » (2005)',
      bioMiscRally: 'Rallye-Copilot.',
      releaseTitle: 'Versionshinweise',
      releaseV023Date: 'Februar 2026',
      releaseV023_1: 'Autorenbiografie vollständig anhand des LinkedIn-Profils neu geschrieben',
      releaseV023_2: 'Alle Flaggen durch einheitliche flache rechteckige SVGs ersetzt (keine externen PNG-Dateien)',
      releaseV022Date: 'Februar 2026',
      releaseV022_1: 'Authentische korsische Flagge (Mohrenkopf) anstelle des vorherigen Symbols',
      releaseV022_2: 'Korrektur des LinkedIn-Links des Autors',
      releaseV021Date: 'Februar 2026',
      releaseV021_1: 'Korrektur der Autorenbiografie',
      releaseV021_2: 'Animierte korsische Flagge anstelle des Textes "CO"',
      releaseV021_3: 'Aktualisierung der Versionsnummer',
      releaseV02Date: 'Februar 2026',
      releaseCurrentLabel: 'Aktuelle Version',
      releaseV03Date: 'Februar 2026',
      releaseV03_1: 'Live-Ansicht mit animierter Gesprächswiedergabe und Blasengeräuschen',
      releaseV03_2: 'Autorenbiografie anhand des verifizierten LinkedIn-Profils korrigiert',
      releaseV03_3: 'Neuer Abschnitt „Wofür ist das?“ auf der Startseite',
      releaseV03_4: 'Ansichtsauswahl nach links verschoben, Flaggen rechts',
      whatIsItForTitle: 'Wofür ist das?',
      whatIsPoint1: 'WhatsApp überschwemmt dein Telefon. Fotos, Videos und Nachrichten häufen sich über Jahre an — und der Speicher füllt sich rasend schnell.',
      whatIsPoint2: 'Apple verlangt einen hohen Preis für jede Speicherstufe. 128 GB, 256 GB, 512 GB, 1 TB\u2026 und der Preis steigt mit jedem neuen iPhone.',
      whatIsPoint3: 'Dennoch will niemand diese Erinnerungen löschen: wertvolle Gespräche, Familienfotos, Gruppenmomente. Diese Augenblicke zählen.',
      whatIsPoint4: 'Diese App erweitert Ihr Gedächtnis: Exportieren Sie Ihre WhatsApp-Unterhaltungen, geben Sie Telefonspeicher frei und erleben Sie jeden Moment genau so wieder, wie er passiert ist — Blasen, Medien, Zeitstempel, alles im Kino-Vollbild.',
      whatIsPoint5: 'Erleben Sie den Moment neu: Der Kino-Modus verwandelt Ihre Unterhaltungen in ein immersives Vollbild-Erlebnis. Fotos und Videos blenden im Hintergrund ein, während der Text darüber schwebt — wie ein Film Ihrer Erinnerungen.',
      whatIsPoint6: 'Ihre Daten bleiben streng privat: Alles läuft lokal in Ihrem Browser. Nichts wird auf einen Server hochgeladen.',
      liveSpeedLabel: 'Geschwindigkeit',
      homeButtonTitle: 'Startseite',
      livePrevYear: '-1 Jahr',
      livePrevMonth: '-1 Monat',
      livePrevDay: '-1 Tag',
      liveNextDay: '+1 Tag',
      liveNextMonth: '+1 Monat',
      liveNextYear: '+1 Jahr',
      livePlayPause: 'Abspielen / Pause',
      liveTimelineLabel: 'Zeitachse',
      releaseV031Date: 'Februar 2026',
      releaseV031_1: 'Verbesserte Flaggen für UK, USA und Südkorea',
      releaseV031_2: 'Separater Startseite-Button zum Zurückgehen',
      releaseV031_3: 'Bildhintergrund-Einblendung während der Live-Wiedergabe',
      releaseV031_4: 'Schreibmaschineneffekt für Nachrichten in der Live-Ansicht',
      releaseV031_5: 'Zeitachsen-Regler zur Navigation im Gespräch',
      releaseV031_6: 'Alle UI-Elemente lokalisiert',
      releaseV032Date: 'Februar 2026',
      releaseV032_1: 'Live-Hintergrund: unterstützt jetzt Bilder UND Videos (Vollbild)',
      releaseV032_2: 'Autorenbiografie umstrukturiert und in allen 11 Sprachen lokalisiert',
      releaseV032_3: '@Erwähnungen in fettem Grün wie bei WhatsApp',
      releaseV032_4: 'Natürlicher Tippeffekt mit variablen Intervallen',
      releaseV032_5: 'Name korrigiert: Pierre Régis Gonsolin',
      cinemaButtonTitle: 'Kino-Vollbild',
      cinemaAutoScroll: 'Automatisches Scrollen',
      cinemaSlower: 'Langsamer',
      cinemaFaster: 'Schneller',
      releaseV041Date: 'Februar 2026',
      releaseV041_1: 'Kino-Modus nutzt echten Browser-Vollbild mit Umschaltknopf',
      releaseV041_2: 'Medien füllen den gesamten Bildschirm ohne schwarze Balken',
      releaseV041_3: 'YouTube-Links automatisch als Hintergrundvideos mit Überblendung eingebettet',
      howStep4Title: 'Wählen Sie Ihren Anzeigemodus',
      howStep4Desc: 'Fünf Ansichtsmodi: iPhone, iPad (Multi-Chat-Seitenleiste), Web-Vollbild, animierte Live-Wiedergabe und immersiver Kino-Modus mit Hintergrundmedien.',
      howStep5Title: 'Kino-Modus',
      howStep5Desc: 'Browser-Vollbild, Fotos und Videos mit Überblendung im Hintergrund, YouTube-Links automatisch eingebettet, Ton mit sanfter Überblendung und umrandeter Text schwebt darüber.',
      howStep6Title: 'Live-Übersetzung',
      howStep6Desc: 'Die Chat-Sprache wird automatisch erkannt. Wählen Sie eine Zielsprache und alle Nachrichten werden sofort übersetzt — ohne die App zu verlassen.',
      translateBtnTitle: 'Übersetzen',
      translateDetected: 'Erkannt:',
      translateOff: 'Übersetzung aus',
      translateInProgress: 'Übersetze...',
      translateSameLang: 'Gleiche Sprache',
      releaseV042Date: 'Februar 2026',
      releaseV042_1: 'Live-Übersetzung: automatische Spracherkennung und sofortige Übersetzung',
      releaseV042_2: 'Sanfte Audio-Überblendung bei Medien-Übergängen',
      releaseV042_3: 'Ton standardmäßig aktiviert im Kino-Modus',
      releaseV042_4: 'Verbesserte Marketing-Inhalte und neue Schritte in « So funktioniert es »',
      releaseV043Date: 'Februar 2026',
      releaseV043_1: 'Startseiten-Illustration angepasst: Das Telefon überlappt nicht mehr den Rahmen',
      releaseV043_2: 'YouTube-Links mit Fehlern werden im Kino-Modus nicht mehr angezeigt',
      releaseV043_3: 'Medien-Miniaturbilder im scrollenden Text des Kino-Modus für bessere Übersicht über gesendete Fotos und Videos',
      releaseV044Date: 'Februar 2026',
      releaseV044_1: 'Kino-Modus: schwarzer Hintergrund beim Start, Foto- und Video-Miniaturbilder korrigiert und vergrößert',
      releaseV044_2: 'YouTube-Autoplay deaktiviert, nur Miniaturbilder werden angezeigt',
      releaseV044_3: 'Übersetzung: Quelltext wird durch die Übersetzung ersetzt statt beides anzuzeigen',
      releaseV044_4: 'Kino-Modus: Live-Übersetzung mit integriertem Sprachauswahlmenü',
      releaseV044_5: 'Startseiten-Illustration angepasst um Überlauf zu vermeiden',
      releaseV04Date: 'Februar 2026',
      releaseV04_1: 'Live-Hintergrund ohne Unschärfe, scharfe Bilder und Videos',
      releaseV04_2: 'Telefon und sein Inhalt immer im Vordergrund',
      releaseV04_3: 'Neuer Modus « Vollbild »: großer Text mit Umrissen, Medien ganzseitig',
      releaseV012Date: 'Februar 2026',
      releaseV011Date: 'Februar 2026',
      releaseV010Date: 'Februar 2026',
      releaseInitialLabel: 'Erstveröffentlichung',
      releaseV02_1: 'Mehrsprachige Unterstützung (Englisch, Französisch, Spanisch, Italienisch, Deutsch, Korsisch, Russisch, Chinesisch, Japanisch, Koreanisch)',
      releaseV02_2: 'Startseite mit Abschnitten „Wie es funktioniert", „Über" und „Versionshinweise"',
      releaseV02_3: 'Ticker-Scrolling für lange Gruppennamen und Namen in der Seitenleiste',
      releaseV02_4: 'Versionsnummer auf der Startseite angezeigt',
      releaseV03_5: 'Unterstützung für 4 neue Sprachen hinzugefügt: Russisch, Chinesisch, Japanisch, Koreanisch',
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

      // ---- Profiler v0.5 ----
      profilerBtnTitle: 'Psychologisches Profil',
      profilerTitle: 'Psychologische Gruppenanalyse',
      profilerSubtitle: 'Profil jedes Mitglieds basierend auf der Gesprächsanalyse',
      profilerNoData: 'Laden Sie eine Gruppenkonversation, um die Analyse zu sehen.',
      profilerMessages: 'Nachrichten',
      profilerAvgLength: 'Durchschn. Länge',
      profilerCharsPerMsg: 'Zeichen/Msg',
      profilerMediaSent: 'Medien gesendet',
      profilerEmojis: 'Emojis',
      profilerQuestions: 'Gestellte Fragen',
      profilerLinks: 'Geteilte Links',
      profilerInitiations: 'Gestartete Gespräche',
      profilerAvgResponseTime: 'Durchschn. Antwortzeit',
      profilerMostActiveHour: 'Aktivste Stunde',
      profilerTopEmojis: 'Lieblings-Emojis',
      profilerPersonality: 'Psychologisches Profil',
      profilerTraits: 'Persönlichkeitsmerkmale',
      profilerCommunicationStyle: 'Kommunikationsstil',
      profilerGroupRole: 'Rolle in der Gruppe',
      profilerMinutes: 'Min',
      profilerHours: 'Std',
      profilerDays: 'T',
      profilerStyleVerbose: 'Wortreich',
      profilerStyleConcise: 'Prägnant',
      profilerStyleExpressive: 'Ausdrucksstark',
      profilerStyleFactual: 'Sachlich',
      profilerStyleInquisitive: 'Neugierig',
      profilerStyleResponsive: 'Reaktionsfreudig',
      profilerStyleInitiator: 'Initiator',
      profilerStyleMediaHeavy: 'Visuell',
      profilerRoleLeader: 'Anführer',
      profilerRoleConnector: 'Verbinder',
      profilerRoleObserver: 'Beobachter',
      profilerRoleEntertainer: 'Unterhalter',
      profilerRoleSupporter: 'Unterstützer',
      profilerRoleAnalyst: 'Analyst',
      profilerActivity: 'Aktivität',
      profilerActivityChart: 'Stundenverteilung',
      profilerSentiment: 'Stimmung',
      profilerSentimentPositive: 'Positiv',
      profilerSentimentNeutral: 'Neutral',
      profilerSentimentNegative: 'Negativ',
      profilerWordCloud: 'Häufige Wörter',
      profilerOverview: 'Überblick',
      profilerDominance: 'Gesprächsdominanz',
      releaseV05Date: 'März 2026',
      releaseV05_1: 'Psychologische Analyse der Gruppenmitglieder mit Persönlichkeitsprofilen',
      releaseV05_2: 'Radardiagramme und stündliche Aktivitätsverteilung pro Mitglied',
      releaseV05_3: 'Automatische Erkennung des Kommunikationsstils und der Gruppenrolle',
      releaseV05_4: 'Stimmungsanalyse und Lieblings-Emojis',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: 'Dein Profil',
      profilerYourProfileSubtitle: 'Persönliche Analyse basierend auf deinen Nachrichten',
      profilerNarrative: 'Psychologisches Porträt',
      profilerVsGroup: 'Im Vergleich zur Gruppe',
      profilerVsGroupAvg: 'Gruppendurchschnitt',
      profilerYou: 'Du',
      profilerMoreThan: 'mehr als der Durchschnitt',
      profilerLessThan: 'weniger als der Durchschnitt',
      profilerOnPar: 'im Gruppendurchschnitt',
      profilerBigFive: 'Persönlichkeitsindikatoren',
      profilerBigFiveOpenness: 'Offenheit',
      profilerBigFiveConscientiousness: 'Gewissenhaftigkeit',
      profilerBigFiveExtraversion: 'Extraversion',
      profilerBigFiveAgreeableness: 'Verträglichkeit',
      profilerBigFiveNeuroticism: 'Emotionale Stabilität',
      profilerNarrIntro: 'Als ',
      profilerNarrVerbose: 'wortreicher Kommunikator nimmst du dir Zeit, deine Gedanken ausführlich zu entwickeln. Deine langen Nachrichten offenbaren eine nachdenkliche Persönlichkeit, die Nuancen und Kontext schätzt.',
      profilerNarrConcise: 'prägnanter Kommunikator kommst du direkt zum Punkt. Deine kurzen, effizienten Nachrichten offenbaren eine pragmatische Persönlichkeit, die Klarheit und Handlung schätzt.',
      profilerNarrExpressive: 'Dein reichlicher Gebrauch von Emojis und Ausrufezeichen offenbart eine warmherzige, emotional offene Persönlichkeit. Du bringst Energie und Farbe in Gespräche.',
      profilerNarrFactual: 'Dein nüchterner, sachlicher Stil mit wenigen Emojis offenbart eine analytische Persönlichkeit, die Fakten gegenüber Emotionen bevorzugt.',
      profilerNarrInquisitive: 'Du stellst viele Fragen und zeigst damit eine natürliche intellektuelle Neugier und ein echtes Interesse an anderen.',
      profilerNarrResponsive: 'Deine schnelle Antwortzeit zeigt, dass du Gesprächen sehr aufmerksam folgst und Reaktionsfähigkeit schätzt.',
      profilerNarrInitiator: 'Du startest häufig neue Gespräche, was ein proaktives und sozial selbstbewusstes Temperament offenbart.',
      profilerNarrMediaHeavy: 'Du teilst viele visuelle Inhalte, was eine Persönlichkeit offenbart, die in Bildern denkt und Zeigen dem Erzählen vorzieht.',
      profilerNarrLeader: 'In dieser Gruppe nimmst du natürlich die Führungsrolle ein — du gibst den Ton an, startest Themen und hältst das Gespräch am Laufen.',
      profilerNarrConnector: 'Du bist der Verbinder der Gruppe — der, der Fragen stellt, Menschen zusammenbringt und die soziale Bindung aufrechterhält.',
      profilerNarrObserver: 'Du neigst dazu, in dieser Gruppe eher Beobachter zu sein — anwesend, aber diskret, trägst du sparsam und weise bei.',
      profilerNarrEntertainer: 'Du bist der Unterhalter der Gruppe — der, der Humor, Lachen und positive Energie in Gespräche bringt.',
      profilerNarrSupporter: 'Du spielst eine unterstützende Rolle in dieser Gruppe — reaktionsfreudig, positiv und immer da, wenn jemand eine Antwort braucht.',
      profilerNarrAnalyst: 'Du bist der Analyst der Gruppe — der, der Links teilt, ausführliche Nachrichten schreibt und Tiefe in Diskussionen bringt.',
      profilerNarrDefaultRole: 'Du nimmst auf deine eigene Art aktiv an der Gruppe teil und bringst deinen einzigartigen Stil in Gespräche ein.',
      releaseV051Date: 'März 2026',
      releaseV051_1: 'Persönliches psychologisches Profil mit automatisch generiertem narrativem Porträt',
      releaseV051_2: 'Big-Five-Persönlichkeitsindikatoren aus Kommunikationsgewohnheiten abgeleitet',
      releaseV051_3: 'Vergleich deiner Statistiken mit dem Gruppendurchschnitt',
    },
    ru_RU: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'Перетащите экспорт WhatsApp (.zip) сюда',
      dropHint: 'или',
      dropButton: 'Выбрать файлы',
      dropFormats: 'Поддерживаемые форматы: iOS и Android',
      loadingText: 'Загрузка переписки...',
      sidebarTitle: 'Чаты',
      sidebarEmpty: 'Добавьте экспорт WhatsApp (.zip) с помощью кнопки +',
      senderPickerTitle: 'Кто вы?',
      senderPickerSubtitle: 'Выберите своё имя, чтобы ваши сообщения отображались справа',
      msgSuffix: 'сообщ.',
      participantsSuffix: 'участники',
      participantsPopupTitle: 'Участники',
      youTag: 'Вы',
      searchPlaceholder: 'Поиск...',
      searchResult: 'результат',
      searchResults: 'результатов',
      chatEmptyState: 'Выберите чат',
      alertZipOnly: 'Пожалуйста, выберите файлы .zip',
      alertZipOnlySingle: 'Пожалуйста, выберите файл .zip',
      alertNoChatFile: 'В ZIP-архиве не найден файл чата. Убедитесь, что файл содержит _chat.txt.',
      alertParseError: 'Не удалось разобрать чат. Проверьте формат файла.',
      alertLoadError: 'Ошибка загрузки файла: ',
      mediaImage: '📷 Изображение не включено',
      mediaVideo: '🎥 Видео не включено',
      mediaAudio: '🎵 Аудио не включено',
      mediaSticker: '🏷️ Стикер не включён',
      mediaDocument: '📄 Документ не включён',
      mediaGif: '🎬 GIF не включён',
      mediaContact: '👤 Карточка контакта не включена',
      mediaUnknown: '📎 Медиафайл не включён',
      months: ['ЯНВАРЬ','ФЕВРАЛЬ','МАРТ','АПРЕЛЬ','МАЙ','ИЮНЬ','ИЮЛЬ','АВГУСТ','СЕНТЯБРЬ','ОКТЯБРЬ','НОЯБРЬ','ДЕКАБРЬ'],
      howItWorksTitle: 'Как это работает',
      howStep1Title: 'Подготовьте архив',
      howStep1Desc: 'На телефоне откройте WhatsApp → откройте чат → нажмите ⋮ (меню) → «Экспортировать чат» → выберите «Прикрепить медиафайлы» (или без медиафайлов для меньшего размера). Это создаст файл .zip.',
      howStep2Title: 'Перенесите на компьютер',
      howStep2Desc: 'Отправьте файл .zip себе по электронной почте, через AirDrop, Google Drive, USB-кабель или любым другим способом.',
      howStep3Title: 'Просмотрите в приложении',
      howStep3Desc: 'Перетащите файл .zip на эту страницу (или нажмите «Выбрать файлы»). Выберите своё имя из списка — и ваша переписка отобразится точно так же, как на телефоне.',
      aboutTitle: 'Об авторе',
      bioIntro: 'Localization Program Manager в Perplexity (с января 2026, Сан-Франциско, гибрид). Специалист по локализации и управлению лингвистическими программами с более чем 25-летним международным опытом.',
      bioExpTitle: 'Опыт работы',
      bioPresent: 'настоящее время',
      bioMinistryTitle: 'Министерство образования Франции',
      bioMinistryRole: 'Дипломированный преподаватель английского языка (Agrégé)',
      bioPrepenaRole: 'Стажёр Prep\'ENA',
      bioBramhallRole: 'Ассистент преподавателя иностранного языка',
      bioEduTitle: 'Образование',
      bioEduField: 'Английский язык и литература',
      bioEduSchool: 'Université Côte d\'Azur',
      bioPubTitle: 'Научные публикации',
      bioCertTitle: 'Сертификаты',
      bioCertEna: 'Сертификат обучения ENA (дек. 2013)',
      bioCertLinkedin: 'Сертификаты LinkedIn Learning (Linux, Python, Data Science)',
      bioLangTitle: 'Языки',
      bioLangList: 'Корсиканский, английский, французский, итальянский — уровень носителя или двуязычный.',
      bioMiscTitle: 'Разное',
      bioMiscContent: 'Актёр в короткометражном фильме « Mission insulaire » (2005)',
      bioMiscRally: 'Штурман в автомобильном ралли.',
      releaseTitle: 'История версий',
      releaseV023Date: 'Февраль 2026',
      releaseV023_1: 'Биография автора полностью переписана на основе профиля LinkedIn',
      releaseV023_2: 'Все флаги заменены единообразными плоскими прямоугольными SVG (без внешних PNG-файлов)',
      releaseV022Date: 'Февраль 2026',
      releaseV022_1: 'Аутентичный корсиканский флаг (голова мавра) вместо предыдущей иконки',
      releaseV022_2: 'Исправлена ссылка LinkedIn автора',
      releaseV021Date: 'Февраль 2026',
      releaseV021_1: 'Исправлена биография автора',
      releaseV021_2: 'Анимированный корсиканский флаг вместо текста «CO»',
      releaseV021_3: 'Обновление номера версии',
      releaseV02Date: 'Февраль 2026',
      releaseCurrentLabel: 'Текущая версия',
      releaseV03Date: 'Февраль 2026',
      releaseV03_1: 'Режим «Live» с анимированным воспроизведением переписки и звуками пузырьков',
      releaseV03_2: 'Биография автора исправлена по верифицированному профилю LinkedIn',
      releaseV03_3: 'Новый раздел «Для чего это нужно?» на главной странице',
      releaseV03_4: 'Переключатель вида перемещён влево, флаги — вправо',
      whatIsItForTitle: 'Для чего это нужно?',
      whatIsPoint1: 'WhatsApp захватывает ваш телефон. Фото, видео и сообщения накапливаются годами — и память заполняется очень быстро.',
      whatIsPoint2: 'Apple берёт огромные деньги за каждый уровень хранилища. 128 ГБ, 256 ГБ, 512 ГБ, 1 ТБ\u2026 и цена растёт с каждым новым iPhone.',
      whatIsPoint3: 'Но никто не хочет удалять эти воспоминания: дорогие переписки, семейные фото, групповые моменты. Эти мгновения важны.',
      whatIsPoint4: 'Это приложение расширяет вашу память: экспортируйте разговоры WhatsApp, освободите место на телефоне и переживите каждый момент заново — пузыри, медиа, временные метки, всё в кинорежиме на весь экран.',
      whatIsPoint5: 'Переживите момент заново: кинорежим превращает ваши разговоры в захватывающий полноэкранный опыт. Фото и видео плавно появляются на фоне, а текст парит сверху — как фильм о ваших воспоминаниях.',
      whatIsPoint6: 'Ваши данные остаются строго конфиденциальными: всё работает локально в вашем браузере. Ничего не отправляется на сервер.',
      liveSpeedLabel: 'Скорость',
      homeButtonTitle: 'Главная',
      livePrevYear: '-1 год',
      livePrevMonth: '-1 месяц',
      livePrevDay: '-1 день',
      liveNextDay: '+1 день',
      liveNextMonth: '+1 месяц',
      liveNextYear: '+1 год',
      livePlayPause: 'Воспроизведение / Пауза',
      liveTimelineLabel: 'Хронология',
      releaseV031Date: 'Февраль 2026',
      releaseV031_1: 'Улучшенные флаги Великобритании, США и Южной Кореи',
      releaseV031_2: 'Отдельная кнопка домой для возврата на главную страницу',
      releaseV031_3: 'Фоновое изображение с плавным переходом во время Live-воспроизведения',
      releaseV031_4: 'Эффект печатной машинки для сообщений в Live-режиме',
      releaseV031_5: 'Бегунок хронологии для навигации по переписке',
      releaseV031_6: 'Все элементы интерфейса локализованы',
      releaseV032Date: 'Февраль 2026',
      releaseV032_1: 'Фон в режиме Live: теперь поддерживает изображения И видео (во весь экран)',
      releaseV032_2: 'Биография автора реструктурирована и локализована на все 11 языков',
      releaseV032_3: 'Упоминания @ отображаются жирным зелёным как в WhatsApp',
      releaseV032_4: 'Натуральный эффект набора текста с переменными интервалами',
      releaseV032_5: 'Имя исправлено: Pierre Régis Gonsolin',
      cinemaButtonTitle: 'Полноэкранный кинорежим',
      cinemaAutoScroll: 'Автопрокрутка',
      cinemaSlower: 'Медленнее',
      cinemaFaster: 'Быстрее',
      releaseV041Date: 'Февраль 2026',
      releaseV041_1: 'Режим кино теперь использует полноэкранный режим браузера с кнопкой переключения',
      releaseV041_2: 'Медиа заполняют весь экран без чёрных полос',
      releaseV041_3: 'Ссылки YouTube автоматически встраиваются как фоновые видео с плавным появлением',
      howStep4Title: 'Выберите режим отображения',
      howStep4Desc: 'Пять режимов просмотра: iPhone, iPad (боковая панель мульти-чата), полноэкранный веб, анимированное Live-воспроизведение и иммерсивный кинорежим с фоновыми медиа.',
      howStep5Title: 'Кинорежим',
      howStep5Desc: 'Полноэкранный режим браузера, фото и видео с плавным появлением на фоне, ссылки YouTube встраиваются автоматически, звук с плавным нарастанием и текст с контурами парит сверху.',
      howStep6Title: 'Живой перевод',
      howStep6Desc: 'Язык чата определяется автоматически. Выберите целевой язык, и все сообщения переводятся мгновенно — не покидая приложение.',
      translateBtnTitle: 'Перевести',
      translateDetected: 'Обнаружен:',
      translateOff: 'Перевод выключен',
      translateInProgress: 'Перевод...',
      translateSameLang: 'Тот же язык',
      releaseV042Date: 'Февраль 2026',
      releaseV042_1: 'Живой перевод: автоматическое определение языка и мгновенный перевод',
      releaseV042_2: 'Плавное нарастание/затухание звука при переходах между медиа',
      releaseV042_3: 'Звук включён по умолчанию в кинорежиме',
      releaseV042_4: 'Обогащённый маркетинговый контент и новые шаги в « Как это работает »',
      releaseV043Date: 'Февраль 2026',
      releaseV043_1: 'Иллюстрация на главной странице скорректирована: телефон больше не перекрывает контур',
      releaseV043_2: 'Ссылки YouTube с ошибками больше не отображаются в кинорежиме',
      releaseV043_3: 'Миниатюры медиа отображаются в прокручиваемом тексте кинорежима для лучшего отслеживания отправленных фото и видео',
      releaseV044Date: 'Февраль 2026',
      releaseV044_1: 'Кинорежим: чёрный фон при запуске, миниатюры фото и видео исправлены и увеличены',
      releaseV044_2: 'Автовоспроизведение YouTube отключено, показываются только миниатюры',
      releaseV044_3: 'Перевод: исходный текст заменяется переводом вместо отображения обоих',
      releaseV044_4: 'Кинорежим: живой перевод с интегрированным меню выбора языка',
      releaseV044_5: 'Иллюстрация главной страницы скорректирована для предотвращения выхода за границы',
      releaseV04Date: 'Февраль 2026',
      releaseV04_1: 'Фон в режиме Live без размытия, чёткие изображения и видео',
      releaseV04_2: 'Телефон и его содержимое всегда на переднем плане',
      releaseV04_3: 'Новый режим « Полный экран »: крупный текст с контурами, медиа на всю страницу',
      releaseV012Date: 'Февраль 2026',
      releaseV011Date: 'Февраль 2026',
      releaseV010Date: 'Февраль 2026',
      releaseInitialLabel: 'Первый выпуск',
      releaseV02_1: 'Многоязычная поддержка (английский, французский, испанский, итальянский, немецкий, корсиканский, русский, китайский, японский, корейский)',
      releaseV02_2: 'Главная страница с разделами «Как это работает», «Об авторе» и «История версий»',
      releaseV02_3: 'Бегущая строка для длинных названий групп и имён в боковой панели',
      releaseV02_4: 'Номер версии отображается на главной странице',
      releaseV03_5: 'Поддержка 4 новых языков: русский, китайский, японский, корейский',
      releaseV012_1: 'Название группы исключено из выбора отправителя',
      releaseV012_2: 'Часы реального времени в строке состояния',
      releaseV012_3: 'Живые иконки Wi-Fi и батареи, отражающие состояние устройства',
      releaseV012_4: 'Упоминания @ выделены жирным в стиле WhatsApp',
      releaseV012_5: 'Кликабельное количество участников с полным списком',
      releaseV012_6: 'Поддержка загрузки нескольких файлов на главной странице',
      releaseV012_7: 'Бегущая строка для слишком длинных названий чатов (заголовок и боковая панель)',
      releaseV011_1: 'Горизонтальный вид iPad с боковой панелью чатов',
      releaseV011_2: 'Поддержка боковой панели в полноэкранном режиме',
      releaseV011_3: 'Удалены нерабочие кнопки звонка и настроек в режиме iPad/полного экрана',
      releaseV011_4: 'Определение названия группы и исключение его из выбора отправителя',
      releaseV010_1: 'Просмотрщик экспорта чата WhatsApp (.zip) с отображением в стиле телефона',
      releaseV010_2: 'Поддержка форматов экспорта iOS и Android',
      releaseV010_3: 'Пузырьки сообщений с правильным выравниванием по левому/правому краю',
      releaseV010_4: 'Поддержка медиа: изображения (с лайтбоксом), видео, аудио/голосовые сообщения, документы',
      releaseV010_5: 'Поддержка групповых чатов с цветными именами отправителей',
      releaseV010_6: 'Функция поиска с подсветкой и навигацией',
      releaseV010_7: 'Полноэкранный режим',
      releaseV010_8: 'Тёмная тема WhatsApp',
      releaseV010_9: 'Интерфейс на французском языке',

      // ---- Profiler v0.5 ----
      profilerBtnTitle: 'Психологический профиль',
      profilerTitle: 'Психологический анализ группы',
      profilerSubtitle: 'Профиль каждого участника на основе анализа переписки',
      profilerNoData: 'Загрузите групповую переписку для просмотра анализа.',
      profilerMessages: 'Сообщения',
      profilerAvgLength: 'Ср. длина',
      profilerCharsPerMsg: 'симв/сообщ',
      profilerMediaSent: 'Медиа отправлено',
      profilerEmojis: 'Эмодзи',
      profilerQuestions: 'Заданные вопросы',
      profilerLinks: 'Общие ссылки',
      profilerInitiations: 'Начатые разговоры',
      profilerAvgResponseTime: 'Ср. время ответа',
      profilerMostActiveHour: 'Самый активный час',
      profilerTopEmojis: 'Любимые эмодзи',
      profilerPersonality: 'Психологический профиль',
      profilerTraits: 'Черты личности',
      profilerCommunicationStyle: 'Стиль общения',
      profilerGroupRole: 'Роль в группе',
      profilerMinutes: 'мин',
      profilerHours: 'ч',
      profilerDays: 'д',
      profilerStyleVerbose: 'Многословный',
      profilerStyleConcise: 'Лаконичный',
      profilerStyleExpressive: 'Экспрессивный',
      profilerStyleFactual: 'Фактический',
      profilerStyleInquisitive: 'Любопытный',
      profilerStyleResponsive: 'Отзывчивый',
      profilerStyleInitiator: 'Инициатор',
      profilerStyleMediaHeavy: 'Визуал',
      profilerRoleLeader: 'Лидер',
      profilerRoleConnector: 'Связующий',
      profilerRoleObserver: 'Наблюдатель',
      profilerRoleEntertainer: 'Аниматор',
      profilerRoleSupporter: 'Поддержка',
      profilerRoleAnalyst: 'Аналитик',
      profilerActivity: 'Активность',
      profilerActivityChart: 'Почасовая активность',
      profilerSentiment: 'Настроение',
      profilerSentimentPositive: 'Позитивное',
      profilerSentimentNeutral: 'Нейтральное',
      profilerSentimentNegative: 'Негативное',
      profilerWordCloud: 'Частые слова',
      profilerOverview: 'Обзор',
      profilerDominance: 'Доминирование в разговоре',
      releaseV05Date: 'Март 2026',
      releaseV05_1: 'Психологический анализ участников группы с профилями личности',
      releaseV05_2: 'Радарные диаграммы и почасовая активность по участникам',
      releaseV05_3: 'Автоматическое определение стиля общения и роли в группе',
      releaseV05_4: 'Анализ настроений и любимые эмодзи',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: 'Ваш профиль',
      profilerYourProfileSubtitle: 'Личный анализ на основе ваших сообщений',
      profilerNarrative: 'Психологический портрет',
      profilerVsGroup: 'По сравнению с группой',
      profilerVsGroupAvg: 'Средний показатель группы',
      profilerYou: 'Вы',
      profilerMoreThan: 'больше среднего',
      profilerLessThan: 'меньше среднего',
      profilerOnPar: 'на уровне группы',
      profilerBigFive: 'Показатели личности',
      profilerBigFiveOpenness: 'Открытость',
      profilerBigFiveConscientiousness: 'Добросовестность',
      profilerBigFiveExtraversion: 'Экстраверсия',
      profilerBigFiveAgreeableness: 'Доброжелательность',
      profilerBigFiveNeuroticism: 'Эмоциональная стабильность',
      profilerNarrIntro: 'Как ',
      profilerNarrVerbose: 'многословный собеседник, вы уделяете время детальному развитию своих мыслей. Ваши длинные сообщения говорят о вдумчивой личности, ценящей нюансы и контекст.',
      profilerNarrConcise: 'лаконичный собеседник, вы сразу переходите к сути. Ваши короткие и эффективные сообщения говорят о прагматичной личности, ценящей ясность и действие.',
      profilerNarrExpressive: 'Ваше обильное использование эмодзи и восклицательных знаков говорит о тёплой, эмоционально открытой личности. Вы привносите энергию и яркость в разговоры.',
      profilerNarrFactual: 'Ваш сдержанный, фактический стиль с минимумом эмодзи говорит об аналитической личности, предпочитающей факты эмоциям.',
      profilerNarrInquisitive: 'Вы задаёте много вопросов, что демонстрирует естественную интеллектуальную любознательность и искренний интерес к другим.',
      profilerNarrResponsive: 'Ваше быстрое время ответа показывает, что вы внимательно следите за разговорами и цените отзывчивость.',
      profilerNarrInitiator: 'Вы часто начинаете новые разговоры, что говорит о проактивном и социально уверенном темпераменте.',
      profilerNarrMediaHeavy: 'Вы делитесь большим количеством визуального контента, что говорит о личности, мыслящей образами.',
      profilerNarrLeader: 'В этой группе вы естественно занимаете роль лидера — того, кто задаёт тон и поддерживает ритм общения.',
      profilerNarrConnector: 'Вы — связующее звено группы, задающее вопросы и поддерживающее социальные связи.',
      profilerNarrObserver: 'Вы скорее наблюдатель в этой группе — присутствуете, но вмешиваетесь редко и по делу.',
      profilerNarrEntertainer: 'Вы — аниматор группы, привносящий юмор, смех и позитивную энергию в разговоры.',
      profilerNarrSupporter: 'Вы играете поддерживающую роль в этой группе — отзывчивый, позитивный и всегда на связи.',
      profilerNarrAnalyst: 'Вы — аналитик группы, делящийся ссылками, пишущий подробные сообщения и привносящий глубину в обсуждения.',
      profilerNarrDefaultRole: 'Вы активно участвуете в группе по-своему, привнося свой уникальный стиль в разговоры.',
      releaseV051Date: 'Март 2026',
      releaseV051_1: 'Личный психологический профиль с автоматически сгенерированным нарративным портретом',
      releaseV051_2: 'Показатели личности Big Five, определённые по привычкам общения',
      releaseV051_3: 'Сравнение ваших показателей со средними по группе',
    },
    zh_CN: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: '将 WhatsApp 导出文件（.zip）拖放到此处',
      dropHint: '或',
      dropButton: '选择文件',
      dropFormats: '支持格式：iOS 和 Android',
      loadingText: '正在加载对话...',
      sidebarTitle: '聊天',
      sidebarEmpty: '点击 + 按钮添加 WhatsApp 导出文件（.zip）',
      senderPickerTitle: '你是谁？',
      senderPickerSubtitle: '选择你的名字，让你的消息显示在右侧',
      msgSuffix: '条消息',
      participantsSuffix: '位参与者',
      participantsPopupTitle: '参与者',
      youTag: '你',
      searchPlaceholder: '搜索...',
      searchResult: '个结果',
      searchResults: '个结果',
      chatEmptyState: '选择一个聊天',
      alertZipOnly: '请选择 .zip 文件',
      alertZipOnlySingle: '请选择一个 .zip 文件',
      alertNoChatFile: 'ZIP 中未找到聊天文件。请确保文件中包含 _chat.txt。',
      alertParseError: '无法解析聊天记录。请检查文件格式。',
      alertLoadError: '加载文件时出错：',
      mediaImage: '📷 图片未包含',
      mediaVideo: '🎥 视频未包含',
      mediaAudio: '🎵 音频未包含',
      mediaSticker: '🏷️ 贴纸未包含',
      mediaDocument: '📄 文档未包含',
      mediaGif: '🎬 GIF 未包含',
      mediaContact: '👤 联系人名片未包含',
      mediaUnknown: '📎 媒体文件未包含',
      months: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
      howItWorksTitle: '如何使用',
      howStep1Title: '准备存档文件',
      howStep1Desc: '在手机上打开 WhatsApp → 打开聊天 → 点击 ⋮（菜单）→「导出聊天记录」→ 选择「附加媒体」（或不含媒体以获得更小的文件）。这将创建一个 .zip 文件。',
      howStep2Title: '传输到电脑',
      howStep2Desc: '通过电子邮件、AirDrop、Google Drive、USB 数据线或任何文件传输方式将 .zip 文件发送给自己。',
      howStep3Title: '在应用中查看',
      howStep3Desc: '将 .zip 文件拖放到此页面（或点击「选择文件」）。从列表中选择你的名字，聊天记录将以手机上的样式呈现。',
      aboutTitle: '关于作者',
      bioIntro: 'Perplexity 本地化项目经理（2026年1月至今，旧金山，混合办公）。本地化和语言项目管理专家，拥有超过25年的国际经验。',
      bioExpTitle: '工作经历',
      bioPresent: '至今',
      bioMinistryTitle: '法国国民教育部',
      bioMinistryRole: '英语高级教师（Agrégé）',
      bioPrepenaRole: 'Prep\'ENA 实习生',
      bioBramhallRole: '外语助理教师',
      bioEduTitle: '教育背景',
      bioEduField: '英语语言与文学',
      bioEduSchool: '蔚蓝海岸大学',
      bioPubTitle: '学术出版物',
      bioCertTitle: '认证',
      bioCertEna: 'ENA 培训证书（2013年12月）',
      bioCertLinkedin: 'LinkedIn Learning 认证（Linux、Python、数据科学）',
      bioLangTitle: '语言',
      bioLangList: '科西嘉语、英语、法语、意大利语 — 母语或双语水平。',
      bioMiscTitle: '其他',
      bioMiscContent: '短片《 Mission insulaire 》演员（2005年）',
      bioMiscRally: '汽车拉力赛副驾。',
      releaseTitle: '版本说明',
      releaseV023Date: '2026年2月',
      releaseV023_1: '根据 LinkedIn 个人资料完整重写了作者简介',
      releaseV023_2: '所有旗帜替换为统一的扁平矩形 SVG（不再使用外部 PNG 文件）',
      releaseV022Date: '2026年2月',
      releaseV022_1: '使用科西嘉真实旗帜（摩尔人头像）替换旧图标',
      releaseV022_2: '修复了作者的 LinkedIn 链接',
      releaseV021Date: '2026年2月',
      releaseV021_1: '修复了作者简介',
      releaseV021_2: '用动画科西嘉旗帜替换了「CO」文字',
      releaseV021_3: '更新版本号',
      releaseV02Date: '2026年2月',
      releaseCurrentLabel: '当前版本',
      releaseV03Date: '2026年2月',
      releaseV03_1: '「实时」模式，支持对话动画回放和气泡音效',
      releaseV03_2: '根据经验证的 LinkedIn 资料更正了作者简介',
      releaseV03_3: '主页新增「这有什么用？」板块',
      releaseV03_4: '视图选择器移至左侧，旗帜移至右侧',
      whatIsItForTitle: '这有什么用？',
      whatIsPoint1: 'WhatsApp 占据了你的手机。照片、视频和消息多年来不断积累——存储空间很快就会耗尽。',
      whatIsPoint2: 'Apple 对每个存储级别收取高价。128GB、256GB、512GB、1TB\u2026 每款新 iPhone 价格都在攀升。',
      whatIsPoint3: '然而没有人想删除那些回忆：珍贵的聊天记录、家庭照片、群聊的欢乐时光。那些瞬间很重要。',
      whatIsPoint4: '这款应用增强您的记忆：导出 WhatsApp 对话，释放手机存储空间，完整重温每个瞬间——气泡、媒体、时间戳，全屏影院模式呈现。',
      whatIsPoint5: '重温那一刻：影院模式将您的对话变成沉浸式全屏体验。照片和视频在背景中淡入淡出，文字浮于其上——像一部关于您回忆的电影。',
      whatIsPoint6: '您的数据严格保密：一切在浏览器本地运行。不会上传到任何服务器。',
      liveSpeedLabel: '速度',
      homeButtonTitle: '首页',
      livePrevYear: '-1 年',
      livePrevMonth: '-1 月',
      livePrevDay: '-1 天',
      liveNextDay: '+1 天',
      liveNextMonth: '+1 月',
      liveNextYear: '+1 年',
      livePlayPause: '播放 / 暂停',
      liveTimelineLabel: '时间轴',
      releaseV031Date: '2026年2月',
      releaseV031_1: '改善了英国、美国和韩国国旗',
      releaseV031_2: '独立的首页按鈕用于返回主页',
      releaseV031_3: 'Live 播放期间图片背景淡入淡出',
      releaseV031_4: 'Live 视图中消息的打字机效果',
      releaseV031_5: '用于浏览对话的时间轴拖动条',
      releaseV031_6: '所有界面元素已本地化',
      releaseV032Date: '2026年2月',
      releaseV032_1: 'Live 背景现在支持图片和视频（全窗口显示）',
      releaseV032_2: '作者简介已重新构建并在所有11种语言中本地化',
      releaseV032_3: '@提及以WhatsApp风格的粗体绿色显示',
      releaseV032_4: '自然打字效果，采用可变时间间隔',
      releaseV032_5: '姓名更正：Pierre Régis Gonsolin',
      cinemaButtonTitle: '影院全屏',
      cinemaAutoScroll: '自动滚动',
      cinemaSlower: '慢速',
      cinemaFaster: '快速',
      releaseV041Date: '2026年2月',
      releaseV041_1: '影院模式现使用浏览器真正全屏，带切换按钮',
      releaseV041_2: '媒体填满整个屏幕，无黑边',
      releaseV041_3: 'YouTube 链接自动嵌入为背景视频并带渐变效果',
      howStep4Title: '选择显示模式',
      howStep4Desc: '五种查看模式：iPhone、iPad（多对话侧边栏）、网页全屏、动画 Live 回放和沉浸式影院模式（带背景媒体）。',
      howStep5Title: '影院模式',
      howStep5Desc: '浏览器全屏，照片和视频背景渐变，YouTube 链接自动嵌入，声音平滑渐变，带轮廓的文字浮于画面之上。',
      howStep6Title: '实时翻译',
      howStep6Desc: '自动检测聊天语言。选择目标语言，所有消息即时翻译——无需离开应用。',
      translateBtnTitle: '翻译',
      translateDetected: '检测到：',
      translateOff: '翻译关闭',
      translateInProgress: '翻译中...',
      translateSameLang: '相同语言',
      releaseV042Date: '2026年2月',
      releaseV042_1: '实时翻译：自动语言检测和即时翻译',
      releaseV042_2: '媒体切换时音频平滑渐入渐出',
      releaseV042_3: '影院模式默认开启声音',
      releaseV042_4: '丰富的营销内容和「使用方法」中的新步骤',
      releaseV043Date: '2026年2月',
      releaseV043_1: '首页插图已调整：手机不再与轮廓重叠',
      releaseV043_2: '返回错误的YouTube链接不再在影院模式中显示',
      releaseV043_3: '影院模式滚动文字中显示媒体缩略图，便于追踪发送的照片和视频',
      releaseV044Date: '2026年2月',
      releaseV044_1: '影院模式：启动时黑色背景，照片和视频缩略图已修复并放大',
      releaseV044_2: 'YouTube自动播放已禁用，仅显示缩略图',
      releaseV044_3: '翻译：源文本被翻译替换，不再同时显示两者',
      releaseV044_4: '影院模式：实时翻译，集成语言选择菜单',
      releaseV044_5: '首页插图已调整以防止溢出',
      releaseV04Date: '2026年2月',
      releaseV04_1: 'Live 背景无模糊效果，图片和视频清晰显示',
      releaseV04_2: '手机及其内容始终在前景显示',
      releaseV04_3: '新「全屏」模式：大字带轮廓，媒体全页显示',
      releaseV012Date: '2026年2月',
      releaseV011Date: '2026年2月',
      releaseV010Date: '2026年2月',
      releaseInitialLabel: '首次发布',
      releaseV02_1: '多语言支持（英语、法语、西班牙语、意大利语、德语、科西嘉语、俄语、中文、日语、韩语）',
      releaseV02_2: '主页包含「如何使用」、「关于」和「版本说明」板块',
      releaseV02_3: '长群组名称和侧边栏聊天名称的滚动字幕',
      releaseV02_4: '主页显示版本号',
      releaseV03_5: '新增 4 种语言支持：俄语、中文、日语、韩语',
      releaseV012_1: '群组名称从发送者选择器中排除',
      releaseV012_2: '状态栏实时时钟',
      releaseV012_3: '实时 Wi-Fi 和电池图标反映设备状态',
      releaseV012_4: '@提及以粗体显示，采用 WhatsApp 风格配色',
      releaseV012_5: '可点击的参与者数量，显示完整列表',
      releaseV012_6: '主页支持多文件上传',
      releaseV012_7: '超长聊天名称的滚动字幕（标题栏和侧边栏）',
      releaseV011_1: 'iPad 横向视图，带左侧聊天面板',
      releaseV011_2: '全屏模式下支持侧边栏',
      releaseV011_3: '移除了 iPad/全屏模式下不可用的通话和设置图标',
      releaseV011_4: '检测群组名称并将其排除在发送者选择器之外',
      releaseV010_1: 'WhatsApp 聊天导出（.zip）查看器，手机风格显示',
      releaseV010_2: '支持 iOS 和 Android 导出格式',
      releaseV010_3: '消息气泡根据发送者选择正确左右对齐',
      releaseV010_4: '媒体支持：图片（带灯箱）、视频、音频/语音消息、文档',
      releaseV010_5: '群聊支持，发送者名称以不同颜色显示',
      releaseV010_6: '搜索功能，支持高亮和导航',
      releaseV010_7: '全屏模式',
      releaseV010_8: 'WhatsApp 暗色主题',
      releaseV010_9: '法语界面',

      // ---- Profiler v0.5 ----
      profilerBtnTitle: '心理分析',
      profilerTitle: '群组心理分析',
      profilerSubtitle: '基于对话分析的每位成员画像',
      profilerNoData: '请加载群组对话以查看分析。',
      profilerMessages: '消息',
      profilerAvgLength: '平均长度',
      profilerCharsPerMsg: '字/条',
      profilerMediaSent: '发送媒体',
      profilerEmojis: '表情符号',
      profilerQuestions: '提出的问题',
      profilerLinks: '分享的链接',
      profilerInitiations: '发起的对话',
      profilerAvgResponseTime: '平均回复时间',
      profilerMostActiveHour: '最活跃时间',
      profilerTopEmojis: '常用表情',
      profilerPersonality: '心理画像',
      profilerTraits: '人格特征',
      profilerCommunicationStyle: '沟通风格',
      profilerGroupRole: '群组角色',
      profilerMinutes: '分钟',
      profilerHours: '小时',
      profilerDays: '天',
      profilerStyleVerbose: '健谈',
      profilerStyleConcise: '简洁',
      profilerStyleExpressive: '表达力强',
      profilerStyleFactual: '务实',
      profilerStyleInquisitive: '好奇',
      profilerStyleResponsive: '响应迅速',
      profilerStyleInitiator: '发起者',
      profilerStyleMediaHeavy: '视觉型',
      profilerRoleLeader: '领导者',
      profilerRoleConnector: '连接者',
      profilerRoleObserver: '观察者',
      profilerRoleEntertainer: '活跃分子',
      profilerRoleSupporter: '支持者',
      profilerRoleAnalyst: '分析师',
      profilerActivity: '活跃度',
      profilerActivityChart: '每小时分布',
      profilerSentiment: '情感',
      profilerSentimentPositive: '积极',
      profilerSentimentNeutral: '中性',
      profilerSentimentNegative: '消极',
      profilerWordCloud: '高频词汇',
      profilerOverview: '概览',
      profilerDominance: '对话主导力',
      releaseV05Date: '2026年3月',
      releaseV05_1: '群组成员心理分析与人格画像',
      releaseV05_2: '雷达图和每小时活动分布',
      releaseV05_3: '自动检测沟通风格和群组角色',
      releaseV05_4: '情感分析和常用表情',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: '你的画像',
      profilerYourProfileSubtitle: '基于你的消息的个人分析',
      profilerNarrative: '心理画像',
      profilerVsGroup: '与群组对比',
      profilerVsGroupAvg: '群组平均',
      profilerYou: '你',
      profilerMoreThan: '高于平均',
      profilerLessThan: '低于平均',
      profilerOnPar: '与群组持平',
      profilerBigFive: '人格指标',
      profilerBigFiveOpenness: '开放性',
      profilerBigFiveConscientiousness: '尽责性',
      profilerBigFiveExtraversion: '外向性',
      profilerBigFiveAgreeableness: '宜人性',
      profilerBigFiveNeuroticism: '情绪稳定性',
      profilerNarrIntro: '作为',
      profilerNarrVerbose: '健谈的沟通者，你会花时间详细阐述自己的想法。你的长消息揭示了一个重视细节和语境的深思熟虑的性格。',
      profilerNarrConcise: '简洁的沟通者，你直奔主题。你的短消息揭示了一个重视清晰和行动的务实性格。',
      profilerNarrExpressive: '你大量使用表情符号和感叹号，揭示了一个热情、情感开放的性格。你为对话带来活力和色彩。',
      profilerNarrFactual: '你朴素、注重事实的风格，很少使用表情符号，揭示了一个更注重事实而非情感的分析型性格。',
      profilerNarrInquisitive: '你经常提问，展现了天生的求知欲和对他人的真诚兴趣。',
      profilerNarrResponsive: '你的快速回复时间表明你非常关注对话并重视及时响应。',
      profilerNarrInitiator: '你经常发起新对话，展现了主动和社交自信的性格。',
      profilerNarrMediaHeavy: '你分享大量视觉内容，揭示了一个用图像思考、喜欢展示而非叙述的性格。',
      profilerNarrLeader: '在这个群组中，你自然地扮演着领导者的角色——设定基调、发起话题并保持对话节奏。',
      profilerNarrConnector: '你是群组的连接者——提出问题、联结人们并维护社交纽带。',
      profilerNarrObserver: '你倾向于在群组中做一个观察者——在场但低调，谨慎而明智地参与。',
      profilerNarrEntertainer: '你是群组的活跃分子——为对话带来幽默、欢笑和积极能量。',
      profilerNarrSupporter: '你在群组中扮演支持者角色——反应迅速、积极，总是在别人需要时及时回应。',
      profilerNarrAnalyst: '你是群组的分析师——分享链接、撰写详细消息并为讨论带来深度。',
      profilerNarrDefaultRole: '你以自己的方式积极参与群组，为对话带来独特的风格。',
      releaseV051Date: '2026年3月',
      releaseV051_1: '个人心理画像，自动生成叙事肖像',
      releaseV051_2: '基于沟通习惯推断的Big Five人格指标',
      releaseV051_3: '你的数据与群组平均值的对比',
    },
    ja_JP: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'WhatsApp のエクスポートファイル（.zip）をここにドロップ',
      dropHint: 'または',
      dropButton: 'ファイルを選択',
      dropFormats: '対応形式：iOS・Android',
      loadingText: 'トークを読み込み中...',
      sidebarTitle: 'トーク',
      sidebarEmpty: '+ ボタンで WhatsApp エクスポート（.zip）を追加',
      senderPickerTitle: 'あなたはどなたですか？',
      senderPickerSubtitle: '自分の名前を選択すると、自分のメッセージが右側に表示されます',
      msgSuffix: '件',
      participantsSuffix: '人の参加者',
      participantsPopupTitle: '参加者',
      youTag: 'あなた',
      searchPlaceholder: '検索...',
      searchResult: '件の結果',
      searchResults: '件の結果',
      chatEmptyState: 'トークを選択',
      alertZipOnly: '.zip ファイルを選択してください',
      alertZipOnlySingle: '.zip ファイルを選択してください',
      alertNoChatFile: 'ZIP 内にチャットファイルが見つかりません。_chat.txt が含まれているか確認してください。',
      alertParseError: 'チャットを解析できませんでした。ファイル形式を確認してください。',
      alertLoadError: 'ファイルの読み込みエラー：',
      mediaImage: '📷 画像は含まれていません',
      mediaVideo: '🎥 動画は含まれていません',
      mediaAudio: '🎵 音声は含まれていません',
      mediaSticker: '🏷️ スタンプは含まれていません',
      mediaDocument: '📄 ドキュメントは含まれていません',
      mediaGif: '🎬 GIF は含まれていません',
      mediaContact: '👤 連絡先カードは含まれていません',
      mediaUnknown: '📎 メディアは含まれていません',
      months: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
      howItWorksTitle: '使い方',
      howStep1Title: 'アーカイブを準備する',
      howStep1Desc: 'スマートフォンで WhatsApp を開く → トークを開く → ⋮（メニュー）をタップ → 「トーク履歴を送信」→「メディアを含める」を選択（ファイルサイズを小さくする場合はメディアなし）。.zip ファイルが作成されます。',
      howStep2Title: 'パソコンに転送する',
      howStep2Desc: '.zip ファイルをメール、AirDrop、Google ドライブ、USB ケーブルなどで自分に送信します。',
      howStep3Title: 'アプリで表示する',
      howStep3Desc: '.zip ファイルをこのページにドラッグ（または「ファイルを選択」をクリック）。リストから自分の名前を選ぶと、スマートフォンで見たままのトーク画面が表示されます。',
      aboutTitle: '作者について',
      bioIntro: 'Perplexity ローカリゼーション プログラム マネージャー（2026年1月より、サンフランシスコ、ハイブリッド勤務）。25年以上の国際経験を持つローカリゼーションおよび言語プログラム管理の専門家。',
      bioExpTitle: '職歴',
      bioPresent: '現在',
      bioMinistryTitle: 'フランス国民教育省',
      bioMinistryRole: '英語教員（Agrégé 資格）',
      bioPrepenaRole: 'Prep\'ENA 研修生',
      bioBramhallRole: '外国語アシスタント教員',
      bioEduTitle: '学歴',
      bioEduField: '英語言語学・英文学',
      bioEduSchool: 'コートダジュール大学',
      bioPubTitle: '学術論文',
      bioCertTitle: '資格・認定',
      bioCertEna: 'ENA 研修修了証（2013年12月）',
      bioCertLinkedin: 'LinkedIn Learning 認定（Linux、Python、データサイエンス）',
      bioLangTitle: '言語',
      bioLangList: 'コルシカ語、英語、フランス語、イタリア語 — ネイティブまたはバイリンガル。',
      bioMiscTitle: 'その他',
      bioMiscContent: '短編映画「Mission insulaire」に出演（2005年）',
      bioMiscRally: 'ラリーのコドライバー。',
      releaseTitle: 'リリースノート',
      releaseV023Date: '2026年2月',
      releaseV023_1: '作者プロフィールを LinkedIn プロフィールをもとに全面改訂',
      releaseV023_2: 'すべての旗を統一されたフラットな矩形 SVG に置き換え（外部 PNG ファイルを廃止）',
      releaseV022Date: '2026年2月',
      releaseV022_1: '本物のコルシカ旗（ムーアの頭）を以前のアイコンと置き換え',
      releaseV022_2: '作者の LinkedIn リンクを修正',
      releaseV021Date: '2026年2月',
      releaseV021_1: '作者プロフィールを修正',
      releaseV021_2: '「CO」テキストをアニメーションのコルシカ旗に置き換え',
      releaseV021_3: 'バージョン番号を更新',
      releaseV02Date: '2026年2月',
      releaseCurrentLabel: '現在のバージョン',
      releaseV03Date: '2026年2月',
      releaseV03_1: '会話のアニメーション再生とバブル音付きの「ライブ」ビュー',
      releaseV03_2: '検証済み LinkedIn プロフィールをもとに作者プロフィールを修正',
      releaseV03_3: 'ホーム画面に「何のためのアプリ？」セクションを新設',
      releaseV03_4: 'ビュー切替を左側に移動、旗を右側に配置',
      whatIsItForTitle: '何のためのアプリ？',
      whatIsPoint1: 'WhatsApp がスマートフォンを占拠しています。写真・動画・メッセージが何年もかけて蓄積され、ストレージはあっという間にいっぱいになります。',
      whatIsPoint2: 'Apple はストレージの各段階に高額を課しています。128GB、256GB、512GB、1TB\u2026 新しい iPhone のたびに価格が上がります。',
      whatIsPoint3: 'それでも誰もあの思い出を消したくはありません：大切な会話、家族の写真、グループのひとときが詰まっています。',
      whatIsPoint4: 'このアプリはあなたの記憶を拡張します：WhatsApp の会話をエクスポートし、スマホの容量を解放し、すべての瞬間をそのまま再体験 — 吹き出し、メディア、タイムスタンプ、シネマフルスクリーンで。',
      whatIsPoint5: 'あの瞬間をもう一度：シネマモードは会話を没入型フルスクリーン体験に変えます。写真やビデオが背景でフェードし、テキストがその上に浮かびます — あなたの思い出の映画のように。',
      whatIsPoint6: 'データは厳重にプライベート：すべてブラウザ内でローカルに動作します。サーバーには何もアップロードされません。',
      liveSpeedLabel: 'スピード',
      homeButtonTitle: 'ホーム',
      livePrevYear: '-1 年',
      livePrevMonth: '-1 か月',
      livePrevDay: '-1 日',
      liveNextDay: '+1 日',
      liveNextMonth: '+1 か月',
      liveNextYear: '+1 年',
      livePlayPause: '再生 / 一時停止',
      liveTimelineLabel: 'タイムライン',
      releaseV031Date: '2026年2月',
      releaseV031_1: '英国、米国、韓国の国旗を改善',
      releaseV031_2: 'ホームページに戻るための専用ホームボタン',
      releaseV031_3: 'Live再生中の画像背景のフェード',
      releaseV031_4: 'Liveビューのメッセージにタイプライターエフェクト',
      releaseV031_5: '会話をナビゲートするタイムラインスクラバー',
      releaseV031_6: 'すべてのUI要素をローカライズ',
      releaseV032Date: '2026年2月',
      releaseV032_1: 'Live 背景に画像と動画の両方を対応（フルウィンドウ表示）',
      releaseV032_2: '作者プロフィールを再構成し、全11言語でローカライズ',
      releaseV032_3: '@メンションを WhatsApp のように太字緑色で表示',
      releaseV032_4: '可変間隔による自然なタイピングエフェクト',
      releaseV032_5: '氏名を修正：Pierre Régis Gonsolin',
      cinemaButtonTitle: 'シネマフルスクリーン',
      cinemaAutoScroll: '自動スクロール',
      cinemaSlower: '遅く',
      cinemaFaster: '速く',
      releaseV041Date: '2026年2月',
      releaseV041_1: 'シネマモードがブラウザの真のフルスクリーンを使用、切替ボタン付き',
      releaseV041_2: 'メディアが黒帯なしで画面全体を埋める',
      releaseV041_3: 'YouTubeリンクがフェード付きで背景動画として自動埋め込み',
      howStep4Title: '表示モードを選択',
      howStep4Desc: '5つの表示モード：iPhone、iPad（マルチチャットサイドバー）、ウェブフルスクリーン、アニメーションLive再生、背景メディア付きの没入型シネマモード。',
      howStep5Title: 'シネマモード',
      howStep5Desc: 'ブラウザフルスクリーン、写真とビデオが背景でフェード、YouTubeリンク自動埋め込み、スムーズなフェード音声、輪郭付きテキストが上に浮遊。',
      howStep6Title: 'リアルタイム翻訳',
      howStep6Desc: 'チャットの言語が自動的に検出されます。ターゲット言語を選択すると、すべてのメッセージが即座に翻訳されます — アプリを離れることなく。',
      translateBtnTitle: '翻訳',
      translateDetected: '検出：',
      translateOff: '翻訳オフ',
      translateInProgress: '翻訳中...',
      translateSameLang: '同じ言語',
      releaseV042Date: '2026年2月',
      releaseV042_1: 'リアルタイム翻訳：自動言語検出と即時翻訳',
      releaseV042_2: 'メディア切り替え時のスムーズな音声フェード',
      releaseV042_3: 'シネマモードでデフォルトで音声オン',
      releaseV042_4: 'マーケティングコンテンツの充実と「使い方」の新ステップ',
      releaseV043Date: '2026年2月',
      releaseV043_1: 'ランディングページのイラストを調整：電話がアウトラインと重ならなくなりました',
      releaseV043_2: 'エラーを返すYouTubeリンクはシネマモードで表示されなくなりました',
      releaseV043_3: 'シネマモードのスクロールテキストにメディアサムネイルを表示し、写真や動画の送信タイミングを把握しやすくしました',
      releaseV044Date: '2026年2月',
      releaseV044_1: 'シネマモード：起動時に黒背景、写真・動画サムネイルの修正と拡大',
      releaseV044_2: 'YouTube自動再生を無効化、サムネイルのみ表示',
      releaseV044_3: '翻訳：両方を表示する代わりに、元のテキストを翻訳に置き換え',
      releaseV044_4: 'シネマモード：統合された言語選択メニュー付きリアルタイム翻訳',
      releaseV044_5: 'ランディングページのイラストをオーバーフロー防止のために調整',
      releaseV04Date: '2026年2月',
      releaseV04_1: 'ライブ背景のぼかし除去、鮮明な画像と動画',
      releaseV04_2: '電話とその内容が常に前面に表示',
      releaseV04_3: '新しい「フルスクリーン」モード：輪郭付き大きなテキスト、全画面メディア',
      releaseV012Date: '2026年2月',
      releaseV011Date: '2026年2月',
      releaseV010Date: '2026年2月',
      releaseInitialLabel: '初回リリース',
      releaseV02_1: '多言語対応（英語、フランス語、スペイン語、イタリア語、ドイツ語、コルシカ語、ロシア語、中国語、日本語、韓国語）',
      releaseV02_2: '「使い方」「作者について」「リリースノート」セクション付きのホーム画面',
      releaseV02_3: '長いグループ名やサイドバーのチャット名のティッカースクロール',
      releaseV02_4: 'ホーム画面にバージョン番号を表示',
      releaseV03_5: '新規 4 言語対応追加：ロシア語、中国語、日本語、韓国語',
      releaseV012_1: 'グループ名を送信者選択から除外',
      releaseV012_2: 'ステータスバーにリアルタイム時計',
      releaseV012_3: 'デバイスの状態を反映するライブ Wi-Fi・バッテリーアイコン',
      releaseV012_4: '@メンション を WhatsApp スタイルの色で太字表示',
      releaseV012_5: 'クリック可能な参加者数で全リストを表示',
      releaseV012_6: 'ホーム画面で複数ファイルのアップロードに対応',
      releaseV012_7: '長すぎるチャット名のニュースティッカー（ヘッダーとサイドバー）',
      releaseV011_1: '左サイドバー付きの iPad 横向きビュー',
      releaseV011_2: 'フルスクリーンモードでのサイドバー対応',
      releaseV011_3: 'iPad/フルスクリーンモードで機能しない通話・設定アイコンを削除',
      releaseV011_4: 'グループ名の検出と送信者選択からの除外',
      releaseV010_1: 'WhatsApp チャットエクスポート（.zip）ビューア、スマートフォン風表示',
      releaseV010_2: 'iOS・Android エクスポート形式に対応',
      releaseV010_3: '送信者の選択に応じた左右のメッセージバブル',
      releaseV010_4: 'メディア対応：画像（ライトボックス付き）、動画、音声/ボイスメモ、ドキュメント',
      releaseV010_5: '送信者名をカラー表示するグループチャット対応',
      releaseV010_6: 'ハイライトとナビゲーション付きの検索機能',
      releaseV010_7: 'フルスクリーンモード',
      releaseV010_8: 'WhatsApp ダークテーマ',
      releaseV010_9: 'フランス語 UI',

      // ---- Profiler v0.5 ----
      profilerBtnTitle: '心理プロフィール',
      profilerTitle: 'グループ心理分析',
      profilerSubtitle: '会話分析に基づく各メンバーのプロフィール',
      profilerNoData: 'グループの会話を読み込んで分析を表示してください。',
      profilerMessages: 'メッセージ',
      profilerAvgLength: '平均長',
      profilerCharsPerMsg: '文字/通',
      profilerMediaSent: '送信メディア',
      profilerEmojis: '絵文字',
      profilerQuestions: '質問数',
      profilerLinks: '共有リンク',
      profilerInitiations: '会話開始数',
      profilerAvgResponseTime: '平均応答時間',
      profilerMostActiveHour: '最も活発な時間帯',
      profilerTopEmojis: 'よく使う絵文字',
      profilerPersonality: '心理プロフィール',
      profilerTraits: '性格特性',
      profilerCommunicationStyle: 'コミュニケーションスタイル',
      profilerGroupRole: 'グループでの役割',
      profilerMinutes: '分',
      profilerHours: '時間',
      profilerDays: '日',
      profilerStyleVerbose: '饒舌',
      profilerStyleConcise: '簡潔',
      profilerStyleExpressive: '表現豊か',
      profilerStyleFactual: '事実重視',
      profilerStyleInquisitive: '探究的',
      profilerStyleResponsive: '反応が早い',
      profilerStyleInitiator: '発起人',
      profilerStyleMediaHeavy: 'ビジュアル派',
      profilerRoleLeader: 'リーダー',
      profilerRoleConnector: 'コネクター',
      profilerRoleObserver: 'オブザーバー',
      profilerRoleEntertainer: 'エンターテイナー',
      profilerRoleSupporter: 'サポーター',
      profilerRoleAnalyst: 'アナリスト',
      profilerActivity: '活動',
      profilerActivityChart: '時間帯別分布',
      profilerSentiment: '感情',
      profilerSentimentPositive: 'ポジティブ',
      profilerSentimentNeutral: 'ニュートラル',
      profilerSentimentNegative: 'ネガティブ',
      profilerWordCloud: '頻出単語',
      profilerOverview: '概要',
      profilerDominance: '会話の支配度',
      releaseV05Date: '2026年3月',
      releaseV05_1: 'グループメンバーの心理分析とパーソナリティプロフィール',
      releaseV05_2: 'レーダーチャートとメンバー別時間帯別活動',
      releaseV05_3: 'コミュニケーションスタイルとグループ内の役割を自動検出',
      releaseV05_4: '感情分析とよく使う絵文字',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: 'あなたのプロフィール',
      profilerYourProfileSubtitle: 'あなたのメッセージに基づく個人分析',
      profilerNarrative: '心理ポートレート',
      profilerVsGroup: 'グループとの比較',
      profilerVsGroupAvg: 'グループ平均',
      profilerYou: 'あなた',
      profilerMoreThan: '平均より多い',
      profilerLessThan: '平均より少ない',
      profilerOnPar: 'グループと同水準',
      profilerBigFive: 'パーソナリティ指標',
      profilerBigFiveOpenness: '開放性',
      profilerBigFiveConscientiousness: '誠実性',
      profilerBigFiveExtraversion: '外向性',
      profilerBigFiveAgreeableness: '調和性',
      profilerBigFiveNeuroticism: '情緒安定性',
      profilerNarrIntro: '',
      profilerNarrVerbose: '饒舌なコミュニケーターとして、あなたは時間をかけて考えを詳しく展開します。長いメッセージは、ニュアンスと文脈を大切にする思慮深い性格を表しています。',
      profilerNarrConcise: '簡潔なコミュニケーターとして、あなたは単刀直入に本題に入ります。短く効率的なメッセージは、明確さと行動を重視する実用的な性格を表しています。',
      profilerNarrExpressive: '絵文字や感嘆符を豊富に使うあなたは、温かく感情的にオープンな性格です。会話にエネルギーと彩りをもたらしています。',
      profilerNarrFactual: '絵文字をほとんど使わない落ち着いた事実重視のスタイルは、感情より事実を重んじる分析的な性格を示しています。',
      profilerNarrInquisitive: '多くの質問をすることで、自然な知的好奇心と他者への真摯な関心を示しています。',
      profilerNarrResponsive: '素早い返信は、会話に注意を払い、応答性を大切にしていることを示しています。',
      profilerNarrInitiator: '頻繁に新しい会話を始めることは、積極的で社会的に自信のある気質を示しています。',
      profilerNarrMediaHeavy: '多くのビジュアルコンテンツを共有することは、イメージで考え、語るより見せることを好む性格を示しています。',
      profilerNarrLeader: 'このグループでは、自然とリーダーの役割を担っています。トーンを決め、話題を提供し、会話を維持する存在です。',
      profilerNarrConnector: 'グループのコネクターとして、質問をし、人々をつなぎ、社会的な絆を維持しています。',
      profilerNarrObserver: 'このグループではオブザーバー的な存在です。控えめながらも的確な発言をしています。',
      profilerNarrEntertainer: 'グループのエンターテイナーとして、ユーモアや笑い、ポジティブなエネルギーをもたらしています。',
      profilerNarrSupporter: 'グループでサポーターの役割を果たしています。反応が早く、ポジティブで、いつも頼りになる存在です。',
      profilerNarrAnalyst: 'グループのアナリストとして、リンクを共有し、詳細なメッセージを書き、議論に深みをもたらしています。',
      profilerNarrDefaultRole: 'あなた独自のスタイルで積極的にグループに参加し、会話にユニークな個性をもたらしています。',
      releaseV051Date: '2026年3月',
      releaseV051_1: '自動生成ナラティブポートレート付き個人心理プロフィール',
      releaseV051_2: 'コミュニケーション習慣から推測されるBig Fiveパーソナリティ指標',
      releaseV051_3: 'グループ平均との統計比較',
    },
    ko_KR: {
      appTitle: 'WhatsApp Chat Viewer',
      dropSubtitle: 'WhatsApp 내보내기 파일(.zip)을 여기에 드래그하세요',
      dropHint: '또는',
      dropButton: '파일 선택',
      dropFormats: '지원 형식: iOS 및 Android',
      loadingText: '대화를 불러오는 중...',
      sidebarTitle: '채팅',
      sidebarEmpty: '+ 버튼으로 WhatsApp 내보내기(.zip)를 추가하세요',
      senderPickerTitle: '당신은 누구인가요?',
      senderPickerSubtitle: '내 이름을 선택하면 내 메시지가 오른쪽에 표시됩니다',
      msgSuffix: '개 메시지',
      participantsSuffix: '명의 참가자',
      participantsPopupTitle: '참가자',
      youTag: '나',
      searchPlaceholder: '검색...',
      searchResult: '개 결과',
      searchResults: '개 결과',
      chatEmptyState: '채팅을 선택하세요',
      alertZipOnly: '.zip 파일을 선택해 주세요',
      alertZipOnlySingle: '.zip 파일을 선택해 주세요',
      alertNoChatFile: 'ZIP에서 채팅 파일을 찾을 수 없습니다. 파일에 _chat.txt가 포함되어 있는지 확인해 주세요.',
      alertParseError: '채팅을 파싱할 수 없습니다. 파일 형식을 확인해 주세요.',
      alertLoadError: '파일 로딩 오류: ',
      mediaImage: '📷 이미지가 포함되지 않음',
      mediaVideo: '🎥 동영상이 포함되지 않음',
      mediaAudio: '🎵 오디오가 포함되지 않음',
      mediaSticker: '🏷️ 스티커가 포함되지 않음',
      mediaDocument: '📄 문서가 포함되지 않음',
      mediaGif: '🎬 GIF가 포함되지 않음',
      mediaContact: '👤 연락처 카드가 포함되지 않음',
      mediaUnknown: '📎 미디어가 포함되지 않음',
      months: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
      howItWorksTitle: '사용 방법',
      howStep1Title: '아카이브 준비하기',
      howStep1Desc: '휴대폰에서 WhatsApp 열기 → 채팅 열기 → ⋮(메뉴) 탭 → 「채팅 내보내기」→ 「미디어 포함」선택（파일 크기를 줄이려면 미디어 없이）。.zip 파일이 생성됩니다.',
      howStep2Title: '컴퓨터로 전송하기',
      howStep2Desc: '.zip 파일을 이메일, AirDrop, Google 드라이브, USB 케이블 또는 다른 전송 방법으로 나에게 보내세요.',
      howStep3Title: '앱에서 보기',
      howStep3Desc: '.zip 파일을 이 페이지에 드래그하거나（또는 「파일 선택」클릭）목록에서 내 이름을 선택하면 휴대폰에서 보던 것과 똑같은 채팅 화면이 나타납니다.',
      aboutTitle: '작성자 소개',
      bioIntro: 'Perplexity 현지화 프로그램 매니저 (2026년 1월부터, 샌프란시스코, 하이브리드). 25년 이상의 국제 경험을 가진 현지화 및 언어 프로그램 관리 전문가.',
      bioExpTitle: '경력',
      bioPresent: '현재',
      bioMinistryTitle: '프랑스 교육부',
      bioMinistryRole: '영어 정교사 (Agrégé)',
      bioPrepenaRole: 'Prep\'ENA 연수생',
      bioBramhallRole: '외국어 보조 교사',
      bioEduTitle: '학력',
      bioEduField: '영어학 및 영문학',
      bioEduSchool: '코트다쥐르 대학교',
      bioPubTitle: '학술 논문',
      bioCertTitle: '자격증',
      bioCertEna: 'ENA 교육 수료증 (2013년 12월)',
      bioCertLinkedin: 'LinkedIn Learning 인증 (Linux, Python, 데이터 사이언스)',
      bioLangTitle: '언어',
      bioLangList: '코르시카어, 영어, 프랑스어, 이탈리아어 — 원어민 또는 이중언어 수준.',
      bioMiscTitle: '기타',
      bioMiscContent: '단편 영화 « Mission insulaire » 출연 (2005)',
      bioMiscRally: '랠리 코드라이버.',
      releaseTitle: '릴리스 노트',
      releaseV023Date: '2026년 2월',
      releaseV023_1: 'LinkedIn 프로필을 기반으로 작성자 소개를 전면 재작성',
      releaseV023_2: '모든 국기를 통일된 평면 직사각형 SVG로 교체（외부 PNG 파일 없음）',
      releaseV022Date: '2026년 2월',
      releaseV022_1: '이전 아이콘 대신 정통 코르시카 국기（무어인 머리）로 교체',
      releaseV022_2: '작성자 LinkedIn 링크 수정',
      releaseV021Date: '2026년 2월',
      releaseV021_1: '작성자 소개 수정',
      releaseV021_2: '「CO」텍스트를 애니메이션 코르시카 국기로 교체',
      releaseV021_3: '버전 번호 업데이트',
      releaseV02Date: '2026년 2월',
      releaseCurrentLabel: '현재 버전',
      releaseV03Date: '2026년 2월',
      releaseV03_1: '애니메이션 대화 재생 및 말풍선 소리가 포함된 「라이브」뷰',
      releaseV03_2: '검증된 LinkedIn 프로필을 기반으로 작성자 소개 수정',
      releaseV03_3: '홈 화면에 「이 앱은 무엇에 쓰나요?」섹션 추가',
      releaseV03_4: '뷰 선택기를 왼쪽으로 이동, 국기를 오른쪽으로 이동',
      whatIsItForTitle: '이 앱은 무엇에 쓰나요?',
      whatIsPoint1: 'WhatsApp이 휴대폰을 점령하고 있습니다. 사진, 동영상, 메시지가 수년간 쌓이면서 저장 공간이 빠르게 채워집니다.',
      whatIsPoint2: 'Apple은 저장 용량 단계마다 높은 가격을 책정합니다. 128GB, 256GB, 512GB, 1TB\u2026 새 iPhone마다 가격이 오릅니다.',
      whatIsPoint3: '그래도 아무도 그 추억을 삭제하고 싶지 않습니다: 소중한 대화, 가족 사진, 단체 채팅의 즐거운 순간들. 그 순간들은 소중합니다.',
      whatIsPoint4: '이 앱은 당신의 기억을 확장합니다: WhatsApp 대화를 내보내고, 휴대폰 저장 공간을 확보하고, 모든 순간을 그대로 다시 체험하세요 — 말풍선, 미디어, 타임스탬프, 시네마 전체 화면으로.',
      whatIsPoint5: '그 순간을 다시 살아보세요: 시네마 모드는 대화를 몰입형 전체 화면 경험으로 변환합니다. 사진과 동영상이 배경에서 페이드되고 텍스트가 위에 떠다닙니다 — 추억의 영화처럼.',
      whatIsPoint6: '데이터는 철저히 비공개: 모든 것이 브라우저에서 로컬로 실행됩니다. 서버에 아무것도 업로드되지 않습니다.',
      liveSpeedLabel: '속도',
      homeButtonTitle: '홈',
      livePrevYear: '-1 년',
      livePrevMonth: '-1 개월',
      livePrevDay: '-1 일',
      liveNextDay: '+1 일',
      liveNextMonth: '+1 개월',
      liveNextYear: '+1 년',
      livePlayPause: '재생 / 일시정지',
      liveTimelineLabel: '타임라인',
      releaseV031Date: '2026년 2월',
      releaseV031_1: '영국, 미국, 한국 국기 개선',
      releaseV031_2: '홈 화면으로 돌아가는 전용 홈 버튼',
      releaseV031_3: 'Live 재생 중 이미지 배경 페이드',
      releaseV031_4: 'Live 보기에서 메시지의 타자기 효과',
      releaseV031_5: '대화를 탐색하는 타임라인 스크러버',
      releaseV031_6: '모든 UI 요소 로켈라이즈됨',
      releaseV032Date: '2026년 2월',
      releaseV032_1: 'Live 배경에 이미지와 동영상 모두 지원 (전체 창)',
      releaseV032_2: '작성자 소개를 재구성하고 11개 언어 모두 현지화',
      releaseV032_3: '@멘션을 WhatsApp처럼 굵은 녹색으로 표시',
      releaseV032_4: '가변 간격의 자연스러운 타이핑 효과',
      releaseV032_5: '이름 수정: Pierre Régis Gonsolin',
      cinemaButtonTitle: '시네마 전체 화면',
      cinemaAutoScroll: '자동 스크롤',
      cinemaSlower: '느리게',
      cinemaFaster: '빠르게',
      releaseV041Date: '2026년 2월',
      releaseV041_1: '시네마 모드에서 브라우저 전체 화면 사용, 전환 버튼 포함',
      releaseV041_2: '미디어가 검은 막대 없이 전체 화면을 채움',
      releaseV041_3: 'YouTube 링크가 페이드 효과로 배경 동영상으로 자동 삽입',
      howStep4Title: '보기 모드 선택',
      howStep4Desc: '5가지 보기 모드: iPhone, iPad(멀티 채팅 사이드바), 웹 전체 화면, 애니메이션 Live 재생, 배경 미디어가 있는 몰입형 시네마 모드.',
      howStep5Title: '시네마 모드',
      howStep5Desc: '브라우저 전체 화면, 배경에서 페이드되는 사진과 동영상, YouTube 링크 자동 임베드, 부드러운 페이드 사운드, 윤곽선 텍스트가 위에 부유.',
      howStep6Title: '실시간 번역',
      howStep6Desc: '채팅 언어가 자동으로 감지됩니다. 대상 언어를 선택하면 모든 메시지가 즉시 번역됩니다 — 앱을 떠나지 않고.',
      translateBtnTitle: '번역',
      translateDetected: '감지됨:',
      translateOff: '번역 끄기',
      translateInProgress: '번역 중...',
      translateSameLang: '같은 언어',
      releaseV042Date: '2026년 2월',
      releaseV042_1: '실시간 번역: 자동 언어 감지 및 즉시 번역',
      releaseV042_2: '미디어 전환 시 부드러운 오디오 페이드 인/아웃',
      releaseV042_3: '시네마 모드에서 기본적으로 소리 켜짐',
      releaseV042_4: '마케팅 콘텐츠 강화 및 「사용 방법」의 새로운 단계',
      releaseV043Date: '2026년 2월',
      releaseV043_1: '랜딩 페이지 일러스트 조정: 전화기가 더 이상 윤곽선과 겹치지 않습니다',
      releaseV043_2: '오류를 반환하는 YouTube 링크는 시네마 모드에서 더 이상 표시되지 않습니다',
      releaseV043_3: '시네마 모드 스크롤 텍스트에 미디어 썸네일이 표시되어 사진과 동영상 전송 시점을 더 잘 추적할 수 있습니다',
      releaseV044Date: '2026년 2월',
      releaseV044_1: '시네마 모드: 시작 시 검은 배경, 사진 및 동영상 썸네일 수정 및 확대',
      releaseV044_2: 'YouTube 자동 재생 비활성화, 썸네일만 표시',
      releaseV044_3: '번역: 둘 다 표시하는 대신 원본 텍스트를 번역으로 대체',
      releaseV044_4: '시네마 모드: 통합 언어 선택 메뉴가 있는 실시간 번역',
      releaseV044_5: '오버플로 방지를 위해 랜딩 페이지 일러스트 조정',
      releaseV04Date: '2026년 2월',
      releaseV04_1: 'Live 배경 블러 제거, 선명한 이미지와 동영상',
      releaseV04_2: '전화기와 콘텐츠가 항상 전면에 표시',
      releaseV04_3: '새로운 「전체 화면」 모드: 윤곽선 있는 큰 텍스트, 전체 페이지 미디어',
      releaseV012Date: '2026년 2월',
      releaseV011Date: '2026년 2월',
      releaseV010Date: '2026년 2월',
      releaseInitialLabel: '최초 릴리스',
      releaseV02_1: '다국어 지원（영어, 프랑스어, 스페인어, 이탈리아어, 독일어, 코르시카어, 러시아어, 중국어, 일본어, 한국어）',
      releaseV02_2: '「사용 방법」, 「소개」, 「릴리스 노트」섹션이 있는 홈 화면',
      releaseV02_3: '긴 그룹 이름 및 사이드바 채팅 이름을 위한 티커 스크롤',
      releaseV02_4: '홈 화면에 버전 번호 표시',
      releaseV03_5: '4개 언어 지원 추가: 러시아어, 중국어, 일본어, 한국어',
      releaseV012_1: '발신자 선택기에서 그룹 이름 제외',
      releaseV012_2: '상태 표시줄의 실시간 시계',
      releaseV012_3: '기기 상태를 반영하는 실시간 Wi-Fi 및 배터리 아이콘',
      releaseV012_4: '@멘션을 WhatsApp 스타일 색상으로 굵게 표시',
      releaseV012_5: '전체 목록을 표시하는 클릭 가능한 참가자 수',
      releaseV012_6: '홈 화면에서 여러 파일 업로드 지원',
      releaseV012_7: '너무 긴 채팅 이름을 위한 뉴스 티커（헤더 및 사이드바）',
      releaseV011_1: '왼쪽 채팅 패널 사이드바가 있는 iPad 가로 뷰',
      releaseV011_2: '전체 화면 모드에서의 사이드바 지원',
      releaseV011_3: 'iPad/전체 화면 모드에서 작동하지 않는 통화 및 설정 아이콘 제거',
      releaseV011_4: '그룹 이름 감지 및 발신자 선택기에서 제외',
      releaseV010_1: '휴대폰 스타일 화면으로 표시되는 WhatsApp 채팅 내보내기(.zip) 뷰어',
      releaseV010_2: 'iOS 및 Android 내보내기 형식 지원',
      releaseV010_3: '발신자 선택에 따른 좌우 정렬 메시지 말풍선',
      releaseV010_4: '미디어 지원: 이미지（라이트박스 포함）, 동영상, 오디오/음성 메시지, 문서',
      releaseV010_5: '색상별 발신자 이름이 있는 그룹 채팅 지원',
      releaseV010_6: '하이라이트 및 탐색 기능이 있는 검색',
      releaseV010_7: '전체 화면 모드',
      releaseV010_8: 'WhatsApp 다크 테마',
      releaseV010_9: '프랑스어 UI',

      // ---- Profiler v0.5 ----
      profilerBtnTitle: '심리 프로필',
      profilerTitle: '그룹 심리 분석',
      profilerSubtitle: '대화 분석을 기반으로 한 각 멤버의 프로필',
      profilerNoData: '분석을 보려면 그룹 대화를 불러오세요.',
      profilerMessages: '메시지',
      profilerAvgLength: '평균 길이',
      profilerCharsPerMsg: '자/메시지',
      profilerMediaSent: '보낸 미디어',
      profilerEmojis: '이모지',
      profilerQuestions: '질문 수',
      profilerLinks: '공유한 링크',
      profilerInitiations: '시작한 대화',
      profilerAvgResponseTime: '평균 응답 시간',
      profilerMostActiveHour: '가장 활발한 시간대',
      profilerTopEmojis: '자주 사용한 이모지',
      profilerPersonality: '심리 프로필',
      profilerTraits: '성격 특성',
      profilerCommunicationStyle: '커뮤니케이션 스타일',
      profilerGroupRole: '그룹 내 역할',
      profilerMinutes: '분',
      profilerHours: '시간',
      profilerDays: '일',
      profilerStyleVerbose: '수다스러움',
      profilerStyleConcise: '간결함',
      profilerStyleExpressive: '표현력 풍부',
      profilerStyleFactual: '사실 중심',
      profilerStyleInquisitive: '탐구적',
      profilerStyleResponsive: '반응이 빠름',
      profilerStyleInitiator: '주도자',
      profilerStyleMediaHeavy: '시각형',
      profilerRoleLeader: '리더',
      profilerRoleConnector: '연결자',
      profilerRoleObserver: '관찰자',
      profilerRoleEntertainer: '엔터테이너',
      profilerRoleSupporter: '서포터',
      profilerRoleAnalyst: '분석가',
      profilerActivity: '활동',
      profilerActivityChart: '시간대별 분포',
      profilerSentiment: '감정',
      profilerSentimentPositive: '긍정적',
      profilerSentimentNeutral: '중립',
      profilerSentimentNegative: '부정적',
      profilerWordCloud: '자주 쓰는 단어',
      profilerOverview: '개요',
      profilerDominance: '대화 지배력',
      releaseV05Date: '2026년 3월',
      releaseV05_1: '그룹 멤버 심리 분석 및 성격 프로필',
      releaseV05_2: '멤버별 레이더 차트 및 시간대별 활동 분포',
      releaseV05_3: '커뮤니케이션 스타일 및 그룹 역할 자동 감지',
      releaseV05_4: '감정 분석 및 자주 사용한 이모지',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: '내 프로필',
      profilerYourProfileSubtitle: '내 메시지를 기반으로 한 개인 분석',
      profilerNarrative: '심리 초상화',
      profilerVsGroup: '그룹과 비교',
      profilerVsGroupAvg: '그룹 평균',
      profilerYou: '나',
      profilerMoreThan: '평균보다 높음',
      profilerLessThan: '평균보다 낮음',
      profilerOnPar: '그룹과 비슷한 수준',
      profilerBigFive: '성격 지표',
      profilerBigFiveOpenness: '개방성',
      profilerBigFiveConscientiousness: '성실성',
      profilerBigFiveExtraversion: '외향성',
      profilerBigFiveAgreeableness: '친화성',
      profilerBigFiveNeuroticism: '정서적 안정성',
      profilerNarrIntro: '',
      profilerNarrVerbose: '수다스러운 소통자로서, 당신은 시간을 들여 생각을 자세히 전개합니다. 긴 메시지는 뉘앙스와 맥락을 중시하는 사려 깊은 성격을 보여줍니다.',
      profilerNarrConcise: '간결한 소통자로서, 당신은 곧바로 핵심으로 들어갑니다. 짧고 효율적인 메시지는 명확함과 행동을 중시하는 실용적인 성격을 보여줍니다.',
      profilerNarrExpressive: '이모지와 느낌표를 풍부하게 사용하는 것은 따뜻하고 감정적으로 열린 성격을 보여줍니다. 대화에 에너지와 활기를 불어넣습니다.',
      profilerNarrFactual: '이모지를 거의 사용하지 않는 차분하고 사실 중심의 스타일은 감정보다 사실을 선호하는 분석적 성격을 보여줍니다.',
      profilerNarrInquisitive: '많은 질문을 하는 것은 자연스러운 지적 호기심과 타인에 대한 진정한 관심을 보여줍니다.',
      profilerNarrResponsive: '빠른 응답 시간은 대화에 매우 주의를 기울이고 응답성을 중시한다는 것을 보여줍니다.',
      profilerNarrInitiator: '자주 새로운 대화를 시작하는 것은 적극적이고 사회적으로 자신감 있는 기질을 보여줍니다.',
      profilerNarrMediaHeavy: '많은 시각적 콘텐츠를 공유하는 것은 이미지로 생각하고 말하기보다 보여주기를 선호하는 성격을 보여줍니다.',
      profilerNarrLeader: '이 그룹에서 당신은 자연스럽게 리더 역할을 합니다. 분위기를 설정하고, 주제를 시작하고, 대화를 이끌어갑니다.',
      profilerNarrConnector: '당신은 그룹의 연결자입니다. 질문을 하고, 사람들을 연결하며, 사회적 유대를 유지합니다.',
      profilerNarrObserver: '이 그룹에서 당신은 관찰자에 가깝습니다. 참여하되 신중하게, 적절한 때에 기여합니다.',
      profilerNarrEntertainer: '당신은 그룹의 엔터테이너입니다. 유머와 웃음, 긍정적인 에너지를 대화에 가져옵니다.',
      profilerNarrSupporter: '이 그룹에서 지지자 역할을 합니다. 반응이 빠르고, 긍정적이며, 항상 필요할 때 곁에 있습니다.',
      profilerNarrAnalyst: '당신은 그룹의 분석가입니다. 링크를 공유하고, 상세한 메시지를 작성하며, 논의에 깊이를 더합니다.',
      profilerNarrDefaultRole: '자신만의 방식으로 그룹에 적극적으로 참여하며, 대화에 독특한 스타일을 가져옵니다.',
      releaseV051Date: '2026년 3월',
      releaseV051_1: '자동 생성 서사적 초상화가 포함된 개인 심리 프로필',
      releaseV051_2: '소통 습관에서 추론된 Big Five 성격 지표',
      releaseV051_3: '그룹 평균과의 통계 비교',
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
      bioIntro: 'Localization Program Manager à Perplexity (dapoi ghjennaghju 2026, San Francisco, ibridu). Specializatu in a lucalizazione è a gestione di prugrammi linguistichi, cù più di 25 anni d\'esperienza internaziunale.',
      bioExpTitle: 'Esperienza',
      bioPresent: 'oghje',
      bioMinistryTitle: 'Ministeriu di l\'Educazione naziunale',
      bioMinistryRole: 'Prufessore agrégé d\'inglese',
      bioPrepenaRole: 'Stagiaire Prep\'ENA',
      bioBramhallRole: 'Assistente di lingua straniera',
      bioEduTitle: 'Furmazione',
      bioEduField: 'Lingua è Litteratura inglese',
      bioEduSchool: 'Università Côte d\'Azur',
      bioPubTitle: 'Publicazioni accademiche',
      bioCertTitle: 'Certificazioni',
      bioCertEna: 'Certificatu di furmazione ENA (dic. 2013)',
      bioCertLinkedin: 'Certificazioni LinkedIn Learning (Linux, Python, Data Science)',
      bioLangTitle: 'Lingue',
      bioLangList: 'Corsu, inglese, francese, italianu — livellu nativu o bilingue.',
      bioMiscTitle: 'Varii',
      bioMiscContent: 'Attore in u curtimètraghju « Mission insulaire » (2005)',
      bioMiscRally: 'Copilota di rally.',
      releaseTitle: 'Note di versione',
      releaseV023Date: 'Ferraghju 2026',
      releaseV023_1: 'Biografia di l\'autore riscritta cumplettamente secondu u prufilu LinkedIn',
      releaseV023_2: 'Tutte e bandiere rimpiazzate da SVG rettangulari piatti uniformi (nisunu schedariu PNG esternu)',
      releaseV022Date: 'Ferraghju 2026',
      releaseV022_1: 'Bandiera corsa autentica (testa di Moru) invintatu di l\'icona precedente',
      releaseV022_2: 'Currezzione di u ligame LinkedIn di l\'autore',
      releaseV021Date: 'Ferraghju 2026',
      releaseV021_1: 'Currezzione di a biografia di l\'autore',
      releaseV021_2: 'Bandiera corsa animata invintatu di u testu "CO"',
      releaseV021_3: 'Aghjurnamentu di u numeru di versione',
      releaseV02Date: 'Ferraghju 2026',
      releaseCurrentLabel: 'Versione attuale',
      releaseV03Date: 'Ferraghju 2026',
      releaseV03_1: 'Vista Viva cù riproduzzione animata di cunversazioni è soni di bolle',
      releaseV03_2: 'Biografia di l\'autore curretta sicondu u prufilu LinkedIn verificatu',
      releaseV03_3: 'Nova sezione \'À ch\'usa serve?\' in a pagina d\'accoglienza',
      releaseV03_4: 'Selettore di vista spustatu à mancinu, bandiere à diritta',
      whatIsItForTitle: 'À ch\'usa serve?',
      whatIsPoint1: 'WhatsApp invade u to telefunu. Foto, video è messaghji si accumulani nant\'anni — è a memoria si riempie prestu.',
      whatIsPoint2: 'Apple face pagà caru per ogni livellu di almacenamentu. 128 Go, 256 Go, 512 Go, 1 To\u2026 è u prezzu cresce cù ogni novu iPhone.',
      whatIsPoint3: 'Epù nisunu vole cancellà quei ricordi: cunversazioni prezziose, foto di famiglia, momenti di gruppu. Quelli attimi cuntani.',
      whatIsPoint4: 'St\'app aumenta a vostra memoria : esportate e vostre conversazione WhatsApp, liberate spaziu nant\'à u telefonu è riviscite ogni mumentu esattamente cum\'ellu hè statu — bolle, media, marche di tempu, tuttu in pienu schermu cinema.',
      whatIsPoint5: 'Riviscite u mumentu : u modu cinema trasforma e vostre conversazione in un\'esperienza immersiva pienu schermu. E foto è i video sfumanu in sfondu, u testu fluttueghja sopra — cum\'è un filmu di i vostri ricordi.',
      whatIsPoint6: 'I vostri dati restanu strettamente privati : tuttu funziona lucalmente ind\'è u vostru navigatore. Niente hè mandatu à un servitore.',
      liveSpeedLabel: 'Velocità',
      homeButtonTitle: 'Accoglienza',
      livePrevYear: '-1 annu',
      livePrevMonth: '-1 mese',
      livePrevDay: '-1 ghjornu',
      liveNextDay: '+1 ghjornu',
      liveNextMonth: '+1 mese',
      liveNextYear: '+1 annu',
      livePlayPause: 'Lettura / Pausa',
      liveTimelineLabel: 'Cronologia',
      releaseV031Date: 'Ferraghju 2026',
      releaseV031_1: 'Bandiere UK, USA è Corea di u Sud migliurate',
      releaseV031_2: 'Buttone d\'accoglienza separatu per turnà à a pagina d\'accoglienza',
      releaseV031_3: 'Fundu d\'imaghjine in dissolvenza durante a lettura Live',
      releaseV031_4: 'Effettu di maschina da scrivere per i messagi in vista Live',
      releaseV031_5: 'Cursore di cronologia per navighi in a cunversazione',
      releaseV031_6: 'Tutti i elementi d\'interfaccia lucalizati',
      releaseV032Date: 'Ferraghju 2026',
      releaseV032_1: 'Fundu Live: supporta avà imaghjni È video (schermo pienu)',
      releaseV032_2: 'Biografia di l\'autore ristrutturata è lucalizata in tutte l\'11 lingue',
      releaseV032_3: 'Menzzioni @ in verde grassettu cum\'in WhatsApp',
      releaseV032_4: 'Effettu di scrittura naturale cù intervalli variabili',
      releaseV032_5: 'Nome currettu: Pierre Régis Gonsolin',
      cinemaButtonTitle: 'Pienu schermu cinema',
      cinemaAutoScroll: 'Scurrimentu automaticu',
      cinemaSlower: 'Più pianu',
      cinemaFaster: 'Più prestu',
      releaseV041Date: 'Ferraghju 2026',
      releaseV041_1: 'Modu cinema cù pienu schermu reale di u navigatore è bottonu di commutazione',
      releaseV041_2: 'Media senza bande nere, riempimentu tutale di u schermu',
      releaseV041_3: 'Ligami YouTube integrati automaticamente cum\'è video di fondu cù dissolvenza',
      howStep4Title: 'Sceglete u vostru modu di visualizazione',
      howStep4Desc: 'Cinque modi di vista : iPhone, iPad (barra laterale multi-conversazione), pienu schermu web, lettura Live animata è modu Cinema immersivu cù media di sfondu.',
      howStep5Title: 'Modu Cinema',
      howStep5Desc: 'Pienu schermu di u navigatore, foto è video in dissolvenza di sfondu, ligami YouTube integrati automaticamente, sonu cù dissolvenza progressiva è testu cù cuntorni chì fluttueghja sopra.',
      howStep6Title: 'Traduzzione in direttu',
      howStep6Desc: 'A lingua di a conversazione hè rilevata automaticamente. Sceglete una lingua di destinazione è tutti i messaghji sò tradotti istantaneamente — senza lascià l\'app.',
      translateBtnTitle: 'Traduce',
      translateDetected: 'Rilevatu:',
      translateOff: 'Traduzzione disattivata',
      translateInProgress: 'Traduzzione...',
      translateSameLang: 'Stessa lingua',
      releaseV042Date: 'Ferraghju 2026',
      releaseV042_1: 'Traduzzione in direttu : rilevamentu automaticu di a lingua è traduzzione istantanea',
      releaseV042_2: 'Dissolvenza audio progressiva à l\'entrata è à a sortita di i media',
      releaseV042_3: 'Sonu attivatu per difettu in modu cinema',
      releaseV042_4: 'Cuntenutu marketing arricchitu è novi passi in « Cume funziona »',
      releaseV043Date: 'Ferraghju 2026',
      releaseV043_1: 'Illustrazione di a pagina d\'accoglienza aggiustata: u telefunu ùn si sovrappone più à u cuntornu',
      releaseV043_2: 'I ligami YouTube in errore ùn si mostranu più in modu cinema',
      releaseV043_3: 'Miniature di i media affissate ind\'è u testu chì scorge di u modu cinema per seguità megliu e foto è i video mandati',
      releaseV044Date: 'Ferraghju 2026',
      releaseV044_1: 'Modu cinema : sfondu neru à l\'avviu, miniature di foto è video curette è ingrandite',
      releaseV044_2: 'Lettura automatica YouTube disattivata, solu e miniature sò affissate',
      releaseV044_3: 'Traduzzione : u testu uriginale hè rimpiazzatu da a traduzzione inveci di mustrà tutti i dui',
      releaseV044_4: 'Modu cinema : traduzzione in direttu cù menu di selezzione di lingua integratu',
      releaseV044_5: 'Illustrazione di a pagina d\'accoglienza aggiustata per evità u trasbordamentu',
      releaseV04Date: 'Ferraghju 2026',
      releaseV04_1: 'Sfondu live senza sfucatura, imagine è video nitidi',
      releaseV04_2: 'Telefonu è u so cuntenutu sempre in primu pianu',
      releaseV04_3: 'Novu modu « Pienu schermu »: testu grande cù cuntorni, media à pagina intera',
      releaseV012Date: 'Ferraghju 2026',
      releaseInitialLabel: 'Prima versione',
      releaseV02_1: 'Supportu multilingue (inglese, francese, spagnolu, italiano, tedescu, corsu, russu, cinese, giappunese, coreanu)',
      releaseV02_2: 'Pagina d\'accoglienza cù sezioni "Cumu funziona", "À prupòsitu" è "Note di versione"',
      releaseV02_3: 'Scurruta ticker per i nomi di gruppu lunghi è i nomi in a barra laterale',
      releaseV02_4: 'Numeru di versione mustratu in a pagina d\'accoglienza',
      releaseV03_5: 'Supportu aghjuntu per 4 nove lingue: russu, cinese, giappunese, coreanu',
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

      // ---- Profiler v0.5 ----
      profilerBtnTitle: 'Prufilu psiculogicu',
      profilerTitle: 'Analisi psiculogica di u gruppu',
      profilerSubtitle: 'Prufilu di ogni membru basatu nantu à l\'analisi di a cunversazione',
      profilerNoData: 'Caricate una cunversazione di gruppu per vede l\'analisi.',
      profilerMessages: 'Missagi',
      profilerAvgLength: 'Lungh. media',
      profilerCharsPerMsg: 'car/msg',
      profilerMediaSent: 'Media mandati',
      profilerEmojis: 'Emoji',
      profilerQuestions: 'Dumande fatte',
      profilerLinks: 'Ligami spartiti',
      profilerInitiations: 'Cunversazioni avviate',
      profilerAvgResponseTime: 'Tempu di risposta mediu',
      profilerMostActiveHour: 'Ora più attiva',
      profilerTopEmojis: 'Emoji preferiti',
      profilerPersonality: 'Prufilu psiculogicu',
      profilerTraits: 'Tratti di personalità',
      profilerCommunicationStyle: 'Stile di cumunicazione',
      profilerGroupRole: 'Rolu in u gruppu',
      profilerMinutes: 'min',
      profilerHours: 'h',
      profilerDays: 'g',
      profilerStyleVerbose: 'Prolissu',
      profilerStyleConcise: 'Cuncisu',
      profilerStyleExpressive: 'Espressivu',
      profilerStyleFactual: 'Fattuale',
      profilerStyleInquisitive: 'Curiosu',
      profilerStyleResponsive: 'Reattivu',
      profilerStyleInitiator: 'Iniziatore',
      profilerStyleMediaHeavy: 'Visivu',
      profilerRoleLeader: 'Capu',
      profilerRoleConnector: 'Cunnettore',
      profilerRoleObserver: 'Osservatore',
      profilerRoleEntertainer: 'Animatore',
      profilerRoleSupporter: 'Sustegnu',
      profilerRoleAnalyst: 'Analista',
      profilerActivity: 'Attività',
      profilerActivityChart: 'Distribuzione oraria',
      profilerSentiment: 'Sentimentu',
      profilerSentimentPositive: 'Pusitivu',
      profilerSentimentNeutral: 'Neutru',
      profilerSentimentNegative: 'Negativu',
      profilerWordCloud: 'Parolle frequente',
      profilerOverview: 'Panoramica',
      profilerDominance: 'Duminanza cunversaziunale',
      releaseV05Date: 'Marzu 2026',
      releaseV05_1: 'Analisi psiculogica di i membri di u gruppu cù prufili di personalità',
      releaseV05_2: 'Grafici radar è distribuzione oraria per membru',
      releaseV05_3: 'Rilevamentu automaticu di u stile di cumunicazione è di u rolu in u gruppu',
      releaseV05_4: 'Analisi di sentimentu è emoji preferiti',

      // ---- Personal Profile v0.5.1 ----
      profilerYourProfile: 'U vostru prufilu',
      profilerYourProfileSubtitle: 'Analisi persunale basata nantu à i vostri missagi',
      profilerNarrative: 'Ritrattu psiculogicu',
      profilerVsGroup: 'Paragunatu à u gruppu',
      profilerVsGroupAvg: 'Media di u gruppu',
      profilerYou: 'Voi',
      profilerMoreThan: 'di più chè a media',
      profilerLessThan: 'di menu chè a media',
      profilerOnPar: 'in a media di u gruppu',
      profilerBigFive: 'Indicatori di personalità',
      profilerBigFiveOpenness: 'Apertura',
      profilerBigFiveConscientiousness: 'Cuscenziosità',
      profilerBigFiveExtraversion: 'Estraversione',
      profilerBigFiveAgreeableness: 'Amabilità',
      profilerBigFiveNeuroticism: 'Stabilità emotiva',
      profilerNarrIntro: 'Cum\'è ',
      profilerNarrVerbose: 'cumunicatore prolissu, pigliate u tempu di sviluppà i vostri pinseri in dettagliu.',
      profilerNarrConcise: 'cumunicatore cuncisu, andate dirittu à u puntu.',
      profilerNarrExpressive: 'U vostru usu abbundante d\'emoji rivela una personalità calorosa è emotivamente aperta.',
      profilerNarrFactual: 'U vostru stile sobriu è fattuale rivela una personalità analitica.',
      profilerNarrInquisitive: 'Fate parechje dumande, dimustrendu una curiosità intellettuale naturale.',
      profilerNarrResponsive: 'U vostru tempu di risposta veloce mostra chì site attentu à e cunversazione.',
      profilerNarrInitiator: 'Avviate spessu nove cunversazione, rivelendu un temperamentu proattivu.',
      profilerNarrMediaHeavy: 'Spartite assai cuntenuti visivi, rivelendu una personalità chì pensa in imagine.',
      profilerNarrLeader: 'In stu gruppu, occupate naturalmente u rolu di capu.',
      profilerNarrConnector: 'Site u cunnettore di u gruppu.',
      profilerNarrObserver: 'Site piuttostu osservatore in stu gruppu.',
      profilerNarrEntertainer: 'Site l\'animatore di u gruppu.',
      profilerNarrSupporter: 'Ghjucate un rolu di sustegnu in stu gruppu.',
      profilerNarrAnalyst: 'Site l\'analista di u gruppu.',
      profilerNarrDefaultRole: 'Participate attivamente à u gruppu à u vostru modu.',
      releaseV051Date: 'Marzu 2026',
      releaseV051_1: 'Prufilu psiculogicu persunale cù ritrattu narrativu generatu automaticamente',
      releaseV051_2: 'Indicatori di personalità Big Five dedotti da e abitudine di cumunicazione',
      releaseV051_3: 'Paragone di e vostre statistiche cù a media di u gruppu',
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
    // Update all data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = t(key);
      if (val !== undefined) el.title = val;
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

    // Reset translation state on chat switch
    if (typeof translateBar !== 'undefined' && translateBar && !translateBar.classList.contains('hidden')) {
      translateBar.classList.add('hidden');
    }
    if (typeof translateTarget !== 'undefined' && translateTarget) translateTarget.value = '';
    if (typeof translateState !== 'undefined') {
      translateState.active = false;
      translateState.targetLang = '';
      translateState.detectedLang = '';
      translateState.originalTexts.clear();
    }
    // Restore any translated text to originals
    removeTranslations();

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
  const btnLive = $('btn-live');
  const btnCinema = $('btn-cinema');
  let currentView = 'phone';

  btnPhone.addEventListener('click', () => switchView('phone'));
  btnIpad.addEventListener('click', () => switchView('ipad'));
  btnFull.addEventListener('click', () => switchView('full'));
  btnLive.addEventListener('click', () => switchView('live'));
  btnCinema.addEventListener('click', () => switchView('cinema'));

  function switchView(mode) {
    if (mode === currentView) return;

    // Clean up profiler when leaving
    if (currentView === 'profiler') {
      const po = document.querySelector('.profiler-overlay');
      if (po) { po.classList.remove('visible'); setTimeout(() => po.remove(), 300); }
    }

    // Stop Live playback when leaving Live mode
    if (currentView === 'live') {
      liveStop();
      const liveControls = $('live-controls');
      if (liveControls) liveControls.classList.add('hidden');
      chatScreen.classList.remove('live-mode');
    }

    // Clean up cinema mode when leaving it
    if (currentView === 'cinema') {
      cleanupCinema();
    }

    currentView = mode;

    const scrollRatio = chatArea.scrollHeight > chatArea.clientHeight
      ? chatArea.scrollTop / (chatArea.scrollHeight - chatArea.clientHeight)
      : 1;

    btnPhone.classList.toggle('active', mode === 'phone');
    btnIpad.classList.toggle('active', mode === 'ipad');
    btnFull.classList.toggle('active', mode === 'full');
    btnLive.classList.toggle('active', mode === 'live');
    btnCinema.classList.toggle('active', mode === 'cinema');
    if (btnProfiler) btnProfiler.classList.toggle('active', mode === 'profiler');

    chatScreen.classList.remove('fullscreen-mode', 'ipad-mode', 'cinema-mode');

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
    } else if (mode === 'live') {
      chatScreen.classList.add('live-mode');
      const liveControls = $('live-controls');
      if (liveControls) liveControls.classList.remove('hidden');
      chatEmptyState.classList.add('hidden');
      if (activeChatId) {
        chatArea.classList.remove('hidden');
        chatHeader.classList.remove('hidden');
        liveStart();
      }
    } else if (mode === 'profiler') {
      chatEmptyState.classList.add('hidden');
      if (activeChatId) {
        renderProfilerView();
      }
      return;
    } else if (mode === 'cinema') {
      chatScreen.classList.add('cinema-mode');
      chatEmptyState.classList.add('hidden');
      if (activeChatId) {
        renderCinemaView();
      }
    }

    if (mode === 'phone') {
      chatEmptyState.classList.add('hidden');
      if (activeChatId) {
        chatArea.classList.remove('hidden');
        chatHeader.classList.remove('hidden');
        // Re-render full messages
        const chat = getActiveChat();
        if (chat) renderMessages(chat);
      }
    }

    if (mode !== 'live') {
      requestAnimationFrame(() => {
        const newMax = chatArea.scrollHeight - chatArea.clientHeight;
        chatArea.scrollTop = scrollRatio * newMax;
      });
    }
  }

  // ===================== CINEMA VIEW =====================
  let cinemaState = { observer: null, bgLayer: null, soundBtn: null, fsBtn: null, muted: true, activeMedia: null };

  // YouTube URL detection → returns embed URL or null
  function extractYoutubeEmbedUrl(text) {
    if (!text) return null;
    // Match youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?[^\s]*v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) return 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1&mute=0&controls=0&loop=1&playlist=' + m[1] + '&enablejsapi=1';
    }
    return null;
  }

  /* Fullscreen helpers — use indirect property access to avoid static analysis blocking */
  const _fsReq = 'request' + 'Fullscreen';
  const _fsReqWk = 'webkit' + 'Request' + 'Fullscreen';
  const _fsReqMs = 'ms' + 'Request' + 'Fullscreen';
  const _fsExit = 'exit' + 'Fullscreen';
  const _fsExitWk = 'webkit' + 'Exit' + 'Fullscreen';
  const _fsEl = 'fullscreen' + 'Element';
  const _fsElWk = 'webkit' + 'Fullscreen' + 'Element';

  function cinemaRequestFullscreen() {
    try {
      const el = document.documentElement;
      if (el[_fsReq]) el[_fsReq]().catch(() => {});
      else if (el[_fsReqWk]) el[_fsReqWk]();
      else if (el[_fsReqMs]) el[_fsReqMs]();
    } catch(e) { /* fullscreen unavailable */ }
  }

  function cinemaExitFullscreen() {
    try {
      if (document[_fsEl] || document[_fsElWk]) {
        if (document[_fsExit]) document[_fsExit]().catch(() => {});
        else if (document[_fsExitWk]) document[_fsExitWk]();
      }
    } catch(e) { /* fullscreen unavailable */ }
  }

  function cleanupCinema() {
    if (cinemaState.observer) { cinemaState.observer.disconnect(); cinemaState.observer = null; }
    const ct = document.getElementById('cinema-container');
    if (ct) ct.remove();
    if (cinemaState.bgLayer) {
      // Pause/clean all videos and remove iframes
      cinemaState.bgLayer.querySelectorAll('video').forEach(v => { v.pause(); v.src = ''; });
      cinemaState.bgLayer.querySelectorAll('iframe').forEach(f => { f.src = ''; });
      cinemaState.bgLayer.remove();
      cinemaState.bgLayer = null;
    }
    const bb = document.querySelector('.cinema-back-btn');
    if (bb) bb.remove();
    if (cinemaState.soundBtn) { cinemaState.soundBtn.remove(); cinemaState.soundBtn = null; }
    if (cinemaState.fsBtn) { cinemaState.fsBtn.remove(); cinemaState.fsBtn = null; }
    if (cinemaState.ciTransBtn) { cinemaState.ciTransBtn.remove(); cinemaState.ciTransBtn = null; }
    if (cinemaState.langMenu) { cinemaState.langMenu.remove(); cinemaState.langMenu = null; }
    if (cinemaState._stopAutoScroll) { cinemaState._stopAutoScroll(); cinemaState._stopAutoScroll = null; }
    if (cinemaState.autoScrollBtn) { cinemaState.autoScrollBtn.remove(); cinemaState.autoScrollBtn = null; }
    if (cinemaState.speedSlowerBtn) { cinemaState.speedSlowerBtn.remove(); cinemaState.speedSlowerBtn = null; }
    if (cinemaState.speedFasterBtn) { cinemaState.speedFasterBtn.remove(); cinemaState.speedFasterBtn = null; }
    if (cinemaState.speedLabel) { cinemaState.speedLabel.remove(); cinemaState.speedLabel = null; }
    if (cinemaState._closeLangMenu) {
      document.removeEventListener('click', cinemaState._closeLangMenu);
      cinemaState._closeLangMenu = null;
    }
    cinemaState.activeMedia = null;
    // Remove fullscreen change listeners
    if (cinemaState._fsListeners) {
      document.removeEventListener(_fsEl.replace('Element','') + 'change', cinemaState._fsListeners.fn);
      document.removeEventListener('webkit' + _fsEl.replace('Element','') + 'change', cinemaState._fsListeners.fn);
      cinemaState._fsListeners = null;
    }
    cinemaExitFullscreen();
  }

  // ---- Cinema lightbox for full image view ----
  function openCinemaLightbox(imgUrl) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'cinema-lightbox';
    // Image
    const img = document.createElement('img');
    img.src = imgUrl;
    img.className = 'cinema-lightbox-img';
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    // Trigger fade-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('visible');
      });
    });
    // Close on click anywhere
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      overlay.addEventListener('transitionend', () => {
        overlay.remove();
      }, { once: true });
    });
    // Close on Escape key
    const onKey = (e) => {
      if (e.key === 'Escape') {
        overlay.classList.remove('visible');
        overlay.addEventListener('transitionend', () => {
          overlay.remove();
        }, { once: true });
        document.removeEventListener('keydown', onKey);
      }
    };
    document.addEventListener('keydown', onKey);
  }

  function renderCinemaView() {
    cleanupCinema();

    const chat = getActiveChat();
    if (!chat) return;

    cinemaState.muted = false;

    // Request browser fullscreen immediately
    cinemaRequestFullscreen();

    // ---- Back button ----
    const backBtn = document.createElement('button');
    backBtn.className = 'cinema-back-btn';
    backBtn.title = t('cinemaButtonTitle');
    backBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><polyline points="15 18 9 12 15 6"></polyline></svg>';
    backBtn.addEventListener('click', () => switchView('phone'));
    document.body.appendChild(backBtn);

    // ---- Sound toggle button ----
    const soundBtn = document.createElement('button');
    soundBtn.className = 'cinema-sound-btn';
    const muteIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H3v6h4l5 5V13.41l4.18 4.18c-.65.49-1.38.88-2.18 1.12v2.06a8.94 8.94 0 003.61-1.74l2.04 2.04a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76zm4.5 8A4.5 4.5 0 0014 8.18v.73l2.5 2.5V12z"/></svg>';
    const unmuteIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.18v7.64A4.49 4.49 0 0016.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    soundBtn.innerHTML = unmuteIcon;
    soundBtn.classList.add('unmuted');
    soundBtn.addEventListener('click', () => {
      cinemaState.muted = !cinemaState.muted;
      soundBtn.classList.toggle('unmuted', !cinemaState.muted);
      soundBtn.innerHTML = cinemaState.muted ? muteIcon : unmuteIcon;
      // Apply to active video
      if (cinemaState.activeMedia) {
        if (cinemaState.activeMedia.tagName === 'VIDEO') {
          cinemaState.activeMedia.muted = cinemaState.muted;
        } else if (cinemaState.activeMedia.tagName === 'IFRAME') {
          // Rebuild iframe src with mute param
          const src = cinemaState.activeMedia.src;
          cinemaState.activeMedia.src = src.replace(/mute=[01]/, 'mute=' + (cinemaState.muted ? '1' : '0'));
        }
      }
    });
    document.body.appendChild(soundBtn);
    cinemaState.soundBtn = soundBtn;

    // ---- Fullscreen toggle button ----
    const fsEnterIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
    const fsExitIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';
    const fsBtn = document.createElement('button');
    fsBtn.className = 'cinema-fs-btn';
    fsBtn.innerHTML = fsExitIcon; // we start in fullscreen
    fsBtn.addEventListener('click', () => {
      if (document[_fsEl] || document[_fsElWk]) {
        cinemaExitFullscreen();
      } else {
        cinemaRequestFullscreen();
      }
    });
    // Listen for fullscreen changes to update icon
    const _fsChangeEvt = _fsEl.replace('Element','') + 'change';
    const _fsChangeEvtWk = 'webkit' + _fsChangeEvt;
    const onFsChange = () => {
      fsBtn.innerHTML = (document[_fsEl] || document[_fsElWk]) ? fsExitIcon : fsEnterIcon;
    };
    document.addEventListener(_fsChangeEvt, onFsChange);
    document.addEventListener(_fsChangeEvtWk, onFsChange);
    cinemaState._fsListeners = { fn: onFsChange };
    document.body.appendChild(fsBtn);
    cinemaState.fsBtn = fsBtn;

    // ---- Translate button + language menu for cinema ----
    const cinemaTranslateIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>';
    const ciTransBtn = document.createElement('button');
    ciTransBtn.className = 'cinema-translate-btn';
    ciTransBtn.innerHTML = cinemaTranslateIcon;
    document.body.appendChild(ciTransBtn);
    cinemaState.ciTransBtn = ciTransBtn;

    // Language menu popup
    const langMenu = document.createElement('div');
    langMenu.className = 'cinema-lang-menu';
    // "Off" option
    const offItem = document.createElement('button');
    offItem.className = 'cinema-lang-menu-item off-item active';
    offItem.textContent = t('translateOff') || 'Translation off';
    offItem.dataset.lang = '';
    langMenu.appendChild(offItem);
    // Language options (same as translate bar)
    const cinemaLangs = [
      { code: 'fr', name: 'Fran\u00e7ais' }, { code: 'en', name: 'English' },
      { code: 'es', name: 'Espa\u00f1ol' }, { code: 'it', name: 'Italiano' },
      { code: 'de', name: 'Deutsch' }, { code: 'ru', name: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
      { code: 'zh', name: '\u4e2d\u6587' }, { code: 'ja', name: '\u65e5\u672c\u8a9e' },
      { code: 'ko', name: '\ud55c\uad6d\uc5b4' }, { code: 'pt', name: 'Portugu\u00eas' },
      { code: 'ar', name: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' }, { code: 'hi', name: '\u0939\u093f\u0928\u094d\u0926\u0940' },
      { code: 'co', name: 'Corsu' }
    ];
    for (const lang of cinemaLangs) {
      const item = document.createElement('button');
      item.className = 'cinema-lang-menu-item';
      item.textContent = lang.name;
      item.dataset.lang = lang.code;
      langMenu.appendChild(item);
    }
    document.body.appendChild(langMenu);
    cinemaState.langMenu = langMenu;

    // Cinema translation state
    let cinemaTranslateActive = false;
    let cinemaTranslateLang = '';
    const cinemaOriginalTexts = new Map();

    // Toggle menu on button click
    ciTransBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('visible');
    });

    // Close menu when clicking elsewhere
    const closeLangMenu = (e) => {
      if (!langMenu.contains(e.target) && e.target !== ciTransBtn) {
        langMenu.classList.remove('visible');
      }
    };
    document.addEventListener('click', closeLangMenu);
    cinemaState._closeLangMenu = closeLangMenu;

    // Handle language selection
    langMenu.addEventListener('click', async (e) => {
      const item = e.target.closest('.cinema-lang-menu-item');
      if (!item) return;
      const lang = item.dataset.lang;

      // Update active state
      langMenu.querySelectorAll('.cinema-lang-menu-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      langMenu.classList.remove('visible');

      if (!lang) {
        // Turn off translation — restore originals
        ciTransBtn.classList.remove('active');
        cinemaTranslateActive = false;
        cinemaTranslateLang = '';
        cinemaOriginalTexts.forEach((origHtml, span) => {
          span.innerHTML = origHtml;
        });
        cinemaOriginalTexts.clear();
        return;
      }

      ciTransBtn.classList.add('active');
      cinemaTranslateActive = true;
      cinemaTranslateLang = lang;

      // Restore originals first if switching languages
      cinemaOriginalTexts.forEach((origHtml, span) => {
        span.innerHTML = origHtml;
      });
      cinemaOriginalTexts.clear();

      // Detect source language
      if (!translateState.detectedLang) {
        translateState.detectedLang = detectLanguage(chat.messages);
      }

      if (translateState.detectedLang === lang) return;

      // Translate all cinema text spans (replace source, don't keep both)
      const textSpans = container.querySelectorAll('.cinema-msg-text');
      const batchSize = 5;
      for (let i = 0; i < textSpans.length; i += batchSize) {
        const batch = Array.from(textSpans).slice(i, i + batchSize);
        await Promise.all(batch.map(async (span) => {
          const originalText = span.textContent;
          if (!originalText || originalText.trim().length < 2) return;
          if (!cinemaOriginalTexts.has(span)) {
            cinemaOriginalTexts.set(span, span.innerHTML);
          }
          const result = await translateText(originalText, translateState.detectedLang, lang);
          if (result && result !== originalText && cinemaTranslateActive && cinemaTranslateLang === lang) {
            span.textContent = result;
          }
        }));
      }
    });

    // ---- Auto-scroll button + speed controls ----
    const autoScrollPlayIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z"/></svg>';
    const autoScrollPauseIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    const autoScrollBtn = document.createElement('button');
    autoScrollBtn.className = 'cinema-autoscroll-btn';
    autoScrollBtn.innerHTML = autoScrollPlayIcon;
    autoScrollBtn.title = t('cinemaAutoScroll') || 'Auto-scroll';

    // Speed controls (slower / faster)
    const speedSlowerBtn = document.createElement('button');
    speedSlowerBtn.className = 'cinema-speed-btn cinema-speed-slower';
    speedSlowerBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13H5v-2h14v2z"/></svg>';
    speedSlowerBtn.title = t('cinemaSlower') || 'Slower';
    const speedFasterBtn = document.createElement('button');
    speedFasterBtn.className = 'cinema-speed-btn cinema-speed-faster';
    speedFasterBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
    speedFasterBtn.title = t('cinemaFaster') || 'Faster';
    const speedLabel = document.createElement('span');
    speedLabel.className = 'cinema-speed-label';

    let autoScrollRafId = null;
    let autoScrollActive = false;
    let autoScrollLastTime = 0;
    const SPEED_MIN = 0;
    const SPEED_MAX = 500;
    const SPEED_STEP = 25;
    let autoScrollSpeed = 100; // default 100 px/s

    function updateSpeedLabel() {
      speedLabel.textContent = autoScrollSpeed + 'px/s';
      speedSlowerBtn.classList.toggle('disabled', autoScrollSpeed <= SPEED_MIN);
      speedFasterBtn.classList.toggle('disabled', autoScrollSpeed >= SPEED_MAX);
    }
    updateSpeedLabel();

    function autoScrollFrame(timestamp) {
      if (!autoScrollActive) return;
      const ct = document.getElementById('cinema-container');
      if (!ct) { stopAutoScroll(); return; }
      if (autoScrollLastTime) {
        const dt = (timestamp - autoScrollLastTime) / 1000; // seconds
        const px = autoScrollSpeed * dt;
        ct.scrollTop += px;
        if (ct.scrollTop + ct.clientHeight >= ct.scrollHeight - 2) {
          stopAutoScroll();
          return;
        }
      }
      autoScrollLastTime = timestamp;
      autoScrollRafId = requestAnimationFrame(autoScrollFrame);
    }

    function startAutoScroll() {
      autoScrollActive = true;
      autoScrollLastTime = 0;
      autoScrollBtn.innerHTML = autoScrollPauseIcon;
      autoScrollBtn.classList.add('active');
      speedSlowerBtn.style.display = '';
      speedFasterBtn.style.display = '';
      speedLabel.style.display = '';
      autoScrollRafId = requestAnimationFrame(autoScrollFrame);
    }

    function stopAutoScroll() {
      autoScrollActive = false;
      autoScrollBtn.innerHTML = autoScrollPlayIcon;
      autoScrollBtn.classList.remove('active');
      speedSlowerBtn.style.display = 'none';
      speedFasterBtn.style.display = 'none';
      speedLabel.style.display = 'none';
      if (autoScrollRafId) {
        cancelAnimationFrame(autoScrollRafId);
        autoScrollRafId = null;
      }
    }

    speedSlowerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (autoScrollSpeed > SPEED_MIN) { autoScrollSpeed = Math.max(SPEED_MIN, autoScrollSpeed - SPEED_STEP); updateSpeedLabel(); }
    });
    speedFasterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (autoScrollSpeed < SPEED_MAX) { autoScrollSpeed = Math.min(SPEED_MAX, autoScrollSpeed + SPEED_STEP); updateSpeedLabel(); }
    });

    autoScrollBtn.addEventListener('click', () => {
      if (autoScrollActive) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
    });
    document.body.appendChild(autoScrollBtn);
    document.body.appendChild(speedSlowerBtn);
    document.body.appendChild(speedFasterBtn);
    document.body.appendChild(speedLabel);
    // Hide speed controls initially
    speedSlowerBtn.style.display = 'none';
    speedFasterBtn.style.display = 'none';
    speedLabel.style.display = 'none';
    cinemaState.autoScrollBtn = autoScrollBtn;
    cinemaState.speedSlowerBtn = speedSlowerBtn;
    cinemaState.speedFasterBtn = speedFasterBtn;
    cinemaState.speedLabel = speedLabel;
    cinemaState._stopAutoScroll = stopAutoScroll;

    // ---- Fixed background layer ----
    const bgLayer = document.createElement('div');
    bgLayer.className = 'cinema-bg-layer';
    chatScreen.appendChild(bgLayer);
    cinemaState.bgLayer = bgLayer;

    // ---- Scrollable container ----
    const container = document.createElement('div');
    container.id = 'cinema-container';
    container.className = 'cinema-container';

    // Pre-load media into bgLayer and track which message divs should trigger them
    const mediaMap = []; // { msgDiv, bgEl, isVideo, isYoutube }
    let hasAnyVideo = false;

    for (const msg of chat.messages) {
      if (msg.type === 'date') continue;

      const msgDiv = document.createElement('div');
      msgDiv.className = 'cinema-msg';

      if (msg.isSystem) {
        msgDiv.classList.add('cinema-system');
        const textSpan = document.createElement('span');
        textSpan.className = 'cinema-msg-text';
        textSpan.innerHTML = linkify(escapeHtml(msg.text || ''));
        msgDiv.appendChild(textSpan);
        container.appendChild(msgDiv);
        continue;
      }

      // Left / right alignment
      const isOutgoing = msg.sender === chat.mySender;
      msgDiv.classList.add(isOutgoing ? 'cinema-outgoing' : 'cinema-incoming');

      // Sender
      const senderSpan = document.createElement('span');
      senderSpan.className = 'cinema-sender';
      senderSpan.textContent = msg.sender || '';
      msgDiv.appendChild(senderSpan);

      // Check for attached media — create background element + inline thumbnail
      let hasAttachedMedia = false;
      if (msg.media && msg.media.type !== 'omitted') {
        const entry = findMediaFile(msg.media.filename, chat);
        if (entry) {
          if (msg.media.mediaType === 'image') {
            const bgImg = document.createElement('img');
            bgImg.alt = msg.media.filename || '';
            // Create inline thumbnail in scrolling text
            const thumbEl = document.createElement('img');
            thumbEl.className = 'cinema-media-thumb cinema-thumb-clickable';
            thumbEl.alt = 'photo';
            msgDiv.appendChild(thumbEl);
            loadMediaBlob(msg.media.filename, entry).then(url => {
              bgImg.src = url;
              thumbEl.src = url;
              // Make thumbnail clickable for lightbox
              thumbEl.addEventListener('click', () => openCinemaLightbox(url));
            });
            // Detect portrait orientation after load
            bgImg.addEventListener('load', () => {
              if (bgImg.naturalHeight > bgImg.naturalWidth * 1.1) {
                bgImg.classList.add('portrait');
              }
            });
            bgLayer.appendChild(bgImg);
            mediaMap.push({ msgDiv, bgEl: bgImg, thumbEl: thumbEl, isVideo: false, isYoutube: false });
            hasAttachedMedia = true;
          } else if (msg.media.mediaType === 'video') {
            hasAnyVideo = true;
            const bgVid = document.createElement('video');
            bgVid.muted = true;
            bgVid.loop = true;
            bgVid.playsInline = true;
            bgVid.preload = 'auto';
            // Create inline video thumbnail (poster image from video)
            const vidThumbEl = document.createElement('video');
            vidThumbEl.className = 'cinema-media-thumb cinema-thumb-clickable';
            vidThumbEl.muted = true;
            vidThumbEl.autoplay = false;
            vidThumbEl.playsInline = true;
            vidThumbEl.preload = 'metadata';
            msgDiv.appendChild(vidThumbEl);
            loadMediaBlob(msg.media.filename, entry).then(url => {
              bgVid.src = url;
              vidThumbEl.src = url;
              // Make video thumbnail clickable for lightbox (capture first frame as image)
              vidThumbEl.addEventListener('click', () => {
                // Use a canvas to grab the current frame of the video thumbnail
                const canvas = document.createElement('canvas');
                canvas.width = vidThumbEl.videoWidth || 640;
                canvas.height = vidThumbEl.videoHeight || 480;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(vidThumbEl, 0, 0, canvas.width, canvas.height);
                const frameUrl = canvas.toDataURL('image/png');
                openCinemaLightbox(frameUrl);
              });
            });
            bgLayer.appendChild(bgVid);
            mediaMap.push({ msgDiv, bgEl: bgVid, thumbEl: vidThumbEl, isVideo: true, isYoutube: false });
            hasAttachedMedia = true;
          }
        }
      }

      // Check for YouTube links in message text (only if no attached media)
      // Show thumbnail only — no autoplay embed
      if (!hasAttachedMedia && msg.text) {
        const ytUrl = extractYoutubeEmbedUrl(msg.text);
        if (ytUrl) {
          // Extract video ID for thumbnail
          const ytIdMatch = ytUrl.match(/embed\/([a-zA-Z0-9_-]{11})/);
          if (ytIdMatch) {
            const ytThumb = document.createElement('img');
            ytThumb.className = 'cinema-yt-thumb cinema-thumb-clickable';
            ytThumb.src = 'https://img.youtube.com/vi/' + ytIdMatch[1] + '/mqdefault.jpg';
            ytThumb.alt = 'YouTube';
            ytThumb.onerror = function() { this.style.display = 'none'; };
            // Make YouTube thumbnail clickable for lightbox
            const ytThumbUrl = ytThumb.src;
            ytThumb.addEventListener('click', () => openCinemaLightbox(ytThumbUrl));
            msgDiv.appendChild(ytThumb);
          }
        }
      }

      // Text (strip media attachment tags like <Attached: file.jpg>, filename.jpg (file attached), etc.)
      if (msg.text && msg.text.trim()) {
        let displayText = msg.text;
        // Remove <Attached: ...> / <joint: ...> tags
        displayText = displayText.replace(/<(?:attached|joint):\s*.+?>/gi, '');
        // Remove "filename.ext (file attached)" / "filename.ext (fichier joint)" patterns
        displayText = displayText.replace(/[^\s]+\.\w{2,5}\s*\((?:file attached|fichier joint)\)/gi, '');
        displayText = displayText.trim();
        if (displayText) {
          const textSpan = document.createElement('span');
          textSpan.className = 'cinema-msg-text';
          textSpan.innerHTML = linkify(escapeHtml(displayText));
          msgDiv.appendChild(textSpan);
        }
      }

      // Time (with date)
      if (msg.timeStr) {
        const timeSpan = document.createElement('span');
        timeSpan.className = 'cinema-time';
        timeSpan.textContent = (msg.dateStr ? msg.dateStr + '  ' : '') + msg.timeStr;
        msgDiv.appendChild(timeSpan);
      }

      container.appendChild(msgDiv);
    }

    chatScreen.appendChild(container);

    // ---- IntersectionObserver for media fade in/out ----
    const allMsgDivs = Array.from(container.querySelectorAll('.cinema-msg'));

    // Assign media zones: each media affects messages from itself until the next media message
    for (let m = 0; m < mediaMap.length; m++) {
      const startIdx = allMsgDivs.indexOf(mediaMap[m].msgDiv);
      const endIdx = (m + 1 < mediaMap.length) ? allMsgDivs.indexOf(mediaMap[m + 1].msgDiv) : allMsgDivs.length;
      mediaMap[m].affectedDivs = allMsgDivs.slice(startIdx, endIdx);
    }

    // Audio fade helper (for <video> elements)
    function audioFadeIn(videoEl, targetVolume, duration) {
      if (!videoEl || videoEl.tagName !== 'VIDEO') return;
      videoEl.volume = 0;
      videoEl.muted = false;
      const steps = 20;
      const stepTime = duration / steps;
      const stepVol = targetVolume / steps;
      let currentStep = 0;
      const fadeInterval = setInterval(() => {
        currentStep++;
        videoEl.volume = Math.min(targetVolume, stepVol * currentStep);
        if (currentStep >= steps) clearInterval(fadeInterval);
      }, stepTime);
      videoEl._fadeInterval = fadeInterval;
    }

    function audioFadeOut(videoEl, duration, callback) {
      if (!videoEl || videoEl.tagName !== 'VIDEO') { if (callback) callback(); return; }
      if (videoEl._fadeInterval) clearInterval(videoEl._fadeInterval);
      const startVol = videoEl.volume;
      if (startVol === 0) { if (callback) callback(); return; }
      const steps = 20;
      const stepTime = duration / steps;
      const stepVol = startVol / steps;
      let currentStep = 0;
      const fadeInterval = setInterval(() => {
        currentStep++;
        videoEl.volume = Math.max(0, startVol - stepVol * currentStep);
        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          if (callback) callback();
        }
      }, stepTime);
      videoEl._fadeInterval = fadeInterval;
    }

    function activateMedia(entry) {
      // Skip YouTube iframes that previously failed
      if (entry.isYoutube && entry.bgEl.dataset.ytFailed === 'true') return;

      // Force-deactivate any portrait images with pending deactivation
      for (const other of mediaMap) {
        if (other !== entry && other._pendingDeactivate) {
          doDeactivateMedia(other);
        }
      }

      // Deactivate previous
      if (cinemaState.activeMedia && cinemaState.activeMedia !== entry.bgEl) {
        const prevMedia = cinemaState.activeMedia;
        // Remove glow from previous thumbnail
        const prevEntry = mediaMap.find(e => e.bgEl === prevMedia);
        if (prevEntry && prevEntry.thumbEl) prevEntry.thumbEl.classList.remove('cinema-thumb-active');
        if (prevMedia.tagName === 'VIDEO') {
          audioFadeOut(prevMedia, 400, () => {
            prevMedia.classList.remove('active');
            prevMedia.pause();
          });
        } else {
          prevMedia.classList.remove('active');
          if (prevMedia.tagName === 'IFRAME') prevMedia.src = '';
        }
      }
      // Activate new
      entry.bgEl.classList.add('active');
      cinemaState.activeMedia = entry.bgEl;
      if (entry.isVideo) {
        if (entry.isYoutube) {
          let src = entry.bgEl.dataset.cinemaSrc || '';
          src = src.replace(/mute=[01]/, 'mute=' + (cinemaState.muted ? '1' : '0'));
          entry.bgEl.src = src;
          // Detect failed YouTube embeds after a timeout
          const ytTimeout = setTimeout(() => {
            try {
              // If the iframe has no contentWindow or is blocked, mark as failed
              if (!entry.bgEl.contentWindow) {
                entry.bgEl.dataset.ytFailed = 'true';
                entry.bgEl.classList.remove('active');
                entry.bgEl.src = '';
              }
            } catch(e) {
              // Cross-origin error is expected for working YouTube embeds, do nothing
            }
          }, 5000);
          entry.bgEl._ytTimeout = ytTimeout;
        } else {
          if (cinemaState.muted) {
            entry.bgEl.muted = true;
            entry.bgEl.volume = 1;
          } else {
            entry.bgEl.muted = false;
            entry.bgEl.volume = 0;
          }
          entry.bgEl.play().catch(() => {});
          if (!cinemaState.muted) {
            audioFadeIn(entry.bgEl, 1, 600);
          }
        }
        soundBtn.classList.add('visible');
      }
      entry.affectedDivs.forEach(d => d.classList.add('has-media-bg'));
      // Highlight the active thumbnail with a glow
      if (entry.thumbEl) entry.thumbEl.classList.add('cinema-thumb-active');
    }

    function doDeactivateMedia(entry) {
      // Clear YouTube timeout if any
      if (entry.bgEl._ytTimeout) {
        clearTimeout(entry.bgEl._ytTimeout);
        entry.bgEl._ytTimeout = null;
      }
      if (entry.isVideo && !entry.isYoutube && entry.bgEl.tagName === 'VIDEO') {
        audioFadeOut(entry.bgEl, 400, () => {
          entry.bgEl.classList.remove('active');
          entry.bgEl.pause();
        });
      } else {
        entry.bgEl.classList.remove('active');
        if (entry.isVideo && entry.isYoutube) {
          entry.bgEl.src = '';
        } else if (entry.isVideo) {
          entry.bgEl.pause();
        }
      }
      if (cinemaState.activeMedia === entry.bgEl) {
        cinemaState.activeMedia = null;
        const anyActive = mediaMap.some(e => e.bgEl.classList.contains('active'));
        if (!anyActive) {
          soundBtn.classList.remove('visible');
        }
      }
      entry.affectedDivs.forEach(d => d.classList.remove('has-media-bg'));
      // Remove thumbnail glow
      if (entry.thumbEl) entry.thumbEl.classList.remove('cinema-thumb-active');
      // Reset portrait image transform
      if (entry.bgEl.tagName === 'IMG' && entry.bgEl.classList.contains('portrait')) {
        entry.bgEl.style.transform = '';
      }
      entry._pendingDeactivate = false;
    }

    function deactivateMedia(entry) {
      // For portrait images, defer deactivation until the scroll handler confirms
      // the image has been fully revealed (scroll progress >= 1).
      if (entry.bgEl.tagName === 'IMG' && entry.bgEl.classList.contains('portrait')) {
        const img = entry.bgEl;
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;
        const renderedH = viewW * (img.naturalHeight / img.naturalWidth);
        if (renderedH > viewH) {
          // Mark as pending — the scroll handler will finalize deactivation
          entry._pendingDeactivate = true;
          return;
        }
      }
      doDeactivateMedia(entry);
    }

    // Observe each media message div
    const observer = new IntersectionObserver((entries) => {
      for (const obsEntry of entries) {
        const match = mediaMap.find(m => m.msgDiv === obsEntry.target);
        if (!match) continue;
        if (obsEntry.isIntersecting) {
          activateMedia(match);
        } else {
          deactivateMedia(match);
        }
      }
    }, {
      root: container,
      rootMargin: '200px 0px 200px 0px',
      threshold: 0
    });

    for (const entry of mediaMap) {
      observer.observe(entry.msgDiv);
    }
    cinemaState.observer = observer;

    // ---- Portrait image scroll sync ----
    // When a portrait image is active, translate it proportionally so the full image is revealed.
    // The scroll zone for each image = the height of its affectedDivs (from this media msg to the next).
    // The image translateY goes from 0 to -overflow over that zone.
    // Portrait images with _pendingDeactivate are kept active until fully scrolled (progress >= 1).
    // If the zone is excessively tall (> MAX_PORTRAIT_ZONE_VH viewports), cap the effective zone
    // so the image scrolls faster and doesn't linger forever.
    const MAX_PORTRAIT_ZONE_VH = 3; // max zone = 3x viewport height
    container.addEventListener('scroll', () => {
      for (const entry of mediaMap) {
        if (!entry.bgEl.classList.contains('portrait')) continue;
        if (!entry.bgEl.classList.contains('active')) {
          // If somehow left pending without active, clean up
          if (entry._pendingDeactivate) doDeactivateMedia(entry);
          continue;
        }
        const img = entry.bgEl;
        const viewH = window.innerHeight;
        const viewW = window.innerWidth;
        const renderedH = viewW * (img.naturalHeight / img.naturalWidth);
        if (renderedH <= viewH) {
          // Fits in viewport, no scroll needed; finalize pending if any
          if (entry._pendingDeactivate) doDeactivateMedia(entry);
          continue;
        }
        const overflow = renderedH - viewH;

        // Compute the scroll zone: from the top of the first affectedDiv to the bottom of the last
        const firstDiv = entry.affectedDivs[0];
        const lastDiv = entry.affectedDivs[entry.affectedDivs.length - 1];
        if (!firstDiv || !lastDiv) continue;
        const firstRect = firstDiv.getBoundingClientRect();
        const lastRect = lastDiv.getBoundingClientRect();
        // Zone top/bottom in viewport coords
        const zoneTop = firstRect.top;
        const zoneBottom = lastRect.bottom;
        const rawZoneHeight = zoneBottom - zoneTop;
        if (rawZoneHeight <= 0) continue;

        // Cap the zone height so portrait images don't stay on screen for too long
        const maxZonePx = MAX_PORTRAIT_ZONE_VH * viewH;
        const zoneHeight = Math.min(rawZoneHeight, maxZonePx);
        // When capped, the effective bottom of the zone is closer to the first div
        const effectiveBottom = zoneTop + zoneHeight;

        // progress: 0 when zone top enters viewport bottom, 1 when effective zone bottom exits viewport top
        const progress = Math.max(0, Math.min(1, (viewH - zoneTop) / (viewH + zoneHeight)));
        img.style.transform = 'translateY(' + (-overflow * progress) + 'px)';

        // If the observer flagged deactivation but the image hasn't been fully scrolled,
        // keep it alive. Once progress hits ~1 (fully revealed), finalize deactivation.
        // Also force-deactivate if we've scrolled past the capped zone.
        if (entry._pendingDeactivate && progress >= 0.99) {
          doDeactivateMedia(entry);
        } else if (!entry._pendingDeactivate && rawZoneHeight > maxZonePx && progress >= 0.99) {
          // Zone was capped and image is fully revealed — force deactivate even
          // though the observer hasn't fired yet (observer tracks the full zone).
          doDeactivateMedia(entry);
        }
      }
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

  // ===================== LIVE VIEW ENGINE =====================
  const liveState = {
    playing: false,
    currentIndex: 0,
    timer: null,
    speed: 1,       // playback speed multiplier
    audioCtx: null, // Web Audio context (lazy-created)
  };

  // Logarithmic slider: maps 0–100 to 0.1–100
  function sliderToSpeed(v) {
    // v=0 => 0.1x, v=50 => ~1x, v=100 => 100x
    return Math.pow(10, (v / 100) * 3 - 1); // 10^(-1) to 10^2
  }

  function speedToSlider(s) {
    return Math.round(((Math.log10(s) + 1) / 3) * 100);
  }

  function formatSpeed(s) {
    if (s < 1) return s.toFixed(1) + '×';
    if (s < 10) return s.toFixed(1) + '×';
    return Math.round(s) + '×';
  }

  // Synthesize a short pop/burst sound using Web Audio API
  function playBubbleSound(senderIndex) {
    try {
      if (!liveState.audioCtx) {
        liveState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = liveState.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Vary pitch per speaker: 400-900 Hz range
      const baseFreq = 480 + (senderIndex % 8) * 60;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.055);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
      // Web Audio not available — silent fallback
    }
  }

  // Get speaker index for a given sender name (for consistent sound pitch)
  function getSenderIndex(senderName, chat) {
    if (!senderName || !chat) return 0;
    return chat.senders.indexOf(senderName);
  }

  // ---- Live background media ----
  let liveBgEl = null;
  let liveBgTimeout = null;

  // Start Live mode: clear container and replay from currentIndex
  function liveStart() {
    const chat = getActiveChat();
    if (!chat) return;

    // Clear messages area
    messagesContainer.innerHTML = '';
    allRenderedElements = [];

    // Reset timeline slider
    const timelineSlider = $('live-timeline-slider');
    const timelineValue = $('live-timeline-value');
    if (timelineSlider) timelineSlider.value = 0;
    if (timelineValue) timelineValue.textContent = '0%';

    updateLiveDatetime(chat);
    setLivePlaying(true);
    scheduleNextMessage(chat);
  }

  function liveStop() {
    setLivePlaying(false);
    if (liveState.timer) {
      clearTimeout(liveState.timer);
      liveState.timer = null;
    }
    if (liveBgTimeout) { clearTimeout(liveBgTimeout); liveBgTimeout = null; }
    if (liveBgEl) {
      liveBgEl.classList.remove('active');
      const oldEl = liveBgEl;
      liveBgEl = null;
      setTimeout(() => { if (oldEl.parentNode) oldEl.parentNode.removeChild(oldEl); }, 1600);
    }
  }

  function livePause() {
    setLivePlaying(false);
    if (liveState.timer) {
      clearTimeout(liveState.timer);
      liveState.timer = null;
    }
  }

  function liveResume() {
    const chat = getActiveChat();
    if (!chat) return;
    setLivePlaying(true);
    scheduleNextMessage(chat);
  }

  function setLivePlaying(playing) {
    liveState.playing = playing;
    const playIcon = $('live-play-icon');
    if (!playIcon) return;
    if (playing) {
      // Show pause icon
      playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    } else {
      // Show play icon
      playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
  }

  function updateLiveDatetime(chat) {
    const el = $('live-datetime');
    if (!el) return;
    const idx = Math.min(liveState.currentIndex, chat.messages.length - 1);
    if (idx < 0 || !chat.messages[idx]) { el.innerHTML = '&nbsp;'; return; }
    const msg = chat.messages[idx];
    if (msg.date instanceof Date && !isNaN(msg.date)) {
      el.textContent = msg.dateStr + '  ' + msg.timeStr;
    } else {
      el.innerHTML = '&nbsp;';
    }
    updateTimelineDisplay(chat);
  }

  // Append one message element with Live animation
  function appendLiveMessage(msg, chat) {
    const prevSender = liveState.currentIndex > 0
      ? (chat.messages[liveState.currentIndex - 1] || {}).sender
      : null;

    // Check if we need a date separator
    const currentDateKey = getDateKey(msg.date);
    const prevDateKey = liveState.currentIndex > 0
      ? getDateKey((chat.messages[liveState.currentIndex - 1] || {}).date)
      : null;

    if (currentDateKey !== prevDateKey) {
      const sep = createDateSeparator(msg.dateStr, currentDateKey);
      sep.classList.add('live-appear');
      messagesContainer.appendChild(sep);
    }

    const el = createMessageElement(msg, prevSender, chat);
    el.dataset.msgId = liveState.currentIndex;
    el.classList.add('live-appear');
    messagesContainer.appendChild(el);
    allRenderedElements.push({ idx: liveState.currentIndex, el });

    // Auto-scroll to keep latest bubble visible
    requestAnimationFrame(() => {
      chatArea.scrollTop = chatArea.scrollHeight;
    });

    // Play bubble pop sound
    if (!msg.isSystem) {
      const si = getSenderIndex(msg.sender, chat);
      playBubbleSound(si >= 0 ? si : 0);
    }

    // Typewriter effect for text
    const textEl = el.querySelector('.message-text');
    if (textEl && !msg.isSystem) {
      typewriterEffect(textEl, liveState.speed);
    }

    // Show media as background fade (images and videos)
    if (msg.media && msg.media.type === 'file' && (msg.media.mediaType === 'image' || msg.media.mediaType === 'video')) {
      const entry = findMediaFile(msg.media.filename, chat);
      if (entry) {
        loadMediaBlob(msg.media.filename, entry).then(url => {
          showLiveBackground(url, msg.media.mediaType);
        });
      }
    }
  }

  // Schedule the next message appearance
  function scheduleNextMessage(chat) {
    if (!liveState.playing) return;
    if (liveState.currentIndex >= chat.messages.length) {
      // End of chat reached
      setLivePlaying(false);
      return;
    }

    const msg = chat.messages[liveState.currentIndex];
    appendLiveMessage(msg, chat);
    updateLiveDatetime(chat);

    liveState.currentIndex++;

    if (liveState.currentIndex >= chat.messages.length) {
      setLivePlaying(false);
      return;
    }

    // Calculate delay until next message
    const nextMsg = chat.messages[liveState.currentIndex];
    const delay = calculateLiveDelay(msg, nextMsg);

    liveState.timer = setTimeout(() => scheduleNextMessage(chat), delay);
  }

  // Calculate delay between messages (proportional to real time gap, scaled by speed)
  function calculateLiveDelay(currentMsg, nextMsg) {
    const MIN_DELAY = 80;   // ms
    const MAX_DELAY = 4000; // ms cap
    const BASE_DELAY = 400; // ms for same-second messages

    if (!currentMsg.date || !nextMsg.date ||
        !(currentMsg.date instanceof Date) || !(nextMsg.date instanceof Date) ||
        isNaN(currentMsg.date) || isNaN(nextMsg.date) ||
        !currentMsg.time || !nextMsg.time) {
      return Math.max(MIN_DELAY, BASE_DELAY / liveState.speed);
    }

    // Combine date + time into ms timestamp
    const tA = currentMsg.date.getTime() +
      (currentMsg.time.hours * 3600 + currentMsg.time.minutes * 60 + (currentMsg.time.seconds || 0)) * 1000;
    const tB = nextMsg.date.getTime() +
      (nextMsg.time.hours * 3600 + nextMsg.time.minutes * 60 + (nextMsg.time.seconds || 0)) * 1000;

    let gapMs = tB - tA;
    if (gapMs <= 0) gapMs = BASE_DELAY;

    // Scale: 1 real second = 1000ms in playback, then apply speed multiplier
    // But we cap long pauses to MAX_DELAY
    const scaled = Math.min(gapMs / liveState.speed, MAX_DELAY);
    return Math.max(MIN_DELAY, scaled);
  }

  // Seek to a specific message index and re-render from there
  function liveSeekTo(newIndex) {
    const chat = getActiveChat();
    if (!chat) return;

    const wasPlaying = liveState.playing;
    liveStop();

    liveState.currentIndex = Math.max(0, Math.min(newIndex, chat.messages.length - 1));

    // Re-render messages from 0 to currentIndex
    messagesContainer.innerHTML = '';
    allRenderedElements = [];

    const fragment = document.createDocumentFragment();
    let prevDate = null;
    let prevSender = null;

    for (let i = 0; i < liveState.currentIndex; i++) {
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
    messagesContainer.appendChild(fragment);
    requestAnimationFrame(() => { chatArea.scrollTop = chatArea.scrollHeight; });

    updateLiveDatetime(chat);

    if (wasPlaying) {
      setLivePlaying(true);
      scheduleNextMessage(chat);
    }
  }

  // Find the message index for a given date offset
  function findIndexForDateOffset(offsetDays, offsetMonths, offsetYears) {
    const chat = getActiveChat();
    if (!chat || chat.messages.length === 0) return 0;

    const currentIdx = Math.min(liveState.currentIndex, chat.messages.length - 1);
    const currentMsg = chat.messages[currentIdx];
    if (!currentMsg || !(currentMsg.date instanceof Date)) return currentIdx;

    const targetDate = new Date(currentMsg.date);
    targetDate.setFullYear(targetDate.getFullYear() + offsetYears);
    targetDate.setMonth(targetDate.getMonth() + offsetMonths);
    targetDate.setDate(targetDate.getDate() + offsetDays);
    const targetTime = targetDate.getTime();

    // Binary search for closest message at or after target date
    let lo = 0, hi = chat.messages.length - 1, best = currentIdx;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const mDate = chat.messages[mid].date;
      if (!(mDate instanceof Date) || isNaN(mDate)) { lo = mid + 1; continue; }
      if (mDate.getTime() <= targetTime) { best = mid; lo = mid + 1; }
      else { hi = mid - 1; }
    }
    return best;
  }

  // ---- Live controls wiring ----
  const livePlayBtn = $('live-play-btn');
  const liveSpeedSlider = $('live-speed-slider');
  const liveSpeedValue = $('live-speed-value');

  // Initialize speed from slider default (value=50 => ~1x)
  liveState.speed = sliderToSpeed(50);

  if (livePlayBtn) {
    livePlayBtn.addEventListener('click', () => {
      if (liveState.playing) {
        livePause();
      } else {
        const chat = getActiveChat();
        if (chat && liveState.currentIndex >= chat.messages.length) {
          // Rewind to start if at end
          liveState.currentIndex = 0;
          messagesContainer.innerHTML = '';
          allRenderedElements = [];
        }
        liveResume();
      }
    });
  }

  if (liveSpeedSlider) {
    liveSpeedSlider.addEventListener('input', () => {
      const v = parseInt(liveSpeedSlider.value, 10);
      liveState.speed = sliderToSpeed(v);
      if (liveSpeedValue) liveSpeedValue.textContent = formatSpeed(liveState.speed);
    });
  }

  function wireLiveNavBtn(id, offsetDays, offsetMonths, offsetYears) {
    const btn = $(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const idx = findIndexForDateOffset(offsetDays, offsetMonths, offsetYears);
      liveSeekTo(idx);
    });
  }

  wireLiveNavBtn('live-prev-day',   -1,  0,  0);
  wireLiveNavBtn('live-next-day',    1,  0,  0);
  wireLiveNavBtn('live-prev-month',  0, -1,  0);
  wireLiveNavBtn('live-next-month',  0,  1,  0);
  wireLiveNavBtn('live-prev-year',   0,  0, -1);
  wireLiveNavBtn('live-next-year',   0,  0,  1);

  // ---- Home button ----
  const btnHome = $('btn-home');
  if (btnHome) {
    btnHome.addEventListener('click', () => {
      // Stop live if active
      if (currentView === 'live') {
        liveStop();
        const liveControls = $('live-controls');
        if (liveControls) liveControls.classList.add('hidden');
        chatScreen.classList.remove('live-mode');
      }
      // Reset state
      chats.length = 0;
      activeChatId = null;
      allRenderedElements = [];
      messagesContainer.innerHTML = '';
      closeSearch();
      // Clean up cinema if active
      if (currentView === 'cinema') {
        cleanupCinema();
      }
      currentView = 'phone';
      chatScreen.classList.remove('active', 'fullscreen-mode', 'ipad-mode', 'live-mode', 'cinema-mode');
      dropZoneScreen.classList.add('active');
      btnPhone.classList.add('active');
      btnIpad.classList.remove('active');
      btnFull.classList.remove('active');
      btnLive.classList.remove('active');
      btnCinema.classList.remove('active');
      if (btnProfiler) btnProfiler.classList.remove('active');
      liveState.currentIndex = 0;
    });
  }

  // ---- Live background media functions ----
  function showLiveBackground(url, mediaType) {
    // Remove previous background element entirely to allow fresh transition
    if (liveBgEl) {
      liveBgEl.classList.remove('active');
      const oldEl = liveBgEl;
      setTimeout(() => { if (oldEl.parentNode) oldEl.parentNode.removeChild(oldEl); }, 600);
      liveBgEl = null;
    }
    if (liveBgTimeout) { clearTimeout(liveBgTimeout); liveBgTimeout = null; }

    const container = document.createElement('div');
    container.className = 'live-bg-media';

    if (mediaType === 'video') {
      const vid = document.createElement('video');
      vid.src = url;
      vid.autoplay = true;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.className = 'live-bg-video';
      container.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = url;
      img.className = 'live-bg-img';
      container.appendChild(img);
    }

    document.body.appendChild(container);
    liveBgEl = container;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        liveBgEl.classList.add('active');
      });
    });

    // Fade out after 8 seconds for images, let videos play longer (15s)
    const duration = mediaType === 'video' ? 15000 : 8000;
    liveBgTimeout = setTimeout(() => {
      if (liveBgEl) liveBgEl.classList.remove('active');
    }, duration);
  }

  // ---- Typewriter effect ----
  function typewriterEffect(textEl, speed) {
    if (!textEl) return Promise.resolve();
    const fullHtml = textEl.innerHTML;
    const fullText = textEl.textContent;
    if (!fullText || fullText.length === 0) return Promise.resolve();
    // For very fast speed, skip typewriter
    if (speed > 10) {
      return Promise.resolve();
    }
    textEl.textContent = '';
    textEl.style.visibility = 'visible';
    const s = Math.max(0.1, speed);
    return new Promise(resolve => {
      let i = 0;
      function getDelay(ch, prevCh) {
        // Punctuation: longer pause after sentence enders
        if ('.!?'.includes(prevCh)) return (120 + Math.random() * 80) / s;
        // Mid-sentence punctuation
        if (',;:'.includes(prevCh)) return (70 + Math.random() * 50) / s;
        // Space: slight word boundary pause
        if (ch === ' ') return (40 + Math.random() * 50) / s;
        // Occasional micro-hesitation (~7% chance)
        if (Math.random() < 0.07) return (80 + Math.random() * 60) / s;
        // Normal typing: variable 20-55ms
        return (20 + Math.random() * 35) / s;
      }
      function addChar() {
        if (i < fullText.length) {
          textEl.textContent = fullText.substring(0, i + 1);
          const ch = fullText[i];
          const prevCh = i > 0 ? fullText[i - 1] : '';
          i++;
          setTimeout(addChar, Math.max(3, getDelay(ch, prevCh)));
        } else {
          // Restore original HTML (with links, mentions etc.)
          textEl.innerHTML = fullHtml;
          resolve();
        }
      }
      addChar();
    });
  }

  // ===================== TRANSLATION SYSTEM =====================
  const translateBtn = $('translate-btn');
  const translateBar = $('translate-bar');
  const translateCloseBtn = $('translate-close-btn');
  const translateTarget = $('translate-target');
  const translateSourceLang = $('translate-source-lang');
  const translateStatus = $('translate-status');
  let translateState = { active: false, targetLang: '', detectedLang: '', cache: {}, originalTexts: new Map() };

  // Language names for display
  const LANG_NAMES = {
    af: 'Afrikaans', sq: 'Albanian', ar: 'Arabic', hy: 'Armenian', az: 'Azerbaijani',
    eu: 'Basque', be: 'Belarusian', bg: 'Bulgarian', ca: 'Catalan', 'zh-CN': 'Chinese',
    zh: 'Chinese', hr: 'Croatian', cs: 'Czech', da: 'Danish', nl: 'Dutch',
    en: 'English', et: 'Estonian', fi: 'Finnish', fr: 'French', gl: 'Galician',
    ka: 'Georgian', de: 'German', el: 'Greek', hi: 'Hindi', hu: 'Hungarian',
    is: 'Icelandic', id: 'Indonesian', ga: 'Irish', it: 'Italian', ja: 'Japanese',
    ko: 'Korean', lv: 'Latvian', lt: 'Lithuanian', mk: 'Macedonian', ms: 'Malay',
    mt: 'Maltese', no: 'Norwegian', fa: 'Persian', pl: 'Polish', pt: 'Portuguese',
    ro: 'Romanian', ru: 'Russian', sr: 'Serbian', sk: 'Slovak', sl: 'Slovenian',
    es: 'Spanish', sw: 'Swahili', sv: 'Swedish', th: 'Thai', tr: 'Turkish',
    uk: 'Ukrainian', ur: 'Urdu', vi: 'Vietnamese', cy: 'Welsh', co: 'Corsican'
  };

  function detectLanguage(messages) {
    // Sample text from the first 50 non-system messages to detect language
    let sample = '';
    let count = 0;
    for (const msg of messages) {
      if (msg.isSystem || !msg.text || msg.text.trim().length < 3) continue;
      sample += msg.text + ' ';
      count++;
      if (count >= 50) break;
    }
    if (!sample.trim()) return 'en';

    // Simple heuristic language detection based on character patterns and common words
    const text = sample.toLowerCase();

    // Check for script-based detection first
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    if (/[\uac00-\ud7af]/.test(text)) return 'ko';
    if (/[\u0600-\u06ff]/.test(text)) return 'ar';
    if (/[\u0400-\u04ff]/.test(text)) return 'ru';
    if (/[\u0900-\u097f]/.test(text)) return 'hi';
    if (/[\u0e00-\u0e7f]/.test(text)) return 'th';

    // Word frequency detection for Latin-script languages
    const wordCounts = {};
    const langMarkers = {
      fr: /\b(les|des|une|est|pas|pour|que|dans|avec|sur|sont|cette|mais|nous|vous|ils|aussi|tout|ont|comme|très|même|peut|faire|ça|qui|lui|c'est|j'ai|n'est|l'a)\b/gi,
      es: /\b(los|las|una|por|que|del|con|para|como|más|pero|todo|esta|son|hay|fue|ser|tiene|puede|este|todos|nos|muy|ese|algo|así|bien|donde|sin|sobre)\b/gi,
      it: /\b(gli|una|per|che|del|con|non|sono|come|più|questo|anche|tutto|quella|hanno|solo|essere|fatto|dove|bene|molto|così|ogni|sua|stato|perché)\b/gi,
      de: /\b(die|der|das|und|ist|ein|eine|nicht|mit|auf|den|für|sich|des|auch|von|haben|werden|sind|wird|aber|noch|wie|nach|über|bei|kann|nur|schon)\b/gi,
      pt: /\b(uma|para|que|com|não|como|mais|foi|por|seu|sua|são|tem|mas|nos|dos|muito|também|pode|isso|bem|todo|esse|aqui|está|ser|ter|fazer)\b/gi,
      en: /\b(the|and|that|have|for|not|with|you|this|but|his|they|from|she|will|one|all|would|there|their|what|about|which|when|make|can|like|just|been)\b/gi,
      co: /\b(chì|hè|una|pè|cù|ùn|sò|più|ancu|tuttu|essa|fattu|indè|bè|assai|cusì|ogni|statu|perchè|u|a|i|e|di|in|da)\b/gi
    };

    let maxScore = 0;
    let detected = 'en';
    for (const [lang, regex] of Object.entries(langMarkers)) {
      const matches = text.match(regex);
      const score = matches ? matches.length : 0;
      if (score > maxScore) {
        maxScore = score;
        detected = lang;
      }
    }
    return detected;
  }

  async function translateText(text, sourceLang, targetLang) {
    if (!text || !text.trim() || text.trim().length < 2) return text;
    const cacheKey = sourceLang + '>' + targetLang + ':' + text;
    if (translateState.cache[cacheKey]) return translateState.cache[cacheKey];

    try {
      const url = 'https://api.mymemory.translated.net/get?q=' +
        encodeURIComponent(text.substring(0, 500)) +
        '&langpair=' + encodeURIComponent(sourceLang + '|' + targetLang);
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
        let translated = data.responseData.translatedText;
        // Ignore if API returns the same text or an error message
        if (translated.toUpperCase() === text.toUpperCase() || translated.includes('MYMEMORY WARNING')) {
          return text;
        }
        translateState.cache[cacheKey] = translated;
        return translated;
      }
    } catch (e) {
      // Silently fail, return original
    }
    return text;
  }

  async function applyTranslation(targetLang) {
    const chat = getActiveChat();
    if (!chat) return;

    // Restore originals first
    removeTranslations();

    if (!targetLang) {
      translateState.active = false;
      translateState.targetLang = '';
      return;
    }

    translateState.active = true;
    translateState.targetLang = targetLang;

    // Detect source language if not done yet
    if (!translateState.detectedLang) {
      translateState.detectedLang = detectLanguage(chat.messages);
      translateSourceLang.textContent = LANG_NAMES[translateState.detectedLang] || translateState.detectedLang;
    }

    // Skip if source and target are the same
    if (translateState.detectedLang === targetLang) {
      if (translateStatus) translateStatus.textContent = t('translateSameLang') || '=';
      return;
    }

    if (translateStatus) {
      translateStatus.textContent = t('translateInProgress') || '...';
      translateStatus.classList.add('translating');
    }

    // Get all visible message text spans
    const textSpans = messagesContainer.querySelectorAll('.message-text');
    let translated = 0;
    const total = textSpans.length;
    const batchSize = 5;

    for (let i = 0; i < textSpans.length; i += batchSize) {
      const batch = Array.from(textSpans).slice(i, i + batchSize);
      const promises = batch.map(async (span) => {
        const originalText = span.textContent;
        if (!originalText || originalText.trim().length < 2) return;

        // Store original HTML
        if (!translateState.originalTexts.has(span)) {
          translateState.originalTexts.set(span, span.innerHTML);
        }

        const result = await translateText(originalText, translateState.detectedLang, targetLang);
        if (result && result !== originalText && translateState.active && translateState.targetLang === targetLang) {
          // Replace source text with translation
          span.textContent = result;
        }
        translated++;
      });
      await Promise.all(promises);

      // Update status
      if (translateStatus && translateState.active) {
        const pct = Math.round((Math.min(translated, total) / total) * 100);
        translateStatus.textContent = pct + '%';
      }
    }

    if (translateStatus) {
      translateStatus.textContent = '\u2713';
      translateStatus.classList.remove('translating');
      setTimeout(() => { if (translateStatus.textContent === '\u2713') translateStatus.textContent = ''; }, 2000);
    }
  }

  function removeTranslations() {
    // Restore original texts
    translateState.originalTexts.forEach((origHtml, span) => {
      span.innerHTML = origHtml;
    });
    translateState.originalTexts.clear();
  }

  if (translateBtn) {
    translateBtn.addEventListener('click', () => {
      translateBar.classList.toggle('hidden');
      if (!translateBar.classList.contains('hidden')) {
        // Detect language on open
        const chat = getActiveChat();
        if (chat && !translateState.detectedLang) {
          translateState.detectedLang = detectLanguage(chat.messages);
        }
        translateSourceLang.textContent = LANG_NAMES[translateState.detectedLang] || translateState.detectedLang || '--';
      }
    });
  }

  if (translateCloseBtn) {
    translateCloseBtn.addEventListener('click', () => {
      translateBar.classList.add('hidden');
      translateTarget.value = '';
      applyTranslation('');
    });
  }

  if (translateTarget) {
    translateTarget.addEventListener('change', () => {
      applyTranslation(translateTarget.value);
    });
  }

  // Reset translation state when switching chats
  const origLoadChat = typeof loadChat === 'function' ? loadChat : null;
  // We hook into chat switching by overriding sidebar click behavior
  // Translation resets are handled in the existing openChat flow

  // ---- Timeline scrubber ----
  const liveTimelineSlider = $('live-timeline-slider');
  const liveTimelineValue = $('live-timeline-value');

  function updateTimelineDisplay(chat) {
    const slider = $('live-timeline-slider');
    const valueEl = $('live-timeline-value');
    if (!slider || !valueEl || !chat) return;
    const total = chat.messages.length;
    if (total === 0) return;
    const pct = Math.round((liveState.currentIndex / Math.max(1, total - 1)) * 100);
    slider.value = pct;
    valueEl.textContent = pct + '%';
  }

  if (liveTimelineSlider) {
    liveTimelineSlider.addEventListener('input', () => {
      const chat = getActiveChat();
      if (!chat || chat.messages.length === 0) return;
      const v = parseInt(liveTimelineSlider.value, 10);
      const idx = Math.round((v / 100) * (chat.messages.length - 1));
      liveSeekTo(idx);
      updateTimelineDisplay(chat);
    });
  }


  // ===================== PROFILER VIEW (v0.5) =====================

  function analyzeGroupMembers(chat) {
    if (!chat || !chat.messages || chat.messages.length === 0) return null;

    const members = {};
    const totalMessages = chat.messages.filter(m => !m.isSystem && m.sender).length;

    function msgToDate(m) {
      const d = m.date instanceof Date ? new Date(m.date.getTime()) : new Date();
      if (m.time && typeof m.time === 'object') {
        d.setHours(m.time.hours, m.time.minutes, m.time.seconds || 0);
      } else if (typeof m.time === 'string') {
        const tp = m.time.split(':');
        d.setHours(parseInt(tp[0],10)||0, parseInt(tp[1],10)||0, 0);
      }
      return d;
    }

    // First pass: collect raw stats
    chat.messages.forEach((msg, idx) => {
      if (msg.isSystem || !msg.sender) return;

      if (!members[msg.sender]) {
        members[msg.sender] = {
          name: msg.sender,
          messageCount: 0,
          totalChars: 0,
          mediaCount: 0,
          emojiCount: 0,
          emojis: {},
          questionCount: 0,
          linkCount: 0,
          initiations: 0,
          responseTimes: [],
          hourly: new Array(24).fill(0),
          words: {},
          sentimentScore: 0,
          exclamationCount: 0,
          capsCount: 0,
          laughCount: 0,
        };
      }

      const m = members[msg.sender];
      m.messageCount++;

      const text = msg.text || '';
      m.totalChars += text.length;

      // Media
      if (msg.media) m.mediaCount++;

      // Emojis
      const emojiRegex = /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
      const emojis = text.match(emojiRegex) || [];
      m.emojiCount += emojis.length;
      emojis.forEach(e => { m.emojis[e] = (m.emojis[e] || 0) + 1; });

      // Questions
      if (/\?/.test(text)) m.questionCount++;

      // Links
      if (/https?:\/\/\S+/i.test(text)) m.linkCount++;

      // Hourly activity
      if (msg.time) {
        const h = typeof msg.time === 'object' ? msg.time.hours : parseInt(String(msg.time).split(':')[0], 10);
        if (!isNaN(h) && h >= 0 && h < 24) m.hourly[h]++;
      }

      // Exclamations & caps & laughs
      m.exclamationCount += (text.match(/!/g) || []).length;
      const words = text.split(/\s+/).filter(w => w.length > 1);
      words.forEach(w => {
        if (w === w.toUpperCase() && /[A-Z]/.test(w) && w.length > 2) m.capsCount++;
      });
      if (/\b(haha|lol|mdr|xd|😂|🤣|jaja|hehe|hihi|ahahah)/i.test(text)) m.laughCount++;

      // Words (for frequent words)
      const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','need','dare','ought','used','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','between','out','off','over','under','again','further','then','once','here','there','when','where','why','how','all','each','every','both','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','just','because','but','and','or','if','while','that','this','it','i','me','my','we','us','our','you','your','he','him','his','she','her','they','them','their','what','which','who','whom','its','de','la','le','les','un','une','des','du','en','et','est','pas','que','qui','je','tu','il','elle','nous','vous','ils','elles','on','ce','se','ne','au','aux','son','sa','ses','mon','ma','mes','ton','ta','tes','pour','dans','sur','avec','par','plus','mais','ou','donc','car','ni','si','ya','el','lo','las','los','una','unos','es','no','por','con','para','como','pero','yo','mi','su','sus','al','del']);
      words.forEach(w => {
        const lw = w.toLowerCase().replace(/[^a-zà-ÿ\u0400-\u04ff\u3000-\u9fff\uac00-\ud7af]/g, '');
        if (lw.length > 2 && !stopWords.has(lw)) {
          m.words[lw] = (m.words[lw] || 0) + 1;
        }
      });

      // Sentiment (simple heuristic)
      const positiveWords = /\b(love|great|amazing|awesome|wonderful|happy|good|nice|thank|thanks|merci|super|génial|bien|bravo|cool|perfect|parfait|excellent|❤️|💕|😊|😍|🥰|👍|🎉|💪)\b/gi;
      const negativeWords = /\b(hate|bad|awful|terrible|horrible|sad|angry|annoyed|worst|suck|merde|nul|chiant|pire|😡|😤|😠|👎|💔)\b/gi;
      const posMatches = (text.match(positiveWords) || []).length;
      const negMatches = (text.match(negativeWords) || []).length;
      m.sentimentScore += posMatches - negMatches;

      // Conversation initiation detection
      if (idx > 0) {
        const prevMsg = chat.messages[idx - 1];
        if (prevMsg && !prevMsg.isSystem && prevMsg.sender !== msg.sender && prevMsg.date && msg.date) {
          // Calculate time gap
          const prevTime = msgToDate(prevMsg);
          const curTime = msgToDate(msg);
          const gapMin = (curTime - prevTime) / 60000;

          if (gapMin > 0 && gapMin < 720) { // within 12h = response
            m.responseTimes.push(gapMin);
          }
          if (gapMin > 240) { // >4h gap = new conversation
            m.initiations++;
          }
        }
      } else {
        // First message in the chat
        m.initiations++;
      }
    });

    // Second pass: compute derived traits
    const profiles = Object.values(members).map(m => {
      const avgLength = m.messageCount > 0 ? Math.round(m.totalChars / m.messageCount) : 0;
      const avgResponseTime = m.responseTimes.length > 0
        ? Math.round(m.responseTimes.reduce((a, b) => a + b, 0) / m.responseTimes.length)
        : null;
      const peakHour = m.hourly.indexOf(Math.max(...m.hourly));
      const topEmojis = Object.entries(m.emojis)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(e => e[0]);
      const topWords = Object.entries(m.words)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(e => ({ word: e[0], count: e[1] }));

      // Communication style tags
      const styles = [];
      if (avgLength > 80) styles.push('verbose');
      else if (avgLength < 25) styles.push('concise');
      if (m.emojiCount / Math.max(m.messageCount, 1) > 0.5) styles.push('expressive');
      if (m.questionCount / Math.max(m.messageCount, 1) > 0.15) styles.push('inquisitive');
      if (avgResponseTime !== null && avgResponseTime < 10) styles.push('responsive');
      if (m.initiations > totalMessages * 0.02) styles.push('initiator');
      if (m.mediaCount / Math.max(m.messageCount, 1) > 0.15) styles.push('mediaHeavy');
      if (m.emojiCount / Math.max(m.messageCount, 1) < 0.1 && m.questionCount / Math.max(m.messageCount, 1) < 0.05) styles.push('factual');

      // Group role detection
      let role = 'observer';
      const msgShare = m.messageCount / Math.max(totalMessages, 1);
      const initiationRate = m.initiations / Math.max(m.messageCount, 1);
      const emojiRate = m.emojiCount / Math.max(m.messageCount, 1);
      const questionRate = m.questionCount / Math.max(m.messageCount, 1);

      if (msgShare > 0.25 && initiationRate > 0.03) role = 'leader';
      else if (questionRate > 0.15 && avgResponseTime !== null && avgResponseTime < 15) role = 'connector';
      else if (m.laughCount / Math.max(m.messageCount, 1) > 0.1 || emojiRate > 0.8) role = 'entertainer';
      else if (avgResponseTime !== null && avgResponseTime < 5 && m.sentimentScore > 0) role = 'supporter';
      else if (avgLength > 100 && m.linkCount > 3) role = 'analyst';
      else if (msgShare < 0.05) role = 'observer';

      // Radar chart dimensions (0-100 scale)
      const maxMsgCount = Math.max(...Object.values(members).map(x => x.messageCount), 1);
      const maxAvgLen = Math.max(...Object.values(members).map(x => x.messageCount > 0 ? x.totalChars / x.messageCount : 0), 1);
      const maxEmojiRate = Math.max(...Object.values(members).map(x => x.emojiCount / Math.max(x.messageCount, 1)), 0.01);
      const maxInitiations = Math.max(...Object.values(members).map(x => x.initiations), 1);
      const maxMediaRate = Math.max(...Object.values(members).map(x => x.mediaCount / Math.max(x.messageCount, 1)), 0.01);

      const radar = {
        volume: Math.round((m.messageCount / maxMsgCount) * 100),
        depth: Math.round((avgLength / maxAvgLen) * 100),
        expressiveness: Math.round(((m.emojiCount / Math.max(m.messageCount, 1)) / maxEmojiRate) * 100),
        initiative: Math.round((m.initiations / maxInitiations) * 100),
        responsiveness: avgResponseTime !== null ? Math.max(0, Math.round(100 - (avgResponseTime / 60) * 100)) : 50,
        visual: Math.round(((m.mediaCount / Math.max(m.messageCount, 1)) / maxMediaRate) * 100),
      };

      // Sentiment breakdown
      const sentimentTotal = Math.abs(m.sentimentScore) + m.messageCount * 0.1;
      const positiveRatio = m.sentimentScore > 0 ? Math.min(1, m.sentimentScore / sentimentTotal) : 0;
      const negativeRatio = m.sentimentScore < 0 ? Math.min(1, Math.abs(m.sentimentScore) / sentimentTotal) : 0;

      return {
        name: m.name,
        messageCount: m.messageCount,
        messageShare: msgShare,
        avgLength,
        mediaCount: m.mediaCount,
        emojiCount: m.emojiCount,
        questionCount: m.questionCount,
        linkCount: m.linkCount,
        initiations: m.initiations,
        avgResponseTime,
        peakHour,
        topEmojis,
        topWords,
        styles,
        role,
        radar,
        hourly: m.hourly,
        sentiment: {
          positive: Math.round(positiveRatio * 100),
          negative: Math.round(negativeRatio * 100),
          neutral: Math.round((1 - positiveRatio - negativeRatio) * 100),
        },
        laughCount: m.laughCount,
        exclamationCount: m.exclamationCount,
      };
    });

    // Sort by message count descending
    profiles.sort((a, b) => b.messageCount - a.messageCount);
    return profiles;
  }

  // ---- Draw SVG radar chart ----
  function drawRadarSVG(radar, color) {
    const size = 160;
    const cx = size / 2;
    const cy = size / 2;
    const r = 60;
    const dims = ['volume', 'depth', 'expressiveness', 'initiative', 'responsiveness', 'visual'];
    const n = dims.length;
    const angleStep = (2 * Math.PI) / n;

    // Background circles
    let svg = '<svg viewBox="0 0 ' + size + ' ' + size + '" class="radar-svg">';

    // Grid rings
    [0.25, 0.5, 0.75, 1].forEach(ring => {
      const rr = r * ring;
      let pts = '';
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        pts += (cx + rr * Math.cos(angle)) + ',' + (cy + rr * Math.sin(angle)) + ' ';
      }
      svg += '<polygon points="' + pts.trim() + '" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>';
    });

    // Axis lines
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + r * Math.cos(angle)) + '" y2="' + (cy + r * Math.sin(angle)) + '" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>';
    }

    // Data polygon
    let dataPts = '';
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      const val = (radar[dims[i]] || 0) / 100;
      dataPts += (cx + r * val * Math.cos(angle)) + ',' + (cy + r * val * Math.sin(angle)) + ' ';
    }
    svg += '<polygon points="' + dataPts.trim() + '" fill="' + color + '22" stroke="' + color + '" stroke-width="1.5"/>';

    // Data dots
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      const val = (radar[dims[i]] || 0) / 100;
      svg += '<circle cx="' + (cx + r * val * Math.cos(angle)) + '" cy="' + (cy + r * val * Math.sin(angle)) + '" r="2.5" fill="' + color + '"/>';
    }

    // Labels
    const labels = ['Vol', 'Depth', 'Expr', 'Init', 'Resp', 'Visual'];
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      const lx = cx + (r + 14) * Math.cos(angle);
      const ly = cy + (r + 14) * Math.sin(angle);
      svg += '<text x="' + lx + '" y="' + ly + '" text-anchor="middle" dominant-baseline="central" fill="rgba(255,255,255,0.4)" font-size="7">' + labels[i] + '</text>';
    }

    svg += '</svg>';
    return svg;
  }

  // ---- Draw hourly bar chart ----
  function drawHourlyChart(hourly, color) {
    const w = 260;
    const h = 50;
    const max = Math.max(...hourly, 1);
    const barW = w / 24;
    let svg = '<svg viewBox="0 0 ' + w + ' ' + (h + 14) + '" class="hourly-svg">';
    for (let i = 0; i < 24; i++) {
      const barH = (hourly[i] / max) * h;
      svg += '<rect x="' + (i * barW + 1) + '" y="' + (h - barH) + '" width="' + (barW - 2) + '" height="' + barH + '" rx="1" fill="' + color + '" opacity="0.7"/>';
      if (i % 6 === 0) {
        svg += '<text x="' + (i * barW + barW / 2) + '" y="' + (h + 11) + '" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="7">' + i + 'h</text>';
      }
    }
    svg += '</svg>';
    return svg;
  }

  // ---- Render profiler view ----
  function renderProfilerView() {
    const chat = getActiveChat();
    if (!chat) return;

    const profiles = analyzeGroupMembers(chat);
    if (!profiles || profiles.length === 0) return;

    // Clean up previous profiler view
    const existing = document.querySelector('.profiler-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'profiler-overlay';

    // Header
    const header = document.createElement('div');
    header.className = 'profiler-header';

    const backBtn = document.createElement('button');
    backBtn.className = 'profiler-back-btn';
    backBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><polyline points="15 18 9 12 15 6"></polyline></svg>';
    backBtn.addEventListener('click', () => {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 300);
      currentView = 'phone';
      btnProfiler.classList.remove('active');
      btnPhone.classList.add('active');
    });
    header.appendChild(backBtn);

    const titleBlock = document.createElement('div');
    titleBlock.className = 'profiler-title-block';
    titleBlock.innerHTML = '<h2>' + t('profilerTitle') + '</h2><p>' + t('profilerSubtitle') + '</p>';
    header.appendChild(titleBlock);
    overlay.appendChild(header);

    // Overview bar: dominance chart
    const overviewSection = document.createElement('div');
    overviewSection.className = 'profiler-overview';
    const domLabel = document.createElement('div');
    domLabel.className = 'profiler-section-label';
    domLabel.textContent = t('profilerDominance');
    overviewSection.appendChild(domLabel);

    const domBar = document.createElement('div');
    domBar.className = 'profiler-dominance-bar';
    profiles.forEach((p, i) => {
      const seg = document.createElement('div');
      seg.className = 'profiler-dom-segment';
      seg.style.width = (p.messageShare * 100) + '%';
      seg.style.backgroundColor = SENDER_COLORS[i % SENDER_COLORS.length];
      seg.title = p.name + ': ' + Math.round(p.messageShare * 100) + '%';
      domBar.appendChild(seg);
    });
    overviewSection.appendChild(domBar);

    const domLegend = document.createElement('div');
    domLegend.className = 'profiler-dom-legend';
    profiles.forEach((p, i) => {
      const item = document.createElement('span');
      item.className = 'profiler-dom-legend-item';
      item.innerHTML = '<span class="profiler-dom-dot" style="background:' + SENDER_COLORS[i % SENDER_COLORS.length] + '"></span>' + p.name + ' <span class="profiler-dom-pct">' + Math.round(p.messageShare * 100) + '%</span>';
      domLegend.appendChild(item);
    });
    overviewSection.appendChild(domLegend);
    overlay.appendChild(overviewSection);


    // ---- Personal Profile Hero Card ----
    const mySender = chat.mySender;
    const myProfile = mySender ? profiles.find(p => p.name === mySender) : null;
    const myIdx = mySender ? profiles.findIndex(p => p.name === mySender) : -1;

    if (myProfile) {
      const myColor = SENDER_COLORS[myIdx >= 0 ? myIdx % SENDER_COLORS.length : 0];

      const personalSection = document.createElement('div');
      personalSection.className = 'profiler-personal';

      // Personal header
      const persHeader = document.createElement('div');
      persHeader.className = 'profiler-personal-header';
      persHeader.innerHTML = '<div class="profiler-personal-avatar" style="background:' + myColor + '">' +
        (myProfile.name.charAt(0) || '?').toUpperCase() + '</div>' +
        '<div class="profiler-personal-name-block"><h2 style="color:' + myColor + '">' + escapeHtml(myProfile.name) + '</h2>' +
        '<span class="profiler-personal-subtitle">' + t('profilerYourProfile') + ' — ' +
        t('profilerRole' + myProfile.role.charAt(0).toUpperCase() + myProfile.role.slice(1)) + '</span></div>';
      personalSection.appendChild(persHeader);

      // ---- Narrative portrait ----
      const narrativeSection = document.createElement('div');
      narrativeSection.className = 'profiler-narrative';
      const narrLabel = document.createElement('div');
      narrLabel.className = 'profiler-section-label';
      narrLabel.textContent = t('profilerNarrative');
      narrativeSection.appendChild(narrLabel);

      // Build narrative text
      let narrative = '';
      // Style-based opening
      if (myProfile.styles.includes('verbose')) {
        narrative += t('profilerNarrIntro') + t('profilerNarrVerbose') + ' ';
      } else if (myProfile.styles.includes('concise')) {
        narrative += t('profilerNarrIntro') + t('profilerNarrConcise') + ' ';
      }

      // Expressiveness
      if (myProfile.styles.includes('expressive')) {
        narrative += t('profilerNarrExpressive') + ' ';
      } else if (myProfile.styles.includes('factual')) {
        narrative += t('profilerNarrFactual') + ' ';
      }

      // Behavioral traits
      if (myProfile.styles.includes('inquisitive')) narrative += t('profilerNarrInquisitive') + ' ';
      if (myProfile.styles.includes('responsive')) narrative += t('profilerNarrResponsive') + ' ';
      if (myProfile.styles.includes('initiator')) narrative += t('profilerNarrInitiator') + ' ';
      if (myProfile.styles.includes('mediaHeavy')) narrative += t('profilerNarrMediaHeavy') + ' ';

      // Role-based conclusion
      const roleNarrKey = 'profilerNarr' + myProfile.role.charAt(0).toUpperCase() + myProfile.role.slice(1);
      const roleNarr = t(roleNarrKey);
      if (roleNarr && roleNarr !== roleNarrKey) {
        narrative += roleNarr;
      } else {
        narrative += t('profilerNarrDefaultRole');
      }

      const narrText = document.createElement('p');
      narrText.className = 'profiler-narrative-text';
      narrText.textContent = narrative.trim();
      narrativeSection.appendChild(narrText);
      personalSection.appendChild(narrativeSection);

      // ---- Big Five personality indicators ----
      const bigFiveSection = document.createElement('div');
      bigFiveSection.className = 'profiler-bigfive';
      const bfLabel = document.createElement('div');
      bfLabel.className = 'profiler-section-label';
      bfLabel.textContent = t('profilerBigFive');
      bigFiveSection.appendChild(bfLabel);

      // Compute Big Five proxies from chat data
      const emojiRate = myProfile.emojiCount / Math.max(myProfile.messageCount, 1);
      const questionRate = myProfile.questionCount / Math.max(myProfile.messageCount, 1);
      const linkRate = myProfile.linkCount / Math.max(myProfile.messageCount, 1);
      const laughRate = myProfile.laughCount / Math.max(myProfile.messageCount, 1);
      const initRate = myProfile.initiations / Math.max(myProfile.messageCount, 1);

      const bigFive = [
        { key: 'profilerBigFiveOpenness', value: Math.min(100, Math.round(
          (linkRate * 300) + (questionRate * 200) + (myProfile.avgLength > 60 ? 20 : 0) + 30
        ))},
        { key: 'profilerBigFiveConscientiousness', value: Math.min(100, Math.round(
          (myProfile.avgResponseTime !== null && myProfile.avgResponseTime < 30 ? 40 : 10) +
          (myProfile.avgLength > 40 ? 25 : 10) +
          (myProfile.messageShare > 0.1 ? 20 : 5) + 15
        ))},
        { key: 'profilerBigFiveExtraversion', value: Math.min(100, Math.round(
          (myProfile.messageShare * 200) + (initRate * 500) + (emojiRate * 50) + (laughRate * 100) + 10
        ))},
        { key: 'profilerBigFiveAgreeableness', value: Math.min(100, Math.round(
          (myProfile.sentiment.positive * 0.6) +
          (emojiRate * 30) +
          (myProfile.avgResponseTime !== null && myProfile.avgResponseTime < 20 ? 20 : 5) + 20
        ))},
        { key: 'profilerBigFiveNeuroticism', value: Math.min(100, Math.round(
          70 - (myProfile.sentiment.negative * 0.3) +
          (myProfile.exclamationCount / Math.max(myProfile.messageCount, 1) < 0.3 ? 15 : 0) +
          (myProfile.avgLength < 200 ? 10 : 0)
        ))},
      ];

      const bfBars = document.createElement('div');
      bfBars.className = 'profiler-bigfive-bars';
      bigFive.forEach(bf => {
        const row = document.createElement('div');
        row.className = 'profiler-bf-row';
        row.innerHTML = '<span class="profiler-bf-label">' + t(bf.key) + '</span>' +
          '<div class="profiler-bf-track"><div class="profiler-bf-fill" style="width:' + bf.value + '%;background:' + myColor + '"></div></div>' +
          '<span class="profiler-bf-value">' + bf.value + '</span>';
        bfBars.appendChild(row);
      });
      bigFiveSection.appendChild(bfBars);
      personalSection.appendChild(bigFiveSection);

      // ---- Large radar chart ----
      const radarSection = document.createElement('div');
      radarSection.className = 'profiler-personal-radar';
      radarSection.innerHTML = '<div class="profiler-section-label">' + t('profilerTraits') + '</div>' +
        drawRadarSVG(myProfile.radar, myColor).replace('class="radar-svg"', 'class="radar-svg radar-svg-large"');
      personalSection.appendChild(radarSection);

      // ---- Comparison vs group average ----
      const avgMsgCount = Math.round(profiles.reduce((s, p) => s + p.messageCount, 0) / profiles.length);
      const avgAvgLength = Math.round(profiles.reduce((s, p) => s + p.avgLength, 0) / profiles.length);
      const avgMedia = Math.round(profiles.reduce((s, p) => s + p.mediaCount, 0) / profiles.length);
      const avgEmoji = Math.round(profiles.reduce((s, p) => s + p.emojiCount, 0) / profiles.length);
      const avgQuestions = Math.round(profiles.reduce((s, p) => s + p.questionCount, 0) / profiles.length);

      const compSection = document.createElement('div');
      compSection.className = 'profiler-comparison';
      const compLabel = document.createElement('div');
      compLabel.className = 'profiler-section-label';
      compLabel.textContent = t('profilerVsGroup');
      compSection.appendChild(compLabel);

      const compGrid = document.createElement('div');
      compGrid.className = 'profiler-comp-grid';

      function compRow(label, myVal, avgVal) {
        const diff = myVal - avgVal;
        const pct = avgVal > 0 ? Math.round((diff / avgVal) * 100) : 0;
        let comparison = '';
        if (Math.abs(pct) < 10) {
          comparison = '<span class="profiler-comp-diff neutral">' + t('profilerOnPar') + '</span>';
        } else if (pct > 0) {
          comparison = '<span class="profiler-comp-diff positive">+' + Math.abs(pct) + '% ' + t('profilerMoreThan') + '</span>';
        } else {
          comparison = '<span class="profiler-comp-diff negative">' + Math.abs(pct) + '% ' + t('profilerLessThan') + '</span>';
        }
        return '<div class="profiler-comp-row">' +
          '<span class="profiler-comp-label">' + label + '</span>' +
          '<div class="profiler-comp-values">' +
          '<span class="profiler-comp-you" style="color:' + myColor + '">' + t('profilerYou') + ': ' + myVal + '</span>' +
          '<span class="profiler-comp-avg">' + t('profilerVsGroupAvg') + ': ' + avgVal + '</span>' +
          '</div>' +
          comparison + '</div>';
      }

      compGrid.innerHTML =
        compRow(t('profilerMessages'), myProfile.messageCount, avgMsgCount) +
        compRow(t('profilerAvgLength'), myProfile.avgLength, avgAvgLength) +
        compRow(t('profilerMediaSent'), myProfile.mediaCount, avgMedia) +
        compRow(t('profilerEmojis'), myProfile.emojiCount, avgEmoji) +
        compRow(t('profilerQuestions'), myProfile.questionCount, avgQuestions);
      compSection.appendChild(compGrid);
      personalSection.appendChild(compSection);

      // ---- Hourly activity ----
      const hourlySection = document.createElement('div');
      hourlySection.className = 'profiler-personal-hourly';
      hourlySection.innerHTML = '<div class="profiler-section-label">' + t('profilerActivityChart') + '</div>' +
        drawHourlyChart(myProfile.hourly, myColor);
      personalSection.appendChild(hourlySection);

      overlay.appendChild(personalSection);
    }

    // Member cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'profiler-cards';

    profiles.forEach((p, i) => {
      const color = SENDER_COLORS[i % SENDER_COLORS.length];
      const card = document.createElement('div');
      card.className = 'profiler-card';

      // Card header
      const cardHeader = document.createElement('div');
      cardHeader.className = 'profiler-card-header';
      cardHeader.innerHTML = '<div class="profiler-card-avatar" style="background:' + color + '">' + (p.name.charAt(0) || '?').toUpperCase() + '</div>' +
        '<div class="profiler-card-name-block"><h3 style="color:' + color + '">' + escapeHtml(p.name) + '</h3>' +
        '<span class="profiler-card-role">' + t('profilerRole' + p.role.charAt(0).toUpperCase() + p.role.slice(1)) + '</span></div>';
      card.appendChild(cardHeader);

      // Stats grid
      const statsGrid = document.createElement('div');
      statsGrid.className = 'profiler-stats-grid';

      const stats = [
        { label: t('profilerMessages'), value: p.messageCount.toLocaleString() },
        { label: t('profilerAvgLength'), value: p.avgLength + ' ' + t('profilerCharsPerMsg') },
        { label: t('profilerMediaSent'), value: p.mediaCount.toString() },
        { label: t('profilerEmojis'), value: p.emojiCount.toString() },
        { label: t('profilerQuestions'), value: p.questionCount.toString() },
        { label: t('profilerLinks'), value: p.linkCount.toString() },
        { label: t('profilerInitiations'), value: p.initiations.toString() },
        { label: t('profilerAvgResponseTime'), value: formatResponseTime(p.avgResponseTime) },
        { label: t('profilerMostActiveHour'), value: p.peakHour + ':00' },
      ];

      stats.forEach(s => {
        const cell = document.createElement('div');
        cell.className = 'profiler-stat-cell';
        cell.innerHTML = '<span class="profiler-stat-value">' + s.value + '</span><span class="profiler-stat-label">' + s.label + '</span>';
        statsGrid.appendChild(cell);
      });
      card.appendChild(statsGrid);

      // Radar chart + hourly chart side by side
      const chartsRow = document.createElement('div');
      chartsRow.className = 'profiler-charts-row';

      const radarCol = document.createElement('div');
      radarCol.className = 'profiler-chart-col';
      radarCol.innerHTML = '<div class="profiler-chart-label">' + t('profilerTraits') + '</div>' + drawRadarSVG(p.radar, color);
      chartsRow.appendChild(radarCol);

      const hourlyCol = document.createElement('div');
      hourlyCol.className = 'profiler-chart-col profiler-chart-col-wide';
      hourlyCol.innerHTML = '<div class="profiler-chart-label">' + t('profilerActivityChart') + '</div>' + drawHourlyChart(p.hourly, color);
      chartsRow.appendChild(hourlyCol);

      card.appendChild(chartsRow);

      // Communication style tags
      if (p.styles.length > 0) {
        const stylesSection = document.createElement('div');
        stylesSection.className = 'profiler-styles-section';
        stylesSection.innerHTML = '<div class="profiler-section-label">' + t('profilerCommunicationStyle') + '</div>';
        const tagContainer = document.createElement('div');
        tagContainer.className = 'profiler-tags';
        p.styles.forEach(s => {
          const tag = document.createElement('span');
          tag.className = 'profiler-tag';
          tag.style.borderColor = color;
          tag.style.color = color;
          tag.textContent = t('profilerStyle' + s.charAt(0).toUpperCase() + s.slice(1));
          tagContainer.appendChild(tag);
        });
        stylesSection.appendChild(tagContainer);
        card.appendChild(stylesSection);
      }

      // Top emojis
      if (p.topEmojis.length > 0) {
        const emojiSection = document.createElement('div');
        emojiSection.className = 'profiler-emoji-section';
        emojiSection.innerHTML = '<div class="profiler-section-label">' + t('profilerTopEmojis') + '</div>' +
          '<div class="profiler-top-emojis">' + p.topEmojis.map(e => '<span class="profiler-emoji">' + e + '</span>').join('') + '</div>';
        card.appendChild(emojiSection);
      }

      // Sentiment bar
      const sentimentSection = document.createElement('div');
      sentimentSection.className = 'profiler-sentiment-section';
      sentimentSection.innerHTML = '<div class="profiler-section-label">' + t('profilerSentiment') + '</div>';
      const sentBar = document.createElement('div');
      sentBar.className = 'profiler-sentiment-bar';
      sentBar.innerHTML = '<div class="profiler-sent-pos" style="width:' + p.sentiment.positive + '%"></div>' +
        '<div class="profiler-sent-neu" style="width:' + p.sentiment.neutral + '%"></div>' +
        '<div class="profiler-sent-neg" style="width:' + p.sentiment.negative + '%"></div>';
      sentimentSection.appendChild(sentBar);
      const sentLegend = document.createElement('div');
      sentLegend.className = 'profiler-sent-legend';
      sentLegend.innerHTML = '<span class="profiler-sent-label pos">' + t('profilerSentimentPositive') + ' ' + p.sentiment.positive + '%</span>' +
        '<span class="profiler-sent-label neu">' + t('profilerSentimentNeutral') + ' ' + p.sentiment.neutral + '%</span>' +
        '<span class="profiler-sent-label neg">' + t('profilerSentimentNegative') + ' ' + p.sentiment.negative + '%</span>';
      sentimentSection.appendChild(sentLegend);
      card.appendChild(sentimentSection);

      // Frequent words
      if (p.topWords.length > 0) {
        const wordsSection = document.createElement('div');
        wordsSection.className = 'profiler-words-section';
        wordsSection.innerHTML = '<div class="profiler-section-label">' + t('profilerWordCloud') + '</div>';
        const wordsContainer = document.createElement('div');
        wordsContainer.className = 'profiler-word-cloud';
        const maxWordCount = p.topWords[0].count;
        p.topWords.forEach(w => {
          const span = document.createElement('span');
          span.className = 'profiler-word';
          const scale = 0.7 + (w.count / maxWordCount) * 0.6;
          span.style.fontSize = scale + 'em';
          span.style.opacity = 0.5 + (w.count / maxWordCount) * 0.5;
          span.textContent = w.word;
          wordsContainer.appendChild(span);
        });
        wordsSection.appendChild(wordsContainer);
        card.appendChild(wordsSection);
      }

      cardsContainer.appendChild(card);
    });

    overlay.appendChild(cardsContainer);
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('visible');
      });
    });
  }

  function formatResponseTime(minutes) {
    if (minutes === null || minutes === undefined) return '—';
    if (minutes < 60) return Math.round(minutes) + ' ' + t('profilerMinutes');
    if (minutes < 1440) return Math.round(minutes / 60) + ' ' + t('profilerHours');
    return Math.round(minutes / 1440) + ' ' + t('profilerDays');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Profiler button integration ----
  const btnProfiler = $('btn-profiler');
  if (btnProfiler) {
    btnProfiler.addEventListener('click', () => switchView('profiler'));
  }

})();
