import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const titleText = rows[0]?.textContent.trim() || '';
  const descriptionDiv = rows[1]?.querySelector('div');

  const button = document.createElement('button');
  button.className = 'modal-trigger';
  button.textContent = titleText;
  button.setAttribute('aria-haspopup', 'dialog');
  moveInstrumentation(rows[0], button);

  const dialog = document.createElement('dialog');
  dialog.className = 'modal-dialog';

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

  button.addEventListener('click', () => {
    dialog.showModal();
  });

  closeBtn.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });

  block.replaceChildren(button, dialog);
}
