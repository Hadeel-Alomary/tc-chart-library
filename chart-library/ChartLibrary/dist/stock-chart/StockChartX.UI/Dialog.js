var SETTING_OPTIONS = {
    APPLY_ONCE: 'applyOnce',
    MAKE_AS_DEFAULT: 'makeDefault',
    RESET_DEFAULT_SETTINGS: 'resetDefault'
};
var Dialog = (function () {
    function Dialog(rootContainer) {
        var _this = this;
        this._isShown = false;
        this._dialog = rootContainer;
        this._dialog.find('> .modal-dialog').draggable({ handle: '.modal-header' });
        this._dialog.on('hidden.bs.modal', function () {
            _this._isShown && _this.hide();
        });
        this._initDialogContentObj();
    }
    Dialog.prototype.show = function (config) {
        this._isShown = true;
        this._dialog.modal();
        this._adjustDialogHeight();
        $('.modal-backdrop').addClass('no-background');
    };
    Dialog.prototype.hide = function () {
        if (!this._isShown)
            return;
        this._isShown = false;
        this._dialog.modal('hide');
    };
    Object.defineProperty(Dialog.prototype, "settingOptions", {
        get: function () {
            return SETTING_OPTIONS;
        },
        enumerable: false,
        configurable: true
    });
    Dialog.prototype._initDialogContentObj = function () {
        var dialog = this._dialog.find('> .modal-dialog');
        var root = dialog.find('> .modal-content');
        this._dialogContent = {
            dialog: dialog,
            root: root,
            header: root.find('> .modal-header'),
            body: root.find('> .modal-body'),
            footer: root.find('> .modal-footer')
        };
    };
    Dialog.prototype._adjustDialogHeight = function () {
        this._dialogContent.body.css('height', 'auto');
        var windowHeight = $(window).height();
        var dialogHeight = this._dialogContent.dialog.outerHeight(true);
        if (windowHeight < dialogHeight) {
            var dialogVerticalIndent = dialogHeight - this._dialogContent.dialog.height();
            var bodyVerticalIndent = this._dialogContent.body.outerHeight(true) - this._dialogContent.body.height();
            var headerHeight = this._dialogContent.header.outerHeight(true);
            var footerHeight = this._dialogContent.footer.outerHeight(true);
            var height = windowHeight - headerHeight - footerHeight - bodyVerticalIndent - dialogVerticalIndent;
            this._dialogContent.body.height(height);
        }
    };
    Dialog.prototype.addOnChangeEventForNumericField = function (config) {
        var _this = this;
        if (!config['onChange']) {
            config['onChange'] = function (value, obj) {
                setTimeout(function () {
                    _this.onChangeHandler();
                });
            };
        }
        return config;
    };
    Dialog.prototype._apply = function (applySaveSettings) {
        if (applySaveSettings === void 0) { applySaveSettings = true; }
    };
    Dialog.prototype.onChangeHandler = function () {
        if (this._isShown) {
            this._apply(false);
        }
    };
    return Dialog;
}());
export { Dialog };
//# sourceMappingURL=Dialog.js.map