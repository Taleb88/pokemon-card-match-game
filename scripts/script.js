var ctx; // hold all canvas context 
var firstPick = true; // initialize the first selection
var firstCard = -1; 
var secondCard; // hold the info defining the second selection
var backColor = 'blue'; // color of the front of the card
var tableColor = 'transparent'; // color of the table
var deck = []; // deck is initially an empty array
var firstsx = 100; // x position of first card
var firstsy = 105; // y position of first card
var margin = 35; // margin between each card
var cardWidth = 100; 
var cardHeight = 100;
var matched; 
var startTime;  
var count = 0;
var pairs = [
                ['ancientmew1.jpeg','ancientmew2.jpeg'], 
                ['charizard1.jpeg','charizard2.jpeg'],
                ['pikachu1.jpeg','pikachu2.jpeg'],
                ['snorlax1.jpeg','snorlax2.jpeg'],
                ['ekens1.jpeg','ekens2.jpeg'],
                ['squirtle1.jpeg','squirtle2.jpeg'],
                ['charmander1.jpeg','charmander2.jpeg'],
                ['bulbasaur1.jpeg','bulbasaur2.jpeg']
            ];
// set up card objects
function Card(sx,sy,sWidth,sHeight,img,info) {
    this.sx = sx; // set horizonal position
    this.sy = sy; // set vertical position
    this.sWidth = sWidth; // set card width
    this.sHeight = sHeight; // set card height
    this.info = info; // indicates matches
    this.img = img; // img reference
    this.draw = drawBack; // specify how to draw
}

function makeDeck() {
    var i; // used in 'for' loop
    var aCard; // hold first pair of cards
    var bCard; // hold second pair of cards
    var picA; // hold first picture
    var picB; // hold second picture
    var cx = firstsx; // hold x position; start at first x position
    var cy = firstsy; // hold y position; start at first y position

    for(i=0;i<pairs.length;i++) {
        picA = new Image(); // create img object
        picA.src = pairs[i][0]; // set to first file
        aCard = new Card(cx,cy,cardWidth,cardHeight,picA,i); // create new card
        deck.push(aCard); // add to deck via '.push' method
        picB = new Image(); // create img object
        picB.src = pairs[i][1]; // set to second file
        bCard = new Card(cx,cy+cardHeight+margin,cardWidth,cardHeight,picB,i); // create card
        deck.push(bCard); // add to deck via '.push' method
        cx = cx+cardWidth+margin; // increment to have card width + margin
        aCard.draw(); // draw first card
        bCard.draw(); // draw second card
    }
}

function shuffle() {
    var i; // use in 'for' loop
    var k; // use in 'for' loop
    var holderInfo; // temporary place for swap
    var holderImg; // temporary place for swap
    var dl = deck.length; // deck length
    var nt; // index for number of swaps
    // do the swap 3 times deck.length times
    for(nt=0;nt<3*dl;nt++) {
        i = Math.floor(Math.random()*dl); // get random card
        k = Math.floor(Math.random()*dl); // get random card
        holderInfo = deck[i].info; // info is saved
        holderImg = deck[i].img; // img is saved
        deck[i].info = deck[k].info; // put k's info into i
        deck[i].img = deck[k].img; // put k's img into i
        deck[k].info = holderInfo; // set to original info
        deck[k].img = holderImg; // set to original img
    }
}

function drawBack() {
    ctx.fillStyle = backColor; // set color of the back of the card
    ctx.fillRect(this.sx,this.sy,this.sWidth,this.sHeight); // create the card by drawing the rectangle
}

function select(ev) {
    var mx; // hold mouse x
    var my; // hol dmouse y

    // handling difference among chrome, firefox, and opera browsers
    if(ev.layerX || ev.layerX == 0) { // if layerX and layerY can be used
        mx = ev.layerX; // set mx
        my = ev.layerY; // set my
    } else if (ev.offsetX || ev.offsetX == 0) { // if offsetX and offset and be used
        mx = ev.offsetX; // set mx
        my = ev.offsetY; // set my
    }

    var i; // indexing in the 'for' loop
    for(i=0;i<deck.length;i++) {
        var card = deck[i]; // extract card reference to simplify the code
        if(card.sx>=0) // avoid checking for clicking on space
        // check if the mouse is over the card
        if((mx>card.sx)&&(mx<card.sx+card.sWidth)&&(my>card.sy)&&(my<card.sy+card.sHeight)) {
            // if mouse is over card, check if player is not clicking on the first card again, if true, leave 'for' loop
            if((firstPick)||(i!=firstCard)) { 
                break;
            }
        }
    }
    // if the 'for' loop was exited early
    if(i<deck.length) {
        if(firstPick) {
            firstCard = i; // 'firstcard' set to reference card in deck
            firstPick = false; 
            ctx.drawImage(card.img,card.sx,card.sy,card.sWidth,card.sHeight); // draw picture
        } else {
            secondCard = i;
            ctx.drawImage(card.img,card.sx,card.sy,card.sWidth,card.sHeight); // draw picture
            // check if there's a match
            if(card.info==deck[firstCard].info) {
                matched = true;
                count++;
                ctx.fillStyle = tableColor;
                ctx.fillRect(10,340,900,100); // erase area where text will show
                ctx.fillStyle = backColor; // reset to the color for text

                if(count>=0.5*deck.length) {
                    var now = new Date();
                    var nt = Number(now.getTime());
                    var seconds = Math.floor(0.5+(nt-startTime)/1000);
                    
                    ctx.fillStyle = tableColor;
                    alert('Completed in: '+String(seconds)+' seconds. Please refresh the page to try again.');
                }
            } else {
                matched = false;
            }

            firstPick = true; // reset the first pick
            setTimeout(flipBack,240); // pause in between selection of first two cards if no match
        }
    }
}

function flipBack() {
    if(!matched) {
        // draw cards back
        deck[firstCard].draw();
        deck[secondCard].draw();
    } else {
        ctx.fillStyle = tableColor;
        // flip card over
        ctx.fillRect(deck[secondCard].sx,
            deck[secondCard].sy,
            deck[secondCard].sWidth,
            deck[secondCard].sHeight
            );
        // flip card over
        ctx.fillRect(deck[firstCard].sx,
            deck[firstCard].sy,
            deck[firstCard].sWidth,
            deck[firstCard].sHeight
            );
        deck[secondCard].sx = -1; // set so card will not be checked
        deck[firstCard].sx = -1; // set so card will not be checked
    }
}

function init() {
    ctx = document.getElementById('canvas').getContext('2d'); // assign ctx to do all of the drawing on the canvas
    canvasOne = document.getElementById('canvas'); 
    canvasOne.addEventListener('click',select,false); // event handling
    makeDeck(); // create deck
    shuffle(); // shuffle deck
    ctx.font = 'bold 25pt sans-serif';
    ctx.fillStyle = 'red';
    ctx.fillText('Please select two Pokémon cards to make a match.',218,55);
    startTime = new Date();
    startTime = Number(startTime.getTime());
}

