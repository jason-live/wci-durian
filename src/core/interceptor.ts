abstract class Interceptor {
  static ICT_INSTANCES_KEY = Symbol.for('WCI:ICT_INSTANCES_KEY');

  abstract handleInterceptor(ctx: any, next: any): any;

  getAop() {
    return this.handleMetadata();
  }

  private handleMetadata() {
    return () => (target: any, propertyKey: string) => {
      const instances =
        Reflect.getMetadata(Interceptor.ICT_INSTANCES_KEY, target, propertyKey) || [];
      instances.push(this);
      Reflect.defineMetadata(Interceptor.ICT_INSTANCES_KEY, instances, target, propertyKey);
    };
  }
}

export default Interceptor;
