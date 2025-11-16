"""
Example usage of the Waste-to-Reuse Recommendation Agent API

This file demonstrates how to interact with the API programmatically.

Note: For YouTube tutorials to appear in guides, make sure YOUTUBE_API_KEY
environment variable is set. See YOUTUBE_API_SETUP.md for setup instructions.
"""

import requests
import json

# Base URL of the API
BASE_URL = "http://localhost:5000"

def example_1_manual_waste_items():
    """Example 1: Send waste items directly"""
    print("Example 1: Manual waste items")
    print("-" * 50)
    
    response = requests.post(
        f"{BASE_URL}/api/reuse-guides",
        json={
            "waste_items": ["paper", "plastic", "glass"]
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Processed {data['total_guides']} materials")
        for guide in data['guides']:
            print(f"\nMaterial: {guide['material']}")
            print(f"Product: {guide['suggested_product']}")
            print(f"Difficulty: {guide['difficulty']}")
            print(f"Time: {guide['estimated_time_minutes']} minutes")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())


def example_2_classification_response():
    """Example 2: Send classification API response format"""
    print("\n\nExample 2: Classification API response")
    print("-" * 50)
    
    classification_data = {
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
                },
                {
                    "label": "cardboard",
                    "confidence": 0.09211843460798264
                }
            ]
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/api/reuse-guides",
        json=classification_data
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Processed {data['total_guides']} materials from classification")
        for guide in data['guides']:
            print(f"\nMaterial: {guide['material']}")
            print(f"Product: {guide['suggested_product']}")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())


def example_3_hazardous_material():
    """Example 3: Test hazardous material handling"""
    print("\n\nExample 3: Hazardous material (battery)")
    print("-" * 50)
    
    response = requests.post(
        f"{BASE_URL}/api/reuse-guides",
        json={
            "waste_items": ["battery"]
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        guide = data['guides'][0]
        print(f"Material: {guide['material']}")
        print(f"Product: {guide['suggested_product']}")
        print(f"Purpose: {guide['purpose']}")
        print(f"\nSafety Notes: {guide['safety_notes']}")
        print(f"\nFirst 3 steps:")
        for i, step in enumerate(guide['step_by_step_instructions'][:3], 1):
            print(f"  {i}. {step}")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())


def example_4_error_handling():
    """Example 4: Test error handling with empty list"""
    print("\n\nExample 4: Error handling (empty waste list)")
    print("-" * 50)
    
    response = requests.post(
        f"{BASE_URL}/api/reuse-guides",
        json={}
    )
    
    if response.status_code == 400:
        error_data = response.json()
        print(f"Error: {error_data['error']}")
        print(f"Message: {error_data['message']}")
        print(f"Retrieval methods attempted: {error_data['retrieval_method_attempted']}")
    else:
        print(f"Unexpected status: {response.status_code}")
        print(response.json())


if __name__ == "__main__":
    print("=" * 50)
    print("Waste-to-Reuse Recommendation Agent - API Examples")
    print("=" * 50)
    print("\nMake sure the Flask server is running on http://localhost:5000")
    print("\n")
    
    try:
        example_1_manual_waste_items()
        example_2_classification_response()
        example_3_hazardous_material()
        example_4_error_handling()
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the server.")
        print("Please make sure the Flask server is running:")
        print("  python app.py")
    except Exception as e:
        print(f"\nError: {e}")

