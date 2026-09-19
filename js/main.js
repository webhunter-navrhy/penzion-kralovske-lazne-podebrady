(() => {
    /* RUSTIC — Warm Boutique Intimate
       GSAP + ScrollTrigger + Lenis smooth scroll
       Award-winning cinematic scroll interactions */

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* ---- Lenis Smooth Scroll ---- */
    let lenis;
    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    /* ---- Master Entrance Timeline ---- */
    const master = gsap.timeline({ delay: 0.15 });

    /* ---- Hero Entrance ---- */
    const hero = document.querySelector('.hero');
    if (hero && !prefersReducedMotion) {
        const heroMedia = hero.querySelector('.hero__media');
        const heroContent = hero.querySelector('.hero__content');
        const heroOrnament = hero.querySelector('.hero-ornament');

        /* Cinematic zoom-out on bg */
        if (heroMedia) {
            master.from(heroMedia, {
                scale: 1.25, duration: 2.2, ease: 'power3.out'
            }, 0);
        }

        /* Ornament fades in first */
        if (heroOrnament) {
            master.fromTo(heroOrnament, {
                opacity: 0,
                scaleX: 0.5
            }, {
                opacity: 1,
                scaleX: 1,
                duration: 1,
                ease: 'power3.out'
            }, 0.3);
        }

        /* Word-by-word title animation with italic reveal */
        const heroTitle = hero.querySelector('.hero__title');
        if (heroTitle) {
            const raw = heroTitle.textContent.trim();
            heroTitle.innerHTML = raw.split(/\s+/).map(w =>
                `<span class="word"><span class="word__inner">${w}</span></span>`
            ).join(' ');
            master.from('.hero__title .word__inner', {
                yPercent: 130,
                opacity: 0,
                duration: 1.1,
                stagger: 0.06,
                ease: 'power4.out'
            }, 0.5);
        }

        /* Subtitle + address fades up */
        const heroSub = hero.querySelector('.hero__sub');
        if (heroSub) {
            master.from(heroSub, {
                y: 25, opacity: 0, duration: 0.9, ease: 'power3.out'
            }, '-=0.6');
        }

        /* Buttons fade up */
        const heroActions = hero.querySelector('.hero__actions');
        if (heroActions) {
            master.from(heroActions.children, {
                y: 20, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out'
            }, '-=0.5');
        }

        /* Scroll indicator */
        const heroScroll = hero.querySelector('.hero__scroll');
        if (heroScroll) {
            master.from(heroScroll, { opacity: 0, duration: 1.2 }, '-=0.2');
        }

        /* Hero parallax on background */
        if (heroMedia) {
            gsap.to(heroMedia, {
                yPercent: 18,
                ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }

        /* Content fades out on scroll */
        if (heroContent) {
            gsap.to(heroContent, {
                yPercent: -25, opacity: 0, ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: '55% top',
                    scrub: 1
                }
            });
        }
    }

    /* ---- Subpage Hero Entrance ---- */
    const pageHero = document.querySelector('.page-hero');
    if (pageHero && !prefersReducedMotion) {
        const content = pageHero.querySelector('.page-hero__content');
        if (content) {
            master.from([...content.children], {
                y: 30, opacity: 0, duration: .8, stagger: 0.08, ease: 'power3.out'
            }, 0);
        }
    }

    /* ---- Overlapping About Image ---- */
    if (!prefersReducedMotion) {
        const aboutImage = document.querySelector('.about__image-wrap');
        if (aboutImage) {
            gsap.fromTo(aboutImage,
                {
                    x: -60,
                    rotation: -4,
                    clipPath: 'inset(0 100% 0 0)'
                },
                {
                    x: 0,
                    rotation: -2,
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.6,
                    ease: 'power4.inOut',
                    scrollTrigger: {
                        trigger: aboutImage,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        }
    }

    /* ---- Feature Cards — Staggered with Offset ---- */
    if (!prefersReducedMotion) {
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length) {
            featureCards.forEach((card, i) => {
                const extraY = i === 1 ? -40 : 0;
                gsap.from(card, {
                    y: 60 + Math.abs(extraY),
                    opacity: 0,
                    duration: 0.9,
                    delay: i * 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card.parentElement,
                        start: 'top 82%',
                        once: true
                    }
                });
            });
        }
    }

    /* ---- Quote Section — Word-by-Word Fade ---- */
    if (!prefersReducedMotion) {
        const quoteText = document.querySelector('.quote-section__text');
        if (quoteText) {
            const words = quoteText.textContent.trim().split(/\s+/);
            quoteText.innerHTML = words.map(w =>
                `<span class="q-word" style="display:inline-block;opacity:0">${w}</span>`
            ).join(' ');
            const qWords = quoteText.querySelectorAll('.q-word');
            gsap.to(qWords, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.03,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: quoteText,
                    start: 'top 80%',
                    once: true
                }
            });
            /* Also fade in the ornaments and attribution */
            const quoteOrnaments = document.querySelectorAll('.quote-section .ornament');
            const quoteAttr = document.querySelector('.quote-section__attr');
            if (quoteOrnaments.length) {
                gsap.from(quoteOrnaments, {
                    opacity: 0, scale: 0.6, duration: 0.8, stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: quoteText, start: 'top 82%', once: true }
                });
            }
            if (quoteAttr) {
                gsap.from(quoteAttr, {
                    opacity: 0, y: 15, duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: quoteText, start: 'top 80%', once: true }
                });
            }
        }
    }

    /* ---- Room Cards — Slide Up ---- */
    if (!prefersReducedMotion) {
        const roomCards = document.querySelectorAll('.room-card');
        if (roomCards.length) {
            gsap.from(roomCards, {
                y: 70,
                opacity: 0,
                duration: 1,
                stagger: 0.18,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: roomCards[0].parentElement,
                    start: 'top 82%',
                    once: true
                }
            });
        }
    }

    /* ---- Gallery Preview — Staggered Clip-Path Reveals ---- */
    if (!prefersReducedMotion) {
        const galleryItems = document.querySelectorAll('.gallery-preview__item');
        if (galleryItems.length) {
            galleryItems.forEach((item, i) => {
                gsap.fromTo(item,
                    { clipPath: 'inset(100% 0 0 0)' },
                    {
                        clipPath: 'inset(0% 0 0 0)',
                        duration: 1.3,
                        delay: i * 0.15,
                        ease: 'power4.inOut',
                        scrollTrigger: {
                            trigger: item.parentElement,
                            start: 'top 82%',
                            once: true
                        }
                    }
                );
                const img = item.querySelector('img');
                if (img) {
                    gsap.fromTo(img,
                        { scale: 1.2 },
                        {
                            scale: 1,
                            duration: 1.8,
                            delay: i * 0.15,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: item.parentElement,
                                start: 'top 82%',
                                once: true
                            }
                        }
                    );
                }
            });
        }
    }

    /* ---- Generic [data-reveal] Elements ---- */
    if (!prefersReducedMotion) {
        document.querySelectorAll('[data-reveal]').forEach(el => {
            /* Skip elements we already animated specifically */
            if (el.classList.contains('about__image-wrap') ||
                el.classList.contains('feature-card') ||
                el.classList.contains('room-card') ||
                el.classList.contains('gallery-preview__item') ||
                el.closest('.hero')) return;

            const delay = parseFloat(el.dataset.delay) || 0;
            const hasImage = el.querySelector('img') || el.tagName === 'IMG';

            if (hasImage) {
                gsap.fromTo(el,
                    { clipPath: 'inset(100% 0 0 0)' },
                    {
                        clipPath: 'inset(0% 0 0 0)',
                        duration: 1.4,
                        delay,
                        ease: 'power4.inOut',
                        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
                    }
                );
                const img = el.querySelector('img');
                if (img) {
                    gsap.fromTo(img,
                        { scale: 1.2 },
                        {
                            scale: 1,
                            duration: 1.8,
                            delay,
                            ease: 'power2.out',
                            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
                        }
                    );
                }
            } else {
                gsap.from(el, {
                    y: 40, opacity: 0, duration: 1, delay,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
                });
            }
        });
    }

    /* ---- Counter Animation for Stats ---- */
    const statsNumbers = document.querySelectorAll('.stats-strip__number');
    if (statsNumbers.length) {
        statsNumbers.forEach(el => {
            const raw = el.textContent.trim();
            const match = raw.match(/^([\d\s,.]+)(.*)$/);
            if (!match) return;

            const numStr = match[1].replace(/\s/g, '').replace(',', '.');
            const suffix = match[2] || '';
            const target = parseFloat(numStr);
            if (isNaN(target)) return;

            const hasDecimal = numStr.includes('.');
            const decimals = hasDecimal ? (numStr.split('.')[1] || '').length : 0;
            const hasSpace = match[1].includes(' ');

            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    if (prefersReducedMotion) {
                        el.textContent = raw;
                        return;
                    }
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2.2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            let formatted = obj.val.toFixed(decimals);
                            if (hasSpace && obj.val >= 1000) {
                                const parts = formatted.split('.');
                                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                                formatted = parts.join('.');
                            }
                            el.textContent = formatted + suffix;
                        }
                    });
                }
            });
        });
    }

    /* data-count attribute handler */
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals) || 0;
        ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
                if (prefersReducedMotion) { el.textContent = target.toFixed(decimals); return; }
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target, duration: 2.5, ease: 'power2.out',
                    onUpdate: () => el.textContent = obj.val.toFixed(decimals)
                });
            }
        });
    });

    /* ---- Parallax Backgrounds ---- */
    if (!prefersReducedMotion) {
        document.querySelectorAll('[data-parallax-bg]').forEach(el => {
            gsap.to(el, {
                yPercent: -18,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        });
    }

    /* ---- Marquee (velocity-responsive) ---- */
    const marqueeInner = document.querySelector('.marquee__inner');
    if (marqueeInner && !prefersReducedMotion) {
        marqueeInner.innerHTML += marqueeInner.innerHTML;
        const marqueeTween = gsap.to(marqueeInner, {
            xPercent: -50,
            duration: 35,
            ease: 'none',
            repeat: -1
        });
        ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: self => {
                const v = Math.abs(self.getVelocity());
                if (v > 50) {
                    gsap.to(marqueeTween, {
                        timeScale: gsap.utils.clamp(1, 5, 1 + v / 800),
                        duration: 0.3,
                        overwrite: true
                    });
                } else {
                    gsap.to(marqueeTween, {
                        timeScale: 1,
                        duration: 0.8,
                        overwrite: true
                    });
                }
            }
        });
    }

    /* ---- Scroll Progress Bar ---- */
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        gsap.to(progressBar, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }

    /* ---- Horizontal Scroll Gallery (subpages) ---- */
    const hscroll = document.querySelector('.hscroll');
    if (hscroll && !prefersReducedMotion) {
        const track = hscroll.querySelector('.hscroll__track');
        const panels = hscroll.querySelectorAll('.hscroll__panel');
        if (track && panels.length > 1) {
            const hscrollTween = gsap.to(track, {
                x: () => -(track.scrollWidth - hscroll.offsetWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: hscroll,
                    start: 'top top',
                    end: () => '+=' + (track.scrollWidth - hscroll.offsetWidth),
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
            panels.forEach(panel => {
                const img = panel.querySelector('img');
                if (img) {
                    gsap.fromTo(img, { xPercent: -8 }, {
                        xPercent: 8, ease: 'none',
                        scrollTrigger: {
                            trigger: panel,
                            start: 'left right',
                            end: 'right left',
                            scrub: true,
                            containerAnimation: hscrollTween
                        }
                    });
                }
            });
        }
    }

    /* ---- Surround cards (subpages) ---- */
    if (!prefersReducedMotion) {
        const surroundCards = document.querySelectorAll('.surround-card');
        if (surroundCards.length) {
            gsap.from(surroundCards, {
                y: 40, opacity: 0, duration: 0.7, stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: surroundCards[0].parentElement,
                    start: 'top 82%',
                    once: true
                }
            });
        }

        const bentoItems = document.querySelectorAll('.bento__item--text');
        if (bentoItems.length) {
            gsap.from(bentoItems, {
                y: 30, opacity: 0, duration: 0.7, stagger: 0.06,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: bentoItems[0].parentElement,
                    start: 'top 82%',
                    once: true
                }
            });
        }
    }

    /* ---- Magnetic Buttons (desktop only) ---- */
    if (!prefersReducedMotion && window.innerWidth > 900) {
        document.querySelectorAll('[data-magnetic]').forEach(btn => {
            const strength = parseFloat(btn.dataset.magnetic) || 0.3;
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * strength,
                    y: y * strength,
                    duration: 0.4,
                    ease: 'power3.out'
                });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0, y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.4)'
                });
            });
        });
    }

    /* ---- Nav Scroll State ---- */
    const nav = document.getElementById('nav');
    if (nav && !nav.classList.contains('nav--solid')) {
        ScrollTrigger.create({
            start: 80,
            onUpdate: self => nav.classList.toggle('nav--scrolled', self.scroll() > 80)
        });
    }

    /* ---- Mobile Menu ---- */
    const toggle = document.getElementById('nav-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    if (toggle && navOverlay) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navOverlay.classList.toggle('open');
            if (lenis) {
                navOverlay.classList.contains('open') ? lenis.stop() : lenis.start();
            }
        });
        navOverlay.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggle.classList.remove('active');
                navOverlay.classList.remove('open');
                if (lenis) lenis.start();
            });
        });
    }

    /* ---- Sticky Bar ---- */
    const stickyBar = document.getElementById('sticky-bar');
    if (stickyBar) {
        const heroEl = document.querySelector('.hero, .page-hero');
        const triggerPoint = heroEl ? heroEl.offsetHeight : 600;
        ScrollTrigger.create({
            start: triggerPoint,
            onUpdate: self => stickyBar.classList.toggle('sticky-bar--visible', self.scroll() > triggerPoint)
        });
    }

    /* ---- Lightbox (galerie page) ---- */
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lbImg = lightbox.querySelector('.lightbox__img');
        const btnClose = lightbox.querySelector('.lightbox__close');
        const btnPrev = lightbox.querySelector('.lightbox__prev');
        const btnNext = lightbox.querySelector('.lightbox__next');
        const elCurrent = document.getElementById('lb-current');
        const elTotal = document.getElementById('lb-total');
        let items = [], current = 0;

        function open(i) {
            current = i;
            lbImg.src = items[current].src;
            if (elCurrent) elCurrent.textContent = current + 1;
            if (elTotal) elTotal.textContent = items.length;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }
        function close() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }
        function prev() {
            current = (current - 1 + items.length) % items.length;
            lbImg.src = items[current].src;
            if (elCurrent) elCurrent.textContent = current + 1;
        }
        function next() {
            current = (current + 1) % items.length;
            lbImg.src = items[current].src;
            if (elCurrent) elCurrent.textContent = current + 1;
        }

        document.querySelectorAll('.gallery__item img').forEach((image, i) => {
            items.push(image);
            image.addEventListener('click', () => open(i));
        });

        if (btnClose) btnClose.addEventListener('click', close);
        if (btnPrev) btnPrev.addEventListener('click', prev);
        if (btnNext) btnNext.addEventListener('click', next);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

        let touchStartX = 0;
        lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        });
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });
    }

})();
