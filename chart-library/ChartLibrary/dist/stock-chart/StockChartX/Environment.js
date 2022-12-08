import { BrowserUtils } from '../../utils';
export var Environment = {
    isMobile: false
};
detectEnvironment();
Object.freeze(Environment);
function detectEnvironment() {
    Environment.isMobile = BrowserUtils.isMobile();
}
//# sourceMappingURL=Environment.js.map