// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (config) => {
  config.plugins.push(
    new MonacoWebpackPlugin({
      languages: ['samlang'],
      features: [
        'bracketMatching',
        'clipboard',
        'codeAction',
        'codelens',
        'colorDetector',
        'comment',
        'contextmenu',
        'coreCommands',
        'dnd',
        'find',
        'folding',
        'format',
        'goToDefinitionCommands',
        'goToDefinitionMouse',
        'gotoError',
        'gotoLine',
        'hover',
        'inPlaceReplace',
        'linesOperations',
        'links',
        'multicursor',
        'parameterHints',
        'quickCommand',
        'referenceSearch',
        'rename',
        'smartSelect',
        'snippets',
        'suggest',
        'toggleHighContrast',
        'toggleTabFocusMode',
        'transpose',
        'wordHighlighter',
        'wordOperations',
        'wordPartOperations',
      ],
    }),
  );
  return config;
};
