"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("./config");
const setup_1 = require("./setup");
async function bootstrap() {
    const config = (0, config_1.readConfig)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    (0, setup_1.configureApp)(app, config.origins);
    await app.listen(config.port, '0.0.0.0');
}
bootstrap().catch(() => {
    console.error('API startup failed. Check backend configuration and dependencies.');
    process.exitCode = 1;
});
//# sourceMappingURL=main.js.map