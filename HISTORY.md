# OKO Project History & Documentation

## Version 1.0 (Launched: April 2026)

### Product Overview
**OKO** is a handcrafted optical instrument designed to reduce visual overload. Without the use of applications or batteries, it employs frosted glass to soften the visual field, aiding in stress reduction and focus. Built with brass, walnut wood, and optical glass, it positions itself as a premium, physical wellness tool.

### Technical Architecture
The initial release (Version 1) is a single-page static application.

**Core Technologies**:
- HTML5 (Semantic Structure)
- Vanilla CSS (`styles.css` with CSS variables for responsive design and custom properties)
- Vanilla JavaScript (`script.js` for interactivity, form validation, and language toggling)

**Deployment Details**:
- **Hosting VPS**: `31.128.41.93`
- **Location on VPS**: `/var/www/oko/`
- **Nginx Configured Domains**: `preview-oko.sanjay.ru`, `www.preview-oko.sanjay.ru`
- **Git Repository**: [https://github.com/sanmila/oko](https://github.com/sanmila/oko) (Branch: `main`)

### Key Components
1. **Navigation (`nav`)**: Sticky top navigation with language toggle (RU/EN) and mobile hamburger menu. 
2. **Hero Section (`.hero`)**: Introducing the product slogan: "Видишь меньше. Думаешь тише." (See less. Think quieter).
3. **Product Presentation**: Sections explaining the value proposition (`What is OKO`, `Problem`, `How it works`), utilizing a staggered fade-in animation strategy.
4. **Materials (`.materials`)**: Highlights the physical craftsmanship (Brass, Walnut Wood, Optical Glass).
5. **Checkout / Order System (`.product`, `#orderModal`)**: 
   - Base Price: 24,900 ₽
   - Includes an inline HTML form nested inside a modal component.
   - Form fields: Name, Phone, Email, Comment. 
   - State handling covers Form state, Success State, and Error State.

### Design System Notes
- **Typography Primary**: `Josefin Sans` for strong modern geometric forms.
- **Typography Secondary / Editorial**: `Cormorant Garamond` representing the crafted, premium nature.
- **Animations**: Global CSS `.fade-in` utility classes that activate upon viewport entry.
- **Assets**: Heavily relies on dynamically swapped premium images between themes (`dark-hero`, `light-1`, `dark-box`, etc.) all encoded as optimized `.webp` fallbacks.

### Known Limitations & Future Corrections (V1)
1. **Localization**: The HTML is initially hardcoded in `ru` (Russian). The language toggle button functions via `script.js` but a more robust i18n JSON pipeline may be needed if more languages are added.
2. **Order Submission API**: The modal currently mocks a submission state visually. For a real production launch, the form needs to be hooked up to a server-side endpoint (like Formspree or a custom Node/PHP mailer) to successfully handle `hello@oko.co` reservations.
3. **Analytics**: No tracking pixels (Yandex.Metrika or Google Analytics) are implemented yet.

*This document serves as the V1 baseline representation to preserve structural design intentions before continuing further development cycles.*
