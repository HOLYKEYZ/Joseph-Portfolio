import math
from PIL import Image, ImageDraw, ImageFont
import os

width, height = 800, 600
img = Image.new('RGB', (width, height), color='#0a0a0a')
draw = ImageDraw.Draw(img)

# Attempt to load common sans-serif fonts for cross-platform compatibility
preferred_fonts = ["Arial.ttf", "Helvetica.ttf", "DejaVuSans.ttf", "LiberationSans-Regular.ttf"]
font_title = ImageFont.load_default()
font_text = ImageFont.load_default()
for font_name in preferred_fonts:
    try:
        font_title = ImageFont.truetype(font_name, 18)
        font_text = ImageFont.truetype(font_name, 12)
        break
    except:
        pass

def draw_box(draw, x, y, w, h, text, bg='#1a1a1a', border='#3b82f6'):
    draw.rectangle([x, y, x+w, y+h], fill=bg, outline=border, width=2)
    draw.rectangle([x+2, y+2, x+w-2, y+h-2], fill=bg)
    tw = draw.textlength(text, font=font_text)
    draw.text((x + (w-tw)/2, y + h/2 - 8), text, fill='#ffffff', font=font_text)

def draw_arrow(draw, x1, y1, x2, y2):
    draw.line([x1, y1, x2, y2], fill='#64ffda', width=2)
    dy = y2 - y1
    dx = x2 - x1
    angle = math.atan2(dy, dx)
    arrowhead_length = 10
    arrowhead_width = 5
    tip_x, tip_y = x2, y2
    base1_x = tip_x - arrowhead_length * math.cos(angle - math.pi/6)
    base1_y = tip_y - arrowhead_length * math.sin(angle - math.pi/6)
    base2_x = tip_x - arrowhead_length * math.cos(angle + math.pi/6)
    base2_y = tip_y - arrowhead_length * math.sin(angle + math.pi/6)
    draw.polygon([(tip_x, tip_y), (base1_x, base1_y), (base2_x, base2_y)], fill='#64ffda')

title = "Mayo Triple-AI Pipeline"
tw = draw.textlength(title, font=font_title)
draw.text((width/2 - tw/2, 20), title, fill='#ffffff', font=font_title)

boxes = [
    (300, 60, 200, 35, "Hourly Cron Trigger"),
    (300, 110, 200, 35, "SCANNER: Deep analysis"),
    (300, 160, 200, 35, "EXECUTOR: Generate edits"),
    (300, 210, 200, 35, "REVIEWER: Validate edits"),
    (150, 260, 150, 35, "APPROVE -> PR"),
    (300, 260, 150, 35, "CORRECT -> Retry"),
    (450, 260, 200, 35, "REJECT -> Feedback"),
    (300, 310, 200, 35, "EXECUTOR: Retry w/ feedback"),
    (300, 360, 200, 35, "REVIEWER: Validate retry"),
    (150, 410, 120, 35, "Create PR"),
    (450, 410, 180, 35, "Save failure to memory"),
    (300, 460, 200, 35, "Global Memory (All 3 AIs)"),
]

for x, y, w, h, text in boxes:
    draw_box(draw, x, y, w, h, text)

arrows = [
    (400, 95, 400, 110),
    (400, 145, 400, 160),
    (400, 195, 400, 210),
    (225, 225, 150, 260),
    (375, 225, 300, 260),
    (500, 225, 450, 260),
    (300, 295, 300, 310),
    (400, 295, 450, 310),
    (400, 345, 400, 360),
    (210, 380, 150, 410),
    (550, 380, 450, 410),
    (300, 445, 300, 460),
    (400, 475, 450, 410),
]

for x1, y1, x2, y2 in arrows:
    draw_arrow(draw, x1, y1, x2, y2)

img.save('mayo_flowchart.png')
print("mayo_flowchart.png created!")
