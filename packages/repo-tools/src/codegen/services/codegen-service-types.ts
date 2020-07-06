export type CodegenStep = { readonly stepName: string; readonly stepCode: () => void };

export type CodegenService = {
  readonly serviceName: string;
  readonly serviceSteps: readonly CodegenStep[];
};
