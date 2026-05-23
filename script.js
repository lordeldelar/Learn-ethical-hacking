/* ============================================
   HACKERS WEBSITE — script.js
   المسؤول عن: الموسيقى + الأنيميشن + التفاعلات
   ============================================ */


/* ================================================
   1. الموسيقى — Music Player
   ================================================ */

// متغير لتتبع الصوت اللي شغال دلوقتي
let currentAudio = null;
let currentSource = null;

/**
 * playMusic(source)
 * source: 'lord' | 'aldelr' | 'hero'
 * لو نفس الصوت شغال → وقّفه
 * لو صوت تاني شغال → وقّفه وشغّل الجديد
 */
function playMusic(source) {
  const audio = document.getElementById('audio-' + source);
  if (!audio) return;

  // لو نفس الصوت شغال → وقّفه
  if (currentSource === source && currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentSource = null;
    currentAudio = null;
    removePlayingEffect(source);
    return;
  }

  // وقّف أي صوت تاني
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    removePlayingEffect(currentSource);
  }

  // شغّل الصوت الجديد
  audio.play().then(() => {
    currentAudio = audio;
    currentSource = source;
    addPlayingEffect(source);
  }).catch(() => {
    // لو المتصفح منع التشغيل التلقائي
    console.log('يحتاج تفاعل من المستخدم أولاً');
  });

  // لما الصوت يخلص
  audio.onended = () => {
    removePlayingEffect(source);
    currentAudio = null;
    currentSource = null;
  };
}

/* تأثير بصري على الصورة اللي بتعزف */
function addPlayingEffect(source) {
  // الصورة في الهيدر
  const avatarWrap = document.querySelector(`[onclick="playMusic('${source}')"]`);
  if (avatarWrap) {
    avatarWrap.classList.add('is-playing');
    const ring = avatarWrap.querySelector('.avatar-ring, .hero-ring-1');
    if (ring) ring.style.animationDuration = '0.8s';
  }
}

function removePlayingEffect(source) {
  const avatarWrap = document.querySelector(`[onclick="playMusic('${source}')"]`);
  if (avatarWrap) {
    avatarWrap.classList.remove('is-playing');
    const ring = avatarWrap.querySelector('.avatar-ring, .hero-ring-1');
    if (ring) ring.style.animationDuration = '';
  }
}

/* CSS للتأثير البصري أثناء التشغيل */
const musicStyle = document.createElement('style');
musicStyle.textContent = `
  .avatar-wrap.is-playing img {
    border-color: var(--gold) !important;
    box-shadow: 0 0 25px var(--gold-glow), 0 0 50px var(--red-glow) !important;
  }
  .hero-avatar-wrap.is-playing img {
    box-shadow: 0 0 50px var(--gold-glow), 0 0 100px var(--red-glow) !important;
  }
`;
document.head.appendChild(musicStyle);


/* ================================================
   2. Scroll Reveal — ظهور العناصر عند التمرير
   ================================================ */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // تأخير بسيط بين كل عنصر والتاني
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

/* Topic Blocks Observer — أبطأ شوية */
const topicObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        topicObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
);

function initObservers() {
  // عناصر الـ reveal العادية
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // بلوكات المواضيع
  document.querySelectorAll('.topic-block').forEach(el => {
    topicObserver.observe(el);
  });
}


/* ================================================
   3. Smooth Scroll للفهرس
   ================================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
}


/* ================================================
   4. Scroll Progress Bar — شريط تقدم التمرير
   ================================================ */

function initScrollProgress() {
  // إنشاء الشريط
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--red), var(--gold));
    z-index: 9998;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px var(--gold-glow);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = (scrollTop / docHeight) * 100;
    bar.style.width    = Math.min(progress, 100) + '%';
  }, { passive: true });
}


/* ================================================
   5. Back to Top Button — زر الرجوع للأعلى
   ================================================ */

function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '▲';
  btn.title = 'الرجوع للأعلى';
  btn.style.cssText = `
    position: fixed;
    bottom: 28px;
    left: 28px;
    width: 44px;
    height: 44px;
    background: var(--red);
    color: var(--gold);
    border: 1px solid var(--gold-dim);
    border-radius: 50%;
    font-size: 1rem;
    cursor: pointer;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s, background 0.3s;
    z-index: 500;
    font-family: monospace;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  document.body.appendChild(btn);

  // إظهار/إخفاء الزر
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(20px)';
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--black)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'var(--red)';
    btn.style.color = 'var(--gold)';
  });
}


/* ================================================
   6. Active Index Highlight
   يلوّن زر الفهرس لما المستخدم يكون عند الموضوع
   ================================================ */

function initActiveIndex() {
  const topics = document.querySelectorAll('.topic-block');
  const indexBtns = document.querySelectorAll('.index-btn');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id; // topic-1, topic-2 ...
          const num = id.split('-')[1];

          // أزل active من كل الأزرار
          indexBtns.forEach(btn => {
            btn.style.borderColor = '';
            btn.style.background = '';
            btn.querySelector('.index-num').style.color = '';
          });

          // ضع active على الزر المناسب
          const activeBtn = document.querySelector(`.index-btn[href="#${id}"]`);
          if (activeBtn) {
            activeBtn.style.borderColor = 'var(--gold)';
            activeBtn.style.background = 'rgba(201,168,76,0.08)';
            activeBtn.querySelector('.index-num').style.color = 'var(--gold)';
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  topics.forEach(t => observer.observe(t));
}


/* ================================================
   7. Loading Placeholder Style
   ================================================ */

const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
  .loading-placeholder {
    color: var(--text-muted);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    letter-spacing: 2px;
    padding: 20px 0;
    animation: pulse-text 1.5s ease-in-out infinite;
  }

  @keyframes pulse-text {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1; }
  }
`;
document.head.appendChild(loadingStyle);


/* ================================================
   8. تأثير الكتابة في Hero (Typewriter)
   ================================================ */

function initTypewriter() {
  const subEl = document.querySelector('.hero-sub');
  if (!subEl) return;

  const texts = [
    'الحقيقة التي لا يريدونك أن تعرفها',
    'عالم من الظلام والضوء',
    'المعرفة هي السلاح الحقيقي',
    'ادخل عالم الهكرز...',
  ];

  let textIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;

  function type() {
    const current = texts[textIndex];

    if (!isDeleting) {
      subEl.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      subEl.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }

    setTimeout(type, isDeleting ? 35 : 65);
  }

  type();
}


/* ================================================
   9. تأثير الـ Glitch على عنوان الـ Hero
   ================================================ */

function initGlitch() {
  const titleAr = document.querySelector('.hero-title-ar');
  if (!titleAr) return;

  setInterval(() => {
    if (Math.random() > 0.85) {
      titleAr.style.textShadow = `
        3px 0 var(--red),
        -3px 0 var(--gold),
        0 0 40px var(--red-glow)
      `;
      titleAr.style.transform = `translateX(${Math.random() * 4 - 2}px)`;

      setTimeout(() => {
        titleAr.style.textShadow = '0 0 40px var(--red-glow)';
        titleAr.style.transform = 'translateX(0)';
      }, 80);
    }
  }, 2500);
}


/* ================================================
   10. تشغيل كل الوظائف لما الصفحة تتحمل
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initObservers();
  initSmoothScroll();
  initScrollProgress();
  initBackToTop();
  initActiveIndex();
  initTypewriter();
  initGlitch();

  console.log('%c HACKERS WEBSITE LOADED ', 'background:#8b0000;color:#c9a84c;font-size:14px;padding:8px 16px;font-family:monospace;');
});
