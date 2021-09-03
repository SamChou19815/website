/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-monorail",
factory: function (require) {
var plugin=(()=>{var U=Object.create,f=Object.defineProperty,q=Object.defineProperties,K=Object.getOwnPropertyDescriptor,V=Object.getOwnPropertyDescriptors,z=Object.getOwnPropertyNames,y=Object.getOwnPropertySymbols,Q=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var F=(n,e,o)=>e in n?f(n,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[e]=o,$=(n,e)=>{for(var o in e||(e={}))w.call(e,o)&&F(n,o,e[o]);if(y)for(var o of y(e))b.call(e,o)&&F(n,o,e[o]);return n},T=(n,e)=>q(n,V(e)),X=n=>f(n,"__esModule",{value:!0});var m=n=>{if(typeof require!="undefined")return require(n);throw new Error('Dynamic require of "'+n+'" is not supported')};var Y=(n,e)=>{var o={};for(var r in n)w.call(n,r)&&e.indexOf(r)<0&&(o[r]=n[r]);if(n!=null&&y)for(var r of y(n))e.indexOf(r)<0&&b.call(n,r)&&(o[r]=n[r]);return o},Z=(n,e)=>()=>(n&&(e=n(n=0)),e);var x=(n,e)=>{for(var o in e)f(n,o,{get:e[o],enumerable:!0})},nn=(n,e,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of z(e))!w.call(n,r)&&r!=="default"&&f(n,r,{get:()=>e[r],enumerable:!(o=K(e,r))||o.enumerable});return n},u=n=>nn(X(f(n!=null?U(Q(n)):{},"default",n&&n.__esModule&&"default"in n?{get:()=>n.default,enumerable:!0}:{value:n,enumerable:!0})),n);var j={};x(j,{default:()=>gn});var _,C,J,un,gn,B=Z(()=>{_=u(m("child_process")),C=(()=>{let n=new Map,r=`[${(0,_.spawnSync)("yarn",["workspaces","list","-v","--json"]).stdout.toString().trim().split(`
`).join(",")}]`,t=JSON.parse(r),a={};return t.forEach(({name:s,location:i})=>{s!=null&&(a[i]=s)}),t.forEach(({name:s,location:i,workspaceDependencies:p})=>{s!=null&&n.set(s,{workspaceLocation:i,dependencies:p.map(d=>{let c=a[d];if(c==null)throw new Error(`Bad dependency of ${c}: ${d}`);return c})})}),n})(),J=n=>{let e=[],o=[],r=new Set,t=new Set,a=s=>{var p;if(t.has(s)){if(!r.has(s))return;o.push(s);let d=o.indexOf(s),c=o.slice(d,o.length).join(" -> ");throw new Error(`Cyclic dependency detected: ${c}`)}let i=(p=C.get(s))==null?void 0:p.dependencies;if(i==null)throw new Error(`Workspace ${n} is not found!`);t.add(s),o.push(s),r.add(s),i.forEach(a),r.delete(s),o.pop(),e.push(s)};return a(n),e},un={__type__:"@generated",information:Object.fromEntries(Array.from(C.entries()).map(r=>{var[n,t]=r,a=t,{dependencies:e}=a,o=Y(a,["dependencies"]);return[n,T($({},o),{dependencyChain:J(n)})]}).sort(([n],[e])=>n.localeCompare(e))),topologicallyOrdered:(()=>{let n=[],e=new Set;return Array.from(C.keys()).forEach(o=>{J(o).forEach(t=>{e.has(t)||(n.push(t),e.add(t))})}),n})()},gn=un});var hn={};x(hn,{default:()=>yn});var H=u(m("fs")),G=u(m("clipanion"));var l=u(m("fs")),h=u(m("path")),en=`
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: '2'
      - uses: actions/setup-node@v2
        with:
          cache: 'yarn'
      - name: Yarn Install
        run: yarn install --immutable`,on=(n,e,o)=>{var t,a;let r=n.information[e];if(r==null)throw new Error;return((a=(t=JSON.parse((0,l.readFileSync)((0,h.join)(r.workspaceLocation,"package.json")).toString()))==null?void 0:t.scripts)==null?void 0:a[o])!=null},rn=n=>n.topologicallyOrdered.filter(e=>on(n,e,"deploy")).map(e=>{var r,t;return[`.github/workflows/generated-${`cd-${e}`}.yml`,`# @generated

name: CD ${e}
on:
  push:
    paths:${((t=(r=n.information[e])==null?void 0:r.dependencyChain)!=null?t:[]).map(a=>{var s;return`
      - '${(s=n.information[a])==null?void 0:s.workspaceLocation}/**'`}).join("")}
      - 'configuration/**'
      - '.github/workflows/generated-*-${e}.yml'
    branches:
      - main
env:
  NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}

jobs:
  deploy:${en}
      - name: Build
        run: yarn workspace ${e} build
      - name: Deploy
        run: yarn workspace ${e} deploy
`]}),S=(0,h.join)(".github","workflows"),tn=async n=>{(0,l.existsSync)(S)&&(0,l.readdirSync)(S).forEach(e=>{e.startsWith("generated-")&&(0,l.unlinkSync)((0,h.join)(S,e))}),(0,l.mkdirSync)(S,{recursive:!0}),rn(n).forEach(([e,o])=>{(0,l.writeFileSync)(e,o)})},A=tn;var k=u(m("child_process")),P=u(m("fs")),E=u(m("path"));var g=n=>process.stderr.isTTY?e=>`[${n}m${e}[0m`:e=>e,I=g(31),L=g(32),O=g(33),N=g(34),v=g(35),En=g(36);var sn=["\u280B","\u2819","\u2839","\u2838","\u283C","\u2834","\u2826","\u2827","\u2807","\u280F"],an=n=>{let e=0,o=new Date().getTime();return setInterval(()=>{let r=`${((new Date().getTime()-o)/1e3).toFixed(1)}s`,t=n(r),a=sn[e%10];process.stderr.write(O(`${t} ${a}\r`)),e+=1},process.stderr.isTTY?40:1e3)},D=an;var cn=n=>{let e=(o,r)=>{let t=(0,k.spawnSync)("git",["diff",o,...r?[r]:[],"--name-only","--",n]).stdout.toString().trim();return t===""?[]:t.split(`
`)};return process.env.CI?e("HEAD^","HEAD"):e("origin/main")},ln=n=>JSON.parse((0,P.readFileSync)(n).toString()),pn=(n,e)=>{var t,a;let o=s=>{var i,p;return(0,E.dirname)(s)!==(0,E.join)((p=(i=n.information[e])==null?void 0:i.workspaceLocation)!=null?p:".","bin")};return((a=(t=n.information[e])==null?void 0:t.dependencyChain)!=null?a:[]).some(s=>{var d,c;let i=(c=(d=n.information[s])==null?void 0:d.workspaceLocation)!=null?c:".";return cn(i).some(o)})},dn=n=>n.topologicallyOrdered.map(e=>{let o=pn(n,e);return[e,o]}).filter(([,e])=>e).map(([e])=>e),mn=async()=>{let n=ln("workspaces.json"),e=dn(n);e.forEach(i=>{console.error(N(`[i] \`${i}\` needs to be recompiled.`))});let o=D(i=>`[?] Compiling (${i})`),t=await Promise.all(e.map(i=>{let p=(0,k.spawn)("yarn",["workspace",i,"compile"],{shell:!0,stdio:["ignore","pipe","ignore"]}),d="";return p.stdout.on("data",c=>{d+=c.toString()}),new Promise(c=>{p.on("exit",M=>c([i,M===0,d]))})}));clearInterval(o);let a=t.map(i=>i[2]).join(""),s=t.filter(i=>!i[1]).map(i=>i[0]);return s.length===0?(console.error(L("[\u2713] All workspaces have been successfully compiled!")),!0):(console.error(v("[!] Compilation finished with some errors.")),console.error(a.trim()),s.forEach(i=>{console.error(I(`[x] \`${i}\` failed to exit with 0.`))}),!1)},R=mn;var W=class extends G.Command{async execute(){return await R()?0:1}};W.paths=[["c"]];var fn={hooks:{afterAllInstalled(){let n=(B(),j).default;(0,H.writeFileSync)("workspaces.json",`${JSON.stringify(n,void 0,2)}
`),A(n)}},commands:[W]},yn=fn;return hn;})();
return plugin;
}
};
