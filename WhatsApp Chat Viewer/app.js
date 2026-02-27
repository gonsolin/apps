/* ================================================
   WhatsApp Chat Viewer — Main Application
   Multi-chat architecture with iPad sidebar
   ================================================ */

(function () {
  'use strict';

  // ===================== MULTI-CHAT STATE =====================
  // Each loaded ZIP becomes a "chat" object in this array
  const chats = []; // { id, messages, mediaFiles, chatName, senders, mySender, senderColors, renderedRange, lastMessage, lastTime }
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
  const senderPickerOverlay = $('sender-picker');
  const senderPickerList = $('sender-picker-list');
  const sidebar = $('sidebar');
  const sidebarList = $('sidebar-list');
  const sidebarAddBtn = $('sidebar-add-btn');
  const sidebarFileInput = $('sidebar-file-input');
  const chatEmptyState = $('chat-empty-state');
  const ipadFrame = $('ipad-frame');

  // Update status bar time
  const now = new Date();
  $('status-time').textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

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
    if (files.length > 0) handleFile(files[0]);
  });

  dropZone.addEventListener('click', (e) => {
    if (e.target.closest('.file-input-btn')) return;
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
  });

  // Sidebar add button
  sidebarAddBtn.addEventListener('click', () => {
    sidebarFileInput.click();
  });

  sidebarFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
    sidebarFileInput.value = '';
  });

  // ===================== MAIN FILE HANDLER =====================
  // pendingChat temporarily holds chat data while we wait for sender picker
  let pendingChat = null;

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
          mediaEntries[name] = { zipEntry: entry, blobUrl: null };
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
      const messages = parseWhatsAppChat(text);

      if (messages.length === 0) {
        alert('Impossible de parser le chat. Vérifiez le format du fichier.');
        loadingOverlay.classList.add('hidden');
        return;
      }

      // Collect senders
      const senderSet = new Set();
      for (const msg of messages) {
        if (msg.sender && !msg.isSystem) senderSet.add(msg.sender);
      }
      const senders = Array.from(senderSet);

      // Detect group name early (before sender picker) so we can exclude it
      let detectedGroupName = null;
      for (const msg of messages) {
        if (!msg.sender && msg.isSystem) {
          const gm = msg.text.match(/created group "(.+?)"/i) ||
                     msg.text.match(/a créé le groupe "(.+?)"/i) ||
                     msg.text.match(/changed the subject.*to "(.+?)"/i) ||
                     msg.text.match(/a modifié l'objet.*en "(.+?)"/i);
          if (gm) {
            detectedGroupName = gm[1];
          }
        }
      }

      // Filter out the group name from the senders list if it appears
      const filteredSenders = detectedGroupName
        ? senders.filter(s => s !== detectedGroupName)
        : senders;

      // Store pending chat data
      pendingChat = {
        id: generateId(),
        messages: messages,
        mediaFiles: mediaEntries,
        chatName: '',
        senders: filteredSenders,
        allSenders: senders, // keep original for reference
        detectedGroupName: detectedGroupName,
        mySender: null,
        senderColors: {},
        renderedRange: { start: 0, end: 0 },
        lastMessage: '',
        lastTime: '',
      };

      // Extract last message preview
      const lastMsg = messages.filter(m => !m.isSystem && m.sender).pop();
      if (lastMsg) {
        pendingChat.lastMessage = (lastMsg.text || '').slice(0, 60);
        pendingChat.lastTime = lastMsg.timeStr;
      }

      // Show sender picker
      showSenderPicker(pendingChat);

    } catch (err) {
      console.error('Error loading ZIP:', err);
      alert('Erreur lors du chargement du fichier : ' + err.message);
    }

    loadingOverlay.classList.add('hidden');
  }

  // ===================== SENDER PICKER =====================
  function showSenderPicker(chat) {
    senderPickerList.innerHTML = '';

    // Count messages per sender
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
        '<span class="picker-count">' + count + ' msg</span>';

      btn.addEventListener('click', () => selectSender(sender));
      senderPickerList.appendChild(btn);
    }

    senderPickerOverlay.classList.remove('hidden');
  }

  function selectSender(sender) {
    if (!pendingChat) return;

    pendingChat.mySender = sender;
    senderPickerOverlay.classList.add('hidden');

    // Assign colors to other senders
    pendingChat.senderColors = {};
    let colorIdx = 0;
    for (const s of pendingChat.senders) {
      if (s === sender) continue;
      pendingChat.senderColors[s] = SENDER_COLORS[colorIdx % SENDER_COLORS.length];
      colorIdx++;
    }

    // Extract chat name
    extractChatName(pendingChat);

    // Add to chats array
    chats.push(pendingChat);

    // Switch to chat screen
    if (!chatScreen.classList.contains('active')) {
      dropZoneScreen.classList.remove('active');
      chatScreen.classList.add('active');
    }

    // Update sidebar
    refreshSidebar();

    // Activate this chat
    setActiveChat(pendingChat.id);

    pendingChat = null;
  }

  function extractChatName(chat) {
    // If we already detected a group name during parsing, use it
    if (chat.detectedGroupName) {
      chat.chatName = chat.detectedGroupName;
      return;
    }

    const isGroup = chat.senders.length > 2;

    // Try to find group name from system messages
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

  // ===================== SIDEBAR =====================
  function refreshSidebar() {
    sidebarList.innerHTML = '';

    if (chats.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sidebar-empty';
      empty.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg><p>Ajoutez un export WhatsApp (.zip) avec le bouton +</p>';
      sidebarList.appendChild(empty);
      return;
    }

    for (const chat of chats) {
      const item = document.createElement('div');
      item.className = 'sidebar-chat-item' + (chat.id === activeChatId ? ' active' : '');
      item.dataset.chatId = chat.id;

      const initials = chat.chatName.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();

      // Get the last non-system message for preview
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
    }
  }

  // ===================== ACTIVATE A CHAT =====================
  function setActiveChat(chatId) {
    activeChatId = chatId;
    const chat = getActiveChat();
    if (!chat) return;

    // Close search if open
    closeSearch();

    // Update sidebar active state
    sidebarList.querySelectorAll('.sidebar-chat-item').forEach(el => {
      el.classList.toggle('active', el.dataset.chatId === chatId);
    });

    // Update header
    headerName.textContent = chat.chatName;
    const isGroup = chat.senders.length > 2;
    headerStatus.textContent = isGroup ? chat.senders.length + ' participants' : '';

    // Show chat content, hide empty state
    chatArea.classList.remove('hidden');
    chatHeader.classList.remove('hidden');
    chatEmptyState.classList.add('hidden');

    // Render messages
    renderMessages(chat);

    // Scroll to bottom
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

    // Rebind scroll listener
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

      // Date separator
      if (currentDateKey !== prevDate) {
        const sep = createDateSeparator(msg.dateStr, currentDateKey);
        fragment.appendChild(sep);
        prevDate = currentDateKey;
        prevSender = null;
      }

      // Message element
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

    // Load more messages when scrolling near top
    if (scrollTop < 200 && chat.renderedRange.start > 0 && !topLoadingMore) {
      topLoadingMore = true;
      const newStart = Math.max(0, chat.renderedRange.start - CHUNK_SIZE);
      const oldStart = chat.renderedRange.start;
      chat.renderedRange.start = newStart;
      renderChunk(chat, newStart, oldStart);
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

    // Sender name for group incoming messages
    if (isGroup && !isOutgoing && showTail) {
      const sName = document.createElement('span');
      sName.className = 'sender-name';
      sName.textContent = msg.sender;
      sName.style.color = chat.senderColors[msg.sender] || SENDER_COLORS[0];
      bubble.appendChild(sName);
    }

    // Media content
    if (msg.media) {
      const mediaEl = createMediaElement(msg.media, chat);
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

    searchCount.textContent = searchState.results.length + ' résultat' + (searchState.results.length !== 1 ? 's' : '');

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
      // In iPad/fullscreen mode, deselect chat (show empty state)
      activeChatId = null;
      messagesContainer.innerHTML = '';
      chatArea.classList.add('hidden');
      chatHeader.classList.add('hidden');
      chatEmptyState.classList.remove('hidden');
      closeSearch();
      refreshSidebar();
    } else {
      // Phone mode — if only one chat, go back to drop zone
      // If multiple chats, switch to iPad mode so they can pick
      if (chats.length <= 1) {
        // Reset everything
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
        // Switch to iPad mode to show sidebar
        switchView('ipad');
      }
    }
  });

  // ===================== WHATSAPP CHAT PARSER =====================
  function parseWhatsAppChat(text) {
    const messages = [];
    const lines = text.split('\n');

    const iosRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*[AaPp]\.?\s*[Mm]\.?)?)\]\s*/;
    const androidRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*[AaPp]\.?\s*[Mm]\.?)?)\s*[\-–]\s*/;
    const altDateRegex = /^(\d{1,2}[.\-]\d{1,2}[.\-]\d{2,4}),?\s+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*[AaPp]\.?\s*[Mm]\.?)?)\s*[\-–]\s*/;

    const cleanLine = (l) => l.replace(/[\u200E\u200F\u200B\u200D\u2069\u2066\uFEFF]/g, '');

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (!line.trim()) continue;

      const cleaned = cleanLine(line);
      let match = null;
      let dateStr, timeStr, rest;

      match = cleaned.match(iosRegex);
      if (match) {
        dateStr = match[1];
        timeStr = match[2];
        rest = cleaned.slice(match[0].length);
      }

      if (!match) {
        match = cleaned.match(androidRegex);
        if (match) {
          dateStr = match[1];
          timeStr = match[2];
          rest = cleaned.slice(match[0].length);
        }
      }

      if (!match) {
        match = cleaned.match(altDateRegex);
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
          dateStr: formatDateFr(parsedDate),
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

    // Post-process: detect media attachments
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
    const parts = timePart.split(/[:.]/);

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
  const btnIpad = $('btn-ipad');
  const btnFull = $('btn-full');
  let currentView = 'phone'; // 'phone', 'ipad', or 'full'

  btnPhone.addEventListener('click', () => switchView('phone'));
  btnIpad.addEventListener('click', () => switchView('ipad'));
  btnFull.addEventListener('click', () => switchView('full'));

  function switchView(mode) {
    if (mode === currentView) return;
    currentView = mode;

    // Save scroll position ratio before switching
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

      // Same empty-state logic as iPad
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

      // If we have chats but no active one, show empty state
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

    // In phone mode, hide sidebar/empty state and ensure chat is visible
    if (mode === 'phone') {
      chatEmptyState.classList.add('hidden');
      if (activeChatId) {
        chatArea.classList.remove('hidden');
        chatHeader.classList.remove('hidden');
      }
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
