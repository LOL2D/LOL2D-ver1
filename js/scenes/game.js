function Game() {
  this.paused;

  // hàm khởi tạo
  this.enter = function () {
    this.paused = false;
  };

  // vòng lặp game
  this.draw = function () {
    // nếu đang tạm dừng thì ko làm gì hết
    if (this.paused) return;

    // xóa màn hình
    background(20);

    // viewport di chuyển tầm nhìn hoạt động :
    viewport.beginState();

    // vẽ bản dồ
    gamemap.run();

    // vẽ và check các objects
    for (var i = objects.length - 1; i >= 0; i--) {
      objects[i].run();

      if (!(objects[i] instanceof Smoke)) {
        // không phải khói thì mới cần check
        var ox = objects[i].position.x;
        var oy = objects[i].position.y;
        var or = objects[i].radius;

        var playerPos = player.getPosition();
        if (
          collideCircleCircle(
            playerPos.x,
            playerPos.y,
            player.radius,
            ox,
            oy,
            or * 2
          )
        ) {
          objects[i].effect(player);
        }

        // duyệt qua mảng tướng máy
        for (var a of AI_Players) {
          if (!a.died) {
            var aPos = a.getPosition();
            if (collideCircleCircle(aPos.x, aPos.y, a.radius, ox, oy, or * 2)) {
              objects[i].effect(a);
            }
          }
        }
      }

      // nếu vật thể đã kết thúc -> xóa khỏi mảng
      if (objects[i].isFinished()) {
        objects[i].finished = true;
        objects.splice(i, 1);
      }
    }

    if (mouseIsPressed) {
      // đổi vị trí mouse về đúng tầm nhìn của viewport
      var convertedPos = viewport.convert(mouseX, mouseY);
      player.setTargetMove(convertedPos.x, convertedPos.y);
    }

    // vẽ nhân vật
    player.run();
    showPreviewAbilityWay();

    // info nhan vat
    // let pip = viewport.convert(width / 2, height - 90);
    // player.showInfo(pip.x, pip.y, 80);

    // auto play
    for (var a of AI_Players) {
      a.run();

      if (autoFire && random(1) > 0.95) {
        var rand = random(10);

        if (rand < 2.5) a.Q();
        else if (rand < 5) a.W();
        else if (rand < 7.5) a.E();
        else a.R();
      }
    }

    // trees
    gamemap.drawObjects();

    viewport.endState();

    // show list players
    let x = 30,
      y = 60;
    for (var a of AI_Players) {
      a.showInfo(x, y, 40);
      y += 60;
    }

    // Hiện frameRate
    fill(255);
    noStroke();
    text("fps: " + round(frameRate()), 40, 15);

    // Hiện thời gian sống
    textSize(20);
    text(
      secondsToMinutes(~~((millis() - beginMatchTime) / 1000)),
      width - 50,
      20
    );
  };

  this.keyReleased = function () {
    if (keyCode == 27) {
      // ESC
      this.paused = menuWhenDie("switch");
    }

    if (!this.paused) {
      switch (key.toUpperCase()) {
        case " ":
          viewport.follow = !viewport.follow;
          break;
        case "P":
          hackerMode = !hackerMode;
          break;
        case "O":
          autoFire = !autoFire;
          break;
      }

      if (player && !player.died) {
        switch (key.toUpperCase()) {
          case "Q":
            player.Q();
            break;
          case "W":
            player.W();
            break;
          case "E":
            player.E();
            break;
          case "R":
            player.R();
            break;
          case "D":
            break;
          case "F":
            break;
          default:
            break;
        }
      }
    }
  };

  this.mouseWheel = function (event) {
    if (event.delta > 0) {
      if (viewport.scaleTo > 0.5) viewport.scaleTo -= viewport.scaleTo / 10;
    } else {
      if (viewport.scaleTo < 1) viewport.scaleTo += viewport.scaleTo / 10;
    }
  };

  function showPreviewAbilityWay() {
    if (keyIsDown(81)) {
      player.Qabi && player.Qabi.showRange();
    } else if (keyIsDown(87)) {
      player.Wabi && player.Wabi.showRange();
    } else if (keyIsDown(69)) {
      player.Eabi && player.Eabi.showRange();
    } else if (keyIsDown(82)) {
      player.Rabi && player.Rabi.showRange();
    }
  }
}
