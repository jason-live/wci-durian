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
     *
     * @private
     * @param {*} method
     * @returns
     * @memberof Methods
     */
    private renderAnno;
}
export default Methods;
