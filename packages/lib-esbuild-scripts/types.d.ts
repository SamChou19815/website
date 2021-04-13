declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const src: string;
  export default src;
}

declare const __SERVER__: boolean;
