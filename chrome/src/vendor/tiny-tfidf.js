var TinyTFIDF=function(e){var t={};function r(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(n,s,function(t){return e[t]}.bind(null,s));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t),r.d(t,"Corpus",(function(){return i})),r.d(t,"Document",(function(){return n})),r.d(t,"Similarity",(function(){return c})),r.d(t,"Stopwords",(function(){return o}));class n{constructor(e){this._text=e,this._words=e.match(/[a-zA-ZÀ-ÖØ-öø-ÿ]+/g).filter(e=>!(e.length<2||e.match(/^\d/))).map(e=>e.toLowerCase()),this._termFrequencies=null}_calculateTermFrequencies(){this._termFrequencies=new Map,this._words.forEach(e=>{this._termFrequencies.has(e)?this._termFrequencies.set(e,this._termFrequencies.get(e)+1):this._termFrequencies.set(e,1)})}getTermFrequency(e){return this._termFrequencies||this._calculateTermFrequencies(),this._termFrequencies.has(e)?this._termFrequencies.get(e):null}getText(){return this._text}getLength(){return this._words.length}getUniqueTerms(){return this._termFrequencies||this._calculateTermFrequencies(),Array.from(this._termFrequencies.keys())}}const s=["me","my","myself","we","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their","theirs","themselves","what","which","who","whom","this","that","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","doing","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after","above","below","to","from","up","down","in","out","on","off","over","under","again","further","then","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","can","will","just","don","could","should","would","now","ll","re","ve","aren","couldn","didn","doesn","hadn","hasn","haven","isn","mustn","needn","shouldn","wasn","weren","won","wouldn"];class o{constructor(e=!0,t=[]){const r=e?t.concat(s):t;this._stopwords=new Map(r.map(e=>[e,!0]))}includes(e){return this._stopwords.has(e)}getStopwordList(){return Array.from(this._stopwords.keys())}}class i{constructor(e,t,r=!0,s=[],i=2,c=.75){this._stopwords=new o(r,s),this._K1=i,this._b=c,this._documents=new Map;for(let r=0;r<t.length;r++)this._documents.set(e[r],new n(t[r]));this._collectionFrequencies=null,this._collectionFrequencyWeights=null,this._documentVectors=null}_calculateCollectionFrequencies(){this._collectionFrequencies=new Map;for(const e of this._documents.values())e.getUniqueTerms().filter(e=>!this._stopwords.includes(e)).forEach(e=>{if(this._collectionFrequencies.has(e)){const t=this._collectionFrequencies.get(e);this._collectionFrequencies.set(e,t+1)}else this._collectionFrequencies.set(e,1)})}getTerms(){return this._collectionFrequencies||this._calculateCollectionFrequencies(),Array.from(this._collectionFrequencies.keys())}getCollectionFrequency(e){return this._collectionFrequencies||this._calculateCollectionFrequencies(),this._collectionFrequencies.has(e)?this._collectionFrequencies.get(e):null}getDocument(e){return this._documents.get(e)}getDocumentIdentifiers(){return Array.from(this._documents.keys())}getCommonTerms(e,t,r=10){const n=this.getDocumentVector(e),s=this.getDocumentVector(t);return Array.from(n.entries()).map(([e,t])=>[e,t*s.get(e)]).filter(e=>e[1]>0).sort((e,t)=>t[1]-e[1]).slice(0,r)}_calculateCollectionFrequencyWeights(){this._collectionFrequencies||this._calculateCollectionFrequencies(),this._collectionFrequencyWeights=new Map;const e=this._documents.size;for(const[t,r]of this._collectionFrequencies.entries())this._collectionFrequencyWeights.set(t,Math.log(e+1)-Math.log(r))}getCollectionFrequencyWeight(e){return this._collectionFrequencyWeights||this._calculateCollectionFrequencyWeights(),this._collectionFrequencyWeights.has(e)?this._collectionFrequencyWeights.get(e):null}_calculateDocumentVectors(){this._collectionFrequencyWeights||this._calculateCollectionFrequencyWeights(),this._documentVectors=new Map;const e=this._K1,t=this._b,r=Array.from(this._documents.values()).map(e=>e.getLength()).reduce((e,t)=>e+t,0)/this._documents.size;for(const[n,s]of this._documents){const o=new Map,i=s.getLength()/r;for(const[r,n]of this._collectionFrequencyWeights.entries()){const c=s.getTermFrequency(r),u=c?n*c*(e+1)/(e*(1-t+t*i)+c):0;o.set(r,u)}this._documentVectors.set(n,o)}}getDocumentVector(e){return this._documentVectors||this._calculateDocumentVectors(),this._documentVectors.get(e)}getTopTermsForDocument(e,t=30){const r=this.getDocumentVector(e);return r?Array.from(r.entries()).filter(e=>e[1]>0).sort((e,t)=>t[1]-e[1]).slice(0,t):[]}getResultsForQuery(e){if(!e||"string"!=typeof e||0===e.length)return[];const t=new n(e).getUniqueTerms();return this.getDocumentIdentifiers().map(e=>{const r=this.getDocumentVector(e);let n=0;return t.forEach(e=>{const t=r.get(e);t&&(n+=t)}),[e,n]}).filter(e=>e[1]>0).sort((e,t)=>t[1]-e[1])}getStopwords(){return this._stopwords}}class c{constructor(e){this._corpus=e,this._distanceMatrix=null}static cosineSimilarity(e,t){const r=Array.from(e.values()),n=Array.from(t.values());let s=0,o=0,i=0;const c=Math.min(r.length,n.length);for(let e=0;e<c;e++)0===r[e]&&0===n[e]||(s+=r[e]*n[e],o+=r[e]*r[e],i+=n[e]*n[e]);const u=Math.sqrt(o)*Math.sqrt(i);return u?s/u:0}_calculateDistanceMatrix(){const e=this._corpus.getDocumentIdentifiers(),t=e.map(e=>this._corpus.getDocumentVector(e)),r=new Array(t.length).fill(null).map(()=>new Array(t.length));for(let e=0;e<t.length;e++)for(let n=e;n<t.length;n++)e===n?r[e][n]=0:(r[e][n]=1-c.cosineSimilarity(t[e],t[n]),r[n][e]=r[e][n]);this._distanceMatrix={identifiers:e,matrix:r}}getDistanceMatrix(){return this._distanceMatrix||this._calculateDistanceMatrix(),this._distanceMatrix}}}]);