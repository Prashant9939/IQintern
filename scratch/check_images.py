import os
from PIL import Image

def analyze():
    files = [f for f in os.listdir('public/whatsapp') if f.startswith('media__')]
    for f in files:
        path = os.path.join('public/whatsapp', f)
        try:
            img = Image.open(path)
            print(f"File: {f}")
            print(f"  Size: {img.size}")
            print(f"  Format: {img.format}")
            # Check average colors of quadrants to guess content
            # e.g., QR code card has a green background
            colors = img.getcolors(maxcolors=10000)
            if colors:
                print(f"  Unique colors count: {len(colors)}")
        except Exception as e:
            print(f"Error reading {f}: {e}")

if __name__ == '__main__':
    analyze()
