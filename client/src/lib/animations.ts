/**
 * Animates text being typed in a typewriter effect
 * @param element The DOM element to animate text in
 * @param text The text to animate
 * @param speed Speed of typing in milliseconds per character
 */
export function animateText(element: HTMLElement, text: string, speed = 30) {
  if (!element || !text) return;
  
  // Find or create a paragraph element for the animation
  let paragraph = element.querySelector('p');
  if (!paragraph) {
    paragraph = document.createElement('p');
    paragraph.className = 'typewriter-effect font-serif text-gray-700';
    element.appendChild(paragraph);
  }
  
  let index = 0;
  paragraph.textContent = '';
  
  function type() {
    if (index < text.length) {
      paragraph.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

/**
 * Highlights text by temporarily adding and removing a class
 * @param element The DOM element to highlight
 * @param className The class to add for highlighting
 * @param duration Duration of highlight in milliseconds
 */
export function highlightElement(element: HTMLElement, className: string, duration = 1000) {
  if (!element) return;
  
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}

/**
 * Creates a pulsing effect on an element
 * @param element The DOM element to pulse
 * @param className The class to add for pulsing
 * @param times Number of pulses
 * @param duration Duration of each pulse in milliseconds
 */
export function pulseElement(element: HTMLElement, className: string, times = 3, duration = 500) {
  if (!element) return;
  
  let count = 0;
  
  function pulse() {
    if (count < times) {
      element.classList.add(className);
      setTimeout(() => {
        element.classList.remove(className);
        setTimeout(pulse, duration / 2);
      }, duration / 2);
      count++;
    }
  }
  
  pulse();
}
