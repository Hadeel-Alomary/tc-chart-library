export class Country {

    constructor(public code:string, public arabic:string, public english:string){}

    private static countries:Country[] = [];

    public static getCountries():Country[] {
        if(Country.countries.length <= 0){
            Country.countries.push(new Country('+966','السعودية', 'Saudi Arabia'));
            Country.countries.push(new Country('+971','الامارات', 'United Arab Emirates'));
            Country.countries.push(new Country('+965', 'الكويت', 'Kuwait'));
            Country.countries.push(new Country('+974','قطر', 'Qatar'));
            Country.countries.push(new Country('+20','مصر', 'Egypt'));
            Country.countries.push(new Country('+962','الاردن', 'Jordan'));
            Country.countries.push(new Country('+968','سلطنة عمان', 'Oman'));
            Country.countries.push(new Country('+973','البحرين', 'Bahrain'));
            Country.countries.push(new Country('','دولة أخرى', 'Others'));
        }
        return Country.countries;
    }

    public static getSaudiCountryCode():string {
        return '+966';
    }

    public getCountryNameWithCode(arabic:boolean):string {
        let countryName:string = arabic ? this.arabic : this.english;
        return this.code == '' ? countryName : `${countryName} (${this.code})`;
    }


}
