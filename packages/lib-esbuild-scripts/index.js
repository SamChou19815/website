#!/usr/bin/env node
/* eslint-disable */
// prettier-ignore
(()=>{var U=Object.create,E=Object.defineProperty,M=Object.getPrototypeOf,Y=Object.prototype.hasOwnProperty,O=Object.getOwnPropertyNames,J=Object.getOwnPropertyDescriptor;var W=e=>E(e,"__esModule",{value:!0});var k=(e,r,o)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of O(r))!Y.call(e,t)&&t!=="default"&&E(e,t,{get:()=>r[t],enumerable:!(o=J(r,t))||o.enumerable});return e},s=e=>k(W(E(e!=null?U(M(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var A=s(require("crypto")),N=s(require("path")),v=s(require("esbuild")),n=s(require("fs-extra"));var a=s(require("path")),f=(0,a.join)(__dirname,"client.js"),x=(0,a.join)(__dirname,"server.js"),S=(0,a.join)("build","ssr.js"),y=(0,a.join)("build","ssr.css"),g=(0,a.join)("build","index.html"),_=(0,a.join)("build","app.js"),P=(0,a.join)("build","app.css");var h=s(require("path")),w=s(require("@yarnpkg/esbuild-plugin-pnp")),z=({isServer:e=!1,isProd:r=!1})=>({define:{__SERVER__:String(e),"process.env.NODE_ENV":r?'"production"':'"development"',__THEME_SWITCH__:String(!process.env.NO_THEME_SWITCH)},bundle:!0,minify:!1,target:"es2017",logLevel:"error",plugins:[{name:"WebAppResolvePlugin",setup(o){o.onResolve({filter:/data:/},()=>({external:!0})),o.onResolve({filter:/USER_DEFINED_APP_ENTRY_POINT/},()=>({path:(0,h.resolve)((0,h.join)("src","App.tsx"))}))}},(0,w.pnpPlugin)()]}),d=z;var u=e=>process.stderr.isTTY?r=>`[${e}m${r}[0m`:r=>r,m=u(31),T=u(32),H=u(33),i=u(34),te=u(35),ne=u(36);var G=["\u280B","\u2819","\u2839","\u2838","\u283C","\u2834","\u2826","\u2827","\u2807","\u280F"],V=e=>{let r=0,o=new Date().getTime();return setInterval(()=>{let t=`${((new Date().getTime()-o)/1e3).toFixed(1)}s`,c=e(t),l=G[r%10];process.stderr.write(H(`${c} ${l}\r`)),r+=1},process.stderr.isTTY?40:1e3)},L=V;async function q(e){let[r,o,t]=await Promise.all([(0,n.readFile)(g),(0,n.readFile)(_),(0,n.readFile)(P)]),c=r.toString(),l=F=>(0,A.createHash)("md5").update(F).digest().toString("hex").substring(0,8),p=l(o),D=l(t),I=c.replace('href="/app.css"',`href="/app.css?h=${D}"`).replace('"/app.js"',`"/app.js?h=${p}"`).replace('"/app.js"',`"/app.js?h=${p}"`).replace('<div id="root"></div>',`<div id="root">${e}</div>`);await(0,n.writeFile)(g,I)}async function K(){await(0,v.build)({...d({isServer:!0,isProd:!0}),entryPoints:[x],platform:"node",format:"cjs",outfile:S});try{return require((0,N.resolve)(S))}catch{return console.error(m("Unable to perform server side rendering since the server bundle is not correctly generated.")),null}finally{await Promise.all([(0,n.remove)(S),(0,n.remove)(y)])}}async function C(){let e=L(()=>"[i] Bundling..."),r=new Date().getTime(),[,o]=await Promise.all([(0,v.build)({...d({isProd:!0}),entryPoints:[f],minify:!0,outfile:_}),K()]);if(clearInterval(e),o==null)return!1;await(0,n.copy)("public","build");let[,t,c]=await Promise.all([q(o),(0,n.stat)(_),(0,n.stat)(P)]),l=new Date().getTime()-r;return console.error(T(`Build success in ${l}ms.`)),console.error(i(`Minified JS Size: ${Math.ceil(t.size/1024)}k.`)),console.error(i(`Minified CSS Size: ${Math.ceil(c.size/1024)}k.`)),!0}var b=s(require("http")),B=s(require("path")),$=s(require("esbuild"));async function R(){let e=await(0,$.serve)({servedir:"public",port:3456},{...d({}),entryPoints:[f],sourcemap:"inline",outfile:(0,B.join)("public","app.js")});console.error(i(`[i] ESBuild Server started on http://${e.host}:${e.port}.`));let r=(0,b.createServer)((o,t)=>{let c={hostname:e.host,port:e.port,path:o.url,method:o.method,headers:o.headers},l=(0,b.request)(c,p=>{if(p.statusCode===404){t.writeHead(404,{"Content-Type":"text/html"}),t.end("<h1>404</h1>");return}t.writeHead(p.statusCode||200,p.headers),p.pipe(t,{end:!0})});o.pipe(l,{end:!0})}).listen(3e3);console.error(i("[i] Proxy Server started.")),console.error(`${T("Serving at")} ${i("http://localhost:3000")}`),await e.wait,r.close()}function j(){console.error(i("Usage:")),console.error("- esbuild start: start the devserver."),console.error("- esbuild build: generate production build."),console.error("- esbuild help: display command line usages.")}async function Q(e){switch(e){case"start":return await R(),!0;case"build":return C();case"help":case"--help":return j(),!0;default:return console.error(m(`Unknown command: '${e}'`)),j(),!1}}async function X(){try{await Q(process.argv[2]||"")||(process.exitCode=1)}catch(e){console.error(m(e)),process.exitCode=1}}X();})();
