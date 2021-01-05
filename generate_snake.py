from pdfrw import PdfWriter, PdfReader
from pdfrw.objects.pdfname import PdfName
from pdfrw.objects.pdfstring import PdfString
from pdfrw.objects.pdfdict import PdfDict
from pdfrw.objects.pdfarray import PdfArray

from generate import make_field, make_js_action, make_page

PAGE_WIDTH = 612
PAGE_HEIGHT = 792

CANVAS_WIDTH = 600
CANVAS_HEIGHT = 600
CANVAS_BOTTOM = PAGE_HEIGHT - CANVAS_HEIGHT

APPLE_WIDTH = 18
APPLE_HEIGHT = 18

HEAD_WIDTH = 18
HEAD_HEIGHT = 18

BRICK_ROW_COUNT = 20
BRICK_COLUMN_COUNT = 20
BRICK_WIDTH = 18
BRICK_HEIGHT = 18
BRICK_PADDING = 2

BRICK_OFFSET_BOTTOM = CANVAS_BOTTOM + 100
BRICK_OFFSET_LEFT = 100

# Every object we move, toggle on and off, or take events from must be
# an input widget for this to work in Chrome. In this case, we just
# use text fields.

# Chrome also doesn't implement `addField`, so we can't dynamically
# make these at runtime; we have to do it now at PDF creation time.

fields = []

# User won't see this default value; it gets set in JS.
pause = make_field(
    'countdown',
    x=(PAGE_WIDTH-300)/2, y=CANVAS_BOTTOM + 250,
    width=300, height=100,
    r=1, g=1, b=1,
    value='Open in Chrome!'
)
pause.AA = PdfDict()
pause.AA.Fo = make_js_action("""
global.paused = false;
""")
fields.append(pause)

fields.append(make_field(
    'apple',
    x=400, y=CANVAS_BOTTOM + 300,
    width=APPLE_WIDTH, height=APPLE_HEIGHT,
    r=1.0, g=0.1, b=0.1
))

for c in range(0, BRICK_COLUMN_COUNT):
    for r in range(0, BRICK_ROW_COUNT):
        brick_x = r*(BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT
        brick_y = c*(BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_BOTTOM
        brick = make_field(
            'brick%d,%d' % (c, r),
            x=brick_x, y=brick_y,
            width=BRICK_WIDTH, height=BRICK_HEIGHT,
            r=0.3, g=0.8, b=0.3
        )
        fields.append(brick)

fields.append(make_field(
    'head',
    x=140, y=CANVAS_BOTTOM + 300,
    width=HEAD_WIDTH, height=HEAD_HEIGHT,
    r=0.0, g=0.5, b=0.0
))

fields.append(make_field(
    'score',
    x=0, y=PAGE_HEIGHT - 50,
    width=90, height=30,
    r=0.9, g=0.9, b=0.9
))
fields.append(make_field(
    'speed',
    x=0, y=PAGE_HEIGHT - 100,
    width=90, height=30,
    r=0.9, g=0.9, b=0.9
))
#KeyBoard Imput
fields.append(make_field(
    'control',
    x=100, y=CANVAS_BOTTOM - 10,
    width=400, height=100,
    r=0.8, g=0.8, b=1,
    value='CLICK HERE'
))
fields.append(make_field(
    'board',
    x=100, y=CANVAS_BOTTOM + 100,
    width=BRICK_COLUMN_COUNT*(BRICK_WIDTH + BRICK_PADDING),
    height=BRICK_ROW_COUNT*(BRICK_HEIGHT + BRICK_PADDING),
    r=0.8, g=0.8, b=0.8
))

# See `snake_KBI.js`: used to force rendering cleanup in Chrome.
fields.append(make_field(
    'whole', x=0, y=CANVAS_BOTTOM,
    width=CANVAS_WIDTH, height=CANVAS_HEIGHT,
    r=1, g=1, b=1
))

with open('snake_KBI.js', 'r') as js_file:
    script = js_file.read()

# Share our constants with the JS script.
page = make_page(fields, """
var CANVAS_WIDTH = %(CANVAS_WIDTH)s;
var CANVAS_HEIGHT = %(CANVAS_HEIGHT)s;
var CANVAS_BOTTOM = %(CANVAS_BOTTOM)s;
var APPLE_WIDTH = %(APPLE_WIDTH)s;
var APPLE_HEIGHT = %(APPLE_HEIGHT)s;
var HEAD_WIDTH = %(HEAD_WIDTH)s;
var HEAD_HEIGHT = %(HEAD_HEIGHT)s;
var BRICK_ROW_COUNT = %(BRICK_ROW_COUNT)s;
var BRICK_COLUMN_COUNT = %(BRICK_COLUMN_COUNT)s;
var BRICK_WIDTH = %(BRICK_WIDTH)s;
var BRICK_HEIGHT = %(BRICK_HEIGHT)s;
var BRICK_PADDING = %(BRICK_PADDING)s;
var BRICK_OFFSET_BOTTOM = %(BRICK_OFFSET_BOTTOM)s;
var BRICK_OFFSET_LEFT = %(BRICK_OFFSET_LEFT)s;
%(script)s
""" % locals())

page.Contents.stream = """
BT
/F1 32 Tf
150 700 Td (SNAKE.pdf) Tj
/F2 16 Tf
320 -575 Td (Author:) Tj
/F3 12 Tf
60  -18   Td (Alejandro) Tj
6   -18   Td (Navarro) Tj
2   -18   Td (Quijada) Tj
-150 -22  Td (Alejandro.cuenta.formal@gmail.com) Tj
/F2 16 Tf
-320 76    Td (Controls:) Tj
/F3 12 Tf
40  -18   Td (Movement:         WASD) Tj
0   -18   Td (Speed control:    + -) Tj
0   -18   Td (Pause:                SPACE BAR) Tj
0   -18   Td (Unpause:            Click "Paused") Tj
ET
"""

#readme = PdfReader('README.pdf')

out = PdfWriter()
out.addpage(page)
#for readme_page in readme.pages:
#    out.addpage(readme_page)
out.write('snake.pdf')
