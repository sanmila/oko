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
- **Nginx Configured Domains**: `smotri-oko.ru`, `www.smotri-oko.ru`, `smotri-oko.com`, `www.smotri-oko.com` (Config file at `/etc/nginx/sites-available/smotri-oko.ru`)
- **Git Repository**: [https://github.com/sanmila/oko](https://github.com/sanmila/oko) (Branch: `main`)
- **Access Authentication**: The server strictly requires the `vps_begit` Ed25519 SSH key (Password auth is disabled per `AI_MASTER_PROTOCOL.md`).

### Maintenance & Upgrades Guide
For any future upgrades or structural corrections, note the following server context:
1. **Web Server**: Served statically via Nginx on Ubuntu. Configuration is located at `/etc/nginx/sites-available/smotri-oko.ru`.
2. **Pushing Updates**: Changes made locally must be securely transferred over SSH or pulled via Git on the server, ensuring local repo parity with the production folder `/var/www/oko/`.
3. **Environment Protocols**: Ensure any new scripts or automated AI tasks respect the server's `AI_MASTER_PROTOCOL.md` (stored at `/var/www/AI_MASTER_PROTOCOL.md`), which enforces strict logging and security measures.

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

## Version 1.1 (Updates: April 2026)

### Performance & UI Optimizations
1. **Asset Optimization**: Converted oversized `.jpg` images (ranging from 6MB to 18MB) in the `assets/` directory (specifically `sergei-1.jpg`, `sergei-2.jpg`, `sergei-3.jpg`) to highly compressed `.webp` format using `sharp` library. This drastically reduced the total payload size from ~40MB to less than 1MB, resolving critical loading timeouts on mobile devices.
2. **Creator Layout Simplification**: Removed the secondary creator image (`.creator-portrait__img-secondary`) from the `creator.html` page to provide a cleaner, single-portrait layout. The CSS Grid structure (`grid-template-columns: 1fr 1fr`) in `.creator-portrait__images` was updated to `display: block;` to properly center the remaining image without leaving empty gaps.
3. **Deployment**: Changes to `creator.html` and the newly generated `.webp` assets were directly deployed to the live server (`31.128.41.93:/var/www/oko/`) via SCP.
