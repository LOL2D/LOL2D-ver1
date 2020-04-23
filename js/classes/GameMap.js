class GameMap {
  constructor(_w, _h, _gridSize) {
    this.width = _w;
    this.height = _h;
    this.gridSize = _gridSize || 300;

    this.objects = [];
  }

  run() {
    this.drawEdge();
    this.drawGrid();
  }

  addRandomObject(obj, num) {
    for (let i = 0; i < num; i++) {
      this.objects.push(
        new obj(random(this.width), random(this.height), random(70, 200))
      );
    }
  }

  drawObjects() {
    for (let o of this.objects) {
      o.show();
    }
  }

  drawEdge() {
    // Vẽ biên
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
    stroke(100, 70);
    strokeWeight(3);
    let delta = 1;

    let { x: left, y: top } = viewport.convert(0, 0);
    let { x: right, y: bottom } = viewport.convert(width, height);

    for (let x = left; x < right; x += delta) {
      if (floor(x) % this.gridSize == 0) {
        /* while you find 1 x%this.gridSize==0 
                => delta will equal this.gridSize => shorter loop */
        delta = this.gridSize;
        line(x, top, x, bottom);
      }
    }

    // do the same thing to y axis
    delta = 1;
    for (let y = top; y < bottom; y += delta) {
      if (floor(y) % this.gridSize == 0) {
        delta = this.gridSize;
        line(left, y, right, y);
      }
    }
  }
}

class ViewPort {
  constructor(_target) {
    this.target = _target || createVector(100, 100); // vật thể mà viewport này theo dõi
    this.position = _target.position.copy() || createVector(100, 100); // vị trí
    this.follow = true; // theo dõi
    this.scale = 0.1;
    this.scaleTo = 0.8;

    this.borderSize = 25;
  }

  changeTarget(_newTarget) {
    this.target = _newTarget;
  }

  convert(_x, _y) {
    let newX = (_x - width * 0.5) / this.scale + this.position.x;
    let newY = (_y - height * 0.5) / this.scale + this.position.y;
    return createVector(newX, newY);
  }

  beginState() {
    push();
    translate(width * 0.5, height * 0.5);
    scale(this.scale);
    translate(-this.position.x, -this.position.y);

    // update Scale
    this.scale = lerp(this.scale, this.scaleTo, 0.07);

    if (this.follow) {
      this.position = p5.Vector.lerp(this.position, this.target.position, 0.1);
    } else if (
      mouseX > width - this.borderSize ||
      mouseX < this.borderSize ||
      mouseY > height - this.borderSize ||
      mouseY < this.borderSize
    ) {
      let vec = createVector(mouseX - width / 2, mouseY - height / 2).setMag(
        30
      );
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

  endState() {
    pop();
  }
}
