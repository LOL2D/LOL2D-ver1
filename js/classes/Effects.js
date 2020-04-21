class EffectWithTimer {
    constructor(_target, _time) {
        this.target = _character; // nhân vật chịu tác động của hiệu ứng này
        this.time = _time; // thời gian tác dụng của hiệu ứng

        this.born = millis(); // thời điểm hiệu ứng được khởi tạo
    }

    isFinished() {
        // kết thúc khi hết thời gian hiệu ứng
        // (hiện tại) - (thời điểm khởi tạo) >= (khoảng thời gian hiệu ứng)
        return millis() - this.born >= this.time;
    }
}

class HatTungEffect extends EffectWithTimer {
    constructor(_target, _time) {
        super(_target, _time);

        this.originalRadius = _target.radius; // kích thước mặc định của target
        this.maxRadius = _target.radius * 1.5; // kích thước lớn nhất mà target có thể có
    }

    run() {
        // có 2 giai đoạn : bay lên và hạ xuống , mỗi giai đoạn chiếm 1/2 thời gian hất tung
        if (millis() - this.born < this.time / 2) {
            if (this.target.radius < this.maxRadius) {
                this.target.radius++; // đang bay lên => radius to dần
            }

        } else if (this.target.radius > this.originalRadius) {
            this.target.radius--; // đang bay xuống => radius nhỏ dần
        }

        // nếu kết thúc thì trả kích cỡ về như cũ
        if(this.isFinished()) {
            this.target.radius = this.originalRadius;
        }
    }
}

class Smoke {
    constructor(x, y, life, r) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.radius = r || floor(random(10, 50));
        this.born = millis();
        this.life = life;
    }

    run() {
        this.show();
    }

    isFinished() {
        return (millis() - this.born > this.life);
    }

    show() {
        this.vel.add(random(-1, 1), random(-1, 1));
        this.pos.add(this.vel);
        this.vel.mult(0.9);

        // show 
        if (this.radius < 100)
            this.radius += random(7) * (30 / (frameRate() + 1));
        let c = map(this.life - (millis() - this.born), 0, this.life, 30, 255);
        fill(c, c * 2);
        noStroke();

        ellipse(this.pos.x, this.pos.y, this.radius * 2);
    }
}