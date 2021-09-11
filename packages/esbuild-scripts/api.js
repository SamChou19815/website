// @generated
/* eslint-disable */
// prettier-ignore
(() => {
var It=Object.create;var A=Object.defineProperty;var Dt=Object.getOwnPropertyDescriptor;var Ot=Object.getOwnPropertyNames;var Nt=Object.getPrototypeOf,Wt=Object.prototype.hasOwnProperty;var at=t=>A(t,"__esModule",{value:!0});var Bt=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),K=(t,e)=>{at(t);for(var r in e)A(t,r,{get:e[r],enumerable:!0})},Ut=(t,e,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Ot(e))!Wt.call(t,n)&&n!=="default"&&A(t,n,{get:()=>e[n],enumerable:!(r=Dt(e,n))||r.enumerable});return t},f=t=>Ut(at(A(t!=null?It(Nt(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var bt=Bt(tt=>{function R(t,e){if(typeof t=="string")return t;if(t){let r,n;if(Array.isArray(t)){for(r=0;r<t.length;r++)if(n=R(t[r],e))return n}else for(r in t)if(e.has(r))return R(t[r],e)}}function x(t,e,r){throw new Error(r?`No known conditions for "${e}" entry in "${t}" package`:`Missing "${e}" export in "${t}" package`)}function Pt(t,e){return e===t?".":e[0]==="."?e:e.replace(new RegExp("^"+t+"/"),"./")}function Xt(t,e=".",r={}){let{name:n,exports:i}=t;if(i){let{browser:o,require:a,conditions:s=[]}=r,l=Pt(n,e);if(l[0]!=="."&&(l="./"+l),typeof i=="string")return l==="."?i:x(n,l);let c=new Set(["default",...s]);c.add(a?"require":"import"),c.add(o?"browser":"node");let p,u,d=!1;for(p in i){d=p[0]!==".";break}if(d)return l==="."?R(i,c)||x(n,l,1):x(n,l);if(u=i[l])return R(u,c)||x(n,l,1);for(p in i){if(u=p[p.length-1],u==="/"&&l.startsWith(p))return(u=R(i[p],c))?u+l.substring(p.length):x(n,l,1);if(u==="*"&&l.startsWith(p.slice(0,-1))&&l.substring(p.length-1).length>0)return(u=R(i[p],c))?u.replace("*",l.substring(p.length-1)):x(n,l,1)}return x(n,l)}}function Yt(t,e={}){let r=0,n,i=e.browser,o=e.fields||["module","main"];for(i&&!o.includes("browser")&&o.unshift("browser");r<o.length;r++)if(n=t[o[r]]){if(typeof n!="string")if(typeof n=="object"&&o[r]=="browser"){if(typeof i=="string"&&(n=n[i=Pt(t.name,i)],n==null))return i}else continue;return typeof n=="string"?"./"+n.replace(/^\.?\//,""):n}}tt.legacy=Yt;tt.resolve=Xt});K(exports,{constants:()=>rt,default:()=>Ft,utils:()=>ye});var h=f(require("path")),it=f(require("esbuild"));var $t=f(require("module")),W=f(require("path")),Tt=f(require("sass"));var Z={};K(Z,{copyDirectoryContent:()=>L,copyFile:()=>$,emptyDirectory:()=>ut,ensureDirectory:()=>P,exists:()=>pt,isDirectory:()=>F,readDirectory:()=>Q,readFile:()=>C,remove:()=>I,writeFile:()=>w});var m=f(require("fs")),y=f(require("path")),S=(t,e)=>r=>r?e(r):t(),j=t=>new Promise((e,r)=>(0,m.readdir)(t,(n,i)=>n?r(n):e(i))),lt=async t=>Promise.all((await j(t)).flatMap(async e=>{let r=(0,y.join)(t,e);return await F(r)?[r,...await lt(r)]:[r]})).then(e=>e.flat()),L=async(t,e)=>{await P(e),await ut(e),await Promise.all((await j(t)).map(async r=>{let n=(0,y.join)(t,r),i=(0,y.join)(e,r);await F(n)?await L(n,i):await $(n,i)}))},$=(t,e)=>new Promise((r,n)=>(0,m.copyFile)(t,e,S(r,n))),ut=async t=>{let e=await j(t);await Promise.all(e.map(r=>I((0,y.join)(t,r))))},P=t=>new Promise((e,r)=>(0,m.mkdir)(t,{recursive:!0},S(e,r))),pt=t=>new Promise(e=>(0,m.access)(t,void 0,r=>e(r==null))),F=t=>new Promise((e,r)=>(0,m.lstat)(t,(n,i)=>n?r(n):e(i.isDirectory()))),Q=async(t,e)=>e?await pt(t)?(await lt(t)).map(r=>(0,y.relative)(t,r)).sort((r,n)=>r.localeCompare(n)):[]:j(t),C=t=>new Promise((e,r)=>(0,m.readFile)(t,(n,i)=>n?r(n):e(i.toString()))),I=t=>new Promise((e,r)=>{m.readFile!=null?(0,m.rm)(t,{recursive:!0,force:!0},S(e,r)):F(t).then(n=>n?(0,m.rmdir)(t,{recursive:!0},S(e,r)):(0,m.unlink)(t,S(e,r))).catch(n=>r(n))}),w=(t,e)=>new Promise((r,n)=>(0,m.writeFile)(t,e,S(r,n)));var gt=f(require("@mdx-js/mdx")),ht=f(require("remark-slug"));var ct=({level:t,label:e})=>`${"#".repeat(t)} ${e}`,Gt=t=>{let e=[],r=!1;return t.split(`
`).filter(i=>{if(i.startsWith("```"))r=!r;else return!r}).forEach(i=>{let o=i.trim();if(!o.startsWith("#"))return;let a=0;for(;o[a]==="#";)a+=1;if(a>6)throw new Error(`Invalid Header: '${o}'`);e.push({level:a,label:o.substring(a).trim()})}),e},mt=t=>{let e=Gt(t);if(e[0]==null)throw new Error("Lacking title.");if(e[0].level!==1)throw new Error(`First heading must be h1, found: ${ct(e[0])}`);if(e.filter(r=>r.level===1).length>1)throw new Error("More than one h1.");return e},dt=(t,e)=>{let r=t[e];if(r==null)throw new Error;let n=[],i=e+1;for(;i<t.length;){let{element:o,level:a,finishedIndex:s}=dt(t,i);if(a<=r.level)break;if(a>r.level+1){let l=ct({level:a,label:o.label});throw new Error(`Invalid header: ${l}. Expected Level: ${r.level+1}`)}i=s,n.push(o)}return{element:{label:r.label,children:n},level:r.level,finishedIndex:i}},Jt=t=>{let e=mt(t);return dt(e,0).element},ft=t=>{let e=mt(t)[0];if(e==null)throw new Error;return e.label},D=Jt;var qt=async(t,e)=>{let r=t.trim().split(`
`).slice(1),n;if(e){let i=r.findIndex(o=>o.trimStart().startsWith("<!--")&&o.includes("truncate"));n=r.slice(0,i).join(`
`)}else n=r.join(`
`);return n=n.trim(),`import React from 'react';
import mdx from 'esbuild-scripts/__internal-components__/mdx';
${await(0,gt.default)(n,{remarkPlugins:[ht.default]})}
MDXContent.truncated = ${e};
MDXContent.toc = ${JSON.stringify(D(t),void 0,2)};
MDXContent.additionalProperties = typeof additionalProperties === 'undefined' ? undefined : additionalProperties;
`},T=qt;var wt=f(require("fs"));var O=f(require("fs")),g=f(require("path")),N=f(bt()),zt=[".tsx",".ts",".jsx",".mjs",".cjs",".js",".json"],Kt=/^(\/|\.{1,2}(\/|$))/,Qt=/^\.{0,2}\//,Zt=(t,e,r)=>{let n=(0,N.resolve)(t,e,{browser:r,require:!r});if(n!=null)return n;let i=(0,N.legacy)(t,r?{browser:r}:{browser:!1,fields:["main","module"]});return typeof i=="string"?e==="."?i:null:i&&(i[e]||i[`${e}.js`]||i[`./${e}`]||i[`./${e}.js`])||null},te=(t,e)=>{let r=(0,g.normalize)(t),n=(0,g.normalize)(e);return r===n?".":(r.endsWith(g.sep)||(r=r+g.sep),n.startsWith(r)?n.slice(r.length):null)},ee=(t,e,r)=>{let n=e.findPackageLocator((0,g.join)(t,"internal.js"));if(n==null)throw new Error;let{packageLocation:i}=e.getPackageInformation(n),o=(0,g.join)(i,"package.json");if(!O.existsSync(o))return null;let a=JSON.parse(O.readFileSync(o,"utf8")),s=te(i,t);if(s==null)throw new Error;Qt.test(s)||(s=`./${s}`),s=(0,g.normalize)(s);let l=Zt(a,s,r);return l!=null?(0,g.join)(i,l):null},re=(t,e,r,n)=>{if(Kt.test(t))return e;let i=ee(e,r,n);return i?(0,g.normalize)(i):e},ne=(t,e,r,n)=>{let i=r.resolveToUnqualified(t,e);return i==null?null:r.resolveUnqualified(re(t,i,r,n),{extensions:zt})},yt=ne;var xt=/()/,ie=()=>({name:"esbuild-scripts-esbuild-plugin-pnp",setup(t){let{findPnpApi:e}=require("module");if(typeof e=="undefined")return;let r=process.cwd();t.onResolve({filter:xt},async n=>{let i=n.importer?n.importer:`${r}/`,o=e(i);if(!o)return;let a=n.path.lastIndexOf("?"),s=a===-1?n.path:n.path.substring(0,a),l=yt(s,i,o,t.initialOptions.platform!=="node");return l==null?{external:!0}:{namespace:"pnp",path:`${l}${a===-1?"":n.path.substring(a)}`}}),t.onLoad!==null&&t.onLoad({filter:xt},async n=>({contents:await wt.promises.readFile(n.path,"utf8"),loader:"default"}))}}),vt=ie;var St=/^esbuild-scripts-internal\/virtual\//,oe=t=>({name:"VirtualPathResolvePlugin",setup(e){e.onResolve({filter:St},r=>({path:r.path,namespace:"virtual-path"})),e.onLoad({filter:St,namespace:"virtual-path"},r=>({contents:t[r.path],loader:"jsx"}))}}),Rt=oe;var se={name:"WebAppResolvePlugin",setup(t){t.onResolve({filter:/^data:/},()=>({external:!0}))}},ae={name:"sass",setup(t){t.onResolve({filter:/.\.(scss|sass)$/},async e=>e.path.startsWith(".")?{path:(0,W.resolve)((0,W.dirname)(e.importer),e.path)}:{path:(0,$t.createRequire)(e.importer).resolve(e.path)}),t.onLoad({filter:/.\.(scss|sass)$/},async e=>{let{css:r}=await new Promise((n,i)=>{(0,Tt.render)({file:e.path},(o,a)=>{o?i(o):n(a)})});return{contents:r.toString(),loader:"css",watchFiles:[e.path]}})}},le={name:"mdx",setup(t){t.onLoad({filter:/\.md\?truncated=true$/},async e=>({contents:await T(await C(e.path.substring(0,e.path.lastIndexOf("?"))),!0),loader:"jsx"})),t.onLoad({filter:/\.md$/},async e=>({contents:await T(await C(e.path),!1),loader:"jsx"}))}},ue=t=>[se,Rt(t),ae,le,vt()],_t=ue;var pe=({virtualPathMappings:t,isServer:e=!1,isProd:r=!1})=>({define:{__dirname:'""',__SERVER__:String(e),"process.env.NODE_ENV":r?'"production"':'"development"'},bundle:!0,minify:!1,legalComments:"linked",platform:"browser",target:"es2019",logLevel:"error",plugins:_t(t)}),_=pe;var rt={};K(rt,{BUILD_PATH:()=>G,PAGES_PATH:()=>b,SSR_CSS_PATH:()=>et,SSR_JS_PATH:()=>U,TEMPLATE_PATH:()=>B,VIRTUAL_GENERATED_ENTRY_POINT_PATH_PREFIX:()=>M,VIRTUAL_PATH_PREFIX:()=>k,VIRTUAL_SERVER_ENTRY_PATH:()=>H});var E=f(require("path")),B=(0,E.join)(__dirname,"templates"),b=(0,E.join)("src","pages"),U=(0,E.join)("build","__ssr.jsx"),et=(0,E.join)("build","__ssr.css"),G="build",k="esbuild-scripts-internal/virtual/",M=`${k}__generated-entry-point__/`,H=`${M}__server__.jsx`;var J=f(require("path"));var Et="// @generated",nt=t=>t.endsWith("index")?t.substring(0,t.length-(t.endsWith("/index")?6:5)):t,kt=(t,e,r)=>r?`${t}/src/pages/${e}`:`${k}${e}`,Mt=(t,e,r,n,i)=>{let o=n.filter(u=>u!==e),a=i.filter(u=>u!==e),s=(u,d)=>kt(t,u,d),l=[...o.map((u,d)=>`const RealComponent${d} = lazy(() => import('${s(u,!0)}'));`),...a.map((u,d)=>`const VirtualComponent${d} = lazy(() => import('${s(u,!1)}'));`)].join(`
`),c=s(e,r),p=[...o.map((u,d)=>`        <Route exact path="/${nt(u)}"><Suspense fallback={null}><RealComponent${d} /></Suspense></Route>`),...a.map((u,d)=>`        <Route exact path="/${nt(u)}"><Suspense fallback={null}><VirtualComponent${d} /></Suspense></Route>`)].join(`
`);return`${Et}
import React,{Suspense,lazy} from 'react';
import {hydrate,render} from 'react-dom';
import {BrowserRouter,Route,Switch} from 'esbuild-scripts/__internal-components__/react-router';
import Document from '${t}/src/pages/_document';
import Page from '${c}';
${l}
const element = (
  <BrowserRouter>
    <Document>
      <Switch>
        <Route exact path="/${nt(e)}"><Page /></Route>
${p}
      </Switch>
    </Document>
  </BrowserRouter>
);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`},ce=(t,e,r)=>{let n=(a,s)=>kt(t,a,s),i=[...e.map((a,s)=>`import RealPage${s} from '${n(a,!0)}';`),...r.map((a,s)=>`import VirtualPage${s} from '${n(a,!1)}';`)].join(`
`),o=[...e.map((a,s)=>`'${a}': RealPage${s}`),...r.map((a,s)=>`'${a}': VirtualPage${s}`)].join(", ");return`${Et}
import React from 'react';
import {renderToString} from 'react-dom/server';
import Helmet from 'esbuild-scripts/components/Head';
import {StaticRouter} from 'esbuild-scripts/__internal-components__/react-router';
import Document from '${t}/src/pages/_document';
${i}
const map = { ${o} };
module.exports = (path) => ({
  divHTML: renderToString(
    <StaticRouter location={'/'+path}>
      <Document>{React.createElement(map[path])}</Document>
    </StaticRouter>
  ),
  noJS: map[path].noJS,
  helmet: Helmet.renderStatic(),
});
`},me=async()=>(await P(b),(await Q(b,!0)).map(t=>{switch((0,J.extname)(t)){case".js":case".jsx":case".ts":case".tsx":break;default:return null}return t.substring(0,t.lastIndexOf("."))}).filter(t=>t!=null&&!t.startsWith("_document"))),V=t=>Object.fromEntries(Object.entries(t).map(([e,r])=>[`${k}${e}`,r])),q=async t=>{let e=(0,J.resolve)("."),r=await me(),n=Object.fromEntries([...r.map(i=>[`${M}${i}.jsx`,Mt(e,i,!0,r,t)]),...t.map(i=>[`${M}${i}.jsx`,Mt(e,i,!1,r,t)])]);return n[H]=ce(e,r,t),{entryPointsWithoutExtension:r,entryPointVirtualFiles:n}};var de=(t,e)=>e?`<script type="module" src="/${t}"><\/script>`:`<script src="/${t}"><\/script>`,fe=(t,e)=>`<link rel="${e?"modulepreload":"preload"}" href="/${t}" />`,ge=(t,e,r)=>{let n=[],i=[];t.forEach(s=>{!r&&s.endsWith("js")?n.push(s):s.endsWith("css")&&i.push(s)});let o=i.map(s=>`<link rel="stylesheet" href="/${s}" />`).join("")+n.map(s=>fe(s,e)).join(""),a=n.map(s=>de(s,e)).join("");return{headLinks:o,bodyScriptLinks:a}},Ht=(t,e)=>e==null?`<head>${t}</head>`:`<head>${[e.meta.toString(),e.title.toString(),e.link.toString(),e.script.toString(),t].join("")}</head>`,he=(t,e,r)=>{let{headLinks:n,bodyScriptLinks:i}=ge(e,r,t==null?void 0:t.noJS);if(t==null){let c=Ht(n),p=`<body><div id="root"></div>${i}</body>`;return`<!DOCTYPE html><html>${c}${p}</html>`}let{divHTML:o,helmet:a}=t,s=Ht(n,a),l=`<body><div id="root">${o}</div>${i}</body>`;return`<!DOCTYPE html><html ${a.htmlAttributes.toString()}>${s}${l}</html>`},X=he;async function Vt(t,e){let r={...t,...V(e)},{outputFiles:n}=await(0,it.build)({..._({virtualPathMappings:r,isProd:!0}),entryPoints:Object.keys(t),assetNames:"assets/[name]-[hash]",chunkNames:"chunks/[name]-[hash]",entryNames:"[dir]/[name]-[hash]",minify:!0,format:"esm",splitting:!0,write:!1,outdir:"build"}),i=(0,h.resolve)("build");return await Promise.all(n.map(async o=>{await P((0,h.dirname)(o.path)),await w(o.path,o.contents)})),n.map(({path:o})=>(0,h.relative)(i,o))}async function Pe(t,e){await(0,it.build)({..._({virtualPathMappings:{...t,...V(e)},isServer:!0,isProd:!0}),entryPoints:[H],platform:"node",format:"cjs",legalComments:"none",outfile:U});try{return require((0,h.resolve)(U))}catch(r){return console.error("Unable to perform server side rendering since the server bundle is not correctly generated."),console.error(r),null}finally{await I(et)}}async function Y(t,e){let r=new Date().getTime(),{entryPointsWithoutExtension:n,entryPointVirtualFiles:i}=await q(Object.keys(t));await L("public","build");let o,a;if(e){if([o,a]=await Promise.all([Vt(i,t),Pe(i,t)]),a==null)return!1}else o=await Vt(i,t),a=null;let s=[...n,...Object.keys(t)].map(c=>{let p=o.filter(d=>d.startsWith("chunk")||d.startsWith(c)),u=X(a==null?void 0:a(c),p,!0);return{entryPoint:c,html:u}});await Promise.all(s.map(async({entryPoint:c,html:p})=>{let u;c.endsWith("index")?u=(0,h.join)(G,`${c}.html`):u=(0,h.join)(G,c,"index.html"),await P((0,h.dirname)(u)),await w(u,p)}));let l=new Date().getTime()-r;return console.error(`\u26A1 Build success in ${l}ms.`),!0}var v=f(require("path"));async function ot(){await P(b),await Promise.all([$((0,v.join)(B,"_document.tsx"),(0,v.join)(b,"_document.tsx")),$((0,v.join)(B,"index.tsx"),(0,v.join)(b,"index.tsx")),w((0,v.join)(b,"index.css"),""),w((0,v.join)("src","types.d.ts"),`/// <reference types="esbuild-scripts" />
`),P("public")])}var z=f(require("http")),At=f(require("esbuild"));function be(t,e){if(e==null||!e.startsWith("/"))return;let r=e.substring(1);return t.find(n=>n.endsWith("index")?[n,n.substring(0,n.length-5)].includes(r):n===r)}var jt=t=>X(void 0,[`${t}.js`,`${t}.css`],!1);async function st(t){let{entryPointsWithoutExtension:e,entryPointVirtualFiles:r}=await q(Object.keys(t)),n={...r,...V(t)},i=[...e,...Object.keys(t)],o=await(0,At.serve)({servedir:"public",port:19815},{..._({virtualPathMappings:n}),entryPoints:Object.keys(r),sourcemap:"inline",outdir:"public"}),a=(0,z.createServer)((s,l)=>{let c=be(i,s.url);if(c!=null){l.writeHead(200,{"Content-Type":"text/html"}),l.end(jt(c));return}let p={hostname:o.host,port:o.port,path:s.url,method:s.method,headers:s.headers},u=(0,z.request)(p,d=>{if(d.statusCode===404){l.writeHead(200,{"Content-Type":"text/html"}),l.end(jt("index"));return}l.writeHead(d.statusCode||200,d.headers),d.pipe(l,{end:!0})});s.pipe(u,{end:!0})}).listen(3e3);console.error("Serving at http://localhost:3000"),await o.wait,a.close()}var ye={...Z,parseMarkdownHeaderTree:D,parseMarkdownTitle:ft,compileMarkdownToReact:T};function Lt(){console.error("Usage:"),console.error("- esbuild-script start: start the devserver."),console.error("- esbuild-script build: generate production build."),console.error("- esbuild-script ssg: generate static site."),console.error("- esbuild-script ssg --no-js: generate static site without JS."),console.error("- esbuild-script help: display command line usages.")}async function we(t){let e=process.argv[2]||"";switch(e){case"init":return await ot(),!0;case"start":return await st(t),!0;case"ssg":return Y(t,!0);case"build":return Y(t,!1);case"help":case"--help":return Lt(),!0;default:return console.error(`Unknown command: '${e}'`),Lt(),!1}}async function Ft(t){let e=t?await t():{};try{await we(e)||(process.exitCode=1)}catch(r){console.error(r),process.exitCode=1}}0&&(module.exports={constants,utils});
})();
//# sourceMappingURL=api.js.map
