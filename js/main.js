document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);
    
    feather.replace();

    const siteWrapper = document.querySelector('.site-wrapper');
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    
    function initPageAnimations() {
        gsap.to(siteWrapper, { opacity: 1, visibility: 'visible', duration: 0.8, ease: 'power2.out' });
        gsap.from(".hero-title span", { y: 70, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" });
        gsap.from(["#hero .hero-subtitle", "#hero .button-outline"], { y: 50, opacity: 0, stagger: 0.2, duration: 0.8, delay: 0.3, ease: "power3.out" });

        const sectionsToAnimate = document.querySelectorAll('.section:not(#philosophy)');
        sectionsToAnimate.forEach(section => {
            const title = section.querySelector('.section-title');
            const elements = section.querySelectorAll('.card, .stat, .testimonial-slider, .pricing-card, .contact-links, .section-cta, .philosophy-grid, .faq-grid');
            if (title) { gsap.from(title, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' } }); }
            if (elements.length > 0) { gsap.from(elements, { y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' } }); }
        });

        const philosophyTabs = document.querySelectorAll('.philosophy-tab');
        const philosophyTexts = document.querySelectorAll('.philosophy-text');
        const philosophyImages = document.querySelectorAll('.philosophy-image');
        philosophyTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('active')) return;
                const targetId = tab.dataset.target;
                gsap.to('.philosophy-text.active, .philosophy-image.active', { opacity: 0, duration: 0.4, ease: 'power2.in' });
                philosophyTabs.forEach(t => t.classList.remove('active'));
                philosophyTexts.forEach(t => t.classList.remove('active'));
                philosophyImages.forEach(i => i.classList.remove('active'));
                tab.classList.add('active');
                const newText = document.querySelector(`.philosophy-text[data-id="${targetId}"]`);
                const newImage = document.querySelector(`.philosophy-image[data-id="${targetId}"]`);
                newText.classList.add('active');
                newImage.classList.add('active');
                gsap.to([newText, newImage], { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.4 });
            });
        });

        if (isDesktop) {
            const cursor = document.querySelector('.cursor');
            gsap.to(cursor, { opacity: 1, duration: 0.5, delay: 1 });
            const interactiveElements = document.querySelectorAll('a, button, .card, .pricing-card, .faq-question, .philosophy-tab, .slider-controls button, .menu-icon');
            window.addEventListener('mousemove', e => { gsap.to(cursor, { duration: 0.4, x: e.clientX, y: e.clientY, ease: 'power3.out' }); });
            document.body.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
            document.body.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('grow-strong'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('grow-strong'));
            });

            document.querySelectorAll('#services .card').forEach(card => {
                const content = card.querySelector('.card-content');
                const icon = card.querySelector('.card-icon-wrapper');
                const link = card.querySelector('.card-link');
                const timeline = gsap.timeline({ paused: true });
                timeline.to(content, { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' }).fromTo(icon, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2').fromTo(link, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2');
                card.addEventListener('mouseenter', () => timeline.play());
                card.addEventListener('mouseleave', () => timeline.reverse());
            });
        }
    }

    const loader = document.getElementById('loader');
    gsap.to(loader, { duration: 0.8, opacity: 0, delay: 1.5, ease: 'power1.inOut', onComplete: () => { loader.style.display = 'none'; initPageAnimations(); } });

    ScrollTrigger.create({ start: 'top -80', toggleClass: { targets: "#header", className: 'scrolled' } });

    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => { menuIcon.classList.toggle('active'); navLinks.classList.toggle('active'); });
        document.querySelectorAll('.nav-links a').forEach(link => { link.addEventListener('click', () => { menuIcon.classList.remove('active'); navLinks.classList.remove('active'); }); });
    }

    gsap.utils.toArray('.stat-number').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            once: true,
            onEnter: () => { gsap.to(counter, { textContent: target, duration: 2.5, ease: 'power2.out', snap: { textContent: 1 } }); }
        });
    });

    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        function showSlide(index) { slides.forEach((slide, i) => slide.classList.toggle('active', i === index)); }
        showSlide(currentSlide);
        nextBtn.addEventListener('click', () => { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); });
        prevBtn.addEventListener('click', () => { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); });
    }

    // LÓGICA FINAL E CORRIGIDA PARA O FAQ COM IMAGEM PADRÃO
    const faqItems = document.querySelectorAll('.faq-item');
    const allFaqImages = document.querySelectorAll('.faq-image');
    const defaultFaqImage = document.querySelector('.faq-image-default');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            
            // Primeiro, fecha qualquer outro item que esteja aberto
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    gsap.to(activeItem.querySelector('.faq-answer'), { maxHeight: 0, duration: 0.4, ease: 'power2.out' });
                }
            });
            
            // Lida com o item que foi clicado
            if (wasActive) {
                // Se já estava ativo, apenas fecha
                item.classList.remove('active');
                gsap.to(answer, { maxHeight: 0, duration: 0.4, ease: 'power2.out' });
            } else {
                // Se não estava ativo, abre
                item.classList.add('active');
                gsap.to(answer, { maxHeight: answer.scrollHeight, duration: 0.4, ease: 'power2.out' });
            }

            // Lógica para trocar as imagens
            const targetImageId = item.dataset.imageTarget;
            const targetImage = document.querySelector(`.faq-image[data-id="${targetImageId}"]`);
            let currentVisibleImage = document.querySelector('.faq-image.active');
            let newVisibleImage;

            if (wasActive) {
                // Se estava ativo e foi fechado, a nova imagem é a padrão
                newVisibleImage = defaultFaqImage;
            } else {
                // Se um novo item foi aberto, a nova imagem é a do alvo
                newVisibleImage = targetImage;
            }
            
            // Só anima se a imagem for mudar
            if (currentVisibleImage !== newVisibleImage) {
                // Esconde a imagem atual
                if(currentVisibleImage) {
                    currentVisibleImage.classList.remove('active');
                    gsap.to(currentVisibleImage, { opacity: 0, duration: 0.3 });
                }
                // Mostra a nova imagem
                if (newVisibleImage) {
                    newVisibleImage.classList.add('active');
                    gsap.to(newVisibleImage, { opacity: 1, duration: 0.3, delay: 0.2 });
                }
            }
        });
    });

});