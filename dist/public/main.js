'use strict';

const config = HFS.getPluginConfig?.() || {
  image: true,
  video: true,
  audio: false,
  other: false,
  otherExtensions: 'htm|html'
};

const safeConfig = {
  image: typeof config.image === 'boolean' ? config.image : true,
  video: typeof config.video === 'boolean' ? config.video : true,
  audio: typeof config.audio === 'boolean' ? config.audio : false,
  other: typeof config.other === 'boolean' ? config.other : false,
  otherExtensions: typeof config.otherExtensions === 'string' ? 
    config.otherExtensions : 'htm|html'
};

const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
const videoExts = ['mp4', 'webm', 'ogg', 'mkv', 'avi', 'mov'];
const audioExts = ['mp3', 'wav', 'flac'];
const otherExts = (safeConfig.otherExtensions || 'htm|html').split('|').map(e => e.trim().toLowerCase());

const getExt = name => {
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const isImage = ext => imageExts.includes(ext);
const isVideo = ext => videoExts.includes(ext);
const isAudio = ext => audioExts.includes(ext);
const isOther = ext => otherExts.includes(ext);

function bindMediaIcons() {
  document.querySelectorAll('li.file').forEach(li => {
    if (li.dataset.bound === '1') return;

    const a = li.querySelector('a[href]');
    if (!a) return;
    
    const name = a?.textContent?.trim();
    const href = a?.getAttribute('href');
    const ext = getExt(name);
    let category;

    if (isImage(ext)) category = 'image';
    else if (isVideo(ext)) category = 'video';
    else if (isAudio(ext)) category = 'audio';
    else if (isOther(ext)) category = 'other';
    else return;

    if (!safeConfig[category]) return;

    const icon = li.querySelector(isImage(ext) ? 'img.thumbnail' : 'span.icon');
    if (!icon) return;

    icon.style.cursor = 'pointer';
    icon.title = 'Click to preview';

    icon.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      
      // 解决 ARIA 可访问性警告
      if (document.activeElement) {
        document.activeElement.blur();
      }

      try {
        const list = window.HFS?.state?.list || [];
        const entry = list.find(e => e.n === name);
        if (!entry) return console.warn('[media-autoshow] Entry not found:', name);
        if (!entry.uri && href) entry.uri = href;

        const mediaList = list.filter(e => {
          const x = getExt(e.n);
          return isImage(x) || isVideo(x);
        });
        HFS.state.selected = mediaList.map(e => e.n);

        setTimeout(() => {
          if (category === 'other') {
            console.log('[media-autoshow] Opening other file:', entry.uri);
            window.open(entry.uri, '_blank');
          } else {
            console.log('[media-autoshow] Previewing media:', entry.name);
            HFS.fileShow(entry, { startPlaying: true });
          }
        }, 0);
      } catch (error) {
        console.error('[media-autoshow] Error:', error);
      }
    }, true);

    li.dataset.bound = '1';
  });
}

// 初始绑定
bindMediaIcons();

// 观察 DOM 变化
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      bindMediaIcons();
    }
  });
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});