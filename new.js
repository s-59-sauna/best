// Адаптивные функции для всех устройств

// ===== ОСНОВНЫЕ ФУНКЦИИ =====

// Параллакс эффект
document.addEventListener('DOMContentLoaded', function() {
    const parallaxBg = document.querySelector('.parallax-bg');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        if (parallaxBg) {
            const bgY = scrolled * 0.8;
            parallaxBg.style.transform = `translateY(${bgY}px)`;
        }
    });
    
    // Инициализация всех компонентов
    initAllComponents();
});

// Модальное окно для телефонов
function showPhoneNumbers() {
    const modal = document.getElementById('phoneModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePhoneModal() {
    const modal = document.getElementById('phoneModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Закрытие модального окна
window.onclick = function(event) {
    const modal = document.getElementById('phoneModal');
    if (event.target == modal) {
        closePhoneModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePhoneModal();
    }
});

// ===== СЛАЙДЕР АКЦИЙ =====
class DiscountSlider {
    constructor() {
        this.slidesContainer = document.querySelector('.slidesOne');
        this.slides = document.querySelectorAll('.slideActions');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlideIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        this.updateSlider();
        this.startAutoSlide();
        this.addEventListeners();
    }
    
    startAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
        
        // Разная скорость для мобильных и десктопа
        const slideDuration = this.isMobile ? 4000 : 5000;
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, slideDuration);
    }
    
    nextSlide() {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlideIndex = (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlideIndex = index;
            this.updateSlider();
        }
    }
    
    updateSlider() {
        const translateValue = -(this.currentSlideIndex * 100 / this.totalSlides) + '%';
        this.slidesContainer.style.transform = 'translateX(' + translateValue + ')';
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlideIndex);
        });
        
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlideIndex);
        });
    }
    
    addEventListeners() {
        // Пауза при наведении на десктопе
        if (!this.isMobile) {
            this.slidesContainer.addEventListener('mouseenter', () => {
                clearInterval(this.autoSlideInterval);
            });
            
            this.slidesContainer.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }
        
        // Сенсорные события для мобильных
        if (this.isMobile) {
            let startX = 0;
            let endX = 0;
            
            this.slidesContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            this.slidesContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;
                
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            });
        }
    }
}

// ===== УПРАВЛЕНИЕ БОКОВОЙ ПАНЕЛЬЮ =====

// Переключение мобильной панели
function toggleMobilePanel() {
    const mobilePanel = document.querySelector('.mobile-ad-panel');
    const mobileToggle = document.querySelector('.sidebar-toggle.mobile-toggle');
    const toggleIcon = mobileToggle.querySelector('.toggle-icon');
    
    mobilePanel.classList.toggle('hidden');
    mobileToggle.classList.toggle('hidden');
    
    if (mobilePanel.classList.contains('hidden')) {
        toggleIcon.textContent = '▼';
        document.body.style.marginBottom = '0';
        document.querySelector('.main-content-wrapper').style.marginBottom = '0';
    } else {
        toggleIcon.textContent = '▲';
        const panelHeight = mobilePanel.offsetHeight;
        document.body.style.marginBottom = panelHeight + 'px';
        document.querySelector('.main-content-wrapper').style.marginBottom = panelHeight + 'px';
    }
}

// Слайдер мобильной панели
let currentMobileSlide = 0;
let mobileSliderInterval = null;

function initMobileSlider() {
    const mobileSlides = document.querySelectorAll('.mobile-ad-slide');
    const mobileIndicators = document.querySelectorAll('.mobile-ad-indicators .indicator');
    
    if (mobileSlides.length === 0) return;
    
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
    mobileSlides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            const titles = ['SPA-продукция', 'Напитки', 'Аренда', 'Спецпредложение'];
            alert(`Вы выбрали: ${titles[index]}\nНаш менеджер свяжется с вами для уточнения деталей.`);
        });
    });
}

// ===== ДРУГИЕ ФУНКЦИИ =====

// Глобальные переменные
let discountSlider = null;

function initDiscountSlider() {
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
    modalImg.src = imgElement.src;
    document.getElementById("my-modal").style.display = "flex";
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById("my-modal").style.display = "none";
    document.body.style.overflow = 'auto';
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
    document.getElementById('contacts').scrollIntoView({
        behavior: 'smooth'
    });
}

// Кнопка "Наверх"
function initScrollToTopButton() {
    const toTopBtn = document.querySelector('.floating-btn-simple.to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            toTopBtn.classList.add('visible');
        } else {
            toTopBtn.classList.remove('visible');
        }
    });
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
}

// Обработчики рекламы
function initAdHandlers() {
    document.querySelectorAll('.ad-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const adTitle = this.closest('.ad-block').querySelector('h3').textContent;
            alert(`Вы выбрали: ${adTitle}\nНаш менеджер свяжется с вами для уточнения деталей.`);
        });
    });
}

// Адаптивные обработчики
function initResponsiveHandlers() {
    const mobileToggle = document.querySelector('.sidebar-toggle.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobilePanel);
    }
    
    // Автоскрытие мобильной панели при скролле
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 1200) {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            const mobilePanel = document.querySelector('.mobile-ad-panel');
            const mobileToggle = document.querySelector('.sidebar-toggle.mobile-toggle');
            
            if (st > lastScrollTop && st > scrollThreshold) {
                // Скролл вниз - скрываем
                if (mobilePanel && !mobilePanel.classList.contains('hidden')) {
                    mobilePanel.classList.add('hidden');
                    mobileToggle.classList.add('hidden');
                    mobileToggle.querySelector('.toggle-icon').textContent = '▼';
                }
            } else if (st < lastScrollTop) {
                // Скролл вверх - показываем
                if (mobilePanel && mobilePanel.classList.contains('hidden')) {
                    mobilePanel.classList.remove('hidden');
                    mobileToggle.classList.remove('hidden');
                    mobileToggle.querySelector('.toggle-icon').textContent = '▲';
                }
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }
    }, false);
    
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            handleResize();
        }, 250);
    });
    
    // Первоначальная настройка
    handleResize();
}

function handleResize() {
    const isMobile = window.innerWidth <= 1200;
    const mobilePanel = document.querySelector('.mobile-ad-panel');
    const desktopSidebar = document.querySelector('.ad-sidebar');
    
    if (isMobile) {
        // Мобильный режим
        if (desktopSidebar) desktopSidebar.style.display = 'none';
        if (mobilePanel) mobilePanel.style.display = 'block';
        
        // Обновление слайдера акций для мобильных
        if (discountSlider) {
            discountSlider.isMobile = true;
            discountSlider.startAutoSlide();
        }
    } else {
        // Десктоп режим
        if (desktopSidebar) desktopSidebar.style.display = 'flex';
        if (mobilePanel) mobilePanel.style.display = 'none';
        
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
        
        // Закрытие модальных окон по ESC
        if (event.key === 'Escape') {
            const phoneModal = document.getElementById('phoneModal');
            const imageModal = document.getElementById('my-modal');
            
            if (phoneModal && phoneModal.style.display !== 'none') {
                closePhoneModal();
            }
            
            if (imageModal && imageModal.style.display !== 'none') {
                closeModal();
            }
        }
    });
}

// Навигация в мобильном меню
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.refs');
    if (nav && window.innerWidth <= 1200) {
        const contactsLi = document.createElement('li');
        const contactsLink = document.createElement('a');
        contactsLink.href = '#contacts';
        contactsLink.innerHTML = '<strong>карта</strong>';
        contactsLink.onclick = function(e) {
            e.preventDefault();
            scrollToContacts();
        };
        contactsLi.appendChild(contactsLink);
        nav.appendChild(contactsLi);
    }
});

// Оптимизация для сенсорных устройств
document.addEventListener('touchstart', function() {}, {passive: true});