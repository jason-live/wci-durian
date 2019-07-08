declare abstract class Interceptor {
    static ICT_INSTANCES_KEY: symbol;
    abstract handleInterceptor(ctx: any, next: any, wapper: any): Promise<any>;
    getAop(): (wapper?: any) => (target: any, propertyKey: string) => void;
    private handleMetadata;
}
export default Interceptor;
