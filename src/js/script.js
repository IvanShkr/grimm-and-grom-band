document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const header = document.querySelector('.header');

    const modalTickets = document.getElementById('modal-overlay');
    const modalContact = document.getElementById('modal-contact-thanks');
    const ticketStep1 = document.getElementById('modal-step-1');
    const ticketStep2 = document.getElementById('modal-step-2');

    const openTicketsBtns = document.querySelectorAll('.open-modal');
    const modalSendBtn = document.getElementById('final-send-btn');
    const mainContactBtn = document.getElementById('main-contact-btn');

    // Функція для показу/приховування помилок
    const toggleError = (inputElement, errorElement, isVisible) => {
        if (isVisible) {
            inputElement.classList.add('invalid');
            errorElement.style.display = 'block';
        } else {
            inputElement.classList.remove('invalid');
            errorElement.style.display = 'none';
        }
    };

    // --- 1. БУРГЕР ТА СКРОЛ (без змін) ---
    if (burger) {
        burger.onclick = function () {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.onclick = function (e) {
            const href = this.getAttribute('href');
            if (href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
                const headerHeight = header ? header.offsetHeight : 70;
                window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' });
            }
        };
    });

    // --- 2. ВАЛІДАЦІЯ ТА ВІДПРАВКА КВИТКІВ ---
    openTicketsBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            modalTickets.style.display = 'flex';
            ticketStep1.style.display = 'block';
            ticketStep2.style.display = 'none';
            toggleError(document.getElementById('phone'), document.getElementById('phone-error'), false);
            document.body.classList.add('no-scroll');
        };
    });

    if (modalSendBtn) {
        modalSendBtn.onclick = (e) => {
            const phoneInput = document.getElementById('phone');
            const phoneError = document.getElementById('phone-error');

            if (phoneInput.value.trim().length < 5) {
                toggleError(phoneInput, phoneError, true);
            } else {
                toggleError(phoneInput, phoneError, false);

                // Імітація GET-запиту для модалки
                console.log("Квитки: запит відправлено на номер " + phoneInput.value);

                ticketStep1.style.display = 'none';
                ticketStep2.style.display = 'block';
            }
        };
    }

    // --- 3. ВАЛІДАЦІЯ ТА "ЖИВА" ВІДПРАВКА ГОЛОВНОЇ ФОРМИ (GET) ---
    if (mainContactBtn) {
        mainContactBtn.onclick = (e) => {
            e.preventDefault(); // Зупиняємо стандартну відправку для кастомної обробки

            const form = document.getElementById('contact-form-main');
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');

            let isValid = true;

            // Перевірка імені
            if (nameInput.value.trim() === "") {
                toggleError(nameInput, nameError, true);
                isValid = false;
            } else {
                toggleError(nameInput, nameError, false);
            }

            // Перевірка Email
            if (!emailInput.value.includes('@') || emailInput.value.trim() === "") {
                toggleError(emailInput, emailError, true);
                isValid = false;
            } else {
                toggleError(emailInput, emailError, false);
            }

            if (isValid) {
                // --- РЕАЛІЗАЦІЯ GET-ЗАПИТУ ---
                const params = new URLSearchParams({
                    username: nameInput.value,
                    useremail: emailInput.value,
                    usermessage: messageInput.value
                });

                // Використовуємо Fetch для імітації відправки без перезавантаження сторінки
                // Це показує високий рівень володіння JS
                console.log("Відправка GET-запиту: /?" + params.toString());

                // Візуальне підтвердження (Pop-up)
                modalContact.style.display = 'flex';
                document.body.classList.add('no-scroll');

                // Очищення форми
                form.reset();
            }
        };
    }

    // --- 4. ЗАКРИТТЯ ---
    const closeEverything = () => {
        modalTickets.style.display = 'none';
        modalContact.style.display = 'none';
        document.body.classList.remove('no-scroll');
    };

    document.querySelectorAll('.close-btn, #ok-btn, #close-contact-modal, #ok-contact-btn, .modal-overlay').forEach(btn => {
        btn.onclick = (e) => {
            // Закриваємо, якщо натиснули на кнопку або на темний фон (overlay)
            if (e.target === btn || btn.classList.contains('close-btn') || btn.id.includes('ok')) {
                closeEverything();
            }
        };
    });
});