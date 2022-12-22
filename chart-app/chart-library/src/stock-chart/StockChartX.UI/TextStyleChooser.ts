export class TextStyleChooser {

    private _selector: JQuery;
    private _labels: JQuery;
    private _checkboxes: JQuery;

    constructor(selector: JQuery) {
        this._selector = selector;
        this._init();
    }

    public getStyle(val: string): boolean {
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

    public setStyle(val: string, state: boolean): void {
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
    }

    private _init(): void {
        this._labels = this._selector.find('>label');
        this._checkboxes = this._selector.find('input[type=checkbox]');
        this._labels.click((e: JQueryEventObject) => {
            let checkbox = $(e.currentTarget).find('input[type=checkbox]');
            checkbox.prop('checked', !checkbox.prop('checked'));
            checkbox.prop('checked') ? $(e.currentTarget).addClass('active') : $(e.currentTarget).removeClass('active');
        }).each((e: JQueryEventObject) => {
            $(e.currentTarget).find('input[type=checkbox]').prop('checked') ? $(e.currentTarget).addClass('active')
                : $(e.currentTarget).removeClass('active');
        });
    }
}
