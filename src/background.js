// Background service worker for Key Jump extension

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getSettings') {
    chrome.storage.sync.get(['keyJumpSettings'], (result) => {
      sendResponse(result.keyJumpSettings || {});
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.type === 'saveSettings') {
    chrome.storage.sync.set({ keyJumpSettings: request.settings }, () => {
      sendResponse({ success: true });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.openUrlInNewTab) {
    chrome.tabs.create({ url: request.openUrlInNewTab });
    sendResponse({ success: true });
    return true;
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.get(['keyJumpSettings'], (result) => {
    if (!result.keyJumpSettings) {
      chrome.storage.sync.set({
        keyJumpSettings: {
          enabled: true,
          shortcuts: {
            next: 'j',
            prev: 'k',
            activate: 'Enter',
            clear: 'Escape'
          }
        }
      });
    }
  });
});

// Handle browser action clicks (if needed for additional functionality)
chrome.action.onClicked.addListener((tab) => {
  // Optional: inject content script programmatically if needed
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});
