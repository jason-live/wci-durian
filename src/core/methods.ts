import 'reflect-metadata';
import MethodType from '../static/method_type';
import Params from './params';
import Interceptor from './interceptor';

class Methods {
  static REQUEST_KEY = Symbol.for('WCI:REQUEST_KEY');
  static METHOD_KEY = Symbol.for('WCI:METHOD_KEY');
  static METHODS_KEY = Symbol.for('WCI:METHODS_KEY');

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
  private async renderInterceptors(ctx: any, next: any, target: Object, propertyKey: string | symbol) {
    const icts = Reflect.getMetadata(Interceptor.ICT_INSTANCES_KEY, target, propertyKey);
    if (icts) {
      icts.map(async (ins: any) => {
        await ins.handleInterceptor(ctx, next);
      });
    }
  }

  /**
   * 处理请求头参数
   * @private
   * @param {*} ctx
   * @param {*} target
   * @param {*} propertyKey
   * @returns
   * @memberof Methods
   */
  private renderParams(ctx: { query: { [x: string]: any; }; request: { body: any; }; }, target: Object, propertyKey: string | symbol) {
    const params: any = [];
    // 请求头参数
    const headerParams = Reflect.getMetadata(Params.HEADER_KEY, target, propertyKey);
    if (headerParams) {
      Object.keys(headerParams).map(key => {
        this.verifyParam(ctx, headerParams[key].require, ctx.query[key], headerParams[key].value);
        params[headerParams[key].index] = ctx.query[key];
      });
    }
    // 路径参数
    const pathParams = Reflect.getMetadata(Params.PATH_KEY, target, propertyKey);
    if (pathParams) {
      Object.keys(pathParams).map(key => {
        this.verifyParam(ctx, pathParams[key].require, ctx.query[key], pathParams[key].value);
        params[pathParams[key].index] = ctx.query[key];
      });
    }
    // 查询参数
    const queryParams = Reflect.getMetadata(Params.QUERY_KEY, target, propertyKey);
    if (queryParams) {
      Object.keys(queryParams).map(key => {
        this.verifyParam(ctx, queryParams[key].require, ctx.query[key], queryParams[key].value);
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
   * @param {*} ctx
   * @param {boolean} require
   * @param {*} requestParamValue
   * @param {*} requestParamKey
   * @memberof Methods
   */
  private verifyParam(ctx: any, require: boolean, requestParamValue: any, requestParamKey: any) {
    if (require && !requestParamValue) {
      ctx.throw({
        logicno: 8001,
        message: `缺少必传参数 ${requestParamKey}`,
        des: '缺少必传参数',
      });
    }
  }
}

export default Methods;
