"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var method_type_1 = require("../static/method_type");
var params_1 = require("./params");
var interceptor_1 = require("./interceptor");
/**
 * 函数
 * @class Methods
 */
var Methods = /** @class */ (function () {
    function Methods(cMap) {
        this.cMap = cMap;
    }
    Methods.prototype.getGet = function () {
        return this.renderAnno(method_type_1.default.GET);
    };
    Methods.prototype.getPost = function () {
        return this.renderAnno(method_type_1.default.POST);
    };
    Methods.prototype.getPut = function () {
        return this.renderAnno(method_type_1.default.PUT);
    };
    Methods.prototype.getDel = function () {
        return this.renderAnno(method_type_1.default.DELETE);
    };
    /**
     * 处理注解函数
     * @private
     * @param {*} method
     * @returns
     * @memberof Methods
     */
    Methods.prototype.renderAnno = function (method) {
        var _this = this;
        return function (path) {
            return function (target, propertyKey, decorator) {
                _this.cMap.set(target, target);
                var methods = Reflect.getMetadata(Methods.METHODS_KEY, target) || [];
                methods.push(propertyKey);
                Reflect.defineMetadata(Methods.METHOD_KEY, method, target, propertyKey);
                Reflect.defineMetadata(Methods.METHODS_KEY, methods, target);
                Reflect.defineMetadata(Methods.REQUEST_KEY, path, target, propertyKey);
                var oldMethod = decorator.value;
                decorator.value = function (instance) { return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                    var params, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                // ctx对象赋值
                                instance.ctx = ctx;
                                params = this.renderParams(ctx, target, propertyKey);
                                return [4 /*yield*/, this.renderInterceptors(ctx, next, target, propertyKey)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, oldMethod.apply(instance, params)];
                            case 2:
                                result = _a.sent();
                                ctx.response.body = result;
                                return [2 /*return*/];
                        }
                    });
                }); }; };
            };
        };
    };
    /**
     * 处理拦截器
     * @private
     * @param {*} ctx
     * @param {*} next
     * @param {*} target
     * @param {*} propertyKey
     * @memberof Methods
     */
    Methods.prototype.renderInterceptors = function (ctx, next, target, propertyKey) {
        return __awaiter(this, void 0, void 0, function () {
            var icts, _i, icts_1, insO;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        icts = Reflect.getMetadata(interceptor_1.default.ICT_INSTANCES_KEY, target, propertyKey);
                        if (!icts) return [3 /*break*/, 4];
                        _i = 0, icts_1 = icts;
                        _a.label = 1;
                    case 1:
                        if (!(_i < icts_1.length)) return [3 /*break*/, 4];
                        insO = icts_1[_i];
                        return [4 /*yield*/, insO.ins.handleInterceptor(ctx, next, insO.wapper || null)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 处理请求头参数
     * @private
     * @param {*} ctx
     * @param {*} target
     * @param {*} propertyKey
     * @returns
     * @memberof Methods
     */
    Methods.prototype.renderParams = function (ctx, target, propertyKey) {
        var _this = this;
        var params = [];
        // 请求头参数
        var headerParams = Reflect.getMetadata(params_1.default.HEADER_KEY, target, propertyKey);
        if (headerParams) {
            Object.keys(headerParams).map(function (key) {
                _this.verifyParam(ctx, headerParams[key].require, ctx.query[key], headerParams[key].value);
                params[headerParams[key].index] = ctx.query[key];
            });
        }
        // 路径参数
        var pathParams = Reflect.getMetadata(params_1.default.PATH_KEY, target, propertyKey);
        if (pathParams) {
            Object.keys(pathParams).map(function (key) {
                _this.verifyParam(ctx, pathParams[key].require, ctx.query[key], pathParams[key].value);
                params[pathParams[key].index] = ctx.query[key];
            });
        }
        // 查询参数
        var queryParams = Reflect.getMetadata(params_1.default.QUERY_KEY, target, propertyKey);
        if (queryParams) {
            Object.keys(queryParams).map(function (key) {
                _this.verifyParam(ctx, queryParams[key].require, ctx.query[key], queryParams[key].value);
                params[queryParams[key].index] = ctx.query[key];
            });
        }
        // 请求体 body
        var bodyParams = Reflect.getMetadata(params_1.default.BODY_KEY, target, propertyKey);
        if (bodyParams) {
            Object.keys(bodyParams).map(function (key) { return (params[bodyParams[key].index] = ctx.request.body); });
        }
        return params;
    };
    /**
     * 校验参数是否必传
     * @private
     * @param {*} ctx
     * @param {boolean} require
     * @param {*} requestParamValue
     * @param {*} requestParamKey
     * @memberof Methods
     */
    Methods.prototype.verifyParam = function (ctx, require, requestParamValue, requestParamKey) {
        if (require && !requestParamValue) {
            ctx.throw({
                logicno: 8001,
                message: "\u7F3A\u5C11\u5FC5\u4F20\u53C2\u6570 " + requestParamKey,
                des: '缺少必传参数',
            });
        }
    };
    Methods.REQUEST_KEY = Symbol.for('WCI:REQUEST_KEY');
    Methods.METHOD_KEY = Symbol.for('WCI:METHOD_KEY');
    Methods.METHODS_KEY = Symbol.for('WCI:METHODS_KEY');
    Methods.USES_KEY = Symbol.for('WCI:USES_KEY');
    return Methods;
}());
exports.default = Methods;
//# sourceMappingURL=methods.js.map