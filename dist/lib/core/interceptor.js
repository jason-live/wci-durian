"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Interceptor = /** @class */ (function () {
    function Interceptor() {
    }
    Interceptor.prototype.getAop = function () {
        return this.handleMetadata();
    };
    Interceptor.prototype.handleMetadata = function () {
        var _this = this;
        return function (wapper) { return function (target, propertyKey) {
            var instances = Reflect.getMetadata(Interceptor.ICT_INSTANCES_KEY, target, propertyKey) || [];
            instances.push({
                ins: _this,
                wapper: wapper,
            });
            Reflect.defineMetadata(Interceptor.ICT_INSTANCES_KEY, instances, target, propertyKey);
        }; };
    };
    Interceptor.ICT_INSTANCES_KEY = Symbol.for('WCI:ICT_INSTANCES_KEY');
    return Interceptor;
}());
exports.default = Interceptor;
//# sourceMappingURL=interceptor.js.map