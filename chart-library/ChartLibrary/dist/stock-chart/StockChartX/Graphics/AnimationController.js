import { Environment } from "../Environment";
window.requestAnimationFrame =
    window.requestAnimationFrame ||
        (window).webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame;
var ANIMATION_INTERVAL = 1000 / (Environment.isMobile ? 40 : 40);
export var AnimationController;
(function (AnimationController) {
    AnimationController._animations = [];
    AnimationController._prevStartTime = Date.now();
    function hasAnimationsToRun() {
        return this._animations.length > 0;
    }
    AnimationController.hasAnimationsToRun = hasAnimationsToRun;
    function contains(animation) {
        var animations = this._animations;
        for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
            var item = animations_1[_i];
            if (item === animation)
                return true;
        }
        return false;
    }
    AnimationController.contains = contains;
    function add(animation) {
        if (this.contains(animation))
            return false;
        var isStarted = this.hasAnimationsToRun();
        this._animations.push(animation);
        if (!isStarted)
            runAnimation();
        return true;
    }
    AnimationController.add = add;
    function remove(animation) {
        var animations = this._animations;
        for (var i = 0, count = animations.length; i < count; i++) {
            if (animations[i] === animation) {
                animations.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    AnimationController.remove = remove;
})(AnimationController || (AnimationController = {}));
function runAnimation() {
    requestAnimationFrame(handleAnimationFrame);
}
function handleAnimationFrame() {
    var controller = AnimationController;
    if ((Date.now() - controller._prevStartTime) >= ANIMATION_INTERVAL) {
        controller._prevStartTime = Date.now();
        var animations = controller._animations;
        for (var i = 0; i < animations.length; i++) {
            var animation = animations[i];
            animation.handleAnimationFrame();
            if (!animation.recurring) {
                animation.stop();
                i--;
            }
        }
    }
    if (controller.hasAnimationsToRun())
        runAnimation();
}
//# sourceMappingURL=AnimationController.js.map