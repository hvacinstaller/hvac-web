document.addEventListener('DOMContentLoaded', function() {
    // 0. АВТОМАТИЧНЕ ОНОВЛЕННЯ РОКУ В ПІДВАЛІ
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 1. ГАМБУРГЕР-МЕНЮ
    const burgerBtn = document.querySelector('.burger-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (burgerBtn && nav) {
        burgerBtn.addEventListener('click', function() {
            burgerBtn.classList.toggle('is-open');
            nav.classList.toggle('is-open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerBtn.classList.remove('is-open');
                nav.classList.remove('is-open');
            });
        });
    }

    // 2. АНІМАЦІЇ ПРИ ПРОКРУТЦІ
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length) {
        function setRandomDelay(elements) {
            elements.forEach(el => {
                if (el.dataset.chaotic === 'true') {
                    const randomDelay = Math.random();
                    el.style.setProperty('--delay', randomDelay + 's');
                }
            });
        }

        setRandomDelay(animatedElements);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(el => { observer.observe(el); });
    }

    // 3. АНІМАЦІЯ СЕКЦІЇ DIVIDER
    const dividerSection = document.querySelector('.divider');
    const dividerTitle = document.querySelector('.divider__title');
    const dividerBlueLine = document.querySelector('.divider-animate-line-blue');
    const dividerText = document.querySelector('.divider__text');
    const dividerYellowLine = document.querySelector('.divider-animate-line-yellow');

    if (dividerSection && dividerTitle && dividerBlueLine && dividerText && dividerYellowLine) {
        const dividerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => { dividerTitle.classList.add('is-visible'); }, 0);
                    setTimeout(() => { dividerBlueLine.classList.add('is-visible'); }, 400);
                    setTimeout(() => { dividerText.classList.add('is-visible'); }, 800);
                    setTimeout(() => { dividerYellowLine.classList.add('is-visible'); }, 1200);
                    dividerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        dividerObserver.observe(dividerSection);
    }

        // 3b. АНІМАЦІЯ СЕКЦІЇ LOCATION (ГЕОГРАФІЯ)
    const locationSection = document.querySelector('.location');
    const locationTitle = document.querySelector('.location__title');

    if (locationSection && locationTitle) {
        const locationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => { locationTitle.classList.add('is-visible'); }, 0);
                    locationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        locationObserver.observe(locationSection);
    }

    // 4. LIGHTBOX ДЛЯ ПЕРЕГЛЯДУ ЗОБРАЖЕНЬ
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const workImages = document.querySelectorAll('.work-image');

    if (lightbox && lightboxImg && lightboxClose) {
        workImages.forEach(img => {
            img.addEventListener('click', function() {
                lightbox.classList.add('is-open');
                lightboxImg.src = this.src;
                document.body.style.overflow = 'hidden';
            });
        });

        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = 'auto';
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('is-open');
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
                lightbox.classList.remove('is-open');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 5. ВІДПРАВКА ФОРМИ ЧЕРЕЗ FORMSUBMIT.CO
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && submitBtn && formMessage) {
        contactForm.addEventListener('submit', async function(e) {
            // Скасовуємо стандартну відправку форми
            e.preventDefault();

            // ДИНАМІЧНЕ ОНОВЛЕННЯ ТЕМИ ЛИСТА З ДАТОЮ ТА ЧАСОМ
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = String(now.getFullYear()).slice(-2);
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

            // Знаходимо приховане поле _subject і оновлюємо його значення
            const subjectField = contactForm.querySelector('input[name="_subject"]');
            if (subjectField) {
                subjectField.value = `Нова заявка Newvent ${formattedDate}`;
            }

            // Блокуємо кнопку на час відправки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Надсилається...';
            formMessage.className = 'form-message';
            formMessage.textContent = '';

            try {
                // Збираємо дані форми
                const formData = new FormData(contactForm);

                // Відправляємо через fetch на Formsubmit
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Успішна відправка
                    formMessage.className = 'form-message success';
                    formMessage.textContent = 'Дякуємо! Ваша заявка успішно надіслана. Ми скоро вийдемо на зв\'язок.';
                    contactForm.reset();
                } else {
                    // Помилка при відправці
                    throw new Error('Помилка при відправці');
                }
            } catch (error) {
                // Обробка помилки
                formMessage.className = 'form-message error';
                formMessage.textContent = 'На жаль, виникла помилка. Спробуйте ще раз або зателефонуйте нам.';
            } finally {
                // Розблоковуємо кнопку
                submitBtn.disabled = false;
                submitBtn.textContent = 'Надіслати';
            }
        });
    }

    // 6. ЗАХИСТ EMAIL ВІД СПАМ-БОТІВ
    // Email збирається з data-атрибутів у момент завантаження сторінки,
    // а не лежить у явному вигляді в HTML-коді
    const emailLink = document.querySelector('.email-link');
    if (emailLink && emailLink.dataset.user && emailLink.dataset.domain) {
        const email = `${emailLink.dataset.user}@${emailLink.dataset.domain}`;
        emailLink.href = `mailto:${email}`;
        emailLink.textContent = email;
    }
});
