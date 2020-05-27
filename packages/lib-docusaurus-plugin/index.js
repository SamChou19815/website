"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pnp_webpack_plugin_1 = __importDefault(require("pnp-webpack-plugin"));
const setupPlugin = () => ({
    name: 'lib-docusaurus-plugin',
    getClientModules() {
        return [require.resolve('./prism-include-languages')];
    },
    configureWebpack() {
        return {
            resolve: {
                plugins: [pnp_webpack_plugin_1.default],
            },
            resolveLoader: {
                plugins: [pnp_webpack_plugin_1.default.moduleLoader(module)],
            },
        };
    },
});
exports.default = setupPlugin;
