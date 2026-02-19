const API_URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US';

const elements = {
  loading: document.getElementById('loading'),
  error: document.getElementById('error'),
  gamesContainer: document.getElementById('games-container'),
  currentGames: document.getElementById('current-games'),
  upcomingGames: document.getElementById('upcoming-games'),
  upcomingSection: document.getElementById('upcoming-free'),
  retryBtn: document.getElementById('retry-btn'),
  refreshBtn: document.getElementById('refresh-btn')
};

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

function formatDateTime(dateString) {
  const date = new Date(dateString);
  
  const dateOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
  
  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  const formattedDate = date.toLocaleDateString(undefined, dateOptions);
  const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
  
  return `${formattedDate} at ${formattedTime}`;
}

function getTimeRemaining(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  
  if (diffTime < 0) return 'Expired';
  if (diffHours < 24) return `${diffHours}h remaining`;
  if (diffDays === 1) return 'Ends tomorrow';
  return `${diffDays} days left`;
}

function getGameImage(game) {
  const imageTypes = ['OfferImageWide', 'OfferImageTall', 'Thumbnail'];
  
  for (const type of imageTypes) {
    const image = game.keyImages?.find(img => img.type === type);
    if (image) return image.url;
  }
  
  return '';
}

function getOriginalPrice(game) {
  if (!game.price || !game.price.totalPrice) return null;
  
  const price = game.price.totalPrice;
  if (price.originalPrice > 0) {
    return price.fmtPrice.originalPrice;
  }
  
  return null;
}

function getGameUrl(game) {
  if (game.catalogNs && game.catalogNs.mappings && game.catalogNs.mappings.length > 0) {
    return `https://store.epicgames.com/en-US/p/${game.catalogNs.mappings[0].pageSlug}`;
  }
  
  if (game.offerMappings && game.offerMappings.length > 0) {
    return `https://store.epicgames.com/en-US/p/${game.offerMappings[0].pageSlug}`;
  }
  
  const slug = game.productSlug || game.urlSlug;
  if (slug) {
    return `https://store.epicgames.com/en-US/p/${slug}`;
  }
  
  return 'https://store.epicgames.com/en-US/free-games';
}

function createGameCard(game, isUpcoming = false) {
  const card = document.createElement('div');
  card.className = 'game-card';
  
  const imageUrl = getGameImage(game);
  const originalPrice = getOriginalPrice(game);
  const gameUrl = getGameUrl(game);
  
  let dateInfo = { start: '', end: '', remaining: '' };
  
  if (!isUpcoming && game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]) {
    const promo = game.promotions.promotionalOffers[0].promotionalOffers[0];
    dateInfo.start = formatDateTime(promo.startDate);
    dateInfo.end = formatDateTime(promo.endDate);
    dateInfo.remaining = getTimeRemaining(promo.endDate);
  } else if (isUpcoming && game.promotions?.upcomingPromotionalOffers?.[0]?.promotionalOffers?.[0]) {
    const promo = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0];
    dateInfo.start = formatDateTime(promo.startDate);
    dateInfo.end = formatDateTime(promo.endDate);
    dateInfo.remaining = 'Coming soon';
  }
  
  card.innerHTML = `
    ${imageUrl ? `<img src="${imageUrl}" alt="${game.title}" class="game-image">` : ''}
    <div class="game-info">
      <div class="game-title">${game.title}</div>
      ${game.description ? `<div class="game-description">${game.description}</div>` : ''}
      ${dateInfo.start || dateInfo.end ? `
        <div class="game-dates">  ${dateInfo.start} - ${dateInfo.end}
        </div>
      ` : ''}
      <div class="game-meta">
        <div class="game-price">
          ${originalPrice ? `<span class="original-price">${originalPrice}</span>` : ''}
          <span class="free-badge">FREE</span>
        </div>
        ${dateInfo.remaining ? `<div class="game-date">${dateInfo.remaining}</div>` : ''}
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => {
    chrome.tabs.create({ url: gameUrl });
  });
  
  return card;
}

function displayGames(games) {
  const currentFree = games.filter(game => isPromotionalFree(game));
  const upcomingFree = games.filter(game => hasUpcomingPromo(game) && !isPromotionalFree(game));
  
  elements.currentGames.innerHTML = '';
  elements.upcomingGames.innerHTML = '';
  
  if (currentFree.length === 0) {
    elements.currentGames.innerHTML = '<div class="no-games"><p>No free games available right now.</p></div>';
  } else {
    currentFree.forEach(game => {
      elements.currentGames.appendChild(createGameCard(game, false));
    });
  }
  
  if (upcomingFree.length > 0) {
    elements.upcomingSection.classList.remove('hidden');
    upcomingFree.forEach(game => {
      elements.upcomingGames.appendChild(createGameCard(game, true));
    });
  } else {
    elements.upcomingSection.classList.add('hidden');
  }
  
  elements.loading.classList.add('hidden');
  elements.error.classList.add('hidden');
  elements.gamesContainer.classList.remove('hidden');
}

function showError() {
  elements.loading.classList.add('hidden');
  elements.gamesContainer.classList.add('hidden');
  elements.error.classList.remove('hidden');
}

async function loadGames() {
  elements.loading.classList.remove('hidden');
  elements.error.classList.add('hidden');
  elements.gamesContainer.classList.add('hidden');
  
  if (elements.refreshBtn) {
    elements.refreshBtn.classList.add('spinning');
  }
  
  try {
    const games = await fetchFreeGames();
    displayGames(games);
  } catch (error) {
    showError();
  } finally {
    if (elements.refreshBtn) {
      elements.refreshBtn.classList.remove('spinning');
    }
  }
}

elements.retryBtn.addEventListener('click', loadGames);

if (elements.refreshBtn) {
  elements.refreshBtn.addEventListener('click', loadGames);
}

loadGames();
