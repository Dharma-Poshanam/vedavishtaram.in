document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Universal Font Size Adjustment
    // ==========================================
    const contentArea = document.querySelector('.content-area');
    const increaseBtn = document.getElementById('increase-font'); // Adjusted ID to match HTML
    const decreaseBtn = document.getElementById('decrease-font'); // Adjusted ID to match HTML
    const sizeDisplay = document.getElementById('font-size-display');
    
    // Default size
    let currentSize = 22; 

    function updateFontSize() {
        if(contentArea) {
            contentArea.style.fontSize = `${currentSize}px`;
        }
        if(sizeDisplay) {
            sizeDisplay.textContent = `${currentSize}px`;
        }
        localStorage.setItem('shroutaFontSize', currentSize);
    }

    // Load preference on start
    const savedSize = localStorage.getItem('shroutaFontSize');
    if(savedSize) {
        currentSize = parseInt(savedSize);
        updateFontSize();
    }

    // Check if buttons exist before adding listeners (Universal Safety)
    if(increaseBtn && decreaseBtn) {
        increaseBtn.addEventListener('click', () => {
            if (currentSize < 50) { currentSize += 2; updateFontSize(); }
        });

        decreaseBtn.addEventListener('click', () => {
            if (currentSize > 14) { currentSize -= 2; updateFontSize(); }
        });
    }

    // ==========================================
    // 2. Language & Transliteration Engine
    // ==========================================
    const langSelect = document.getElementById('language-select');
    const body = document.body;
    
    // Capture original text nodes ONLY from the content area to protect menus
    const textNodes = [];
    
    if(contentArea) {
        // TreeWalker is efficient for finding text nodes deeper in the DOM
        const walker = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, null, false);
        while(walker.nextNode()) {
            const node = walker.currentNode;
            if(node.nodeValue.trim().length > 0) {
                // Save the original Devanagari logic
                node.originalText = node.nodeValue;
                textNodes.push(node);
            }
        }
    }

    function applyLanguage(lang) {
        // 1. Change CSS Class (for Fonts)
        body.classList.remove('devanagari', 'telugu', 'kannada');
        if(lang !== 'default') body.classList.add(lang);
        
        // 2. Save Preference
        localStorage.setItem('shroutaLanguage', lang);

        // 3. Transliterate Text Nodes
        textNodes.forEach(node => {
            if (lang === 'devanagari') {
                node.nodeValue = node.originalText;
            } else {
                node.nodeValue = transliterate(node.originalText, lang);
            }
        });
    }

    if(langSelect) {
        // Load saved language
        const savedLang = localStorage.getItem('shroutaLanguage');
        if(savedLang) {
            langSelect.value = savedLang;
            // We need a slight delay or immediate call depending on DOM load speed, 
            // but usually immediate is fine here.
            applyLanguage(savedLang);
        }

        langSelect.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
        });
    }

    // ==========================================
    // 3. Ritwik Filter (Checkboxes) - RESTORED
    // ==========================================
    const filters = ['adhvaryu', 'hotr', 'yajamana', 'agnidhra'];

    filters.forEach(role => {
        const checkbox = document.getElementById('show-' + role);
        if(checkbox) {
            checkbox.addEventListener('change', function() {
                if(this.checked) {
                    body.classList.remove('hide-' + role);
                } else {
                    body.classList.add('hide-' + role);
                }
            });
        }
    });

    // ==========================================
    // 4. Utility: Right Click Disable & Share
    // ==========================================
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Share Button Logic
    window.sharePage = function() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href,
            }).catch(err => console.log(err));
        } else {
            alert('Link copied to clipboard!');
            navigator.clipboard.writeText(window.location.href);
        }
    };
});

// ==========================================
// Helper: Unicode Transliteration Logic
// ==========================================
function transliterate(text, targetLang) {
    if (!text) return text;
    
    // Unicode Offsets relative to Devanagari (0x0900)
    // Telugu starts at 0x0C00 -> Offset is 0x300
    // Kannada starts at 0x0C80 -> Offset is 0x380
    
    let offset = 0;
    if (targetLang === 'telugu') offset = 0x0300; 
    else if (targetLang === 'kannada') offset = 0x0380;
    else return text; // Fallback

    let result = '';
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        
        // Check if character is in Devanagari Range (0900 to 097F)
        if (code >= 0x0900 && code <= 0x097F) {
            // Apply offset to shift to target language
            result += String.fromCharCode(code + offset);
        } 
        else {
            // Pass through non-Devanagari chars (English, Vedic accents, punctuation)
            result += text[i];
        }
    }
    return result;
}