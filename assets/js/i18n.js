/**
 * SaiGonGo - Internationalization (i18n) Module
 * Hệ thống đa ngôn ngữ cho SaiGonGo
 * 
 * CÁCH SỬ DỤNG:
 * 1. Thêm translations.js và i18n.js vào mỗi trang HTML
 * 2. Thêm attribute data-i18n="key" vào các element cần dịch
 * 3. Ngôn ngữ đã chọn ở trang đầu sẽ tự động áp dụng cho các trang sau
 * 
 * VÍ DỤ HTML:
 * <h1 data-i18n="museum_verify_title">📍 Xác thực điểm đến</h1>
 * <button data-i18n="btn_continue">Tiếp tục</button>
 * <input placeholder="..." data-i18n-placeholder="footer_email_placeholder">
 */

const i18n = {
    // Ngôn ngữ mặc định
    defaultLanguage: 'vi',
    
    // Ngôn ngữ hiện tại
    currentLanguage: 'vi',
    
    // Key lưu trong localStorage
    storageKey: 'saigongo_language',
    
    // Danh sách ngôn ngữ hỗ trợ
    supportedLanguages: [
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', region: 'Việt Nam' },
        { code: 'en', name: 'English', flag: '🇺🇸', region: 'United States' }
    ],
    
    /**
     * Khởi tạo hệ thống i18n
     * Tự động đọc ngôn ngữ từ localStorage và áp dụng
     */
    init: function() {
        // Lấy ngôn ngữ đã lưu từ localStorage hoặc dùng mặc định
        const savedLang = localStorage.getItem(this.storageKey);
        this.currentLanguage = savedLang || this.defaultLanguage;
        
        // Áp dụng ngôn ngữ
        this.applyTranslations();
        
        // Tạo language selector nếu có container
        this.createLanguageSelector();
        
        // Cập nhật attribute lang của thẻ html
        document.documentElement.lang = this.currentLanguage;
        
        // Lắng nghe sự kiện storage để đồng bộ giữa các tab
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey && e.newValue) {
                this.currentLanguage = e.newValue;
                this.applyTranslations();
                this.updateLanguageSelector();
            }
        });
        
        console.log(`[i18n] Initialized with language: ${this.currentLanguage}`);
    },
    
    /**
     * Đổi ngôn ngữ
     * @param {string} langCode - Mã ngôn ngữ ('vi' hoặc 'en')
     */
    setLanguage: function(langCode) {
        if (!translations[langCode]) {
            console.error(`[i18n] Language '${langCode}' not supported`);
            return;
        }
        
        this.currentLanguage = langCode;
        localStorage.setItem(this.storageKey, langCode);
        document.documentElement.lang = langCode;
        
        this.applyTranslations();
        this.updateLanguageSelector();
        
        // Dispatch event để các component khác có thể lắng nghe
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: langCode } 
        }));
        
        console.log(`[i18n] Language changed to: ${langCode}`);
    },
    
    /**
     * Lấy bản dịch theo key
     * Hỗ trợ thay thế placeholder như {distance}, {count}
     * @param {string} key - Key của bản dịch
     * @param {object} params - Object chứa các giá trị thay thế
     * @param {string} fallback - Giá trị mặc định nếu không tìm thấy
     * @returns {string} Bản dịch
     */
    t: function(key, params = {}, fallback = '') {
        let translation = translations[this.currentLanguage]?.[key];
        
        if (!translation) {
            console.warn(`[i18n] Translation not found for key: ${key}`);
            return fallback || key;
        }
        
        // Thay thế các placeholder {name} bằng giá trị trong params
        Object.keys(params).forEach(param => {
            translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
        });
        
        return translation;
    },
    
    /**
     * Áp dụng bản dịch cho tất cả elements có data-i18n
     */
    applyTranslations: function() {
        // Dịch text content
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation && translation !== key) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.hasAttribute('placeholder')) {
                        element.placeholder = translation;
                    } else {
                        element.value = translation;
                    }
                } else if (element.tagName === 'IMG') {
                    element.alt = translation;
                } else {
                    // Kiểm tra xem có chứa HTML không (có thẻ <b>, <br>, etc.)
                    if (translation.includes('<') && translation.includes('>')) {
                        element.innerHTML = translation;
                    } else {
                        element.textContent = translation;
                    }
                }
            }
        });
        
        // Dịch placeholder riêng
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation && translation !== key) {
                element.placeholder = translation;
            }
        });
        
        // Dịch title attribute
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation && translation !== key) {
                element.title = translation;
            }
        });
        
        // Dịch aria-label
        const ariaElements = document.querySelectorAll('[data-i18n-aria]');
        ariaElements.forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            const translation = this.t(key);
            if (translation && translation !== key) {
                element.setAttribute('aria-label', translation);
            }
        });
    },
    
    /**
     * Tạo Language Selector UI (giống Spotify)
     * Chỉ tạo nếu có element với id="language-selector-container"
     */
    createLanguageSelector: function() {
        const container = document.getElementById('language-selector-container');
        if (!container) {
            // Không có container thì không tạo selector
            // Nhưng vẫn áp dụng ngôn ngữ đã lưu
            return;
        }
        
        const currentLangInfo = this.supportedLanguages.find(
            lang => lang.code === this.currentLanguage
        );
        
        container.innerHTML = `
            <div class="language-selector">
                <button class="language-btn" id="language-toggle" aria-label="Select language">
                    <svg class="globe-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <span class="current-lang-text">${currentLangInfo.region} (${currentLangInfo.name})</span>
                    <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                
                <div class="language-dropdown" id="language-dropdown">
                    <div class="dropdown-header" data-i18n="lang_select">${this.t('lang_select')}</div>
                    <ul class="language-list">
                        ${this.supportedLanguages.map(lang => `
                            <li class="language-item language-option ${lang.code === this.currentLanguage ? 'active' : ''}" 
                                data-lang="${lang.code}">
                                <span class="lang-flag">${lang.flag}</span>
                                <div class="lang-info">
                                    <span class="lang-name">${lang.name}</span>
                                    <span class="lang-region">${lang.region}</span>
                                </div>
                                ${lang.code === this.currentLanguage ? '<span class="check-icon">✓</span>' : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        this.initLanguageSelectorEvents();
    },
    
    /**
     * Khởi tạo events cho Language Selector
     */
    initLanguageSelectorEvents: function() {
        const toggle = document.getElementById('language-toggle');
        const dropdown = document.getElementById('language-dropdown');
        
        if (!toggle || !dropdown) return;
        
        // Toggle dropdown
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = dropdown.classList.toggle('show');
            toggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Click vào ngôn ngữ
        const langItems = document.querySelectorAll('.language-item');
        langItems.forEach(item => {
            item.addEventListener('click', () => {
                const langCode = item.getAttribute('data-lang');
                this.setLanguage(langCode);
                dropdown.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Đóng dropdown khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) {
                dropdown.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Đóng dropdown khi nhấn Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    },
    
    /**
     * Cập nhật UI của Language Selector
     */
    updateLanguageSelector: function() {
        const currentLangSpan = document.querySelector('.current-lang-text');
        const langItems = document.querySelectorAll('.language-item');
        const dropdownHeader = document.querySelector('.dropdown-header');
        
        const currentLangInfo = this.supportedLanguages.find(
            lang => lang.code === this.currentLanguage
        );
        
        if (currentLangSpan && currentLangInfo) {
            currentLangSpan.textContent = `${currentLangInfo.region} (${currentLangInfo.name})`;
        }
        
        if (dropdownHeader) {
            dropdownHeader.textContent = this.t('lang_select');
        }
        
        langItems.forEach(item => {
            const langCode = item.getAttribute('data-lang');
            const isActive = langCode === this.currentLanguage;
            
            item.classList.toggle('active', isActive);
            
            const existingCheck = item.querySelector('.check-icon');
            if (isActive && !existingCheck) {
                item.innerHTML += '<span class="check-icon">✓</span>';
            } else if (!isActive && existingCheck) {
                existingCheck.remove();
            }
        });
    },
    
    /**
     * Lấy ngôn ngữ hiện tại
     * @returns {string} Mã ngôn ngữ hiện tại
     */
    getCurrentLanguage: function() {
        return this.currentLanguage;
    },
    
    /**
     * Kiểm tra xem ngôn ngữ hiện tại có phải là tiếng Việt không
     * @returns {boolean}
     */
    isVietnamese: function() {
        return this.currentLanguage === 'vi';
    },
    
    /**
     * Kiểm tra xem ngôn ngữ hiện tại có phải là tiếng Anh không
     * @returns {boolean}
     */
    isEnglish: function() {
        return this.currentLanguage === 'en';
    }
};

// Auto-init khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof translations !== 'undefined') {
        i18n.init();
    } else {
        console.error('[i18n] translations.js must be loaded before i18n.js');
    }
});

// Export để sử dụng trong các module khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}