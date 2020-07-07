import executeCodegenServices from './codegen/services';

(async () => {
  if (!(await executeCodegenServices())) {
    process.exit(1);
  }
})();
