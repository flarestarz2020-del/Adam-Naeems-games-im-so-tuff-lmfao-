// ============================================================
//  MOM Finland — Services Hub JS
//  Handles: nav, quick nav highlighting, path filtering,
//           mobile menu, scroll animations
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile menu ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Quick nav active state on scroll ──
  const sections = document.querySelectorAll('.hub-section[id]');
  const quickNavBtns = document.querySelectorAll('.quick-nav-btn');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        quickNavBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.target === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ── Quick nav click → smooth scroll ──
  quickNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Path filter ──
  const pathBtns = document.querySelectorAll('.path-btn');
  pathBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pathBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const path = btn.dataset.path;

      sections.forEach(sec => {
        if (path === 'all') {
          sec.style.display = '';
        } else {
          const secPath = sec.dataset.path;
          sec.style.display = (!secPath || secPath === path || secPath === 'both') ? '' : 'none';
        }
      });
    });
  });

  // ── Read the query param for pre-selected path ──
  const params = new URLSearchParams(window.location.search);
  const initPath = params.get('path');
  if (initPath) {
    const matchBtn = document.querySelector(`.path-btn[data-path="${initPath}"]`);
    if (matchBtn) matchBtn.click();
  }

  // ── Scroll fade-up ──
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

});
