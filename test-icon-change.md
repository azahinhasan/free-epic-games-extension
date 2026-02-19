# Testing Icon Change Functionality

## Steps to Test:

### 1. Reload Extension Properly
1. Open Chrome: `chrome://extensions/`
2. Find "Free Epic Games Games" extension
3. Click the **Reload** button (circular arrow icon)
4. Or remove and re-add the extension

### 2. Open Service Worker Console
1. On `chrome://extensions/` page
2. Find your extension
3. Click the **"service worker"** link (blue text)
4. This opens DevTools for the background script

### 3. Test Icon Change Manually

In the service worker console, run these commands one by one:

```javascript
// Test 1: Change to notification icon
chrome.action.setIcon({
  path: {
    "16": "icons/icon16Noti.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
});
```

**Check:** The extension icon in the toolbar should now show the notification icon.

```javascript
// Test 2: Change back to normal icon
chrome.action.setIcon({
  path: {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
});
```

**Check:** The extension icon should revert to normal.

### 4. Test Automatic Detection

In the service worker console:

```javascript
// Simulate new games detected
chrome.storage.local.set({ previousFreeGameIds: ['fake-id-123'] }).then(() => {
  console.log('Set fake previous ID');
  updateGamesCache();
});
```

**Expected:** After `updateGamesCache()` completes, the icon should change to notification icon because the current games won't match the fake ID.

### 5. Test Popup Reset

1. Click the extension icon to open the popup
2. The icon should automatically reset to normal (icon16.png)

## Troubleshooting:

**If icon doesn't change:**
- Make sure both `icon16.png` and `icon16Noti.png` exist in the `icons/` folder
- Check service worker console for errors
- Try clearing storage: `chrome.storage.local.clear()`
- Completely remove and reinstall the extension

**Check current storage:**
```javascript
chrome.storage.local.get(null, (data) => console.log(data));
```

**Force notification icon:**
```javascript
setNotificationIcon();
```

**Force normal icon:**
```javascript
setNormalIcon();
```
