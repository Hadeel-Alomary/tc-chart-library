var RSA = (function () {
    function RSA() {
    }
    RSA.encrypt = function (messageToEncrypt, publicKeyModulus, publicKeyExponent) {
        var rsa = new RSAKey();
        rsa.setPublic(publicKeyModulus, publicKeyExponent);
        return rsa.encrypt(messageToEncrypt);
    };
    return RSA;
}());
export { RSA };
//# sourceMappingURL=RSA.js.map