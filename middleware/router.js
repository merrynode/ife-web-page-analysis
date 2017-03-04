module.exports = class Router {
    constructor() {
        this.__routes = [];
    }
    get (...arg) {
        let __router = this.routerGenerating('get', ...arg);
        this.__routes.push(__router);
    }
    post (...arg) {
        let __router = this.routerGenerating('post', ...arg);
        this.__routes.push(__router);
    }
    routerGenerating (method, ...arg) {
        let fn   = arg.pop();
        let path = arg.join('');
        return {method: method, path: path, fn: fn};
    }
    routes () {
        let routes = this.__routes;
        return async function (ctx, next) {
            let __router = routes.find(r => r.method === ctx.method.toLowerCase() && new RegExp(`^${r.path}$`).test(ctx.path));
            if (__router) return __router.fn.apply(this, arguments);
        }
    }
}