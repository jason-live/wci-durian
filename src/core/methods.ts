import 'reflect-metadata'
import MethodType from '../static/method_type'
import Params from './params'
import Interceptor from './interceptor'

class Methods {
  static REQUEST_KEY = Symbol.for('WCI:REQUEST_KEY')
  static METHOD_KEY = Symbol.for('WCI:METHOD_KEY')
  static METHODS_KEY = Symbol.for('WCI:METHODS_KEY')

  private cMap: any

  constructor(cMap: any) {
    this.cMap = cMap
  }

  getGet() {
    return this.renderAnno(MethodType.GET)
  }

  getPost() {
    return this.renderAnno(MethodType.POST)
  }

  getPut() {
    return this.renderAnno(MethodType.PUT)
  }

  getDel() {
    return this.renderAnno(MethodType.DELETE)
  }

  /**
   *
   * @private
   * @param {*} method
   * @returns
   * @memberof Methods
   */
  private renderAnno(method: any) {
    return (path: any) => {
      return (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => {
        this.cMap.set(target, target)
        const methods = Reflect.getMetadata(Methods.METHODS_KEY, target) || []
        methods.push(propertyKey)
        Reflect.defineMetadata(Methods.METHOD_KEY, method, target, propertyKey)
        Reflect.defineMetadata(Methods.METHODS_KEY, methods, target)
        Reflect.defineMetadata(Methods.REQUEST_KEY, path, target, propertyKey)
        const oldMethod: any = decorator.value
        decorator.value = (instance: any) => async (ctx: any, next: any) => {
          instance.ctx = ctx;

          const params: any = []

          // 请求头参数
          const headerParams = Reflect.getMetadata(Params.HEADER_KEY, target, propertyKey)
          if (headerParams) {
            Object.keys(headerParams).map(
              key => (params[headerParams[key]] = ctx.request.header[key])
            )
          }
          // 路径参数
          const pathParams = Reflect.getMetadata(Params.PATH_KEY, target, propertyKey)
          if (pathParams) {
            Object.keys(pathParams).map(key => (params[pathParams[key]] = ctx.params[key]))
          }
          // 查询参数
          const queryParams = Reflect.getMetadata(Params.QUERY_KEY, target, propertyKey)
          if (queryParams) {
            Object.keys(queryParams).map(key => (params[queryParams[key]] = ctx.query[key]))
          }
          // 请求体 body
          const bodyParams = Reflect.getMetadata(Params.BODY_KEY, target, propertyKey)
          if (bodyParams) {
            Object.keys(bodyParams).map(key => (params[bodyParams[key]] = ctx.request.body))
          }

          const icts = Reflect.getMetadata(Interceptor.ICT_INSTANCES_KEY, target, propertyKey)
          if (icts) {
            icts.map(async (ins: any) => {
              await ins.handleInterceptor(ctx, next)
            })
          }
          const result = await oldMethod.apply(instance, params)
          ctx.response.body = result
        }
      }
    }
  }
}

export default Methods
