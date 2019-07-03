"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
/**
 * 类修饰器
 * @class Classes
 */
var Classes = /** @class */ (function () {
    function Classes() {
    }
    /**
     * 类修饰器函数
     * @returns
     * @memberof Classes
     */
    Classes.prototype.getController = function () {
        return function (path) { return function (target) {
            Reflect.defineMetadata(Classes.CONTROLLER_KEY, path, target.prototype);
        }; };
    };
    /**
     * 类修饰器 key 值
     * @static
     * @memberof Classes
     */
    Classes.CONTROLLER_KEY = Symbol.for('WCI:CONTROLLER_KEY');
    return Classes;
}());
exports.default = Classes;
//# sourceMappingURL=classes.js.map