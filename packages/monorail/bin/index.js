#!/usr/bin/env node
module.exports=(()=>{var __webpack_modules__={912:(e,t,n)=>{"use strict";e=n.nmd(e);const r=(e,t)=>(...n)=>{const r=e(...n);return`[${r+t}m`};const o=(e,t)=>(...n)=>{const r=e(...n);return`[${38+t};5;${r}m`};const s=(e,t)=>(...n)=>{const r=e(...n);return`[${38+t};2;${r[0]};${r[1]};${r[2]}m`};const i=e=>e;const c=(e,t,n)=>[e,t,n];const l=(e,t,n)=>{Object.defineProperty(e,t,{get:()=>{const r=n();Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true});return r},enumerable:true,configurable:true})};let a;const u=(e,t,r,o)=>{if(a===undefined){a=n(58)}const s=o?10:0;const i={};for(const[n,o]of Object.entries(a)){const c=n==="ansi16"?"ansi":n;if(n===t){i[c]=e(r,s)}else if(typeof o==="object"){i[c]=e(o[t],s)}}return i};function assembleStyles(){const e=new Map;const t={modifier:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},color:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],blackBright:[90,39],redBright:[91,39],greenBright:[92,39],yellowBright:[93,39],blueBright:[94,39],magentaBright:[95,39],cyanBright:[96,39],whiteBright:[97,39]},bgColor:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49],bgBlackBright:[100,49],bgRedBright:[101,49],bgGreenBright:[102,49],bgYellowBright:[103,49],bgBlueBright:[104,49],bgMagentaBright:[105,49],bgCyanBright:[106,49],bgWhiteBright:[107,49]}};t.color.gray=t.color.blackBright;t.bgColor.bgGray=t.bgColor.bgBlackBright;t.color.grey=t.color.blackBright;t.bgColor.bgGrey=t.bgColor.bgBlackBright;for(const[n,r]of Object.entries(t)){for(const[n,o]of Object.entries(r)){t[n]={open:`[${o[0]}m`,close:`[${o[1]}m`};r[n]=t[n];e.set(o[0],o[1])}Object.defineProperty(t,n,{value:r,enumerable:false})}Object.defineProperty(t,"codes",{value:e,enumerable:false});t.color.close="[39m";t.bgColor.close="[49m";l(t.color,"ansi",()=>u(r,"ansi16",i,false));l(t.color,"ansi256",()=>u(o,"ansi256",i,false));l(t.color,"ansi16m",()=>u(s,"rgb",c,false));l(t.bgColor,"ansi",()=>u(r,"ansi16",i,true));l(t.bgColor,"ansi256",()=>u(o,"ansi256",i,true));l(t.bgColor,"ansi16m",()=>u(s,"rgb",c,true));return t}Object.defineProperty(e,"exports",{enumerable:true,get:assembleStyles})},35:(e,t,n)=>{"use strict";const r=n(912);const{stdout:o,stderr:s}=n(875);const{stringReplaceAll:i,stringEncaseCRLFWithFirstIndex:c}=n(941);const{isArray:l}=Array;const a=["ansi","ansi","ansi256","ansi16m"];const u=Object.create(null);const f=(e,t={})=>{if(t.level&&!(Number.isInteger(t.level)&&t.level>=0&&t.level<=3)){throw new Error("The `level` option should be an integer from 0 to 3")}const n=o?o.level:0;e.level=t.level===undefined?n:t.level};class ChalkClass{constructor(e){return d(e)}}const d=e=>{const t={};f(t,e);t.template=((...e)=>y(t.template,...e));Object.setPrototypeOf(t,Chalk.prototype);Object.setPrototypeOf(t.template,t);t.template.constructor=(()=>{throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.")});t.template.Instance=ChalkClass;return t.template};function Chalk(e){return d(e)}for(const[e,t]of Object.entries(r)){u[e]={get(){const n=g(this,h(t.open,t.close,this._styler),this._isEmpty);Object.defineProperty(this,e,{value:n});return n}}}u.visible={get(){const e=g(this,this._styler,true);Object.defineProperty(this,"visible",{value:e});return e}};const p=["rgb","hex","keyword","hsl","hsv","hwb","ansi","ansi256"];for(const e of p){u[e]={get(){const{level:t}=this;return function(...n){const o=h(r.color[a[t]][e](...n),r.color.close,this._styler);return g(this,o,this._isEmpty)}}}}for(const e of p){const t="bg"+e[0].toUpperCase()+e.slice(1);u[t]={get(){const{level:t}=this;return function(...n){const o=h(r.bgColor[a[t]][e](...n),r.bgColor.close,this._styler);return g(this,o,this._isEmpty)}}}}const _=Object.defineProperties(()=>{},{...u,level:{enumerable:true,get(){return this._generator.level},set(e){this._generator.level=e}}});const h=(e,t,n)=>{let r;let o;if(n===undefined){r=e;o=t}else{r=n.openAll+e;o=t+n.closeAll}return{open:e,close:t,openAll:r,closeAll:o,parent:n}};const g=(e,t,n)=>{const r=(...e)=>{if(l(e[0])&&l(e[0].raw)){return b(r,y(r,...e))}return b(r,e.length===1?""+e[0]:e.join(" "))};Object.setPrototypeOf(r,_);r._generator=e;r._styler=t;r._isEmpty=n;return r};const b=(e,t)=>{if(e.level<=0||!t){return e._isEmpty?"":t}let n=e._styler;if(n===undefined){return t}const{openAll:r,closeAll:o}=n;if(t.indexOf("")!==-1){while(n!==undefined){t=i(t,n.close,n.open);n=n.parent}}const s=t.indexOf("\n");if(s!==-1){t=c(t,o,r,s)}return r+t+o};let m;const y=(e,...t)=>{const[r]=t;if(!l(r)||!l(r.raw)){return t.join(" ")}const o=t.slice(1);const s=[r.raw[0]];for(let e=1;e<r.length;e++){s.push(String(o[e-1]).replace(/[{}\\]/g,"\\$&"),String(r.raw[e]))}if(m===undefined){m=n(593)}return m(e,s.join(""))};Object.defineProperties(Chalk.prototype,u);const w=Chalk();w.supportsColor=o;w.stderr=Chalk({level:s?s.level:0});w.stderr.supportsColor=s;e.exports=w},593:e=>{"use strict";const t=/(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;const n=/(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;const r=/^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;const o=/\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;const s=new Map([["n","\n"],["r","\r"],["t","\t"],["b","\b"],["f","\f"],["v","\v"],["0","\0"],["\\","\\"],["e",""],["a",""]]);function unescape(e){const t=e[0]==="u";const n=e[1]==="{";if(t&&!n&&e.length===5||e[0]==="x"&&e.length===3){return String.fromCharCode(parseInt(e.slice(1),16))}if(t&&n){return String.fromCodePoint(parseInt(e.slice(2,-1),16))}return s.get(e)||e}function parseArguments(e,t){const n=[];const s=t.trim().split(/\s*,\s*/g);let i;for(const t of s){const s=Number(t);if(!Number.isNaN(s)){n.push(s)}else if(i=t.match(r)){n.push(i[2].replace(o,(e,t,n)=>t?unescape(t):n))}else{throw new Error(`Invalid Chalk template style argument: ${t} (in style '${e}')`)}}return n}function parseStyle(e){n.lastIndex=0;const t=[];let r;while((r=n.exec(e))!==null){const e=r[1];if(r[2]){const n=parseArguments(e,r[2]);t.push([e].concat(n))}else{t.push([e])}}return t}function buildStyle(e,t){const n={};for(const e of t){for(const t of e.styles){n[t[0]]=e.inverse?null:t.slice(1)}}let r=e;for(const[e,t]of Object.entries(n)){if(!Array.isArray(t)){continue}if(!(e in r)){throw new Error(`Unknown Chalk style: ${e}`)}r=t.length>0?r[e](...t):r[e]}return r}e.exports=((e,n)=>{const r=[];const o=[];let s=[];n.replace(t,(t,n,i,c,l,a)=>{if(n){s.push(unescape(n))}else if(c){const t=s.join("");s=[];o.push(r.length===0?t:buildStyle(e,r)(t));r.push({inverse:i,styles:parseStyle(c)})}else if(l){if(r.length===0){throw new Error("Found extraneous } in Chalk template literal")}o.push(buildStyle(e,r)(s.join("")));s=[];r.pop()}else{s.push(a)}});o.push(s.join(""));if(r.length>0){const e=`Chalk template literal is missing ${r.length} closing bracket${r.length===1?"":"s"} (\`}\`)`;throw new Error(e)}return o.join("")})},941:e=>{"use strict";const t=(e,t,n)=>{let r=e.indexOf(t);if(r===-1){return e}const o=t.length;let s=0;let i="";do{i+=e.substr(s,r-s)+t+n;s=r+o;r=e.indexOf(t,s)}while(r!==-1);i+=e.substr(s);return i};const n=(e,t,n,r)=>{let o=0;let s="";do{const i=e[r-1]==="\r";s+=e.substr(o,(i?r-1:r)-o)+t+(i?"\r\n":"\n")+n;o=r+1;r=e.indexOf("\n",o)}while(r!==-1);s+=e.substr(o);return s};e.exports={stringReplaceAll:t,stringEncaseCRLFWithFirstIndex:n}},908:(e,t,n)=>{const r=n(460);const o={};for(const e of Object.keys(r)){o[r[e]]=e}const s={rgb:{channels:3,labels:"rgb"},hsl:{channels:3,labels:"hsl"},hsv:{channels:3,labels:"hsv"},hwb:{channels:3,labels:"hwb"},cmyk:{channels:4,labels:"cmyk"},xyz:{channels:3,labels:"xyz"},lab:{channels:3,labels:"lab"},lch:{channels:3,labels:"lch"},hex:{channels:1,labels:["hex"]},keyword:{channels:1,labels:["keyword"]},ansi16:{channels:1,labels:["ansi16"]},ansi256:{channels:1,labels:["ansi256"]},hcg:{channels:3,labels:["h","c","g"]},apple:{channels:3,labels:["r16","g16","b16"]},gray:{channels:1,labels:["gray"]}};e.exports=s;for(const e of Object.keys(s)){if(!("channels"in s[e])){throw new Error("missing channels property: "+e)}if(!("labels"in s[e])){throw new Error("missing channel labels property: "+e)}if(s[e].labels.length!==s[e].channels){throw new Error("channel and label counts mismatch: "+e)}const{channels:t,labels:n}=s[e];delete s[e].channels;delete s[e].labels;Object.defineProperty(s[e],"channels",{value:t});Object.defineProperty(s[e],"labels",{value:n})}s.rgb.hsl=function(e){const t=e[0]/255;const n=e[1]/255;const r=e[2]/255;const o=Math.min(t,n,r);const s=Math.max(t,n,r);const i=s-o;let c;let l;if(s===o){c=0}else if(t===s){c=(n-r)/i}else if(n===s){c=2+(r-t)/i}else if(r===s){c=4+(t-n)/i}c=Math.min(c*60,360);if(c<0){c+=360}const a=(o+s)/2;if(s===o){l=0}else if(a<=.5){l=i/(s+o)}else{l=i/(2-s-o)}return[c,l*100,a*100]};s.rgb.hsv=function(e){let t;let n;let r;let o;let s;const i=e[0]/255;const c=e[1]/255;const l=e[2]/255;const a=Math.max(i,c,l);const u=a-Math.min(i,c,l);const f=function(e){return(a-e)/6/u+1/2};if(u===0){o=0;s=0}else{s=u/a;t=f(i);n=f(c);r=f(l);if(i===a){o=r-n}else if(c===a){o=1/3+t-r}else if(l===a){o=2/3+n-t}if(o<0){o+=1}else if(o>1){o-=1}}return[o*360,s*100,a*100]};s.rgb.hwb=function(e){const t=e[0];const n=e[1];let r=e[2];const o=s.rgb.hsl(e)[0];const i=1/255*Math.min(t,Math.min(n,r));r=1-1/255*Math.max(t,Math.max(n,r));return[o,i*100,r*100]};s.rgb.cmyk=function(e){const t=e[0]/255;const n=e[1]/255;const r=e[2]/255;const o=Math.min(1-t,1-n,1-r);const s=(1-t-o)/(1-o)||0;const i=(1-n-o)/(1-o)||0;const c=(1-r-o)/(1-o)||0;return[s*100,i*100,c*100,o*100]};function comparativeDistance(e,t){return(e[0]-t[0])**2+(e[1]-t[1])**2+(e[2]-t[2])**2}s.rgb.keyword=function(e){const t=o[e];if(t){return t}let n=Infinity;let s;for(const t of Object.keys(r)){const o=r[t];const i=comparativeDistance(e,o);if(i<n){n=i;s=t}}return s};s.keyword.rgb=function(e){return r[e]};s.rgb.xyz=function(e){let t=e[0]/255;let n=e[1]/255;let r=e[2]/255;t=t>.04045?((t+.055)/1.055)**2.4:t/12.92;n=n>.04045?((n+.055)/1.055)**2.4:n/12.92;r=r>.04045?((r+.055)/1.055)**2.4:r/12.92;const o=t*.4124+n*.3576+r*.1805;const s=t*.2126+n*.7152+r*.0722;const i=t*.0193+n*.1192+r*.9505;return[o*100,s*100,i*100]};s.rgb.lab=function(e){const t=s.rgb.xyz(e);let n=t[0];let r=t[1];let o=t[2];n/=95.047;r/=100;o/=108.883;n=n>.008856?n**(1/3):7.787*n+16/116;r=r>.008856?r**(1/3):7.787*r+16/116;o=o>.008856?o**(1/3):7.787*o+16/116;const i=116*r-16;const c=500*(n-r);const l=200*(r-o);return[i,c,l]};s.hsl.rgb=function(e){const t=e[0]/360;const n=e[1]/100;const r=e[2]/100;let o;let s;let i;if(n===0){i=r*255;return[i,i,i]}if(r<.5){o=r*(1+n)}else{o=r+n-r*n}const c=2*r-o;const l=[0,0,0];for(let e=0;e<3;e++){s=t+1/3*-(e-1);if(s<0){s++}if(s>1){s--}if(6*s<1){i=c+(o-c)*6*s}else if(2*s<1){i=o}else if(3*s<2){i=c+(o-c)*(2/3-s)*6}else{i=c}l[e]=i*255}return l};s.hsl.hsv=function(e){const t=e[0];let n=e[1]/100;let r=e[2]/100;let o=n;const s=Math.max(r,.01);r*=2;n*=r<=1?r:2-r;o*=s<=1?s:2-s;const i=(r+n)/2;const c=r===0?2*o/(s+o):2*n/(r+n);return[t,c*100,i*100]};s.hsv.rgb=function(e){const t=e[0]/60;const n=e[1]/100;let r=e[2]/100;const o=Math.floor(t)%6;const s=t-Math.floor(t);const i=255*r*(1-n);const c=255*r*(1-n*s);const l=255*r*(1-n*(1-s));r*=255;switch(o){case 0:return[r,l,i];case 1:return[c,r,i];case 2:return[i,r,l];case 3:return[i,c,r];case 4:return[l,i,r];case 5:return[r,i,c]}};s.hsv.hsl=function(e){const t=e[0];const n=e[1]/100;const r=e[2]/100;const o=Math.max(r,.01);let s;let i;i=(2-n)*r;const c=(2-n)*o;s=n*o;s/=c<=1?c:2-c;s=s||0;i/=2;return[t,s*100,i*100]};s.hwb.rgb=function(e){const t=e[0]/360;let n=e[1]/100;let r=e[2]/100;const o=n+r;let s;if(o>1){n/=o;r/=o}const i=Math.floor(6*t);const c=1-r;s=6*t-i;if((i&1)!==0){s=1-s}const l=n+s*(c-n);let a;let u;let f;switch(i){default:case 6:case 0:a=c;u=l;f=n;break;case 1:a=l;u=c;f=n;break;case 2:a=n;u=c;f=l;break;case 3:a=n;u=l;f=c;break;case 4:a=l;u=n;f=c;break;case 5:a=c;u=n;f=l;break}return[a*255,u*255,f*255]};s.cmyk.rgb=function(e){const t=e[0]/100;const n=e[1]/100;const r=e[2]/100;const o=e[3]/100;const s=1-Math.min(1,t*(1-o)+o);const i=1-Math.min(1,n*(1-o)+o);const c=1-Math.min(1,r*(1-o)+o);return[s*255,i*255,c*255]};s.xyz.rgb=function(e){const t=e[0]/100;const n=e[1]/100;const r=e[2]/100;let o;let s;let i;o=t*3.2406+n*-1.5372+r*-.4986;s=t*-.9689+n*1.8758+r*.0415;i=t*.0557+n*-.204+r*1.057;o=o>.0031308?1.055*o**(1/2.4)-.055:o*12.92;s=s>.0031308?1.055*s**(1/2.4)-.055:s*12.92;i=i>.0031308?1.055*i**(1/2.4)-.055:i*12.92;o=Math.min(Math.max(0,o),1);s=Math.min(Math.max(0,s),1);i=Math.min(Math.max(0,i),1);return[o*255,s*255,i*255]};s.xyz.lab=function(e){let t=e[0];let n=e[1];let r=e[2];t/=95.047;n/=100;r/=108.883;t=t>.008856?t**(1/3):7.787*t+16/116;n=n>.008856?n**(1/3):7.787*n+16/116;r=r>.008856?r**(1/3):7.787*r+16/116;const o=116*n-16;const s=500*(t-n);const i=200*(n-r);return[o,s,i]};s.lab.xyz=function(e){const t=e[0];const n=e[1];const r=e[2];let o;let s;let i;s=(t+16)/116;o=n/500+s;i=s-r/200;const c=s**3;const l=o**3;const a=i**3;s=c>.008856?c:(s-16/116)/7.787;o=l>.008856?l:(o-16/116)/7.787;i=a>.008856?a:(i-16/116)/7.787;o*=95.047;s*=100;i*=108.883;return[o,s,i]};s.lab.lch=function(e){const t=e[0];const n=e[1];const r=e[2];let o;const s=Math.atan2(r,n);o=s*360/2/Math.PI;if(o<0){o+=360}const i=Math.sqrt(n*n+r*r);return[t,i,o]};s.lch.lab=function(e){const t=e[0];const n=e[1];const r=e[2];const o=r/360*2*Math.PI;const s=n*Math.cos(o);const i=n*Math.sin(o);return[t,s,i]};s.rgb.ansi16=function(e,t=null){const[n,r,o]=e;let i=t===null?s.rgb.hsv(e)[2]:t;i=Math.round(i/50);if(i===0){return 30}let c=30+(Math.round(o/255)<<2|Math.round(r/255)<<1|Math.round(n/255));if(i===2){c+=60}return c};s.hsv.ansi16=function(e){return s.rgb.ansi16(s.hsv.rgb(e),e[2])};s.rgb.ansi256=function(e){const t=e[0];const n=e[1];const r=e[2];if(t===n&&n===r){if(t<8){return 16}if(t>248){return 231}return Math.round((t-8)/247*24)+232}const o=16+36*Math.round(t/255*5)+6*Math.round(n/255*5)+Math.round(r/255*5);return o};s.ansi16.rgb=function(e){let t=e%10;if(t===0||t===7){if(e>50){t+=3.5}t=t/10.5*255;return[t,t,t]}const n=(~~(e>50)+1)*.5;const r=(t&1)*n*255;const o=(t>>1&1)*n*255;const s=(t>>2&1)*n*255;return[r,o,s]};s.ansi256.rgb=function(e){if(e>=232){const t=(e-232)*10+8;return[t,t,t]}e-=16;let t;const n=Math.floor(e/36)/5*255;const r=Math.floor((t=e%36)/6)/5*255;const o=t%6/5*255;return[n,r,o]};s.rgb.hex=function(e){const t=((Math.round(e[0])&255)<<16)+((Math.round(e[1])&255)<<8)+(Math.round(e[2])&255);const n=t.toString(16).toUpperCase();return"000000".substring(n.length)+n};s.hex.rgb=function(e){const t=e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);if(!t){return[0,0,0]}let n=t[0];if(t[0].length===3){n=n.split("").map(e=>{return e+e}).join("")}const r=parseInt(n,16);const o=r>>16&255;const s=r>>8&255;const i=r&255;return[o,s,i]};s.rgb.hcg=function(e){const t=e[0]/255;const n=e[1]/255;const r=e[2]/255;const o=Math.max(Math.max(t,n),r);const s=Math.min(Math.min(t,n),r);const i=o-s;let c;let l;if(i<1){c=s/(1-i)}else{c=0}if(i<=0){l=0}else if(o===t){l=(n-r)/i%6}else if(o===n){l=2+(r-t)/i}else{l=4+(t-n)/i}l/=6;l%=1;return[l*360,i*100,c*100]};s.hsl.hcg=function(e){const t=e[1]/100;const n=e[2]/100;const r=n<.5?2*t*n:2*t*(1-n);let o=0;if(r<1){o=(n-.5*r)/(1-r)}return[e[0],r*100,o*100]};s.hsv.hcg=function(e){const t=e[1]/100;const n=e[2]/100;const r=t*n;let o=0;if(r<1){o=(n-r)/(1-r)}return[e[0],r*100,o*100]};s.hcg.rgb=function(e){const t=e[0]/360;const n=e[1]/100;const r=e[2]/100;if(n===0){return[r*255,r*255,r*255]}const o=[0,0,0];const s=t%1*6;const i=s%1;const c=1-i;let l=0;switch(Math.floor(s)){case 0:o[0]=1;o[1]=i;o[2]=0;break;case 1:o[0]=c;o[1]=1;o[2]=0;break;case 2:o[0]=0;o[1]=1;o[2]=i;break;case 3:o[0]=0;o[1]=c;o[2]=1;break;case 4:o[0]=i;o[1]=0;o[2]=1;break;default:o[0]=1;o[1]=0;o[2]=c}l=(1-n)*r;return[(n*o[0]+l)*255,(n*o[1]+l)*255,(n*o[2]+l)*255]};s.hcg.hsv=function(e){const t=e[1]/100;const n=e[2]/100;const r=t+n*(1-t);let o=0;if(r>0){o=t/r}return[e[0],o*100,r*100]};s.hcg.hsl=function(e){const t=e[1]/100;const n=e[2]/100;const r=n*(1-t)+.5*t;let o=0;if(r>0&&r<.5){o=t/(2*r)}else if(r>=.5&&r<1){o=t/(2*(1-r))}return[e[0],o*100,r*100]};s.hcg.hwb=function(e){const t=e[1]/100;const n=e[2]/100;const r=t+n*(1-t);return[e[0],(r-t)*100,(1-r)*100]};s.hwb.hcg=function(e){const t=e[1]/100;const n=e[2]/100;const r=1-n;const o=r-t;let s=0;if(o<1){s=(r-o)/(1-o)}return[e[0],o*100,s*100]};s.apple.rgb=function(e){return[e[0]/65535*255,e[1]/65535*255,e[2]/65535*255]};s.rgb.apple=function(e){return[e[0]/255*65535,e[1]/255*65535,e[2]/255*65535]};s.gray.rgb=function(e){return[e[0]/100*255,e[0]/100*255,e[0]/100*255]};s.gray.hsl=function(e){return[0,0,e[0]]};s.gray.hsv=s.gray.hsl;s.gray.hwb=function(e){return[0,100,e[0]]};s.gray.cmyk=function(e){return[0,0,0,e[0]]};s.gray.lab=function(e){return[e[0],0,0]};s.gray.hex=function(e){const t=Math.round(e[0]/100*255)&255;const n=(t<<16)+(t<<8)+t;const r=n.toString(16).toUpperCase();return"000000".substring(r.length)+r};s.rgb.gray=function(e){const t=(e[0]+e[1]+e[2])/3;return[t/255*100]}},58:(e,t,n)=>{const r=n(908);const o=n(517);const s={};const i=Object.keys(r);function wrapRaw(e){const t=function(...t){const n=t[0];if(n===undefined||n===null){return n}if(n.length>1){t=n}return e(t)};if("conversion"in e){t.conversion=e.conversion}return t}function wrapRounded(e){const t=function(...t){const n=t[0];if(n===undefined||n===null){return n}if(n.length>1){t=n}const r=e(t);if(typeof r==="object"){for(let e=r.length,t=0;t<e;t++){r[t]=Math.round(r[t])}}return r};if("conversion"in e){t.conversion=e.conversion}return t}i.forEach(e=>{s[e]={};Object.defineProperty(s[e],"channels",{value:r[e].channels});Object.defineProperty(s[e],"labels",{value:r[e].labels});const t=o(e);const n=Object.keys(t);n.forEach(n=>{const r=t[n];s[e][n]=wrapRounded(r);s[e][n].raw=wrapRaw(r)})});e.exports=s},517:(e,t,n)=>{const r=n(908);function buildGraph(){const e={};const t=Object.keys(r);for(let n=t.length,r=0;r<n;r++){e[t[r]]={distance:-1,parent:null}}return e}function deriveBFS(e){const t=buildGraph();const n=[e];t[e].distance=0;while(n.length){const e=n.pop();const o=Object.keys(r[e]);for(let r=o.length,s=0;s<r;s++){const r=o[s];const i=t[r];if(i.distance===-1){i.distance=t[e].distance+1;i.parent=e;n.unshift(r)}}}return t}function link(e,t){return function(n){return t(e(n))}}function wrapConversion(e,t){const n=[t[e].parent,e];let o=r[t[e].parent][e];let s=t[e].parent;while(t[s].parent){n.unshift(t[s].parent);o=link(r[t[s].parent][s],o);s=t[s].parent}o.conversion=n;return o}e.exports=function(e){const t=deriveBFS(e);const n={};const r=Object.keys(t);for(let e=r.length,o=0;o<e;o++){const e=r[o];const s=t[e];if(s.parent===null){continue}n[e]=wrapConversion(e,t)}return n}},460:e=>{"use strict";e.exports={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]}},795:e=>{"use strict";e.exports=((e,t=process.argv)=>{const n=e.startsWith("-")?"":e.length===1?"-":"--";const r=t.indexOf(n+e);const o=t.indexOf("--");return r!==-1&&(o===-1||r<o)})},875:(e,t,n)=>{"use strict";const r=n(87);const o=n(867);const s=n(795);const{env:i}=process;let c;if(s("no-color")||s("no-colors")||s("color=false")||s("color=never")){c=0}else if(s("color")||s("colors")||s("color=true")||s("color=always")){c=1}if("FORCE_COLOR"in i){if(i.FORCE_COLOR==="true"){c=1}else if(i.FORCE_COLOR==="false"){c=0}else{c=i.FORCE_COLOR.length===0?1:Math.min(parseInt(i.FORCE_COLOR,10),3)}}function translateLevel(e){if(e===0){return false}return{level:e,hasBasic:true,has256:e>=2,has16m:e>=3}}function supportsColor(e,t){if(c===0){return 0}if(s("color=16m")||s("color=full")||s("color=truecolor")){return 3}if(s("color=256")){return 2}if(e&&!t&&c===undefined){return 0}const n=c||0;if(i.TERM==="dumb"){return n}if(process.platform==="win32"){const e=r.release().split(".");if(Number(e[0])>=10&&Number(e[2])>=10586){return Number(e[2])>=14931?3:2}return 1}if("CI"in i){if(["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI"].some(e=>e in i)||i.CI_NAME==="codeship"){return 1}return n}if("TEAMCITY_VERSION"in i){return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(i.TEAMCITY_VERSION)?1:0}if("GITHUB_ACTIONS"in i){return 1}if(i.COLORTERM==="truecolor"){return 3}if("TERM_PROGRAM"in i){const e=parseInt((i.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(i.TERM_PROGRAM){case"iTerm.app":return e>=3?3:2;case"Apple_Terminal":return 2}}if(/-256(color)?$/i.test(i.TERM)){return 2}if(/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(i.TERM)){return 1}if("COLORTERM"in i){return 1}return n}function getSupportLevel(e){const t=supportsColor(e,e&&e.isTTY);return translateLevel(t)}e.exports={supportsColor:getSupportLevel,stdout:translateLevel(supportsColor(true,o.isatty(1))),stderr:translateLevel(supportsColor(true,o.isatty(2)))}},167:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A_:()=>createJsonCodegenService,Kw:()=>runCodegenServicesIncrementally});var fs__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(747);var fs__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);var path__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(622);var path__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);var typescript__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(34);var typescript__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(typescript__WEBPACK_IMPORTED_MODULE_2__);var lib_changed_files__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(614);var lib_incremental__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(570);var __awaiter=undefined&&undefined.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,o){function fulfilled(e){try{step(r.next(e))}catch(e){o(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){o(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};class CodegenInMemoryFilesystem{constructor(e){this.files=new Map(e)}fileExists(e){return this.files.has(e)}readFile(e){const t=this.files.get(e);if(t==null)throw new Error(`No such file: ${e}`);return t}writeFile(e,t){this.files.set(e,t)}deleteFile(e){this.files.delete(e)}}const CodegenRealFilesystem={fileExists:e=>(0,fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(e),readFile:e=>(0,fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync)(e).toString(),writeFile:(e,t)=>{(0,fs__WEBPACK_IMPORTED_MODULE_0__.mkdirSync)((0,path__WEBPACK_IMPORTED_MODULE_1__.dirname)(e),{recursive:true});(0,fs__WEBPACK_IMPORTED_MODULE_0__.writeFileSync)(e,t)},deleteFile:e=>(0,fs__WEBPACK_IMPORTED_MODULE_0__.unlinkSync)(e)};const createJsonCodegenService=(e,t,n)=>({name:e,sourceFileIsRelevant:t,run:(e,t)=>n(e,JSON.parse(t))});const createTypeScriptCodegenService=(name,sourceFileIsRelevant,run)=>({name:name,sourceFileIsRelevant:sourceFileIsRelevant,run:(sourceFilename,source)=>{const transpiledModuleCode=typescript__WEBPACK_IMPORTED_MODULE_2__.transpile(source,{module:typescript__WEBPACK_IMPORTED_MODULE_2__.ModuleKind.CommonJS});const wrappedModuleCodeForEval=`((exports) => {\n      ${transpiledModuleCode}\n\n      return exports.default;\n    })({})`;const evaluatedSource=eval(wrappedModuleCodeForEval);return run(sourceFilename,evaluatedSource)}});const GENERATED_FILES_SOURCE_MAPPINGS_JSON=".codegen/mappings.json";const runCodegenServicesAccordingToFilesystemEvents=(e,t,n,r)=>{const o=r.fileExists(GENERATED_FILES_SOURCE_MAPPINGS_JSON)?JSON.parse(r.readFile(GENERATED_FILES_SOURCE_MAPPINGS_JSON)).mappings:{};t.forEach(e=>{var t;((t=o[e])!==null&&t!==void 0?t:[]).forEach(e=>{if(r.fileExists(e)){r.deleteFile(e)}});delete o[e]});const s=new Set;const i=(e,t)=>e.localeCompare(t);e.forEach(e=>{n.forEach(t=>{if(!t.sourceFileIsRelevant(e)){return}const n=r.readFile(e);const c=t.run(e,n);const l=new Set;c.forEach(({outputFilename:e,outputContent:t})=>{r.writeFile(e,t);s.add(e);l.add(e)});o[e]=Array.from(l).sort(i)})});r.writeFile(GENERATED_FILES_SOURCE_MAPPINGS_JSON,JSON.stringify({__type__:"@"+"generated",mappings:Object.fromEntries(Object.entries(o).sort(([e],[t])=>i(e,t)))},undefined,2));return Array.from(s).sort(i)};const runCodegenServicesIncrementally=(e,t)=>__awaiter(void 0,void 0,void 0,function*(){yield(0,lib_incremental__WEBPACK_IMPORTED_MODULE_4__.Z)({lastestKnownGoodRunTimeFilename:e,needRerun:()=>__awaiter(void 0,void 0,void 0,function*(){return["codegen"]}),rerun:(e,n)=>__awaiter(void 0,void 0,void 0,function*(){var e;const r=(e=n["codegen"])!==null&&e!==void 0?e:0;const{changedFiles:o,deletedFiles:s}=yield(0,lib_changed_files__WEBPACK_IMPORTED_MODULE_3__.Z)(r);runCodegenServicesAccordingToFilesystemEvents(o,s,t,CodegenRealFilesystem);return true})})})},614:(e,t,n)=>{"use strict";n.d(t,{Z:()=>d});var r=n(129);var o=n.n(r);var s=n(605);var i=n.n(s);var c=undefined&&undefined.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,o){function fulfilled(e){try{step(r.next(e))}catch(e){o(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){o(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};const l=e=>{const t=[];const n=[];e.trim().split("\n").forEach(e=>{const r=e.trim().split(/\s/).filter(e=>e.trim().length>0);if(r.length===0){return}const o=r[0];if(o==="A"||o==="M"){t.push(r[1])}else if(o==="D"){n.push(r[1])}else if(o.startsWith("R")){n.push(r[1]);t.push(r[2])}});return{changedFiles:t,deletedFiles:n}};const a=e=>new Promise((t,n)=>{s.get(e,e=>{let r="";e.on("data",e=>{r+=e});e.on("end",()=>{try{t(JSON.parse(r))}catch(e){n(e)}})}).on("error",e=>{n(e)})});const u=(e,t=".")=>c(void 0,void 0,void 0,function*(){const n=yield a(`http://localhost:19815/?since=${e}&pathPrefix=${t}`);const r=[];const o=[];n.forEach(({type:e,filename:t})=>{if(e==="changed"){r.push(t)}else{o.push(t)}});return{changedFiles:r,deletedFiles:o}});const f=(e,t=".")=>c(void 0,void 0,void 0,function*(){const n=(e,n)=>{const o=(0,r.spawnSync)("git",["diff",e,...n?[n]:[],"--name-status","--diff-filter=ADRM","--",t]).stdout.toString();return l(o)};if(process.env.CI){return n("HEAD^","HEAD")}try{return yield u(e,t)}catch(e){return n("origin/master")}});const d=f},570:(e,t,n)=>{"use strict";n.d(t,{Z:()=>a});var r=n(747);var o=n.n(r);var s=n(622);var i=n.n(s);var c=undefined&&undefined.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,o){function fulfilled(e){try{step(r.next(e))}catch(e){o(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){o(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};const l=e=>c(void 0,void 0,void 0,function*(){const t=(0,r.existsSync)(e.lastestKnownGoodRunTimeFilename)?JSON.parse((0,r.readFileSync)(e.lastestKnownGoodRunTimeFilename).toString()):{};const n=yield e.needRerun(t);const o=yield Promise.all(n.map(n=>c(void 0,void 0,void 0,function*(){return[n,yield e.rerun(n,t)]})));const i=(new Date).getTime();const l=[];o.forEach(([e,n])=>{if(n){t[e]=i}else{l.push(e)}});(0,r.mkdirSync)((0,s.dirname)(e.lastestKnownGoodRunTimeFilename),{recursive:true});(0,r.writeFileSync)(e.lastestKnownGoodRunTimeFilename,JSON.stringify(t,undefined,2));return l});const a=l},321:(e,t,n)=>{"use strict";n.d(t,{$:()=>l});var r=n(747);var o=n.n(r);var s=n(622);var i=n.n(s);const c=()=>{let e=process.cwd();while(e!=="/"){const t=(0,s.join)(e,"package.json");if((0,r.existsSync)(t)&&(0,r.lstatSync)(t).isFile()){const n=JSON.parse((0,r.readFileSync)(t).toString());if(Array.isArray(n.workspaces)){return e}}e=(0,s.dirname)(e)}throw new Error("No root package.json found. Abort!")};const l=c()},563:(e,t,n)=>{"use strict";n.r(t);var r=n(129);var o=n(747);var s=n(622);var i=n(35);var c=n.n(i);var l=n(614);var a=n(570);var u=undefined&&undefined.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,o){function fulfilled(e){try{step(r.next(e))}catch(e){o(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){o(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};const f=JSON.parse((0,o.readFileSync)("workspaces.json").toString());const d={lastestKnownGoodRunTimeFilename:(0,s.join)(".monorail","compile-cache.json"),needRerun:e=>u(void 0,void 0,void 0,function*(){const t=yield Promise.all(f.topologicallyOrdered.map(t=>u(void 0,void 0,void 0,function*(){const n=yield Promise.all(f.information[t].dependencyChain.map(t=>u(void 0,void 0,void 0,function*(){var n;const{changedFiles:r,deletedFiles:o}=yield(0,l.Z)((n=e[t])!==null&&n!==void 0?n:0,f.information[t].workspaceLocation);return r.length+o.length!==0})));return[t,n.some(e=>e)]})));const n=t.filter(([,e])=>e).map(([e])=>e);if(n.length!==0){console.log(c().yellow(`[${n.join(", ")}] needs to be re-compiled!`))}return n}),rerun:e=>u(void 0,void 0,void 0,function*(){console.log(`Compiling \`${e}\`...`);const t=(0,r.spawn)("yarn",["workspace",e,"compile"]);return yield new Promise(e=>{t.on("exit",t=>e(t===0))})})};const p=()=>u(void 0,void 0,void 0,function*(){console.log(c().blue("--- Monorail Incremental Compile Service ---"));const e=yield(0,a.Z)(d);if(e.length===0){console.log(c().green("[✓] All workspaces have been successfully compiled!"));return}throw new Error(`[x] [${e.join(", ")}] failed to exit with 0`)});const _=p;var h=n(167);const g=(e,t={})=>({type:"use-action",actionName:e,actionArguments:t});const b=(e,t)=>({type:"run",stepName:e,command:t});const m=e=>{switch(e.type){case"use-action":{const t=`      - uses: ${e.actionName}\n`;if(Object.keys(e.actionArguments).length===0){return t}const n=Object.entries(e.actionArguments).map(([e,t])=>{const n=t.split("\n");if(n.length===1){return`          ${e}: ${n[0]}`}return`          ${e}: |\n${n.map(e=>`            ${e}`).join("\n")}`}).join("\n");return`${t}        with:\n${n}\n`}case"run":{const t=`      - name: ${e.stepName}\n`;const n=e.command.split("\n");if(n.length===1){return`${t}        run: ${n[0]}\n`}return`${t}        run: |\n${n.map(e=>`          ${e}\n`).join("")}`}default:throw new Error}};const y=({jobName:e,jobSteps:t})=>{return`  ${e}:\n    runs-on: ubuntu-latest\n    steps:\n${t.map(m).join("")}`};const w=({workflowName:e,workflowtrigger:{triggerPaths:t,masterBranchOnly:n},workflowSecrets:r=[],workflowJobs:o})=>{const s=`# @generated\n\nname: ${e}\non:\n  push:\n    paths:\n${t.map(e=>`      - '${e}'\n`).join("")}${n?`    branches:\n      - master\n`:""}${r.length>0?`env:\n${r.map(e=>`  ${e}: \${{ secrets.${e} }}`).join("\n")}\n`:""}\njobs:\n${o.map(y).join("")}`;return s};const v=g("actions/checkout@v2");const E=g("actions/setup-node@v2-beta");const O=g("actions/cache@v2",{path:".yarn/cache\n.pnp.js",key:"yarn-berry-${{ hashFiles('**/yarn.lock') }}","restore-keys":"yarn-berry-"});const k=[v,E,O,b("Yarn Install","yarn install --immutable")];const M=e=>{const t=t=>{var n,r;return((r=(n=JSON.parse((0,o.readFileSync)((0,s.join)(e.information[t].workspaceLocation,"package.json")).toString()))===null||n===void 0?void 0:n.scripts)===null||r===void 0?void 0:r.deploy)!=null};return Object.fromEntries([...e.topologicallyOrdered.filter(t).map(t=>{const n=`cd-${t}`;return[n,{workflowName:`CD ${t}`,workflowtrigger:{triggerPaths:[...e.information[t].dependencyChain.map(t=>`${e.information[t].workspaceLocation}/**`),"configuration/**",`.github/workflows/generated-*-${t}.yml`],masterBranchOnly:true},workflowSecrets:["FIREBASE_TOKEN"],workflowJobs:[{jobName:"deploy",jobSteps:[...k,b("Build",`yarn workspace ${t} build`),b("Install firebase-tools","sudo npm install -g firebase-tools"),b("Deploy",`yarn workspace ${t} deploy`)]}]}]})])};const C=()=>["general",{workflowName:"General",workflowtrigger:{triggerPaths:["**"],masterBranchOnly:false},workflowJobs:[{jobName:"lint",jobSteps:[...k,b("Codegen",`yarn node packages/monorail/bin/index.js codegen`),b("Check changed","if [[ `git status --porcelain` ]]; then exit 1; fi"),b("Format Check","yarn format:check"),b("Lint","yarn lint")]},{jobName:"build",jobSteps:[g("actions/checkout@v2",{"fetch-depth":"2"}),E,O,b("Yarn Install","yarn install --immutable"),b("Build","yarn compile")]},{jobName:"test",jobSteps:[...k,b("Test","yarn test")]}]}];const S=(0,h.A_)("GitHub Actions Workflows Codegen",e=>e==="workspaces.json",(e,t)=>{return[C(),...Object.entries(M(t))].map(([e,t])=>({outputFilename:`.github/workflows/generated-${e}.yml`,outputContent:w(t)}))});const j={name:"Ignore Files Codegen",sourceFileIsRelevant:e=>e===".gitignore",run:(e,t)=>{const n=`# ${"@"+"generated"}\n\n${t}\n\n# additions\n.yarn\n**/bin/`;return[{outputFilename:".eslintignore",outputContent:n},{outputFilename:".prettierignore",outputContent:n}]}};const P=[S,j];const x=P;var R=undefined&&undefined.__awaiter||function(e,t,n,r){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,o){function fulfilled(e){try{step(r.next(e))}catch(e){o(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){o(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};try{process.chdir(n(321).$)}catch(e){console.error(e.message);process.exit(1)}const I=()=>{const e=process.argv.slice(2);if(e.length===0){return"CODEGEN"}switch(e[0].toLowerCase()){case"codegen":return"CODEGEN";case"compile":case"c":return"COMPILE";case"no-changed":case"nc":return"NO_CHANGED";default:throw new Error(`Unknown command: ${e[0]}`)}};const A=()=>R(void 0,void 0,void 0,function*(){try{switch(I()){case"CODEGEN":{yield(0,h.Kw)((0,s.join)(".monorail","codegen-cache.json"),x);return}case"COMPILE":yield _();return;case"NO_CHANGED":{const e=(0,r.spawnSync)("git",["status","--porcelain"],{shell:true}).stdout.toString();if(e.length===0)return;throw new Error(`There are changed files! Generated files might be out-of-sync!\n${e.trimEnd()}`)}default:throw new Error}}catch(e){console.error(c().red(e.message));process.exit(1)}});A()},129:e=>{"use strict";e.exports=require("child_process")},747:e=>{"use strict";e.exports=require("fs")},605:e=>{"use strict";e.exports=require("http")},87:e=>{"use strict";e.exports=require("os")},622:e=>{"use strict";e.exports=require("path")},867:e=>{"use strict";e.exports=require("tty")},34:e=>{"use strict";e.exports=require("typescript")}};var __webpack_module_cache__={};function __webpack_require__(e){if(__webpack_module_cache__[e]){return __webpack_module_cache__[e].exports}var t=__webpack_module_cache__[e]={id:e,loaded:false,exports:{}};var n=true;try{__webpack_modules__[e](t,t.exports,__webpack_require__);n=false}finally{if(n)delete __webpack_module_cache__[e]}t.loaded=true;return t.exports}(()=>{__webpack_require__.n=(e=>{var t=e&&e.__esModule?()=>e["default"]:()=>e;__webpack_require__.d(t,{a:t});return t})})();(()=>{__webpack_require__.d=((e,t)=>{for(var n in t){if(__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)){Object.defineProperty(e,n,{enumerable:true,get:t[n]})}}})})();(()=>{__webpack_require__.o=((e,t)=>Object.prototype.hasOwnProperty.call(e,t))})();(()=>{__webpack_require__.r=(e=>{if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(e,"__esModule",{value:true})})})();(()=>{__webpack_require__.nmd=(e=>{e.paths=[];if(!e.children)e.children=[];return e})})();__webpack_require__.ab=__dirname+"/";return __webpack_require__(563)})();