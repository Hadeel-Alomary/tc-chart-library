var SwipeAnimation = (function () {
    function SwipeAnimation() {
        this.touchedPoints = [];
        this.animationStartPoint_x_time = null;
        this.durationMsecs = 0;
        this.speedMsec = 0;
        this.terminated = false;
        this.prevSwipedX = 0;
        this.touchedPoints[0] = null;
        this.touchedPoints[1] = null;
        this.touchedPoints[2] = null;
        this.touchedPoints[3] = null;
    }
    SwipeAnimation.prototype.addTouchedPoint = function (x, time) {
        if (this.touchedPoints[0] !== null) {
            if (this.touchedPoints[0].time === time) {
                this.touchedPoints[0].x = x;
                return;
            }
            if (Math.abs(this.touchedPoints[0].x - x) < 15) {
                return;
            }
        }
        this.touchedPoints[3] = this.touchedPoints[2];
        this.touchedPoints[2] = this.touchedPoints[1];
        this.touchedPoints[1] = this.touchedPoints[0];
        this.touchedPoints[0] = { x: x, time: time };
    };
    SwipeAnimation.prototype.start = function (x, time) {
        if (this.touchedPoints[0] === null || this.touchedPoints[1] === null) {
            return;
        }
        if (time - this.touchedPoints[0].time > 50) {
            return;
        }
        var totalDistance = 0;
        var speed1 = this.speedPxInMSec(this.touchedPoints[0], this.touchedPoints[1], 10);
        var distance1 = this.distanceBetweenPoints(this.touchedPoints[0], this.touchedPoints[1]);
        var speedItems = [speed1];
        var distanceItems = [distance1];
        totalDistance += distance1;
        if (this.touchedPoints[2] !== null) {
            var speed2 = this.speedPxInMSec(this.touchedPoints[1], this.touchedPoints[2], 10);
            if (Math.sign(speed2) === Math.sign(speed1)) {
                var distance2 = this.distanceBetweenPoints(this.touchedPoints[1], this.touchedPoints[2]);
                speedItems.push(speed2);
                distanceItems.push(distance2);
                totalDistance += distance2;
                if (this.touchedPoints[3] !== null) {
                    var speed3 = this.speedPxInMSec(this.touchedPoints[2], this.touchedPoints[3], 10);
                    if (Math.sign(speed3) === Math.sign(speed1)) {
                        var distance3 = this.distanceBetweenPoints(this.touchedPoints[2], this.touchedPoints[3]);
                        speedItems.push(speed3);
                        distanceItems.push(distance3);
                        totalDistance += distance3;
                    }
                }
            }
        }
        var resultSpeed = 0;
        for (var i = 0; i < speedItems.length; ++i) {
            resultSpeed += distanceItems[i] / totalDistance * speedItems[i];
        }
        if (Math.abs(resultSpeed) < 0.2) {
            return;
        }
        this.animationStartPoint_x_time = { x: x, time: time };
        this.speedMsec = resultSpeed;
        this.durationMsecs = this.durationInMSec(Math.abs(resultSpeed), 0.997);
    };
    SwipeAnimation.prototype.speedPxInMSec = function (touchedPoint1, touchedPoint2, maxSpeed) {
        var speed = (touchedPoint1.x - touchedPoint2.x) / (touchedPoint1.time - touchedPoint2.time);
        return Math.sign(speed) * Math.min(Math.abs(speed), maxSpeed);
    };
    SwipeAnimation.prototype.distanceBetweenPoints = function (touchedPoint1, touchedPoint2) {
        return touchedPoint1.x - touchedPoint2.x;
    };
    SwipeAnimation.prototype.getSwipedData = function (time) {
        if (this.animationStartPoint_x_time !== null) {
            var durationMsecs = time - this.animationStartPoint_x_time.time;
            var newX = this.animationStartPoint_x_time.x + this.speedMsec * (Math.pow(0.997, durationMsecs) - 1) / (Math.log(0.997));
            if (this.prevSwipedX == 0) {
                this.prevSwipedX = this.animationStartPoint_x_time.x;
            }
            var pixels = newX - this.prevSwipedX;
            this.prevSwipedX = newX;
            return { x: newX, pixels: pixels };
        }
        return null;
    };
    SwipeAnimation.prototype.progressDuration = function (time) {
        if (this.animationStartPoint_x_time !== null) {
            var progress = time - this.animationStartPoint_x_time.time;
            return Math.min(progress, this.durationMsecs);
        }
        return 0;
    };
    SwipeAnimation.prototype.durationInMSec = function (speed, dumpingCoeff) {
        var lnDumpingCoeff = Math.log(dumpingCoeff);
        return Math.log((1 * lnDumpingCoeff) / -speed) / (lnDumpingCoeff);
    };
    SwipeAnimation.prototype.isTerminated = function () {
        return this.terminated;
    };
    SwipeAnimation.prototype.terminate = function () {
        this.terminated = true;
    };
    SwipeAnimation.prototype.finished = function (time) {
        return this.animationStartPoint_x_time === null || this.progressDuration(time) === this.durationMsecs;
    };
    return SwipeAnimation;
}());
export { SwipeAnimation };
//# sourceMappingURL=SwipeAnimation.js.map