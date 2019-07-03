import 'reflect-metadata';
declare class Params {
    static HEADER_KEY: symbol;
    static PATH_KEY: symbol;
    static QUERY_KEY: symbol;
    static BODY_KEY: symbol;
    getHeader(): (paramName: string) => (target: any, propertyKey: string, paramIndex: number) => void;
    getPath(): (paramName: string) => (target: any, propertyKey: string, paramIndex: number) => void;
    getQuery(): (paramName: string) => (target: any, propertyKey: string, paramIndex: number) => void;
    getBody(): (paramName: string) => (target: any, propertyKey: string, paramIndex: number) => void;
    /**
     * 构建 matedata
     * @private
     * @param {*} key
     * @returns
     * @memberof Param
     */
    private renderAnno;
}
export default Params;
