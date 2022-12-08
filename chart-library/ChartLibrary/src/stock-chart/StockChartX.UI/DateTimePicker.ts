//NK All functions are accessed via the data attribute e.g. $('#datetimepicker').data("DateTimePicker").FUNCTION()
export class DateTimePicker {
    private picker: JQuery;

    constructor(domObject: JQuery, options?: EonasdanBootstrapDatetimepicker.GetOptions) {
        this.picker = domObject.datetimepicker(options);
    }

    public getDate(): string {
        return moment(this.picker.data("DateTimePicker").date()).format();
    }

    public setDate(value: string | Date): void {
        let formattedValue = moment(value).format('DD/MM/YYYY HH:mm');
        this.picker.data("DateTimePicker").date(formattedValue);
    }
}
