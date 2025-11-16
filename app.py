from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import json
import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# YouTube Data API v3 Configuration
# Get API key from environment variable or .env file
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', '')
YOUTUBE_API_ENABLED = bool(YOUTUBE_API_KEY)

# Hazardous materials that should not be DIY reused
HAZARDOUS_MATERIALS = ['battery', 'e-waste', 'electronics', 'batteries']

# Detailed reusable product guide database
REUSE_GUIDE_DATABASE = {
    "paper": {
        "suggested_product": "Paper Mache Decorative Bowl",
        "purpose": "Create beautiful, functional decorative bowls for home organization or gifts",
        "materials_needed": ["Old newspapers or magazines", "All-purpose flour", "Water", "Salt", "Acrylic paint", "Varnish or sealant"],
        "tools_required": ["Mixing bowl", "Whisk or spoon", "Balloon or bowl mold", "Paintbrush"],
        "difficulty": "easy",
        "estimated_time_minutes": 120,
        "step_by_step_instructions": [
            "Tear newspaper into 1-2 inch strips",
            "Mix 1 part flour with 2 parts water in a bowl, add a pinch of salt",
            "Blow up a balloon to desired bowl size or use an existing bowl as mold",
            "Dip paper strips in the paste, remove excess",
            "Layer strips over the balloon/mold, overlapping edges",
            "Apply 3-4 layers, allowing each to dry slightly",
            "Let dry completely for 24-48 hours",
            "Pop balloon if used, carefully remove from mold",
            "Paint with acrylic paint in desired colors",
            "Apply varnish or sealant for durability",
            "Allow final coat to dry completely"
        ],
        "safety_notes": "Ensure good ventilation when using varnish. Keep paste away from children if using balloons.",
        "approx_cost_estimate": "low",
        "potential_yield_or_sale_idea": "Can create 2-3 bowls from one newspaper. Sell at craft fairs for $5-15 each.",
        "youtube_tutorials": [],
        "sources": []
    },
    "cardboard": {
        "suggested_product": "Cardboard Storage Organizer",
        "purpose": "Create custom drawer dividers and desk organizers to reduce clutter",
        "materials_needed": ["Cardboard boxes", "Ruler", "Pencil", "Decorative paper or fabric (optional)", "Glue"],
        "tools_required": ["Scissors or box cutter", "Ruler", "Pencil", "Hot glue gun (optional)"],
        "difficulty": "easy",
        "estimated_time_minutes": 60,
        "step_by_step_instructions": [
            "Measure drawer or space dimensions",
            "Cut cardboard into divider pieces matching measurements",
            "Create interlocking slots by cutting halfway through cardboard at intersections",
            "Test fit pieces together",
            "Adjust sizes if needed",
            "Decorate with wrapping paper or fabric if desired",
            "Assemble dividers in drawer",
            "Optional: reinforce corners with hot glue"
        ],
        "safety_notes": "Use caution with box cutters. Keep cutting tools away from children.",
        "approx_cost_estimate": "low",
        "potential_yield_or_sale_idea": "One large box can make 3-5 organizers. Custom sizes can sell for $10-25.",
        "youtube_tutorials": [],
        "sources": []
    },
    "glass": {
        "suggested_product": "Glass Jar Terrarium",
        "purpose": "Create mini indoor gardens in glass containers for decoration and air purification",
        "materials_needed": ["Glass jar with lid", "Small pebbles or gravel", "Activated charcoal", "Potting soil", "Small plants (succulents, moss)", "Decorative stones"],
        "tools_required": ["Tweezers (for plant placement)", "Small spoon"],
        "difficulty": "easy",
        "estimated_time_minutes": 30,
        "step_by_step_instructions": [
            "Clean and dry glass jar thoroughly",
            "Add 1-2 inch layer of pebbles for drainage",
            "Add thin layer of activated charcoal",
            "Add 2-3 inches of potting soil",
            "Create small holes for plants using tweezers",
            "Place plants carefully in holes",
            "Add decorative stones on top",
            "Lightly mist with water",
            "Place in indirect sunlight",
            "Water sparingly (once every 2-3 weeks)"
        ],
        "safety_notes": "Handle glass carefully. Use gloves when handling activated charcoal. Ensure plants are non-toxic if pets are present.",
        "approx_cost_estimate": "low",
        "potential_yield_or_sale_idea": "One jar makes one terrarium. Sell for $15-40 depending on size and plants used.",
        "youtube_tutorials": [],
        "sources": []
    },
    "metal": {
        "suggested_product": "Tin Can Herb Planter",
        "purpose": "Transform metal cans into decorative planters for herbs or small plants",
        "materials_needed": ["Clean metal cans", "Drill with small bit", "Potting soil", "Herb seeds or small plants", "Paint (optional)"],
        "tools_required": ["Drill with 1/4 inch bit", "Hammer and nail (alternative)", "Paintbrush (if painting)"],
        "difficulty": "medium",
        "estimated_time_minutes": 45,
        "step_by_step_instructions": [
            "Remove labels and clean cans thoroughly",
            "Drill 3-4 drainage holes in bottom of each can",
            "Optional: Paint cans with rust-resistant paint, allow to dry",
            "Fill cans 3/4 full with potting soil",
            "Plant herb seeds or small plants",
            "Water lightly",
            "Place in sunny location",
            "Water regularly as needed"
        ],
        "safety_notes": "Wear safety glasses when drilling. Ensure cans have no sharp edges. Use gloves when handling metal.",
        "approx_cost_estimate": "low",
        "potential_yield_or_sale_idea": "One can = one planter. Sets of 3-5 can sell for $12-25.",
        "youtube_tutorials": [],
        "sources": []
    },
    "plastic": {
        "suggested_product": "Plastic Bottle Self-Watering Planter",
        "purpose": "Create self-watering planters that reduce maintenance and water waste",
        "materials_needed": ["2-liter plastic bottle", "Cotton string or fabric strip", "Potting soil", "Plant seeds or seedlings", "Scissors"],
        "tools_required": ["Scissors or box cutter", "Drill or hot nail (for holes)"],
        "difficulty": "easy",
        "estimated_time_minutes": 40,
        "step_by_step_instructions": [
            "Cut bottle in half horizontally",
            "Poke small hole in bottle cap",
            "Thread cotton string through cap hole",
            "Screw cap back on",
            "Invert top half into bottom half",
            "Fill top section with potting soil",
            "Plant seeds or small plant",
            "Fill bottom section with water",
            "Water will wick up through string",
            "Refill bottom section as needed"
        ],
        "safety_notes": "Use caution when cutting plastic. Smooth any sharp edges. Ensure proper drainage.",
        "approx_cost_estimate": "low",
        "potential_yield_or_sale_idea": "One bottle = one planter. Can create sets of 5 for $15-20.",
        "youtube_tutorials": [],
        "sources": []
    }
}

# Supported waste material classes
SUPPORTED_MATERIALS = ['paper', 'cardboard', 'glass', 'metal', 'plastic']

# Safe disposal and recycling guidance for hazardous materials
HAZARDOUS_DISPOSAL_GUIDE = {
    "battery": {
        "material": "battery",
        "suggested_product": "N/A - Safe Disposal Required",
        "purpose": "Proper disposal prevents environmental contamination and fire hazards",
        "materials_needed": ["Electrical tape", "Plastic bag or container"],
        "tools_required": ["None - household items only"],
        "difficulty": "easy",
        "estimated_time_minutes": 10,
        "step_by_step_instructions": [
            "Do NOT attempt DIY reuse of batteries",
            "Tape battery terminals with electrical tape to prevent short circuits",
            "Store in cool, dry place away from flammable materials",
            "Find local battery recycling drop-off location",
            "Many hardware stores, electronics retailers accept batteries",
            "Check with local waste management for collection events",
            "Separate by type if possible (alkaline, lithium, rechargeable)",
            "Never dispose in regular trash or recycling bins"
        ],
        "safety_notes": "Batteries contain toxic chemicals and can cause fires. Never attempt to open or modify batteries. Keep away from children and pets.",
        "approx_cost_estimate": "low",
        "potential_yield_or_sale_idea": "Proper disposal is free at most locations. Some programs offer small incentives for battery collection.",
        "youtube_tutorials": [],
        "sources": [
            "https://www.epa.gov/recycle/used-household-batteries",
            "https://www.call2recycle.org/"
        ]
    },
    "e-waste": {
        "material": "e-waste",
        "suggested_product": "N/A - Certified Recycling Required",
        "purpose": "Proper e-waste recycling prevents toxic material release and recovers valuable resources",
        "materials_needed": ["Box or container for transport", "Data wiping software (for devices with storage)"],
        "tools_required": ["None - household items only"],
        "difficulty": "easy",
        "estimated_time_minutes": 30,
        "step_by_step_instructions": [
            "Do NOT attempt DIY reuse of electronic devices containing hazardous materials",
            "Back up all important data from devices",
            "Perform factory reset or use data wiping software",
            "Remove batteries if possible (recycle separately)",
            "Remove SIM cards and memory cards",
            "Find certified e-waste recycling facility",
            "Many electronics retailers offer take-back programs",
            "Check for local e-waste collection events",
            "Package devices securely for transport",
            "Deliver to certified recycling facility"
        ],
        "safety_notes": "E-waste contains lead, mercury, and other toxic materials. Never attempt to disassemble devices yourself. Always use certified recyclers.",
        "approx_cost_estimate": "low",
        "potential_yield_or_sale_idea": "Many programs offer free recycling. Some facilities pay for valuable components. Check local options.",
        "youtube_tutorials": [],
        "sources": [
            "https://www.epa.gov/international-cooperation/cleaning-electronic-waste-e-waste",
            "https://www.electronicstakeback.com/"
        ]
    }
}


def search_youtube_tutorials(material: str, product: str, max_results: int = 3) -> List[Dict[str, str]]:
    """
    Search for YouTube tutorials using Google's YouTube Data API v3
    
    Args:
        material: Waste material name (e.g., "paper", "plastic")
        product: Suggested product name (e.g., "Paper Mache Bowl")
        max_results: Maximum number of videos to return (default: 3)
    
    Returns:
        List of dictionaries with 'url', 'title', and 'description' keys
    """
    tutorials = []
    
    # Check if API key is configured
    if not YOUTUBE_API_ENABLED:
        print("YouTube API key not configured. Set YOUTUBE_API_KEY environment variable.")
        return tutorials
    
    try:
        # Construct search query - simple and clear for normal users
        # Format: "material product DIY tutorial" (e.g., "paper bowl DIY tutorial")
        search_query = f"{material} {product} DIY tutorial"
        
        # YouTube Data API v3 Search endpoint
        api_url = "https://www.googleapis.com/youtube/v3/search"
        
        params = {
            'part': 'snippet',
            'q': search_query,
            'type': 'video',
            'maxResults': max_results,
            'key': YOUTUBE_API_KEY,
            'order': 'relevance',  # Most relevant videos first
            'videoDefinition': 'high',  # Prefer HD videos
            'safeSearch': 'moderate'  # Filter inappropriate content
        }
        
        response = requests.get(api_url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Process API response
        if 'items' in data:
            for item in data['items']:
                video_id = item['id']['videoId']
                snippet = item['snippet']
                
                tutorial = {
                    'url': f"https://www.youtube.com/watch?v={video_id}",
                    'title': snippet.get('title', 'YouTube Tutorial'),
                    'description': snippet.get('description', '')[:150] + '...' if len(snippet.get('description', '')) > 150 else snippet.get('description', '')
                }
                tutorials.append(tutorial)
        
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to YouTube API: {e}")
        # Return empty list - don't break the main functionality
    except KeyError as e:
        print(f"Error parsing YouTube API response: {e}")
    except Exception as e:
        print(f"Unexpected error searching YouTube: {e}")
    
    return tutorials


def get_waste_list_from_request(request_data: Dict) -> List[str]:
    """Extract waste list from request payload or local storage reference"""
    waste_items = []
    
    # Try to get from request payload
    if 'waste_items' in request_data:
        waste_items = request_data['waste_items']
        if isinstance(waste_items, str):
            waste_items = json.loads(waste_items) if waste_items else []
    elif 'waste_list' in request_data:
        waste_items = request_data['waste_list']
        if isinstance(waste_items, str):
            waste_items = json.loads(waste_items) if waste_items else []
    
    # Try to get from classification prediction
    if not waste_items and 'prediction' in request_data:
        pred = request_data['prediction']
        if 'label' in pred:
            waste_items = [pred['label']]
        elif 'top' in pred and isinstance(pred['top'], list):
            waste_items = [item.get('label', '') for item in pred['top'] if item.get('label')]
    
    # Try to fetch from API if wasteListApi URL provided
    if not waste_items and 'wasteListApi' in request_data:
        try:
            api_url = request_data['wasteListApi']
            response = requests.get(api_url, timeout=5)
            if response.status_code == 200:
                api_data = response.json()
                if isinstance(api_data, list):
                    waste_items = api_data
                elif 'waste_items' in api_data:
                    waste_items = api_data['waste_items']
        except Exception as e:
            print(f"Error fetching from API: {e}")
    
    # Filter and normalize: only keep supported materials
    normalized_items = [item.lower().strip() for item in waste_items if item]
    filtered_items = [item for item in normalized_items if item in SUPPORTED_MATERIALS]
    
    return filtered_items


def generate_reuse_guide(material: str, request_data: Dict) -> Dict[str, Any]:
    """Generate a detailed reuse guide for a material"""
    material_lower = material.lower().strip()
    
    # Check if material is hazardous
    is_hazardous = any(haz in material_lower for haz in HAZARDOUS_MATERIALS)
    
    if is_hazardous:
        # Return safe disposal guide
        if material_lower in HAZARDOUS_DISPOSAL_GUIDE:
            guide = HAZARDOUS_DISPOSAL_GUIDE[material_lower].copy()
        else:
            # Generic hazardous material guide
            guide = HAZARDOUS_DISPOSAL_GUIDE['e-waste'].copy()
            guide['material'] = material_lower
    else:
        # Get reuse guide from database
        if material_lower in REUSE_GUIDE_DATABASE:
            guide = REUSE_GUIDE_DATABASE[material_lower].copy()
        else:
            # Return generic guide for unknown materials
            guide = {
                "suggested_product": "General Upcycled Item",
                "purpose": "Repurpose material to reduce waste",
                "materials_needed": ["Base material", "Basic craft supplies"],
                "tools_required": ["Basic household tools"],
                "difficulty": "medium",
                "estimated_time_minutes": 60,
                "step_by_step_instructions": [
                    "Clean and prepare the material",
                    "Plan your project design",
                    "Gather necessary tools and supplies",
                    "Follow safety precautions",
                    "Execute your upcycling project",
                    "Test functionality if applicable",
                    "Finish and decorate as desired"
                ],
                "safety_notes": "Ensure material is clean and safe to handle. Use appropriate safety equipment.",
                "approx_cost_estimate": "low",
                "potential_yield_or_sale_idea": "Varies based on project type",
                "youtube_tutorials": [],
                "sources": []
            }
    
    # Set material name
    guide['material'] = material_lower
    
    # Search for YouTube tutorials (if API available)
    if not is_hazardous:
        try:
            tutorials = search_youtube_tutorials(material_lower, guide.get('suggested_product', ''))
            guide['youtube_tutorials'] = tutorials
        except Exception as e:
            print(f"Error getting YouTube tutorials: {e}")
            guide['youtube_tutorials'] = []
    
    # Add sources
    if not guide.get('sources'):
        guide['sources'] = [
            f"Internal reuse guide database for {material_lower}",
            "https://www.epa.gov/recycle"
        ]
    
    return guide


@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')


@app.route('/api/waste-info', methods=['POST'])
def get_waste_info():
    """Legacy endpoint - kept for backward compatibility"""
    data = request.get_json()
    material = data.get('material', '').lower().strip()
    
    if not material:
        return jsonify({'error': 'Material name is required'}), 400
    
    # Return basic info for legacy support
    if material in REUSE_GUIDE_DATABASE:
        guide = REUSE_GUIDE_DATABASE[material]
        return jsonify({
            'material': material,
            'recycling_instructions': guide.get('step_by_step_instructions', []),
            'craft_ideas': [guide.get('suggested_product', '')]
        })
    
    return jsonify({'error': f'Material "{material}" not found'}), 404


@app.route('/api/reuse-guides', methods=['POST'])
def get_reuse_guides():
    """Main endpoint: Generate detailed reuse guides from waste material list"""
    try:
        request_data = request.get_json() or {}
        
        # Extract waste list from various sources
        waste_items = get_waste_list_from_request(request_data)
        
        # Handle empty waste list
        if not waste_items:
            return jsonify({
                'error': 'No supported waste items found',
                'supported_materials': SUPPORTED_MATERIALS,
                'retrieval_method_attempted': 'request_payload, classification_prediction, wasteListApi',
                'message': f'Please provide waste_items from supported materials: {", ".join(SUPPORTED_MATERIALS)}'
            }), 400
        
        # Generate guides for each waste item
        guides = []
        for item in waste_items:
            guide = generate_reuse_guide(item, request_data)
            guides.append(guide)
        
        return jsonify({
            'waste_items_processed': waste_items,
            'guides': guides,
            'total_guides': len(guides),
            'supported_materials': SUPPORTED_MATERIALS
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
