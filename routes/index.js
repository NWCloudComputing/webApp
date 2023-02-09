const userRouter = require("./user");
const productRouter = require('./product');


/**
 * Base routes for different app components
 * @param {*} app 
 */

const routes = (app) => {
    app.use("/v1/user", userRouter);
    app.use("/v1/product", productRouter);
    app.use("/healthz",userRouter);
    app.use("/healthz",productRouter);

  
}


module.exports = routes;