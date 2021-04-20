#!/usr/bin/env node --unhandled-rejections=strict
/* eslint-disable */
// prettier-ignore
(()=>{var ne=Object.create,j=Object.defineProperty,se=Object.getPrototypeOf,ie=Object.prototype.hasOwnProperty,ae=Object.getOwnPropertyNames,le=Object.getOwnPropertyDescriptor;var ce=e=>j(e,"__esModule",{value:!0});var me=(e,t,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of ae(t))!ie.call(e,r)&&r!=="default"&&j(e,r,{get:()=>t[r],enumerable:!(o=le(t,r))||o.enumerable});return e},m=e=>me(ce(j(e!=null?ne(se(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var u=m(require("path")),W=m(require("esbuild"));var v=m(require("path")),J=m(require("@yarnpkg/esbuild-plugin-pnp")),U=m(require("sass")),ue={name:"WebAppResolvePlugin",setup(e){e.onResolve({filter:/data:/},()=>({external:!0}))}},de={name:"sass",setup(e){e.onResolve({filter:/.\.(scss|sass)$/},async t=>({path:(0,v.resolve)((0,v.dirname)(t.importer),t.path)})),e.onLoad({filter:/.\.(scss|sass)$/},async t=>{let{css:o}=await new Promise((r,n)=>{(0,U.render)({file:t.path},(s,c)=>{s?n(s):r(c)})});return{contents:o.toString(),loader:"css",watchFiles:[t.path]}})}},pe=[ue,de,(0,J.pnpPlugin)()],I=pe;var fe=({isServer:e=!1,isProd:t=!1})=>({define:{__SERVER__:String(e),"process.env.NODE_ENV":t?'"production"':'"development"'},bundle:!0,minify:!1,target:"es2019",logLevel:"error",loader:{".jpg":"file",".jpeg":"file",".gif":"file",".png":"file",".webp":"file",".pdf":"file"},plugins:I}),E=fe;var T=m(require("path")),p=".temp",x=(0,T.join)(".temp","__server__.jsx"),M=(0,T.join)("src","pages"),R=(0,T.join)("build","__ssr.js"),V=(0,T.join)("build","__ssr.css"),k="build";var y=m(require("path"));var i=m(require("fs")),g=m(require("path")),h=(e,t)=>o=>o?t(o):e(),_=e=>new Promise((t,o)=>(0,i.readdir)(e,(r,n)=>r?o(r):t(n))),z=async e=>Promise.all((await _(e)).flatMap(async t=>{let o=(0,g.join)(e,t);return await N(o)?[o,...await z(o)]:[o]})).then(t=>t.flat()),B=async(e,t)=>{await f(t),await G(t),await Promise.all((await _(e)).map(async o=>{let r=(0,g.join)(e,o),n=(0,g.join)(t,o);await N(r)?await B(r,n):await new Promise((s,c)=>(0,i.copyFile)(r,n,h(s,c)))}))},G=async e=>{let t=await _(e);await Promise.all(t.map(o=>$((0,g.join)(e,o))))},f=e=>new Promise((t,o)=>(0,i.mkdir)(e,{recursive:!0},h(t,o))),N=e=>new Promise((t,o)=>(0,i.lstat)(e,(r,n)=>r?o(r):t(n.isDirectory()))),K=async(e,t)=>t?(await z(e)).map(o=>(0,g.relative)(e,o)).sort((o,r)=>o.localeCompare(r)):_(e);var $=e=>new Promise((t,o)=>{i.readFile!=null?(0,i.rm)(e,{recursive:!0,force:!0},h(t,o)):N(e).then(r=>r?(0,i.rmdir)(e,{recursive:!0},h(t,o)):(0,i.unlink)(e,h(t,o))).catch(r=>o(r))}),P=(e,t)=>new Promise((o,r)=>(0,i.writeFile)(e,t,h(o,r)));var Q="// @generated",ge=e=>`${Q}

import React from 'react';
import { hydrate, render } from 'react-dom';
import BrowserRouter from 'esbuild-scripts/components/BrowserRouter';

import Document from '../src/pages/_document.tsx';
import Page from '../src/pages/${e}';

const element = (
  <BrowserRouter>
    <Document>
      <Page />
    </Document>
  </BrowserRouter>
);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(element, rootElement);
} else {
  render(element, rootElement);
}
`,he=e=>`${Q}

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
`,Pe=async()=>(await f(M),(await K(M,!0)).map(t=>{switch((0,y.extname)(t)){case".js":case".jsx":case".ts":case".tsx":break;default:return null}return t.substring(0,t.lastIndexOf("."))}).filter(t=>t!=null&&!t.startsWith("_document"))),C=async()=>{let e=await Pe();return await f(p),await G(p),await Promise.all([...e.map(async t=>{let o=(0,y.join)(p,`${t}.jsx`);await f((0,y.dirname)(o)),await P(o,ge(t))}),P(x,he(e))]),e};var ye=(e,t)=>t?`<script type="module" src="/${e}"></script>`:`<script src="/${e}"></script>`,be=(e,t)=>`<link rel="${t?"modulepreload":"preload"}" href="/${e}" />`,Se=(e,{esModule:t,noJS:o})=>{let r=[],n=[];e.forEach(a=>{!o&&a.endsWith("js")?r.push(a):a.endsWith("css")&&n.push(a)});let s=n.map(a=>`<link rel="stylesheet" href="/${a}" />`).join("")+r.map(a=>be(a,t)).join(""),c=r.map(a=>ye(a,t)).join("");return{headLinks:s,bodyScriptLinks:c}},X=(e,t)=>t==null?`<head>${e}</head>`:`<head>${[t.meta.toString(),t.title.toString(),t.link.toString(),t.script.toString(),e].join("")}</head>`,we=(e,t,o)=>{let{headLinks:r,bodyScriptLinks:n}=Se(t,o);if(e==null){let w=X(r),d=`<body><div id="root"></div>${n}</body>`;return`<!DOCTYPE html><html>${w}${d}</html>`}let{divHTML:s,helmet:c}=e,a=X(r,c),l=`<body><div id="root">${s}</div>${n}</body>`;return`<!DOCTYPE html><html ${c.htmlAttributes.toString()}>${a}${l}</html>`},H=we;var b=e=>process.stderr.isTTY?t=>`[${e}m${t}[0m`:t=>t,S=b(31),D=b(32),Z=b(33),F=b(34),Be=b(35),Ge=b(36);async function q(e){let{outputFiles:t}=await(0,W.build)({...E({isProd:!0}),entryPoints:e.map(r=>(0,u.join)(p,`${r}.jsx`)),publicPath:"/",assetNames:"assets/[name]-[hash]",chunkNames:"chunks/[name]-[hash]",entryNames:"[dir]/[name]-[hash]",minify:!0,format:"esm",splitting:!0,write:!1,outdir:"build"}),o=(0,u.resolve)("build");return await Promise.all(t.map(async r=>{await f((0,u.dirname)(r.path)),await P(r.path,r.contents)})),t.map(({path:r})=>(0,u.relative)(o,r))}async function Ee(){await(0,W.build)({...E({isServer:!0,isProd:!0}),entryPoints:[x],platform:"node",format:"cjs",outfile:R});try{return require((0,u.resolve)(R))}catch(e){return console.error(S("Unable to perform server side rendering since the server bundle is not correctly generated.")),console.error(S(e)),null}finally{await Promise.all([$(R),$(V)])}}async function A({staticSiteGeneration:e,noJS:t}){let o=new Date().getTime();console.error(Z("[i] Bundling..."));let r=await C();await B("public","build");let n,s;if(e){if([n,s]=await Promise.all([q(r),Ee()]),s==null)return!1}else n=await q(r),s=null;let c=r.map(l=>{let w=n.filter(Y=>Y.startsWith("chunk")||Y.startsWith(l)),d=H(s==null?void 0:s(l),w,{esModule:!0,noJS:t});return{entryPoint:l,html:d}});await Promise.all(c.map(async({entryPoint:l,html:w})=>{let d;l.endsWith("index")?d=(0,u.join)(k,`${l}.html`):d=(0,u.join)(k,l,"index.html"),await f((0,u.dirname)(d)),await P(d,w)}));let a=new Date().getTime()-o;return console.error(`\u26A1 ${D(`Build success in ${a}ms.`)}`),!0}var L=m(require("http")),ee=m(require("path")),te=m(require("esbuild"));var Te=(e,t)=>{if(t==null||!t.startsWith("/"))return;let o=t.substring(1);return e.find(r=>r.endsWith("index")?[r,r.substring(0,r.length-5)].includes(o):r===o)},re=e=>H(void 0,[`${e}.js`,`${e}.css`],{esModule:!1});async function O(){let e=await C(),t=await(0,te.serve)({servedir:"public",port:19815},{...E({}),entryPoints:e.map(r=>(0,ee.join)(p,`${r}.jsx`)),publicPath:"/",assetNames:"assets/[name]-[hash]",sourcemap:"inline",outdir:"public"}),o=(0,L.createServer)((r,n)=>{let s=Te(e,r.url);if(s!=null){n.writeHead(200,{"Content-Type":"text/html"}),n.end(re(s));return}let c={hostname:t.host,port:t.port,path:r.url,method:r.method,headers:r.headers},a=(0,L.request)(c,l=>{if(l.statusCode===404){n.writeHead(200,{"Content-Type":"text/html"}),n.end(re("index"));return}n.writeHead(l.statusCode||200,l.headers),l.pipe(n,{end:!0})});r.pipe(a,{end:!0})}).listen(3e3);console.error(`${D("Serving at")} ${F("http://localhost:3000")}`),await t.wait,o.close()}function oe(){console.error(F("Usage:")),console.error("- esbuild-script start: start the devserver."),console.error("- esbuild-script build: generate production build."),console.error("- esbuild-script ssg: generate static site."),console.error("- esbuild-script ssg --no-js: generate static site without JS."),console.error("- esbuild-script help: display command line usages.")}async function ve(){let e=process.argv[2]||"";switch(e){case"start":return await O(),!0;case"ssg":return A({staticSiteGeneration:!0,noJS:process.argv.includes("--no-js")});case"build":return A({staticSiteGeneration:!1,noJS:!1});case"help":case"--help":return oe(),!0;default:return console.error(S(`Unknown command: '${e}'`)),oe(),!1}}async function xe(){try{await ve()||(process.exitCode=1)}catch(e){console.error(S(e)),process.exitCode=1}}xe();})();
