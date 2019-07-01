import Interceptor from './core/interceptor'
import Classes from './core/classes'
import Params from './core/params'
import Methods from './core/methods'
import MethodType from './static/method_type'

class WciDurian {
  static readonly cMap = new Map()
  static readonly classes = new Classes()
  static readonly params = new Params()
  static readonly methods = new Methods(WciDurian.cMap)
  static metadatas() {
    let arr = []
    for (const c of Array.from(this.cMap.values())) {
      const methods = Reflect.getMetadata(Methods.METHODS_KEY, c)
      arr = methods.map((methodName: any) => {
        // 初始化路由参数
        const method = c[methodName](c)
        const ctrPath = Reflect.getMetadata(Classes.CONTROLLER_KEY, c)
        const methodType = Reflect.getMetadata(Methods.METHOD_KEY, c, methodName)
        const path = Reflect.getMetadata(Methods.REQUEST_KEY, c, methodName)
        return {
          ctrPath,
          methodType,
          path,
          method
        }
      })
    }
    return arr
  }
}

export default WciDurian

const ControllerMapping = WciDurian.classes.getController()

const Get = WciDurian.methods.getGet()
const Post = WciDurian.methods.getPost()
const Put = WciDurian.methods.getPut()
const Del = WciDurian.methods.getDel()

const RequestHeader = WciDurian.params.getHeader()
const RequestPath = WciDurian.params.getPath()
const RequestQuery = WciDurian.params.getQuery()
const RequestBody = WciDurian.params.getBody()

// 类相关
export { ControllerMapping }

// 函数相关
export { Get, Post, Put, Del }

// 参数相关
export { RequestHeader, RequestPath, RequestQuery, RequestBody }

// AOP相关
// export { Use, Passport };

// 常量相关
export { MethodType }

// 接口
export { Interceptor as WciDurianInterceptor }
