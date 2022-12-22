import {ISwipeObject} from './Swipe';

interface TouchedPointObject {
    x: number;
    time: number;
}

const enum Constants {
    MinScrollSpeed = 0.2,
    MaxScrollSpeed = 10,
    DumpingCoeff = 0.997,
    ScrollMinMove = 15,
    MaxStartDelay = 50,
    EpsilonDistance = 1,
}

export class SwipeAnimation {

   // Last 4 X and time touched in (Touch Move) .
    private touchedPoints: TouchedPointObject[] = [];

    private animationStartPoint_x_time: TouchedPointObject | null = null;
    private durationMsecs: number = 0;
    private speedMsec: number = 0;

    private terminated: boolean = false;
    private prevSwipedX: number = 0;


    public constructor() {
        this.touchedPoints[0] = null;
        this.touchedPoints[1] = null;
        this.touchedPoints[2] = null;
        this.touchedPoints[3] = null;
    }

    public addTouchedPoint(x: number, time: number): void {
        if (this.touchedPoints[0] !== null) {
            if (this.touchedPoints[0].time === time) {
                this.touchedPoints[0].x = x;
                return;
            }

            if (Math.abs(this.touchedPoints[0].x - x) < Constants.ScrollMinMove) {
                return;
            }
        }

        this.touchedPoints[3] = this.touchedPoints[2];
        this.touchedPoints[2] = this.touchedPoints[1];
        this.touchedPoints[1] = this.touchedPoints[0];
        this.touchedPoints[0] = {x ,time};
    }

    public start(x: number, time: number): void {
        if (this.touchedPoints[0] === null || this.touchedPoints[1] === null) {
            return;
        }

        if (time - this.touchedPoints[0].time > Constants.MaxStartDelay) {
            return;
        }

        let totalDistance = 0;
        let speed1 = this.speedPxInMSec(this.touchedPoints[0], this.touchedPoints[1], Constants.MaxScrollSpeed);
        let distance1 = this.distanceBetweenPoints(this.touchedPoints[0], this.touchedPoints[1]);

        let speedItems = [speed1];
        let distanceItems = [distance1];
        totalDistance += distance1;

        if (this.touchedPoints[2] !== null) {
            let speed2 = this.speedPxInMSec(this.touchedPoints[1], this.touchedPoints[2], Constants.MaxScrollSpeed);
            if (Math.sign(speed2) === Math.sign(speed1)) {
                let distance2 = this.distanceBetweenPoints(this.touchedPoints[1], this.touchedPoints[2]);

                speedItems.push(speed2);
                distanceItems.push(distance2);
                totalDistance += distance2;

                if (this.touchedPoints[3] !== null) {
                    let speed3 = this.speedPxInMSec(this.touchedPoints[2], this.touchedPoints[3], Constants.MaxScrollSpeed);
                    if (Math.sign(speed3) === Math.sign(speed1)) {
                        let distance3 = this.distanceBetweenPoints(this.touchedPoints[2],this.touchedPoints[3]);

                        speedItems.push(speed3);
                        distanceItems.push(distance3);
                        totalDistance += distance3;
                    }
                }
            }
        }

        let resultSpeed = 0;
        for (let i = 0; i < speedItems.length; ++i) {
            resultSpeed += distanceItems[i] / totalDistance * speedItems[i];
        }

        if (Math.abs(resultSpeed) < Constants.MinScrollSpeed) {
            return;
        }

        this.animationStartPoint_x_time = {x ,time};
        this.speedMsec = resultSpeed;
        this.durationMsecs = this.durationInMSec(Math.abs(resultSpeed), Constants.DumpingCoeff);
    }


    private speedPxInMSec(touchedPoint1: TouchedPointObject, touchedPoint2: TouchedPointObject, maxSpeed: number): number {
        let speed = (touchedPoint1.x - touchedPoint2.x) / (touchedPoint1.time - touchedPoint2.time);
        return Math.sign(speed) * Math.min(Math.abs(speed), maxSpeed);
    }

    private distanceBetweenPoints(touchedPoint1: TouchedPointObject, touchedPoint2: TouchedPointObject): number {
        return touchedPoint1.x - touchedPoint2.x;
    }

    public getSwipedData(time: number): ISwipeObject {
        if (this.animationStartPoint_x_time !== null) {
            let durationMsecs = time - this.animationStartPoint_x_time.time;
            let newX = this.animationStartPoint_x_time.x + this.speedMsec * (Math.pow(Constants.DumpingCoeff, durationMsecs) - 1) / (Math.log(Constants.DumpingCoeff));
            if (this.prevSwipedX == 0) {
                this.prevSwipedX = this.animationStartPoint_x_time.x;
            }
            let pixels = newX - this.prevSwipedX;
            this.prevSwipedX = newX;

            return {x:newX , pixels:pixels};
        }
        return null;
    }

    private progressDuration(time: number): number {
        if (this.animationStartPoint_x_time !== null) {
            let progress = time - this.animationStartPoint_x_time.time;
            return Math.min(progress, this.durationMsecs);
        }
        return 0;
    }

    private durationInMSec(speed: number, dumpingCoeff: number): number {
        let lnDumpingCoeff = Math.log(dumpingCoeff);
        return Math.log((Constants.EpsilonDistance * lnDumpingCoeff) / -speed) / (lnDumpingCoeff);
    }

    public isTerminated(): boolean {
        return this.terminated;
    }

    public terminate(): void {
        this.terminated = true;
    }

    public finished(time: number): boolean {
        return this.animationStartPoint_x_time === null || this.progressDuration(time) === this.durationMsecs;
    }

}
