# [SNAKE.pdf](https://alejandronq.github.io/SNAKE.pdf/snake.pdf)

[SNAKE.pdf](https://alejandronq.github.io/SNAKE.pdf/snake.pdf): the classic you know know and love, now in pdf. Open your chromium based browser of choice and enjoy!


### Snake
The game itself is (mostly) coded in JavaScript using [Adobe's JS API](https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/js_api_reference.pdf) or rather, [the small subset of it implemented by chromiumn browsers](https://pdfium.googlesource.com/pdfium/+/chromium/2524/fpdfsdk/src/javascript), although, as explained below, every game element is created with the pdf (which makes it look weird on non-chromium readers).

**Controls:**
   Now supports keyboard imput. Click anywhere to start.
   
- Movement: WASD
- Pause: SAPACE BAR
- Unpause: Click on the "paused" message (KB imput disabled while paused)
- Speed up: +
- Speed down: -


### PDF implementation:
The embeding of the game inside a pdf file is probably the most interesting aspect of this whole project. It could be done simply by hand (uncompressed unprotected pdf files are actually quite simple) but it would require calculating byte offsets by hand which is, to say the least, a tedious task. Here, it's been done with [a python script](https://github.com/AlejandroNQ/SNAKE.pdf/blob/main/generate_snake.py) using the library [pdfrw](https://github.com/pmaupin/pdfrw) (and [a custom module](https://github.com/osnr/horrifying-pdf-experiments/blob/master/generate.py) by [Omar Rizwan](https://github.com/osnr)).

A few interesting challenges that arise from the limited API implementation by chromium browsers are:
- Every element of the game is a text box (which means you can pause the game and write just about anything anywhere).
- No new boxes can be created at runtime (though the API), so everything must be created *with* the file (here done in python).
- The whole game area has to be flashed after moving each text box, otherwise, they would leave a trace like a stamp.


More information can be found in [this brilliant post](https://github.com/osnr/horrifying-pdf-experiments/blob/master/README.md) by [Omar Rizwan](https://github.com/osnr) which has been the main source for this project. I encourage the curious reader to go check it out.
