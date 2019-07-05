"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var Params = /** @class */ (function () {
    function Params() {
    }
    Params.prototype.getHeader = function () {
        return this.renderAnno(Params.HEADER_KEY);
    };
    Params.prototype.getPath = function () {
        return this.renderAnno(Params.PATH_KEY);
    };
    Params.prototype.getQuery = function () {
        return this.renderAnno(Params.QUERY_KEY);
    };
    Params.prototype.getBody = function () {
        return this.renderAnno(Params.BODY_KEY);
    };
    /**
     * 构建 matedata
     * @private
     * @param {*} key
     * @returns
     * @memberof Param
     */
    Params.prototype.renderAnno = function (key) {
        return function (paramConfig) { return function (target, propertyKey, paramIndex) {
            var params = Reflect.getMetadata(key, target, propertyKey) || {};
            if (typeof paramConfig === 'string') {
                params[paramConfig] = { value: propertyKey, require: false, index: paramIndex };
            }
            if (typeof paramConfig === 'object') {
                params[paramConfig.value] = __assign({}, paramConfig, { index: paramIndex });
            }
            Reflect.defineMetadata(key, params, target, propertyKey);
        }; };
    };
    Params.HEADER_KEY = Symbol.for('WCI:HEADER_KEY');
    Params.PATH_KEY = Symbol.for('WCI:PATH_KEY');
    Params.QUERY_KEY = Symbol.for('WCI:QUERY_KEY');
    Params.BODY_KEY = Symbol.for('WCI:BODY_KEY');
    return Params;
}());
exports.default = Params;
//# sourceMappingURL=params.js.map