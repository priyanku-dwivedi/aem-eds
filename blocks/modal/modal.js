import { moveInstrumentation } from '../../scripts/scripts.js';

const DEFAULT_DURATION = 5;

export default function decorate(block) {
  const rows = [...block.children];
  const titleText = rows[0]?.textContent.trim() || '';
  const descriptionDiv = rows[1]?.querySelector('div');
  const view = rows[2]?.textContent.trim().toLowerCase() || 'normal';
  const duration = parseInt(rows[3]?.textContent.trim(), 10) || DEFAULT_DURATION;
  const isTimed = view === 'timed';

  const button = document.createElement('button');
  button.className = 'modal-trigger';
  button.textContent = titleText;
  button.setAttribute('aria-haspopup', 'dialog');
  if (rows[0]) moveInstrumentation(rows[0], button);

  const dialog = document.createElement('dialog');
  dialog.className = 'modal-dialog';
  if (isTimed) dialog.classList.add('modal-timed');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '\u00D7';

  const content = document.createElement('div');
  content.className = 'modal-dialog-content';
  if (descriptionDiv) {
    moveInstrumentation(rows[1], content);
    content.append(...descriptionDiv.childNodes);
  }

  dialog.append(closeBtn, content);

  if (isTimed) {
    const progressBar = document.createElement('div');
    progressBar.className = 'modal-timer-bar';
    dialog.append(progressBar);
  }

  let timerId = null;

  function clearAutoClose() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
    const bar = dialog.querySelector('.modal-timer-bar');
    if (bar) {
      bar.style.animationName = 'none';
    }
  }

  function startAutoClose() {
    clearAutoClose();
    const bar = dialog.querySelector('.modal-timer-bar');
    if (bar) {
      bar.style.animationDuration = `${duration}s`;
      bar.style.animationName = 'modal-timer-shrink';
    }
    timerId = setTimeout(() => {
      dialog.close();
    }, duration * 1000);
  }

  button.addEventListener('click', () => {
    dialog.showModal();
    if (isTimed) startAutoClose();
  });

  closeBtn.addEventListener('click', () => {
    clearAutoClose();
    dialog.close();
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      clearAutoClose();
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    clearAutoClose();
  });

  block.replaceChildren(button, dialog);
}
