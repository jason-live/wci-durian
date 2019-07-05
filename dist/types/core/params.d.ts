import 'reflect-metadata';
import { ParamConfig } from '../type/types';
declare class Params {
    static HEADER_KEY: symbol;
    static PATH_KEY: symbol;
    static QUERY_KEY: symbol;
    static BODY_KEY: symbol;
    getHeader(): (paramConfig: string | ParamConfig) => (target: any, propertyKey: string, paramIndex: number) => void;
    getPath(): (paramConfig: string | ParamConfig) => (target: any, propertyKey: string, paramIndex: number) => void;
    getQuery(): (paramConfig: string | ParamConfig) => (target: any, propertyKey: string, paramIndex: number) => void;
    getBody(): (paramConfig: string | ParamConfig) => (target: any, propertyKey: string, paramIndex: number) => void;
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
