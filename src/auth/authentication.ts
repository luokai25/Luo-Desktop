'use strict';

class AuthenticationManager {
    constructor() {
        this.users = [];
        this.agents = [];
    }

    // Method to register a user
    registerUser(user) {
        this.users.push(user);
        console.log(`User ${user.name} registered successfully.`);
    }

    // Method to register an AI agent
    registerAgent(agent) {
        this.agents.push(agent);
        console.log(`Agent ${agent.name} registered successfully.`);
    }

    // Method to authenticate a user
    authenticateUser(userName, password) {
        const user = this.users.find(u => u.name === userName && u.password === password);
        return user ? true : false;
    }

    // Method to authenticate an AI agent
    authenticateAgent(agentName, token) {
        const agent = this.agents.find(a => a.name === agentName && a.token === token);
        return agent ? true : false;
    }
}

module.exports = AuthenticationManager;
