// @generated
/* eslint-disable */
// prettier-ignore
(() => {
var _=Object.create,D=Object.defineProperty;var A=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var v=Object.getPrototypeOf,B=Object.prototype.hasOwnProperty;var H=e=>D(e,"__esModule",{value:!0});var G=(e,t,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of R(t))!B.call(e,n)&&n!=="default"&&D(e,n,{get:()=>t[n],enumerable:!(r=A(t,n))||r.enumerable});return e},w=e=>G(H(D(e!=null?_(v(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var d=w(require("path"));function j(e){if(e==null)throw new Error(`Value is asserted to be not null, but it is ${e}.`)}var g=e=>(j(e),e);var C=({level:e,label:t})=>`${"#".repeat(e)} ${t}`,F=e=>{let t=[];return e.split(`
`).forEach(r=>{let n=r.trim();if(!n.startsWith("#"))return;let a=0;for(;n[a]==="#";)a+=1;if(a>6)throw new Error(`Invalid Header: '${n}'`);t.push({level:a,label:n.substring(a).trim()})}),t},$=(e,t)=>{let r=g(e[t]),n=[],a=t+1;for(;a<e.length;){let{element:c,level:o,finishedIndex:i}=$(e,a);if(o<=r.level)break;if(o>r.level+1){let l=C({level:o,label:c.label});throw new Error(`Invalid header: ${l}. Expected Level: ${r.level+1}`)}a=i,n.push(c)}return{element:{label:r.label,children:n},level:r.level,finishedIndex:a}},L=e=>{let t=F(e);if(t[0]==null)throw new Error("Lacking title.");if(t[0].level!==1)throw new Error(`First heading must be h1, found: ${C(t[0])}`);if(t.filter(r=>r.level===1).length>1)throw new Error("More than one h1.");return $(t,0).element},h=L;var s=w(require("esbuild-scripts/api"));var x="blog",E="generated-components",S=async(e,t,r)=>`${await s.utils.compileMarkdownToReact(e)}
MDXContent.metadata = ${JSON.stringify(t,void 0,2)};
MDXContent.toc = ${JSON.stringify(r,void 0,2)};
`,V=async()=>await Promise.all((await s.utils.readDirectory(x,!0)).filter(e=>{switch((0,d.extname)(e)){case".md":case".mdx":return!0;default:return!1}}).map(async e=>{let t=e.substring(0,e.lastIndexOf(".")),r=t.split("-"),n=g(r[0]),a=g(r[1]),c=g(r[2]),o=r.slice(3).join("-"),i=`${n}-${a}-${c}`,l=new Date(i).toISOString(),f=`/${n}/${a}/${c}/${o}`,y=await s.utils.readFile((0,d.join)("blog",e));try{let{label:u,children:b}=h(y);return{original:e,withOutExtension:t,date:l,formattedDate:i,path:(0,d.join)(n,a,c,o),permalink:f,title:u,toc:b,content:y}}catch(u){throw new Error(`Failed to parse ${e}, error: ${u.message}`)}})),W=async e=>{await Promise.all(e.map(async(t,r)=>{let n=t.content.trim().split(`
`).slice(1),a=n.join(`
`),c=n.findIndex(k=>k.trimStart().startsWith("<!--")&&k.includes("truncate")),o=n.slice(0,c).join(`
`),i=e[r-1],l=e[r+1],f=i!=null?{title:i.title,permalink:i.permalink}:void 0,y=l!=null?{title:l.title,permalink:l.permalink}:void 0,u={title:t.title,date:t.date,formattedDate:t.formattedDate,permalink:t.permalink,nextItem:y,prevItem:f},[b,I]=await Promise.all([S(a,{...u,truncated:!1},t.toc),S(o,{...u,truncated:!0},t.toc)]);await Promise.all([s.utils.writeFile((0,d.join)(E,`${t.withOutExtension}__FULL.jsx`),b),s.utils.writeFile((0,d.join)(E,`${t.withOutExtension}__TRUNCATED.jsx`),I)])}))},J=async(e,t)=>{let r=t.map(({withOutExtension:c},o)=>`import Component${o} from '../../generated-components/${c}__TRUNCATED';`).join(`
`),n=t.map((c,o)=>`  { content: Component${o} },
`).join(""),a=`// @generated
import React from 'react';
import BlogListPage from 'lib-react-docs/components/BlogListPage';
${r}

const items = [
${n}];

const Page = () => <BlogListPage siteTitle=${JSON.stringify(e)} items={items} />;
export default Page;
`;await s.utils.writeFile((0,d.join)(s.constants.GENERATED_PAGES_PATH,"index.jsx"),a)},U=async(e,t)=>{await Promise.all(t.map(async r=>{let n=(0,d.join)(s.constants.GENERATED_PAGES_PATH,`${r.path}.jsx`);await s.utils.ensureDirectory((0,d.dirname)(n)),await s.utils.writeFile(n,`import React from 'react';
import BlogPostPage from 'lib-react-docs/components/BlogPostPage';
import Content from '../../../../../generated-components/${r.withOutExtension}__FULL';
const Page = () => <BlogPostPage siteTitle=${JSON.stringify(e)} content={Content} />;
export default Page;
`)}))},X=async e=>{await s.utils.ensureDirectory(x),await s.utils.ensureDirectory(E),await s.utils.emptyDirectory(E),await s.utils.ensureDirectory(s.constants.GENERATED_PAGES_PATH),await s.utils.emptyDirectory(s.constants.GENERATED_PAGES_PATH);let t=(await V()).sort((r,n)=>n.original.localeCompare(r.original));await Promise.all([W(t),J(e,t),U(e,t)])},O=X;var p=w(require("path"));var m=w(require("esbuild-scripts/api")),M=e=>e.substring(0,e.lastIndexOf(".")),T=(0,p.join)(m.constants.GENERATED_PAGES_PATH,"docs"),Y=(e,t,r,n)=>`// @generated
import React from 'react';
import DocPage from 'lib-react-docs/components/DocPage';
import Content from 'esbuild-scripts-internal/docs/${r}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${e}\`}
    sidebar={${JSON.stringify(t)}}
    toc={${JSON.stringify(n)}}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`,q=async({siteTitle:e,sideBarItems:t})=>{let r=(await m.utils.readDirectory("docs",!0)).filter(o=>{switch((0,p.extname)(o)){case".md":case".mdx":return!0;default:return!1}});await m.utils.ensureDirectory(T),await m.utils.emptyDirectory(T);let n=await Promise.all(r.map(async o=>{let i=await m.utils.readFile((0,p.join)("docs",o));return{documentPath:o,content:i,tocItem:h(i)}})),a=o=>Array.isArray(o)?o.map(i=>{let l=n.find(({documentPath:f})=>`/${M(f)}`===i);if(l==null)throw new Error(`No document with href ${i} found on disk.`);return{type:"link",href:`/docs${i}`,label:l.tocItem.label}}):Object.entries(o).map(([i,l])=>({type:"category",label:i,items:a(l)})),c=a(t);await Promise.all(n.map(async({documentPath:o,tocItem:i})=>{let l=(0,p.join)(T,`${M(o)}.jsx`);await m.utils.ensureDirectory((0,p.dirname)(l)),await m.utils.writeFile(l,Y(e,c,o,i.children))}))},N=q;var P=w(require("esbuild-scripts/api"));(0,P.default)(async()=>{let e=JSON.parse(await P.utils.readFile("package.json")).reactDocs;switch(e.type){case"docs":return await N(e);case"blog":return await O(e.siteTitle);default:console.error(`Unknown type: "${e.type}"`),process.exit(1)}});
})();
