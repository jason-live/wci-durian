abstract class Interceptor {
  static ICT_INSTANCES_KEY = Symbol.for('WCI:ICT_INSTANCES_KEY');

  abstract async handleInterceptor(ctx: any, next: any, wapper: any): Promise<any>;

  getAop() {
    return this.handleMetadata();
  }

  private handleMetadata() {
    return (wapper?: any) => (target: any, propertyKey: string) => {
      const instances =
        Reflect.getMetadata(Interceptor.ICT_INSTANCES_KEY, target, propertyKey) || [];
      instances.push({
        ins: this,
        wapper,
      });
      Reflect.defineMetadata(Interceptor.ICT_INSTANCES_KEY, instances, target, propertyKey);
    };
  }
}

export default Interceptor;
