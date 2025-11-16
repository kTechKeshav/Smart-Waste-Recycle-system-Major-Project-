# Waste-to-Reuse Recommendation Agent

A comprehensive web-based system that generates practical, step-by-step reusable product guides from waste materials. The system accepts waste material classifications and produces detailed DIY guides with materials, tools, instructions, and safety notes.

## Features

- **Detailed Reuse Guides**: Generate comprehensive step-by-step guides for transforming waste into reusable products
- **Multiple Input Methods**: Accept materials from classification API responses, manual entry, or local storage
- **Hazardous Material Handling**: Special safe disposal guidance for batteries and e-waste
- **Complete Project Information**: Each guide includes materials needed, tools required, difficulty level, time estimates, and cost
- **Safety First**: Prominent safety notes and warnings for all projects
- **Modern UI**: Beautiful, responsive web interface with detailed guide display

## Supported Materials

The system provides detailed reuse guides for:

- **Paper** - Paper Mache decorative bowls
- **Cardboard** - Storage organizers and dividers
- **Glass** - Terrariums and decorative containers
- **Metal** - Herb planters and garden decorations
- **Plastic** - Self-watering planters

**Note:** The system supports only these 5 material classes. Other materials (like organic, textile, e-waste, battery) are handled with safe disposal guidance when detected.

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Setup Steps

1. **Clone or download this repository**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup YouTube API (Optional but Recommended)**:
   
   YouTube tutorials के लिए Google's YouTube Data API v3 use होता है (free tier available - 10,000 units/day).
   
   **Quick Setup:**
   - Google Cloud Console में जाएं: https://console.cloud.google.com/
   - नया project बनाएं
   - YouTube Data API v3 enable करें
   - API key बनाएं
   - Environment variable set करें:
   
   **Windows (PowerShell):**
   ```powershell
   $env:YOUTUBE_API_KEY="your_api_key_here"
   ```
   
   **Linux/Mac:**
   ```bash
   export YOUTUBE_API_KEY="your_api_key_here"
   ```
   
   **Detailed Hindi Guide:** `YOUTUBE_API_SETUP.md` file देखें (step-by-step instructions)
   
   ⚠️ **Note**: बिना API key के भी system काम करेगा, लेकिन YouTube tutorials नहीं दिखेंगे।

## Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Open your web browser** and navigate to:
   ```
   http://localhost:5000
   ```

3. **Input waste materials** using one of three methods:
   - **Manual Entry**: Type materials separated by commas
   - **Classification Response**: Paste JSON from classification API
   - **Local Storage**: Load from browser's localStorage (key: `waste_list`)

4. **View detailed reuse guides** with:
   - Step-by-step instructions
   - Materials and tools needed
   - Difficulty and time estimates
   - Safety notes
   - Potential yield/sale ideas
   - Sources and references

## Docker Deployment

### Using Docker

1. **Build the Docker image**:
   ```bash
   docker build -t waste-recycle-system .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 5000:5000 --name waste-recycle \
     -e YOUTUBE_API_KEY=your_api_key_here \
     waste-recycle-system
   ```

3. **Access the application**:
   ```
   http://localhost:5000
   ```

### Using Docker Compose

1. **Create a `.env` file** (if not already created):
   ```bash
   echo "YOUTUBE_API_KEY=your_api_key_here" > .env
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Stop the application**:
   ```bash
   docker-compose down
   ```

**Note:** The Docker setup uses Gunicorn for production-ready deployment with 2 workers and automatic health checks.

## API Usage

### Main Endpoint: Generate Reuse Guides

**POST** `/api/reuse-guides`

#### Request Body Options

**Option 1: Direct waste items list**
```json
{
  "waste_items": ["paper", "plastic", "glass"]
}
```

**Option 2: Classification API response format**
```json
{
  "prediction": {
    "label": "paper",
    "confidence": 0.6143782734870911,
    "top": [
      {
        "label": "paper",
        "confidence": 0.6143782734870911
      },
      {
        "label": "glass",
        "confidence": 0.1518249660730362
      }
    ]
  }
}
```

**Option 3: From external API**
```json
{
  "wasteListApi": "https://example.com/api/waste-list"
}
```

#### Response Format

```json
{
  "waste_items_processed": ["paper", "glass"],
  "total_guides": 2,
  "guides": [
    {
      "material": "paper",
      "suggested_product": "Paper Mache Decorative Bowl",
      "purpose": "Create beautiful, functional decorative bowls...",
      "materials_needed": ["Old newspapers", "All-purpose flour", ...],
      "tools_required": ["Mixing bowl", "Whisk", ...],
      "difficulty": "easy",
      "estimated_time_minutes": 120,
      "step_by_step_instructions": [
        "Tear newspaper into 1-2 inch strips",
        "Mix 1 part flour with 2 parts water...",
        ...
      ],
      "safety_notes": "Ensure good ventilation when using varnish...",
      "approx_cost_estimate": "low",
      "potential_yield_or_sale_idea": "Can create 2-3 bowls from one newspaper...",
      "youtube_tutorials": [],
      "sources": [
        "Internal reuse guide database for paper",
        "https://www.epa.gov/recycle"
      ]
    }
  ]
}
```

### Legacy Endpoint (Backward Compatibility)

**POST** `/api/waste-info`

Returns basic recycling instructions and craft ideas for a single material.

## Input Retrieval Methods

The system attempts to retrieve waste materials in the following order:

1. **Request payload**: `waste_items` or `waste_list` fields
2. **Classification prediction**: Extracts from `prediction.label` or `prediction.top` array
3. **External API**: Fetches from URL provided in `wasteListApi` field
4. **Local Storage**: (Frontend only) Reads from `localStorage.getItem('waste_list')`

## Hazardous Materials

For hazardous materials (battery, e-waste), the system:

- **Does NOT recommend DIY reuse**
- Provides safe disposal instructions
- Lists certified recycling centers
- Includes authoritative source links
- Emphasizes safety warnings

## Guide Structure

Each reuse guide includes:

- **Material**: Canonical material name
- **Suggested Product**: Short name (1-6 words)
- **Purpose**: One-line use case or benefit
- **Materials Needed**: List of additional materials/consumables
- **Tools Required**: List of tools (marked if household-only)
- **Difficulty**: "easy" | "medium" | "hard"
- **Estimated Time**: Minutes required
- **Step-by-Step Instructions**: 6-12 concise steps
- **Safety Notes**: Warnings when applicable
- **Cost Estimate**: "low" | "medium" | "high" or numeric
- **Potential Yield/Sale Ideas**: Notes about units or resale potential
- **YouTube Tutorials**: Links with descriptions (when available)
- **Sources**: APIs, webpages, or docs used

## Project Structure

```
Smart-Waste-Recycle-system-Major-Project-
│
├── app.py                 # Flask backend with reuse guide generator
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration for containerization
├── docker-compose.yml    # Docker Compose configuration
├── .dockerignore         # Files to exclude from Docker build
├── .env.example          # Example environment variables file
├── README.md             # This file
│
└── templates/
    └── index.html        # Frontend web interface
```

## Technologies Used

- **Backend**: Python, Flask, Requests
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Modern CSS with gradients and animations

## YouTube API Integration

✅ **Implemented!** System automatically searches for YouTube tutorials using Google's YouTube Data API v3.

- **Free Tier**: 10,000 units per day (approximately 100 searches)
- **Setup Required**: API key configuration (see `YOUTUBE_API_SETUP.md` for detailed Hindi guide)
- **Fallback**: System works without API key, but tutorials won't be shown
- **Simple Setup**: Step-by-step guide available in Hindi for normal users

## Future Enhancements

- **Web Search Integration**: Real-time authoritative source discovery
- **Image Generation**: Visual guides for each step
- **User Submissions**: Community-contributed guides
- **Rating System**: User feedback on guide quality

## Error Handling

The system handles various error scenarios:

- **Empty waste list**: Returns structured error with retrieval method attempted
- **Invalid JSON**: Clear error messages for classification input
- **Missing materials**: Generic guides for unknown materials
- **API failures**: Graceful degradation with partial results

## Safety & Best Practices

- Always follow safety notes in guides
- Use appropriate safety equipment
- Check local recycling guidelines
- For hazardous materials, use certified recyclers only
- Test projects in safe environments first

## Contributing

Feel free to submit issues or pull requests to:
- Add more material types
- Improve existing guides
- Enhance safety information
- Add YouTube tutorial links

## License

This project is part of a Major Project for educational purposes.

## Notes

- YouTube tutorial search requires API key integration (placeholder implemented)
- Always verify local recycling program requirements
- Safety is paramount - follow all safety notes
- Some materials may have location-specific disposal requirements
