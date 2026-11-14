/* ==========================================================
   ETILLER · Comportamiento
   ========================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Imágenes: fallback si no existen los archivos ---------- */
  $$('img[data-fallback]').forEach((img) => {
    const fallbackId = img.dataset.fallback;
    const showFallback = () => {
      img.style.display = 'none';
      if (fallbackId === 'wordmark-logo') {
        const wm = img.nextElementSibling;
        if (wm) wm.hidden = false;
      } else if (fallbackId === 'promo-fallback') {
        const fb = img.nextElementSibling;
        if (fb) fb.hidden = false;
      }
    };
    img.addEventListener('error', showFallback, { once: true });
    if (img.complete && img.naturalWidth === 0) showFallback();
  });

  /* ---------- Cabecera: sombra al hacer scroll ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const toggle = $('#menuToggle');
  const nav = $('#mainNav');

  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tancar el menú' : 'Obrir el menú');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Desplazamiento suave con compensación de cabecera ---------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id === '') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 8;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: id === '#top' || id === '#inici' ? 0 : y, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Enlace activo según la sección visible ---------- */
  const sections = ['inici', 'nosaltres', 'productes', 'contacte']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = $$('.nav-link');

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Revelado al hacer scroll ---------- */
  const revealEls = $$('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => revealObs.observe(el));

  /* ---------- Hojas cayendo en la portada ---------- */
  const leavesBox = $('#leaves');
  if (leavesBox && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const count = window.innerWidth < 600 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('span');
      leaf.className = 'leaf' + (i % 2 ? ' alt' : '');
      const size = 14 + Math.random() * 22;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.animationDuration = `${9 + Math.random() * 9}s`;
      leaf.style.animationDelay = `${-Math.random() * 15}s`;
      leavesBox.appendChild(leaf);
    }
  }

  /* ---------- Filtro de productos ---------- */
  const filterBtns = $$('.filter-btn');
  const cards = $$('.product-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.toggle('active', b === btn));
      cards.forEach((card) => {
        const show = type === 'tots' || card.dataset.type === type;
        card.hidden = !show;
      });
    });
  });

  /* ---------- Modal de información de producto ---------- */
  const PRODUCTS = {
    ginger: {
      tag: 'Gasosa · 33 cl',
      name: 'Ginger Beer de Barril',
      desc: 'Gingebre fresc pelat a mà, llima de Màlaga i un toc de mel de bruc. Fermentem 14 dies en barrils de roure i després la refredem a -2 °C per a una efervescència fina.',
      facts: ['Sense alcohol · 0,0 %', 'Sense colorants ni conservants', 'Intensitat picant: mitjana'],
      price: '2,80 €'
    },
    cola: {
      tag: 'Gasosa · 33 cl',
      name: 'Cola de Canyella Artesana',
      desc: 'Canyella de Ceilan, vainilla de Madagascar i ràmes de taronja. Una cola amb cos, dolça però equilibrada, pensada per acompanyar el menjar.',
      facts: ['Sense alcohol · 0,0 %', 'Sucre de canya integral', 'Ideal amb gel i una llimona'],
      price: '3,20 €'
    },
    llimonada: {
      tag: 'Gasosa · 33 cl',
      name: 'Llimonada de Fusta',
      desc: 'Llimona de Sicília reposada 48 hores en roure amb menta de l\'hort. Refrescant, aromàtica i amb un final lleugerament amargant.',
      facts: ['Sense alcohol · 0,0 %', 'Llimona de cultiu ecològic', 'Millor servida molt freda'],
      price: '2,50 €'
    },
    te: {
      tag: 'Infusió · 33 cl',
      name: 'Té Fred de Poma i Mel',
      desc: 'Te verd japonès infusionat en fred durant 12 hores amb poma reineta i mel de bruc. Suau, fresc i sense cap rastre de sucre afegit.',
      facts: ['Sense alcohol · 0,0 %', 'Cafeïna natural moderada', 'Sense sucres afegits'],
      price: '2,90 €'
    },
    kombucha: {
      tag: 'Fermentada · 33 cl',
      name: 'Kombucha de Taronja Torrada',
      desc: 'Te fermentat amb taronja torrada al forn i un fons de canyella. Lleugerament àcid, amb bombolles naturals i un perfil molt net.',
      facts: ['Sense alcohol · 0,0 %', 'Cultiu viu de fermentació', 'Conservar entre 4 i 8 °C'],
      price: '3,60 €'
    },
    tonica: {
      tag: 'Gasosa · 25 cl',
      name: 'Tònica Botànica',
      desc: 'Quinina natural, enzim de poma i flors de saüc. Amarga just el necessari i és la companya perfecta d\'un aperitiu o d\'una tarda de tardor.',
      facts: ['Sense alcohol · 0,0 %', 'Quinina d\'origen natural', 'Ideal amb botànics i fruita'],
      price: '2,95 €'
    }
  };

  const modal = $('#productModal');
  const modalTag = $('#modalTag');
  const modalTitle = $('#modalTitle');
  const modalDesc = $('#modalDesc');
  const modalFacts = $('#modalFacts');
  const modalPrice = $('#modalPrice');

  const openProduct = (key) => {
    const p = PRODUCTS[key];
    if (!p) return;
    modalTag.textContent = p.tag;
    modalTitle.textContent = p.name;
    modalDesc.textContent = p.desc;
    modalFacts.innerHTML = p.facts.map((f) => `<li>${f}</li>`).join('');
    modalPrice.textContent = p.price;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  };

  $$('[data-product]').forEach((btn) => {
    btn.addEventListener('click', () => openProduct(btn.dataset.product));
  });

  const closeModal = () => {
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  };
  $$('[data-close]', modal).forEach((b) => b.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  /* ---------- Formulario de contacto ---------- */
  const form = $('#contactForm');
  const status = $('#formStatus');

  const rules = {
    nom: (v) => (v.trim().length >= 2 ? '' : 'Escriu el teu nom (mínim 2 lletres).'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Introdueix un correu electrònic vàlid.'),
    missatge: (v) => (v.trim().length >= 10 ? '' : 'El missatge ha de tenir almenys 10 caràcters.')
  };

  const validateField = (name) => {
    const input = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    const msg = rules[name] ? rules[name](input.value) : '';
    input.closest('.field').classList.toggle('invalid', Boolean(msg));
    if (error) error.textContent = msg;
    return !msg;
  };

  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener('blur', () => validateField(name));
    form.elements[name].addEventListener('input', () => {
      if (form.elements[name].closest('.field').classList.contains('invalid')) validateField(name);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) {
      status.textContent = 'Revisa els camps marcats abans d\'enviar.';
      status.style.color = '#f29b6b';
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviant…';
    status.style.color = '';
    status.textContent = '';

    // Simulació d'enviament (la web és de demostració; connecta aquí el teu servei real).
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Envia el missatge';
      status.style.color = 'var(--gold-light)';
      status.textContent = 'Gràcies! Hem rebut el teu missatge i et respondrem en 48 hores.';
    }, 1000);
  });
})();
