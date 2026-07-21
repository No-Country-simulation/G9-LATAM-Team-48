"""Make logo white-bg transparent and build a dark-navbar variant (navy text → light)."""
from pathlib import Path

from PIL import Image

public = Path(__file__).resolve().parents[1] / "public"
src = public / "logo-energia.png"

img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size

# 1) Transparent background (near-white)
white_threshold = 245
# 2) Dark-mode: near-black / navy wordmark → light
dark_threshold = 55

cleared = 0
lightened = 0
dark = img.copy()
dp = dark.load()

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r >= white_threshold and g >= white_threshold and b >= white_threshold:
            pixels[x, y] = (r, g, b, 0)
            dp[x, y] = (r, g, b, 0)
            cleared += 1
            continue
        # Very dark ink (Energ wordmark) → soft white for dark navbar
        if a > 200 and r < dark_threshold and g < dark_threshold and b < dark_threshold + 25:
            dp[x, y] = (236, 242, 255, a)
            lightened += 1

img.save(public / "logo-energia.png", "PNG")
dark.save(public / "logo-energia-dark.png", "PNG")
print(f"size={w}x{h} cleared={cleared} lightened={lightened}")
print(f"wrote {public / 'logo-energia.png'}")
print(f"wrote {public / 'logo-energia-dark.png'}")
