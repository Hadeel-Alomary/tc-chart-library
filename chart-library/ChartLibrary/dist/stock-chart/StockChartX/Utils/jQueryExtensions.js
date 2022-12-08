import { Rect } from "../Graphics/Rect";
$.fn.extend({
    scxGetFrame: function (relativeElement) {
        var width = this.outerWidth(), height = this.outerHeight(), pos;
        if (relativeElement) {
            var parentPos = relativeElement.offset();
            pos = this.offset();
            pos.left -= parentPos.left;
            pos.top -= parentPos.top;
        }
        else {
            pos = this.position();
        }
        return new Rect({
            left: pos.left,
            top: pos.top,
            width: width,
            height: height
        });
    },
    scxSize: function () {
        return {
            width: this.outerWidth(),
            height: this.outerHeight()
        };
    },
    scxContentSize: function () {
        return {
            width: this.innerWidth(),
            height: this.innerHeight()
        };
    },
    scxAppendCanvas: function () {
        return $('<canvas></canvas>')
            .css('position', 'absolute')
            .appendTo(this);
    },
    scxAppend: function (tag, className) {
        var elem = $('<' + tag + '></' + tag + '>').appendTo(this);
        if (className) {
            if (typeof className === 'string') {
                elem.addClass(className);
            }
            else {
                for (var _i = 0, _a = className; _i < _a.length; _i++) {
                    var item = _a[_i];
                    elem.addClass(item);
                }
            }
        }
        return elem;
    },
    scxFrame: function (frame) {
        this.css('left', frame.left)
            .css('top', frame.top)
            .outerWidth(frame.width)
            .outerHeight(frame.height);
    },
    scxPosition: function (left, top) {
        this.css('left', left).css('top', top);
        return this;
    },
    scxCanvasSize: function (width, height) {
        if (this.width() != width || this.height() != height) {
            if (window.devicePixelRatio > 1) {
                this.attr('width', width * window.devicePixelRatio);
                this.attr('height', height * window.devicePixelRatio);
                this.css("width", width);
                this.css("height", height);
                this[0].getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
            }
            else {
                this.attr('width', width);
                this.attr('height', height);
            }
        }
    },
    scxClientToLocalPoint: function (clientX, clientY) {
        var pos = this.offset();
        return {
            x: Math.round(clientX - pos.left),
            y: Math.round(clientY - pos.top)
        };
    },
    scxLocalToClientPoint: function (localX, localY) {
        var pos = this.offset();
        return {
            x: Math.round(localX + pos.left),
            y: Math.round(localY + pos.top)
        };
    },
    scxTextStyle: function (theme) {
        return this
            .css('color', theme.fillColor)
            .css('font-size', (theme.fontSize / 10) + 'rem')
            .css('font-family', theme.fontFamily)
            .css('font-weight', theme.fontStyle);
    },
    scxTextColor: function (theme) {
        return this.css('color', theme.fillColor);
    },
    scxBorder: function (border, theme) {
        return this.css(border, theme.width + 'px ' + theme.lineStyle + ' ' + theme.strokeColor);
    },
    scxFill: function (theme) {
        if (theme.fillEnabled === false)
            return this;
        return this.css('background-color', theme.fillColor);
    }
});
//# sourceMappingURL=jQueryExtensions.js.map