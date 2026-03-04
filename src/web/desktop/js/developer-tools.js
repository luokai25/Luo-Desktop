// Luo Desktop - Developer Tools & System Utilities
class DeveloperTools {
    constructor() {
        this.isOpen = false;
        this.terminalHistory = [];
        
        this.init();
    }

    init() {
        this.setupBuiltInTerminal();
    }

    // Built-in Terminal
    setupBuiltInTerminal() {
        this.commands = {
            help: 'Show available commands',
            ls: 'List files',
            pwd: 'Print working directory',
            cd: 'Change directory',
            cat: 'Show file contents',
            mkdir: 'Create directory',
            touch: 'Create file',
            rm: 'Remove file',
            cp: 'Copy file',
            mv: 'Move file',
            clear: 'Clear terminal',
            date: 'Show current date/time',
            whoami: 'Show current user',
            echo: 'Print text',
            env: 'Show environment variables',
            ps: 'Show running processes',
            kill: 'Kill a process',
            curl: 'Make HTTP request',
            git: 'Git commands',
            npm: 'NPM commands',
            node: 'Node.js REPL',
            python: 'Python REPL',
            wifi: 'WiFi status',
            battery: 'Battery status',
            screenshot: 'Take screenshot',
            settings: 'Open settings',
            restart: 'Restart system',
            shutdown: 'Shutdown system'
        };

        this.filesystem = {
            '/': ['home', 'usr', 'etc', 'var', 'tmp'],
            '/home': ['user'],
            '/home/user': ['Documents', 'Downloads', 'Pictures', 'Music', 'Desktop'],
            '/home/user/Documents': ['notes.txt', 'report.pdf'],
            '/home/user/Downloads': [],
            '/home/user/Pictures': ['wallpaper.png'],
            '/home/user/Music': [],
            '/home/user/Desktop': []
        };

        this.currentPath = '/home/user';
    }

    execute(commandStr) {
        const parts = commandStr.trim().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        this.terminalHistory.push({ cmd: commandStr, time: Date.now() });

        let output = '';

        switch (cmd) {
            case 'help':
                output = Object.entries(this.commands)
                    .map(([k, v]) => `  ${k.padEnd(15)} - ${v}`)
                    .join('\n');
                break;

            case 'ls':
                const path = args[0] ? this.resolvePath(args[0]) : this.currentPath;
                const files = this.filesystem[path] || [];
                output = files.length > 0 ? files.join('  ') : '(empty)';
                break;

            case 'pwd':
                output = this.currentPath;
                break;

            case 'cd':
                const newPath = args[0] ? this.resolvePath(args[0]) : '/home/user';
                if (this.filesystem[newPath]) {
                    this.currentPath = newPath;
                    output = '';
                } else {
                    output = `cd: no such directory: ${args[0]}`;
                }
                break;

            case 'date':
                output = new Date().toString();
                break;

            case 'whoami':
                output = 'luo';
                break;

            case 'echo':
                output = args.join(' ');
                break;

            case 'env':
                output = `HOME=/home/user\nUSER=luo\nSHELL=/bin/bash\nPATH=/usr/local/bin:/usr/bin:/bin\nDISPLAY=:0\nLANG=en_US.UTF-8`;
                break;

            case 'ps':
                output = `  PID TTY          TIME CMD
    1 ?        00:00:00 init
  234 ?        00:00:01 node
  567 ?        00:00:00 browser
  890 pts/0    00:00:00 terminal`;
                break;

            case 'clear':
                return 'CLEAR';

            case 'wifi':
                output = `● WiFi: Connected
  SSID: Home-Network
  Signal: ████████░░ 85%
  IP: 192.168.1.100`;
                break;

            case 'battery':
                output = `🔋 Battery: 78%
  Status: Charging
  Time remaining: 2:34`;
                break;

            case 'screenshot':
                output = '📸 Screenshot saved to /home/user/Desktop/screenshot.png';
                window.notificationSystem.success('Screenshot taken!');
                break;

            case 'settings':
                output = 'Opening settings...';
                window.luoDesktop.openApp('settings');
                break;

            case 'curl':
                output = `curl: ${args[0] || 'missing URL'}`;
                break;

            case 'git':
                output = args.length > 0 
                    ? `git: '${args[0]}' is not a git command.`
                    : 'usage: git [--version] [--help]';
                break;

            case '':
                output = '';
                break;

            default:
                output = `command not found: ${cmd}`;
        }

        return output;
    }

    resolvePath(path) {
        if (path.startsWith('/')) return path;
        if (path === '..') {
            const parts = this.currentPath.split('/');
            parts.pop();
            return parts.join('/') || '/';
        }
        if (path === '.') return this.currentPath;
        return this.currentPath + '/' + path;
    }

    // Port Manager
    getPortManager() {
        return `
            <div class="port-manager">
                <h3>🌐 Port Manager</h3>
                <table class="port-table">
                    <thead>
                        <tr>
                            <th>Port</th>
                            <th>Process</th>
                            <th>PID</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>3000</td>
                            <td>node</td>
                            <td>1234</td>
                            <td><span class="status running">LISTENING</span></td>
                            <td><button class="port-kill">Kill</button></td>
                        </tr>
                        <tr>
                            <td>8080</td>
                            <td>chrome</td>
                            <td>5678</td>
                            <td><span class="status running">LISTENING</span></td>
                            <td><button class="port-kill">Kill</button></td>
                        </tr>
                        <tr>
                            <td>5432</td>
                            <td>postgres</td>
                            <td>9012</td>
                            <td><span class="status running">LISTENING</span></td>
                            <td><button class="port-kill">Kill</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    // Environment Variables Manager
    getEnvManager() {
        const envVars = [
            { name: 'PATH', value: '/usr/local/bin:/usr/bin:/bin', scope: 'system' },
            { name: 'HOME', value: '/home/user', scope: 'user' },
            { name: 'USER', value: 'luo', scope: 'user' },
            { name: 'SHELL', value: '/bin/bash', scope: 'system' },
            { name: 'DISPLAY', value: ':0', scope: 'user' },
            { name: 'LANG', value: 'en_US.UTF-8', scope: 'system' },
            { name: 'NODE_ENV', value: 'development', scope: 'user' },
            { name: 'API_KEY', value: '••••••••••••', scope: 'user' },
        ];

        return `
            <div class="env-manager">
                <h3>⚙️ Environment Variables</h3>
                <div class="env-actions">
                    <button class="env-add">+ Add Variable</button>
                    <button class="env-export">Export</button>
                </div>
                <table class="env-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                            <th>Scope</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${envVars.map(v => `
                            <tr>
                                <td>${v.name}</td>
                                <td><code>${v.value}</code></td>
                                <td><span class="scope ${v.scope}">${v.scope}</span></td>
                                <td>
                                    <button class="env-edit">Edit</button>
                                    <button class="env-delete">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // SSH Client
    getSSHClient() {
        return `
            <div class="ssh-client">
                <h3>🖥️ SSH Client</h3>
                <div class="ssh-form">
                    <div class="ssh-field">
                        <label>Host</label>
                        <input type="text" placeholder="hostname or IP" value="">
                    </div>
                    <div class="ssh-field">
                        <label>Port</label>
                        <input type="number" placeholder="22" value="22">
                    </div>
                    <div class="ssh-field">
                        <label>Username</label>
                        <input type="text" placeholder="username" value="">
                    </div>
                    <div class="ssh-field">
                        <label>Auth</label>
                        <select>
                            <option>Password</option>
                            <option>SSH Key</option>
                        </select>
                    </div>
                    <button class="ssh-connect">Connect</button>
                </div>
                <div class="ssh-terminal">
                    <div class="ssh-output">$ </div>
                </div>
            </div>
        `;
    }
}

// System Monitor
class SystemMonitor {
    constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            disk: 0,
            network: { up: 0, down: 0 }
        };
        
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            this.metrics.cpu = Math.floor(Math.random() * 60) + 20;
            this.metrics.memory = Math.floor(Math.random() * 40) + 40;
            this.metrics.disk = 78;
            this.metrics.network = {
                up: Math.floor(Math.random() * 100),
                down: Math.floor(Math.random() * 500)
            };
            
            this.updateDisplay();
        }, 2000);
    }

    updateDisplay() {
        // Update any system stat displays
    }

    getStats() {
        return this.metrics;
    }

    renderDetailed() {
        return `
            <div class="system-monitor">
                <h3>📊 System Monitor</h3>
                
                <div class="monitor-section">
                    <h4>CPU</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.metrics.cpu}%">${this.metrics.cpu}%</div>
                    </div>
                    <div class="cpu-cores">
                        ${[0,1,2,3].map(i => `
                            <div class="cpu-core">
                                <span>Core ${i}</span>
                                <div class="core-bar">
                                    <div class="core-fill" style="width: ${Math.floor(Math.random() * 80 + 20)}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="monitor-section">
                    <h4>Memory</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.metrics.memory}%">${this.metrics.memory}%</div>
                    </div>
                    <div class="memory-details">
                        <span>Used: 6.2 GB</span>
                        <span>Total: 16 GB</span>
                    </div>
                </div>

                <div class="monitor-section">
                    <h4>Disk</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.metrics.disk}%">${this.metrics.disk}%</div>
                    </div>
                    <div class="disk-details">
                        <span>Used: 234 GB</span>
                        <span>Total: 512 GB</span>
                    </div>
                </div>

                <div class="monitor-section">
                    <h4>Network</h4>
                    <div class="network-stats">
                        <span>⬆️ ${this.metrics.network.up} KB/s</span>
                        <span>⬇️ ${this.metrics.network.down} KB/s</span>
                    </div>
                </div>
            </div>
        `;
    }
}

window.developerTools = new DeveloperTools();
window.systemMonitor = new SystemMonitor();
