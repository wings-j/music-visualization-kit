/**
 * Create Audio
 * @return Audio
 */
function createAudio() {
  let existed = window.document.querySelector('audio');
  if (existed) {
    window.document.body.removeChild(existed);
  }

  let audio = new Audio('Cathy.ogg');
  audio.style.position = 'fixed';
  audio.style.left = '50%';
  audio.style.bottom = '20px';
  audio.style.transform = 'translate(-50%, 0)';
  audio.controls = true;
  audio.volume = 0.5;
  window.document.body.appendChild(audio);

  return audio;
}

export { createAudio };
