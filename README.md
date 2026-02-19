# Free Epic Games Games Extension

A Chrome extension that shows current and upcoming free games from the Epic Games Store.

## Features

- 🎮 **Current Free Games**: See all games that are currently free
- ⏰ **Upcoming Free Games**: Preview games that will be free soon
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔄 **Auto-refresh**: Always shows the latest free games
- 🖱️ **Click to Open**: Click any game card to open it in the Epic Games Store

## Installation

### Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `epic-games-free` folder
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Click the extension icon in your Chrome toolbar
2. View current free games with their end dates
3. See upcoming free games (if any)
4. Click on any game card to open it in the Epic Games Store
5. Click the **Retry** button if loading fails

It filters games to show only:
- **Promotional free games** (weekly/daily offers with limited time)
- Excludes games that are always free

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

## Preview
<img width="494" height="677" alt="Screenshot 2026-02-19 125720" src="https://github.com/user-attachments/assets/2cd13709-87c1-45c0-8207-be4163c733e3" />

## License

Free to use and modify.

## Credits

Data provided by Epic Games Store API.
