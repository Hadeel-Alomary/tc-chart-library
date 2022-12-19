import { LanguageType } from "../services";
var DomUtils = (function () {
    function DomUtils() {
    }
    DomUtils.getElementRectangle = function (element) {
        return { top: element.offsetTop,
            left: element.offsetLeft,
            width: element.offsetWidth,
            height: element.offsetHeight };
    };
    DomUtils.updateElementRectangle = function (renderer, element, rectangle) {
        renderer.setStyle(element, 'top', rectangle.top + "px");
        renderer.setStyle(element, 'left', rectangle.left + "px");
        renderer.setStyle(element, 'width', rectangle.width + "px");
        renderer.setStyle(element, 'height', rectangle.height + "px");
    };
    DomUtils.moveElement = function (renderer, element, left, top) {
        renderer.setStyle(element, 'top', top + "px");
        renderer.setStyle(element, 'left', left + "px");
    };
    DomUtils.isPointInElement = function (element, x, y) {
        var rectangle = DomUtils.getElementRectangle(element);
        return DomUtils.isPointInRectangle(rectangle, x, y);
    };
    DomUtils.isPointInRectangle = function (rectangle, x, y) {
        if (rectangle.left < x && x < (rectangle.left + rectangle.width)) {
            if (rectangle.top < y && y < (rectangle.top + rectangle.height)) {
                return true;
            }
        }
        return false;
    };
    DomUtils.mapPointFromParentToChild = function (childElement, parentX, parentY) {
        var x = parentX - childElement.offsetLeft;
        var y = parentY - childElement.offsetTop;
        return { x: x, y: y };
    };
    DomUtils.forceElementWithinScreenBounds = function (renderer, element) {
        var elementRectangle = element.getBoundingClientRect();
        var right = +element.style.right.replace('px', '');
        var left = +element.style.left.replace('px', '');
        var top = +element.style.top.replace('px', '');
        var PADDING = 20;
        if (elementRectangle.left < PADDING) {
            var outOfScreenWidth = PADDING - elementRectangle.left;
            var newRight = right - outOfScreenWidth;
            renderer.setStyle(element, 'right', newRight + "px");
        }
        if (window.innerWidth < (elementRectangle.left + elementRectangle.width + PADDING)) {
            var outOfScreenWidth = elementRectangle.left + elementRectangle.width + PADDING - window.innerWidth;
            var newLeft = left - outOfScreenWidth;
            renderer.setStyle(element, 'left', newLeft + "px");
        }
        if (window.innerHeight < (elementRectangle.top + elementRectangle.height + PADDING)) {
            var outOfScreenHeight = elementRectangle.top + elementRectangle.height + PADDING - window.innerHeight;
            var newTop = top - outOfScreenHeight;
            renderer.setStyle(element, 'top', newTop + "px");
        }
    };
    DomUtils.isEventOutsideComponent = function (componentElement, event, excludedClasses) {
        if (excludedClasses === void 0) { excludedClasses = ['modal-content', 'modal']; }
        var startElement = event.target;
        var parentElement = startElement;
        while (parentElement) {
            if (parentElement == componentElement) {
                return true;
            }
            if (DomUtils.classListContainsAnyOf(parentElement.classList, excludedClasses)) {
                return true;
            }
            parentElement = parentElement.parentElement;
        }
        return false;
    };
    DomUtils.getBas364ImageFromImage = function (image) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        return DomUtils.getBase64ImageFromCanvas(canvas);
    };
    DomUtils.getBase64ImageFromCanvas = function (canvas) {
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    };
    DomUtils.hostname = function (url) {
        var a = document.createElement('a');
        a.href = url;
        return a.hostname;
    };
    DomUtils.tooltipPosition = function (language, elementTooltip) {
        var tooltipPosition = $(elementTooltip).attr("data-placement");
        if (language === LanguageType.English) {
            if (tooltipPosition === "left") {
                return "right";
            }
            else if (tooltipPosition === "right") {
                return "left";
            }
        }
        return tooltipPosition;
    };
    DomUtils.classListContainsAnyOf = function (classList, classes) {
        for (var i = 0; i < classes.length; ++i) {
            if (classList.contains(classes[i])) {
                return true;
            }
        }
        return false;
    };
    return DomUtils;
}());
export { DomUtils };
//# sourceMappingURL=dom-utils.js.map