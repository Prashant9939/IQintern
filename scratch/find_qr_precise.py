import numpy as np
from PIL import Image

def find_qr_precise():
    img = Image.open('public/whatsapp/media__1784048002831.jpg')
    arr = np.array(img.convert('L')) # convert to grayscale
    
    height, width = arr.shape
    
    # Calculate horizontal and vertical transitions
    # A transition is where adjacent pixels cross a threshold (e.g. going from light to dark)
    threshold = 127
    binary = arr < threshold
    
    # Diff along columns and rows to find transitions
    h_transitions = np.sum(diff := np.abs(binary[:, 1:].astype(int) - binary[:, :-1].astype(int)), axis=1)
    v_transitions = np.sum(np.abs(binary[1:, :].astype(int) - binary[:-1, :].astype(int)), axis=0)
    
    # Find the region with high transition counts
    # Let's filter transitions that are above a certain threshold (e.g. 10 transitions per line)
    h_active = np.where(h_transitions > 20)[0]
    v_active = np.where(v_transitions > 20)[0]
    
    if len(h_active) > 0 and len(v_active) > 0:
        y1, y2 = h_active[0], h_active[-1]
        x1, x2 = v_active[0], v_active[-1]
        
        print(f"High transition region: x=({x1}, {x2}), y=({y1}, {y2})")
        
        # Let's crop this region and see
        cropped = img.crop((x1, y1, x2, y2))
        cropped.save('public/whatsapp/qr-precise.png')
        print("Cropped precise QR code.")
    else:
        print("Could not find high transition region.")

if __name__ == '__main__':
    find_qr_precise()
