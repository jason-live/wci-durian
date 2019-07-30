import 'reflect-metadata';
import MethodType from '../static/method_type';
import Params from './params';
import Interceptor from './interceptor';

/**
 * 函数
 * @class Methods
 */
class Methods {
  static REQUEST_KEY = Symbol.for('WCI:REQUEST_KEY');
  static METHOD_KEY = Symbol.for('WCI:METHOD_KEY');
  static METHODS_KEY = Symbol.for('WCI:METHODS_KEY');
  static USES_KEY = Symbol.for('WCI:USES_KEY');

  private cMap: any;

  constructor(cMap: any) {
    this.cMap = cMap;
  }

  getGet() {
    return this.renderAnno(MethodType.GET);
  }

  getPost() {
    return this.renderAnno(MethodType.POST);
  }

  getPut() {
    return this.renderAnno(MethodType.PUT);
  }

  getDel() {
    return this.renderAnno(MethodType.DELETE);
  }

  /**
   * 处理注解函数
   * @private
   * @param {*} method
   * @returns
   * @memberof Methods
   */
  private renderAnno(method: any) {
    return (path: any) => {
      return (target: any, propertyKey: string, decorator: TypedPropertyDescriptor<any>) => {
        this.cMap.set(target, target);
        const methods = Reflect.getMetadata(Methods.METHODS_KEY, target) || [];
        methods.push(propertyKey);
        Reflect.defineMetadata(Methods.METHOD_KEY, method, target, propertyKey);
        Reflect.defineMetadata(Methods.METHODS_KEY, methods, target);
        Reflect.defineMetadata(Methods.REQUEST_KEY, path, target, propertyKey);
        const oldMethod: any = decorator.value;
        decorator.value = (instance: any) => async (ctx: any, next: any) => {
          // ctx对象赋值
          instance.ctx = ctx;
          const params: any = this.renderParams(ctx, target, propertyKey);
          await this.renderInterceptors(ctx, next, target, propertyKey);
          const result = await oldMethod.apply(instance, params);
          ctx.response.body = result;
        };
      };
    };
  }

  /**
   * 处理拦截器
   * @private
   * @param {*} ctx
   * @param {*} next
   * @param {*} target
   * @param {*} propertyKey
   * @memberof Methods
   */
  private async renderInterceptors(ctx: any, next: any, target: any, propertyKey: string | symbol) {
    const icts = Reflect.getMetadata(Interceptor.ICT_INSTANCES_KEY, target, propertyKey);
    if (icts) {
      for (const insO of icts) {
        await insO.ins.handleInterceptor(ctx, next, insO.wapper || null);
      }
    }
  }

  /**
   * 处理请求头参数
   * @private
   * @param {*} ctx
   * @param {Object} target
   * @param {(string | symbol)} propertyKey
   * @returns
   * @memberof Methods
   */
  private renderParams(ctx: any, target: Object, propertyKey: string | symbol) {
    const params: any = [];
    // 请求头参数
    const headerParams = Reflect.getMetadata(Params.HEADER_KEY, target, propertyKey);
    if (headerParams) {
      Object.keys(headerParams).map(key => {
        this.verifyParam(headerParams[key].require, ctx.request.header[key], headerParams[key].value);
        params[headerParams[key].index] = ctx.request.header[key];
      });
    }
    // 路径参数
    const pathParams = Reflect.getMetadata(Params.PATH_KEY, target, propertyKey);
    if (pathParams) {
      Object.keys(pathParams).map(key => {
        this.verifyParam(pathParams[key].require, ctx.params[key], pathParams[key].value);
        params[pathParams[key].index] = ctx.params[key];
      });
    }
    // 查询参数
    const queryParams = Reflect.getMetadata(Params.QUERY_KEY, target, propertyKey);
    if (queryParams) {
      Object.keys(queryParams).map(key => {
        this.verifyParam(queryParams[key].require, ctx.query[key], queryParams[key].value);
        params[queryParams[key].index] = ctx.query[key];
      });
    }
    // 请求体 body
    const bodyParams = Reflect.getMetadata(Params.BODY_KEY, target, propertyKey);
    if (bodyParams) {
      Object.keys(bodyParams).map(key => (params[bodyParams[key].index] = ctx.request.body));
    }
    return params;
  }

  /**
   * 校验参数是否必传
   * @private
   * @param {boolean} require
   * @param {*} requestParamValue
   * @param {*} requestParamKey
   * @memberof Methods
   */
  private verifyParam(require: boolean, requestParamValue: any, requestParamKey: any) {
    if (require && !requestParamValue) {
      throw new Error(`参数校验失败 ${requestParamKey}`);
    }
  }
}

export default Methods;
