// Core Browser Engine Implementation

class BrowserEngine {
    constructor() {
        this.tabs = [];
        this.history = [];
    }

    openTab(url) {
        const tab = { url, active: true };
        this.tabs.push(tab);
        this.history.push(url);
        console.log(`Tab opened: ${url}`);
    }

    closeTab() {
        const activeTabIndex = this.tabs.findIndex(tab => tab.active);
        if (activeTabIndex !== -1) {
            this.tabs.splice(activeTabIndex, 1);
            console.log(`Tab closed.`);
        }
    }

    switchTab(index) {
        if (index >= 0 && index < this.tabs.length) {
            this.tabs.forEach((tab, i) => tab.active = (i === index));
            console.log(`Switched to tab: ${this.tabs[index].url}`);
        } else {
            console.log(`Invalid tab index: ${index}`);
        }
    }

    getHistory() {
        return this.history;
    }
}

// Example usage:
const browser = new BrowserEngine();
browser.openTab('https://www.example.com');
browser.switchTab(0);

