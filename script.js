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
        { selectors: ['.nav__links li:nth-child(2) a', '.mobile-menu__nav a:nth-child(2)', '.footer__nav a:nth-child(2)'], type: 'text', en: 'Benefits' },
        { selectors: ['.nav__links li:nth-child(3) a', '.nav__cta', '.mobile-menu__nav a:nth-child(3)', '.footer__nav a:nth-child(3)', '#ctaOrderBtn'], type: 'text', en: 'Order' },
        { selectors: ['.mobile-menu__title'], type: 'text', en: 'Menu' },
        { selectors: ['.mobile-menu__cta', '.hero__cta[data-order-trigger]'], type: 'text', en: 'Order OKO' },
        { selectors: ['.hero__eyebrow'], type: 'text', en: 'Optical Instrument' },
        { selectors: ['.hero__headline'], type: 'html', en: 'See less.<br>Think quieter.' },
        { selectors: ['.hero__subtext'], type: 'html', en: 'Reduces visual overload. The mind slows down.<br>No apps. No screen. No charging.' },
        { selectors: ['.what-is .section-label'], type: 'text', en: 'What Is OKO' },
        { selectors: ['.what-is__title'], type: 'html', en: 'No batteries.<br>No screens.' },
        { selectors: ['.what-is__body'], type: 'text', en: 'OKO is a handheld optical instrument. You lift it to your eyes — and the world behind the glass becomes softer.' },
        { selectors: ['.what-is__list li:nth-child(1)'], type: 'text', en: 'Frosted glass softens the image' },
        { selectors: ['.what-is__list li:nth-child(2)'], type: 'text', en: 'The mind processes fewer details' },
        { selectors: ['.what-is__list li:nth-child(3)'], type: 'text', en: 'Background strain drops' },
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
        { selectors: ['.philosophy__line:nth-child(1)'], type: 'text', en: 'Not every detail deserves your attention.' },
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
            
            applyTranslations(lang);

            langBtns.forEach(function(btn) {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            localStorage.setItem('oko-lang', lang);
            return;
            document.documentElement.lang = lang;

            if (lang === 'en') {
                document.title = 'OKO — See Less. Think Less.';
            } else {
                document.title = 'OKO — Видишь меньше. Думаешь тише.';
            }
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

                // Simulate API call — replace with real endpoint
                var simulateApi = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        // For demo: succeed 90% of the time
                        if (Math.random() > 0.1) {
                            resolve(formData);
                        } else {
                            reject(new Error('Network error'));
                        }
                    }, 1500);
                });

                simulateApi.then(function() {
                    console.log('Order submitted:', formData);
                    showState(successState);
                }).catch(function() {
                    showState(errorState);
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
    function init() {
        initViewportGuards();
        initLanguageSwitcher();
        initMobileMenu();
        initNavScroll();
        initFadeAnimations();
        initSmoothScroll();
        initModal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
