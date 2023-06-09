export const EventEmitter = {
    events : new Map(),
    on(eventName, callBack) {
        if(this.events.has(eventName)) return;
        this.events.set(eventName, callBack);
    },
    off(eventName) {
        if(!this.events.has(eventName)) return;
        this.events.delete(eventName);
    },
    emit(eventName, ...args) {
        if(!this.events.has(eventName)) return;
        this.events.get(eventName)(...args);
    }
};