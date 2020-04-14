class Character {
    constructor(_name, _image, _x, _y, _r, _speed, _isEnemy) {
        this.name = _name;
        this.image = _image;
        this.position = createVector(_x, _y); // tọa độ nhân vật
        this.radius = _r; // bán kính vẽ nhân vật
        this.maxHealth = 100;
        this.health = 100; // lượng máu
        this.isEnermy = _isEnemy;
        this.color = (_isEnemy ? "#f00c" : "#0f0c"); // là kẻ địch thì màu đỏ, ngược lại là xanh
        this.bgColor = "#0000";

        this.speed = _speed; // vận tốc di chuyển
        this.targetMove = createVector(random(width), random(height)); // tọa độ cần tới (khi ấn chuột trên bản đồ)
        this.targetRadius = 25; // độ lớn khi hiển thị targetMove
        this.died = false; // chết hay chưa :v

        // các hiệu ứng trên character
        this.effects = {
            biLamCham: false, // bị làm chậm
            biTroi: false, // bị trói
            biHatTung: false, // bị hất tung
            biCamLang: false, // bị câm lặng
            biKeo: false, // bị kéo
            biMatMau: false // bị mất máu
        }
    }

    run() { // hàm chạy chính (ở main chỉ gọi hàm này)
        if (!this.died) {
            if (!this.isEnermy || hacked)
                this.showTargetMove();
            this.move();
            this.collideEdge();
            this.showHealth();
            this.showState();
        }
        this.show();
    }

    collideEdge() {
        if(this.position.x < this.radius) {
            this.position.x = this.radius
        }
        if(this.position.x > gamemap.width - this.radius) {
            this.position.x = gamemap.width - this.radius
        }
        if(this.position.y < this.radius) {
            this.position.y = this.radius
        }
        if(this.position.y > gamemap.height - this.radius) {
            this.position.y = gamemap.height - this.radius
        }
    }

    // ================= Các hàm gọi chiêu thức =============
    coTheDungChieu() {
        return !(this.died || this.effects.biHatTung || this.effects.biCamLang || this.effects.biKeo);
    }

    Q() {
        if (this.coTheDungChieu() && this.Qabi) {
            this.Qabi.active();
        }
    }

    W() {
        if (this.coTheDungChieu() && this.Wabi) {
            this.Wabi.active();
        }
    }

    E() {
        if (this.coTheDungChieu() && this.Eabi) {
            this.Eabi.active();
        }
    }

    R() {
        if (this.coTheDungChieu() && this.Rabi) {
            this.Rabi.active();
        }
    }

    // ================= Các hàm hành đông ====================
    loseHealth(damage) {
        if (this.health >= damage) {
            this.health -= damage;
            this.matMau(damage, 700);

        } else {
            this.health = 0;
            this.died = true;
            this.color = "#555"; // Mất màu :v
            this.bgColor = "#555a";
            checkNewGame(); // hàm bên functions.js
        }
    }

    move() { // hàm di chuyển
        if (this.targetMove && !this.effects.biTroi && !this.effects.biHatTung && !this.effects.biKeo) {
            // khoảng cách so với điểm cần tới
            var distance = p5.Vector.dist(this.targetMove, this.position);
            if (distance > max(5, this.speed)) {
                // tạo vector chỉ theo hướng cần tới
                var sub = p5.Vector.sub(this.targetMove, this.position);
                // thu nhỏ vector trên lại với độ dài = speed (hoặc bị làm chậm)
                var step = sub.setMag((this.effects.biLamCham ? (this.speed * (1 - this.effects.biLamCham)) : this.speed));
                // di chuyển theo vector sau khi thu nhỏ
                this.position.add(step);

            } else {
                this.targetMove = null; // xóa dữ liệu tọa độ khi nhân vật đã tới nơi

                if (this.autoMove) {
                    var x = random(this.radius * 2, gamemap.width - this.radius * 2);
                    var y = random(this.radius * 2, gamemap.height - this.radius * 2);
                    this.setTargetMove(x, y); // test tự động di chuyển
                }
            }

        } else if (this.effects.biKeo) {
            // đi theo tay kéo
            this.position = this.effects.biKeo.position.copy();

            // nếu tay kéo kết thúc thì kết thúc
            if (this.effects.biKeo.finished) {
                this.effects.biKeo = false;
            }
        }
    }

    setTargetMove(x, y) { // hàm set tọa độ cần tới
        this.targetMove = createVector(x, y);
        this.targetRadius = 25; // reset độ lớn
    }

    matMau(value, time) {
        this.effects.biMatMau = value;

        var effects = this.effects;
        setTimeout(function() {
            effects.biMatMau = false;
        }, time);
    }

    camLang(time) {
        if (!this.effects.biCamLang) {
            // time ở dạng mili giây
            this.effects.biCamLang = time; 

        } else {
            // dùng cho trùng lặp
            clearTimeout(this.effects.indexCamLang);
        }

        var effects = this.effects;
        this.effects.indexCamLang = setTimeout(function() { // setTimeOut .... khá rắc rối
            effects.biCamLang = false;
        }, time);
    }

    troi(time) {
        if (!this.effects.biTroi) {
            // time ở dạng mili giây
            this.effects.biTroi = time; 

        } else {
            // dùng cho trùng lặp
            clearTimeout(this.effects.indexTroi);
        }

        var effects = this.effects;
        this.effects.indexTroi = setTimeout(function() { // setTimeOut .... khá rắc rối
            effects.biTroi = false;
        }, time);
    }

    lamCham(percent, time) {
        if (!this.effects.biLamCham) {
            // time ở dạng mili giây
            this.effects.biLamCham = percent; 

        } else {
            // dùng cho trùng lặp
            clearTimeout(this.effects.indexLamCham);
        }

        var effects = this.effects;
        this.effects.indexLamCham = setTimeout(function() { // setTimeOut .... khá rắc rối
            effects.biLamCham = false;
        }, time);
    }

    hatTung(time) {
        if (!this.effects.biHatTung) {
            // time ở dạng mili giây
            this.effects.biHatTung = time;
            this.effects.thoiGianBatDau_HatTung = millis();
            this.effects.radiusHatTung = this.radius; // độ lớn khi vẽ vật thể bị hất tung
            this.effects.radiusHatTung_Max = this.radius * 1.5;

        } else {
            // dùng cho trùng lặp hất tung (hất tung khi vẫn đang trên không)
            clearTimeout(this.effects.indexHatTung);
            this.effects.thoiGianBatDau_HatTung = millis();
        }

        var effects = this.effects;
        this.effects.indexHatTung = setTimeout(function() { // setTimeOut .... khá rắc rối
            effects.biHatTung = false;
        }, time);
    }

    keo(target) { // target ở đây chính là bàn tay hỏa tiễn
        this.effects.biKeo = target;
    }

    // ===================== Các hàm hiển thị ====================
    show() { // hàm hiển thị
        var radius = this.radius;

        // hiển thị hiệu ứng hất tung
        if (this.effects.biHatTung) {

            // có 2 giai đoạn : bay lên và hạ xuống , mỗi giai đoạn chiếm 1/2 thời gian hất tung
            if (millis() - this.effects.thoiGianBatDau_HatTung < this.effects.biHatTung / 2) {

                if (this.effects.radiusHatTung < this.effects.radiusHatTung_Max) {
                    this.effects.radiusHatTung++; // đang bay lên => radius to dần
                }

            } else if (this.effects.radiusHatTung > this.radius) {
                this.effects.radiusHatTung--; // đang bay xuống => radius nhỏ dần
            }

            radius = this.effects.radiusHatTung;
        }

        image(this.image, this.position.x, this.position.y, radius * 2, radius * 2);

        // vẽ
        push();
        translate(this.position.x, this.position.y); // di chuyển bút vẽ tới vị trí nhân vật
        rotate(this.getDirectionMouse()); // xoay 1 góc theo hướng nhìn của chuột

        fill(this.bgColor);
        stroke(this.getColorBaseState());
        strokeWeight(5);
        ellipse(0, 0, radius * 2); // vẽ thân

        if (!this.died) {
            // fill(255);
            stroke(255)
            strokeWeight(1);
            line(0, 0, radius, 0); // vẽ hướng    
        }

        pop(); // trả lại bút vẽ về như cũ

        // khi bị câm lặng thì hiện dấu gạch chéo
        if (this.effects.biCamLang) {
            stroke("#555b");
            strokeWeight(10);

            var x = this.position.x;
            var y = this.position.y;
            var r = radius * .7;

            if (random(1) > .9) {
                var x = this.position.x + random(-this.radius, this.radius);
                var y = this.position.y + random(-this.radius, this.radius);
                objects.push(new Smoke(x, y, random(100, 200), random(10, 30)));
            }

            // vẽ chữ x xám
            line(x - r, y - r, x + r, y + r);
            line(x + r, y - r, x - r, y + r);
        }

        // hiệu ứng mất máu
        if (this.effects.biMatMau) {
            strokeWeight(2);
            stroke("#f00");
            fill("#f00");
            text("- " + floor(this.effects.biMatMau), this.position.x, this.position.y - this.radius * 2.5);
        }
    }

    showState() { // hiển thị các hiệu ứng hiện có
        var info = "";
        // bị kéo có tầm quan trọng cao nhất
        // do hiệu ứng kéo sẽ đè lên mọi hiệu ứng khác
        // do đó cần để chuỗi Kéo ở đầu
        if (this.effects.biKeo) info = "Kéo";
        if (this.effects.biCamLang) info += (info == "" ? "" : " - ") + "Câm lặng";
        if (this.effects.biHatTung) info += (info == "" ? "" : " - ") + "Hất tung";
        if (this.effects.biTroi) info += (info == "" ? "" : " - ") + "Trói";
        if (this.effects.biLamCham) info += (info == "" ? "" : " - ") + "Chậm";

        if (info != "") {
            fill("#99f");
            noStroke();
            text(info, this.position.x, this.position.y - this.radius - 30);
        }
    }

    getColorBaseState() { // lấy màu theo hiệu ứng hiện có
        if (this.effects.biKeo) return "#97a";
        if (this.effects.biCamLang) return "#555";
        if (this.effects.biHatTung) return "#ff0";
        if (this.effects.biTroi) return "#fff";
        if (this.effects.biLamCham) return "#00f";
        return this.color;
    }

    showHealth() {
        // các giá trị mặc định
        var healthWidth = 150;
        var healthHeight = 20;
        var bgHealth = "#5555";

        rectMode(CORNER); // chuyển về corner mode cho dễ vẽ
        // vẽ
        fill(bgHealth);
        noStroke();
        strokeWeight(1);
        rect(this.position.x - healthWidth * .5,
            this.position.y + this.radius + 10,
            healthWidth,
            healthHeight
        );

        fill(this.isEnermy ? "#f005" : "#0f05");
        noStroke();
        rect(this.position.x - healthWidth * .5,
            this.position.y + this.radius + 10,
            map(this.health, 0, this.maxHealth, 0, healthWidth), // tính độ dài thanh máu
            healthHeight
        );
        rectMode(CENTER); // reset mode


        noStroke();
        textSize(17);

        // show health value
        fill(0, 200);
        text(floor(this.health), this.position.x, this.position.y + this.radius + healthHeight);
        // show name
        fill(200, 80);
        text(this.name, this.position.x, this.position.y - this.radius - 10);
    }

    showTargetMove() { // hiển thị điểm cần tới
        if (this.targetMove) {
            if (this.targetRadius >= 5)
                this.targetRadius -= 1.5;

            strokeWeight(1);
            fill(this.color);
            ellipse(this.targetMove.x, this.targetMove.y, this.targetRadius * 2);

            if (hacked) {
                stroke(this.color);
                line(this.position.x, this.position.y, this.targetMove.x, this.targetMove.y);
            }
        }
    }

    // =================== Các hàm tính và lấy giá trị ================
    getDirectionMouse() { // hàm lấy hướng nhìn của nhân vật dạng góc
        // dùng hàm heading để lấy giá trị góc radian
        return this.getDirectionMouse_Vector().heading();
    }

    getDirectionMouse_Vector() { // hàm lấy hướng nhìn của nhân vật dạng vector
        // tạo vector tọa độ chuột
        var mouse = viewport.convert(mouseX, mouseY);
        // tạo vector chỉ hướng từ nhân vật tới chuột
        var vecToMouse = p5.Vector.sub(mouse, this.position);
        return vecToMouse;
    }

    getPosition() {
        return this.position.copy();
    }
}

//==================== Characters ======================

class Yasuo extends Character {
    constructor(_name, _x, _y, _isEnemy) {
        var image = images.yasuo;
        var radius = 30;
        var speed = 4;
        super(_name, image, _x, _y, radius, speed, _isEnemy);

        this.Qabi = new Q_Yasuo(this);
        this.Wabi = null; //new Q_Blit(this);
        this.Eabi = null; //new Q_Lux(this);
        this.Rabi = null; //new R_Jinx(this);
    }
}

class Jinx extends Character {
    constructor(_name, _x, _y, _isEnemy) {
        var image = images.jinx;
        var radius = 30;
        var speed = 4;
        super(_name, image, _x, _y, radius, speed, _isEnemy);

        this.Qabi = null; //new Q_Yasuo(this);
        this.Wabi = new W_Jinx(this);
        this.Eabi = null; //new Q_Blit(this);
        this.Rabi = new R_Jinx(this);
    }
}

class Blitzcrank extends Character {
    constructor(_name, _x, _y, _isEnemy) {
        var image = images.blitzcrank;
        var radius = 30;
        var speed = 5;
        super(_name, image, _x, _y, radius, speed, _isEnemy);

        this.Qabi = new Q_Blit(this);
        this.Wabi = null; //new W_Jinx(this);
        this.Eabi = null; //new Q_Yasuo(this);
        this.Rabi = null; //new R_Jinx(this);
    }
}

class Lux extends Character {
    constructor(_name, _x, _y, _isEnemy) {
        var image = images.lux;
        var radius = 30;
        var speed = 4.2;
        super(_name, image, _x, _y, radius, speed, _isEnemy);

        this.Qabi = new Q_Lux(this); //new Q_Blit(this);
        this.Wabi = null; //new W_Jinx(this);
        this.Eabi = null; //new Q_Yasuo(this);
        this.Rabi = null; //new R_Jinx(this);
    }
}

class Yasuo_tt7 extends Character {
    constructor(_name, _x, _y, _isEnemy) {
        var image = images.yasuo;
        var radius = 30;
        var speed = 4.2;
        super(_name, image, _x, _y, radius, speed, _isEnemy);

        this.Qabi = new Q_Lux(this); 
        this.Wabi = new Q_Yasuo(this);
        this.Eabi = new Q_Blit(this);
        this.Rabi = new R_Jinx(this); 
    }
}

// =============== AI Character ==================
class AutoYasuo extends Yasuo {
    constructor(_name, _x, _y) {
        super((_name || "Yasuo Máy"), _x, _y, true);
        this.autoMove = true;
    }
}

class AutoJinx extends Jinx {
    constructor(_name, _x, _y) {
        super((_name || "Jinx Máy"), _x, _y, true);
        this.autoMove = true;
    }
}

class AutoBlitzcrank extends Blitzcrank {
    constructor(_name, _x, _y) {
        super((_name || "Blitzcrank Máy"), _x, _y, true);
        this.autoMove = true;
    }
}

class AutoLux extends Lux {
    constructor(_name, _x, _y) {
        super((_name || "Lux Máy"), _x, _y, true);
        this.autoMove = true;
    }
}