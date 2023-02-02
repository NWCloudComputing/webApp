const userRouter = require("./user");


/**
 * Base routes for different app components
 * @param {*} app 
 */

const routes = (app) => {
    app.use("/v1/user", userRouter);
    app.use("/healthz",userRouter);

  
}


module.exports = routes;