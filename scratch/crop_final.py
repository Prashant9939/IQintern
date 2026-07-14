from PIL import Image

def crop_final():
    # Open the original QR Code image card
    img = Image.open('public/whatsapp/media__1784048002831.jpg')
    
    # Define QR code bounding box
    # x: 168 to 407 (width 239)
    # y: 390 to 630 (height 240)
    # Let's add a small padding of 10 pixels around it to make it look clean with a white border
    padding = 10
    x1 = 168 - padding
    y1 = 390 - padding
    x2 = 407 + padding
    y2 = 630 + padding
    
    qr_cropped = img.crop((x1, y1, x2, y2))
    
    # Save the QR code
    qr_cropped.save('public/whatsapp/qr-code.png')
    print(f"QR code successfully cropped and saved to public/whatsapp/qr-code.png with dimensions {qr_cropped.size}")

if __name__ == '__main__':
    crop_final()
