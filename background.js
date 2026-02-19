const API_URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US';

async function fetchFreeGames() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    return data.data.Catalog.searchStore.elements;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

function isPromotionalFree(game) {
  if (!game.promotions || !game.promotions.promotionalOffers) return false;
  
  const hasActivePromo = game.promotions.promotionalOffers.length > 0 &&
                         game.promotions.promotionalOffers[0].promotionalOffers.length > 0;
  
  if (!hasActivePromo) return false;
  
  const isFree = game.price && 
                 game.price.totalPrice && 
                 game.price.totalPrice.discountPrice === 0;
  
  return isFree;
}

function hasUpcomingPromo(game) {
  if (!game.promotions || !game.promotions.upcomingPromotionalOffers) return false;
  
  return game.promotions.upcomingPromotionalOffers.length > 0 &&
         game.promotions.upcomingPromotionalOffers[0].promotionalOffers.length > 0;
}

function getGameIds(games) {
  return games.map(game => game.id).sort();
}

function hasNewGames(oldIds, newIds) {
  if (!oldIds || oldIds.length === 0) return false;
  if (newIds.length !== oldIds.length) return true;
  
  for (let i = 0; i < newIds.length; i++) {
    if (newIds[i] !== oldIds[i]) return true;
  }
  return false;
}

async function setNormalIcon() {
  await chrome.action.setIcon({
    path: {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  });
}

async function setNotificationIcon() {
  await chrome.action.setIcon({
    path: {
      "16": "icons/icon16Noti.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  });
}

async function updateGamesCache() {
  try {
    console.log('Fetching free games...');
    const games = await fetchFreeGames();
    
    const currentFree = games.filter(game => isPromotionalFree(game));
    const upcomingFree = games.filter(game => hasUpcomingPromo(game) && !isPromotionalFree(game));
    
    const data = await chrome.storage.local.get(['previousFreeGameIds']);
    const previousIds = data.previousFreeGameIds || [];
    const currentIds = getGameIds(currentFree);
    
    if (hasNewGames(previousIds, currentIds)) {
      console.log('New free games detected! Showing notification icon.');
      await setNotificationIcon();
      await chrome.storage.local.set({ hasNewGames: true });
    }
    
    await chrome.storage.local.set({
      games: games,
      currentFree: currentFree,
      upcomingFree: upcomingFree,
      previousFreeGameIds: currentIds,
      lastUpdated: Date.now()
    });
    
    console.log(`Updated cache: ${currentFree.length} current, ${upcomingFree.length} upcoming`);
  } catch (error) {
    console.error('Failed to update games cache:', error);
  }
}

chrome.runtime.onStartup.addListener(() => {
  console.log('Browser started, fetching free games...');
  updateGamesCache();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated, fetching free games...');
  updateGamesCache();
  
  chrome.alarms.create('updateGames', { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateGames') {
    console.log('Periodic update triggered');
    updateGamesCache();
  }
});

chrome.action.onClicked.addListener(async () => {
  const data = await chrome.storage.local.get(['hasNewGames']);
  if (data.hasNewGames) {
    await setNormalIcon();
    await chrome.storage.local.set({ hasNewGames: false });
    console.log('Icon reset to normal after popup opened');
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'popupOpened') {
    chrome.storage.local.get(['hasNewGames']).then(async (data) => {
      if (data.hasNewGames) {
        await setNormalIcon();
        await chrome.storage.local.set({ hasNewGames: false });
        console.log('Icon reset to normal after popup opened');
      }
    });
  }
});
