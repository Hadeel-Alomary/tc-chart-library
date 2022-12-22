export class BrowserUtils{

    public static getUserAgent():string{
        return window.navigator.userAgent;
    }

    public static isMac():boolean{
        return BrowserUtils.getUserAgent().includes("Mac");
    }

    public static isIPhone():boolean {
        // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
        return /iPhone/.test(navigator.userAgent) && !(window as WindowExtension).MSStream;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ===> UNDERSTAND HOW MOBILE WORKS IN TICKERCHART WEB <===
    // MA in TickerChart Web, "mobile" word is used in two different context, and therefore, we need to differentiate between them.
    // FUNCTIONALITY: this is controlled by BrowserUtils.isMobile, and return true for both mobile and tablet. Therefore, forces both
    // of them (mobile and tablet) to have same feature and functionality.
    // STYLING: this is controlled by css class added to body. mobile classname is *only* used for mobile devices, and no tablets.
    // tablet styling is nearly the same as desktop styling, unless in very limited case, for which tablet customize their styling using
    // tablet classname added to the body.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private static mobileBrowser: boolean = null;
    public static isMobile():boolean {
        if(this.mobileBrowser == null) {
            this.mobileBrowser = this.checkMobileBrowser();
        }
        return this.mobileBrowser;
    }

    public static isDesktop():boolean {
        return !this.isMobile();
    }

    public static isMobileScreenDimensions():boolean {
        return BrowserUtils.isMobile() && !BrowserUtils.isWideScreen();
    }

    private static isWideScreen():boolean {
        // MA tablet is detected as mobile. Add following to allow "differentiation" between mobile and tablet.
        return 600 <= screen.width;
    }


    private static checkMobileBrowser():boolean {
        return (window as WindowExtension).mobileCheck();
    };


}

interface WindowExtension extends Window {
    mobileCheck: () => boolean,
    MSStream:boolean
}
