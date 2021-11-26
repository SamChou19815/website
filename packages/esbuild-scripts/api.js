// @generated
/* eslint-disable */
// prettier-ignore
(() => {
var ot=Object.create;var _=Object.defineProperty;var it=Object.getOwnPropertyDescriptor;var st=Object.getOwnPropertyNames;var at=Object.getPrototypeOf,lt=Object.prototype.hasOwnProperty;var C=t=>_(t,"__esModule",{value:!0});var ut=(t,e)=>{C(t);for(var r in e)_(t,r,{get:e[r],enumerable:!0})},pt=(t,e,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of st(e))!lt.call(t,n)&&n!=="default"&&_(t,n,{get:()=>e[n],enumerable:!(r=it(e,n))||r.enumerable});return t},c=t=>pt(C(_(t!=null?ot(at(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);ut(exports,{default:()=>rt});var f=c(require("fs/promises")),g=c(require("path")),k=c(require("esbuild"));var F=c(require("fs/promises")),I=c(require("path")),O=c(require("@mdx-js/mdx")),ct={name:"WebAppResolvePlugin",setup(t){t.onResolve({filter:/^data:/},()=>({external:!0}))}},N=/^esbuild-scripts-internal\/virtual\//,mt=(0,I.resolve)("."),dt=t=>({name:"VirtualPathResolvePlugin",setup(e){e.onResolve({filter:N},r=>({path:r.path,namespace:"virtual-path"})),e.onLoad({filter:N,namespace:"virtual-path"},r=>({contents:t[r.path],resolveDir:mt,loader:"jsx"}))}});async function gt(t){return`import React from 'react';
import mdx from 'esbuild-scripts/__internal-components__/mdx';
${await(0,O.default)(t.trim().split(`
`).slice(1).join(`
`).trim())}
MDXContent.additionalProperties = typeof additionalProperties === 'undefined' ? undefined : additionalProperties;
`}var ht={name:"mdx",setup(t){t.onLoad({filter:/\.md$/},async e=>({contents:await gt((await(0,F.readFile)(e.path)).toString()),loader:"jsx"}))}},ft=t=>[ct,dt(t),ht],B=ft;var Pt=({virtualPathMappings:t,isServer:e=!1,isProd:r=!1})=>({define:{__dirname:'""',__SERVER__:String(e),"process.env.NODE_ENV":r?'"production"':'"development"'},bundle:!0,minify:!1,legalComments:"linked",platform:"browser",target:"es2019",logLevel:"error",external:["path","fs"],plugins:B(t)}),b=Pt;var y=c(require("path")),Ht=(0,y.join)(__dirname,"templates"),M=(0,y.join)("src","pages"),H=(0,y.join)("build","__ssr.jsx"),W=(0,y.join)("build","__ssr.css"),j="build",R="esbuild-scripts-internal/virtual/",T=`${R}__generated-entry-point__/`,$=`${T}__server__.jsx`;var J=c(require("fs/promises")),w=c(require("path"));var d=c(require("fs/promises")),P=c(require("path")),A=async(t,e)=>{await(0,d.mkdir)(e,{recursive:!0}),await Promise.all((await(0,d.readdir)(e)).map(r=>(0,d.rm)((0,P.join)(e,r),{recursive:!0,force:!0}))),await Promise.all((await(0,d.readdir)(t)).map(async r=>{let n=(0,P.join)(t,r),i=(0,P.join)(e,r);await U(n)?await A(n,i):await(0,d.copyFile)(n,i)}))},U=t=>(0,d.lstat)(t).then(e=>e.isDirectory()),G=async t=>Promise.all((await(0,d.readdir)(t)).flatMap(async e=>{let r=(0,P.join)(t,e);return await U(r)?[r,...await G(r)]:[r]})).then(e=>e.flat()),Y=async t=>(await G(t)).map(e=>(0,P.relative)(t,e)).sort((e,r)=>e.localeCompare(r));var z="// @generated",L=t=>t.endsWith("index")?t.substring(0,t.length-(t.endsWith("/index")?6:5)):t,X=(t,e,r)=>r?`${t}/src/pages/${e}`:`${R}${e}`,K=(t,e,r,n,i)=>{let a=n.filter(l=>l!==e),s=i.filter(l=>l!==e),o=(l,u)=>X(t,l,u),m=[...a.map((l,u)=>`const RealComponent${u} = lazy(() => import('${o(l,!0)}'));`),...s.map((l,u)=>`const VirtualComponent${u} = lazy(() => import('${o(l,!1)}'));`)].join(`
`),p=o(e,r),h=[...a.map((l,u)=>`        <Route exact path="/${L(l)}"><Suspense fallback={null}><RealComponent${u} /></Suspense></Route>`),...s.map((l,u)=>`        <Route exact path="/${L(l)}"><Suspense fallback={null}><VirtualComponent${u} /></Suspense></Route>`)].join(`
`);return`${z}
import React,{Suspense,lazy} from 'react';
import {hydrate,render} from 'react-dom';
import {BrowserRouter,Route,Switch} from 'esbuild-scripts/__internal-components__/react-router';
import Document from '${t}/src/pages/_document';
import Page from '${p}';
${m}
const element = (
  <BrowserRouter>
    <Document>
      <Switch>
        <Route exact path="/${L(e)}"><Page /></Route>
${h}
      </Switch>
    </Document>
  </BrowserRouter>
);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`},bt=(t,e,r)=>{let n=(s,o)=>X(t,s,o),i=[...e.map((s,o)=>`import RealPage${o} from '${n(s,!0)}';`),...r.map((s,o)=>`import VirtualPage${o} from '${n(s,!1)}';`)].join(`
`),a=[...e.map((s,o)=>`'${s}': RealPage${o}`),...r.map((s,o)=>`'${s}': VirtualPage${o}`)].join(", ");return`${z}
import React from 'react';
import {renderToString} from 'react-dom/server';
import Helmet from 'esbuild-scripts/components/Head';
import {StaticRouter} from 'esbuild-scripts/__internal-components__/react-router';
import Document from '${t}/src/pages/_document';
${i}
const map = { ${a} };
module.exports = (path) => ({
  divHTML: renderToString(
    <StaticRouter location={'/'+path}>
      <Document>{React.createElement(map[path])}</Document>
    </StaticRouter>
  ),
  noJS: map[path].noJS,
  helmet: Helmet.renderStatic(),
});
`},yt=async()=>(await(0,J.mkdir)(M,{recursive:!0}),(await Y(M)).map(t=>{switch((0,w.extname)(t)){case".js":case".jsx":case".ts":case".tsx":break;default:return null}return t.substring(0,t.lastIndexOf("."))}).filter(t=>t!=null&&!t.startsWith("_document"))),S=t=>Object.fromEntries(Object.entries(t).map(([e,r])=>[`${R}${e}`,r])),x=async t=>{let e=(0,w.resolve)("."),r=await yt(),n=Object.fromEntries([...r.map(i=>[`${T}${i}.jsx`,K(e,i,!0,r,t)]),...t.map(i=>[`${T}${i}.jsx`,K(e,i,!1,r,t)])]);return n[$]=bt(e,r,t),{entryPointsWithoutExtension:r,entryPointVirtualFiles:n}};var St=(t,e)=>e?`<script type="module" src="/${t}"><\/script>`:`<script src="/${t}"><\/script>`,_t=(t,e)=>`<link rel="${e?"modulepreload":"preload"}" href="/${t}" />`,Rt=(t,e,r)=>{let n=[],i=[];t.forEach(o=>{!r&&o.endsWith("js")?n.push(o):o.endsWith("css")&&i.push(o)});let a=i.map(o=>`<link rel="stylesheet" href="/${o}" />`).join("")+n.map(o=>_t(o,e)).join(""),s=n.map(o=>St(o,e)).join("");return{headLinks:a,bodyScriptLinks:s}},Q=(t,e)=>e==null?`<head>${t}</head>`:`<head>${[e.meta.toString(),e.title.toString(),e.link.toString(),e.script.toString(),t].join("")}</head>`,Tt=(t,e,r)=>{let{headLinks:n,bodyScriptLinks:i}=Rt(e,r,t==null?void 0:t.noJS);if(t==null){let p=Q(n),h=`<body><div id="root"></div>${i}</body>`;return`<!DOCTYPE html><html>${p}${h}</html>`}let{divHTML:a,helmet:s}=t,o=Q(n,s),m=`<body><div id="root">${a}</div>${i}</body>`;return`<!DOCTYPE html><html ${s.htmlAttributes.toString()}>${o}${m}</html>`},E=Tt;async function Z(t,e){let r={...t,...S(e)},{outputFiles:n}=await(0,k.build)({...b({virtualPathMappings:r,isProd:!0}),entryPoints:Object.keys(t),assetNames:"assets/[name]-[hash]",chunkNames:"chunks/[name]-[hash]",entryNames:"[dir]/[name]-[hash]",minify:!0,format:"esm",splitting:!0,write:!1,outdir:"build"}),i=(0,g.resolve)("build");return await Promise.all(n.map(async a=>{await(0,f.mkdir)((0,g.dirname)(a.path),{recursive:!0}),await(0,f.writeFile)(a.path,a.contents)})),n.map(({path:a})=>(0,g.relative)(i,a))}async function $t(t,e){await(0,k.build)({...b({virtualPathMappings:{...t,...S(e)},isServer:!0,isProd:!0}),entryPoints:[$],platform:"node",format:"cjs",legalComments:"none",outfile:H});try{return require((0,g.resolve)(H))}catch(r){return console.error("Unable to perform server side rendering since the server bundle is not correctly generated."),console.error(r),null}finally{await(0,f.unlink)(W)}}async function v(t,e){let r=new Date().getTime(),{entryPointsWithoutExtension:n,entryPointVirtualFiles:i}=await x(Object.keys(t));await A("public","build");let a,s;if(e){if([a,s]=await Promise.all([Z(i,t),$t(i,t)]),s==null)return!1}else a=await Z(i,t),s=null;let o=[...n,...Object.keys(t)].map(p=>{let h=a.filter(u=>u.startsWith("chunk")||u.startsWith(p)),l=E(s==null?void 0:s(p),h,!0);return{entryPoint:p,html:l}});await Promise.all(o.map(async({entryPoint:p,html:h})=>{let l;p.endsWith("index")?l=(0,g.join)(j,`${p}.html`):l=(0,g.join)(j,p,"index.html"),await(0,f.mkdir)((0,g.dirname)(l),{recursive:!0}),await(0,f.writeFile)(l,h)}));let m=new Date().getTime()-r;return console.error(`\u26A1 Build success in ${m}ms.`),!0}var V=c(require("http")),q=c(require("esbuild"));function wt(t,e){if(e==null||!e.startsWith("/"))return;let r=e.substring(1);return t.find(n=>n.endsWith("index")?[n,n.substring(0,n.length-5)].includes(r):n===r)}var tt=t=>E(void 0,[`${t}.js`,`${t}.css`],!1);async function D(t){let{entryPointsWithoutExtension:e,entryPointVirtualFiles:r}=await x(Object.keys(t)),n={...r,...S(t)},i=[...e,...Object.keys(t)],a=await(0,q.serve)({servedir:"public",port:19815},{...b({virtualPathMappings:n}),entryPoints:Object.keys(r),sourcemap:"inline",outdir:"public"}),s=(0,V.createServer)((o,m)=>{let p=wt(i,o.url);if(p!=null){m.writeHead(200,{"Content-Type":"text/html"}),m.end(tt(p));return}let h={hostname:a.host,port:a.port,path:o.url,method:o.method,headers:o.headers},l=(0,V.request)(h,u=>{if(u.statusCode===404){m.writeHead(200,{"Content-Type":"text/html"}),m.end(tt("index"));return}m.writeHead(u.statusCode||200,u.headers),u.pipe(m,{end:!0})});o.pipe(l,{end:!0})}).listen(3e3);console.error("Serving at http://localhost:3000"),await a.wait,s.close()}function et(){console.error("Usage:"),console.error("- esbuild-script start: start the devserver."),console.error("- esbuild-script build: generate production build."),console.error("- esbuild-script ssg: generate static site."),console.error("- esbuild-script help: display command line usages.")}async function xt(t){let e=process.argv[2]||"";switch(e){case"start":return await D(t),!0;case"ssg":return v(t,!0);case"build":return v(t,!1);case"help":case"--help":return et(),!0;default:return console.error(`Unknown command: '${e}'`),et(),!1}}async function rt(t){let e=t?await t():{};try{await xt(e)||(process.exitCode=1)}catch{process.exitCode=1}}0&&(module.exports={});
})();
//# sourceMappingURL=api.js.map
