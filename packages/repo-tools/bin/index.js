module.exports=function(e,t){"use strict";var n={};function __webpack_require__(t){if(n[t]){return n[t].exports}var o=n[t]={i:t,l:false,exports:{}};var r=true;try{e[t].call(o.exports,o,o.exports,__webpack_require__);r=false}finally{if(r)delete n[t]}o.l=true;return o.exports}__webpack_require__.ab=__dirname+"/";function startup(){return __webpack_require__(910)}return startup()}({129:function(e){e.exports=require("child_process")},157:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:true});const o=n(747);const r=n(719);const s=n(974);const i=e=>[...r.getDependencyChain(e).map(e=>`packages/${e.startsWith("@dev-sam/")?e.substring("@dev-sam/".length):e}/**`),"package.json","yarn.lock","configuration/**",`.github/workflows/generated-*-${e}.yml`];const c=[s.githubActionJobActionStep("actions/checkout@v2"),s.githubActionJobActionStep("actions/setup-node@v1"),s.githubActionJobActionStep("actions/cache@v2",{path:".yarn/cache\n.pnp.js",key:"yarn-berry-${{ hashFiles('**/yarn.lock') }}","restore-keys":"yarn-berry-"}),s.githubActionJobRunStep("Yarn Install","yarn install")];const a=(e,t=e)=>{const n=`generated-ci-${t}.yml`;const o=s.githubActionWorkflowToString({workflowName:`CI ${e}`,workflowtrigger:{triggerPaths:i(e),masterBranchOnly:false},workflowJobs:[{jobName:"build",jobSteps:[...c,s.githubActionJobRunStep("Compile",`yarn workspace ${e} compile`)]}]});return[n,o]};const u=e=>{const t=`generated-cd-${e}.yml`;const n=s.githubActionWorkflowToString({workflowName:`CD ${e}`,workflowtrigger:{triggerPaths:i(e),masterBranchOnly:true},workflowSecrets:["FIREBASE_TOKEN"],workflowJobs:[{jobName:"deploy",jobSteps:[...c,s.githubActionJobRunStep("Build",`yarn workspace ${e} build`),s.githubActionJobRunStep("Deploy",`yarn workspace ${e} deploy`)]}]});return[t,n]};const l=()=>["generated-codegen-porcelain.yml",s.githubActionWorkflowToString({workflowName:"lint-generated",workflowtrigger:{triggerPaths:["**"],masterBranchOnly:false},workflowJobs:[{jobName:"lint",jobSteps:[s.githubActionJobActionStep("actions/checkout@v2"),s.githubActionJobActionStep("actions/setup-node@v1"),s.githubActionJobRunStep("Codegen","./repo-tools codegen"),s.githubActionJobRunStep("Check changed","git status --porcelain")]}]})];const p=([e,t])=>o.writeFileSync(`.github/workflows/${e}`,t);const d={serviceName:"Generate GitHub Actions Workflow",serviceSteps:[{stepName:"Remove already generated workflow files.",stepCode:()=>{Array.from(o.readdirSync(".github/workflows")).filter(e=>e.includes("generated-")).forEach(e=>o.unlinkSync(`.github/workflows/${e}`))}},{stepName:"Generate codegen porcelain check workflow",stepCode:()=>p(l())},...r.toolingWorkspaces.map(e=>{const t=e.substring("@dev-sam/".length);return{stepName:`Generate CI workflow for ${t}`,stepCode:()=>p(a(e,t))}}),...r.nonToolingWorkspaces.map(e=>({stepName:`Generate CI workflow for ${e}`,stepCode:()=>p(a(e))})),...r.projectWorkspaces.map(e=>({stepName:`Generate CD workflow for ${e}`,stepCode:()=>p(u(e))}))]};t.default=d},207:function(e,t,n){"use strict";var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:true});const r=o(n(157));const s=o(n(256));const i=o(n(846));const c=[r.default,s.default,i.default];const a=()=>{console.log("@dev-sam/repo-tools codegen service.\n");c.forEach(({serviceName:e,serviceSteps:t})=>{console.group(e);t.forEach(({stepName:e,stepCode:t},n)=>{console.groupCollapsed(`${n+1}. ${e}`);t();console.groupEnd()});console.groupEnd()})};t.default=a},256:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:true});const o=n(747);const r=o.readFileSync(".gitignore");const s=`# @generated\n\n${r}\n# styles\n\n.yarn\npackages/lib-docusaurus-plugin/index.js\npackages/repo-tools/bin/\n`;const i={serviceName:"Generate ignore files derived from .gitignore",serviceSteps:[{stepName:"Generate .eslintignore",stepCode:()=>o.writeFileSync(".eslintignore",s)},{stepName:"Generate .prettierignore",stepCode:()=>o.writeFileSync(".prettierignore",s)}]};t.default=i},719:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.validateDependencyChain=t.getDependencyChain=t.projectWorkspaces=t.libraryWorkspaces=t.nonToolingWorkspaces=t.toolingWorkspaces=void 0;const o=n(129);const r=()=>{const e=new Map;const t=o.spawnSync("yarn",["workspaces","list","-v","--json"],{shell:true});const n=t.stdout.toString().trim();const r=`[${n.split("\n").join(",")}]`;const s=JSON.parse(r);s.forEach(({name:t,workspaceDependencies:n})=>{if(t==null){return}e.set(t,n.map(e=>{if(!e.startsWith("packages/")){throw new Error(`Bad dependency of ${t}: ${e}`)}return e.substring("packages/".length)}))});return e};const s=r();const i=Array.from(s.keys()).filter(e=>e.startsWith("@dev-sam"));t.toolingWorkspaces=i;const c=Array.from(s.keys()).filter(e=>!e.startsWith("@dev-sam"));t.nonToolingWorkspaces=c;const a=c.filter(e=>e.startsWith("lib-"));t.libraryWorkspaces=a;const u=c.filter(e=>!e.startsWith("lib-"));t.projectWorkspaces=u;const l=e=>{const t=s.get(e);if(t==null){throw new Error(`Workspace ${e} is not found!`)}return t};const p=e=>{const t=[];const n=[];const o=new Set;const r=new Set;const s=e=>{if(r.has(e)){if(!o.has(e)){return}n.push(e);const t=n.indexOf(e);const r=n.slice(t,n.length).join(" -> ");throw new Error(`Cyclic dependency detected: ${r}`)}const i=l(e);r.add(e);n.push(e);o.add(e);i.forEach(s);o.delete(e);n.pop();t.push(e)};s(e);return t};t.getDependencyChain=p;const d=()=>Array.from(s.keys()).forEach(e=>{p(e);console.log(`No cyclic dependency detected with ${e} as root.`)});t.validateDependencyChain=d},747:function(e){e.exports=require("fs")},846:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:true});const o=n(747);const r=n(719);const s={serviceName:"Generate static json",serviceSteps:[{stepName:"Generate configuration/libraries.json",stepCode:()=>o.writeFileSync("configuration/libraries.json",`${JSON.stringify(r.libraryWorkspaces,undefined,2)}\n`)}]};t.default=s},910:function(e,t,n){"use strict";var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:true});const r=o(n(207));r.default()},974:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.githubActionWorkflowToString=t.githubActionJobRunStep=t.githubActionJobActionStep=void 0;t.githubActionJobActionStep=((e,t={})=>({type:"use-action",actionName:e,actionArguments:t}));t.githubActionJobRunStep=((e,t)=>({type:"run",stepName:e,command:t}));const n=e=>{switch(e.type){case"use-action":{const t=`      - uses: ${e.actionName}\n`;if(Object.keys(e.actionArguments).length===0){return t}const n=Object.entries(e.actionArguments).map(([e,t])=>{const n=t.split("\n");if(n.length===1){return`          ${e}: ${n[0]}`}return`          ${e}: |\n${n.map(e=>`            ${e}`).join("\n")}`}).join("\n");return`${t}        with:\n${n}\n`}case"run":{const t=`      - name: ${e.stepName}\n`;const n=e.command.split("\n");if(n.length===1){return`${t}        run: ${n[0]}\n`}return`${t}        run: |\n${n.map(e=>`          ${e}\n`).join("")}`}default:throw new Error}};const o=({jobName:e,jobSteps:t})=>{return`  ${e}:\n    runs-on: ubuntu-latest\n    steps:\n${t.map(n).join("")}`};t.githubActionWorkflowToString=(({workflowName:e,workflowtrigger:{triggerPaths:t,masterBranchOnly:n},workflowSecrets:r=[],workflowJobs:s})=>{const i=`# @generated\n\nname: ${e}\non:\n  push:\n    paths:\n${t.map(e=>`      - '${e}'\n`).join("")}${n?`    branches:\n      - master\n`:""}${r.length>0?`env:\n${r.map(e=>`  ${e}: \${{ secrets.${e} }}`).join("\n")}\n`:""}\njobs:\n${s.map(o).join("")}`;return i})}});