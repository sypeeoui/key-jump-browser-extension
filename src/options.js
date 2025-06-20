/* globals _browser */
// _browser is defined in bootstrap-state.js

// Initialize

const state = {}

// Replace background page access with storage API
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

window.__KEYJUMP__.bootstrapState(state, setup)

// Stuff

function setup() {
  const activationShortcutInput = document.getElementById(
    'activationShortcutInput',
  )
  const newTabActivationShortcutInput = document.getElementById(
    'newTabActivationShortcutInput',
  )
  const autoTriggerCheckbox = document.getElementById('autoTrigger')
  const activateNewTabCheckbox = document.getElementById('activateNewTab')
  const ignoreWhileInputFocusedCheckbox = document.getElementById(
    'ignoreWhileInputFocused',
  )

  activationShortcutInput.placeholder = getShortcutText(
    state.options.activationShortcut,
  )
  newTabActivationShortcutInput.placeholder = getShortcutText(
    state.options.newTabActivationShortcut,
  )
  autoTriggerCheckbox.checked = state.options.autoTrigger
  activateNewTabCheckbox.checked = state.options.activateNewTab
  ignoreWhileInputFocusedCheckbox.checked =
    state.options.ignoreWhileInputFocused

  bindShortcutInput('activationShortcut', activationShortcutInput)
  bindShortcutInput('newTabActivationShortcut', newTabActivationShortcutInput)
  autoTriggerCheckbox.addEventListener('change', setAutoTrigger)
  activateNewTabCheckbox.addEventListener('change', setActivateNewTab)
  ignoreWhileInputFocusedCheckbox.addEventListener(
    'change',
    setIgnoreWhileInputFocused,
  )
}

function bindShortcutInput(optionsKey, inputElement) {
  inputElement.addEventListener('keydown', function setShortcut(event) {
    // Ignore Tab for accessibility reasons.
    if (event.key === 'Tab') {
      return
    }

    event.preventDefault()

    const shortcut = {
      key: event.key,
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
    }

    inputElement.placeholder = getShortcutText(shortcut)

    saveOptions({[optionsKey]: shortcut})
  })
}

function getShortcutText(shortcut) {
  let {key, metaKey, ctrlKey, altKey, shiftKey} = shortcut
  const parts = []

  if (metaKey) {
    switch (state.os) {
      case 'mac':
        parts.push('Command')
        break
      case 'win':
        parts.push('Win')
        break
      default:
        parts.push('Meta')
    }
  }

  ctrlKey && parts.push('Ctrl')
  altKey && parts.push('Alt')
  shiftKey && parts.push('Shift')

  if (!['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
    // Normalize all 1 character keys to uppercase because:
    // * The case varies depending on if the Shift key was used
    // * 1 character keys are usually displayed in uppercase on keyboards
    parts.push(key.length > 1 ? key : key.toLocaleUpperCase())
  }

  return parts.join(' + ')
}

function setAutoTrigger(event) {
  saveOptions({autoTrigger: event.target.checked})
}

function setActivateNewTab(event) {
  saveOptions({activateNewTab: event.target.checked})
}

function setIgnoreWhileInputFocused(event) {
  saveOptions({ignoreWhileInputFocused: event.target.checked})
}

function saveOptions(options) {
  _browser.storage.sync.set(options)
}

// Initialize options page
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await getSettings();
  // ...existing initialization code...
});
