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

  /* ---------- Control d'edat ---------- */
  const ageGate = document.getElementById('ageGate');
  const ageYes = document.getElementById('ageYes');
  const ageNo = document.getElementById('ageNo');
  const ageOk = (() => { try { return sessionStorage.getItem('etiller-age') === 'ok'; } catch (e) { return false; } })();
  if (ageGate && !ageOk) {
    if (typeof ageGate.showModal === 'function') ageGate.showModal();
    else ageGate.setAttribute('open', '');
  }
  if (ageYes) ageYes.addEventListener('click', () => {
    try { sessionStorage.setItem('etiller-age', 'ok'); } catch (e) {}
    ageGate.close();
  });
  if (ageNo) ageNo.addEventListener('click', () => {
    ageGate.close();
    document.body.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;text-align:center;padding:2rem;font-family:Lato,Arial,sans-serif;background:#0d0a07;color:#f6ecd9"><div><h1 style="font-family:Cinzel,Georgia,serif;color:#ecc97a">Accés no permès</h1><p>Aquesta web és només per a majors de 18 anys.</p></div></main>';
  });

  /* ---------- Modal de información de producto ---------- */
  const PRODUCTS = {
    tona: {
      tag: 'Cervesa · llauna',
      name: 'Toña',
      desc: 'Cervesa llatina, lleugera i refrescant. Es serveix ben freda, ideal per a una tarda de tardor amb amics.',
      facts: ['Només per a majors de 18 anys', 'Servir ben freda', 'Consumir amb moderació'],
      price: '2 €'
    },
    salvavida: {
      tag: 'Cervesa · ampolla',
      name: 'Salva Vida',
      desc: 'Cervesa rossa de cos lleuger, presentada en ampolla de vidre ambre. Un clàssic per acompanyar un àpat.',
      facts: ['Només per a majors de 18 anys', 'Servir ben freda', 'Consumir amb moderació'],
      price: '2,50 €'
    },
    lite: {
      tag: 'Cervesa · llauna',
      name: 'Lite',
      desc: 'Cervesa rossa molt lleugera, pensada per beure amb calma en qualsevol moment de la tarda.',
      facts: ['Només per a majors de 18 anys', 'Servir ben freda', 'Consumir amb moderació'],
      price: '2 €'
    },
    flordecana: {
      tag: 'Ron · ampolla de 70 cl',
      name: 'Ron Flor de Caña',
      desc: 'Ron ambre amb notes de caramel i fusta. Ideal sol, amb gel o com a base d\'un còctel.',
      facts: ['Només per a majors de 18 anys', 'Servir a temperatura ambient o amb gel', 'Consumir amb moderació'],
      price: '28 €'
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
