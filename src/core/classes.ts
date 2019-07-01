import 'reflect-metadata'

/**
 * 类修饰器
 * @class Classes
 */
class Classes {
  /**
   * 类修饰器 key 值
   * @static
   * @memberof Classes
   */
  static CONTROLLER_KEY = Symbol.for('WCI:CONTROLLER_KEY')

  /**
   * 类修饰器函数
   * @returns
   * @memberof Classes
   */
  getController() {
    return (path: any) => (target: any) => {
      Reflect.defineMetadata(Classes.CONTROLLER_KEY, path, target.prototype)
    }
  }
}

export default Classes
