export const debounce = (fn, delay = 500) => {
    return (...args) =>{
        let timeoutId;
        if(timeoutId)
        clearInterval(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    }
}

export const throttle = (cb, delay = 200) => {
    let shouldWait = false;
    return (...args) => {
        if(shouldWait)
        return;
        cb(...args);
        shouldWait = true;
        setTimeout(() => shouldWait = false, delay);
    }
}

export const parseQuery = (query = "") =>{
    if(query.length === 0)
    return {};
    if(typeof URLSearchParams === "function"){
        return new URLSearchParams(query);
    }
    return query.
    trim().
    split("&").
    reduce((initial, current) =>{
        const [key, value] = current.split("=");
        return {...initial, [key] : [value]};
    }, {});
}

export const stringifyQuery = (query = {}) =>{
    if(typeof URLSearchParams === "function"){
        return `?${new URLSearchParams(query).toString()}`;
    }
    return Object.entries(query).
    reduce((initial, [key, value]) =>{
        return `${initial}${
            typeof value !== undefined && value !== null ? `${key}=${value}&` : ""
        }`
    }, "?").
    slice(0, -1);
}

export const cookies = () =>{
    const set = ({name, value, days}) =>{
        let expireDate = new Date();
        days = days ?? 1;
        expireDate.setTime(expireDate.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}= ${JSON.stringify(value)};expires= ${expireDate.toUTCString()};path=/`;
    }

    const get = (name) =>{
        const match = document.cookie.match(`(^|;//s*)${name}=([^;]*)`);

        return match ? decodeURIComponent(match[2]) : null ;
    }

    const remove = (name) =>{
        const match = get(name);
        if(match){
            document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        }
    }

    return{
        set,
        get,
        remove
    }
}

export const localStorage = () =>{
    const set = (key, value) =>{
        if(!key || !value)
        return;

        window.localStorage.setItem(key, value);
    }

    const get = (key) =>{
        return window.localStorage.getItem(key);
    }
    
    const remove = (key) =>{
        window.localStorage.removeItem(key);
    }

    const clear = (key) =>{
        window.localStorage.clear();
    }

    return{
        set,
        get,
        remove,
        clear
    }
}

export const sessionStorage = () =>{
    const set = (key, value) =>{
        if(!key || !value)
        return;

        window.sessionStorage.setItem(key, value);
    }

    const get = (key) =>{
        return window.sessionStorage.getItem(key);
    }

    const remove = (key) =>{
        window.sessionStorage.removeItem(key);
    }

    const clear = () =>{
        window.sessionStorage.clear();
    }

    return{
        set,
        get,
        remove,
        clear
    }
}