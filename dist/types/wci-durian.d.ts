import Interceptor from './core/interceptor';
import Classes from './core/classes';
import Params from './core/params';
import Methods from './core/methods';
import MethodType from './static/method_type';
/**
 * WciDurian
 * @class WciDurian
 */
declare class WciDurian {
    static readonly cMap: Map<any, any>;
    static readonly classes: Classes;
    static readonly params: Params;
    static readonly methods: Methods;
    static metadatas(): any[];
}
export default WciDurian;
declare const ControllerMapping: (path: any) => (target: any) => void;
declare const Get: (path: any) => (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => void;
declare const Post: (path: any) => (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => void;
declare const Put: (path: any) => (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => void;
declare const Del: (path: any) => (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => void;
declare const RequestHeader: (paramName: string) => (target: any, propertyKey: string, paramIndex: number) => void;
declare const RequestPath: (paramName: string) => (target: any, propertyKey: string, paramIndex: number) => void;
declare const RequestQuery: (paramName: string) => (target: any, propertyKey: string, paramIndex: number) => void;
declare const RequestBody: (paramName: string) => (target: any, propertyKey: string, paramIndex: number) => void;
export { ControllerMapping };
export { Get, Post, Put, Del };
export { RequestHeader, RequestPath, RequestQuery, RequestBody };
export { MethodType };
export { Interceptor as WciDurianInterceptor };
