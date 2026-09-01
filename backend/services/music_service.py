# backend/services/music_service.py
import yt_dlp
import logging

logger = logging.getLogger(__name__)

def get_top_youtube_video(query: str) -> str | None:
    """
    Searches YouTube for a given song query and returns the direct
    watch URL (https://www.youtube.com/watch?v=VIDEO_ID) of the first
    valid video match, or None if nothing usable was found.
    """
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': 'in_playlist',
        'skip_download': True,
        'noplaylist': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"ytsearch5:{query}", download=False)

            entries = (info or {}).get('entries') or []

            for entry in entries:
                if not entry:
                    continue

                # Skip anything that isn't a plain YouTube video
                # (mixes, playlists, channels sometimes surface here)
                if entry.get('_type') not in (None, 'url', 'video'):
                    continue
                if entry.get('ie_key') not in (None, 'Youtube'):
                    continue

                video_id = entry.get('id')
                webpage_url = entry.get('url') or entry.get('webpage_url')

                if video_id:
                    return f"https://www.youtube.com/watch?v={video_id}"
                elif webpage_url:
                    if webpage_url.startswith('http'):
                        return webpage_url
                    return f"https://www.youtube.com/watch?v={webpage_url}"

    except Exception as e:
        logger.error(f"Failed to fetch YouTube link with yt-dlp for '{query}': {e}")

    return None