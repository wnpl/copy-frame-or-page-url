// Sidebar script for Link Storage feature

// Global variable to store preferences
let oPrefsGlobal = {};

// Initialize the sidebar
document.addEventListener('DOMContentLoaded', async () => {
    // Set i18n text (skip sidebarTitle as it's rendered by Firefox UI)
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && key !== 'sidebarTitle') {
            el.textContent = browser.i18n.getMessage(key);
        }
    });

    // Get current settings
    const response = await browser.runtime.sendMessage({ get: 'oPrefs' });
    oPrefsGlobal = response.prefs;

    // Check if we're in a private window
    const isPrivate = await checkPrivateWindow();
    const privateNotice = document.getElementById('private-notice');
    
    if (isPrivate) {
        privateNotice.textContent = browser.i18n.getMessage('sidebarPrivateWindowNotice');
        privateNotice.style.display = 'block';
        // In private windows, we don't show any links
        return;
    }

    // Check if link storage is enabled
    if (!oPrefsGlobal.linkStorage) {
        // Link storage is disabled, show empty message
        document.getElementById('empty-message').style.display = 'block';
        document.getElementById('link-list').style.display = 'none';
        return;
    }

    // Show limit notice
    const limitNotice = document.getElementById('limit-notice');
    if (limitNotice) {
        limitNotice.textContent = browser.i18n.getMessage('sidebarLimitNotice');
        limitNotice.style.display = 'block';
    }

    // Load and display links
    await loadAndDisplayLinks();

    // Set up event listeners
    setupEventListeners();
});

// Check if we're in a private window
async function checkPrivateWindow() {
    try {
        const windowInfo = await browser.windows.getCurrent();
        return windowInfo.incognito || false;
    } catch (err) {
        console.log('Error checking private window status:', err);
        return false;
    }
}

// Load links from storage and display them
async function loadAndDisplayLinks() {
    try {
        const result = await browser.storage.local.get('linkStorage');
        const links = result.linkStorage || [];
        
        const linkList = document.getElementById('link-list');
        const emptyMessage = document.getElementById('empty-message');
        
        if (links.length === 0) {
            emptyMessage.style.display = 'block';
            linkList.style.display = 'none';
            return;
        }
        
        emptyMessage.style.display = 'none';
        linkList.style.display = 'flex';
        linkList.innerHTML = '';
        
        // Sort links by timestamp (newest first)
        links.sort((a, b) => b.timestamp - a.timestamp);
        
        for (const link of links) {
            const card = createLinkCard(link);
            linkList.appendChild(card);
        }
    } catch (err) {
        console.log('Error loading links:', err);
    }
}

// Format timestamp for display
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Format time for display
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get format label for tooltip
function getFormatLabel(format) {
    if (format === 'markdown') return browser.i18n.getMessage('sidebarCopyTooltipMarkdown');
    if (format === 'html') return browser.i18n.getMessage('sidebarCopyTooltipHtml');
    return browser.i18n.getMessage('sidebarCopyTooltipUrl');
}

// Get feedback message based on format
function getFeedbackMessage(format) {
    if (format === 'markdown') return browser.i18n.getMessage('sidebarCopiedFeedbackMarkdown');
    if (format === 'html') return browser.i18n.getMessage('sidebarCopiedFeedbackHtml');
    return browser.i18n.getMessage('sidebarCopiedFeedbackUrl');
}

// Show feedback message in card
function showFeedback(card, message, isSuccess = true) {
    // Remove any existing feedback
    const existingFeedback = card.querySelector('.feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'feedback ' + (isSuccess ? 'success' : 'error');
    feedbackEl.textContent = message;
    
    // Position it in the actions container
    const actionsEl = card.querySelector('.actions');
    if (actionsEl) {
        actionsEl.appendChild(feedbackEl);
        
        // Make it visible
        setTimeout(() => {
            feedbackEl.classList.add('visible');
        }, 10);
        
        // Hide and remove after 2 seconds
        setTimeout(() => {
            feedbackEl.classList.remove('visible');
            setTimeout(() => {
                feedbackEl.remove();
            }, 200);
        }, 2000);
    }
}

// Clean URL using background's cleanAndDeco logic
function cleanAndDeco(url) {
    if (!url) return url;
    
    // Simple decode
    let result = url;
    if (oPrefsGlobal.decode) {
        try {
            result = decodeURI(result);
        } catch (e) {
            console.log('Error decoding URI:', e);
        }
    }
    
    // Simple clean (remove tracking params)
    if (oPrefsGlobal.cleanLinks) {
        try {
            // Basic cleaning - remove common tracking parameters
            const urlObj = new URL(result);
            const trackingParams = ['utm_', 'fbclid', 'gclid', 'mc_cid', 'mc_eid', 'affiliate', 'campaign', 'source', 'medium'];
            
            trackingParams.forEach(param => {
                for (const key of urlObj.searchParams.keys()) {
                    if (key.includes(param)) {
                        urlObj.searchParams.delete(key);
                    }
                }
            });
            
            result = urlObj.toString();
        } catch (e) {
            console.log('Error cleaning URL:', e);
        }
    }
    
    return result;
}

// Create a link card element
function createLinkCard(link) {
    const card = document.createElement('div');
    card.className = 'link-card';
    card.dataset.id = link.id;

    // Date and time row
    const dateEl = document.createElement('div');
    dateEl.className = 'date';
    dateEl.textContent = formatDate(link.timestamp) + ' ' + formatTime(link.timestamp);
    card.appendChild(dateEl);

    // Title
    const titleEl = document.createElement('div');
    titleEl.className = 'title';
    const titleLink = document.createElement('a');
    titleLink.href = link.displayUrl || link.url;
    titleLink.textContent = link.title || link.displayUrl || link.url;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener';
    titleEl.appendChild(titleLink);
    card.appendChild(titleEl);

    // URL
    const urlEl = document.createElement('div');
    urlEl.className = 'url';
    const urlLink = document.createElement('a');
    urlLink.href = link.displayUrl || link.url;
    urlLink.textContent = link.displayUrl || link.url;
    urlLink.target = '_blank';
    urlLink.rel = 'noopener';
    urlEl.appendChild(urlLink);
    card.appendChild(urlEl);

    // Original link (if different from display URL)
    if (link.originalUrl && link.originalUrl !== link.displayUrl && link.originalUrl !== link.url) {
        const originalEl = document.createElement('div');
        originalEl.className = 'original-link';
        const originalText = document.createTextNode(browser.i18n.getMessage('sidebarOriginalLink') + ': ');
        const originalLink = document.createElement('a');
        originalLink.href = link.originalUrl;
        originalLink.textContent = link.originalUrl;
        originalLink.target = '_blank';
        originalLink.rel = 'noopener';
        originalEl.appendChild(originalText);
        originalEl.appendChild(originalLink);
        card.appendChild(originalEl);
    }

    // Actions
    const actionsEl = document.createElement('div');
    actionsEl.className = 'actions';

    // Copy again button with icon
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy';
    copyBtn.innerHTML = '<img src="icons/copy-16.svg" alt="' + getFormatLabel(oPrefsGlobal.clickplain) + '">';
    copyBtn.title = getFormatLabel(oPrefsGlobal.clickplain);
    copyBtn.addEventListener('click', (event) => {
        // Check for modifier keys
        const format = oPrefsGlobal.clickplain;
        if (event.shiftKey && oPrefsGlobal.clickshift !== oPrefsGlobal.clickplain) {
            copyLinkAgain(link, oPrefsGlobal.clickshift);
        } else if (event.ctrlKey && oPrefsGlobal.clickctrl !== oPrefsGlobal.clickplain) {
            copyLinkAgain(link, oPrefsGlobal.clickctrl);
        } else {
            copyLinkAgain(link, oPrefsGlobal.clickplain);
        }
    });
    actionsEl.appendChild(copyBtn);

    // Bookmark button with icon
    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.className = 'bookmark';
    bookmarkBtn.innerHTML = '<img src="icons/bookmark-16.svg" alt="' + browser.i18n.getMessage('sidebarBookmarkTooltip') + '">';
    bookmarkBtn.title = browser.i18n.getMessage('sidebarBookmarkTooltip');
    bookmarkBtn.addEventListener('click', () => saveAsBookmark(link));
    actionsEl.appendChild(bookmarkBtn);

    // Delete button with icon
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.innerHTML = '<img src="icons/delete-16.svg" alt="' + browser.i18n.getMessage('sidebarDeleteTooltip') + '">';
    deleteBtn.title = browser.i18n.getMessage('sidebarDeleteTooltip');
    deleteBtn.addEventListener('click', () => deleteLink(link.id));
    actionsEl.appendChild(deleteBtn);

    card.appendChild(actionsEl);

    return card;
}

// Save link as bookmark
async function saveAsBookmark(link) {
    try {
        // Use the display URL if available, otherwise the original URL
        const urlToBookmark = link.displayUrl || link.url;
        const title = link.title || link.displayUrl || link.url;
        
        // Use browser.bookmarks API to create a bookmark
        await browser.bookmarks.create({
            title: title,
            url: urlToBookmark
        });
        
        // Show feedback message
        const card = document.querySelector(`.link-card[data-id="${link.id}"]`);
        if (card) {
            showFeedback(card, browser.i18n.getMessage('sidebarBookmarkedFeedback'), true);
        }
    } catch (err) {
        console.log('Error saving as bookmark:', err);
        // Show error feedback
        const card = document.querySelector(`.link-card[data-id="${link.id}"]`);
        if (card) {
            showFeedback(card, browser.i18n.getMessage('sidebarBookmarkError'), false);
        }
    }
}

// Copy a link again with specified format
async function copyLinkAgain(link, format = null) {
    try {
        const effectiveFormat = format || oPrefsGlobal.clickplain;
        const url = cleanAndDeco(link.displayUrl || link.url);
        const title = link.title || link.displayUrl || link.url;
        
        let textToCopy;
        if (effectiveFormat === 'html') {
            textToCopy = '<a href="' + url + '">' + title + '</a>';
        } else if (effectiveFormat === 'markdown') {
            textToCopy = '[' + title + '](' + url + ')';
        } else {
            textToCopy = url;
        }
        
        await navigator.clipboard.writeText(textToCopy);
        
        // Show appropriate feedback message
        const card = document.querySelector(`.link-card[data-id="${link.id}"]`);
        if (card) {
            showFeedback(card, getFeedbackMessage(effectiveFormat), true);
        }
    } catch (err) {
        console.log('Error copying link:', err);
        // Show error feedback
        const card = document.querySelector(`.link-card[data-id="${link.id}"]`);
        if (card) {
            showFeedback(card, 'Error copying', false);
        }
    }
}

// Delete a single link
async function deleteLink(linkId) {
    try {
        const result = await browser.storage.local.get('linkStorage');
        let links = result.linkStorage || [];
        
        // Filter out the link to delete
        links = links.filter(link => link.id !== linkId);
        
        await browser.storage.local.set({ linkStorage: links });
        
        // Refresh the display
        await loadAndDisplayLinks();
    } catch (err) {
        console.log('Error deleting link:', err);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Clear all button
    document.getElementById('clear-all').addEventListener('click', async () => {
        const confirmed = confirm(browser.i18n.getMessage('sidebarClearAllConfirm'));
        if (confirmed) {
            await clearAllLinks();
        }
    });

    // Open settings button
    document.getElementById('open-settings').addEventListener('click', () => {
        browser.runtime.openOptionsPage();
    });
}

// Clear all links
async function clearAllLinks() {
    try {
        await browser.storage.local.set({ linkStorage: [] });
        await loadAndDisplayLinks();
    } catch (err) {
        console.log('Error clearing all links:', err);
    }
}

// Listen for storage changes (e.g., when a new link is added from background)
browser.storage.onChanged.addListener(async (changes, area) => {
    if (area === 'local' && changes.linkStorage) {
        // Check if we're still in a private window
        const isPrivate = await checkPrivateWindow();
        if (!isPrivate) {
            await loadAndDisplayLinks();
        }
    }
});
