
/**
 * Environment configuration
 */

 var enviroments = {};

 /**staging environment(default environment) */
 enviroments.staging={
     'httpPort':2000,
     'httpsPort':2001,
     'envName':'Staging'
 }

 /**production environment */
 enviroments.production = {
     'httpPort':4000,
     'httpsPort':4001,
     'envName':'Production'
 }
 
 //determine environment passed as command line argument
 var currentEnvironment = typeof(process.env.NODE_ENV)=='string'?process.env.NODE_ENV.toLowerCase():'';

 //determine environment
 var environmentToExport = typeof(enviroments[currentEnvironment]) =='object'?enviroments[currentEnvironment]:enviroments.staging;

 //export the environment
 module.exports=environmentToExport;