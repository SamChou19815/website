// @generated
/* eslint-disable */
// prettier-ignore
(() => {
var _=Object.create,D=Object.defineProperty;var A=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var B=Object.getPrototypeOf,v=Object.prototype.hasOwnProperty;var H=e=>D(e,"__esModule",{value:!0});var G=(e,t,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of R(t))!v.call(e,o)&&o!=="default"&&D(e,o,{get:()=>t[o],enumerable:!(n=A(t,o))||n.enumerable});return e},w=e=>G(H(D(e!=null?_(B(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var d=w(require("path"));function j(e){if(e==null)throw new Error(`Value is asserted to be not null, but it is ${e}.`)}var g=e=>(j(e),e);var C=({level:e,label:t})=>`${"#".repeat(e)} ${t}`,F=e=>{let t=[],n=!1;return e.split(`
`).filter(a=>{if(a.startsWith("```"))n=!n;else return!n}).forEach(a=>{let l=a.trim();if(!l.startsWith("#"))return;let r=0;for(;l[r]==="#";)r+=1;if(r>6)throw new Error(`Invalid Header: '${l}'`);t.push({level:r,label:l.substring(r).trim()})}),t},$=(e,t)=>{let n=g(e[t]),o=[],a=t+1;for(;a<e.length;){let{element:l,level:r,finishedIndex:i}=$(e,a);if(r<=n.level)break;if(r>n.level+1){let c=C({level:r,label:l.label});throw new Error(`Invalid header: ${c}. Expected Level: ${n.level+1}`)}a=i,o.push(l)}return{element:{label:n.label,children:o},level:n.level,finishedIndex:a}},L=e=>{let t=F(e);if(t[0]==null)throw new Error("Lacking title.");if(t[0].level!==1)throw new Error(`First heading must be h1, found: ${C(t[0])}`);if(t.filter(n=>n.level===1).length>1)throw new Error("More than one h1.");return $(t,0).element},h=L;var s=w(require("esbuild-scripts/api"));var x="blog",P="generated-components",S=async(e,t,n)=>`${await s.utils.compileMarkdownToReact(e)}
MDXContent.metadata = ${JSON.stringify(t,void 0,2)};
MDXContent.toc = ${JSON.stringify(n,void 0,2)};
`,W=async()=>await Promise.all((await s.utils.readDirectory(x,!0)).filter(e=>{switch((0,d.extname)(e)){case".md":case".mdx":return!0;default:return!1}}).map(async e=>{let t=e.substring(0,e.lastIndexOf(".")),n=t.split("-"),o=g(n[0]),a=g(n[1]),l=g(n[2]),r=n.slice(3).join("-"),i=`${o}-${a}-${l}`,c=new Date(i).toISOString(),f=`/${o}/${a}/${l}/${r}`,y=await s.utils.readFile((0,d.join)("blog",e));try{let{label:p,children:b}=h(y);return{original:e,withOutExtension:t,date:c,formattedDate:i,path:(0,d.join)(o,a,l,r),permalink:f,title:p,toc:b,content:y}}catch(p){throw new Error(`Failed to parse ${e}, error: ${p.message}`)}})),V=async e=>{await Promise.all(e.map(async(t,n)=>{let o=t.content.trim().split(`
`).slice(1),a=o.join(`
`),l=o.findIndex(T=>T.trimStart().startsWith("<!--")&&T.includes("truncate")),r=o.slice(0,l).join(`
`),i=e[n-1],c=e[n+1],f=i!=null?{title:i.title,permalink:i.permalink}:void 0,y=c!=null?{title:c.title,permalink:c.permalink}:void 0,p={title:t.title,date:t.date,formattedDate:t.formattedDate,permalink:t.permalink,nextItem:y,prevItem:f},[b,I]=await Promise.all([S(a,{...p,truncated:!1},t.toc),S(r,{...p,truncated:!0},t.toc)]);await Promise.all([s.utils.writeFile((0,d.join)(P,`${t.withOutExtension}__FULL.jsx`),b),s.utils.writeFile((0,d.join)(P,`${t.withOutExtension}__TRUNCATED.jsx`),I)])}))},J=async(e,t)=>{let n=t.map(({withOutExtension:l},r)=>`import Component${r} from '../../generated-components/${l}__TRUNCATED';`).join(`
`),o=t.map((l,r)=>`  { content: Component${r} },
`).join(""),a=`// @generated
import React from 'react';
import BlogListPage from 'lib-react-docs/components/BlogListPage';
${n}

const items = [
${o}];

const Page = () => <BlogListPage siteTitle=${JSON.stringify(e)} items={items} />;
export default Page;
`;await s.utils.writeFile((0,d.join)(s.constants.GENERATED_PAGES_PATH,"index.jsx"),a)},U=async(e,t)=>{await Promise.all(t.map(async n=>{let o=(0,d.join)(s.constants.GENERATED_PAGES_PATH,`${n.path}.jsx`);await s.utils.ensureDirectory((0,d.dirname)(o)),await s.utils.writeFile(o,`import React from 'react';
import BlogPostPage from 'lib-react-docs/components/BlogPostPage';
import Content from '../../../../../generated-components/${n.withOutExtension}__FULL';
const Page = () => <BlogPostPage siteTitle=${JSON.stringify(e)} content={Content} />;
export default Page;
`)}))},X=async e=>{await s.utils.ensureDirectory(x),await s.utils.ensureDirectory(P),await s.utils.emptyDirectory(P),await s.utils.ensureDirectory(s.constants.GENERATED_PAGES_PATH),await s.utils.emptyDirectory(s.constants.GENERATED_PAGES_PATH);let t=(await W()).sort((n,o)=>o.original.localeCompare(n.original));await Promise.all([V(t),J(e,t),U(e,t)])},O=X;var u=w(require("path"));var m=w(require("esbuild-scripts/api")),M=e=>e.substring(0,e.lastIndexOf(".")),k=(0,u.join)(m.constants.GENERATED_PAGES_PATH,"docs"),Y=(e,t,n,o)=>`// @generated
import React from 'react';
import DocPage from 'lib-react-docs/components/DocPage';
import Content from 'esbuild-scripts-internal/docs/${n}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${e}\`}
    sidebar={${JSON.stringify(t)}}
    toc={${JSON.stringify(o)}}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`,q=async({siteTitle:e,sideBarItems:t})=>{let n=(await m.utils.readDirectory("docs",!0)).filter(r=>{switch((0,u.extname)(r)){case".md":case".mdx":return!0;default:return!1}});await m.utils.ensureDirectory(k),await m.utils.emptyDirectory(k);let o=await Promise.all(n.map(async r=>{let i=await m.utils.readFile((0,u.join)("docs",r));return{documentPath:r,content:i,tocItem:h(i)}})),a=r=>Array.isArray(r)?r.map(i=>{let c=o.find(({documentPath:f})=>`/${M(f)}`===i);if(c==null)throw new Error(`No document with href ${i} found on disk.`);return{type:"link",href:`/docs${i}`,label:c.tocItem.label}}):Object.entries(r).map(([i,c])=>({type:"category",label:i,items:a(c)})),l=a(t);await Promise.all(o.map(async({documentPath:r,tocItem:i})=>{let c=(0,u.join)(k,`${M(r)}.jsx`);await m.utils.ensureDirectory((0,u.dirname)(c)),await m.utils.writeFile(c,Y(e,l,r,i.children))}))},N=q;var E=w(require("esbuild-scripts/api"));(0,E.default)(async()=>{let e=JSON.parse(await E.utils.readFile("package.json")).reactDocs;switch(e.type){case"docs":return await N(e);case"blog":return await O(e.siteTitle);default:console.error(`Unknown type: "${e.type}"`),process.exit(1)}});
})();
