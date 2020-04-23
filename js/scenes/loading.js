function Loading() {

    let loadAni;

    this.enter = function() {
        // loading animation
        loadAni = new LoadingAnimation(30, 10, "#0f0");

        // đóng menu để load
        menuWhenDie("close");

        if (!checkImages()) {
            // chieu thuc
            images.rocket = loadImage('images/rocket2.png');
            images.locxoay = loadImage('images/locXoay.png');
            images.troiAnhSang = loadImage('images/troiAnhSang.png');
            images.banTay = loadImage('images/bantay.png');

            // nhan vat
            images.yasuo = loadImage('images/character/yasuo.png');
            images.jinx = loadImage('images/character/jinx.png');
            images.blitzcrank = loadImage('images/character/blitzcrank.png');
            images.lux = loadImage('images/character/lux.png');

            // tree
            images.tree = loadImage('images/objects/tree.png');
        }
    }

    this.draw = function() {
    	background(20);

        if (!checkImages()) {    
            loadAni.run();

        } else {
            menuWhenDie('open');

            // play review
            newGame();
            viewport.target = AI_Players[~~random(0, AI_Players.length)];
        }
    }

    function checkImages() {
        return (images.rocket &&
            images.locxoay &&
            images.troiAnhSang &&
            images.yasuo &&
            images.jinx &&
            images.banTay &&
            images.blitzcrank &&
            images.lux);
    }

}

class LoadingAnimation {
    constructor(_r, _strkW, _color) {
        this.strW = _strkW;
        this.radius = _r;
        this.color = _color;
        this.angle = 0;
    }

    run() {
        noFill();

        // vòng xám
        stroke(0, 100);
        ellipse(width * .5, height * .5, this.radius * 2);

        // nửa vòng màu 
        strokeWeight(this.strW);
        stroke(this.color);
        arc(width * .5, height * .5, this.radius * 2, this.radius * 2, this.angle - HALF_PI, this.angle);

        // chữ
        noStroke();
        fill("#bbb9");
        text("LOADING", width * .5, height * .5 + this.radius + 25)

        this.angle += .1;
    }
}