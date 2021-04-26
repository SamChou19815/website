#!/usr/bin/env node --unhandled-rejections=strict
/* eslint-disable */
// prettier-ignore
(()=>{var de=Object.create,M=Object.defineProperty,fe=Object.getPrototypeOf,ge=Object.prototype.hasOwnProperty,Pe=Object.getOwnPropertyNames,he=Object.getOwnPropertyDescriptor;var ye=e=>M(e,"__esModule",{value:!0});var be=(e,t,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Pe(t))!ge.call(e,r)&&r!=="default"&&M(e,r,{get:()=>t[r],enumerable:!(o=he(t,r))||o.enumerable});return e},m=e=>be(ye(M(e!=null?de(fe(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var u=m(require("path")),J=m(require("esbuild"));var _=m(require("path")),Q=m(require("sass"));var z=m(require("fs")),N=m(require("path")),V=/()/,Se=[".tsx",".ts",".jsx",".mjs",".cjs",".js",".css",".json"],q=async e=>z.promises.readFile(e,"utf8"),we=e=>e.startsWith(".")?!1:!(e.startsWith("@")?e.substring(e.indexOf("/")+1):e).includes("/"),xe=()=>({name:"@yarnpkg/esbuild-plugin-pnp",setup(e){let{findPnpApi:t}=require("module");if(typeof t=="undefined")return;let o=process.cwd();e.onResolve({filter:V},async r=>{let n=r.importer?r.importer:`${o}/`,i=t(n);if(!i)return;let c=i.resolveRequest(r.path,n,{considerBuiltins:!0,extensions:Se});if(c==null)return{external:!0};if(e.initialOptions.platform==="browser"&&we(r.path)){let s=i.findPackageLocator(c);if(s!=null){let a=i.getPackageInformation(s).packageLocation,{browser:g}=await q((0,N.join)(a,"package.json")).then(d=>JSON.parse(d));if(typeof g=="string")return{namespace:"pnp",path:(0,N.join)(a,g)}}}return{namespace:"pnp",path:c}}),e.onLoad!==null&&e.onLoad({filter:V},async r=>({contents:await q(r.path),loader:"default"}))}}),K=xe;var Ee={name:"WebAppResolvePlugin",setup(e){e.onResolve({filter:/data:/},()=>({external:!0}))}},Te={name:"sass",setup(e){e.onResolve({filter:/.\.(scss|sass)$/},async t=>({path:(0,_.resolve)((0,_.dirname)(t.importer),t.path)})),e.onLoad({filter:/.\.(scss|sass)$/},async t=>{let{css:o}=await new Promise((r,n)=>{(0,Q.render)({file:t.path},(i,c)=>{i?n(i):r(c)})});return{contents:o.toString(),loader:"css",watchFiles:[t.path]}})}},Re=[Ee,Te,K()],X=Re;var ve=({isServer:e=!1,isProd:t=!1})=>({define:{__SERVER__:String(e),"process.env.NODE_ENV":t?'"production"':'"development"'},bundle:!0,minify:!1,legalComments:"linked",platform:"browser",target:"es2019",logLevel:"error",plugins:X}),v=ve;var S=m(require("path")),B=(0,S.join)(__dirname,"templates"),P=".temp",$=(0,S.join)(".temp","__server__.jsx"),h=(0,S.join)("src","pages"),C=(0,S.join)("build","__ssr.js"),Z=(0,S.join)("build","__ssr.css"),G="build";var x=m(require("path"));var l=m(require("fs")),y=m(require("path")),w=(e,t)=>o=>o?t(o):e(),A=e=>new Promise((t,o)=>(0,l.readdir)(e,(r,n)=>r?o(r):t(n))),ee=async e=>Promise.all((await A(e)).flatMap(async t=>{let o=(0,y.join)(e,t);return await W(o)?[o,...await ee(o)]:[o]})).then(t=>t.flat()),O=async(e,t)=>{await p(t),await I(t),await Promise.all((await A(e)).map(async o=>{let r=(0,y.join)(e,o),n=(0,y.join)(t,o);await W(r)?await O(r,n):await F(r,n)}))},F=(e,t)=>new Promise((o,r)=>(0,l.copyFile)(e,t,w(o,r))),I=async e=>{let t=await A(e);await Promise.all(t.map(o=>H((0,y.join)(e,o))))},p=e=>new Promise((t,o)=>(0,l.mkdir)(e,{recursive:!0},w(t,o))),W=e=>new Promise((t,o)=>(0,l.lstat)(e,(r,n)=>r?o(r):t(n.isDirectory()))),te=async(e,t)=>t?(await ee(e)).map(o=>(0,y.relative)(e,o)).sort((o,r)=>o.localeCompare(r)):A(e);var H=e=>new Promise((t,o)=>{l.readFile!=null?(0,l.rm)(e,{recursive:!0,force:!0},w(t,o)):W(e).then(r=>r?(0,l.rmdir)(e,{recursive:!0},w(t,o)):(0,l.unlink)(e,w(t,o))).catch(r=>o(r))}),f=(e,t)=>new Promise((o,r)=>(0,l.writeFile)(e,t,w(o,r)));var re="// @generated",oe=e=>e.endsWith("index")?e.substring(0,e.length-(e.endsWith("/index")?6:5)):e,_e=(e,t)=>{let o=oe(e),r=t.filter(s=>s!==e).map(oe),n=r.map((s,a)=>`const Component${a} = lazy(() => import('../src/pages/${s}'));`).join(""),i=r.map((s,a)=>`<Route exact path="/${s}"><Suspense fallback={null}><Component${a} /></Suspense></Route>`).join(""),c=`<Switch><Route exact path="/${o}"><Page /></Route>${i}</Switch>`;return`${re}
import React,{Suspense,lazy}from'react';import{hydrate,render}from'react-dom';
import {BrowserRouter,Route,Switch}from'esbuild-scripts/__internal-components__/react-router';
import Document from '../src/pages/_document.tsx';import Page from '../src/pages/${o}';${n}
const element = <BrowserRouter><Document>${c}</Document></BrowserRouter>;const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`},$e=e=>`${re}
import{createElement as h}from'react';import{renderToString}from'react-dom/server';import Helmet from 'esbuild-scripts/components/Head';
import Document from '../src/pages/_document.tsx';${e.map((t,o)=>`import Page${o} from '../src/pages/${t}';`).join("")}
const map = { ${e.map((t,o)=>`'${t}': Page${o}`).join(", ")} };
module.exports = (path) => ({ divHTML: renderToString(h(Document, {}, h(map[path]))), helmet: Helmet.renderStatic() });
`,Ce=async()=>(await p(h),(await te(h,!0)).map(t=>{switch((0,x.extname)(t)){case".js":case".jsx":case".ts":case".tsx":break;default:return null}return t.substring(0,t.lastIndexOf("."))}).filter(t=>t!=null&&!t.startsWith("_document"))),L=async()=>{let e=await Ce();return await p(P),await I(P),await Promise.all([...e.map(async t=>{let o=(0,x.join)(P,`${t}.jsx`);await p((0,x.dirname)(o)),await f(o,_e(t,e))}),f($,$e(e))]),e};var Ae=(e,t)=>t?`<script type="module" src="/${e}"></script>`:`<script src="/${e}"></script>`,Fe=(e,t)=>`<link rel="${t?"modulepreload":"preload"}" href="/${e}" />`,He=(e,{esModule:t,noJS:o})=>{let r=[],n=[];e.forEach(s=>{!o&&s.endsWith("js")?r.push(s):s.endsWith("css")&&n.push(s)});let i=n.map(s=>`<link rel="stylesheet" href="/${s}" />`).join("")+r.map(s=>Fe(s,t)).join(""),c=r.map(s=>Ae(s,t)).join("");return{headLinks:i,bodyScriptLinks:c}},ne=(e,t)=>t==null?`<head>${e}</head>`:`<head>${[t.meta.toString(),t.title.toString(),t.link.toString(),t.script.toString(),e].join("")}</head>`,Le=(e,t,o)=>{let{headLinks:r,bodyScriptLinks:n}=He(t,o);if(e==null){let g=ne(r),d=`<body><div id="root"></div>${n}</body>`;return`<!DOCTYPE html><html>${g}${d}</html>`}let{divHTML:i,helmet:c}=e,s=ne(r,c),a=`<body><div id="root">${i}</div>${n}</body>`;return`<!DOCTYPE html><html ${c.htmlAttributes.toString()}>${s}${a}</html>`},D=Le;var E=e=>process.stderr.isTTY?t=>`[${e}m${t}[0m`:t=>t,T=E(31),R=E(32),se=E(33),k=E(34),rt=E(35),ot=E(36);var ie=async e=>{let{outputFiles:t}=await(0,J.build)({...v({isProd:!0}),entryPoints:e.map(r=>(0,u.join)(P,`${r}.jsx`)),assetNames:"assets/[name]-[hash]",chunkNames:"chunks/[name]-[hash]",entryNames:"[dir]/[name]-[hash]",minify:!0,format:"esm",splitting:!0,write:!1,outdir:"build"}),o=(0,u.resolve)("build");return await Promise.all(t.map(async r=>{await p((0,u.dirname)(r.path)),await f(r.path,r.contents)})),t.map(({path:r})=>(0,u.relative)(o,r))},De=async()=>{await(0,J.build)({...v({isServer:!0,isProd:!0}),entryPoints:[$],platform:"node",format:"cjs",outfile:C});try{return require((0,u.resolve)(C))}catch(e){return console.error(T("Unable to perform server side rendering since the server bundle is not correctly generated.")),console.error(T(e)),null}finally{await Promise.all([H(C),H(Z)])}},ke=async({staticSiteGeneration:e,noJS:t})=>{let o=new Date().getTime();console.error(se("[i] Bundling..."));let r=await L();await O("public","build");let n,i;if(e){if([n,i]=await Promise.all([ie(r),De()]),i==null)return!1}else n=await ie(r),i=null;let c=r.map(a=>{let g=n.filter(U=>U.startsWith("chunk")||U.startsWith(a)),d=D(i==null?void 0:i(a),g,{esModule:!0,noJS:t});return{entryPoint:a,html:d}});await Promise.all(c.map(async({entryPoint:a,html:g})=>{let d;a.endsWith("index")?d=(0,u.join)(G,`${a}.html`):d=(0,u.join)(G,a,"index.html"),await p((0,u.dirname)(d)),await f(d,g)}));let s=new Date().getTime()-o;return console.error(`\u26A1 ${R(`Build success in ${s}ms.`)}`),!0},Y=ke;var b=m(require("path"));var je=async()=>{await p(h),await Promise.all([F((0,b.join)(B,"_document.tsx"),(0,b.join)(h,"_document.tsx")),F((0,b.join)(B,"index.tsx"),(0,b.join)(h,"index.tsx")),f((0,b.join)(h,"index.css"),""),f((0,b.join)("src","types.d.ts"),`/// <reference types="esbuild-scripts" />
`),p("public")]),console.error(R("esbuild-scripts app initialized."))},ae=je;var j=m(require("http")),le=m(require("path")),ce=m(require("esbuild"));var Me=(e,t)=>{if(t==null||!t.startsWith("/"))return;let o=t.substring(1);return e.find(r=>r.endsWith("index")?[r,r.substring(0,r.length-5)].includes(o):r===o)},me=e=>D(void 0,[`${e}.js`,`${e}.css`],{esModule:!1}),Ne=async()=>{let e=await L(),t=await(0,ce.serve)({servedir:"public",port:19815},{...v({}),entryPoints:e.map(r=>(0,le.join)(P,`${r}.jsx`)),sourcemap:"inline",outdir:"public"}),o=(0,j.createServer)((r,n)=>{let i=Me(e,r.url);if(i!=null){n.writeHead(200,{"Content-Type":"text/html"}),n.end(me(i));return}let c={hostname:t.host,port:t.port,path:r.url,method:r.method,headers:r.headers},s=(0,j.request)(c,a=>{if(a.statusCode===404){n.writeHead(200,{"Content-Type":"text/html"}),n.end(me("index"));return}n.writeHead(a.statusCode||200,a.headers),a.pipe(n,{end:!0})});r.pipe(s,{end:!0})}).listen(3e3);console.error(`${R("Serving at")} ${k("http://localhost:3000")}`),await t.wait,o.close()},ue=Ne;function pe(){console.error(k("Usage:")),console.error("- esbuild-script start: start the devserver."),console.error("- esbuild-script build: generate production build."),console.error("- esbuild-script ssg: generate static site."),console.error("- esbuild-script ssg --no-js: generate static site without JS."),console.error("- esbuild-script help: display command line usages.")}async function Be(){let e=process.argv[2]||"";switch(e){case"init":return await ae(),!0;case"start":return await ue(),!0;case"ssg":return Y({staticSiteGeneration:!0,noJS:process.argv.includes("--no-js")});case"build":return Y({staticSiteGeneration:!1,noJS:!1});case"help":case"--help":return pe(),!0;default:return console.error(T(`Unknown command: '${e}'`)),pe(),!1}}async function Ge(){try{await Be()||(process.exitCode=1)}catch(e){console.error(T(e)),process.exitCode=1}}Ge();})();
