var Country = (function () {
    function Country(code, arabic, english) {
        this.code = code;
        this.arabic = arabic;
        this.english = english;
    }
    Country.getCountries = function () {
        if (Country.countries.length <= 0) {
            Country.countries.push(new Country('+966', 'السعودية', 'Saudi Arabia'));
            Country.countries.push(new Country('+971', 'الامارات', 'United Arab Emirates'));
            Country.countries.push(new Country('+965', 'الكويت', 'Kuwait'));
            Country.countries.push(new Country('+974', 'قطر', 'Qatar'));
            Country.countries.push(new Country('+20', 'مصر', 'Egypt'));
            Country.countries.push(new Country('+962', 'الاردن', 'Jordan'));
            Country.countries.push(new Country('+968', 'سلطنة عمان', 'Oman'));
            Country.countries.push(new Country('+973', 'البحرين', 'Bahrain'));
            Country.countries.push(new Country('', 'دولة أخرى', 'Others'));
        }
        return Country.countries;
    };
    Country.getSaudiCountryCode = function () {
        return '+966';
    };
    Country.prototype.getCountryNameWithCode = function (arabic) {
        var countryName = arabic ? this.arabic : this.english;
        return this.code == '' ? countryName : "".concat(countryName, " (").concat(this.code, ")");
    };
    Country.countries = [];
    return Country;
}());
export { Country };
//# sourceMappingURL=country.js.map