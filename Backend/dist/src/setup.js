"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = configureApp;
const common_1 = require("@nestjs/common");
function configureApp(app, origins) {
    app.enableCors({ origin: origins, credentials: true, methods: ['GET', 'HEAD', 'OPTIONS'] });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    app.enableShutdownHooks();
}
//# sourceMappingURL=setup.js.map