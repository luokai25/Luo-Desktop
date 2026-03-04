// Luo Desktop - AI Integration Layer
class AIIntegration {
    constructor() {
        this.enabled = true;
        this.voiceEnabled = false;
        this.clipboardHistory = [];
        this.activityLog = [];
        
        this.init();
    }

    init() {
        this.setupAIAssistant();
        this.setupClipboardManager();
        this.setupActivityTracking();
        this.setupVoiceControl();
    }

    // AI Writing Assistant - Inline in any text field
    setupAIAssistant() {
        // Adds floating button to selected text
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                this.showAIFloatingButton(selection);
            }
        });
    }

    showAIFloatingButton(selection) {
        let btn = document.getElementById('ai-write-btn');
        if (!btn) {
            btn = document.createElement('div');
            btn.id = 'ai-write-btn';
            btn.className = 'ai-floating-btn';
            btn.innerHTML = '✨ AI';
            btn.innerHTML = `
                <div class="ai-btn-options">
                    <button data-action="fix">✏️ Fix Grammar</button>
                    <button data-action="rephrase">🔄 Rephrase</button>
                    <button data-action="expand">📝 Expand</button>
                    <button data-action="summarize">📋 Summarize</button>
                    <button data-action="translate">🌍 Translate</button>
                </div>
            `;
            document.body.appendChild(btn);
        }
        
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        btn.style.top = `${rect.top - 40}px`;
        btn.style.left = `${rect.left + (rect.width / 2) - 30}px`;
        btn.style.display = 'block';
        
        // Handle actions
        btn.querySelectorAll('button').forEach(b => {
            b.onclick = () => this.handleAIAction(b.dataset.action, selection.toString());
        });
    }

    handleAIAction(action, text) {
        // In production, this would call an AI API
        const responses = {
            fix: `✓ Fixed: "${text}"`,
            rephrase: `Rephrased: "${text}"`,
            expand: `Expanded: "${text}..."`,
            summarize: `Summary of "${text}"`,
            translate: `Translated: "${text}"`
        };
        
        window.notificationSystem.success(responses[action] || 'AI processing...');
        document.getElementById('ai-write-btn').style.display = 'none';
    }

    // Smart Clipboard
    setupClipboardManager() {
        document.addEventListener('copy', (e) => {
            const content = e.clipboardData.getData('text');
            this.clipboardHistory.unshift({
                content,
                type: this.detectContentType(content),
                timestamp: Date.now()
            });
            
            // Keep only last 50
            if (this.clipboardHistory.length > 50) {
                this.clipboardHistory.pop();
            }
        });
    }

    detectContentType(content) {
        if (content.match(/^https?:\/\//)) return 'url';
        if (content.match(/^[\w.-]+@[\w.-]+/)) return 'email';
        if (content.match(/^[\{\[]/)) return 'code';
        return 'text';
    }

    showClipboardHistory() {
        const menu = document.createElement('div');
        menu.className = 'clipboard-history context-menu';
        menu.style.left = '50%';
        menu.style.top = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.maxHeight = '400px';
        menu.style.overflow = 'auto';
        
        menu.innerHTML = `
            <div class="context-menu-item" style="font-weight: 600;">📋 Clipboard History</div>
            <div class="context-menu-separator"></div>
            ${this.clipboardHistory.slice(0, 10).map((item, i) => `
                <div class="context-menu-item clipboard-item" data-index="${i}">
                    <span class="clipboard-type">${this.getTypeIcon(item.type)}</span>
                    <span class="clipboard-content">${this.truncate(item.content, 50)}</span>
                </div>
            `).join('')}
        `;
        
        document.body.appendChild(menu);
        
        menu.querySelectorAll('.clipboard-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.index);
                navigator.clipboard.writeText(this.clipboardHistory[idx].content);
                window.notificationSystem.success('Copied to clipboard!');
                menu.remove();
            });
        });
        
        setTimeout(() => {
            document.addEventListener('click', function close() {
                menu.remove();
                document.removeEventListener('click', close);
            });
        }, 0);
    }

    getTypeIcon(type) {
        const icons = { url: '🔗', email: '📧', code: '💻', text: '📝' };
        return icons[type] || '📝';
    }

    truncate(str, len) {
        return str.length > len ? str.substring(0, len) + '...' : str;
    }

    // Activity Timeline
    setupActivityTracking() {
        // Track app usage
        window.addEventListener('focus-window', (e) => {
            this.logActivity('app_focus', e.detail);
        });
        
        // Track file operations
        window.addEventListener('file-operation', (e) => {
            this.logActivity('file', e.detail);
        });
    }

    logActivity(type, data) {
        this.activityLog.unshift({
            type,
            data,
            timestamp: Date.now()
        });
        
        if (this.activityLog.length > 1000) {
            this.activityLog.pop();
        }
    }

    showActivityTimeline() {
        const today = new Date().toDateString();
        const todayActivities = this.activityLog.filter(a => 
            new Date(a.timestamp).toDateString() === today
        );
        
        // Group by hour
        const grouped = {};
        todayActivities.forEach(a => {
            const hour = new Date(a.timestamp).getHours();
            if (!grouped[hour]) grouped[hour] = [];
            grouped[hour].push(a);
        });
        
        window.luoDesktop.openApp('timeline');
    }

    // Voice Control
    setupVoiceControl() {
        if (!('webkitSpeechRecognition' in window)) return;
        
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        
        this.recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
            this.processVoiceCommand(command);
        };
        
        this.recognition.onerror = (e) => {
            console.log('Voice error:', e);
        };
    }

    startVoiceControl() {
        if (this.recognition) {
            this.recognition.start();
            window.notificationSystem.success('🎤 Voice control activated');
        }
    }

    stopVoiceControl() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    processVoiceCommand(command) {
        const commands = {
            'open browser': () => window.luoDesktop.openApp('browser'),
            'open files': () => window.luoDesktop.openApp('files'),
            'open settings': () => window.luoDesktop.openApp('settings'),
            'open terminal': () => window.luoDesktop.openApp('terminal'),
            'new window': () => window.luoDesktop.openApp('browser'),
            'minimize': () => this.minimizeActiveWindow(),
            'maximize': () => this.maximizeActiveWindow(),
            'close': () => this.closeActiveWindow(),
            'take screenshot': () => this.takeScreenshot(),
        };
        
        for (const [key, fn] of Object.entries(commands)) {
            if (command.includes(key)) {
                fn();
                return;
            }
        }
        
        window.notificationSystem.info(`Voice command: "${command}"`);
    }

    minimizeActiveWindow() {
        // Would minimize active window
    }

    maximizeActiveWindow() {
        // Would maximize active window
    }

    closeActiveWindow() {
        // Would close active window
    }

    // Screenshot
    takeScreenshot() {
        html2canvas(document.body).then(canvas => {
            const link = document.createElement('a');
            link.download = `screenshot-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            window.notificationSystem.success('📸 Screenshot saved!');
        });
    }

    // AI File Organizer (stub)
    async organizeFiles() {
        window.notificationSystem.info('🤖 AI is analyzing your files...');
        // Would scan files and suggest organization
    }

    // AI Notification Summarizer
    showNotificationDigest() {
        const notifications = window.notificationSystem.notifications;
        const count = notifications.length;
        
        const digest = `
            You received ${count} notifications today.
            
            Summary: Most from ${this.getMostActiveApp(notifications)}
        `;
        
        window.notificationSystem.notify('📊 Daily Digest', digest, { icon: '📊' });
    }

    getMostActiveApp(notifications) {
        const apps = {};
        notifications.forEach(n => {
            apps[n.app] = (apps[n.app] || 0) + 1;
        });
        return Object.entries(apps).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';
    }
}

// Initialize
window.aiIntegration = new AIIntegration();
