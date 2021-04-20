#!/usr/bin/env node --unhandled-rejections=strict
/* eslint-disable */
// prettier-ignore
(()=>{var se=Object.create,A=Object.defineProperty,ie=Object.getPrototypeOf,ae=Object.prototype.hasOwnProperty,le=Object.getOwnPropertyNames,ce=Object.getOwnPropertyDescriptor;var me=e=>A(e,"__esModule",{value:!0});var ue=(e,t,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of le(t))!ae.call(e,r)&&r!=="default"&&A(e,r,{get:()=>t[r],enumerable:!(o=ce(t,r))||o.enumerable});return e},m=e=>ue(me(A(e!=null?se(ie(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var u=m(require("path")),G=m(require("esbuild"));var T=m(require("path")),Y=m(require("@yarnpkg/esbuild-plugin-pnp")),J=m(require("sass")),de={name:"WebAppResolvePlugin",setup(e){e.onResolve({filter:/data:/},()=>({external:!0}))}},pe={name:"sass",setup(e){e.onResolve({filter:/.\.(scss|sass)$/},async t=>({path:(0,T.resolve)((0,T.dirname)(t.importer),t.path)})),e.onLoad({filter:/.\.(scss|sass)$/},async t=>{let{css:o}=await new Promise((r,n)=>{(0,J.render)({file:t.path},(s,c)=>{s?n(s):r(c)})});return{contents:o.toString(),loader:"css",watchFiles:[t.path]}})}},ge=[de,pe,(0,Y.pnpPlugin)()],U=ge;var fe=({isServer:e=!1,isProd:t=!1})=>({define:{__SERVER__:String(e),"process.env.NODE_ENV":t?'"production"':'"development"'},bundle:!0,minify:!1,target:"es2019",logLevel:"error",loader:{".jpg":"file",".jpeg":"file",".gif":"file",".png":"file",".webp":"file",".pdf":"file"},plugins:U}),E=fe;var x=m(require("path")),p=".temp",v=(0,x.join)(".temp","__server__.jsx"),L=(0,x.join)("src","pages"),R=(0,x.join)("build","__ssr.js"),I=(0,x.join)("build","__ssr.css"),k="build";var y=m(require("path"));var i=m(require("fs")),f=m(require("path")),h=(e,t)=>o=>o?t(o):e(),$=e=>new Promise((t,o)=>(0,i.readdir)(e,(r,n)=>r?o(r):t(n))),V=async e=>Promise.all((await $(e)).flatMap(async t=>{let o=(0,f.join)(e,t);return await M(o)?[o,...await V(o)]:[o]})).then(t=>t.flat()),N=async(e,t)=>{await g(t),await B(t),await Promise.all((await $(e)).map(async o=>{let r=(0,f.join)(e,o),n=(0,f.join)(t,o);await M(r)?await N(r,n):await new Promise((s,c)=>(0,i.copyFile)(r,n,h(s,c)))}))},B=async e=>{let t=await $(e);await Promise.all(t.map(o=>_((0,f.join)(e,o))))},g=e=>new Promise((t,o)=>(0,i.mkdir)(e,{recursive:!0},h(t,o))),M=e=>new Promise((t,o)=>(0,i.lstat)(e,(r,n)=>r?o(r):t(n.isDirectory()))),z=async(e,t)=>t?(await V(e)).map(o=>(0,f.relative)(e,o)).sort((o,r)=>o.localeCompare(r)):$(e);var _=e=>new Promise((t,o)=>{i.readFile!=null?(0,i.rm)(e,{recursive:!0,force:!0},h(t,o)):M(e).then(r=>r?(0,i.rmdir)(e,{recursive:!0},h(t,o)):(0,i.unlink)(e,h(t,o))).catch(r=>o(r))}),P=(e,t)=>new Promise((o,r)=>(0,i.writeFile)(e,t,h(o,r)));var K="// @generated",Q=e=>e.endsWith("index")?e.substring(0,e.length-(e.endsWith("/index")?6:5)):e,he=(e,t)=>{let o=Q(e),r=t.filter(n=>n!==e).map(Q);return`${K}

import React, { Suspense, lazy } from 'react';
import { hydrate, render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'esbuild-scripts/__internal-components__/react-router';

import Document from '../src/pages/_document.tsx';
import Page from '../src/pages/${o}';

${r.map((n,s)=>`const Component${s} = lazy(() => import('../src/pages/${n}'));`).join(`
`)}

const element = (
  <BrowserRouter>
    <Document>
      <Switch>
        <Route exact path="/${o}"><Page /></Route>
${r.map((n,s)=>`        <Route exact path="/${n}"><Suspense fallback={null}><Component${s} /></Suspense></Route>`).join(`
`)}
      </Switch>
    </Document>
  </BrowserRouter>
);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(element, rootElement);
} else {
  render(element, rootElement);
}
`},Pe=e=>`${K}

import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'esbuild-scripts/components/Head'

import Document from '../src/pages/_document.tsx';
${e.map((t,o)=>`import Page${o} from '../src/pages/${t}';`).join(`
`)}

const components = {
${e.map((t,o)=>`  '${t}': Page${o},`).join(`
`)}
};

module.exports = (path) => {
  const Page = components[path];
  const divHTML = renderToString(<Document><Page /></Document>);
  const helmet = Helmet.renderStatic();
  return { divHTML, helmet };
};
`,ye=async()=>(await g(L),(await z(L,!0)).map(t=>{switch((0,y.extname)(t)){case".js":case".jsx":case".ts":case".tsx":break;default:return null}return t.substring(0,t.lastIndexOf("."))}).filter(t=>t!=null&&!t.startsWith("_document"))),C=async()=>{let e=await ye();return await g(p),await B(p),await Promise.all([...e.map(async t=>{let o=(0,y.join)(p,`${t}.jsx`);await g((0,y.dirname)(o)),await P(o,he(t,e))}),P(v,Pe(e))]),e};var Se=(e,t)=>t?`<script type="module" src="/${e}"></script>`:`<script src="/${e}"></script>`,be=(e,t)=>`<link rel="${t?"modulepreload":"preload"}" href="/${e}" />`,we=(e,{esModule:t,noJS:o})=>{let r=[],n=[];e.forEach(a=>{!o&&a.endsWith("js")?r.push(a):a.endsWith("css")&&n.push(a)});let s=n.map(a=>`<link rel="stylesheet" href="/${a}" />`).join("")+r.map(a=>be(a,t)).join(""),c=r.map(a=>Se(a,t)).join("");return{headLinks:s,bodyScriptLinks:c}},X=(e,t)=>t==null?`<head>${e}</head>`:`<head>${[t.meta.toString(),t.title.toString(),t.link.toString(),t.script.toString(),e].join("")}</head>`,Ee=(e,t,o)=>{let{headLinks:r,bodyScriptLinks:n}=we(t,o);if(e==null){let w=X(r),d=`<body><div id="root"></div>${n}</body>`;return`<!DOCTYPE html><html>${w}${d}</html>`}let{divHTML:s,helmet:c}=e,a=X(r,c),l=`<body><div id="root">${s}</div>${n}</body>`;return`<!DOCTYPE html><html ${c.htmlAttributes.toString()}>${a}${l}</html>`},H=Ee;var S=e=>process.stderr.isTTY?t=>`[${e}m${t}[0m`:t=>t,b=S(31),F=S(32),Z=S(33),D=S(34),Oe=S(35),Ye=S(36);var q=async e=>{let{outputFiles:t}=await(0,G.build)({...E({isProd:!0}),entryPoints:e.map(r=>(0,u.join)(p,`${r}.jsx`)),publicPath:"/",assetNames:"assets/[name]-[hash]",chunkNames:"chunks/[name]-[hash]",entryNames:"[dir]/[name]-[hash]",minify:!0,format:"esm",splitting:!0,write:!1,outdir:"build"}),o=(0,u.resolve)("build");return await Promise.all(t.map(async r=>{await g((0,u.dirname)(r.path)),await P(r.path,r.contents)})),t.map(({path:r})=>(0,u.relative)(o,r))},xe=async()=>{await(0,G.build)({...E({isServer:!0,isProd:!0}),entryPoints:[v],platform:"node",format:"cjs",outfile:R});try{return require((0,u.resolve)(R))}catch(e){return console.error(b("Unable to perform server side rendering since the server bundle is not correctly generated.")),console.error(b(e)),null}finally{await Promise.all([_(R),_(I)])}},Te=async({staticSiteGeneration:e,noJS:t})=>{let o=new Date().getTime();console.error(Z("[i] Bundling..."));let r=await C();await N("public","build");let n,s;if(e){if([n,s]=await Promise.all([q(r),xe()]),s==null)return!1}else n=await q(r),s=null;let c=r.map(l=>{let w=n.filter(O=>O.startsWith("chunk")||O.startsWith(l)),d=H(s==null?void 0:s(l),w,{esModule:!0,noJS:t});return{entryPoint:l,html:d}});await Promise.all(c.map(async({entryPoint:l,html:w})=>{let d;l.endsWith("index")?d=(0,u.join)(k,`${l}.html`):d=(0,u.join)(k,l,"index.html"),await g((0,u.dirname)(d)),await P(d,w)}));let a=new Date().getTime()-o;return console.error(`\u26A1 ${F(`Build success in ${a}ms.`)}`),!0},W=Te;var j=m(require("http")),ee=m(require("path")),te=m(require("esbuild"));var ve=(e,t)=>{if(t==null||!t.startsWith("/"))return;let o=t.substring(1);return e.find(r=>r.endsWith("index")?[r,r.substring(0,r.length-5)].includes(o):r===o)},re=e=>H(void 0,[`${e}.js`,`${e}.css`],{esModule:!1}),Re=async()=>{let e=await C(),t=await(0,te.serve)({servedir:"public",port:19815},{...E({}),entryPoints:e.map(r=>(0,ee.join)(p,`${r}.jsx`)),publicPath:"/",assetNames:"assets/[name]-[hash]",sourcemap:"inline",outdir:"public"}),o=(0,j.createServer)((r,n)=>{let s=ve(e,r.url);if(s!=null){n.writeHead(200,{"Content-Type":"text/html"}),n.end(re(s));return}let c={hostname:t.host,port:t.port,path:r.url,method:r.method,headers:r.headers},a=(0,j.request)(c,l=>{if(l.statusCode===404){n.writeHead(200,{"Content-Type":"text/html"}),n.end(re("index"));return}n.writeHead(l.statusCode||200,l.headers),l.pipe(n,{end:!0})});r.pipe(a,{end:!0})}).listen(3e3);console.error(`${F("Serving at")} ${D("http://localhost:3000")}`),await t.wait,o.close()},oe=Re;function ne(){console.error(D("Usage:")),console.error("- esbuild-script start: start the devserver."),console.error("- esbuild-script build: generate production build."),console.error("- esbuild-script ssg: generate static site."),console.error("- esbuild-script ssg --no-js: generate static site without JS."),console.error("- esbuild-script help: display command line usages.")}async function $e(){let e=process.argv[2]||"";switch(e){case"start":return await oe(),!0;case"ssg":return W({staticSiteGeneration:!0,noJS:process.argv.includes("--no-js")});case"build":return W({staticSiteGeneration:!1,noJS:!1});case"help":case"--help":return ne(),!0;default:return console.error(b(`Unknown command: '${e}'`)),ne(),!1}}async function _e(){try{await $e()||(process.exitCode=1)}catch(e){console.error(b(e)),process.exitCode=1}}_e();})();
