// @generated
/* eslint-disable */
// prettier-ignore
(() => {
var h=Object.create,S=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames;var I=Object.getPrototypeOf,k=Object.prototype.hasOwnProperty;var N=t=>S(t,"__esModule",{value:!0});var O=(t,e,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of B(e))!k.call(t,r)&&r!=="default"&&S(t,r,{get:()=>e[r],enumerable:!(o=x(e,r))||o.enumerable});return t},u=t=>O(N(S(t!=null?h(I(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var $=u(require("esbuild-scripts/api"));var c=u(require("path")),f=u(require("esbuild-scripts/api"));function V(t){if(t==null)throw new Error(`Value is asserted to be not null, but it is ${t}.`)}var y=t=>(V(t),t);var P="blog",E=async()=>await Promise.all((await f.utils.readDirectory(P,!0)).filter(t=>(0,c.extname)(t)===".md").map(async t=>{let e=t.substring(0,t.lastIndexOf(".")),o=e.split("-"),r=y(o[0]),n=y(o[1]),s=y(o[2]),m=o.slice(3).join("-"),a=`${r}-${n}-${s}`,i=new Date(a).toISOString(),l=`/${r}/${n}/${s}/${m}`,g=await f.utils.readFile((0,c.join)(P,t));try{let p=f.utils.parseMarkdownTitle(g);return{original:t,withOutExtension:e,date:i,formattedDate:a,path:(0,c.join)(r,n,s,m),permalink:l,title:p}}catch(p){throw new Error(`Failed to parse ${t}, error: ${p.message}`)}})),T=async()=>{let t=await E();return t.map((e,o)=>{let{original:r,date:n,formattedDate:s,path:m,permalink:a}=e,i=t[o-1],l=t[o+1],g={date:n,formattedDate:s,permalink:a,nextItem:l!=null?{title:l.title,permalink:l.permalink}:void 0,prevItem:i!=null?{title:i.title,permalink:i.permalink}:void 0},p=JSON.stringify(g);return{original:r,path:m,metadataString:p}})},R=(t,e)=>e.map(o=>{let{original:r,metadataString:n}=o,s=(0,c.resolve)((0,c.join)(P,r));return[o.path,`import React from 'react';
import BlogPostPage from 'lib-react-docs/components/BlogPostPage';
import Content from '${s}';
const Page = () => <BlogPostPage siteTitle=${t} content={Content} metadata={${n}} />;
export default Page;
`]}),j=(t,e)=>{let o=e.map(({original:n},s)=>`import Component${s} from '../../blog/${n}?truncated=true';`).join(`
`),r=e.map(({metadataString:n},s)=>`  { content: Component${s}, metadata: ${n} },
`).join("");return`// @generated
import React from 'react';
import BlogListPage from 'lib-react-docs/components/BlogListPage';
${o}

const items = [
${r}];

const Page = () => <BlogListPage siteTitle=${t} items={items} />;
export default Page;
`},v=async t=>{await f.utils.ensureDirectory(P);let e=(await T()).sort((r,n)=>n.original.localeCompare(r.original)),o=JSON.stringify(t);return Object.fromEntries([...R(o,e),["index",j(o,e)]])},D=v;var d=u(require("path")),b=u(require("esbuild-scripts/api")),w=t=>t.substring(0,t.lastIndexOf(".")),F=(t,e,o,r)=>`// @generated
import React from 'react';
import DocPage from 'lib-react-docs/components/DocPage';
import Content from '${t}/docs/${r}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${e}\`}
    sidebar={${JSON.stringify(o)}}
    content={Content}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`,M=async({siteTitle:t,sideBarItems:e})=>{let o=(await b.utils.readDirectory("docs",!0)).filter(a=>(0,d.extname)(a)===".md"),r=await Promise.all(o.map(async a=>({documentPath:a,title:b.utils.parseMarkdownTitle(await b.utils.readFile((0,d.join)("docs",a)))}))),n=a=>Array.isArray(a)?a.map(i=>{let l=r.find(({documentPath:g})=>`/${w(g)}`===i);if(l==null)throw new Error(`No document with href ${i} found on disk.`);return{type:"link",href:`/docs${i}`,label:l.title}}):Object.entries(a).map(([i,l])=>({type:"category",label:i,items:n(l)})),s=n(e),m=(0,d.resolve)(".");return Object.fromEntries(r.map(({documentPath:a})=>[`docs/${w(a)}`,F(m,t,s,a)]))},C=M;(0,$.default)(async()=>{let t=JSON.parse(await $.utils.readFile("package.json")).reactDocs;switch(t.type){case"docs":return await C(t);case"blog":return await D(t.siteTitle);default:console.error(`Unknown type: "${t.type}"`),process.exit(1)}});
})();
