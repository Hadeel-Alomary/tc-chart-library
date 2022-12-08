var ClassRegistrar = (function () {
    function ClassRegistrar() {
        this._constructors = {};
    }
    Object.defineProperty(ClassRegistrar.prototype, "registeredItems", {
        get: function () {
            return this._constructors;
        },
        enumerable: false,
        configurable: true
    });
    ClassRegistrar.prototype.register = function (className, constructor) {
        if (!className)
            throw new Error("Class name is not specified.");
        if (!constructor)
            throw new Error("Constructor is not specified.");
        var item = this._constructors[className];
        if (item)
            throw new Error("'" + className + "' already registered.");
        this._constructors[className] = constructor;
    };
    ClassRegistrar.prototype.resolve = function (className) {
        if (!className)
            throw new Error("Class name is not specified.");
        return this._constructors[className];
    };
    ClassRegistrar.prototype.createInstance = function (className) {
        var constructor = this.resolve(className);
        if (!constructor)
            throw new Error("'" + className + "' is not registered.");
        return new constructor();
    };
    ClassRegistrar.prototype.createChartBasedInstance = function (className, chart) {
        var constructor = this.resolve(className);
        if (!constructor)
            throw new Error("'" + className + "' is not registered.");
        return new constructor(chart);
    };
    return ClassRegistrar;
}());
export { ClassRegistrar };
//# sourceMappingURL=ClassRegistrar.js.map