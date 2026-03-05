/**
 * Luo Desktop Action Graph - Visual Workflow Display
 * Shows AI's current plan as editable nodes
 */

class ActionGraph {
    constructor() {
        this.nodes = [];
        this.edges = [];
        this.currentTask = null;
    }

    render(container) {
        container.innerHTML = `
            <div class="action-graph">
                <div class="ag-header">
                    <span class="ag-icon">🔗</span>
                    <span class="ag-title">Action Graph</span>
                    <button class="ag-toggle" id="ag-toggle">−</button>
                </div>
                
                <div class="ag-content" id="ag-content">
                    <div class="ag-empty">
                        <p>🤖 No active tasks</p>
                        <p class="hint">When AI starts a task, you'll see its plan here</p>
                    </div>
                    
                    <div class="ag-nodes" id="ag-nodes" style="display:none;">
                        <!-- Nodes will be rendered here -->
                    </div>
                </div>
                
                <div class="ag-footer">
                    <button class="ag-btn" id="ag-pause">⏸ Pause</button>
                    <button class="ag-btn" id="ag-resume" style="display:none;">▶ Resume</button>
                    <button class="ag-btn danger" id="ag-cancel">✕ Cancel</button>
                </div>
            </div>
        `;
        
        this.setupEvents();
    }

    setupEvents() {
        document.getElementById('ag-toggle')?.addEventListener('click', () => this.toggle());
        document.getElementById('ag-pause')?.addEventListener('click', () => this.pause());
        document.getElementById('ag-resume')?.addEventListener('click', () => this.resume());
        document.getElementById('ag-cancel')?.addEventListener('click', () => this.cancel());
    }

    toggle() {
        const content = document.getElementById('ag-content');
        const toggle = document.getElementById('ag-toggle');
        if (content) {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            if (toggle) toggle.textContent = content.style.display === 'none' ? '+' : '−';
        }
    }

    // Add a new task with nodes
    addTask(taskName, steps) {
        this.currentTask = taskName;
        this.nodes = steps.map((step, i) => ({
            id: `node-${i}`,
            label: step.label,
            status: i === 0 ? 'running' : 'pending', // First node is running
            type: step.type || 'action', // action, decision, wait
            details: step.details || ''
        }));
        
        this.renderNodes();
    }

    // Update a specific node status
    updateNodeStatus(nodeId, status) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            node.status = status;
            this.renderNodes();
        }
    }

    // Mark current node complete, move to next
    completeCurrentNode() {
        const current = this.nodes.find(n => n.status === 'running');
        if (current) {
            current.status = 'completed';
            
            const currentIndex = this.nodes.indexOf(current);
            if (currentIndex < this.nodes.length - 1) {
                this.nodes[currentIndex + 1].status = 'running';
            } else {
                // Task complete
                this.currentTask = null;
            }
            
            this.renderNodes();
        }
    }

    renderNodes() {
        const nodesContainer = document.getElementById('ag-nodes');
        const emptyState = document.querySelector('.ag-empty');
        
        if (!nodesContainer) return;
        
        if (this.nodes.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            nodesContainer.style.display = 'none';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        nodesContainer.style.display = 'block';
        
        nodesContainer.innerHTML = this.nodes.map((node, i) => `
            <div class="ag-node ${node.status}" data-id="${node.id}">
                <div class="node-status">
                    ${node.status === 'completed' ? '✅' : node.status === 'running' ? '🔄' : '⏳'}
                </div>
                <div class="node-content">
                    <div class="node-label">${node.label}</div>
                    ${node.details ? `<div class="node-details">${node.details}</div>` : ''}
                </div>
                ${i < this.nodes.length - 1 ? '<div class="node-arrow">↓</div>' : ''}
            </div>
        `).join('');
    }

    pause() {
        document.getElementById('ag-pause').style.display = 'none';
        document.getElementById('ag-resume').style.display = 'inline-flex';
    }

    resume() {
        document.getElementById('ag-pause').style.display = 'inline-flex';
        document.getElementById('ag-resume').style.display = 'none';
    }

    cancel() {
        this.nodes = [];
        this.currentTask = null;
        this.renderNodes();
    }
}

// HUD Overlay for Chain-of-Thought
class HUDisplay {
    constructor() {
        this.thoughts = [];
    }

    render(container) {
        container.innerHTML = `
            <div class="hud-overlay" id="hud-overlay">
                <div class="hud-header">
                    <span class="hud-icon">💭</span>
                    <span>AI Thinking</span>
                    <button class="hud-close" id="hud-close">✕</button>
                </div>
                <div class="hud-thoughts" id="hud-thoughts">
                    <div class="hud-empty">Waiting for AI...</div>
                </div>
            </div>
        `;
        
        document.getElementById('hud-close')?.addEventListener('click', () => this.hide());
    }

    show() {
        const overlay = document.getElementById('hud-overlay');
        if (overlay) overlay.style.display = 'block';
    }

    hide() {
        const overlay = document.getElementById('hud-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    addThought(thought, type = 'reasoning') {
        this.thoughts.push({ text: thought, type, time: Date.now() });
        this.renderThoughts();
    }

    renderThoughts() {
        const container = document.getElementById('hud-thoughts');
        if (!container) return;
        
        container.innerHTML = this.thoughts.map(t => `
            <div class="hud-thought ${t.type}">
                <span class="thought-type">${t.type === 'reasoning' ? '🧠' : t.type === 'action' ? '🎯' : '📝'}</span>
                <span class="thought-text">${t.text}</span>
            </div>
        `).join('');
        
        container.scrollTop = container.scrollHeight;
    }
}

// Human-in-the-Loop Permission Gate
class PermissionGate {
    constructor() {
        this.pendingRequests = [];
    }

    async requestPermission(action, details) {
        return new Promise((resolve, reject) => {
            const request = {
                id: Date.now(),
                action,
                details,
                resolve,
                reject
            };
            
            this.pendingRequests.push(request);
            this.showPopup(request);
        });
    }

    showPopup(request) {
        const popup = document.createElement('div');
        popup.className = 'permission-popup';
        popup.innerHTML = `
            <div class="popup-backdrop"></div>
            <div class="popup-content">
                <div class="popup-icon">⚠️</div>
                <h3>Permission Required</h3>
                <p class="popup-action">${request.action}</p>
                <p class="popup-details">${request.details}</p>
                <div class="popup-buttons">
                    <button class="popup-btn deny" data-id="${request.id}">Deny</button>
                    <button class="popup-btn approve" data-id="${request.id}">Approve</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        popup.querySelector('.approve').addEventListener('click', () => {
            request.resolve(true);
            popup.remove();
        });
        
        popup.querySelector('.deny').addEventListener('click', () => {
            request.resolve(false);
            popup.remove();
        });
    }
}

// Export
window.ActionGraph = ActionGraph;
window.HUDisplay = HUDisplay;
window.PermissionGate = PermissionGate;
