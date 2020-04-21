class GameMap {
    constructor(_w, _h, _gridSize) {
        this.width = _w;
        this.height = _h;
        this.gridSize = _gridSize || 300;
    }

    run() {
        this.drawEdge();
        this.drawGrid();
    }

    drawEdge() { // Vẽ biên
        // dùng 4 đỉnh đê vẽ hình chữ nhât
        let topleft = createVector(0, 0); // đỉnh trên trái
        let topright = createVector(this.width, 0); // đỉnh trên phải
        let botleft = createVector(0, this.height); // đỉnh dưới trái
        let botright = createVector(this.width, this.height); // đỉnh dưới phải

        stroke(255);
        strokeWeight(3);

        // Ve duong thang qua cac dinh
        line(topleft.x, topleft.y, topright.x, topright.y);
        line(topright.x, topright.y, botright.x, botright.y);
        line(botright.x, botright.y, botleft.x, botright.y);
        line(botleft.x, botleft.y, topleft.x, topleft.y);
    }

    drawGrid() {
        stroke(50, 70);
        strokeWeight(3);
        let delta = 1;

        for (let x = viewport.position.x - width / 2; x < viewport.position.x + width / 2; x += delta) {
            if (floor(x) % this.gridSize == 0) {
                /* while you find 1 x%this.gridSize==0 
                => delta will equal this.gridSize => shorter loop */
                delta = this.gridSize;
                line(x, viewport.position.y - height / 2, x, viewport.position.y + height / 2);
            }
        }

        // do the same thing to y axis
        delta = 1;
        for (let y = viewport.position.y - height / 2; y < viewport.position.y + height / 2; y += delta) {
            if (floor(y) % this.gridSize == 0) {
                delta = this.gridSize;
                line(viewport.position.x - width / 2, y, viewport.position.x + width / 2, y);
            }
        }
    }
}

class ViewPort {
    constructor(_target) {
        this.target = _target || createVector(100, 100); // vật thể mà viewport này theo dõi
        this.position = _target.position.copy() || createVector(100, 100); // vị trí
        this.follow = true; // theo dõi

        this.borderSize = 25;
    }

    changeTarget(_newTarget) {
        this.target = _newTarget;
    }

    convert(_x, _y) {
        let newX = _x + this.position.x - width * .5;
        let newY = _y + this.position.y - height * .5;
        return createVector(newX, newY);
    }

    run() {
        translate(-this.position.x + width * .5, -this.position.y + height * .5);

        if (this.follow) {
            this.position = p5.Vector.lerp(this.position, this.target.position, 0.1);

        } else if (mouseX > width - this.borderSize || mouseX < this.borderSize ||
            mouseY > height - this.borderSize || mouseY < this.borderSize) {

            let vec = createVector(mouseX - width / 2, mouseY - height / 2).setMag(30);
            this.position.add(vec);

            noStroke();
            fill(200, 20);

            let r = this.borderSize;
            if (mouseY < r) rect(width / 2, r / 2, width, r); // top
            if (mouseY > height - r) rect(width / 2, height - r / 2, width, r); // down
            if (mouseX < r) rect(r / 2, height / 2, this.borderSize, height); // left
            if (mouseX > width - r) rect(width - r / 2, height / 2, r, height); // right
        }
    }
}