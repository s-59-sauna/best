// Адаптивные функции для всех устройств

// ===== ОСНОВНЫЕ ФУНКЦИИ =====

// Глобальные переменные
let discountSlider = null;
let mobileSliderInterval = null;
let resizeTimeout = null;

// Параллакс эффект
document.addEventListener('DOMContentLoaded', function() {
    const parallaxBg = document.querySelector('.parallax-bg');
    
    if (parallaxBg) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const bgY = scrolled * 0.8;
            parallaxBg.style.transform = `translateY(${bgY}px)`;
        });
    }
    
    // Инициализация всех компонентов
    initAllComponents();
});

// Модальное окно для телефонов
function showPhoneNumbers() {
    const modal = document.getElementById('phoneModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closePhoneModal() {
    const modal = document.getElementById('phoneModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Закрытие модального окна при клике вне окна
document.addEventListener('click', function(event) {
    const modal = document.getElementById('phoneModal');
    if (modal && event.target === modal) {
        closePhoneModal();
    }
    
    const imageModal = document.getElementById('my-modal');
    if (imageModal && event.target === imageModal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePhoneModal();
        closeModal();
    }
});

class DiscountSlider {
    constructor() {
        this.slider = document.querySelector('.discounts-slider');
        this.slides = document.querySelectorAll('.discount-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.slideDuration = 5000; // 5 секунд
        
        this.init();
    }
    
    init() {
        // Инициализация первого слайда
        this.updateSlider();
        
        // Запуск автопрокрутки
        this.startAutoSlide();
        
        // Добавление обработчиков событий
        this.addEventListeners();
        
        // Пауза при наведении на слайдер
        this.addHoverPause();
    }
    
    startAutoSlide() {
        this.clearAutoSlide();
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
        
        // Запуск анимации прогресса на индикаторе
        this.startProgressAnimation();
    }
    
    clearAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
        
        // Остановка анимации прогресса
        this.stopProgressAnimation();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.startProgressAnimation();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
        this.startProgressAnimation();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateSlider();
            this.startProgressAnimation();
        }
    }
    
    updateSlider() {
        // Удаляем класс active у всех слайдов
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });
        
        // Добавляем класс active текущему слайду
        this.slides[this.currentSlide].classList.add('active');
        
        // Обновляем индикаторы
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Добавляем классы для анимации
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        
        this.slides[prevIndex].classList.add('prev');
        this.slides[nextIndex].classList.add('next');
    }
    
    startProgressAnimation() {
        // Удаляем предыдущую анимацию
        this.stopProgressAnimation();
        
        const activeIndicator = this.indicators[this.currentSlide];
        if (activeIndicator) {
            // Добавляем элемент для анимации прогресса
            const progress = document.createElement('div');
            progress.className = 'indicator-progress';
            progress.style.cssText = `
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border-radius: 50%;
                border: 2px solid transparent;
                border-top-color: #d402a7;
                animation: progress ${this.slideDuration}ms linear forwards;
            `;
            
            activeIndicator.appendChild(progress);
        }
    }
    
    stopProgressAnimation() {
        const activeIndicator = this.indicators[this.currentSlide];
        if (activeIndicator) {
            const progress = activeIndicator.querySelector('.indicator-progress');
            if (progress) {
                progress.remove();
            }
        }
    }
    
    addEventListeners() {
        // Обработчики для индикаторов
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.clearAutoSlide();
                this.goToSlide(index);
                this.startAutoSlide();
            });
        });
        
        // Кнопки навигации
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.clearAutoSlide();
                this.prevSlide();
                this.startAutoSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.clearAutoSlide();
                this.nextSlide();
                this.startAutoSlide();
            });
        }
        
        // Клавиши клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.clearAutoSlide();
                this.prevSlide();
                this.startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                this.clearAutoSlide();
                this.nextSlide();
                this.startAutoSlide();
            } else if (e.key >= '1' && e.key <= '3') {
                const index = parseInt(e.key) - 1;
                this.clearAutoSlide();
                this.goToSlide(index);
                this.startAutoSlide();
            }
        });
        
        // Касания для мобильных
        this.addTouchEvents();
    }
    
    addTouchEvents() {
        let startX = 0;
        let endX = 0;
        const threshold = 50; // минимальное расстояние для свайпа
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.clearAutoSlide();
        }, { passive: true });
        
        this.slider.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });
        
        this.slider.addEventListener('touchend', () => {
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.startAutoSlide();
        }, { passive: true });
    }
    
    addHoverPause() {
        this.slider.addEventListener('mouseenter', () => {
            this.clearAutoSlide();
        });
        
        this.slider.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }
    
    // Очистка при уничтожении
    destroy() {
        this.clearAutoSlide();
        
        // Удаляем все обработчики
        this.indicators.forEach(indicator => {
            const newIndicator = indicator.cloneNode(true);
            indicator.parentNode.replaceChild(newIndicator, indicator);
        });
        
        if (this.prevBtn) {
            const newPrevBtn = this.prevBtn.cloneNode(true);
            this.prevBtn.parentNode.replaceChild(newPrevBtn, this.prevBtn);
        }
        
        if (this.nextBtn) {
            const newNextBtn = this.nextBtn.cloneNode(true);
            this.nextBtn.parentNode.replaceChild(newNextBtn, this.nextBtn);
        }
    }
}

// Инициализация слайдера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const discountSlider = new DiscountSlider();
    
    // Экспорт в глобальную область видимости (для отладки)
    window.discountSlider = discountSlider;
    
    // Очистка при закрытии страницы
    window.addEventListener('beforeunload', () => {
        discountSlider.destroy();
    });
});

// Добавляем CSS для анимации прогресса
const style = document.createElement('style');
style.textContent = `
    @keyframes progress {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    
    .indicator-progress {
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// ===== УПРАВЛЕНИЕ БОКОВОЙ ПАНЕЛЬЮ =====

// Переключение мобильной панели
function toggleMobilePanel() {
    const mobilePanel = document.querySelector('.mobile-ad-panel');
    const mobileToggle = document.querySelector('.sidebar-toggle.mobile-toggle');
    
    if (!mobilePanel || !mobileToggle) return;
    
    const toggleIcon = mobileToggle.querySelector('.toggle-icon');
    const isHidden = mobilePanel.classList.contains('mobile-panel-hidden');
    
    if (isHidden) {
        // Показываем панель
        mobilePanel.classList.remove('mobile-panel-hidden');
        mobileToggle.classList.remove('mobile-toggle-hidden');
        if (toggleIcon) toggleIcon.textContent = '▲';
        
        // Рассчитываем высоту динамически
        const panelHeight = mobilePanel.offsetHeight;
        document.documentElement.style.setProperty('--mobile-panel-height', panelHeight + 'px');
    } else {
        // Скрываем панель
        mobilePanel.classList.add('mobile-panel-hidden');
        mobileToggle.classList.add('mobile-toggle-hidden');
        if (toggleIcon) toggleIcon.textContent = '▼';
    }
}

// Слайдер мобильной панели
function initMobileSlider() {
    const mobileSlides = document.querySelectorAll('.mobile-ad-slide');
    const mobileIndicators = document.querySelectorAll('.mobile-ad-indicators .indicator');
    
    if (mobileSlides.length === 0) return;
    
    let currentMobileSlide = 0;
    
    function showMobileSlide(index) {
        mobileSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            if (mobileIndicators[i]) {
                mobileIndicators[i].classList.toggle('active', i === index);
            }
        });
        currentMobileSlide = index;
    }
    
    function nextMobileSlide() {
        let nextIndex = (currentMobileSlide + 1) % mobileSlides.length;
        showMobileSlide(nextIndex);
    }
    
    // Очищаем предыдущий интервал
    if (mobileSliderInterval) {
        clearInterval(mobileSliderInterval);
    }
    
    // Автоматическое переключение
    mobileSliderInterval = setInterval(nextMobileSlide, 4000);
    
    // Клик по индикаторам
    mobileIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(mobileSliderInterval);
            showMobileSlide(index);
            mobileSliderInterval = setInterval(nextMobileSlide, 4000);
        });
    });
    
    // Клик по слайдам
    const titles = ['SPA-продукция', 'Напитки', 'Аренда', 'Спецпредложение'];
    mobileSlides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            alert(`Вы выбрали: ${titles[index]}\nНаш менеджер свяжется с вами для уточнения деталей.`);
        });
    });
}

// ===== ДРУГИЕ ФУНКЦИИ =====

function initDiscountSlider() {
    if (discountSlider) {
        discountSlider.destroy();
    }
    discountSlider = new DiscountSlider();
}

function nextDiscountSlide() {
    if (discountSlider) {
        discountSlider.nextSlide();
    }
}

function prevDiscountSlide() {
    if (discountSlider) {
        discountSlider.prevSlide();
    }
}

function goToDiscountSlide(index) {
    if (discountSlider) {
        discountSlider.goToSlide(index);
    }
}

// Фотогалерея
function openModal(imgElement) {
    const modalImg = document.getElementById("fullscreen-img");
    const modal = document.getElementById("my-modal");
    
    if (modalImg && modal) {
        modalImg.src = imgElement.src;
        modal.style.display = "flex";
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById("my-modal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}

// Прокрутка
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToFeedback() {
    const section = document.getElementById('feedback');
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function scrollToContacts() {
    const contacts = document.getElementById('contacts');
    if (contacts) {
        contacts.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Кнопка "Наверх"
function initScrollToTopButton() {
    const toTopBtn = document.querySelector('.floating-btn-simple.to-top');
    
    if (toTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                toTopBtn.classList.add('visible');
            } else {
                toTopBtn.classList.remove('visible');
            }
        });
    }
}

// ===== АДАПТИВНЫЕ ФУНКЦИИ =====

// Инициализация всех компонентов
function initAllComponents() {
    // Инициализация слайдеров
    initDiscountSlider();
    initMobileSlider();
    
    // Инициализация кнопки "Наверх"
    initScrollToTopButton();
    
    // Инициализация обработчиков рекламы
    initAdHandlers();
    
    // Инициализация адаптивных обработчиков
    initResponsiveHandlers();
    
    // Инициализация обработчиков клавиатуры
    initKeyboardHandlers();
    
    // Обработчик переключения мобильной панели
    const toggleBtn = document.getElementById('mobilePanelToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMobilePanel);
    }
    
    // Добавление пункта "карта" в мобильное меню
    if (window.innerWidth <= 1200) {
        const nav = document.querySelector('.refs');
        if (nav) {
            const contactsLi = document.createElement('li');
            const contactsLink = document.createElement('a');
            contactsLink.href = '#contacts';
            contactsLink.innerHTML = '<strong>карта</strong>';
            contactsLink.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToContacts();
            });
            contactsLi.appendChild(contactsLink);
            nav.appendChild(contactsLi);
        }
    }
}

// Обработчики рекламы
function initAdHandlers() {
    document.querySelectorAll('.ad-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const adBlock = this.closest('.ad-block');
            if (adBlock) {
                const adTitle = adBlock.querySelector('h3');
                if (adTitle) {
                    alert(`Вы выбрали: ${adTitle.textContent}\nНаш менеджер свяжется с вами для уточнения деталей.`);
                }
            }
        });
    });
}

// Адаптивные обработчики
function initResponsiveHandlers() {
    // Автоскрытие мобильной панели при скролле
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    function handleAutoHideOnScroll() {
        if (window.innerWidth <= 1200) {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            const mobilePanel = document.querySelector('.mobile-ad-panel');
            const mobileToggle = document.querySelector('.sidebar-toggle.mobile-toggle');
            
            if (!mobilePanel || !mobileToggle) return;
            
            const isPanelHidden = mobilePanel.classList.contains('mobile-panel-hidden');
            
            if (st > lastScrollTop && st > scrollThreshold) {
                // Скролл вниз - скрываем
                if (!isPanelHidden) {
                    mobilePanel.classList.add('mobile-panel-hidden');
                    mobileToggle.classList.add('mobile-toggle-hidden');
                    const toggleIcon = mobileToggle.querySelector('.toggle-icon');
                    if (toggleIcon) toggleIcon.textContent = '▼';
                }
            } else if (st < lastScrollTop) {
                // Скролл вверх - показываем
                if (isPanelHidden) {
                    mobilePanel.classList.remove('mobile-panel-hidden');
                    mobileToggle.classList.remove('mobile-toggle-hidden');
                    const toggleIcon = mobileToggle.querySelector('.toggle-icon');
                    if (toggleIcon) toggleIcon.textContent = '▲';
                }
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }
    }
    
    window.addEventListener('scroll', handleAutoHideOnScroll, { passive: true });
    
    // Обработка изменения размера окна
    function debouncedResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    }
    
    window.addEventListener('resize', debouncedResize);
    
    // Первоначальная настройка
    handleResize();
}

function handleResize() {
    const isMobileView = window.innerWidth <= 1200;
    const mobilePanel = document.querySelector('.mobile-ad-panel');
    const desktopSidebar = document.querySelector('.ad-sidebar');
    
    if (isMobileView) {
        // Мобильный режим
        if (desktopSidebar) desktopSidebar.style.display = 'none';
        if (mobilePanel) {
            mobilePanel.style.display = 'block';
            mobilePanel.classList.remove('mobile-panel-hidden');
        }
        
        // Обновление слайдера акций для мобильных
        if (discountSlider) {
            discountSlider.isMobile = true;
            discountSlider.startAutoSlide();
        }
    } else {
        // Десктоп режим
        if (desktopSidebar) desktopSidebar.style.display = 'flex';
        if (mobilePanel) {
            mobilePanel.style.display = 'none';
            mobilePanel.classList.add('mobile-panel-hidden');
        }
        
        // Обновление слайдера акций для десктопа
        if (discountSlider) {
            discountSlider.isMobile = false;
            discountSlider.startAutoSlide();
        }
    }
}

// Обработчики клавиатуры
function initKeyboardHandlers() {
    document.addEventListener('keydown', function(event) {
        // Управление слайдером акций
        if (['ArrowLeft', 'ArrowRight', '1', '2', '3'].includes(event.key)) {
            event.preventDefault();
            
            switch(event.key) {
                case 'ArrowLeft':
                    prevDiscountSlide();
                    break;
                case 'ArrowRight':
                    nextDiscountSlide();
                    break;
                case '1':
                    goToDiscountSlide(0);
                    break;
                case '2':
                    goToDiscountSlide(1);
                    break;
                case '3':
                    goToDiscountSlide(2);
                    break;
            }
        }
        
        // Закрытие модальных окон по ESC уже обрабатывается выше
    });
}

// Оптимизация для сенсорных устройств
document.addEventListener('touchstart', function() {}, {passive: true});

// Очистка при закрытии страницы
window.addEventListener('beforeunload', function() {
    if (discountSlider) {
        discountSlider.destroy();
    }
    if (mobileSliderInterval) {
        clearInterval(mobileSliderInterval);
    }
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
});
