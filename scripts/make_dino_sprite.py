from PIL import Image

src = r"D:\WTZ\prts\assets\dino_orig1.png"
out = r"D:\WTZ\prts\assets\dino.png"
TEAL = (63, 224, 200)

im = Image.open(src).convert("L")
w, h = im.size
px = im.load()
rgba = Image.new("RGBA", (w, h), (0, 0, 0, 0))
rp = rgba.load()
for y in range(h):
    for x in range(w):
        v = px[x, y]
        if v >= 190:
            a = 0
        elif v <= 100:
            a = 255
        else:
            a = int((190 - v) / 90 * 255)
        if a:
            rp[x, y] = (TEAL[0], TEAL[1], TEAL[2], a)

bbox = rgba.getbbox()
crop = rgba.crop(bbox)
p = 2
final = Image.new("RGBA", (crop.width + p * 2, crop.height + p * 2), (0, 0, 0, 0))
final.paste(crop, (p, p))
final.save(out)
print("src bbox:", bbox, "final size:", final.size)

chk = Image.open(out)
print("mode:", chk.mode, "size:", chk.size, "bbox:", chk.getbbox())
