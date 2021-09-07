// @generated
/* eslint-disable */
// prettier-ignore
(() => {
var C=Object.create;var S=Object.defineProperty;var B=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var h=Object.getPrototypeOf,x=Object.prototype.hasOwnProperty;var O=t=>S(t,"__esModule",{value:!0});var k=(t,e,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of I(e))!x.call(t,o)&&o!=="default"&&S(t,o,{get:()=>e[o],enumerable:!(r=B(e,o))||r.enumerable});return t},u=t=>k(O(S(t!=null?C(h(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var $=u(require("esbuild-scripts/api"));var c=u(require("path")),f=u(require("esbuild-scripts/api")),y="blog",E=async()=>await Promise.all((await f.utils.readDirectory(y,!0)).filter(t=>(0,c.extname)(t)===".md").map(async t=>{let e=t.substring(0,t.lastIndexOf(".")),r=e.split("-"),o=r[0],n=r[1],i=r[2];if(o==null||n==null||i==null)throw new Error(`Invalid date format in filename: ${t}`);let m=r.slice(3).join("-"),a=`${o}-${n}-${i}`,s=new Date(a).toISOString(),l=`/${o}/${n}/${i}/${m}`,g=await f.utils.readFile((0,c.join)(y,t));try{let p=f.utils.parseMarkdownTitle(g);return{original:t,withOutExtension:e,date:s,formattedDate:a,path:(0,c.join)(o,n,i,m),permalink:l,title:p}}catch(p){throw new Error(`Failed to parse ${t}, error: ${p}`)}})),T=async()=>{let t=await E();return t.map((e,r)=>{let{original:o,date:n,formattedDate:i,path:m,permalink:a}=e,s=t[r+1],l=t[r-1],g={date:n,formattedDate:i,permalink:a,nextItem:l!=null?{title:l.title,permalink:l.permalink}:void 0,prevItem:s!=null?{title:s.title,permalink:s.permalink}:void 0},p=JSON.stringify(g);return{original:o,path:m,metadataString:p}})},R=(t,e)=>e.map(r=>{let{original:o,metadataString:n}=r,i=(0,c.resolve)((0,c.join)(y,o));return[r.path,`import React from 'react';
import BlogPostPage from 'lib-react-docs/components/BlogPostPage';
import Content from '${i}';
const Page = () => <BlogPostPage siteTitle=${t} content={Content} metadata={${n}} />;
export default Page;
`]}),j=(t,e)=>{let r=e.map(({original:n},i)=>`import Component${i} from '../../blog/${n}?truncated=true';`).join(`
`),o=e.map(({metadataString:n},i)=>`  { content: Component${i}, metadata: ${n} },
`).join("");return`// @generated
import React from 'react';
import BlogListPage from 'lib-react-docs/components/BlogListPage';
${r}

const items = [
${o}];

const Page = () => <BlogListPage siteTitle=${t} items={items} />;
export default Page;
`},v=async t=>{await f.utils.ensureDirectory(y);let e=(await T()).sort((o,n)=>n.original.localeCompare(o.original)),r=JSON.stringify(t);return Object.fromEntries([...R(r,e),["index",j(r,e)]])},b=v;var d=u(require("path")),P=u(require("esbuild-scripts/api")),D=t=>t.substring(0,t.lastIndexOf(".")),F=(t,e,r,o)=>`// @generated
import React from 'react';
import DocPage from 'lib-react-docs/components/DocPage';
import Content from '${t}/docs/${o}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${e}\`}
    sidebar={${JSON.stringify(r)}}
    content={Content}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`,N=async({siteTitle:t,sideBarItems:e})=>{let r=(await P.utils.readDirectory("docs",!0)).filter(a=>(0,d.extname)(a)===".md"),o=await Promise.all(r.map(async a=>({documentPath:a,title:P.utils.parseMarkdownTitle(await P.utils.readFile((0,d.join)("docs",a)))}))),n=a=>Array.isArray(a)?a.map(s=>{let l=o.find(({documentPath:g})=>`/${D(g)}`===s);if(l==null)throw new Error(`No document with href ${s} found on disk.`);return{type:"link",href:`/docs${s}`,label:l.title}}):Object.entries(a).map(([s,l])=>({type:"category",label:s,items:n(l)})),i=n(e),m=(0,d.resolve)(".");return Object.fromEntries(o.map(({documentPath:a})=>[`docs/${D(a)}`,F(m,t,i,a)]))},w=N;(0,$.default)(async()=>{let t=JSON.parse(await $.utils.readFile("package.json")).reactDocs;switch(t.type){case"docs":return await w(t);case"blog":return await b(t.siteTitle);default:console.error(`Unknown type: "${t.type}"`),process.exit(1)}});
})();
//# sourceMappingURL=generator.js.map
