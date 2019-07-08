import 'reflect-metadata';
/**
 * 函数
 * @class Methods
 */
declare class Methods {
    static REQUEST_KEY: symbol;
    static METHOD_KEY: symbol;
    static METHODS_KEY: symbol;
    static USES_KEY: symbol;
    private cMap;
    constructor(cMap: any);
    getGet(): (path: any) => (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => void;
    getPost(): (path: any) => (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => void;
    getPut(): (path: any) => (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => void;
    getDel(): (path: any) => (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => void;
    /**
     * 处理注解函数
     * @private
     * @param {*} method
     * @returns
     * @memberof Methods
     */
    private renderAnno;
    /**
     * 处理拦截器
     * @private
     * @param {*} ctx
     * @param {*} next
     * @param {*} target
     * @param {*} propertyKey
     * @memberof Methods
     */
    private renderInterceptors;
    /**
     * 处理请求头参数
     * @private
     * @param {*} ctx
     * @param {*} target
     * @param {*} propertyKey
     * @returns
     * @memberof Methods
     */
    private renderParams;
    /**
     * 校验参数是否必传
     * @private
     * @param {*} ctx
     * @param {boolean} require
     * @param {*} requestParamValue
     * @param {*} requestParamKey
     * @memberof Methods
     */
    private verifyParam;
}
export default Methods;
