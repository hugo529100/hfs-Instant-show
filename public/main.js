'use strict'; {
  const imageExts = ['jpg','jpeg','png','gif','webp','bmp'];
  const videoExts = ['mp4','webm','ogg','mkv','avi','mov','mp3','wav'];
  const htmlExts  = ['html','htm'];

  const getExt = name => name.split('.').pop().toLowerCase();
  const isImage = ext => imageExts.includes(ext);
  const isVideo = ext => videoExts.includes(ext);
  const isHTML  = ext => htmlExts.includes(ext);
  const isMedia = ext => isImage(ext) || isVideo(ext) || isHTML(ext);

  function bindMediaIcons() {
    document.querySelectorAll('li.file').forEach(li => {
      if (li.dataset.bound === '1') return;

      const a = li.querySelector('a[href]');
      const name = a?.textContent?.trim();
      const href = a?.getAttribute('href');
      const ext = getExt(name);
      if (!isMedia(ext)) return;

      let icon = null;
      if (isImage(ext)) {
        icon = li.querySelector('img.thumbnail');
      } else {
        icon = li.querySelector('span.icon');  // generic for video/audio/HTML
      }

      if (!icon) return;

      icon.style.cursor = 'pointer';
      icon.title = 'Click to preview';

      icon.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        const list = window.HFS?.state?.list || [];
        const entry = list.find(e => e.n === name);
        if (!entry) return console.warn('[media-autoshow] Entry not found:', name);

        if (!entry.uri && href) entry.uri = href;

        // For media, prepare next/prev navigation list (excluding HTML)
        const mediaList = list.filter(e => {
          const x = getExt(e.n);
          return isImage(x) || isVideo(x);
        });
        HFS.state.selected = mediaList.map(e => e.n);

        setTimeout(() => {
          if (isHTML(ext)) {
            console.log('[media-autoshow] Opening HTML file:', entry.uri);
            window.open(entry.uri, '_blank');
          } else {
            console.log('[media-autoshow] Previewing media:', entry.name);
            HFS.fileShow(entry, { startPlaying: true });
          }
        }, 0);
      }, true);

      li.dataset.bound = '1';
    });
  }

  bindMediaIcons();
  const observer = new MutationObserver(() => bindMediaIcons());
  observer.observe(document.body, { childList: true, subtree: true });
}
