/**
 * OKO Sub-Page Shared Script
 * Handles: mobile menu, language toggle, nav scroll, fade-in animations.
 * Shared across: creator.html, theory.html, privacy.html, terms.html
 *
 * Translation strategy:
 *   All translatable elements carry a data-en="..." attribute.
 *   Russian text lives in the DOM as normal HTML.
 *   On EN → we replace textContent/innerHTML with data-en value.
 *   On RU → we restore from cached baseValue (captured at init).
 */
(function () {
    'use strict';

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        var menu    = document.getElementById('mobileMenu');
        var toggle  = document.getElementById('navMenuToggle');
        var closeBtn= document.getElementById('mobileMenuClose');
        var overlay = document.getElementById('mobileMenuOverlay');

        if (!menu || !toggle) return;

        function openMenu() {
            menu.classList.add('active');
            menu.setAttribute('aria-hidden', 'false');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menu.classList.remove('active');
            menu.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', function () {
            if (menu.classList.contains('active')) { closeMenu(); } else { openMenu(); }
        });

        if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
        if (overlay)   overlay.addEventListener('click', closeMenu);

        // Close when a link inside the mobile menu is tapped
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
        });
    }

    // ============================================
    // LANGUAGE SWITCHER — data-en attribute based
    // ============================================
    function initLanguageSwitcher() {
        // Collect every element that has a data-en attribute
        var translatableEls = document.querySelectorAll('[data-en]');
        var cache = new WeakMap();

        // Cache the original RU value for every element
        translatableEls.forEach(function (el) {
            var type = el.dataset.i18nType || 'text';
            if (type === 'html') {
                cache.set(el, el.innerHTML);
            } else if (type === 'attr') {
                cache.set(el, el.getAttribute(el.dataset.i18nAttr));
            } else {
                cache.set(el, el.textContent);
            }
        });

        // Also handle <title> and <meta name="description"> via separate data attrs on <html>
        var htmlEl = document.documentElement;
        var titleEl = document.querySelector('title');
        var metaDesc = document.querySelector('meta[name="description"]');
        var titleRu = titleEl ? titleEl.textContent : '';
        var titleEn = htmlEl.dataset.titleEn || '';
        var metaRu  = metaDesc ? metaDesc.getAttribute('content') : '';
        var metaEn  = htmlEl.dataset.metaEn || '';

        var langBtns = document.querySelectorAll('.nav__lang-toggle');
        var storedLang = localStorage.getItem('oko-lang') || 'ru';

        function applyLang(lang) {
            translatableEls.forEach(function (el) {
                var type = el.dataset.i18nType || 'text';
                var enVal = el.dataset.en;
                var ruVal = cache.get(el);
                var val   = lang === 'en' ? enVal : ruVal;
                if (typeof val !== 'string') return;
                if (type === 'html')      { el.innerHTML = val; }
                else if (type === 'attr') { el.setAttribute(el.dataset.i18nAttr, val); }
                else                      { el.textContent = val; }
            });

            // Title & meta
            if (titleEl) {
                if (lang === 'en' && titleEn)  titleEl.textContent = titleEn;
                else if (titleRu)              titleEl.textContent = titleRu;
            }
            if (metaDesc) {
                if (lang === 'en' && metaEn)   metaDesc.setAttribute('content', metaEn);
                else if (metaRu)               metaDesc.setAttribute('content', metaRu);
            }

            // Toggle active state on lang buttons
            langBtns.forEach(function (btn) {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            localStorage.setItem('oko-lang', lang);
        }

        // Apply on load
        applyLang(storedLang);

        langBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                applyLang(this.dataset.lang);
            });
        });
    }

    // ============================================
    // NAV SCROLL
    // ============================================
    function initNavScroll() {
        var nav = document.getElementById('nav');
        if (!nav) return;
        var ticking = false;

        function update() {
            nav.classList.toggle('scrolled', window.scrollY > 80);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });

        update();
    }

    // ============================================
    // FADE-IN ANIMATIONS
    // ============================================
    function initFadeAnimations() {
        if (!window.IntersectionObserver) {
            document.querySelectorAll('.fade-in').forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

        document.querySelectorAll('.fade-in').forEach(function (el) {
            observer.observe(el);
        });
    }

    // ============================================
    // INIT
    // ============================================
    function init() {
        initMobileMenu();
        initLanguageSwitcher();
        initNavScroll();
        initFadeAnimations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
