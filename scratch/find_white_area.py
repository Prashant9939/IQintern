import cv2
import numpy as np
from PIL import Image

def crop_qr():
    # Load image
    img = Image.open('public/whatsapp/media__1784048002831.jpg')
    width, height = img.size
    
    # Convert to numpy array for scanning
    arr = np.array(img)
    
    # We want to find the white card in the green background
    # Let's find all rows and columns where color is white or near-white (e.g., > 240 in all RGB channels)
    white_mask = (arr[:, :, 0] > 240) & (arr[:, :, 1] > 240) & (arr[:, :, 2] > 240)
    
    # Find bounding box of white mask
    y_indices, x_indices = np.where(white_mask)
    if len(x_indices) > 0 and len(y_indices) > 0:
        min_x, max_x = np.min(x_indices), np.max(x_indices)
        min_y, max_y = np.min(y_indices), np.max(y_indices)
        print(f"White card bounding box: x=({min_x}, {max_x}), y=({min_y}, {max_y})")
        
        # Crop the card
        card = img.crop((min_x, min_y, max_x, max_y))
        card.save('public/whatsapp/qr-card-cropped.jpg')
        
        # Now let's crop just the QR code.
        # The QR code itself is a square inside the white card.
        # The QR code is black on white, so its pixels are dark (e.g., < 50 in all channels)
        # Let's find the bounding box of the dark pixels inside the card.
        card_arr = np.array(card)
        dark_mask = (card_arr[:, :, 0] < 50) & (card_arr[:, :, 1] < 50) & (card_arr[:, :, 2] < 50)
        cy_indices, cx_indices = np.where(dark_mask)
        if len(cx_indices) > 0 and len(cy_indices) > 0:
            cmin_x, cmax_x = np.min(cx_indices), np.max(cx_indices)
            cmin_y, cmax_y = np.min(cy_indices), np.max(cy_indices)
            print(f"QR code bounding box inside card: x=({cmin_x}, {cmax_x}), y=({cmin_y}, {cmax_y})")
            
            # Crop the QR code (add a small margin)
            margin = 15
            qmin_x = max(0, cmin_x - margin)
            qmin_y = max(0, cmin_y - margin)
            qmax_x = min(card.size[0], cmax_x + margin)
            qmax_y = min(card.size[1], cmax_y + margin)
            
            qr_only = card.crop((qmin_x, qmin_y, qmax_x, qmax_y))
            qr_only.save('public/whatsapp/qr-code-only.jpg')
            print("Successfully cropped QR code.")
    else:
        print("White mask not found.")

if __name__ == '__main__':
    crop_qr()
