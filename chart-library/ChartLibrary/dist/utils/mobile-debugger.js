var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tc } from './tc.utils';
var MobileDebugger = (function () {
    function MobileDebugger(http) {
        this.http = http;
        MobileDebugger_1.instance = this;
    }
    MobileDebugger_1 = MobileDebugger;
    MobileDebugger.log = function (message) {
        if (!MobileDebugger_1.instance) {
            Tc.debug("mobile debugger is turned off and can be enabled by injecting it in chart component");
            return;
        }
        if (!MobileDebugger_1.instance.inited) {
            MobileDebugger_1.instance.init();
        }
        MobileDebugger_1.instance.buffer += message + "\n";
    };
    MobileDebugger.prototype.init = function () {
        var _this = this;
        this.inited = true;
        window.setInterval(function () {
            _this.buffer += "\n-------------------------\n";
            MobileDebugger_1.instance.http.post('/m/liveweb/mobile/debug', JSON.stringify({ message: _this.buffer }))
                .subscribe();
            _this.buffer = "";
        }, MobileDebugger_1.LOG_INTERVAL);
    };
    var MobileDebugger_1;
    MobileDebugger.LOG_INTERVAL = 2000;
    MobileDebugger = MobileDebugger_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], MobileDebugger);
    return MobileDebugger;
}());
export { MobileDebugger };
//# sourceMappingURL=mobile-debugger.js.map