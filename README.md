# [SNAKE.pdf](https://alejandronq.github.io/SNAKE.pdf/snake.pdf)

[SNAKE.pdf](https://alejandronq.github.io/SNAKE.pdf/snake.pdf): the classic you know know and love, now in pdf. Open your chromium based browser of choice and enjoy!


### Snake
The game itself is (mostly) coded in JavaScript using [Adobe's JS API](https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/js_api_reference.pdf) or rather, [the small subset of it implemented by chromiumn browsers](https://pdfium.googlesource.com/pdfium/+/chromium/2524/fpdfsdk/src/javascript), although, as explained below, every game element is created with the pdf (which makes it look weird on non-chromium readers).

### Controls:
   Now supports keyboard imput. Click anywhere to start.
   
- Movement: WASD
- Pause: SAPACE BAR
- Unpause: Click on the "paused" message (KB imput disabled while paused)
- Speed up: +
- Speed down: -


### Keyboard input
Adobe's JS API has no way of reading keyboard input directly (the same way it's got no way of reading mouse coordinates), however, in much the same way as with the mouse, there are some tricks avaliable. Every element in the game is a text field (because they happen to be one of the few objects which allow API interaction), in particular, you can write on them and, crucially, their value can be read in JS. 

Although, in principle, the value of a field remains unchanged untill the input is commited, which is usually done by pressing enter, although clicking outside or just pressing tab work as well. In order to read near real time KB input we need some way to force commitment periodically. That can be easily archived by forcing focus loss (focussing on another field). After that, it's just a matter of reading the new value, erasing it and forcing focus onto the input field again (I guess you could get better results using it in combination with the KewDown event but I find it to be unnecesary for this application). Since the focus is selected by the game, the input field can be of size 0 which is convenient beacuse it can be distracting otherwise.


### PDF implementation:
The embeding of the game inside a pdf file is probably the most interesting aspect of this whole project. It could be done simply by hand (uncompressed unprotected pdf files are actually quite simple) but it would require calculating byte offsets by hand which is, to say the least, a tedious task. Here, it's been done with [a python script](https://github.com/AlejandroNQ/SNAKE.pdf/blob/main/generate_snake.py) using the library [pdfrw](https://github.com/pmaupin/pdfrw) (and [a custom module](https://github.com/osnr/horrifying-pdf-experiments/blob/master/generate.py) by [Omar Rizwan](https://github.com/osnr)).

A few interesting challenges that arise from the limited API implementation by chromium browsers are:
- Every element of the game is a text box (which means you can pause the game and write just about anything anywhere).
- No new boxes can be created at runtime (though the API), so everything must be created *with* the file (here done in python).
- The whole game area has to be flashed after moving each text box, otherwise, they would leave a trace like a stamp.


More information can be found in [this brilliant post](https://github.com/osnr/horrifying-pdf-experiments/blob/master/README.md) by [Omar Rizwan](https://github.com/osnr) which has been the main source for this project. I encourage the curious reader to go check it out.

### Bugs:
Sometimes it will fail to eat the apple while taking a turn in that same square. It seems to happen more often near the edges. The reason is unknown and so is the answer.

Also, there's a few places where the code could be inplemented much more efficiently, maybe one day I'll get around and do it. But so far I'm quite pleased with the result. I was just looking for a proof of concept kind of thing and ended up with quite a playable game. I know I'll be plying it quite a bit XD.
