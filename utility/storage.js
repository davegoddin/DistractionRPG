async function getStoredObject(objectName)        // returns promise resolving to array of all stored distractions or null if none stored
{
    
    return browser.storage.local.get(objectName).then(storageResults =>
    {
        if (Object.keys(storageResults).length == 0) {
            return null;
        }
        else 
        {
            return storageResults[objectName];
        }
    });
}