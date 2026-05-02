/**
 * OKO Website - JavaScript
 * Handles: Language switching, nav scroll, fade animations,
 * smooth scrolling, and order modal with validation.
 */

(function() {
    'use strict';

    // ============================================
    // CONFIG
    // ============================================
    var CONFIG = {
        navScrollThreshold: 80
    };

    var mobileMenuApi = {
        open: function() {},
        close: function() {}
    };

    var FORM_MESSAGES = {
        ru: {
            nameRequired: 'Введите ваше имя',
            phoneRequired: 'Введите номер телефона',
            phoneInvalid: 'Введите корректный номер телефона',
            emailRequired: 'Введите email',
            emailInvalid: 'Введите корректный email',
            product: 'OKO — №001',
            price: '24 900 ₽'
        },
        en: {
            nameRequired: 'Enter your name',
            phoneRequired: 'Enter your phone number',
            phoneInvalid: 'Enter a valid phone number',
            emailRequired: 'Enter your email',
            emailInvalid: 'Enter a valid email',
            product: 'OKO — No.001',
            price: '24,900 ₽'
        }
    };

    var TRANSLATION_ENTRIES = [
        { selectors: ['title'], type: 'text', en: 'OKO — See Less. Think Quieter.' },
        { selectors: ['meta[name="description"]'], type: 'attr', attr: 'content', en: 'OKO is a handcrafted optical instrument in brass, frosted glass, and wood. It softens visual input so the mind slows down. No app. No screen. No charging.' },
        { selectors: ['.nav__links li:nth-child(1) a', '.mobile-menu__nav a:nth-child(1)', '.hero__cta--secondary', '.cta__button--secondary', '.footer__nav a:nth-child(1)'], type: 'text', en: 'How It Works' },
        { selectors: ['.nav__links li:nth-child(2) a', '.mobile-menu__nav a:nth-child(2)', '.footer__nav a:nth-child(2)'], type: 'text', en: 'About' },
        { selectors: ['.nav__links li:nth-child(3) a', '.mobile-menu__nav a:nth-child(3)', '.footer__nav a:nth-child(4)'], type: 'text', en: 'Creator' },
        { selectors: ['.nav__links li:nth-child(4) a', '.nav__cta', '.mobile-menu__nav a:nth-child(4)', '.footer__nav a:nth-child(3)', '#ctaOrderBtn'], type: 'text', en: 'Order' },
        { selectors: ['.footer__nav a:nth-child(5)'], type: 'text', en: 'Privacy' },
        { selectors: ['.footer__nav a:nth-child(6)'], type: 'text', en: 'Agreement' },
        { selectors: ['.mobile-menu__title'], type: 'text', en: 'Menu' },
        { selectors: ['.mobile-menu__cta', '.hero__cta[data-order-trigger]'], type: 'text', en: 'Order OKO' },
        { selectors: ['.hero__eyebrow'], type: 'text', en: 'The Luxury of Self-Discovery' },
        { selectors: ['.hero__headline'], type: 'html', en: 'See less.<br>Think quieter.' },
        { selectors: ['.hero__subtext'], type: 'html', en: 'A picture no one else will ever see.<br>No apps. No screen. No charging.' },
        { selectors: ['.what-is .section-label'], type: 'text', en: 'What Is OKO' },
        { selectors: ['.what-is__title'], type: 'html', en: 'A Stereo Journey<br>Into Yourself.' },
        { selectors: ['.what-is__body'], type: 'text', en: 'OKO is a personal optical instrument. Concave mirrors, tuned to each eye, form a closed optical system with your own iris. You see the living, pulsing universe inside yourself — in stereo, in real time, unique in every moment.' },
        { selectors: ['.what-is__list li:nth-child(1)'], type: 'text', en: 'Rapid relaxation of eyes and visual brain centres' },
        { selectors: ['.what-is__list li:nth-child(2)'], type: 'text', en: 'Reduction of anxiety and stress levels' },
        { selectors: ['.what-is__list li:nth-child(3)'], type: 'text', en: 'Concentration of attention and thought' },
        { selectors: ['.what-is__list li:nth-child(4)'], type: 'text', en: 'Eye muscle training, prevention of age-related vision changes' },
        { selectors: ['.what-is__list li:nth-child(5)'], type: 'text', en: 'Meditation on physical principles — no prior practice needed' },
        { selectors: ['.what-is__list li:nth-child(6)'], type: 'text', en: 'Medical rehabilitation and contemplation' },
        { selectors: ['.problem .section-label'], type: 'text', en: 'Problem' },
        { selectors: ['.problem__title'], type: 'text', en: 'The world does not slow down.' },
        { selectors: ['.problem__item:nth-child(1) p'], type: 'text', en: 'Screens, notifications, and the constant flicker of information all demand nonstop processing from the mind. Even when you sit still, the brain keeps working.' },
        { selectors: ['.problem__item:nth-child(2) p'], type: 'text', en: 'This is not ordinary tiredness. It is a constant background load — subtle, but draining. You can sit in a quiet room and still feel on edge.' },
        { selectors: ['.editorial__text'], type: 'text', en: 'Less detail — less noise — more stillness.' },
        { selectors: ['.how-it-works .section-label'], type: 'text', en: 'How It Works' },
        { selectors: ['.how-it-works__title'], type: 'text', en: 'Simple. Physical. App-free.' },
        { selectors: ['.how-it-works__step:nth-child(1) h3'], type: 'text', en: 'Softening' },
        { selectors: ['.how-it-works__step:nth-child(1) p'], type: 'text', en: 'Frosted glass diffuses light. Sharp edges and tiny details blur. The image behind the glass becomes gentler.' },
        { selectors: ['.how-it-works__step:nth-child(2) h3'], type: 'text', en: 'Reduced Load' },
        { selectors: ['.how-it-works__step:nth-child(2) p'], type: 'text', en: 'The mind no longer has to process a highly detailed image. The stream of visual information is reduced.' },
        { selectors: ['.how-it-works__step:nth-child(3) h3'], type: 'text', en: 'Slowing Down' },
        { selectors: ['.how-it-works__step:nth-child(3) p'], type: 'text', en: 'Less incoming data means less work. Background strain eases. You start to slow down.' },
        { selectors: ['.how-it-works__note'], type: 'text', en: 'This is not hypnosis or meditation. It is physics: a less detailed image = less load on the mind.' },
        { selectors: ['.benefits .section-label'], type: 'text', en: 'Benefits' },
        { selectors: ['.benefits__title'], type: 'text', en: 'What you get.' },
        { selectors: ['.benefits__item:nth-child(1) h3'], type: 'text', en: 'Less visual noise' },
        { selectors: ['.benefits__item:nth-child(1) p'], type: 'text', en: 'The world behind the glass becomes softer — not unrecognizable, more like a screen in night mode.' },
        { selectors: ['.benefits__item:nth-child(2) h3'], type: 'text', en: 'Lower background strain' },
        { selectors: ['.benefits__item:nth-child(2) p'], type: 'text', en: 'Not instantly, and not magically. Gradually, as the mind stops processing the extra signal.' },
        { selectors: ['.benefits__item:nth-child(3) h3'], type: 'text', en: 'Easier to switch off' },
        { selectors: ['.benefits__item:nth-child(3) p'], type: 'text', en: 'After a few minutes with OKO, it becomes easier to leave the state of always being reachable.' },
        { selectors: ['.benefits__item:nth-child(4) h3'], type: 'text', en: 'A physical, tangible object' },
        { selectors: ['.benefits__item:nth-child(4) p'], type: 'text', en: 'Not an app. Not a subscription. Not something that needs charging. You simply pick it up.' },
        { selectors: ['.benefits__item:nth-child(5) h3'], type: 'text', en: 'Fits any moment' },
        { selectors: ['.benefits__item:nth-child(5) p'], type: 'text', en: 'In the morning, when you need a quiet start. In the evening, when screen fatigue has built up. Whenever the world feels too loud.' },
        { selectors: ['.benefits__item:nth-child(6) h3'], type: 'text', en: 'It does not become obsolete' },
        { selectors: ['.benefits__item:nth-child(6) p'], type: 'text', en: 'This is a mechanical instrument. It will work the same way in twenty years.' },
        { selectors: ['.benefits__item:nth-child(7) h3'], type: 'text', en: 'Compact and ready' },
        { selectors: ['.benefits__item:nth-child(7) p'], type: 'text', en: 'It fits in your palm. It rests in a wooden box on a shelf — always within reach.' },
        { selectors: ['.experience .section-label'], type: 'text', en: 'Experience' },
        { selectors: ['.experience__title'], type: 'text', en: 'It is a change, not a feeling.' },
        { selectors: ['.experience__body:nth-of-type(1)'], type: 'text', en: 'The first thing you notice when you look through OKO is that the edges of objects soften. Textures become quieter. Light stops feeling sharp.' },
        { selectors: ['.experience__body:nth-of-type(2)'], type: 'text', en: 'After two or three minutes, the blur stops standing out — it simply becomes the new normal. The world behind the glass feels calmer.' },
        { selectors: ['.experience__body:nth-of-type(3)'], type: 'text', en: 'It sounds small. But for a mind that is used to running at full power even while waiting in line, it is noticeable.' },
        { selectors: ['.how-to-use .section-label'], type: 'text', en: 'Use' },
        { selectors: ['.how-to-use__title'], type: 'text', en: 'How to use OKO.' },
        { selectors: ['.how-to-use__step:nth-child(1) p'], type: 'text', en: 'Take OKO. Hold it to your eyes, like opera glasses or a lorgnette.' },
        { selectors: ['.how-to-use__step:nth-child(2) p'], type: 'text', en: 'Look at the world. The image becomes softer — not smeared, simply less detailed.' },
        { selectors: ['.how-to-use__step:nth-child(3) p'], type: 'text', en: 'Stay as long as you need. Five minutes. Fifteen. Half an hour. Put it down when the background strain has eased.' },
        { selectors: ['.materials .section-label'], type: 'text', en: 'Craftsmanship' },
        { selectors: ['.materials__title'], type: 'html', en: 'Not optimized.<br>Made by hand.' },
        { selectors: ['.materials__callout:nth-child(1) h3'], type: 'text', en: 'Brass' },
        { selectors: ['.materials__callout:nth-child(1) p'], type: 'text', en: 'Cast brass. Hand-finished. Over time it darkens and develops a patina — that is character, not a defect.' },
        { selectors: ['.materials__callout:nth-child(2) h3'], type: 'text', en: 'Walnut Wood' },
        { selectors: ['.materials__callout:nth-child(2) p'], type: 'text', en: 'Laser-cut, hand-sanded. A warm, organic material in the hand.' },
        { selectors: ['.materials__callout:nth-child(3) h3'], type: 'text', en: 'Optical Glass' },
        { selectors: ['.materials__callout:nth-child(3) p'], type: 'text', en: 'Frosted optical lenses. Resistant to scratching in normal use. The lenses are removable and can be replaced.' },
        { selectors: ['.product__label', '.modal__product-label'], type: 'text', en: 'Optical Instrument' },
        { selectors: ['.product__name'], type: 'text', en: 'OKO — No.001' },
        { selectors: ['.product__tagline', '.footer__tagline'], type: 'text', en: 'Handcrafted. Brass, frosted glass, wood.' },
        { selectors: ['.product__price-note'], type: 'text', en: 'Pay on delivery' },
        { selectors: ['.product__specs li:nth-child(1)'], type: 'text', en: 'Handcrafted' },
        { selectors: ['.product__specs li:nth-child(2)'], type: 'text', en: 'Brass, frosted glass, walnut wood' },
        { selectors: ['.product__specs li:nth-child(3)'], type: 'text', en: '5–10 minute sessions' },
        { selectors: ['.product__specs li:nth-child(4)'], type: 'text', en: 'No apps or charging' },
        { selectors: ['.product__specs li:nth-child(5)'], type: 'text', en: 'Wooden case for storage' },
        { selectors: ['.product__specs li:nth-child(6)'], type: 'text', en: 'Made to order: 2–4 weeks' },
        { selectors: ['.product__cta'], type: 'text', en: 'Order OKO — 24,900 ₽' },
        { selectors: ['.product__lead-time'], type: 'text', en: 'Production time: 4–6 weeks' },
        { selectors: ['.product__link'], type: 'text', en: 'Ask a question →' },
        { selectors: ['.testimonials .section-label'], type: 'text', en: 'Testimonials' },
        { selectors: ['.testimonials__item:nth-child(1) p'], type: 'text', en: 'I work with text all day. By evening my head is buzzing, even if I have not done anything physical. After OKO — not instantly, maybe ten minutes later — the buzzing fades. I cannot fully explain it, but the effect is real.' },
        { selectors: ['.testimonials__item:nth-child(1) footer'], type: 'text', en: '— Alexey, 34, editor' },
        { selectors: ['.testimonials__item:nth-child(2) p'], type: 'text', en: 'I tried it at a friend’s place and could not understand why I had not bought one earlier. I do not have a meditation practice, and switching off is hard for me. Here you simply look through the glass — and the background inside your head grows quieter.' },
        { selectors: ['.testimonials__item:nth-child(2) footer'], type: 'text', en: '— Marina, 41, architect' },
        { selectors: ['.testimonials__item:nth-child(3) p'], type: 'text', en: 'I am skeptical by nature. I thought it was a gimmick. But the brass feels warm in the hands, the glass does not scratch, and it feels like an object, not a toy. And yes — ten minutes with OKO, and the urge to check the phone disappears. I value that.' },
        { selectors: ['.testimonials__item:nth-child(3) footer'], type: 'text', en: '— Dmitry, 38, entrepreneur' },
        { selectors: ['.philosophy__line:nth-child(1)'], type: 'text', en: 'A new living reality — inside you.' },
        { selectors: ['.philosophy__line:nth-child(2)'], type: 'text', en: 'When you see less, you are present more.' },
        { selectors: ['.cta__eyebrow'], type: 'text', en: 'Return to yourself.' },
        { selectors: ['.cta__headline'], type: 'text', en: 'The world will not grow quiet on its own.' },
        { selectors: ['.cta__tagline'], type: 'text', en: 'But you can stop reacting to every one of its surges.' },
        { selectors: ['.modal__title'], type: 'text', en: 'Order OKO' },
        { selectors: ['.modal__subtitle'], type: 'text', en: '24,900 ₽ · Made to order in 2–4 weeks' },
        { selectors: ['label[for="orderName"]'], type: 'html', en: 'Your name <span class="modal__required">*</span>' },
        { selectors: ['label[for="orderPhone"]'], type: 'html', en: 'Phone <span class="modal__required">*</span>' },
        { selectors: ['label[for="orderEmail"]'], type: 'html', en: 'Email <span class="modal__required">*</span>' },
        { selectors: ['label[for="orderComment"]'], type: 'text', en: 'Order notes' },
        { selectors: ['.modal__privacy'], type: 'text', en: 'By clicking "Send request", you consent to the processing of personal data.' },
        { selectors: ['.modal__submit-text'], type: 'text', en: 'Send request' },
        { selectors: ['.modal__submit-loading'], type: 'html', en: '<svg class="modal__spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>Sending...' },
        { selectors: ['.modal__success-title'], type: 'text', en: 'Request sent' },
        { selectors: ['.modal__success-text'], type: 'text', en: 'We will contact you within 24 hours to confirm your order.' },
        { selectors: ['.modal__success-close'], type: 'text', en: 'Okay' },
        { selectors: ['.modal__error-title'], type: 'text', en: 'Something went wrong' },
        { selectors: ['.modal__error-text'], type: 'text', en: 'Please try again or email us at hello@oko.co' },
        { selectors: ['.modal__error-retry'], type: 'text', en: 'Try again' },
        { selectors: ['#orderName'], type: 'attr', attr: 'placeholder', en: 'Ivan Petrov' },
        { selectors: ['#orderPhone'], type: 'attr', attr: 'placeholder', en: '+1 (___) ___-____' },
        { selectors: ['#orderComment'], type: 'attr', attr: 'placeholder', en: 'Delivery city, notes...' },
        { selectors: ['.nav__menu-toggle'], type: 'attr', attr: 'aria-label', en: 'Open menu' },
        { selectors: ['.mobile-menu__close'], type: 'attr', attr: 'aria-label', en: 'Close menu' },
        { selectors: ['.modal__close'], type: 'attr', attr: 'aria-label', en: 'Close' },
        { selectors: ['.hero__image'], type: 'attr', attr: 'alt', en: 'OKO optical instrument' },
        { selectors: ['.what-is__image', '.experience__image', '.product__image'], type: 'attr', attr: 'alt', en: 'OKO' },
        { selectors: ['.video-reviews .section-label'], type: 'text', en: 'VIDEO REVIEWS' },
        { selectors: ['.video-reviews__title'], type: 'html', en: 'They already looked<br>inside themselves.' },
        { selectors: ['.video-reviews__sub'], type: 'text', en: 'Real reviews — no script, no editing.' },
        { selectors: ['.vr-card:nth-child(1) .vr-card__label'], type: 'text', en: 'First impression' },
        { selectors: ['.vr-card:nth-child(2) .vr-card__label'], type: 'text', en: 'Personal experience' },
        { selectors: ['.vr-card:nth-child(3) .vr-card__label'], type: 'text', en: 'After one month' },
        { selectors: ['.vr-card:nth-child(4) .vr-card__label'], type: 'text', en: 'Review' },
        { selectors: ['.vr-card:nth-child(5) .vr-card__label'], type: 'text', en: 'Impressions' },
        { selectors: ['.vr-card:nth-child(6) .vr-card__label'], type: 'text', en: 'Real story' },
        { selectors: ['.vr-card:nth-child(7) .vr-card__label'], type: 'text', en: 'Deep conversation' },
        { selectors: ['.materials__image'], type: 'attr', attr: 'alt', en: 'OKO in its box' }
    ];

    function currentLang() {
        return document.documentElement.lang === 'en' ? 'en' : 'ru';
    }

    function translationTargets(entry) {
        var targets = [];

        entry.selectors.forEach(function(selector) {
            document.querySelectorAll(selector).forEach(function(el) {
                targets.push(el);
            });
        });

        return targets;
    }

    function readEntryValue(el, entry) {
        if (entry.type === 'html') return el.innerHTML;
        if (entry.type === 'attr') return el.getAttribute(entry.attr);
        return el.textContent;
    }

    function writeEntryValue(el, entry, value) {
        if (entry.type === 'html') {
            el.innerHTML = value;
            return;
        }

        if (entry.type === 'attr') {
            el.setAttribute(entry.attr, value);
            return;
        }

        el.textContent = value;
    }

    function applyTranslations(lang) {
        TRANSLATION_ENTRIES.forEach(function(entry) {
            if (!entry.baseValues) {
                entry.baseValues = new WeakMap();

                translationTargets(entry).forEach(function(el) {
                    entry.baseValues.set(el, readEntryValue(el, entry));
                });
            }

            translationTargets(entry).forEach(function(el) {
                var value = lang === 'en' ? entry.en : entry.baseValues.get(el);
                if (typeof value === 'string') writeEntryValue(el, entry, value);
            });
        });
    }

    // Keep the page pinned to the viewport on narrow screens if any element
    // briefly creates horizontal overflow during initial layout.
    function resetHorizontalScroll() {
        if (window.scrollX !== 0) {
            window.scrollTo(0, window.scrollY);
        }
    }

    // ============================================
    // LANGUAGE SWITCHING
    // ============================================
    function initLanguageSwitcher() {
        var langBtns = document.querySelectorAll('.nav__lang-toggle');
        var storedLang = localStorage.getItem('oko-lang') || 'ru';

        function setLanguage(lang) {
            document.documentElement.lang = lang;

            if (lang === 'en') {
                document.title = 'OKO — See Less. Think Quieter.';
            } else {
                document.title = 'OKO — Видишь меньше. Думаешь тише.';
            }

            applyTranslations(lang);

            langBtns.forEach(function(btn) {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            localStorage.setItem('oko-lang', lang);

            // Notify components that depend on current language
            document.dispatchEvent(new Event('langchange'));
        }

        setLanguage(storedLang);

        langBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                setLanguage(this.dataset.lang);
            });
        });
    }

    // ============================================
    // NAV SCROLL BEHAVIOR
    // ============================================
    function initNavScroll() {
        var ticking = false;
        var nav = document.getElementById('nav');

        function updateNav() {
            if (window.scrollY > CONFIG.navScrollThreshold) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });

        updateNav();
    }

    function initMobileMenu() {
        var menu = document.getElementById('mobileMenu');
        var toggle = document.getElementById('navMenuToggle');
        var closeBtn = document.getElementById('mobileMenuClose');
        var overlay = document.getElementById('mobileMenuOverlay');

        if (!menu || !toggle || !closeBtn || !overlay) {
            return;
        }

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

        mobileMenuApi.open = openMenu;
        mobileMenuApi.close = closeMenu;

        toggle.addEventListener('click', function() {
            if (menu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        menu.querySelectorAll('a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    function initViewportGuards() {
        resetHorizontalScroll();

        window.addEventListener('load', resetHorizontalScroll);
        window.addEventListener('resize', function() {
            requestAnimationFrame(resetHorizontalScroll);
        }, { passive: true });
    }

    // ============================================
    // INTERSECTION OBSERVER — FADE IN
    // ============================================
    function initFadeAnimations() {
        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.08
        };

        var fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(function(el) {
            fadeObserver.observe(el);
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                if (this.hasAttribute('data-order-trigger')) {
                    return;
                }

                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var targetElement = document.querySelector(targetId);
                var nav = document.getElementById('nav');

                if (targetElement) {
                    e.preventDefault();
                    var navHeight = nav ? nav.offsetHeight : 0;
                    var targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // ORDER MODAL
    // ============================================
    function initModal() {
        var modalOverlay = document.getElementById('modalOverlay');
        var modal = document.getElementById('orderModal');
        var closeBtn = document.getElementById('modalClose');

        // All buttons that open the modal
        var orderBtns = document.querySelectorAll(
            '[data-order-trigger], [id="productOrderBtn"], [id="ctaOrderBtn"], [id="reserveBtn"]'
        );

        var formState = document.getElementById('modalFormState');
        var successState = document.getElementById('modalSuccessState');
        var errorState = document.getElementById('modalErrorState');

        var form = document.getElementById('orderForm');
        var submitBtn = document.getElementById('submitBtn');

        var successCloseBtn = document.getElementById('successCloseBtn');
        var errorRetryBtn = document.getElementById('errorRetryBtn');

        var firstFocusable = null;
        var lastFocusable = null;

        // --- Helpers ---
        function showState(state) {
            [formState, successState, errorState].forEach(function(s) {
                s.classList.remove('active');
            });
            if (state) state.classList.add('active');
        }

        function clearErrors() {
            document.querySelectorAll('.modal__field input, .modal__field textarea').forEach(function(input) {
                input.classList.remove('error');
            });
            document.querySelectorAll('.modal__error').forEach(function(err) {
                err.classList.remove('visible');
                err.textContent = '';
            });
        }

        function resetForm() {
            if (form) form.reset();
            clearErrors();
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }

        function openModal() {
            resetForm();
            showState(formState);
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus trap — find focusable elements
            var focusable = modal.querySelectorAll(
                'button, input, textarea, [href], [tabindex]:not([tabindex="-1"])'
            );
            focusable = Array.prototype.slice.call(focusable).filter(function(el) {
                return el.offsetParent !== null;
            });

            if (focusable.length > 0) {
                firstFocusable = focusable[0];
                lastFocusable = focusable[focusable.length - 1];
                // Focus first element after animation
                setTimeout(function() {
                    if (firstFocusable) firstFocusable.focus();
                }, 50);
            }
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';

            // Return focus to trigger element
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
        }

        // --- Validation ---
        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function validatePhone(phone) {
            var digits = phone.replace(/\D/g, '');
            return digits.length >= 10;
        }

        function validateForm() {
            var isValid = true;
            clearErrors();

            var nameInput = document.getElementById('orderName');
            var phoneInput = document.getElementById('orderPhone');
            var emailInput = document.getElementById('orderEmail');

            var nameError = document.getElementById('errorName');
            var phoneError = document.getElementById('errorPhone');
            var emailError = document.getElementById('errorEmail');

            var nameVal = nameInput.value.trim();
            var phoneVal = phoneInput.value.trim();
            var emailVal = emailInput.value.trim();

            if (!nameVal) {
                nameInput.classList.add('error');
                nameError.textContent = 'Введите ваше имя';
                nameError.classList.add('visible');
                isValid = false;
            }

            if (!phoneVal) {
                phoneInput.classList.add('error');
                phoneError.textContent = 'Введите номер телефона';
                phoneError.classList.add('visible');
                isValid = false;
            } else if (!validatePhone(phoneVal)) {
                phoneInput.classList.add('error');
                phoneError.textContent = 'Введите корректный номер телефона';
                phoneError.classList.add('visible');
                isValid = false;
            }

            if (!emailVal) {
                emailInput.classList.add('error');
                emailError.textContent = 'Введите email';
                emailError.classList.add('visible');
                isValid = false;
            } else if (!validateEmail(emailVal)) {
                emailInput.classList.add('error');
                emailError.textContent = 'Введите корректный email';
                emailError.classList.add('visible');
                isValid = false;
            }

            return isValid;
        }

        // --- Event: Open modal ---
        orderBtns.forEach(function(btn) {
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    openModal();
                });
            }
        });

        // --- Event: Close ---
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }

            // Focus trap
            if (e.key === 'Tab' && modalOverlay.classList.contains('active')) {
                var focusable = modal.querySelectorAll(
                    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                focusable = Array.prototype.slice.call(focusable).filter(function(el) {
                    return el.offsetParent !== null;
                });

                if (focusable.length === 0) return;

                var first = focusable[0];
                var last = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        });

        // --- Event: Form submit ---
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                if (!validateForm()) return;

                // Show loading state
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                // Gather data
                var formData = {
                    name: document.getElementById('orderName').value.trim(),
                    phone: document.getElementById('orderPhone').value.trim(),
                    email: document.getElementById('orderEmail').value.trim(),
                    comment: document.getElementById('orderComment').value.trim(),
                    product: 'OKO — №001',
                    price: '24 900 ₽'
                };

                // POST to backend
                fetch('/api/order', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(formData),
                })
                .then(function(resp) {
                    return resp.json().then(function(data) {
                        if (!resp.ok || !data.ok) {
                            throw new Error(data.error || 'Server error');
                        }
                        return data;
                    });
                })
                .then(function() {
                    showState(successState);
                })
                .catch(function(err) {
                    console.error('[ORDER ERROR]', err.message);
                    showState(errorState);
                })
                .finally(function() {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                });
            });
        }

        // --- Event: Success close ---
        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', closeModal);
        }

        // --- Event: Error retry ---
        if (errorRetryBtn) {
            errorRetryBtn.addEventListener('click', function() {
                resetForm();
                showState(formState);
            });
        }

        // Real-time validation on blur
        ['orderName', 'orderPhone', 'orderEmail'].forEach(function(id) {
            var input = document.getElementById(id);
            if (input) {
                input.addEventListener('blur', function() {
                    validateForm();
                });
            }
        });
    }

    // ============================================
    // INIT
    // ============================================
    function initHeroEyebrowRotator() {
        var el = document.getElementById('heroEyebrow');
        if (!el) return;
        var taglinesRU = [
            'Роскошь самопознания',
            'Стерео путешествие в себя',
            'Картина, которую не увидит никто',
            'ОкОнчательное расслабление'
        ];
        var taglinesEN = [
            'The Luxury of Self-Discovery',
            'A Stereo Journey Into Yourself',
            'A Picture No One Else Will See',
            'The Final Unwinding'
        ];
        var idx = 0;

        function setTag() {
            var lang = document.documentElement.lang;
            el.textContent = (lang === 'en') ? taglinesEN[idx] : taglinesRU[idx];
        }

        el.classList.add('hero__eyebrow--rotating');
        setTag();

        setInterval(function() {
            idx = (idx + 1) % taglinesRU.length;
            setTag();
        }, 4000);

        // Re-apply when language is toggled
        document.addEventListener('langchange', function() {
            setTag();
        });
    }

    function initCarousel() {
        var carousel = document.getElementById('vrCarousel');
        if (!carousel) return;

        var track    = document.getElementById('vrTrack');
        var dotsWrap = document.getElementById('vrDots');
        var prevBtn  = document.getElementById('vrPrev');
        var nextBtn  = document.getElementById('vrNext');
        var slides   = Array.prototype.slice.call(track.querySelectorAll('.vr-slide'));
        var total    = slides.length;

        var current  = 0;
        var perView  = 3;         // recalculated on resize
        var gap      = 22;        // px, must match CSS gap (1.4rem ≈ 22px)
        var isDragging = false;
        var dragStartX = 0;
        var dragCurrentX = 0;
        var dragStartTransform = 0;

        // Mobile nav elements
        var mobilePrevBtn  = document.getElementById('vrMobilePrev');
        var mobileNextBtn  = document.getElementById('vrMobileNext');
        var mobileCounter  = document.getElementById('vrCounter');

        // ── Build dots ──────────────────────────────────────
        function buildDots() {
            dotsWrap.innerHTML = '';
            var numDots = Math.max(1, total - Math.floor(perView) + 1);
            for (var i = 0; i < numDots; i++) {
                var dot = document.createElement('button');
                dot.className = 'vr-dot' + (i === current ? ' is-active' : '');
                dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
                dot.dataset.idx = i;
                dotsWrap.appendChild(dot);
            }
        }

        // ── Recalculate perView from viewport ───────────────
        function calcPerView() {
            var w = window.innerWidth;
            if (w <= 600)  return 1;
            if (w <= 1024) return 2;
            return 3;
        }

        // ── Get pixel offset for a given index ──────────────
        function getOffset(idx) {
            var slideWidth = slides[0] ? slides[0].offsetWidth : (track.offsetWidth / perView - gap * (perView - 1) / perView);
            
            if (perView === 1) {
                // Mobile: perfectly center the active slide
                var viewportWidth = document.documentElement.clientWidth;
                var centerOffset = (viewportWidth - slideWidth) / 2;
                // Since the caller does `track.style.transform = 'translateX(-' + offset + 'px)'`,
                // we return (idx * (slideWidth + gap)) - centerOffset
                return idx * (slideWidth + gap) - centerOffset;
            } else {
                // Desktop: left-align the track
                return idx * (slideWidth + gap);
            }
        }

        // ── Apply slide position ─────────────────────────────
        function goTo(idx, animate) {
            var maxIdx = Math.max(0, total - Math.floor(perView));
            idx = Math.max(0, Math.min(idx, maxIdx));
            current = idx;

            if (animate === false) {
                track.style.transition = 'none';
            } else {
                track.style.transition = '';
            }

            track.style.transform = 'translateX(-' + getOffset(idx) + 'px)';

            // Update active class
            slides.forEach(function(s, i) {
                s.classList.toggle('is-active', i >= idx && i < idx + perView);
            });

            // Update dots
            var dots = dotsWrap.querySelectorAll('.vr-dot');
            dots.forEach(function(d, i) {
                d.classList.toggle('is-active', i === idx);
            });

            // Update arrow disabled state
            prevBtn.disabled = (idx === 0);
            nextBtn.disabled = (idx >= maxIdx);

            // Update mobile counter  "1 / 7"
            if (mobileCounter) {
                mobileCounter.innerHTML = '<span>' + (idx + 1) + '</span> / ' + total;
            }
            if (mobilePrevBtn) mobilePrevBtn.disabled = (idx === 0);
            if (mobileNextBtn) mobileNextBtn.disabled = (idx >= maxIdx);
        }

        // ── Pause any playing video ──────────────────────────
        function pauseAllVideos() {
            slides.forEach(function(slide) {
                var vid = slide.querySelector('video');
                if (vid && !vid.paused) vid.pause();
            });
        }

        // ── Resize observer ──────────────────────────────────
        function onResize() {
            perView  = calcPerView();
            gap      = parseFloat(getComputedStyle(track).gap) || 22;
            buildDots();
            goTo(current, false);
            // Re-enable transitions after forced snap
            requestAnimationFrame(function() {
                track.style.transition = '';
            });
        }

        // ── Arrow clicks ─────────────────────────────────────
        prevBtn.addEventListener('click', function() {
            pauseAllVideos();
            goTo(current - 1);
        });
        nextBtn.addEventListener('click', function() {
            pauseAllVideos();
            goTo(current + 1);
        });

        // ── Dot clicks ───────────────────────────────────────
        dotsWrap.addEventListener('click', function(e) {
            var dot = e.target.closest('.vr-dot');
            if (!dot) return;
            pauseAllVideos();
            goTo(parseInt(dot.dataset.idx, 10));
        });

        // ── Mobile button clicks ──────────────────────────────
        if (mobilePrevBtn) {
            mobilePrevBtn.addEventListener('click', function() {
                pauseAllVideos();
                goTo(current - 1);
            });
        }
        if (mobileNextBtn) {
            mobileNextBtn.addEventListener('click', function() {
                pauseAllVideos();
                goTo(current + 1);
            });
        }

        // ── Pointer / touch drag ──────────────────────────────
        function pointerStart(e) {
            // Don't hijack clicks on video controls or the play button
            if (e.target.closest('video') || e.target.closest('.vr-carousel__arrow') || e.target.closest('.vr-card__play')) return;
            isDragging    = true;
            dragStartX    = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            dragCurrentX  = dragStartX;
            dragStartTransform = getOffset(current);
            track.classList.add('is-dragging');
        }

        function pointerMove(e) {
            if (!isDragging) return;
            dragCurrentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            var delta = dragCurrentX - dragStartX;
            track.style.transition = 'none';
            track.style.transform  = 'translateX(' + (-dragStartTransform + delta) + 'px)';
        }

        function pointerEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('is-dragging');
            var delta = dragCurrentX - dragStartX;
            var threshold = track.offsetWidth * 0.12;
            if (delta < -threshold) {
                pauseAllVideos();
                goTo(current + 1);
            } else if (delta > threshold) {
                pauseAllVideos();
                goTo(current - 1);
            } else {
                goTo(current); // snap back
            }
        }

        track.addEventListener('mousedown',   pointerStart, { passive: true });
        track.addEventListener('mousemove',   pointerMove,  { passive: true });
        track.addEventListener('mouseup',     pointerEnd);
        track.addEventListener('mouseleave',  pointerEnd);
        track.addEventListener('touchstart',  pointerStart, { passive: true });
        track.addEventListener('touchmove',   pointerMove,  { passive: true });
        track.addEventListener('touchend',    pointerEnd);

        // ── Keyboard navigation ──────────────────────────────
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft')  { pauseAllVideos(); goTo(current - 1); }
            if (e.key === 'ArrowRight') { pauseAllVideos(); goTo(current + 1); }
        });

        // ── Resize ───────────────────────────────────────────
        if (window.ResizeObserver) {
            new ResizeObserver(onResize).observe(carousel);
        } else {
            window.addEventListener('resize', onResize, { passive: true });
        }

        // ── Init ─────────────────────────────────────────────
        perView = calcPerView();
        gap     = 22;
        buildDots();
        goTo(0, false);
        requestAnimationFrame(function() {
            track.style.transition = '';
        });
    }

    function initVideoOverlays() {
        document.querySelectorAll('.vr-card__video-wrap').forEach(function(wrap) {
            var vid = wrap.querySelector('video');
            var overlay = wrap.querySelector('.vr-card__play');
            if (!vid || !overlay) return;
            
            var playIcon = overlay.querySelector('.vr-icon-play');
            var pauseIcon = overlay.querySelector('.vr-icon-pause');
            var hideTimeout;

            vid.addEventListener('play', function() {
                // Show pause icon momentarily
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = '';
                overlay.style.opacity = '1';
                
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(function() {
                    if (!vid.paused) overlay.style.opacity = '0';
                }, 650); // fade out after a brief moment
            });
            
            vid.addEventListener('pause', function() {
                clearTimeout(hideTimeout);
                if (pauseIcon) pauseIcon.style.display = 'none';
                if (playIcon) playIcon.style.display = '';
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
            });
            
            vid.addEventListener('ended', function() {
                clearTimeout(hideTimeout);
                if (pauseIcon) pauseIcon.style.display = 'none';
                if (playIcon) playIcon.style.display = '';
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
            });
            
            // Allow tapping the overlay to play/pause
            overlay.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (vid.paused) {
                    vid.play();
                } else {
                    vid.pause();
                }
            });
        });
    }

    function init() {
        initViewportGuards();
        initLanguageSwitcher();
        initMobileMenu();
        initNavScroll();
        initFadeAnimations();
        initSmoothScroll();
        initModal();
        initHeroEyebrowRotator();
        initVideoOverlays();
        initCarousel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
