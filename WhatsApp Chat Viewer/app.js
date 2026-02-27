/* ================================================
   WhatsApp Chat Viewer — Main Application
   ================================================ */

(function () {
  'use strict';

  // ===================== STATE =====================
  const state = {
    messages: [],         // Parsed messages
    mediaFiles: {},       // filename -> { zipEntry, blobUrl (lazy) }
    chatName: '',
    senders: [],          // unique senders
    mySender: null,       // "You" - first non-system sender
    senderColors: {},     // sender -> color
    renderedRange: { start: 0, end: 0 },
    searchResults: [],
    searchIndex: -1,
    searchTerm: '',
    isSearchOpen: false,
  };

  // Sender name colors for group chats
  const SENDER_COLORS = [
    '#25d366', '#53bdeb', '#e6c84f', '#ff7eb3', '#ff6b6b',
    '#7c4dff', '#ffa726', '#26c6da', '#ef5350', '#66bb6a',
    '#ab47bc', '#29b6f6', '#ec407a', '#8d6e63', '#78909c',
  ];

  // French month names
  const MONTHS_FR = [
    'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
    'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
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

  // Update status bar time
  const now = new Date();
  $('status-time').textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  // ===================== FILE DROP / UPLOAD =====================
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
    if (files.length > 0) handleFile(files[0]);
  });

  dropZone.addEventListener('click', (e) => {
    if (e.target.closest('.file-input-btn')) return;
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
  });

  // ===================== MAIN FILE HANDLER =====================
  async function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      alert('Veuillez sélectionner un fichier .zip');
      return;
    }

    loadingOverlay.classList.remove('hidden');

    try {
      const zip = await JSZip.loadAsync(file);
      let chatText = null;
      const mediaEntries = {};

      // Find _chat.txt and media files
      zip.forEach((relativePath, entry) => {
        if (entry.dir) return;
        const name = relativePath.split('/').pop();
        const nameLower = name.toLowerCase();

        if (nameLower === '_chat.txt' || nameLower === 'chat.txt' || nameLower.endsWith('_chat.txt') || nameLower === 'whatsapp chat.txt') {
          chatText = entry;
        } else {
          // Store media by filename
          mediaEntries[name] = { zipEntry: entry, blobUrl: null };
          // Also store by relative path in case references use paths
          if (relativePath !== name) {
            mediaEntries[relativePath] = { zipEntry: entry, blobUrl: null };
          }
        }
      });

      // If no _chat.txt found, try any .txt file
      if (!chatText) {
        zip.forEach((relativePath, entry) => {
          if (!entry.dir && relativePath.toLowerCase().endsWith('.txt')) {
            if (!chatText) chatText = entry;
          }
        });
      }

      if (!chatText) {
        alert('Aucun fichier de chat trouvé dans le ZIP. Assurez-vous que le fichier contient _chat.txt.');
        loadingOverlay.classList.add('hidden');
        return;
      }

      const text = await chatText.async('string');
      state.mediaFiles = mediaEntries;

      // Parse messages
      state.messages = parseWhatsAppChat(text);

      if (state.messages.length === 0) {
        alert('Impossible de parser le chat. Vérifiez le format du fichier.');
        loadingOverlay.classList.add('hidden');
        return;
      }

      // Detect senders
      detectSenders();

      // Extract chat name
      extractChatName();

      // Show chat screen
      showChatScreen();

    } catch (err) {
      console.error('Error loading ZIP:', err);
      alert('Erreur lors du chargement du fichier : ' + err.message);
    }

    loadingOverlay.classList.add('hidden');
  }

  // ===================== WHATSAPP CHAT PARSER =====================
  function parseWhatsAppChat(text) {
    const messages = [];
    const lines = text.split('\n');

    // Try to detect format by checking first few lines
    // iOS: [DD/MM/YYYY, HH:MM:SS] Sender: Message
    // Android: DD/MM/YYYY, HH:MM - Sender: Message  or  M/D/YY, H:MM AM/PM - Sender: Message

    // Comprehensive regex patterns
    // Pattern 1: iOS format [DD/MM/YYYY, HH:MM:SS] or [DD/MM/YYYY HH:MM:SS]
    const iosRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}[:\.]\d{2}(?:[:\.]\d{2})?(?:\s*[AaPp]\.?\s*[Mm]\.?)?)\]\s*/;

    // Pattern 2: Android format DD/MM/YYYY, HH:MM - or M/D/YY, H:MM AM/PM -
    const androidRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}[:\.]\d{2}(?:[:\.]\d{2})?(?:\s*[AaPp]\.?\s*[Mm]\.?)?)\s*[\-–]\s*/;

    // Pattern 3: Alternate with dots or dashes in date DD.MM.YYYY or DD-MM-YYYY
    const altDateRegex = /^(\d{1,2}[\.\-]\d{1,2}[\.\-]\d{2,4}),?\s+(\d{1,2}[:\.]\d{2}(?:[:\.]\d{2})?(?:\s*[AaPp]\.?\s*[Mm]\.?)?)\s*[\-–]\s*/;

    // Unicode LTR mark that WhatsApp sometimes inserts
    const LTR = '\u200E';
    const RTL = '\u200F';
    const ZWSP = '\u200B';
    const cleanLine = (l) => l.replace(/[\u200E\u200F\u200B\u200D\u2069\u2066\uFEFF]/g, '');

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (!line.trim()) continue;

      const cleaned = cleanLine(line);
      let match = null;
      let dateStr, timeStr, rest;

      // Try iOS format
      match = cleaned.match(iosRegex);
      if (match) {
        dateStr = match[1];
        timeStr = match[2];
        rest = cleaned.slice(match[0].length);
      }

      // Try Android format
      if (!match) {
        match = cleaned.match(androidRegex);
        if (match) {
          dateStr = match[1];
          timeStr = match[2];
          rest = cleaned.slice(match[0].length);
        }
      }

      // Try alternate date format
      if (!match) {
        match = cleaned.match(altDateRegex);
        if (match) {
          dateStr = match[1].replace(/[\.\-]/g, '/');
          timeStr = match[2];
          rest = cleaned.slice(match[0].length);
        }
      }

      if (match) {
        // Parse date
        const parsedDate = parseDate(dateStr);
        const parsedTime = parseTime(timeStr);

        // Extract sender and message
        // Sender ends at first ": " — but sender can't contain newlines
        const colonIdx = rest.indexOf(': ');

        let sender = null;
        let text = '';

        if (colonIdx > 0 && colonIdx < 80) {
          sender = rest.slice(0, colonIdx).trim();
          text = rest.slice(colonIdx + 2);
        } else {
          // System message (no sender)
          text = rest;
        }

        // Detect if it's a system message pattern
        if (sender && isSystemMessage(sender, text)) {
          sender = null;
          text = rest;
        }

        messages.push({
          id: messages.length,
          date: parsedDate,
          time: parsedTime,
          timeStr: formatTime(parsedTime),
          dateStr: formatDateFr(parsedDate),
          sender: sender,
          text: text,
          isSystem: sender === null,
          media: null, // filled later
        });
      } else {
        // Continuation of previous message
        if (messages.length > 0 && cleaned.trim()) {
          messages[messages.length - 1].text += '\n' + cleaned;
        }
      }
    }

    // Post-process: detect media attachments
    for (const msg of messages) {
      msg.media = detectMedia(msg.text);
      // If message is purely a media attachment, clear the text
      if (msg.media && msg.media.type !== 'omitted') {
        // Check if the text is just the attachment reference
        if (isMediaOnlyText(msg.text)) {
          msg.text = '';
        }
      }
    }

    return messages;
  }

  function isSystemMessage(sender, text) {
    // Common system message patterns
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
    // If "sender" contains system-like phrases
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

    // iOS: <attached: filename.ext>
    let m = text.match(/<(?:attached|joint):\s*(.+?)>/i);
    if (m) return buildMediaInfo(m[1].trim());

    // Android: filename.ext (file attached)
    m = text.match(/^(.+?\.\w{2,5})\s*\(file attached\)/i);
    if (m) return buildMediaInfo(m[1].trim());

    // French: filename.ext (fichier joint)
    m = text.match(/^(.+?\.\w{2,5})\s*\(fichier joint\)/i);
    if (m) return buildMediaInfo(m[1].trim());

    // Omitted patterns
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
    // Generic omitted
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
    // Check if text is only the attachment pattern
    if (/<(?:attached|joint):\s*.+?>/i.test(cleaned) && cleaned.match(/<(?:attached|joint):\s*.+?>/i)[0].length >= cleaned.length - 5) return true;
    if (/^.+?\.\w{2,5}\s*\((?:file attached|fichier joint)\)$/i.test(cleaned)) return true;
    if (/^.?\s*(?:image|video|audio|sticker|document|GIF|Contact card)\s*(?:omitted|omis|absent[e]?|weggelassen)/i.test(cleaned)) return true;
    return false;
  }

  function parseDate(str) {
    // Handle DD/MM/YYYY, DD/MM/YY, M/D/YY, M/D/YYYY
    const parts = str.split('/');
    if (parts.length !== 3) return new Date();

    let a = parseInt(parts[0], 10);
    let b = parseInt(parts[1], 10);
    let c = parseInt(parts[2], 10);

    // Fix 2-digit year
    if (c < 100) c += 2000;

    // Determine if DD/MM/YYYY or MM/DD/YYYY
    // Heuristic: if first part > 12, it must be the day (DD/MM)
    // If second part > 12, it must be the day (MM/DD)
    // Otherwise, default to DD/MM (more common globally / WhatsApp default)
    let day, month, year;

    if (a > 12) {
      // DD/MM/YYYY
      day = a; month = b; year = c;
    } else if (b > 12) {
      // MM/DD/YYYY
      month = a; day = b; year = c;
    } else {
      // Ambiguous — default to DD/MM/YYYY (WhatsApp default for most locales)
      day = a; month = b; year = c;
    }

    return new Date(year, month - 1, day);
  }

  function parseTime(str) {
    let cleaned = str.trim();
    // Normalize a.m./p.m. to AM/PM
    cleaned = cleaned.replace(/\ba\.?\s*m\.?/i, 'AM').replace(/\bp\.?\s*m\.?/i, 'PM');
    const isPM = /PM/i.test(cleaned);
    const isAM = /AM/i.test(cleaned);
    const timePart = cleaned.replace(/\s*[AaPp][Mm]/i, '').replace(/\s*AM|PM/gi, '').trim();
    // Split by : or .
    const parts = timePart.split(/[:\.]/);

    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parts[2] ? parseInt(parts[2], 10) : 0;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return { hours, minutes, seconds };
  }

  function formatTime(t) {
    return String(t.hours).padStart(2, '0') + ':' + String(t.minutes).padStart(2, '0');
  }

  function formatDateFr(date) {
    if (!(date instanceof Date) || isNaN(date)) return '';
    return date.getDate() + ' ' + MONTHS_FR[date.getMonth()] + ' ' + date.getFullYear();
  }

  // ===================== SENDERS & CHAT NAME =====================
  function detectSenders() {
    const senderSet = new Set();
    let firstSender = null;

    for (const msg of state.messages) {
      if (msg.sender && !msg.isSystem) {
        if (!firstSender) firstSender = msg.sender;
        senderSet.add(msg.sender);
      }
    }

    state.senders = Array.from(senderSet);
    state.mySender = firstSender;

    // Assign colors
    let colorIdx = 0;
    for (const s of state.senders) {
      if (s === state.mySender) continue;
      state.senderColors[s] = SENDER_COLORS[colorIdx % SENDER_COLORS.length];
      colorIdx++;
    }
  }

  function extractChatName() {
    // For 1-on-1 chats, the name is the other person
    // For group chats, look for "created group X" pattern or use all non-self senders
    const isGroup = state.senders.length > 2;

    // Try to find group name from system messages
    for (const msg of state.messages) {
      if (msg.isSystem) {
        const m = msg.text.match(/created group "(.+?)"/i) ||
                  msg.text.match(/a créé le groupe "(.+?)"/i) ||
                  msg.text.match(/changed the subject.*to "(.+?)"/i) ||
                  msg.text.match(/a modifié l'objet.*en "(.+?)"/i);
        if (m) {
          state.chatName = m[1];
          return;
        }
      }
    }

    if (isGroup) {
      // Use list of non-self senders
      const others = state.senders.filter(s => s !== state.mySender);
      state.chatName = others.slice(0, 3).join(', ') + (others.length > 3 ? '...' : '');
    } else {
      // 1-on-1: the other person
      const other = state.senders.find(s => s !== state.mySender);
      state.chatName = other || state.mySender || 'Chat';
    }
  }

  // ===================== SHOW CHAT SCREEN =====================
  function showChatScreen() {
    dropZoneScreen.classList.remove('active');
    chatScreen.classList.add('active');

    headerName.textContent = state.chatName;
    const isGroup = state.senders.length > 2;
    if (isGroup) {
      headerStatus.textContent = state.senders.length + ' participants';
    } else {
      headerStatus.textContent = '';
    }

    renderMessages();

    // Scroll to bottom
    requestAnimationFrame(() => {
      chatArea.scrollTop = chatArea.scrollHeight;
    });
  }

  // ===================== VIRTUAL / CHUNK RENDERING =====================
  // Strategy: Render messages in chunks. Start by rendering the last N messages,
  // then load more as user scrolls up. This keeps DOM light for large chats.

  const CHUNK_SIZE = 100; // messages per chunk
  const INITIAL_RENDER = 150; // initial messages from the end
  let allRenderedElements = []; // Track rendered msg elements for search
  let topLoadingMore = false;

  function renderMessages() {
    messagesContainer.innerHTML = '';
    allRenderedElements = [];

    const total = state.messages.length;
    const startIdx = Math.max(0, total - INITIAL_RENDER);
    state.renderedRange.start = startIdx;
    state.renderedRange.end = total;

    renderChunk(startIdx, total);

    // Set up scroll listener for infinite scroll up
    chatArea.addEventListener('scroll', handleScroll, { passive: true });
  }

  function renderChunk(start, end) {
    const fragment = document.createDocumentFragment();
    let prevDate = null;
    let prevSender = null;

    // If prepending, we need to know the date context
    if (start > 0 && state.renderedRange.start < state.messages.length) {
      // Check if there's an existing date context
    }
    if (start > 0) {
      prevDate = start > 0 ? getDateKey(state.messages[start - 1].date) : null;
    }

    for (let i = start; i < end; i++) {
      const msg = state.messages[i];
      const currentDateKey = getDateKey(msg.date);

      // Date separator
      if (currentDateKey !== prevDate) {
        const sep = createDateSeparator(msg.dateStr, currentDateKey);
        fragment.appendChild(sep);
        prevDate = currentDateKey;
        prevSender = null;
      }

      // Message element
      const el = createMessageElement(msg, prevSender);
      el.dataset.msgId = i;
      fragment.appendChild(el);
      allRenderedElements.push({ idx: i, el });
      prevSender = msg.sender;
    }

    if (start < state.renderedRange.start || messagesContainer.children.length === 0) {
      // Prepend
      const scrollHeightBefore = messagesContainer.scrollHeight;
      messagesContainer.prepend(fragment);
      // Maintain scroll position
      const diff = messagesContainer.scrollHeight - scrollHeightBefore;
      chatArea.scrollTop += diff;
    } else {
      messagesContainer.appendChild(fragment);
    }
  }

  function handleScroll() {
    const scrollTop = chatArea.scrollTop;
    const scrollHeight = chatArea.scrollHeight;
    const clientHeight = chatArea.clientHeight;

    // Load more messages when scrolling near top
    if (scrollTop < 200 && state.renderedRange.start > 0 && !topLoadingMore) {
      topLoadingMore = true;
      const newStart = Math.max(0, state.renderedRange.start - CHUNK_SIZE);
      const oldStart = state.renderedRange.start;
      state.renderedRange.start = newStart;
      renderChunk(newStart, oldStart);
      topLoadingMore = false;
    }

    // Show/hide scroll to bottom button
    if (scrollHeight - scrollTop - clientHeight > 300) {
      scrollBottomBtn.classList.remove('hidden');
    } else {
      scrollBottomBtn.classList.add('hidden');
    }

    // Sticky date header
    updateStickyDate();
  }

  function updateStickyDate() {
    // Find the first visible date separator
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

  function createMessageElement(msg, prevSender) {
    if (msg.isSystem) {
      const div = document.createElement('div');
      div.className = 'system-message';
      div.innerHTML = '<span class="system-message-text">' + escapeHtml(msg.text) + '</span>';
      return div;
    }

    const isOutgoing = msg.sender === state.mySender;
    const isGroup = state.senders.length > 2;
    const showTail = msg.sender !== prevSender;

    const row = document.createElement('div');
    row.className = 'message-row ' + (isOutgoing ? 'outgoing' : 'incoming') + (showTail ? ' has-tail' : '');

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    // Sender name for group incoming messages
    if (isGroup && !isOutgoing && showTail) {
      const sName = document.createElement('span');
      sName.className = 'sender-name';
      sName.textContent = msg.sender;
      sName.style.color = state.senderColors[msg.sender] || SENDER_COLORS[0];
      bubble.appendChild(sName);
    }

    // Media content
    if (msg.media) {
      const mediaEl = createMediaElement(msg.media);
      bubble.appendChild(mediaEl);
    }

    // Text
    if (msg.text && msg.text.trim()) {
      const textSpan = document.createElement('span');
      textSpan.className = 'message-text';
      textSpan.innerHTML = linkify(escapeHtml(msg.text));
      bubble.appendChild(textSpan);
    }

    // Meta (timestamp + check for outgoing)
    const meta = document.createElement('span');
    meta.className = 'message-meta';
    const timeEl = document.createElement('span');
    timeEl.className = 'message-time';
    timeEl.textContent = msg.timeStr;
    meta.appendChild(timeEl);

    // Add read receipt check for outgoing messages
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

  function createMediaElement(media) {
    if (media.type === 'omitted') {
      const div = document.createElement('div');
      div.className = 'media-omitted';
      const labels = {
        image: '📷 Image non incluse',
        video: '🎥 Vidéo non incluse',
        audio: '🎵 Audio non inclus',
        sticker: '🏷️ Autocollant non inclus',
        document: '📄 Document non inclus',
        gif: '🎬 GIF non inclus',
        contact: '👤 Carte de contact non incluse',
        unknown: '📎 Média non inclus',
      };
      div.textContent = labels[media.mediaType] || labels.unknown;
      return div;
    }

    // Try to find the file in our media files
    const entry = findMediaFile(media.filename);

    if (media.mediaType === 'image') {
      const container = document.createElement('div');
      container.className = 'media-container';
      const img = document.createElement('img');
      img.alt = media.filename;
      img.loading = 'lazy';

      if (entry) {
        // Lazy load blob URL
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

      // Create a simple audio-based voice note
      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      const playBtn = document.createElement('button');
      playBtn.className = 'voice-note-btn';
      playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

      const waveContainer = document.createElement('div');
      waveContainer.className = 'voice-note-wave';
      // Generate fake waveform bars
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
        // Reset waveform
        waveContainer.querySelectorAll('.voice-note-bar').forEach(b => b.classList.remove('played'));
      });

      // Update waveform progress
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

    // Document / other
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

  function findMediaFile(filename) {
    if (!filename) return null;

    // Direct match
    if (state.mediaFiles[filename]) return state.mediaFiles[filename];

    // Try without path
    const baseName = filename.split('/').pop();
    if (state.mediaFiles[baseName]) return state.mediaFiles[baseName];

    // Try case-insensitive match
    const filenameLower = filename.toLowerCase();
    for (const key in state.mediaFiles) {
      if (key.toLowerCase() === filenameLower || key.split('/').pop().toLowerCase() === filenameLower) {
        return state.mediaFiles[key];
      }
    }

    // Try partial match (WhatsApp sometimes renames files)
    // Match by base name without extension
    const nameWithoutExt = baseName.replace(/\.\w+$/, '').toLowerCase();
    for (const key in state.mediaFiles) {
      const keyBase = key.split('/').pop().replace(/\.\w+$/, '').toLowerCase();
      if (keyBase === nameWithoutExt) {
        return state.mediaFiles[key];
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
    state.isSearchOpen = true;
    chatHeader.classList.add('hidden');
    searchBar.classList.remove('hidden');
    searchInput.focus();
  });

  searchCloseBtn.addEventListener('click', closeSearch);

  function closeSearch() {
    state.isSearchOpen = false;
    searchBar.classList.add('hidden');
    chatHeader.classList.remove('hidden');
    searchInput.value = '';
    searchCount.textContent = '';
    state.searchResults = [];
    state.searchIndex = -1;
    state.searchTerm = '';
    // Remove highlights
    clearSearchHighlights();
  }

  searchInput.addEventListener('input', debounce(() => {
    const term = searchInput.value.trim();
    if (term.length < 2) {
      clearSearchHighlights();
      searchCount.textContent = '';
      state.searchResults = [];
      state.searchIndex = -1;
      state.searchTerm = '';
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
    state.searchTerm = term;
    state.searchResults = [];
    const lower = term.toLowerCase();

    for (let i = 0; i < state.messages.length; i++) {
      const msg = state.messages[i];
      if (msg.text && msg.text.toLowerCase().includes(lower)) {
        state.searchResults.push(i);
      }
    }

    searchCount.textContent = state.searchResults.length + ' résultat' + (state.searchResults.length !== 1 ? 's' : '');

    // Highlight in currently rendered messages
    highlightSearchResults();

    if (state.searchResults.length > 0) {
      state.searchIndex = state.searchResults.length - 1; // start from most recent
      scrollToSearchResult(state.searchIndex);
    } else {
      state.searchIndex = -1;
    }
  }

  function highlightSearchResults() {
    clearSearchHighlights();
    if (!state.searchTerm) return;

    const elements = messagesContainer.querySelectorAll('.message-text');
    const term = state.searchTerm;
    const regex = new RegExp('(' + escapeRegex(term) + ')', 'gi');

    elements.forEach(el => {
      const original = el.textContent;
      if (original.toLowerCase().includes(term.toLowerCase())) {
        el.innerHTML = linkify(escapeHtml(original).replace(regex, '<mark class="search-highlight">$1</mark>'));
      }
    });
  }

  function clearSearchHighlights() {
    const highlighted = messagesContainer.querySelectorAll('.search-highlight');
    // Rebuild text without highlights
    const elements = messagesContainer.querySelectorAll('.message-text');
    elements.forEach(el => {
      if (el.querySelector('.search-highlight')) {
        const text = el.textContent;
        el.innerHTML = linkify(escapeHtml(text));
      }
    });
  }

  function navigateSearch(direction) {
    if (state.searchResults.length === 0) return;

    state.searchIndex += direction;
    if (state.searchIndex < 0) state.searchIndex = state.searchResults.length - 1;
    if (state.searchIndex >= state.searchResults.length) state.searchIndex = 0;

    searchCount.textContent = (state.searchIndex + 1) + '/' + state.searchResults.length;
    scrollToSearchResult(state.searchIndex);
  }

  function scrollToSearchResult(searchIdx) {
    const msgIdx = state.searchResults[searchIdx];

    // Ensure message is rendered
    if (msgIdx < state.renderedRange.start) {
      // Need to render earlier messages
      const newStart = Math.max(0, msgIdx - 20);
      const oldStart = state.renderedRange.start;
      state.renderedRange.start = newStart;
      renderChunk(newStart, oldStart);
    }

    // Find the element
    const msgEl = messagesContainer.querySelector('[data-msg-id="' + msgIdx + '"]');
    if (msgEl) {
      msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight the active result
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
    // Reset and go back to upload screen
    state.messages = [];
    state.mediaFiles = {};
    state.chatName = '';
    state.senders = [];
    state.mySender = null;
    state.senderColors = {};
    state.renderedRange = { start: 0, end: 0 };
    state.searchResults = [];
    state.searchIndex = -1;
    state.searchTerm = '';
    state.isSearchOpen = false;
    allRenderedElements = [];
    messagesContainer.innerHTML = '';
    closeSearch();

    chatScreen.classList.remove('active');
    dropZoneScreen.classList.add('active');
  });

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
    // Convert URLs to clickable links
    return html.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#53bdeb;text-decoration:underline;">$1</a>'
    );
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
  const btnFull = $('btn-full');
  let currentView = 'phone'; // 'phone' or 'full'

  btnPhone.addEventListener('click', () => switchView('phone'));
  btnFull.addEventListener('click', () => switchView('full'));

  function switchView(mode) {
    if (mode === currentView) return;
    currentView = mode;

    // Save scroll position ratio before switching
    const scrollRatio = chatArea.scrollHeight > chatArea.clientHeight
      ? chatArea.scrollTop / (chatArea.scrollHeight - chatArea.clientHeight)
      : 1;

    btnPhone.classList.toggle('active', mode === 'phone');
    btnFull.classList.toggle('active', mode === 'full');

    if (mode === 'full') {
      chatScreen.classList.add('fullscreen-mode');
    } else {
      chatScreen.classList.remove('fullscreen-mode');
    }

    // Restore scroll position after layout reflow
    requestAnimationFrame(() => {
      const newMax = chatArea.scrollHeight - chatArea.clientHeight;
      chatArea.scrollTop = scrollRatio * newMax;
    });
  }

  // ===================== KEYBOARD SHORTCUTS =====================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      lightbox.classList.add('hidden');
      lightboxImg.src = '';
    }
  });

})();
