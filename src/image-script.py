from PIL import Image, ImageOps
from pathlib import Path
import os

size = 1320
quality = 70
max_size = 200

path = Path('./content')
for r, d, files in path.walk():
    for f in files:
        cur_file = Path(r) / f

        if cur_file.suffix.lower() not in [".png", ".tif", ".tiff", ".bmp", ".jpg", ".gif", ".jpeg", ".webp"]:
            continue

        new_file = cur_file.with_suffix('.webp')
        image_replaced = False
        with Image.open(cur_file) as img:

            w, h = img.size
            file_size = os.path.getsize(cur_file) / 1000
            if (w <= size) and (h <= size) and (file_size < max_size) and (cur_file.suffix == '.webp'):
                continue

            img = ImageOps.exif_transpose(img).convert('RGB')
            img.thumbnail((size, size), Image.Resampling.LANCZOS)
            img.save(new_file, "WEBP", quality=quality, optimize=True)
            image_replaced = True

        if (image_replaced) and (cur_file != new_file):
            print(f'Image replaced: {cur_file}')
            cur_file.unlink()
        elif (file_size > 150):
            print(f'Image quality reduced: {cur_file}')