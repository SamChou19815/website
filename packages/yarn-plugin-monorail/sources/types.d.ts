type YarnInvididualWorkspaceInformation = {
  readonly workspaceLocation: string;
  readonly dependencyChain: readonly string[];
};

type YarnWorkspacesJson = {
  readonly __type__: unknown;
  readonly information: Readonly<Record<string, YarnInvididualWorkspaceInformation>>;
  readonly topologicallyOrdered: readonly string[];
};
