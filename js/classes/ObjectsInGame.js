// Vật thể di chuyển được (đạn của jinx, lốc của ys, ..)
class Moveable_Ability_Object {
    constructor(_owner, _data) {
        this.owner = _owner; // chủ nhân của vật thể này (character)
        this.position = _data.position; // tọa độ bắt đầu (dạng vector)
        this.speed = _data.speed; // vận tốc
        this.image = _data.image; // hình ảnh hiển thị

        // hướng di chuyển (dạng vector, không phải dạng góc)
        // setMag để đưa độ dài direction về đúng = độ lớn vận tốc
        this.direction = _data.direction.setMag(this.speed);
        this.travelDistance = 0; // quãng đường đã đi được

        this.range = _data.range; // phạm vi chiêu thức - khoảng cách xa nhất có thể bay tới (tính bằng pixels)
        this.radius = _data.radius; // bán kính vùng ảnh hưởng sát thương (hình tròn)
        this.damage = _data.damage; // sát thương gây ra khi trúnh mục tiêu

        // phần hack (nhìn thấy đường đi)
        this.targetMove = this.position.copy().add(this.direction.copy().setMag(this.range));

        this.finished = false; // = true nếu vật này đã được remove khỏi mảng
    }

    run() {
        this.move();
        if (hackerMode) {
            this.showPath();
        }

        this.show();
    }

    move() {
        // di chuyển theo hướng direction với vận tốc speed
        this.position.add(this.direction);
        this.travelDistance += this.speed;
    }

    show() {
        push();
        translate(this.position.x, this.position.y); // đưa bút vẽ tới vị trí vật thể
        rotate(this.direction.heading()); // xoay theo hướng bay

        image(this.image, 0, 0, this.radius * 2, this.radius * 2);

        pop(); // trả bút vẽ về vị trí mặc định
    }

    showPath() { //hiển thị đường đi của vật thể (như hack lmht)
        stroke(map(this.range - this.travelDistance, 0, this.range, 255, 50), 50);
        strokeWeight(this.radius * 2);
        line(this.position.x, this.position.y, this.targetMove.x, this.targetMove.y);
        strokeWeight(1);
    }

    isFinished() {
        return this.travelDistance >= this.range;
    }

    checkCharacter(c) {
        return !c.died && c != this.owner;
    }
}

// ===================================
class BaoKiem_Yasuo extends Moveable_Ability_Object {
    constructor(_owner, _data) {
        _data.image = images.locxoay; // thêm thuộc tính image cho dữ liệu (kiểu ocject {}) _data
        super(_owner, _data);

        this.charactersEffected = []; // lưu những tướng đã dính damage của chiêu này
        // do chiêu này xuyên qua tướng, nếu ko có mảng duyệt, tướng sẽ bị trừ máu ... đến chết :v
    }

    show() {
        this.radius += .7; // độ lớn lốc tăng dần
        this.damage += frameRate() / 240; // càng bay lâu damage càng cao

        push();
        translate(this.position.x, this.position.y); // đưa bút vẽ tới vị trí vật thể
        rotate(frameCount / 5); // xoáy

        // var tintValue = map(this.travelDistance, 0, this.range, 0, 255);
        // tint(255, 255 - tintValue);
        // tint(this.range, this.range - this.travelDistance);
        image(this.image, 0, 0, this.radius * 2, this.radius * 2);

        pop(); // trả bút vẽ về vị trí mặc định
    }

    effect(c) {
        if (this.checkCharacter(c)) {
            if (this.charactersEffected.indexOf(c) < 0) { // nếu chưa có thì mới trừ máu
                c.loseHealth(this);
                c.hatTung(500);
                this.charactersEffected.push(c); // cho vào mảng để ko bị trừ nữa
            }
        }
    }
}

class BoomSieuKhungKhiep_Jinx extends Moveable_Ability_Object {
    constructor(_owner, _data) {
        _data.image = images.rocket;
        super(_owner, _data);
    }

    show() {
        super.show();
        this.damage += frameRate() / 120; // bom của jinx càng bay lâu damage càng cao

        if (random(1) > .5) { // nhả khói
            objects.push(new Smoke(this.position.x, this.position.y, 200, 20));
        }
    }

    effect(c) {
        if (this.checkCharacter(c)) {
            c.loseHealth(this);
            c.lamCham(.4, 1000);

            // hiệu ứng nổ khói
            for (var i = 0; i < 10; i++) {
                objects.push(new Smoke(this.position.x + random(-50, 50),
                    this.position.y + random(-50, 50),
                    random(100, 500), random(20, 70)));
            }

            // finish sau khi nổ
            this.travelDistance = this.range;
        }
    }
}

class SungDien_Jinx extends Moveable_Ability_Object {
    constructor(_owner, _data) {
        _data.image = null;
        super(_owner, _data);
    }

    show() {
        // super.showWay();

        push();
        translate(this.position.x, this.position.y); // đưa bút vẽ tới vị trí vật thể
        fill("#fff");
        ellipse(0, 0, this.radius * 2);
        pop(); // trả bút vẽ về vị trí mặc định

        if (random(1) > .7) { // nhả khói
            objects.push(new Smoke(this.position.x, this.position.y, 150, 10));
        }
    }

    effect(c) {
        if (this.checkCharacter(c)) {
            c.loseHealth(this);
            c.lamCham(.5, 700);
            c.camLang(1500);

            // hiệu ứng nổ khói
            for (var i = 0; i < 2; i++) {
                objects.push(new Smoke(this.position.x + random(-5, 5),
                    this.position.y + random(-5, 5),
                    random(100, 500), random(20, 40)));
            }

            // finish sau khi nổ
            this.travelDistance = this.range;
        }
    }
}

class TroiAnhSanh_Lux extends Moveable_Ability_Object {
    constructor(_owner, _data) {
        _data.image = images.troiAnhSang;
        super(_owner, _data);

        this.charactersEffected = []; // tương tự bão kiếm của ys
    }

    effect(c) {
        if (this.checkCharacter(c)) {
            if (this.charactersEffected.indexOf(c) < 0) { // nếu chưa có thì mới trừ máu
                c.loseHealth(this);
                c.troi(1500); // trói 
                this.charactersEffected.push(c); // cho vào mảng để ko bị trừ nữa
            }
        }
    }
}

class BanTayHoaTien_Blit extends Moveable_Ability_Object {
    constructor(_owner, _data) {
        _data.image = images.banTay;
        super(_owner, _data);

        this.charactersEffected = []; // lưu những tướng đã dính damage của chiêu này
        this.fromPos = this.owner.position; // vị trí ban đầu
        this.state = "go"; // trạng thái : bay tới hay bay về

        this.owner.troi(500);
    }

    show() {
        super.show();
        this.damage += frameRate() / 120;

        stroke(200, 100);
        strokeWeight(2);
        line(this.fromPos.x, this.fromPos.y, this.position.x, this.position.y);
    }

    effect(c) {
        if (this.checkCharacter(c)) {
            if (this.charactersEffected.length <= 0) { // chỉ kéo được 1 đứa
                c.loseHealth(this);
                c.keo(this);

                this.charactersEffected.push(c);
                this.state = "back"; // va chạm với kẻ địch thì kéo về
            }
        }
    }

    move() {
        if (this.state == "go") {
            this.position.add(this.direction); // bay tới

            if (this.travelDistance >= this.range) {
                this.state = "back"; // bay hết tầm thì về
            }

        } else {
            // vector hướng từ vị trí hiện tại về chủ nhân
            // độ lớn vector = 1.5 * speed => bay về nhanh hơn 1.5 lần vận tốc mặc định
            var direc2 = p5.Vector.sub(this.position, this.fromPos).setMag(this.speed * 1.5);
            this.position.sub(direc2); // bay về chủ nhân theo hướng đã tính được
        }

        this.travelDistance += this.speed;
    }

    isFinished() {
        // kết thúc xảy ra ở 2 trường hợp
        // 1. không kéo được ai và bay hết tầm
        // 2. kéo được tướng và về tới nơi
        var truongHop1 = (this.state == "go" && this.charactersEffected.length == 0 && this.travelDistance >= this.range);
        var truongHop2 = (this.state == "back" && p5.Vector.dist(this.fromPos, this.position) < this.owner.radius * 2);
        return (truongHop1 || truongHop2);
    }
}

// =============================== Vat the dung im ======================
class Stable_Ability_Object {

}

class Tree {
    constructor(x, y, r) {
        this.position = createVector(x, y);
        this.radius = r;
    }

    show() {
        image(images.tree, this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    }
}