# Free Epic Games Games Extension

A Chrome extension that shows current and upcoming free games from the Epic Games Store.

## Features

- 🎮 **Current Free Games**: See all games that are currently free
- ⏰ **Upcoming Free Games**: Preview games that will be free soon
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔄 **Auto-refresh**: Always shows the latest free games
- 🖱️ **Click to Open**: Click any game card to open it in the Epic Games Store

## Installation

### Method 1: Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `epic-games-free` folder
5. The extension icon should appear in your Chrome toolbar

### Method 2: Generate Icons First

If you want proper icons instead of placeholders:

1. Open `icons/generate-icons.html` in your browser
2. Download all three icon files (icon16.png, icon48.png, icon128.png)
3. Save them in the `icons/` folder
4. Follow Method 1 to load the extension

## Usage

1. Click the extension icon in your Chrome toolbar
2. View current free games with their end dates
3. See upcoming free games (if any)
4. Click on any game card to open it in the Epic Games Store
5. Click the **Retry** button if loading fails

## How It Works

The extension fetches data from Epic Games' official API:
```
https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US
```

It filters games to show only:
- **Promotional free games** (weekly/daily offers with limited time)
- Excludes games that are always free

## Technical Details

- **Manifest Version**: 3
- **Permissions**: Storage, API access
- **No tracking**: All data is fetched directly from Epic Games
- **Lightweight**: Minimal resource usage

## Files Structure

```
epic-games-free/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.css             # Styling
├── popup.js              # Logic and API handling
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon.svg          # SVG source
│   └── generate-icons.html
└── README.md             # This file
```

## Troubleshooting

**Extension doesn't load games:**
- Check your internet connection
- Click the Retry button
- Make sure Epic Games API is accessible

**Icons not showing:**
- Generate icons using `icons/generate-icons.html`
- Or use placeholder icons (extension will still work)

**Games not updating:**
- Click the extension icon to refresh
- The extension fetches fresh data on each open

## License

Free to use and modify.

## Credits

Data provided by Epic Games Store API.
