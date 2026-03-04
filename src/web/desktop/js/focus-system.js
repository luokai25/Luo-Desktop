// Luo Desktop - Focus & Productivity System
class FocusSystem {
    constructor() {
        this.timer = null;
        this.isRunning = false;
        this.isPaused = false;
        this.mode = 'pomodoro'; // pomodoro, break, long-break
        this.sessionsCompleted = 0;
        
        this.config = {
            pomodoro: 25 * 60 * 1000,
            shortBreak: 5 * 60 * 1000,
            longBreak: 15 * 60 * 1000,
            longBreakInterval: 4
        };
        
        this.timeRemaining = this.config.pomodoro;
        
        this.init();
    }

    init() {
        this.renderWidget();
    }

    renderWidget() {
        return `
            <div class="focus-widget" id="focus-widget">
                <div class="focus-timer">
                    <div class="timer-display">${this.formatTime(this.timeRemaining)}</div>
                    <div class="timer-mode">${this.getModeLabel()}</div>
                </div>
                <div class="focus-controls">
                    <button class="focus-btn ${this.isRunning ? 'pause' : 'play'}" id="focus-toggle">
                        ${this.isRunning ? '⏸️' : '▶️'}
                    </button>
                    <button class="focus-btn reset" id="focus-reset">🔄</button>
                </div>
                <div class="focus-modes">
                    <button class="mode-btn ${this.mode === 'pomodoro' ? 'active' : ''}" data-mode="pomodoro">🍅 Pomodoro</button>
                    <button class="mode-btn ${this.mode === 'shortBreak' ? 'active' : ''}" data-mode="shortBreak">☕ Break</button>
                </div>
                <div class="focus-sessions">
                    Sessions: ${this.sessionsCompleted}
                </div>
            </div>
        `;
    }

    getModeLabel() {
        const labels = {
            pomodoro: 'Focus Time',
            shortBreak: 'Short Break',
            longBreak: 'Long Break'
        };
        return labels[this.mode];
    }

    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.timeRemaining -= 1000;
                
                if (this.timeRemaining <= 0) {
                    this.complete();
                }
                
                this.updateDisplay();
            }
        }, 1000);
        
        this.updateUI();
        
        // Auto-enable DND
        window.notificationSystem.dnd = true;
    }

    pause() {
        this.isPaused = !this.isPaused;
        this.updateUI();
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timer);
        this.timeRemaining = this.config[this.mode];
        this.updateUI();
        
        // Disable DND
        window.notificationSystem.dnd = false;
    }

    reset() {
        this.stop();
        this.timeRemaining = this.config[this.mode];
        this.updateDisplay();
    }

    complete() {
        this.stop();
        
        if (this.mode === 'pomodoro') {
            this.sessionsCompleted++;
            
            if (this.sessionsCompleted % this.config.longBreakInterval === 0) {
                this.setMode('longBreak');
            } else {
                this.setMode('shortBreak');
            }
            
            // Celebrate
            window.notificationSystem.success('🎉 Pomodoro complete! Take a break.');
        } else {
            this.setMode('pomodoro');
            window.notificationSystem.success('☕ Break over! Ready to focus?');
        }
        
        this.updateDisplay();
    }

    setMode(mode) {
        this.mode = mode;
        this.timeRemaining = this.config[mode];
        this.stop();
        this.updateDisplay();
    }

    updateDisplay() {
        const display = document.querySelector('.timer-display');
        if (display) {
            display.textContent = this.formatTime(this.timeRemaining);
        }
    }

    updateUI() {
        const toggle = document.getElementById('focus-toggle');
        if (toggle) {
            toggle.textContent = this.isRunning ? '⏸️' : '▶️';
            toggle.classList.toggle('pause', this.isRunning);
            toggle.classList.toggle('play', !this.isRunning);
        }
    }

    // Add to taskbar
    addToTaskbar() {
        const taskbar = document.getElementById('taskbar');
        if (!taskbar) return;
        
        const existing = taskbar.querySelector('.focus-timer-widget');
        if (existing) return;
        
        const widget = document.createElement('div');
        widget.className = 'focus-timer-widget';
        widget.innerHTML = `
            <button class="focus-mini-btn">
                <span class="focus-icon">🍅</span>
                <span class="focus-time">${this.formatTime(this.timeRemaining)}</span>
            </button>
        `;
        
        taskbar.querySelector('.taskbar-tray').prepend(widget);
        
        widget.addEventListener('click', () => {
            window.luoDesktop.openApp('focus');
        });
    }
}

// Activity Timeline App
class ActivityTimeline {
    constructor() {
        this.activities = [];
    }

    render() {
        const today = new Date().toDateString();
        const grouped = this.groupByDate(this.activities);
        
        return `
            <div class="activity-timeline">
                <div class="timeline-header">
                    <h2>📊 Activity Timeline</h2>
                    <button class="timeline-export">Export</button>
                </div>
                <div class="timeline-content">
                    ${Object.entries(grouped).map(([date, items]) => `
                        <div class="timeline-group">
                            <div class="timeline-date">${date === today ? 'Today' : date}</div>
                            ${items.map(item => `
                                <div class="timeline-item">
                                    <span class="item-icon">${this.getIcon(item.type)}</span>
                                    <span class="item-desc">${item.description}</span>
                                    <span class="item-time">${this.formatTime(item.timestamp)}</span>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    groupByDate(activities) {
        const grouped = {};
        activities.forEach(a => {
            const date = new Date(a.timestamp).toDateString();
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(a);
        });
        return grouped;
    }

    getIcon(type) {
        const icons = {
            app_open: '🖱️',
            file_create: '📄',
            file_edit: '✏️',
            search: '🔍',
            notification: '🔔',
            window_move: '📐'
        };
        return icons[type] || '📌';
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    addActivity(type, description) {
        this.activities.unshift({
            type,
            description,
            timestamp: Date.now()
        });
        
        if (this.activities.length > 500) {
            this.activities.pop();
        }
    }
}

window.focusSystem = new FocusSystem();
window.activityTimeline = new ActivityTimeline();
