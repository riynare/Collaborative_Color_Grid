const state = {
    users: new Map(),
    sockets: new Map(),
    disconnectTimers: new Map(),
    size: null,
    field: [],
    logs: []
};

module.exports = state;
