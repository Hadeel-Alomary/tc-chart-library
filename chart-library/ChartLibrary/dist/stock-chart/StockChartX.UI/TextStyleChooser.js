var TextStyleChooser = (function () {
    function TextStyleChooser(selector) {
        this._selector = selector;
        this._init();
    }
    TextStyleChooser.prototype.getStyle = function (val) {
        switch (val.toLowerCase()) {
            case 'b':
                return this._checkboxes.eq(0).prop('checked');
            case 'i':
                return this._checkboxes.eq(1).prop('checked');
            case 'u':
                return this._checkboxes.eq(2).prop('checked');
            default:
                return false;
        }
    };
    ;
    TextStyleChooser.prototype.setStyle = function (val, state) {
        switch (val.toLowerCase()) {
            case 'b':
                state ? this._labels.eq(0).addClass('active') : this._labels.eq(0).removeClass('active');
                this._checkboxes.eq(0).prop('checked', state);
                break;
            case 'i':
                state ? this._labels.eq(1).addClass('active') : this._labels.eq(1).removeClass('active');
                this._checkboxes.eq(1).prop('checked', state);
                break;
            case 'u':
                state ? this._labels.eq(2).addClass('active') : this._labels.eq(2).removeClass('active');
                this._checkboxes.eq(2).prop('checked', state);
                break;
        }
    };
    TextStyleChooser.prototype._init = function () {
        this._labels = this._selector.find('>label');
        this._checkboxes = this._selector.find('input[type=checkbox]');
        this._labels.click(function (e) {
            var checkbox = $(e.currentTarget).find('input[type=checkbox]');
            checkbox.prop('checked', !checkbox.prop('checked'));
            checkbox.prop('checked') ? $(e.currentTarget).addClass('active') : $(e.currentTarget).removeClass('active');
        }).each(function (e) {
            $(e.currentTarget).find('input[type=checkbox]').prop('checked') ? $(e.currentTarget).addClass('active')
                : $(e.currentTarget).removeClass('active');
        });
    };
    return TextStyleChooser;
}());
export { TextStyleChooser };
//# sourceMappingURL=TextStyleChooser.js.map