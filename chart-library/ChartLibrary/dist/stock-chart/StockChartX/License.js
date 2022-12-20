var client = "liveweb.tickerchart.com";
var domain = "liveweb.tickerchart.com";
var vrcode = "5888";
var licenseExpiration = null;
var allowedHosts = [
    "LOCALHOST",
    "127.0.0.1",
    "DEMO.MAGNISE.COM"
];
checkLicense();
function checkLicense() {
    if (licenseExpiration && new Date() > licenseExpiration) {
        handleInvalidLicense();
        return;
    }
    var host = window.location.hostname.toUpperCase();
    var hostIndex = allowedHosts.indexOf(host);
    if (hostIndex >= 0)
        return;
    var img = new Image();
    img.onload = function () {
        if (img.width > 1) {
            handleInvalidLicense();
        }
    };
    img.src = "https://modulusglobal.com/licenseping/ping.ashx?&cid=" + client + "&asm=" + domain + "&vr=" + vrcode + "&img=1&t=" + Math.random();
}
function handleInvalidLicense() {
    window.StockChartX = undefined;
    window.TASdk = undefined;
    alert("Invalid license - contact legal@modulusfe.com");
    throw new Error("Invalid  license.");
}
//# sourceMappingURL=License.js.map