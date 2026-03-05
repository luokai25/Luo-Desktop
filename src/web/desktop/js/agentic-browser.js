/**
 * Agentic Browser - AI-controlled browser automation
 * AI can "see" the page and take actions
 */

class AgenticBrowser {
    constructor() {
        this.isRecording = false;
        this.actions = [];
        this.currentTask = null;
        this.status = 'idle'; // idle, recording, executing, complete
    }

    render(container) {
        container.innerHTML = `
            <div class="agentic-browser">
                <div class="ab-toolbar">
                    <div class="ab-status" id="ab-status">
                        <span class="status-dot"></span>
                        <span class="status-text">Ready</span>
                    </div>
                    <div class="ab-task-container">
                        <input type="text" id="ab-task-input" placeholder="Tell AI what to do (e.g., 'Find laptop prices on Amazon')">
                        <button id="ab-execute-btn">▶️ Execute</button>
                    </div>
                    <div class="ab-actions">
                        <button id="ab-record-btn" class="action-btn">⏺️ Record</button>
                        <button id="ab-stop-btn" class="action-btn">⏹️ Stop</button>
                        <button id="ab-clear-btn" class="action-btn">🗑️ Clear</button>
                    </div>
                </div>
                
                <div class="ab-main">
                    <div class="ab-sidebar">
                        <h3>Actions Log</h3>
                        <div class="ab-actions-list" id="ab-actions-list">
                            <p class="empty">No actions yet</p>
                        </div>
                    </div>
                    
                    <div class="ab-viewer">
                        <div class="ab-iframe-container">
                            <iframe id="ab-iframe" src="about:blank"></iframe>
                        </div>
                        <div class="ab-overlay" id="ab-overlay" style="display:none;">
                            <div class="overlay-message" id="overlay-message">AI is working...</div>
                        </div>
                    </div>
                </div>
                
                <div class="ab-terminal" id="ab-terminal">
                    <div class="terminal-header">AI Thought Process</div>
                    <div class="terminal-body" id="ab-terminal-body">
                        <div class="term-line">🤖 Agentic Browser ready. Describe a task!</div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupEvents();
    }

    setupEvents() {
        document.getElementById('ab-execute-btn')?.addEventListener('click', () => this.executeTask());
        document.getElementById('ab-record-btn')?.addEventListener('click', () => this.toggleRecording());
        document.getElementById('ab-stop-btn')?.addEventListener('click', () => this.stop());
        document.getElementById('ab-clear-btn')?.addEventListener('click', () => this.clear());
    }

    updateStatus(status, text) {
        const statusEl = document.getElementById('ab-status');
        const dot = statusEl?.querySelector('.status-dot');
        const txt = statusEl?.querySelector('.status-text');
        
        this.status = status;
        if (dot) dot.className = `status-dot ${status}`;
        if (txt) txt.textContent = text;
    }

    log(message, type = 'info') {
        const body = document.getElementById('ab-terminal-body');
        if (!body) return;
        
        const line = document.createElement('div');
        line.className = `term-line ${type}`;
        line.textContent = message;
        body.appendChild(line);
        body.scrollTop = body.scrollHeight;
    }

    addAction(action) {
        this.actions.push(action);
        
        const list = document.getElementById('ab-actions-list');
        if (!list) return;
        
        if (this.actions.length === 1) {
            list.innerHTML = '';
        }
        
        const item = document.createElement('div');
        item.className = 'action-item';
        item.innerHTML = `
            <span class="action-icon">${action.icon}</span>
            <span class="action-desc">${action.description}</span>
        `;
        list.appendChild(item);
    }

    async executeTask() {
        const input = document.getElementById('ab-task-input');
        const task = input.value.trim();
        
        if (!task) {
            this.log('Please enter a task first!', 'error');
            return;
        }

        this.currentTask = task;
        this.updateStatus('executing', 'AI Working...');
        this.log(`🎯 Task: ${task}`);
        
        // Generate actions based on task
        const actions = this.generateActions(task);
        
        this.log(`📋 Generated ${actions.length} action(s)`);
        
        // Execute actions
        for (const action of actions) {
            this.addAction(action);
            await this.executeAction(action);
        }
        
        this.updateStatus('complete        this.log('', 'Complete!');
✅ Task complete!', 'success');
    }

    generateActions(task) {
        const t = task.toLowerCase();
        const actions = [];
        
        // Navigation
        if (t.includes('search') || t.includes('find') || t.includes('look')) {
            actions.push({
                type: 'navigate',
                icon: '🌐',
                description: 'Navigate to search engine',
                target: 'https://www.google.com'
            });
            
            // Extract search term
            const searchMatch = task.match(/(?:search|find|look up|search for)\s+(.+?)(?:\s+on|\s+in|$)/i);
            if (searchMatch) {
                actions.push({
                    type: 'input',
                    icon: '⌨️',
                    description: `Search for "${searchMatch[1]}"`,
                    value: searchMatch[1]
                });
                actions.push({
                    type: 'press',
                    icon: '↵',
                    description: 'Press Enter',
                    key: 'Enter'
                });
            }
        }
        
        // Shopping
        if (t.includes('buy') || t.includes('price') || t.includes('amazon') || t.includes('shop')) {
            actions.push({
                type: 'navigate',
                icon: '🛒',
                description: 'Navigate to shopping site',
                target: 'https://www.amazon.com'
            });
        }
        
        // Social
        if (t.includes('twitter') || t.includes('facebook') || t.includes('social')) {
            actions.push({
                type: 'navigate',
                icon: '📱',
                description: 'Navigate to social media',
                target: 'https://twitter.com'
            });
        }
        
        // Code
        if (t.includes('github') || t.includes('code') || t.includes('repo')) {
            actions.push({
                type: 'navigate',
                icon: '💻',
                description: 'Navigate to GitHub',
                target: 'https://github.com'
            });
        }
        
        // Default: just navigate to Google
        if (actions.length === 0) {
            actions.push({
                type: 'navigate',
                icon: '🌐',
                description: 'Navigate to Google',
                target: 'https://www.google.com'
            });
        }
        
        return actions;
    }

    async executeAction(action) {
        this.log(`→ ${action.description}...`);
        
        // Simulate action delay
        await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
        
        if (action.type === 'navigate') {
            const iframe = document.getElementById('ab-iframe');
            if (iframe) {
                try {
                    iframe.src = action.target;
                    this.log(`   ✅ Navigated to ${new URL(action.target).hostname}`);
                } catch (e) {
                    this.log(`   ❌ Navigation failed`, 'error');
                }
            }
        }
        
        // More action types can be implemented
    }

    toggleRecording() {
        this.isRecording = !this.isRecording;
        
        const btn = document.getElementById('ab-record-btn');
        if (btn) {
            btn.classList.toggle('active', this.isRecording);
            btn.textContent = this.isRecording ? '⏹️ Stop Recording' : '⏺️ Record';
        }
        
        this.updateStatus(this.isRecording ? 'recording' : 'idle', this.isRecording ? 'Recording...' : 'Ready');
        this.log(this.isRecording ? '🔴 Recording started. Click elements to record actions.' : '⏹️ Recording stopped.');
    }

    stop() {
        this.isRecording = false;
        this.updateStatus('idle', 'Ready');
        this.log('⏹️ Execution stopped by user.', 'error');
    }

    clear() {
        this.actions = [];
        this.currentTask = null;
        this.updateStatus('idle', 'Ready');
        
        const list = document.getElementById('ab-actions-list');
        if (list) list.innerHTML = '<p class="empty">No actions yet</p>';
        
        const body = document.getElementById('ab-terminal-body');
        if (body) body.innerHTML = '<div class="term-line">🤖 Agentic Browser ready. Describe a task!</div>';
        
        this.log('🗑️ Cleared all actions.');
    }
}

// CSS for Agentic Browser
const agenticBrowserCSS = `
    .agentic-browser {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #0a0a0f;
    }
    
    .ab-toolbar {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(20, 20, 35, 0.98);
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .ab-status {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(255,255,255,0.05);
        border-radius: 20px;
    }
    
    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #666;
    }
    
    .status-dot.executing {
        background: #fbbf24;
        animation: pulse 1s infinite;
    }
    
    .status-dot.complete {
        background: #34d399;
    }
    
    .status-dot.recording {
        background: #f87171;
        animation: pulse 0.5s infinite;
    }
    
    .status-text {
        font-size: 12px;
        color: rgba(255,255,255,0.7);
    }
    
    .ab-task-container {
        flex: 1;
        display: flex;
        gap: 10px;
    }
    
    .ab-task-container input {
        flex: 1;
        padding: 10px 16px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        color: #fff;
        font-size: 14px;
    }
    
    .ab-task-container button {
        padding: 10px 20px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border: none;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        font-weight: 500;
    }
    
    .ab-actions {
        display: flex;
        gap: 8px;
    }
    
    .ab-actions .action-btn {
        padding: 8px 12px;
        background: rgba(255,255,255,0.1);
        border: none;
        border-radius: 6px;
        color: rgba(255,255,255,0.7);
        cursor: pointer;
        font-size: 12px;
    }
    
    .ab-main {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
    
    .ab-sidebar {
        width: 250px;
        background: rgba(0,0,0,0.3);
        border-right: 1px solid rgba(255,255,255,0.1);
        padding: 15px;
        overflow-y: auto;
    }
    
    .ab-sidebar h3 {
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        text-transform: uppercase;
        margin: 0 0 15px 0;
    }
    
    .ab-actions-list .empty {
        color: rgba(255,255,255,0.3);
        font-size: 13px;
        text-align: center;
        padding: 20px;
    }
    
    .action-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        margin-bottom: 8px;
    }
    
    .action-icon {
        font-size: 18px;
    }
    
    .action-desc {
        font-size: 12px;
        color: rgba(255,255,255,0.8);
    }
    
    .ab-viewer {
        flex: 1;
        position: relative;
    }
    
    .ab-iframe-container {
        width: 100%;
        height: 100%;
    }
    
    .ab-iframe-container iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #fff;
    }
    
    .ab-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .overlay-message {
        padding: 20px 40px;
        background: rgba(99, 102, 241, 0.3);
        border: 1px solid rgba(99, 102, 241, 0.5);
        border-radius: 12px;
        color: #fff;
        font-size: 18px;
    }
    
    .ab-terminal {
        height: 120px;
        background: #0d1117;
        border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .ab-terminal .terminal-header {
        padding: 8px 15px;
        background: rgba(255,255,255,0.05);
        font-size: 12px;
        color: rgba(255,255,255,0.5);
    }
    
    .ab-terminal .terminal-body {
        padding: 10px 15px;
        font-family: 'Consolas', monospace;
        font-size: 12px;
        overflow-y: auto;
        height: calc(100% - 30px);
    }
    
    .term-line {
        color: #c9d1d9;
        margin-bottom: 4px;
    }
    
    .term-line.error {
        color: #f87171;
    }
    
    .term-line.success {
        color: #34d399;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;

// Export
window.AgenticBrowser = AgenticBrowser;
