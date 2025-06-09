function findClickableElements() {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'details > summary',
    '[tabindex]:not([tabindex="-1"])',
    '[onclick]',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]',
    '[role="option"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="switch"]',
    '[role="slider"]',
    '[role="spinbutton"]',
    'label[for]',
    'area[href]',
    '[contenteditable="true"]',
    'video[controls]',
    'audio[controls]',
    // Additional selectors for common clickable patterns
    '[jsaction]',
    '[data-ved]',
    'div[onclick]',
    'span[onclick]',
    'div[role="button"]',
    'span[role="button"]',
    '[class*="button"]',
    '[class*="btn"]',
    '[class*="click"]'
  ].join(', ');
  
  const elements = document.querySelectorAll(selector);
  
  // Filter out hidden elements with improved visibility check
  return Array.from(elements).filter(element => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    // Basic visibility check - element must be rendered and in viewport
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           rect.width > 0 && 
           rect.height > 0 &&
           rect.top < window.innerHeight &&
           rect.bottom > 0 &&
           rect.left < window.innerWidth &&
           rect.right > 0;
  });
}

function showHints() {
  const elements = findClickableElements();
  elements.forEach((element, index) => {
    const hint = document.createElement('div');
    hint.textContent = index + 1;
    hint.className = 'keyjump-hint';
    element.appendChild(hint);
  });
}

function hideHints() {
  const hints = document.querySelectorAll('.keyjump-hint');
  hints.forEach(hint => hint.remove());
}

function jumpToElement(key) {
  const index = parseInt(key, 10) - 1;
  const elements = findClickableElements();
  const element = elements[index];
  if (element) {
    element.click();
  } else {
    return false;
  }
}
