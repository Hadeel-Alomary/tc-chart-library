import { Md5 } from './md5';
var StringUtils = (function () {
    function StringUtils() {
    }
    StringUtils.guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    StringUtils.formatVariableDigitsNumber = function (n) {
        if (!n && n !== 0 || n.toString() == '#') {
            return '-';
        }
        var digitsCount = StringUtils.digitsCount(n);
        if (digitsCount > StringUtils.MAX_NUMBER_OF_DIGITS) {
            digitsCount = StringUtils.MAX_NUMBER_OF_DIGITS;
        }
        else if (digitsCount < StringUtils.MIN_NUMBER_OF_DIGITS) {
            digitsCount = StringUtils.MIN_NUMBER_OF_DIGITS;
        }
        return StringUtils.formatMoney(n, digitsCount);
    };
    StringUtils.format2DigitsNumber = function (n) {
        if (!n && n !== 0 || n.toString() == '#') {
            return "-";
        }
        return StringUtils.formatMoney(n);
    };
    StringUtils.format3DigitsNumber = function (n) {
        if (!n && n !== 0) {
            return "-";
        }
        return StringUtils.formatMoney(n, 3);
    };
    StringUtils.formatWholeNumber = function (n) {
        if (!n && n !== 0 || n.toString() == '#') {
            return "-";
        }
        return StringUtils.formatMoney(n, 0);
    };
    StringUtils.substringCount = function (text, subString) {
        if (subString.length <= 0)
            return (text.length + 1);
        var n = 0, pos = 0, step = subString.length;
        while (true) {
            pos = text.indexOf(subString, pos);
            if (pos >= 0) {
                ++n;
                pos += step;
            }
            else
                break;
        }
        return n;
    };
    StringUtils.hashCode = function (s) {
        return Md5.hashStr(s).substr(0, 10);
    };
    StringUtils.md5 = function (s) {
        return Md5.hashStr(s);
    };
    StringUtils.md5Ascii = function (s) {
        return Md5.hashAsciiStr(s);
    };
    StringUtils.dataUriToByteArrayString = function (dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        }
        else {
            byteString = unescape(dataURI.split(',')[1]);
        }
        var byteArray = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            byteArray[i] = byteString.charCodeAt(i);
        }
        return {
            byteArray: byteArray,
            byteString: byteString
        };
    };
    StringUtils.formatMoney = function (number, decimalPlacesCount, decimalSeparator, thousandsSeparator) {
        if (decimalPlacesCount === void 0) { decimalPlacesCount = 2; }
        if (decimalSeparator === void 0) { decimalSeparator = '.'; }
        if (thousandsSeparator === void 0) { thousandsSeparator = ','; }
        var sign = number < 0 ? "-" : "", absoluteNumber = Math.abs(number), wholeNumber = parseInt(absoluteNumber.toFixed(decimalPlacesCount)), wholeNumberAsString = wholeNumber.toString(), firstThousandsSeparatorPosition = wholeNumberAsString.length > 3 ? wholeNumberAsString.length % 3 : 0;
        var result = sign;
        if (firstThousandsSeparatorPosition) {
            result += wholeNumberAsString.substr(0, firstThousandsSeparatorPosition) + thousandsSeparator;
        }
        result += wholeNumberAsString.substr(firstThousandsSeparatorPosition).replace(/(\d{3})(?=\d)/g, "$1" + thousandsSeparator);
        if (decimalPlacesCount) {
            result += decimalSeparator + Math.abs(absoluteNumber - wholeNumber).toFixed(decimalPlacesCount).slice(2);
        }
        return result;
    };
    StringUtils.digitsCount = function (n) {
        if (isNaN(n)) {
            return 0;
        }
        if (Math.floor(n) === n) {
            return 0;
        }
        return n.toString().split(".")[1].length || 0;
    };
    StringUtils.hasOnlyAsciiCharacters = function (s) {
        return /^[\u0000-\u007f]*$/.test(s);
    };
    StringUtils.isNumber = function (s) {
        return !(isNaN(+s));
    };
    StringUtils.markLeftToRightInRightToLeftContext = function (string) {
        return "\u200E" + string + "\u200E";
    };
    StringUtils.generateRandomString = function (length) {
        var randomString = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            randomString += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return randomString;
    };
    StringUtils.MAX_NUMBER_OF_DIGITS = 5;
    StringUtils.MIN_NUMBER_OF_DIGITS = 2;
    return StringUtils;
}());
export { StringUtils };
//# sourceMappingURL=string.utils.js.map