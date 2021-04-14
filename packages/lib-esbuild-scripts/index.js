#!/usr/bin/env node
/* eslint-disable */
// prettier-ignore
(()=>{var Y=Object.create,C=Object.defineProperty,k=Object.getPrototypeOf,O=Object.prototype.hasOwnProperty,M=Object.getOwnPropertyNames,G=Object.getOwnPropertyDescriptor;var J=e=>C(e,"__esModule",{value:!0});var V=(e,t,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of M(t))!O.call(e,o)&&o!=="default"&&C(e,o,{get:()=>t[o],enumerable:!(r=G(t,o))||r.enumerable});return e},n=e=>V(J(C(e!=null?Y(k(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var a=n(require("path")),x=n(require("esbuild")),i=n(require("fs-extra"));var l=n(require("path")),S=(0,l.join)(__dirname,"client.js"),A=(0,l.join)(__dirname,"server.js"),g=(0,l.join)("build","__ssr.js"),B=(0,l.join)("build","__ssr.css"),v=(0,l.join)("build","index.html"),ne=(0,l.join)("build","app.js"),se=(0,l.join)("build","app.css");var y=n(require("path")),F=n(require("@yarnpkg/esbuild-plugin-pnp")),H=n(require("esbuild-plugin-sass")),q={name:"WebAppResolvePlugin",setup(e){e.onResolve({filter:/data:/},()=>({external:!0})),e.onResolve({filter:/USER_DEFINED_APP_ENTRY_POINT/},()=>({path:(0,y.resolve)((0,y.join)("src","App.tsx"))}))}},z=[q,(0,H.default)(),(0,F.pnpPlugin)()],D=z;var K=({isServer:e=!1,isProd:t=!1})=>({define:{__SERVER__:String(e),"process.env.NODE_ENV":t?'"production"':'"development"'},bundle:!0,minify:!1,target:"es2019",logLevel:"info",plugins:D}),m=K;var $=n(require("html-minifier")),d=n(require("node-html-parser")),Q=(e,t,r,o)=>{let s=(0,d.parse)(e),h=s.querySelector("head"),T=s.querySelector("body");s.querySelector("#root").innerHTML=t;let c=r?"modulepreload":"preload";return o.forEach(w=>{let b=`/${w}`;w.endsWith("js")?(T.appendChild((0,d.parse)(r?`<script type="module" src="${b}"></script>`:`<script src="${b}"></script>`)),h.appendChild((0,d.parse)(`<link rel="${c}" href="${b}" />`))):w.endsWith("css")&&h.appendChild((0,d.parse)(`<link rel="stylesheet" href="${b}" />`))}),(0,$.minify)(s.toString(),{minifyCSS:!1,minifyJS:!1,collapseWhitespace:!0,collapseInlineTagWhitespace:!0})},E=Q;var u=e=>process.stderr.isTTY?t=>`[${e}m${t}[0m`:t=>t,f=u(31),_=u(32),j=u(33),p=u(34),me=u(35),de=u(36);async function X(){let{outputFiles:e}=await(0,x.build)({...m({isProd:!0}),entryPoints:[S],assetNames:"assets/[name]-[hash]",chunkNames:"chunks/[name]-[hash]",entryNames:"[dir]/[name]-[hash]",minify:!0,format:"esm",splitting:!0,write:!1,outdir:"build"}),t=(0,a.resolve)("build");return await Promise.all(e.map(async r=>{await(0,i.ensureDir)((0,a.dirname)(r.path)),await(0,i.writeFile)(r.path,r.contents,{})})),e.map(({path:r})=>(0,a.relative)(t,r))}async function Z(){await(0,x.build)({...m({isServer:!0,isProd:!0}),entryPoints:[A],platform:"node",format:"cjs",logLevel:"error",outfile:g});try{return require((0,a.resolve)(g))}catch{return console.error(f("Unable to perform server side rendering since the server bundle is not correctly generated.")),null}finally{await Promise.all([(0,i.remove)(g),(0,i.remove)(B)])}}async function ee(e,t){let r=await(0,i.readFile)(v),o=E(r.toString(),e,!0,t);await(0,i.writeFile)(v,o)}async function R(){console.error(j("[i] Bundling...")),await(0,i.ensureDir)("build"),await(0,i.emptyDir)("build"),await(0,i.copy)("public","build");let e=new Date().getTime(),[t,r]=await Promise.all([X(),Z()]);if(r==null)return!1;await ee(r,t);let o=new Date().getTime()-e;return console.error(`\u26A1 ${_(`Build success in ${o}ms.`)}`),!0}var P=n(require("http")),L=n(require("path")),U=n(require("esbuild")),I=n(require("fs-extra"));async function N(){let e=E((await(0,I.readFile)((0,L.join)("public","index.html"))).toString(),"",!1,["app.js","app.css"]),t=await(0,U.serve)({servedir:"public",port:19815},{...m({}),entryPoints:[S],sourcemap:"inline",outfile:(0,L.join)("public","app.js")});console.error(p(`[i] ESBuild Server started on http://${t.host}:${t.port}.`));let r=(0,P.createServer)((o,s)=>{if(o.url==="/"){s.writeHead(200,{"Content-Type":"text/html"}),s.end(e);return}let h={hostname:t.host,port:t.port,path:o.url,method:o.method,headers:o.headers},T=(0,P.request)(h,c=>{if(c.statusCode===404){s.writeHead(200,{"Content-Type":"text/html"}),s.end(e);return}s.writeHead(c.statusCode||200,c.headers),c.pipe(s,{end:!0})});o.pipe(T,{end:!0})}).listen(3e3);console.error(p("[i] Proxy Server started.")),console.error(`${_("Serving at")} ${p("http://localhost:3000")}`),await t.wait,r.close()}function W(){console.error(p("Usage:")),console.error("- esbuild start: start the devserver."),console.error("- esbuild build: generate production build."),console.error("- esbuild help: display command line usages.")}async function te(e){switch(e){case"start":return await N(),!0;case"build":return R();case"help":case"--help":return W(),!0;default:return console.error(f(`Unknown command: '${e}'`)),W(),!1}}async function re(){try{await te(process.argv[2]||"")||(process.exitCode=1)}catch(e){console.error(f(e)),process.exitCode=1}}re();})();
