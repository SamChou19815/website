"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setupPlugin = () => ({
    name: 'lib-docusaurus-plugin',
    getClientModules() {
        return [require.resolve('./prism-include-languages')];
    },
});
exports.default = setupPlugin;
