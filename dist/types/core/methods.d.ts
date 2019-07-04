import 'reflect-metadata';
declare class Methods {
    static REQUEST_KEY: symbol;
    static METHOD_KEY: symbol;
    static METHODS_KEY: symbol;
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
}
export default Methods;
