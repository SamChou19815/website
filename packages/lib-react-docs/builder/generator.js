// @generated
/* eslint-disable */
// prettier-ignore
(() => {
var b=Object.create;var p=Object.defineProperty;var D=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var C=Object.getPrototypeOf,$=Object.prototype.hasOwnProperty;var I=t=>p(t,"__esModule",{value:!0});var P=(t,r,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let o of w(r))!$.call(t,o)&&o!=="default"&&p(t,o,{get:()=>r[o],enumerable:!(n=D(r,o))||n.enumerable});return t},l=t=>P(I(p(t!=null?b(C(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var d=l(require("esbuild-scripts/api"));var i=l(require("path")),c=l(require("esbuild-scripts/api")),u=t=>t.substring(0,t.lastIndexOf("."));function x(t,r,n,o){return`// @generated
import React from 'react';
import DocPage from 'lib-react-docs/components/DocPage';
import Content from '${t}/docs/${o}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${r}\`}
    sidebar={${JSON.stringify(n)}}
    content={Content}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`}async function m({siteTitle:t,sideBarItems:r}){let n=(await c.utils.readDirectory("docs",!0)).filter(e=>(0,i.extname)(e)===".md"),o=await Promise.all(n.map(async e=>({documentPath:e,title:c.utils.parseMarkdownTitle(await c.utils.readFile((0,i.join)("docs",e)))}))),g=e=>Array.isArray(e)?e.map(a=>{let s=o.find(({documentPath:S})=>`/${u(S)}`===a);if(s==null)throw new Error(`No document with href ${a} found on disk.`);return{type:"link",href:`/docs${a}`,label:s.title}}):Object.entries(e).map(([a,s])=>({type:"category",label:a,items:g(s)})),f=g(r),y=(0,i.resolve)(".");return Object.fromEntries(o.map(({documentPath:e})=>[`docs/${u(e)}`,x(y,t,f,e)]))}(0,d.default)(async()=>{let t=JSON.parse(await d.utils.readFile("package.json")).reactDocs;switch(t.type){case"docs":return await m(t);default:console.error(`Unknown type: "${t.type}"`),process.exit(1)}});
})();
//# sourceMappingURL=generator.js.map
