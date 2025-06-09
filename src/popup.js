// Update chrome.extension.getBackgroundPage() calls
function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['keyJumpSettings'], (result) => {
      resolve(result.keyJumpSettings || {});
    });
  });
}

function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ keyJumpSettings: settings }, () => {
      resolve({ success: true });
    });
  });
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await getSettings();
  const enabledCheckbox = document.getElementById('enabled');
  const optionsButton = document.getElementById('options');
  
  // Set initial state
  enabledCheckbox.checked = settings.enabled !== false;
  
  // Handle enable/disable toggle
  enabledCheckbox.addEventListener('change', async () => {
    const newSettings = { ...settings, enabled: enabledCheckbox.checked };
    await saveSettings(newSettings);
    
    // Notify content script of change
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { 
      type: 'SETTINGS_UPDATED', 
      settings: newSettings 
    });
  });
  
  // Handle options button
  optionsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  const toggleButton = document.getElementById('toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      // Toggle functionality
    });
  }
});
