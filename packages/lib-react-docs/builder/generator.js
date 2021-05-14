// @generated
/* eslint-disable */
// prettier-ignore
(() => {
var x=Object.create,S=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var A=Object.getOwnPropertyNames;var N=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty;var B=t=>S(t,"__esModule",{value:!0});var I=(t,e,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of A(e))!C.call(t,a)&&a!=="default"&&S(t,a,{get:()=>e[a],enumerable:!(r=T(e,a))||r.enumerable});return t},f=t=>I(B(S(t!=null?x(N(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var l=f(require("path")),n=f(require("esbuild-scripts/api"));function k(t){if(t==null)throw new Error(`Value is asserted to be not null, but it is ${t}.`)}var y=t=>(k(t),t);var P="blog",G=async()=>await Promise.all((await n.utils.readDirectory(P,!0)).filter(t=>{switch((0,l.extname)(t)){case".md":case".mdx":return!0;default:return!1}}).map(async t=>{let e=t.substring(0,t.lastIndexOf(".")),r=e.split("-"),a=y(r[0]),i=y(r[1]),s=y(r[2]),o=r.slice(3).join("-"),c=`${a}-${i}-${s}`,m=new Date(c).toISOString(),g=`/${a}/${i}/${s}/${o}`,D=await n.utils.readFile((0,l.join)(P,t));try{let u=n.utils.parseMarkdownTitle(D);return{original:t,withOutExtension:e,date:m,formattedDate:c,path:(0,l.join)(a,i,s,o),permalink:g,title:u}}catch(u){throw new Error(`Failed to parse ${t}, error: ${u.message}`)}})),_=async()=>{let t=await G();return t.map((e,r)=>{let{original:a,date:i,formattedDate:s,path:o,permalink:c}=e,m=t[r-1],g=t[r+1],D={date:i,formattedDate:s,permalink:c,nextItem:g!=null?{title:g.title,permalink:g.permalink}:void 0,prevItem:m!=null?{title:m.title,permalink:m.permalink}:void 0},u=JSON.stringify(D);return{original:a,path:o,metadataString:u}})},O=async(t,e)=>{await Promise.all(e.map(async r=>{let{original:a,metadataString:i}=r,s=(0,l.resolve)((0,l.join)(P,a)),o=(0,l.join)(n.constants.GENERATED_PAGES_PATH,`${r.path}.jsx`);await n.utils.ensureDirectory((0,l.dirname)(o)),await n.utils.writeFile(o,`import React from 'react';
import BlogPostPage from 'lib-react-docs/components/BlogPostPage';
import Content from '${s}';
const Page = () => <BlogPostPage siteTitle=${t} content={Content} metadata={${i}} />;
export default Page;
`)}))},R=async(t,e)=>{let r=e.map(({original:s},o)=>`import Component${o} from '../../blog/${s}?truncated=true';`).join(`
`),a=e.map(({metadataString:s},o)=>`  { content: Component${o}, metadata: ${s} },
`).join(""),i=`// @generated
import React from 'react';
import BlogListPage from 'lib-react-docs/components/BlogListPage';
${r}

const items = [
${a}];

const Page = () => <BlogListPage siteTitle=${t} items={items} />;
export default Page;
`;await n.utils.writeFile((0,l.join)(n.constants.GENERATED_PAGES_PATH,"index.jsx"),i)},j=async t=>{await n.utils.ensureDirectory(P),await n.utils.ensureDirectory(n.constants.GENERATED_PAGES_PATH),await n.utils.emptyDirectory(n.constants.GENERATED_PAGES_PATH);let e=(await _()).sort((a,i)=>i.original.localeCompare(a.original)),r=JSON.stringify(t);await Promise.all([O(r,e),R(r,e)])},b=j;var p=f(require("path")),d=f(require("esbuild-scripts/api")),E=t=>t.substring(0,t.lastIndexOf(".")),$=(0,p.join)(d.constants.GENERATED_PAGES_PATH,"docs"),V=(t,e,r)=>`// @generated
import React from 'react';
import DocPage from 'lib-react-docs/components/DocPage';
import Content from 'esbuild-scripts-internal/docs/${r}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${t}\`}
    sidebar={${JSON.stringify(e)}}
    content={Content}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`,F=async({siteTitle:t,sideBarItems:e})=>{let r=(await d.utils.readDirectory("docs",!0)).filter(o=>{switch((0,p.extname)(o)){case".md":case".mdx":return!0;default:return!1}});await d.utils.ensureDirectory($),await d.utils.emptyDirectory($);let a=await Promise.all(r.map(async o=>({documentPath:o,title:d.utils.parseMarkdownTitle(await d.utils.readFile((0,p.join)("docs",o)))}))),i=o=>Array.isArray(o)?o.map(c=>{let m=a.find(({documentPath:g})=>`/${E(g)}`===c);if(m==null)throw new Error(`No document with href ${c} found on disk.`);return{type:"link",href:`/docs${c}`,label:m.title}}):Object.entries(o).map(([c,m])=>({type:"category",label:c,items:i(m)})),s=i(e);await Promise.all(a.map(async({documentPath:o})=>{let c=(0,p.join)($,`${E(o)}.jsx`);await d.utils.ensureDirectory((0,p.dirname)(c)),await d.utils.writeFile(c,V(t,s,o))}))},h=F;var w=f(require("esbuild-scripts/api"));(0,w.default)(async()=>{let t=JSON.parse(await w.utils.readFile("package.json")).reactDocs;switch(t.type){case"docs":return await h(t);case"blog":return await b(t.siteTitle);default:console.error(`Unknown type: "${t.type}"`),process.exit(1)}});
})();
