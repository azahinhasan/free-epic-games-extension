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

async function updateGamesCache() {
  try {
    console.log('Fetching free games...');
    const games = await fetchFreeGames();
    
    const currentFree = games.filter(game => isPromotionalFree(game));
    const upcomingFree = games.filter(game => hasUpcomingPromo(game) && !isPromotionalFree(game));
    
    await chrome.storage.local.set({
      games: games,
      currentFree: currentFree,
      upcomingFree: upcomingFree,
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
