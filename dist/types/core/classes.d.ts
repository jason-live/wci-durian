import 'reflect-metadata';
/**
 * 类修饰器
 * @class Classes
 */
declare class Classes {
    /**
     * 类修饰器 key 值
     * @static
     * @memberof Classes
     */
    static CONTROLLER_KEY: symbol;
    /**
     * 类修饰器函数
     * @returns
     * @memberof Classes
     */
    getController(): (path: any) => (target: any) => void;
}
export default Classes;
