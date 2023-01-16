export const setLocalStorageItem = (key, value, expiredInMinutes) => {
    const now = new Date();

    const item = {
        value,
    };

    if (expiredInMinutes)
        item.expiry = now.getTime() + expiredInMinutes * 60 * 1000;

    localStorage.setItem(key, JSON.stringify(item));
};