# backend/services/music_service.py
import yt_dlp
import logging

logger = logging.getLogger(__name__)

def get_top_youtube_video(query: str) -> str:
    """
    Searches YouTube for a given song query and returns the direct 
    watch URL (https://www.youtube.com/watch?v=VIDEO_ID) of the first match.
    """
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'skip_download': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Search YouTube for the top 1 result
            info = ydl.extract_info(f"ytsearch1:{query}", download=False)
            
            if info and 'entries' in info and len(info['entries']) > 0:
                video_id = info['entries'][0]['id']
                return f"https://www.youtube.com/watch?v={video_id}"
    except Exception as e:
        logger.error(f"Failed to fetch YouTube link with yt-dlp: {e}")

    # Fallback to search results page if extraction fails
    search_query = query.replace(" ", "+")
    return f"https://www.youtube.com/results?search_query={search_query}"