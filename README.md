# Golf Club Distance Calculator ⛳

A modern, Airbnb-styled web application to help golfers calculate the perfect club for every shot based on distance and weather conditions.

## Features

### 🏌️ Club Setup
- Customize distances for all your clubs (Driver through Lob Wedge)
- Default distances provided as starting points
- Persistent storage - your settings are saved locally

### 🎯 Smart Recommendations
- Enter target distance to get club suggestions
- Weather-aware calculations (wind speed, temperature)
- Swing adjustment recommendations
- Real-time condition monitoring

### 🌤️ Weather Integration
- Automatic location-based weather data
- Wind speed and direction consideration
- Temperature adjustments (2 yards per 10°F rule)
- Fallback to default conditions if location unavailable

### 📱 Responsive Design
- Airbnb-inspired modern interface
- Mobile-first responsive design
- Touch-friendly controls
- Smooth animations and transitions

## How to Use

1. **Setup Phase**: Enter your average distance for each club in the Setup tab
2. **Save Settings**: Click "Save Club Distances" to store your preferences
3. **Calculate**: Switch to the Calculate tab and enter your target distance
4. **Get Recommendation**: The app will suggest the best club considering current conditions

## Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Styling**: Airbnb design system with CSS custom properties
- **Storage**: Browser localStorage for club distances
- **Weather**: Simulated weather data (can be integrated with real APIs)
- **Responsive**: Mobile-first CSS Grid and Flexbox

## Files Structure

```
my-yardages/
├── index.html      # Main HTML structure
├── styles.css      # Airbnb-styled CSS
├── app.js          # JavaScript functionality
└── README.md       # This file
```

## Key Features Implementation

### Weather Adjustments
- **Temperature**: ±2 yards per 10°F from 70°F baseline
- **Wind**: Headwind adds yardage needed, tailwind reduces it
- **Conditions**: Real-time display of current weather

### Club Recommendation Logic
1. Adjusts target distance for weather conditions
2. Finds closest matching club distance
3. Provides swing adjustment recommendations
4. Shows condition-based modifications

### Airbnb Design Elements
- **Colors**: Signature #ff385c red with neutral grays
- **Typography**: Inter font with proper hierarchy
- **Cards**: Subtle shadows, rounded corners, hover effects
- **Spacing**: Generous whitespace, consistent padding
- **Interactions**: Smooth transitions, micro-animations

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Real weather API integration (OpenWeatherMap, etc.)
- Course elevation adjustments
- Multiple bag configurations
- Shot history tracking
- Social sharing features

## Development

To run locally:
```bash
# Navigate to project directory
cd my-yardages

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

---

Built with ❤️ for golfers who want to improve their game through better club selection.