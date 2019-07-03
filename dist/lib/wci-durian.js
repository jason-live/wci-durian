"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interceptor_1 = require("./core/interceptor");
exports.WciDurianInterceptor = interceptor_1.default;
var classes_1 = require("./core/classes");
var params_1 = require("./core/params");
var methods_1 = require("./core/methods");
var method_type_1 = require("./static/method_type");
exports.MethodType = method_type_1.default;
var WciDurian = /** @class */ (function () {
    function WciDurian() {
    }
    WciDurian.metadatas = function () {
        var arr = [];
        var _loop_1 = function (c) {
            var methods = Reflect.getMetadata(methods_1.default.METHODS_KEY, c);
            arr = methods.map(function (methodName) {
                // 初始化路由参数
                var method = c[methodName](c);
                var ctrPath = Reflect.getMetadata(classes_1.default.CONTROLLER_KEY, c);
                var methodType = Reflect.getMetadata(methods_1.default.METHOD_KEY, c, methodName);
                var path = Reflect.getMetadata(methods_1.default.REQUEST_KEY, c, methodName);
                return {
                    ctrPath: ctrPath,
                    methodType: methodType,
                    path: path,
                    method: method
                };
            });
        };
        for (var _i = 0, _a = Array.from(this.cMap.values()); _i < _a.length; _i++) {
            var c = _a[_i];
            _loop_1(c);
        }
        return arr;
    };
    WciDurian.cMap = new Map();
    WciDurian.classes = new classes_1.default();
    WciDurian.params = new params_1.default();
    WciDurian.methods = new methods_1.default(WciDurian.cMap);
    return WciDurian;
}());
exports.default = WciDurian;
var ControllerMapping = WciDurian.classes.getController();
exports.ControllerMapping = ControllerMapping;
var Get = WciDurian.methods.getGet();
exports.Get = Get;
var Post = WciDurian.methods.getPost();
exports.Post = Post;
var Put = WciDurian.methods.getPut();
exports.Put = Put;
var Del = WciDurian.methods.getDel();
exports.Del = Del;
var RequestHeader = WciDurian.params.getHeader();
exports.RequestHeader = RequestHeader;
var RequestPath = WciDurian.params.getPath();
exports.RequestPath = RequestPath;
var RequestQuery = WciDurian.params.getQuery();
exports.RequestQuery = RequestQuery;
var RequestBody = WciDurian.params.getBody();
exports.RequestBody = RequestBody;
//# sourceMappingURL=wci-durian.js.map