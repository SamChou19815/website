// @ts-check

const vscode = require("vscode");

/**
 * @returns {Promise<void>}
 */
const sleep5s = () => new Promise((resolve) => setTimeout(resolve, 5 * 1000));

module.exports.activate = (/** @type {vscode.ExtensionContext} */ context) => {
  const config = vscode.workspace.getConfiguration("intentionally-slow-extension");
  const errorEnabled = config.get("slowErrors");
  const getDefEnabled = config.get("slowGetDef");
  const hoverEnabled = config.get("slowHover");
  const completionEnabled = config.get("slowCompletion");
  const codeActionEnabled = config.get("slowCodeAction");
  const findRefEnabled = config.get("slowFindRef");
  const renameEnabled = config.get("slowRename");
  const diagnosticCollection = vscode.languages.createDiagnosticCollection("my-stupid-errors");
  context.subscriptions.push(
    ...[
      ...(errorEnabled
        ? [
            diagnosticCollection,
            vscode.workspace.onDidOpenTextDocument(async (e) => {
              if (!e.fileName.endsWith(".ts")) {
                return;
              }
              await sleep5s();
              diagnosticCollection.set(e.uri, [
                new vscode.Diagnostic(
                  new vscode.Range(1, 1, 2, 2),
                  `The time is ${new Date().toString()}`,
                  vscode.DiagnosticSeverity.Error,
                ),
              ]);
            }),
            vscode.workspace.onDidCloseTextDocument((e) => {
              diagnosticCollection.set(e.uri, []);
            }),
            vscode.workspace.onDidChangeTextDocument(async (e) => {
              if (!e.document.fileName.endsWith(".ts")) {
                return;
              }
              await sleep5s();
              diagnosticCollection.set(e.document.uri, [
                new vscode.Diagnostic(
                  new vscode.Range(1, 1, 2, 2),
                  `The time is ${new Date().toString()}`,
                  vscode.DiagnosticSeverity.Error,
                ),
              ]);
            }),
          ]
        : []),
      codeActionEnabled
        ? vscode.languages.registerCodeActionsProvider("typescript", {
            async provideCodeActions() {
              await sleep5s();
              return [];
            },
          })
        : null,
      completionEnabled
        ? vscode.languages.registerCompletionItemProvider(
            "typescript",
            {
              async provideCompletionItems() {
                await sleep5s();
                return [{ label: "hahaha" }];
              },
            },
            ".",
          )
        : null,
      getDefEnabled
        ? vscode.languages.registerDefinitionProvider("typescript", {
            async provideDefinition(document) {
              await sleep5s();
              return { uri: document.uri, range: new vscode.Range(1, 1, 2, 2) };
            },
          })
        : null,
      hoverEnabled
        ? vscode.languages.registerHoverProvider("typescript", {
            async provideHover() {
              await sleep5s();
              return { contents: ["i am a stupid hover result"] };
            },
          })
        : null,
      findRefEnabled
        ? vscode.languages.registerReferenceProvider("typescript", {
            async provideReferences(document) {
              await sleep5s();
              return [{ uri: document.uri, range: new vscode.Range(1, 1, 2, 2) }];
            },
          })
        : null,
      renameEnabled
        ? vscode.languages.registerRenameProvider("typescript", {
            async provideRenameEdits() {
              await sleep5s();
              return null;
            },
          })
        : null,
    ].filter((v) => v != null),
  );
};
