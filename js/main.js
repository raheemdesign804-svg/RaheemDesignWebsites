/* -------------------------------------------------------------------
   RAHEEM DESIGN - Main Client Interactivity & CMS Live Renderer
   ------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Load Dynamic CMS Data
  const cmsData = typeof getCMSData === 'function' ? getCMSData() : null;

  if (cmsData) {
    if (cmsData.themeColor) {
      applyThemeColor(cmsData.themeColor);
    }
    renderCMSContent(cmsData);
  }

  // ═══════════════════════════════════════════════════
  // MOUSE GLOW CURSOR EFFECT (Desktop Only)
  // ═══════════════════════════════════════════════════
  // Disable fake cursor on touch/mobile devices
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 768;
  if (!isTouchDevice) {
    initMouseGlowEffect();
  }

  function initMouseGlowEffect() {
    // Create cursor glow orb
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursor-glow';
    cursorGlow.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      top: 0; left: 0;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
      transition: background 0.5s ease;
      will-change: transform;
    `;
    document.body.appendChild(cursorGlow);

    // Create small dot cursor
    const cursorDot = document.createElement('div');
    cursorDot.id = 'cursor-dot';
    cursorDot.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      top: 0; left: 0;
      transform: translate(-50%, -50%);
      background: var(--primary);
      box-shadow: 0 0 12px var(--primary), 0 0 25px var(--primary-glow);
      transition: width 0.2s ease, height 0.2s ease, background 0.5s ease;
      will-change: transform;
    `;
    document.body.appendChild(cursorDot);

    // Create outer ring cursor
    const cursorRing = document.createElement('div');
    cursorRing.id = 'cursor-ring';
    cursorRing.style.cssText = `
      position: fixed;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99998;
      top: 0; left: 0;
      transform: translate(-50%, -50%);
      border: 2px solid var(--primary);
      opacity: 0.6;
      transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease, border-color 0.5s ease;
      will-change: transform;
    `;
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Move glow and dot instantly
      cursorGlow.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
      cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    });

    // Ring follows with delay (smooth lag)
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects on interactive elements
    document.querySelectorAll('a, button, .service-card, .pricing-card, .portfolio-card, .btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.width = '14px';
        cursorDot.style.height = '14px';
        cursorRing.style.width = '55px';
        cursorRing.style.height = '55px';
        cursorRing.style.opacity = '0.9';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.width = '10px';
        cursorDot.style.height = '10px';
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.opacity = '0.6';
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // FULL THEME COLOR APPLICATOR
  // Applies theme color to ALL CSS variables
  // ═══════════════════════════════════════════════════
  function applyThemeColor(colorHex) {
    if (!colorHex) return;
    const root = document.documentElement;
    root.style.setProperty('--primary', colorHex);
    root.style.setProperty('--primary-hover', colorHex);
    root.style.setProperty('--accent', colorHex);
    root.style.setProperty('--gradient-accent', `linear-gradient(135deg, ${colorHex} 0%, #ffffff 100%)`);
    root.style.setProperty('--accent-glow', hexToRgba(colorHex, 0.25));
    root.style.setProperty('--primary-glow', hexToRgba(colorHex, 0.4));
    root.style.setProperty('--shadow-glow', `0 0 30px ${hexToRgba(colorHex, 0.4)}`);
    root.style.setProperty('--border-hover', hexToRgba(colorHex, 0.65));

    // Also update cursor glow and dot in real-time
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorDot) {
      cursorDot.style.background = colorHex;
      cursorDot.style.boxShadow = `0 0 12px ${colorHex}, 0 0 25px ${hexToRgba(colorHex, 0.5)}`;
    }
    if (cursorRing) {
      cursorRing.style.borderColor = colorHex;
    }
    if (cursorGlow) {
      cursorGlow.style.background = `radial-gradient(circle, ${hexToRgba(colorHex, 0.35)} 0%, transparent 70%)`;
    }
  }

  // Helper: Convert HEX color to rgba string
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Navbar Scroll Glassmorphism Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Drawer Controls
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.overlay');

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
  if (overlay) overlay.addEventListener('click', toggleMobileMenu);

  document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) toggleMobileMenu();
    });
  });

  // Scroll Reveal Observer
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(reveal => revealObserver.observe(reveal));

  // Skill Bar Observer
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percentage = entry.target.getAttribute('data-percentage');
        entry.target.style.width = percentage;
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const service = document.getElementById('formService').value;
      const details = document.getElementById('formDetails').value.trim();

      if (!name || !phone || !email || !service || !details) {
        showToast("Please fill in all required fields.");
        return;
      }

      // Save to Admin Inbox
      if (typeof addInboxMessage === 'function') {
        addInboxMessage({ name, phone, email, service, details });
      }

      showToast(`Thank you, ${name}! Redirecting to WhatsApp...`);

      // WhatsApp redirect with form details
      const targetPhone = (cmsData && cmsData.contact && cmsData.contact.whatsappClean) ? cmsData.contact.whatsappClean : "923012455577";
      const message = `Hello RaheemDesign!%0A%0A*New Project Inquiry*%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Email:* ${encodeURIComponent(email)}%0A*Service:* ${encodeURIComponent(service)}%0A*Details:* ${encodeURIComponent(details)}`;
      
      setTimeout(() => {
        window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
        contactForm.reset();
      }, 1200);
    });
  }
});

// Render CMS Content dynamically into DOM
function renderCMSContent(cms) {
  // 1. Hero Content
  if (cms.hero) {
    const heroTag = document.getElementById('cmsHeroTag');
    if (heroTag) heroTag.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${cms.hero.tag}`;

    const heroHeadline = document.getElementById('cmsHeroHeadline');
    if (heroHeadline) {
      heroHeadline.innerHTML = `${cms.hero.headlineMain} <span class="text-gradient">${cms.hero.headlineGradient}</span> ${cms.hero.headlineEnd}`;
    }

    const heroSubtext = document.getElementById('cmsHeroSubtext');
    if (heroSubtext) heroSubtext.textContent = cms.hero.subtext;

    const heroBtn = document.getElementById('cmsHeroBtn');
    if (heroBtn) heroBtn.innerHTML = `${cms.hero.primaryBtnText} <i class="fa-solid fa-arrow-right"></i>`;

    const heroStats = document.getElementById('cmsHeroStats');
    if (heroStats && cms.hero.stats) {
      heroStats.innerHTML = cms.hero.stats.map(s => `
        <div class="hero-stat-item">
          <span class="hero-stat-number">${s.number}</span>
          <span class="hero-stat-label">${s.label}</span>
        </div>
      `).join('');
    }

    const b1Title = document.getElementById('cmsBadge1Title');
    const b1Desc = document.getElementById('cmsBadge1Desc');
    if (b1Title) b1Title.textContent = cms.hero.badge1Title;
    if (b1Desc) b1Desc.textContent = cms.hero.badge1Desc;

    const b2Title = document.getElementById('cmsBadge2Title');
    const b2Desc = document.getElementById('cmsBadge2Desc');
    if (b2Title) b2Title.textContent = cms.hero.badge2Title;
    if (b2Desc) b2Desc.textContent = cms.hero.badge2Desc;
  }

  // 2. Services Grid
  if (cms.services) {
    const servicesGrid = document.getElementById('cmsServicesGrid');
    if (servicesGrid) {
      servicesGrid.innerHTML = cms.services.map(s => `
        <div class="service-card reveal active">
          <div class="service-icon">${s.iconSvg || '<i class="fa-solid fa-gears"></i>'}</div>
          <h3 class="service-title">${s.title}</h3>
          <p class="service-desc">${s.desc}</p>
        </div>
      `).join('');
    }
  }

  // 3. Services Packages
  if (cms.packages) {
    const packagesGrid = document.getElementById('cmsPackagesGrid');
    if (packagesGrid) {
      const waNumber = cms.contact ? cms.contact.whatsappClean : "923012455577";
      packagesGrid.innerHTML = cms.packages.map(p => `
        <div class="pricing-card ${p.isPopular ? 'popular' : ''} reveal active">
          ${p.isPopular ? `<div class="popular-badge">${p.popularBadge || 'POPULAR'}</div>` : ''}
          <div>
            <div class="pricing-tag">${p.tag}</div>
            <h3 class="pricing-title">${p.name}</h3>
            <ul class="pricing-features">
              ${p.features.map(f => `<li><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> ${f}</li>`).join('')}
            </ul>
          </div>
          <a href="https://wa.me/${waNumber}?text=Hi%20Raheem,%20I%20want%20to%20inquire%20about%20the%20${encodeURIComponent(p.name)}%20Package." target="_blank" class="btn-enroll ${p.isPopular ? 'btn-fill' : 'btn-outline'}">
            ${p.btnText || 'Choose Package'}
          </a>
        </div>
      `).join('');
    }
  }

  // 4. Portfolio Projects Grid
  if (cms.projects) {
    const projectsGrid = document.getElementById('cmsProjectsGrid');
    if (projectsGrid) {
      renderPortfolioProjects(cms.projects);
    }
  }

  // 5. Client Reviews
  if (cms.reviews) {
    const reviewsGrid = document.getElementById('cmsReviewsGrid');
    if (reviewsGrid) {
      reviewsGrid.innerHTML = cms.reviews.map(r => `
        <div class="pricing-card reveal active" style="min-height: 220px; padding: 2rem;">
          <div style="color: #82C22B; margin-bottom: 0.75rem;">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <p style="color: #a3b3cc; font-style: italic; font-size: 0.95rem; margin-bottom: 1.25rem;">"${r.text}"</p>
          <div style="margin-top: auto;">
            <strong style="color: #ffffff; display: block; font-size: 1.05rem;">${r.clientName}</strong>
            <span style="color: #82C22B; font-size: 0.85rem;">${r.clientRole}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // 6. Contact Settings
  if (cms.contact) {
    const waVal = document.getElementById('cmsCntWhatsAppVal');
    const waBtn = document.getElementById('cmsCntWhatsAppBtn');
    if (waVal) waVal.textContent = `WhatsApp: ${cms.contact.whatsappNumber}`;
    if (waBtn) waBtn.href = `https://wa.me/${cms.contact.whatsappClean}`;

    const emailVal = document.getElementById('cmsCntEmailVal');
    const emailBtn = document.getElementById('cmsCntEmailBtn');
    if (emailVal) emailVal.textContent = cms.contact.email;
    if (emailBtn) emailBtn.href = `mailto:${cms.contact.email}`;

    const addressVal = document.getElementById('cmsCntAddressVal');
    if (addressVal) addressVal.textContent = cms.contact.address;

    const mapFrame = document.getElementById('cmsCntMapIframe');
    if (mapFrame && cms.contact.mapEmbedUrl) mapFrame.src = cms.contact.mapEmbedUrl;

    const footerEmail = document.getElementById('cmsFooterEmail');
    const footerWA = document.getElementById('cmsFooterWhatsApp');
    const footerAddress = document.getElementById('cmsFooterAddress');

    if (footerEmail) footerEmail.textContent = cms.contact.email;
    if (footerWA) footerWA.textContent = cms.contact.whatsappNumber;
    if (footerAddress) footerAddress.textContent = cms.contact.address;
  }
}

// ─────────────────────────────────────────────────────
// Portfolio Preview Scroll System
// ─────────────────────────────────────────────────────

// Per-wrapper state map
const _portfolioState = new WeakMap();

/**
 * Start the smooth auto-scroll animation inside a wrapper element.
 * Uses requestAnimationFrame so the main page scroll is never affected.
 */
function _startPreviewScroll(wrapper) {
  let state = _portfolioState.get(wrapper);
  if (!state) return;
  if (state.rafId) return; // already running

  wrapper.classList.add('is-scrolling');

  const SPEED = 0.9; // px per frame (~55px/sec at 60fps) - smooth website scroll preview

  function step() {
    if (!state.active) {
      _stopPreviewScroll(wrapper);
      return;
    }

    const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
    if (wrapper.scrollTop >= maxScroll - 1) {
      // Reached bottom — pause briefly then reset to top
      state.rafId = null;
      wrapper.classList.remove('is-scrolling');
      setTimeout(() => {
        if (state.active) {
          wrapper.scrollTop = 0;
          _startPreviewScroll(wrapper);
        }
      }, 1200);
      return;
    }

    wrapper.scrollTop += SPEED;
    state.rafId = requestAnimationFrame(step);
  }

  state.rafId = requestAnimationFrame(step);
}

/**
 * Stop the animation but keep scroll position.
 */
function _stopPreviewScroll(wrapper) {
  const state = _portfolioState.get(wrapper);
  if (!state) return;
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
  state.active = false;
  wrapper.classList.remove('is-scrolling');
}

/**
 * Attach all hover / click / touch listeners to one wrapper.
 */
function _bindPreviewListeners(wrapper) {
  const state = { active: false, rafId: null, clickToggled: false };
  _portfolioState.set(wrapper, state);

  // ── Mouse hover ──
  wrapper.addEventListener('mouseenter', () => {
    // Only auto-scroll if the user didn't manually toggle off via click
    if (!state.clickToggled) {
      state.active = true;
      _startPreviewScroll(wrapper);
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    if (!state.clickToggled) {
      state.active = false;
      _stopPreviewScroll(wrapper);
    }
  });

  // ── Click toggle ──
  wrapper.addEventListener('click', (e) => {
    // Don't interfere with "View Details" button inside the card
    if (e.target.closest('button')) return;

    state.clickToggled = !state.clickToggled;

    if (state.clickToggled) {
      state.active = true;
      _startPreviewScroll(wrapper);
    } else {
      state.active = false;
      _stopPreviewScroll(wrapper);
    }
  });

  // ── Touch / mobile ──
  let _touchStartY = 0;
  wrapper.addEventListener('touchstart', (e) => {
    _touchStartY = e.touches[0].clientY;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    const dy = Math.abs(_touchStartY - e.changedTouches[0].clientY);
    // If it was a tap (not a swipe), toggle scroll
    if (dy < 10) {
      state.clickToggled = !state.clickToggled;
      if (state.clickToggled) {
        state.active = true;
        _startPreviewScroll(wrapper);
      } else {
        state.active = false;
        _stopPreviewScroll(wrapper);
      }
    }
  }, { passive: true });

  // Allow manual finger-drag inside wrapper without interfering with page scroll
  wrapper.addEventListener('touchmove', (e) => {
    // Do NOT call e.stopPropagation() — let the browser handle naturally
  }, { passive: true });
}

// Helper: Render full mini website preview layout with actual full-length screenshot image
function renderUniqueProjectWebPagePreview(p) {
  const cleanSlug = p.cleanSlug || (p.title ? p.title.toLowerCase().replace(/[^a-z0-9]/g, '') : 'preview');
  const domain = `https://${cleanSlug}.com`;
  
  return `
    <div class="browser-topbar">
      <div class="browser-dots">
        <span class="browser-dot red"></span>
        <span class="browser-dot yellow"></span>
        <span class="browser-dot green"></span>
      </div>
      <div class="browser-url">
        <i class="fa-solid fa-lock" style="font-size:0.55rem; margin-right:4px; color:#82C22B;"></i>${domain}
      </div>
    </div>
    <div class="portfolio-web-page">
      <img src="${p.imgUrl}" alt="${p.title}" class="portfolio-scroll-img" loading="lazy">
    </div>
  `;
}

// Render portfolio items with Filter capability
function renderPortfolioProjects(projects) {
  const container = document.getElementById('cmsProjectsGrid');
  if (!container) return;

  container.innerHTML = projects.map(p => `
    <div class="portfolio-card reveal active" data-category="${p.category}">
      <div class="portfolio-img-wrapper" data-proj-id="${p.id}">
        ${renderUniqueProjectWebPagePreview(p)}
        <div class="portfolio-overlay">
          <span class="scroll-indicator-badge">
            <i class="fa-solid fa-arrows-up-down"></i> Hover or Tap to Scroll
          </span>
        </div>
      </div>
      <div class="portfolio-content">
        <div class="portfolio-category">${p.category}</div>
        <h3 class="portfolio-title">${p.title}</h3>
        <p class="portfolio-desc">${p.desc}</p>
        <div style="display: flex; gap: 0.65rem; margin-top: 1.15rem; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" onclick="openProjectModalByObj(${p.id})">
            <i class="fa-solid fa-up-right-and-down-left-from-center"></i> View Details
          </button>
          <a href="https://wa.me/923012455577?text=Hi%20Raheem,%20I%20want%20to%20order%20a%20website%20like%20${encodeURIComponent(p.title)}" target="_blank" class="btn btn-secondary btn-sm">
            <i class="fa-brands fa-whatsapp"></i> Inquire
          </a>
        </div>
      </div>
    </div>
  `).join('');
  // Bind scroll listeners to every wrapper
  container.querySelectorAll('.portfolio-img-wrapper').forEach(wrapper => {
    _bindPreviewListeners(wrapper);
  });

  // Re-bind Category Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const cards = container.querySelectorAll('.portfolio-card');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    };
  });
}

// Legacy toggle function kept for any inline onclick references
function togglePortfolioScroll(wrapper, projId) {
  // no-op — handled by _bindPreviewListeners now
}


// Open Lightbox Modal by Project ID
function openProjectModalByObj(id) {
  const cmsData = typeof getCMSData === 'function' ? getCMSData() : null;
  if (!cmsData || !cmsData.projects) return;

  const proj = cmsData.projects.find(p => p.id === id);
  if (!proj) return;

  const modal = document.getElementById('projectModal');
  document.getElementById('modalCategory').textContent = proj.category;
  document.getElementById('modalTitle').textContent = proj.title;
  document.getElementById('modalImg').src = proj.imgUrl;
  document.getElementById('modalDesc').textContent = proj.desc;

  const featuresUl = document.getElementById('modalFeatures');
  featuresUl.innerHTML = (proj.features || [
    "Interactive Layout",
    "100% Mobile Responsive",
    "Lead Capture Setup",
    "SEO & Speed Optimized"
  ]).map(f => `<li><i class="fa-solid fa-circle-check" style="color: #82C22B;"></i> ${f}</li>`).join('');

  const modalWABtn = document.getElementById('modalWhatsAppBtn');
  const waClean = cmsData.contact ? cmsData.contact.whatsappClean : "923012455577";
  if (modalWABtn) {
    modalWABtn.href = `https://wa.me/${waClean}?text=Hi%20Raheem,%20I%20want%20to%20inquire%20about%20the%20${encodeURIComponent(proj.title)}%20project.`;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Modal Close logic
document.addEventListener('click', (e) => {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close') || e.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Toast notification helper
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #82C22B;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ═══════════════════════════════════════════════════
// HERO INTERACTIVE DEV CARD MOUSE CLICK MOTION
// ═══════════════════════════════════════════════════
function initInteractiveDevCard() {
  const card = document.getElementById('heroInteractiveDevCard');
  if (!card) return;

  const progressFill = document.getElementById('devProgressFill');
  const progressPercent = document.getElementById('devProgressPercent');
  const techBoxes = card.querySelectorAll('.tech-item-box');

  let currentTargetProgress = 85;

  function triggerMotion(targetPercent) {
    // 1. Trigger card spring motion bounce
    card.classList.remove('card-click-motion');
    void card.offsetWidth; // Force reflow
    card.classList.add('card-click-motion');
    setTimeout(() => {
      card.classList.remove('card-click-motion');
    }, 650);

    // 2. Animate progress bar fill up
    if (progressFill) {
      progressFill.style.transition = 'none';
      progressFill.style.width = '0%';
      setTimeout(() => {
        progressFill.style.transition = 'width 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)';
        progressFill.style.width = targetPercent + '%';
      }, 50);
    }

    // 3. Number count-up animation for percentage text
    if (progressPercent) {
      const duration = 650;
      const startTime = performance.now();

      function updateCount(now) {
        const elapsed = now - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        const currentVal = Math.floor(progressRatio * targetPercent);
        progressPercent.textContent = currentVal + '%';

        if (progressRatio < 1) {
          requestAnimationFrame(updateCount);
        } else {
          progressPercent.textContent = targetPercent + '%';
        }
      }
      requestAnimationFrame(updateCount);
    }
  }

  // Handle click on card or tech boxes inside card
  card.addEventListener('click', (e) => {
    const techBox = e.target.closest('.tech-item-box');
    if (techBox) {
      techBoxes.forEach(b => b.classList.remove('active'));
      techBox.classList.add('active');
      const val = parseInt(techBox.getAttribute('data-progress')) || 85;
      currentTargetProgress = val;
      triggerMotion(val);
    } else {
      triggerMotion(currentTargetProgress);
    }
  });
}

// Auto init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInteractiveDevCard);
} else {
  initInteractiveDevCard();
}
