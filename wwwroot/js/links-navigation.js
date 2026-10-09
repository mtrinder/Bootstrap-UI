(() => {
  const nav = document.getElementById('linksNav');
  if (!nav) return;

  const OPEN_DELAY = 120;
  const CLOSE_DELAY = 150;
  const desktop = window.matchMedia('(min-width: 992px)');
  let openTimer;
  let closeTimer;
  let current = null;

  // The dimming layer starts where the sticky bar ends, which changes while scrolling.
  const updateOffset = () => {
    nav.style.setProperty('--links-nav-bottom', `${nav.getBoundingClientRect().bottom}px`);
  };

  const close = () => {
    if (!current) return;
    current.classList.remove('is-open');
    nav.classList.remove('has-open-panel');
    current = null;
  };

  const open = (item) => {
    if (!desktop.matches || current === item) return;
    close();
    updateOffset();
    current = item;
    item.classList.add('is-open');
    nav.classList.add('has-open-panel');
  };

  nav.querySelectorAll('.has-panel').forEach((item) => {
    item.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(closeTimer);
      if (current) {
        open(item);
      } else {
        openTimer = setTimeout(() => open(item), OPEN_DELAY);
      }
    });

    item.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(openTimer);
      closeTimer = setTimeout(close, CLOSE_DELAY);
    });

    // Keyboard users reach the sub-links by tabbing from the link into its panel.
    item.addEventListener('focusin', () => open(item));
  });

  nav.addEventListener('focusout', (event) => {
    if (current && current.contains(event.target) && !current.contains(event.relatedTarget)) {
      close();
    }
  });

  nav.querySelector('.links-nav-overlay').addEventListener('click', close);

  document.addEventListener('click', (event) => {
    if (current && !nav.contains(event.target)) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  window.addEventListener('scroll', () => {
    if (current) updateOffset();
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!desktop.matches) {
      close();
    } else if (current) {
      updateOffset();
    }
  });
})();
