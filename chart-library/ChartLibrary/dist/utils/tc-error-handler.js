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
import { Subject } from "rxjs";
var TcErrorHandler = (function () {
    function TcErrorHandler(http) {
        var _this = this;
        this.http = http;
        this.logLines = [];
        window.setInterval(function () { return _this._processExceptions(); }, 30 * 1000);
        this.unauthorizedRequestStream = new Subject();
    }
    TcErrorHandler.prototype.handleError = function (error) {
        if (('status' in error) && error.status == 401) {
            console.log("authorization error received!!!!");
            this.unauthorizedRequestStream.next();
        }
        var originalError = this._findOriginalError(error);
        var originalStack = this._findOriginalStack(error);
        var context = this._findContext(error);
        var logData = [];
        this._log("EXCEPTION: " + this._extractMessage(error));
        if (originalError) {
            this._log("ORIGINAL EXCEPTION: " + this._extractMessage(originalError));
        }
        if (originalStack) {
            this._log('ORIGINAL STACKTRACE:');
            this._log(originalStack);
        }
        if (context) {
            this._log('ERROR CONTEXT:');
            this._log(context);
        }
        this._log('-------------------------');
    };
    TcErrorHandler.prototype.getUnauthorizedRequestStream = function () {
        return this.unauthorizedRequestStream;
    };
    TcErrorHandler.prototype._log = function (line) {
        console.error(line);
        this.logLines.push(line);
    };
    TcErrorHandler.prototype._extractMessage = function (error) {
        return error.message ? "ERROR MESSAGE:  ".concat(error.message) : "ERROR:  ".concat(error.toString());
    };
    TcErrorHandler.prototype._findContext = function (error) {
        if (error) {
            return error.context ? error.context :
                this._findContext(error.originalError);
        }
        return null;
    };
    TcErrorHandler.prototype._findOriginalError = function (error) {
        var e = error.originalError;
        while (e && e.originalError) {
            e = e.originalError;
        }
        return e;
    };
    TcErrorHandler.prototype._findOriginalStack = function (error) {
        if (!(error instanceof Error))
            return null;
        var e = error;
        var stack = e.stack;
        while (e instanceof Error && e.originalError) {
            e = e.originalError;
            if (e instanceof Error && e.stack) {
                stack = e.stack;
            }
        }
        return stack;
    };
    TcErrorHandler.prototype._processExceptions = function () {
    };
    TcErrorHandler = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], TcErrorHandler);
    return TcErrorHandler;
}());
export { TcErrorHandler };
//# sourceMappingURL=tc-error-handler.js.map