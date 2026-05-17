(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const problemList = document.getElementById('problemList');
  const faqList = document.getElementById('faqList');

  /* ---- Sticky navbar blur ---- */
  function onScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    document.querySelectorAll('.navbar__link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- FAQ accordion (one open at a time) ---- */
  if (faqList) {
    const closeItem = (item) => {
      item.classList.remove('open');
      const btn = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (answer) answer.style.maxHeight = '0px';
    };

    const openItem = (item) => {
      item.classList.add('open');
      const btn = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
    };

    faqList.querySelectorAll('.faq__question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq__item');
        const isOpen = item.classList.contains('open');

        faqList.querySelectorAll('.faq__item.open').forEach(closeItem);

        if (!isOpen) {
          openItem(item);
        }
      });
    });

    window.addEventListener('resize', () => {
      faqList.querySelectorAll('.faq__item.open').forEach((item) => {
        const answer = item.querySelector('.faq__answer');
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
      });
    });
  }

  /* ---- Intersection Observer: fade-in sections ---- */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach((el) => fadeObserver.observe(el));

  /* ---- Staggered problem list ---- */
  if (problemList) {
    const lines = problemList.querySelectorAll('.problem__line');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    let revealed = false;

    const revealLines = () => {
      if (revealed) return;
      revealed = true;

      if (prefersReducedMotion || isMobile) {
        lines.forEach((line) => line.classList.add('visible'));
        return;
      }

      let lineIndex = 0;
      const intervalId = setInterval(() => {
        if (lineIndex < lines.length) {
          lines[lineIndex].classList.add('visible');
          lineIndex += 1;
        } else {
          clearInterval(intervalId);
        }
      }, 320);
    };

    const problemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealLines();
            problemObserver.unobserve(problemList);
          }
        });
      },
      { threshold: isMobile ? 0.15 : 0.25, rootMargin: '0px 0px -8% 0px' }
    );

    problemObserver.observe(problemList);

    /* Fallback if observer never fires */
    setTimeout(() => {
      if (!revealed && problemList.getBoundingClientRect().top < window.innerHeight) {
        revealLines();
      }
    }, 1500);
  }

  /* ---- Hero visible on load ---- */
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    requestAnimationFrame(() => heroContent.classList.add('visible'));
  }
})();
