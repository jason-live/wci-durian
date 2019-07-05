import 'reflect-metadata';
import { ParamConfig } from '../type/types'

class Params {
  static HEADER_KEY = Symbol.for('WCI:HEADER_KEY');
  static PATH_KEY = Symbol.for('WCI:PATH_KEY');
  static QUERY_KEY = Symbol.for('WCI:QUERY_KEY');
  static BODY_KEY = Symbol.for('WCI:BODY_KEY');

  getHeader() {
    return this.renderAnno(Params.HEADER_KEY);
  }

  getPath() {
    return this.renderAnno(Params.PATH_KEY);
  }

  getQuery() {
    return this.renderAnno(Params.QUERY_KEY);
  }

  getBody() {
    return this.renderAnno(Params.BODY_KEY);
  }

  /**
   * 构建 matedata
   * @private
   * @param {*} key
   * @returns
   * @memberof Param
   */
  private renderAnno(key: any) {
    return (paramConfig: string | ParamConfig) => (target: any, propertyKey: string, paramIndex: number) => {
      const params = Reflect.getMetadata(key, target, propertyKey) || {};
      if (typeof paramConfig === 'string') {
        params[paramConfig] = { value: propertyKey , require: false, index: paramIndex };
      }
      if (typeof paramConfig === 'object') {
        params[paramConfig.value] = { ...paramConfig, index: paramIndex };
      }
      Reflect.defineMetadata(key, params, target, propertyKey);
    };
  }
}

export default Params;
