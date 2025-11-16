"""
Simple test script to verify YouTube API integration

Run this script to test if your YouTube API key is working correctly.
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_youtube_api():
    """Test YouTube Data API v3 connection"""
    
    api_key = os.getenv('YOUTUBE_API_KEY', '')
    
    if not api_key:
        print("❌ YouTube API key not found!")
        print("\nPlease set the YOUTUBE_API_KEY environment variable:")
        print("  Windows (PowerShell): $env:YOUTUBE_API_KEY='your_key_here'")
        print("  Linux/Mac: export YOUTUBE_API_KEY='your_key_here'")
        print("\nSee YOUTUBE_API_SETUP.md for detailed setup instructions.")
        return False
    
    print("🔍 Testing YouTube API connection...")
    print(f"API Key: {api_key[:10]}...{api_key[-5:]} (hidden for security)\n")
    
    try:
        # Test search query
        search_query = "paper DIY tutorial"
        api_url = "https://www.googleapis.com/youtube/v3/search"
        
        params = {
            'part': 'snippet',
            'q': search_query,
            'type': 'video',
            'maxResults': 3,
            'key': api_key,
            'order': 'relevance'
        }
        
        print(f"Searching for: '{search_query}'...")
        response = requests.get(api_url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if 'items' in data and len(data['items']) > 0:
            print("✅ YouTube API is working correctly!\n")
            print("Found videos:")
            for i, item in enumerate(data['items'], 1):
                title = item['snippet']['title']
                video_id = item['id']['videoId']
                url = f"https://www.youtube.com/watch?v={video_id}"
                print(f"  {i}. {title}")
                print(f"     URL: {url}\n")
            return True
        else:
            print("⚠️ API responded but no videos found.")
            return False
            
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            print("❌ API Error: Access forbidden")
            print("   Possible reasons:")
            print("   - API key is invalid")
            print("   - YouTube Data API v3 is not enabled")
            print("   - API key restrictions are too strict")
            print("   - Quota exceeded")
        elif e.response.status_code == 400:
            print("❌ API Error: Bad request")
            print("   Check your API key format")
        else:
            print(f"❌ API Error: {e.response.status_code}")
            print(f"   {e.response.text}")
        return False
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection Error: {e}")
        print("   Check your internet connection")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("YouTube Data API v3 - Connection Test")
    print("=" * 60)
    print()
    
    success = test_youtube_api()
    
    print("=" * 60)
    if success:
        print("✅ Test passed! Your YouTube API is ready to use.")
        print("\nYou can now run the main application:")
        print("  python app.py")
    else:
        print("❌ Test failed. Please check the errors above.")
        print("\nFor help, see: YOUTUBE_API_SETUP.md")
    print("=" * 60)

