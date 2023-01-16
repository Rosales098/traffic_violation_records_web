export const getLocalStorageItem = (key) => {
    const itemString = localStorage.getItem(key);
  
    // if the item doesn't exist, return null
    if (!itemString) {
      return;
    }
  
    const item = JSON.parse(itemString);
  
    const now = new Date();
  
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return;
    }
  
    return item.value;
  };
  