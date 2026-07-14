import numpy as np
from PIL import Image

def find_qr_square():
    img = Image.open('public/whatsapp/media__1784048002831.jpg')
    arr = np.array(img.convert('L'))
    threshold = 127
    binary = arr < threshold
    
    # Calculate transitions per row
    diff = np.abs(binary[:, 1:].astype(int) - binary[:, :-1].astype(int))
    transitions_per_row = np.sum(diff, axis=1)
    
    # We expect the QR code to have many transitions per row. Let's find rows with high transitions.
    # Let's print the transition count for rows in the white card range (180 to 710)
    for y in range(180, 710, 5):
        print(f"Row {y:03d}: {'*' * (transitions_per_row[y] // 2)} ({transitions_per_row[y]})")

if __name__ == '__main__':
    find_qr_square()
