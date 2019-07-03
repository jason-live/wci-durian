declare abstract class Interceptor {
    static ICT_INSTANCES_KEY: symbol;
    abstract handleInterceptor(): any;
    getAop(): () => (target: any, propertyKey: string) => void;
    private handleMetadata;
}
export default Interceptor;
