require('zone.js/dist/zone-node');
require('reflect-metadata');
const express = require('express');
const fs = require('fs');
 
const { platformServer, renderModuleFactory } = require('@angular/platform-server');
const { ngExpressEngine } = require('@nguniversal/express-engine');
// Import module map for lazy loading
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
 
// Import the AOT compiled factory for your AppServerModule.
// This import will change with the hash of your built server bundle.
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.bundle`);
 
const app = express();
const port = process.env.port || 8000;
const path = 'dist/';
const baseUrl = `http://localhost:${port}`;
 
// Set the engine
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
 
app.set('view engine', 'html');
 
app.set('views', './'+path);
app.use('/', express.static('./'+path, {index: false}));
 
app.get('*', (req, res) => {
  res.render('index', {
    req,
    res
  });
});
 
app.listen(port, () => {
	console.log(`Listening at ${baseUrl}`);
});