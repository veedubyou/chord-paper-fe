(this["webpackJsonpchord-paper-fe"]=this["webpackJsonpchord-paper-fe"]||[]).push([[0],{109:function(e,t,n){e.exports=n.p+"static/media/symphony.4ca23f9c.png"},131:function(e,t,n){e.exports=n(154)},136:function(e,t,n){},154:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(9),o=n.n(i),c=(n(136),n(119)),l=n(193),d=n(203),u=n(15),s=n(5),h=n(191),m=n(70),p=n(205),y=n(195),f=n(54),g=n(21),v=n(204),E=n(31),b=n.n(E),w=function(e){var t=Object(a.useState)(e.children),n=Object(u.a)(t,2),i=n[0],o=n[1],c=r.a.createRef(),l=Object(g.a)(),d=function(t){e.onFinish&&e.onFinish(t)};return r.a.createElement(v.a,{autoFocus:!0,variant:"filled",inputProps:Object(f.a)({"data-testid":"InnerInput"},function(){var t,n,a,r=void 0;void 0!==e.variant&&(r=null===l||void 0===l||null===(a=l.typography)||void 0===a?void 0:a[e.variant]);var i={style:{padding:void 0!==(null===(t=r)||void 0===t?void 0:t.padding)?r.padding:0,fontSize:null===(n=r)||void 0===n?void 0:n.fontSize,opacity:1,background:b.a[100]}};return void 0!==e.width&&i.style&&(i.style.width=e.width),i}()),inputRef:c,value:i,onBlur:function(){d(i)},onChange:function(e){o(e.target.value)},onKeyDown:function(t){var n,a;if("Enter"!==t.key){var r="Backspace"===t.key&&(t.metaKey||t.ctrlKey),o=0===(null===(n=c.current)||void 0===n?void 0:n.selectionStart)&&0===(null===(a=c.current)||void 0===a?void 0:a.selectionEnd);r&&o&&e.onSpecialBackspace&&e.onSpecialBackspace()}else d(i)},onPaste:function(t){var n=t.clipboardData.getData("text/plain");if(""!==n){var a=n.split("\r\n");if((a=a.flatMap((function(e){return e.split("\n")}))).length>1&&void 0!==e.onPasteOverflow){t.preventDefault();var r=function(e){var t,n;null===c.current||null===c.current.selectionStart||null===c.current.selectionEnd?(t=i,n=""):(t=i.slice(0,c.current.selectionStart),n=i.slice(c.current.selectionEnd));var a=t+e[0],r=e.slice(1);return r[r.length-1]+=n,[a,r]}(a),l=Object(u.a)(r,2),s=l[0],h=l[1];o(s),d(s),e.onPasteOverflow(h)}}},fullWidth:!0,"data-testid":"EditableLine"})},k=n(194),O=n(160),C=n(100),j=n.n(C),B=function(e){return/^\s+$/.test(e)},L=function(e){return B(e)?"\xa0":e},S=n(73),x=n(156),F=function(e){return{borderStyle:"solid",borderColor:e.palette.primary.main,borderRadius:"0.3em",borderWidth:"0.075em"}},W=Object(s.a)((function(e){return{root:{whiteSpace:"pre",wordSpacing:".15em"}}}))(S.a),T=Object(s.a)({root:{color:"transparent",cursor:"pointer",userSelect:"none",position:"absolute",left:0,top:0,transform:"translate(0%, -115%)"}})(W),A=Object(s.a)((function(e){return{root:{"&:hover":F(e)}}}))(T),M={variant:"h6",display:"inline"},P=Object(s.a)((function(e){return{root:{backgroundColor:e.palette.primary.main}}}))(W),I=Object(s.a)((function(e){return{root:{color:e.palette.primary.main}}}))(W),R=function(e){var t=!0===e.highlightable?A:T;return r.a.createElement(t,Object.assign({onClick:e.onClick,onMouseOver:e.onMouseOver,onMouseOut:e.onMouseOut},M,{"data-testid":"ChordEditButton"}),e.children)},N=function(e){var t=!0!==e.highlight?W:B(e.children)?P:I;return r.a.createElement(t,Object.assign({},M,{"data-testid":e["data-testid"]}),e.children)},D=Object(x.a)((function(e){return{root:{whiteSpace:"pre",cursor:"pointer",fontFamily:"PoriChord"}}}))(S.a),H=Object(x.a)((function(e){return{root:Object(f.a)(Object(f.a)({},F(e)),{},{color:e.palette.primary.dark})}}))(D),z=function(e){var t=!0===e.highlight?H:D;return r.a.createElement(t,{variant:"h6",display:"inline","data-testid":"ChordSymbol"},function(){var t=e.children;return t.endsWith(" ")?t:L(t+=" ")}())},_=function(e){var t=Object(a.useState)(!1),n=Object(u.a)(t,2),i=n[0],o=n[1],c=Object(a.useState)(null),d=Object(u.a)(c,2),s=d[0],h=d[1],m=e.chordBlock.lyricTokens;0===m.length&&(m=["\xa0"]);var y=""===e.chordBlock.chord&&!i,f=function(t,n){var a,i=s===n,c=r.a.createElement(N,{highlight:i,"data-testid":"Token-".concat(n)},t),l=n>0||y,d=r.a.createElement(R,{highlightable:l,onMouseOver:function(){return function(e){e!==s&&h(e)}(n)},onMouseOut:function(){return function(e){e===s&&h(null)}(n)},onClick:(a=n,function(t){0!==a&&e.onBlockSplit&&e.onBlockSplit(e.chordBlock,a),o(!0),t.stopPropagation()})},t);return r.a.createElement(p.a,{key:n,position:"relative",display:"inline","data-testid":"TokenBox-".concat(n)},c,d)},g=m.map((function(e,t){return f(e,t)})),v=function(t){e.onChordChange&&e.onChordChange(e.chordBlock,t),o(!1)};return r.a.createElement(p.a,{display:"inline-block"},r.a.createElement(l.a,{container:!0,direction:"column",component:"span","data-testid":e["data-testid"]},r.a.createElement(l.a,{item:!0},i?r.a.createElement(p.a,{"data-testid":"ChordEdit"},r.a.createElement(w,{width:"5em",variant:"h6",onFinish:v},e.chordBlock.chord)):y?r.a.createElement(z,null,e.chordBlock.chord):r.a.createElement(z,{highlight:0===s},e.chordBlock.chord)),r.a.createElement(l.a,{item:!0,"data-testid":"Lyric"},g)))},V=n(101),q=n.n(V),J=n(32),U=n(33),Y=function(e){return JSON.stringify(e,(function(e,t){if("id"!==e)return t}))},G=function(){function e(t){Object(J.a)(this,e),this.elements=void 0,this.elements=void 0!==t?t:[]}return Object(U.a)(e,[{key:"indexOf",value:function(e){var t=this.elements.findIndex((function(t){return t.id===e}));if(t<0)throw new Error("Can't find element inside collection");return t}},{key:"addAfter",value:function(e){for(var t,n=this.indexOf(e.id),a=arguments.length,r=new Array(a>1?a-1:0),i=1;i<a;i++)r[i-1]=arguments[i];(t=this.elements).splice.apply(t,[n+1,0].concat(r))}},{key:"addBeginning",value:function(){for(var e,t=arguments.length,n=new Array(t),a=0;a<t;a++)n[a]=arguments[a];(e=this.elements).splice.apply(e,[0,0].concat(n))}},{key:"remove",value:function(e){var t=this.indexOf(e.id);return this.elements.splice(t,1)[0]}}]),e}(),K=n(66),Z=n.n(K),$=function(e){var t=e.match(/((\w|')+|[^\w'])/g);return null===t?[]:t},Q=n(22),X=n(17),ee=Q.d({chord:Q.c,lyric:Q.c,type:Q.b("ChordBlock")}),te=function(){function e(t){var n=t.chord,a=t.lyric;Object(J.a)(this,e),this.id=void 0,this.chord=void 0,this.lyric=void 0,this.type=void 0,this.id=Z.a.generate(),this.chord=n,this.lyric=a,this.type="ChordBlock"}return Object(U.a)(e,[{key:"serialize",value:function(){return Y(this)}},{key:"split",value:function(t){if(0===t)throw new Error("Split index can't be zero");var n=this.lyricTokens,a=n.slice(0,t),r=n.slice(t),i=new e({chord:this.chord,lyric:a.join("")});return this.chord="",this.lyric=r.join(""),i}},{key:"contentEquals",value:function(e){return this.chord===e.chord&&this.lyric===e.lyric}},{key:"lyricTokens",get:function(){return $(this.lyric)}}],[{key:"fromValidatedFields",value:function(t){return new e({chord:t.chord,lyric:t.lyric})}},{key:"deserialize",value:function(t){var n=Object(X.parseJSON)(t,(function(){return new Error("Failed to parse json string")}));if(Object(X.isLeft)(n))return n;var a=n.right,r=ee.decode(a);return Object(X.isLeft)(r)?Object(X.left)(new Error("Invalid Chord Block object")):Object(X.right)(new e({chord:r.right.chord,lyric:r.right.lyric}))}}]),e}(),ne={root:{color:j.a[300]}},ae=Object(s.a)(ne)(q.a),re=Object(s.a)((function(e){return{contained:{backgroundColor:"transparent","&:hover":{backgroundColor:e.palette.primary.dark}}}}))(k.a),ie=Object(s.a)({tooltip:{padding:0,background:"transparent",margin:0}})(O.a),oe=Object(s.a)((function(e){return{root:{"&:hover":{backgroundColor:b.a[100]}}}}))(p.a),ce=function(e){var t=e.chordLine.chordBlocks;0===t.length&&(t=[new te({chord:"",lyric:""})]);var n=function(t,n){e.chordLine.setChord(t,n),e.onChangeLine&&e.onChangeLine(e.chordLine)},a=function(t,n){e.chordLine.splitBlock(t,n),e.onChangeLine&&e.onChangeLine(e.chordLine)},i=t.map((function(e,t){return r.a.createElement(_,{key:e.id,chordBlock:e,onChordChange:n,onBlockSplit:a,"data-testid":"Block-".concat(t)})}));return r.a.createElement(ie,{placement:"right",title:r.a.createElement(re,{onClick:e.onRemove,"data-testid":"RemoveButton"},r.a.createElement(ae,null)),interactive:!0},r.a.createElement(oe,{"data-testid":"NoneditableLine",onClick:e.onEdit},i))},le=function(e){var t,n=Object(a.useState)(!1),i=Object(u.a)(n,2),o=i[0],c=i[1],l=Object(a.useState)(!1),d=Object(u.a)(l,2),s=d[0],h=d[1],m=function(){c(!0)},f=function(t){c(!1),e.chordLine.replaceLyrics(t),e.onChangeLine&&e.onChangeLine(e.chordLine)},g=function(){e.onAddLine&&e.onAddLine(e.chordLine)},v=function(){s||(h(!0),e.onRemoveLine&&setTimeout((function(){e.onRemoveLine&&e.onRemoveLine(e.chordLine)}),250))},E=function(t){e.onPasteOverflow&&(e.onPasteOverflow(e.chordLine,t),c(!1))},b=function(){e.onMergeWithPreviousLine&&(e.onMergeWithPreviousLine(e.chordLine)&&c(!1))},k=function(){return r.a.createElement(ce,{chordLine:e.chordLine,onChangeLine:e.onChangeLine,onAdd:g,onRemove:v,onEdit:m})};t=o?r.a.createElement(r.a.Fragment,null,k(),function(){var t=e.chordLine.lyrics;return r.a.createElement(p.a,{position:"absolute",left:"0",bottom:"2px",width:"100%"},r.a.createElement(w,{variant:"h6",onFinish:f,onPasteOverflow:E,onSpecialBackspace:b},t))}()):k();var O=s?"up":"down";return r.a.createElement(y.a,{direction:O,in:!s,timeout:250},r.a.createElement(p.a,{borderBottom:1,borderColor:"grey.50",width:"100%",position:"relative","data-testid":e["data-testid"]},t))},de=n(71),ue=n(69),se=n(72),he=n(55),me=function(){var e=new he.DiffMatchPatch;return e.diffTimeout=0,e.matchThreshold=0,e}(),pe=function(){function e(t){Object(J.a)(this,e),this.chordLine=void 0,this.currBlockIndex=void 0,this.currCharIndex=void 0,this.blockBuffer=void 0,this.prependLyrics=void 0,this.chordLine=t,this.currBlockIndex=0,this.currCharIndex=0,this.blockBuffer=t.elements.map((function(){return""})),this.prependLyrics=""}return Object(U.a)(e,[{key:"atBlockBoundary",value:function(){return 0===this.currCharIndex}},{key:"currentBlock",value:function(){return this.chordLine.elements[this.currBlockIndex]}},{key:"currentChar",value:function(){return this.currentBlock().lyric.charAt(this.currCharIndex)}},{key:"nextChar",value:function(){this.currCharIndex+=1,this.currCharIndex>=this.currentBlock().lyric.length&&(this.currBlockIndex+=1,this.currCharIndex=0)}},{key:"skip",value:function(e){if(this.currentChar()!==e)throw new Error("Mismatched characters when skipping");this.blockBuffer[this.currBlockIndex]+=e,this.nextChar()}},{key:"insert",value:function(e){if(this.atBlockBoundary()){var t=this.currBlockIndex-1;t>=0?this.blockBuffer[t]+=e:this.prependLyrics+=e}else this.blockBuffer[this.currBlockIndex]+=e}},{key:"delete",value:function(e){if(this.currentChar()!==e)throw new Error("Mismatched characters when deleting");this.nextChar()}},{key:"finish",value:function(){for(var e=0;e<this.chordLine.elements.length;e++)this.chordLine.elements[e].lyric=this.blockBuffer[e];""!==this.prependLyrics&&this.chordLine.elements.splice(0,0,new te({chord:"",lyric:this.prependLyrics})),this.chordLine.normalizeBlocks()}}]),e}(),ye=function(e,t){var n=me.diff_main(e.lyrics,t);me.diff_cleanupSemanticLossless(n);var a,r=new pe(e),i=Object(se.a)(n);try{for(i.s();!(a=i.n()).done;){var o,c=a.value,l=c[0],d=Object(se.a)(c[1]);try{for(d.s();!(o=d.n()).done;){var u=o.value;switch(l){case he.DiffOperation.DIFF_EQUAL:r.skip(u);break;case he.DiffOperation.DIFF_INSERT:r.insert(u);break;case he.DiffOperation.DIFF_DELETE:r.delete(u)}}}catch(s){d.e(s)}finally{d.f()}}}catch(s){i.e(s)}finally{i.f()}r.finish(),function(e){var t,n=[],a=Object(se.a)(e.elements);try{for(a.s();!(t=a.n()).done;){var r=t.value;""===r.lyric&&""===r.chord||n.push(r)}}catch(s){a.e(s)}finally{a.f()}e.elements=n}(e),function(e){for(var t=e.elements,n=0;n<t.length;n++){var a=t[n];if(""===a.lyric){if(n>0&&t[n-1].lyric.length>1&&t[n-1].lyric.endsWith(" ")){var r=t[n-1],i=r.lyric.length-1;r.lyric=r.lyric.slice(0,i)}a.lyric=" "}}}(e)},fe=Q.d({elements:Q.a(ee),type:Q.b("ChordLine")}),ge=function(e){Object(de.a)(n,e);var t=Object(ue.a)(n);function n(e){var a;return Object(J.a)(this,n),void 0===e&&(e=[new te({chord:"",lyric:""})]),(a=t.call(this,e)).id=void 0,a.type=void 0,a.id=Z.a.generate(),a.type="ChordLine",a}return Object(U.a)(n,[{key:"serialize",value:function(){return Y(this)}},{key:"replaceLyrics",value:function(e){e!==this.lyrics&&ye(this,e)}},{key:"setChord",value:function(e,t){var n=this.indexOf(e.id);this.elements[n].chord=t,this.normalizeBlocks()}},{key:"splitBlock",value:function(e,t){var n=this.indexOf(e.id),a=this.elements[n].split(t);this.elements.splice(n,0,a)}},{key:"normalizeBlocks",value:function(){for(var e=[],t=0;t<this.elements.length;t++){var n=this.elements[t];if(""===n.chord&&e.length>0)e[e.length-1].lyric+=n.lyric;else e.push(n)}e.length!==this.elements.length&&(this.elements=e)}},{key:"clone",value:function(){var e=new n(this.elements);return e.id=this.id,e}},{key:"contentEquals",value:function(e){if(this.chordBlocks.length!==e.chordBlocks.length)return!1;return this.chordBlocks.reduce((function(t,n,a){if(!t)return!1;var r=e.chordBlocks[a];return!!n.contentEquals(r)}),!0)}},{key:"chordBlocks",get:function(){return this.elements}},{key:"lyrics",get:function(){return this.chordBlocks.map((function(e){return e.lyric})).join("")}}],[{key:"fromValidatedFields",value:function(e){return new n(e.elements.map((function(e){return te.fromValidatedFields(e)})))}},{key:"deserialize",value:function(e){var t=Object(X.parseJSON)(e,(function(){return new Error("Failed to parse json string")}));if(Object(X.isLeft)(t))return t;var n=t.right,a=fe.decode(n);return Object(X.isLeft)(a)?Object(X.left)(new Error("Invalid Chord Line object")):Object(X.right)(this.fromValidatedFields(a.right))}},{key:"fromLyrics",value:function(e){return new n([new te({chord:"",lyric:e})])}}]),n}(G),ve=n(196),Ee=n(81),be=n(103),we=n.n(be),ke=Object(x.a)({root:{"&:hover .MuiDivider-root":{backgroundColor:"rgba(0, 0, 0, 0.25)"}}})(l.a),Oe=Object(x.a)({tooltip:{padding:0,background:"transparent",margin:0}})(O.a),Ce=Object(x.a)({root:{width:"100%",backgroundColor:"transparent"}})(ve.a),je=Object(x.a)((function(e){return{root:{color:e.palette.secondary.light}}}))(we.a),Be=function(e){var t=Object(Ee.a)();return r.a.createElement(Oe,{title:r.a.createElement(k.a,{"data-testid":"AddButton",onClick:e.onAdd},r.a.createElement(je,null)),interactive:!0,placement:"right"},r.a.createElement(ke,{container:!0,direction:"column",justify:"center",onClick:e.onAdd,"data-testid":e["data-testid"],style:{minHeight:t.spacing(3)}},r.a.createElement(Ce,null)))},Le=Object(s.a)({root:{width:"auto"}})(h.a),Se=function(e){var t=function(){var t=new ge;e.song.addBeginning(t),d()},n=function(t){var n=new ge;e.song.addAfter(t,n),d()},a=function(t){e.song.remove(t),d()},i=function(e){d()},o=function(t,n){var a,r=n.map((function(e){return ge.fromLyrics(e)}));(a=e.song).addAfter.apply(a,[t].concat(Object(m.a)(r))),d()},c=function(t){return!!e.song.mergeLineWithPrevious(t)&&(d(),!0)},d=function(){e.onSongChanged&&e.onSongChanged(e.song)};return r.a.createElement(Le,{elevation:0},r.a.createElement(l.a,{container:!0},r.a.createElement(l.a,{item:!0,xs:1}),r.a.createElement(l.a,{item:!0,xs:10},function(){var l=e.song.chordLines.flatMap((function(e,t){return[r.a.createElement(le,{key:e.id,chordLine:e,onAddLine:n,onRemoveLine:a,onChangeLine:i,onPasteOverflow:o,onMergeWithPreviousLine:c,"data-testid":"Line-".concat(t)}),r.a.createElement(Be,{key:"NewLine-"+e.id,onAdd:function(){n(e)},"data-testid":"NewLine-".concat(t)})]})),d=r.a.createElement(Be,{key:"NewLine-Top",onAdd:t,"data-testid":"NewLine-Top"});return l.splice(0,0,d),l}()),r.a.createElement(l.a,{item:!0,xs:1})))},xe=n(120),Fe=Object(x.a)({root:{color:b.a[400]}})(S.a),We=function(e){var t=Object(a.useState)(!1),n=Object(u.a)(t,2),i=n[0],o=n[1],c=function(){o(!0)},l=function(t){o(!1),e.onValueChange&&e.onValueChange(t)},d=i?function(){if("inherit"===e.variant||"srOnly"===e.variant)throw new Error("can't have these variant types");return r.a.createElement(w,{variant:e.variant,onFinish:l,"data-testid":"EditableLine"},e.children)}():function(){e.children,e.placeholder,e.onValueChange;var t=Object(xe.a)(e,["children","placeholder","onValueChange"]);return""===e.children&&void 0!==e.placeholder?r.a.createElement(Fe,Object.assign({},t,{onClick:c}),e.placeholder):r.a.createElement(S.a,Object.assign({},t,{onClick:c}),L(e.children))}();return r.a.createElement(p.a,null,d)},Te=function(e){var t=Object(Ee.a)(),n=function(){e.onSongChanged&&e.onSongChanged(e.song)},a=r.a.createElement(l.a,{item:!0,container:!0,xs:3,direction:"column"},r.a.createElement(l.a,{item:!0},r.a.createElement(S.a,{display:"inline",variant:"caption"},"As heard from:"," "),r.a.createElement(We,{variant:"caption",placeholder:"https://www.youtube.com/watch?v=dM9zwZCOmjM",onValueChange:function(t){e.song.asHeardFrom=t,n()},"data-testid":"AsHeardAt"},e.song.asHeardFrom))),i=r.a.createElement(l.a,{item:!0,xs:6},r.a.createElement(We,{variant:"h4",align:"center","data-testid":"SongTitle",placeholder:"Song Title",onValueChange:function(t){e.song.title=t,n()}},e.song.title)),o=r.a.createElement(l.a,{item:!0,container:!0,xs:3,direction:"column"},r.a.createElement(l.a,{item:!0},r.a.createElement(S.a,{display:"inline",variant:"subtitle2"},"Composed by:"," "),r.a.createElement(We,{variant:"subtitle2",placeholder:"Stock Waterman",onValueChange:function(t){e.song.composedBy=t,n()},"data-testid":"ComposedBy"},e.song.composedBy)),r.a.createElement(l.a,{item:!0},r.a.createElement(S.a,{display:"inline",variant:"subtitle2"},"Performed by:"," "),r.a.createElement(We,{variant:"subtitle2",placeholder:"Rick Astley",onValueChange:function(t){e.song.performedBy=t,n()},"data-testid":"PerformedBy"},e.song.performedBy)));return r.a.createElement(p.a,{paddingTop:t.spacing(1),paddingLeft:t.spacing(.5),paddingRight:t.spacing(.5),"data-testid":"Header"},r.a.createElement(l.a,{container:!0},a,i,o))},Ae=n(78),Me=n.n(Ae),Pe=n(104),Ie=n(209),Re=n(210),Ne=n(198),De=n(106),He=n.n(De),ze=n(107),_e=n.n(ze),Ve=n(108),qe=n.n(Ve),Je=n(105),Ue=n.n(Je),Ye=Q.d({title:Q.c,composedBy:Q.c,performedBy:Q.c,asHeardFrom:Q.c}),Ge=Q.d({elements:Q.a(fe),metadata:Ye}),Ke=function(e){Object(de.a)(n,e);var t=Object(ue.a)(n);function n(e,a){var r;return Object(J.a)(this,n),void 0===e&&(e=[new ge]),(r=t.call(this,e)).metadata=void 0,r.metadata=void 0!==a?a:{title:"",composedBy:"",performedBy:"",asHeardFrom:""},r}return Object(U.a)(n,[{key:"serialize",value:function(){return Y(this)}},{key:"clone",value:function(){return new n(this.elements,this.metadata)}},{key:"mergeLineWithPrevious",value:function(e){var t,n=this.indexOf(e.id);if(0===n)return!1;var a=this.chordLines[n-1],r=a.chordBlocks.length-1;a.chordBlocks[r].lyric+=" ";var i=this.chordLines[n];return(t=a.chordBlocks).push.apply(t,Object(m.a)(i.chordBlocks)),a.normalizeBlocks(),this.chordLines.splice(n,1),!0}},{key:"contentEquals",value:function(e){if(this.chordLines.length!==e.chordLines.length)return!1;if(!Ue.a.isEqual(this.metadata,e.metadata))return!1;return this.chordLines.reduce((function(t,n,a){if(!t)return!1;var r=e.chordLines[a];return!!n.contentEquals(r)}),!0)}},{key:"chordLines",get:function(){return this.elements}},{key:"title",get:function(){return this.metadata.title},set:function(e){this.metadata.title=e}},{key:"performedBy",get:function(){return this.metadata.performedBy},set:function(e){this.metadata.performedBy=e}},{key:"composedBy",get:function(){return this.metadata.composedBy},set:function(e){this.metadata.composedBy=e}},{key:"asHeardFrom",get:function(){return this.metadata.asHeardFrom},set:function(e){this.metadata.asHeardFrom=e}}],[{key:"fromValidatedFields",value:function(e){return new n(e.elements.map((function(e){return ge.fromValidatedFields(e)})),e.metadata)}},{key:"deserialize",value:function(e){var t=Object(X.parseJSON)(e,(function(){return new Error("Failed to parse json string")}));if(Object(X.isLeft)(t))return t;var n=t.right,a=Ge.decode(n);return Object(X.isLeft)(a)?Object(X.left)(new Error("Invalid Chord Song object")):Object(X.right)(this.fromValidatedFields(a.right))}},{key:"fromLyricsLines",value:function(e){return new n(e.map((function(e){return ge.fromLyrics(e)})))}}]),n}(G),Ze=n(68),$e=Object(x.a)((function(e){return{root:{position:"fixed",bottom:e.spacing(2),right:e.spacing(2)}}}))(Ie.a),Qe=function(e){var t=Object(a.useState)(!1),n=Object(u.a)(t,2),i=n[0],o=n[1],c=Object(Ze.b)().enqueueSnackbar;function l(){var t=this.files;if(null!==t)if(t.length>1)c("Multiple files selected, only one file expected",{variant:"error"});else{var n=t.item(0);if(null!==n){var a=new FileReader;a.onload=function(t){if(!(null===t.target||null===t.target.result||t.target.result instanceof ArrayBuffer)){var n=Ke.deserialize(t.target.result);Object(X.isLeft)(n)?c("Can't load file, Song file failed validation",{variant:"error"}):e.onLoad&&e.onLoad(n.right)}},a.readAsText(n)}else c("Could not retrieve file from file dialog",{variant:"error"})}}var d=function(){var e=Object(Pe.a)(Me.a.mark((function e(){var t;return Me.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(t=document.createElement("input")).type="file",t.addEventListener("change",l),t.click();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return r.a.createElement($e,{icon:r.a.createElement(Re.a,null),open:i,onOpen:function(){o(!0)},onClose:function(){o(!1)},ariaLabel:"SpeedDial"},r.a.createElement(Ne.a,{icon:r.a.createElement(He.a,null),tooltipTitle:"Save",onClick:function(){var t=new Blob([e.song.serialize()],{type:"application/json"}),n=URL.createObjectURL(t),a=document.createElement("a");a.download="chord_paper_song.json",""!==e.song.title&&(a.download=e.song.title+".json"),a.href=n,a.click(),URL.revokeObjectURL(n)}}),r.a.createElement(Ne.a,{icon:r.a.createElement(_e.a,null),tooltipTitle:"Load",onClick:d}),r.a.createElement(Ne.a,{icon:r.a.createElement(qe.a,null),tooltipTitle:"New Song",onClick:e.onNewSong}))},Xe=Object(s.a)((function(e){return{root:{margin:e.spacing(5),minHeight:e.spacing(92),minWidth:e.spacing(92)}}}))(h.a),et=function(e){var t=Object(a.useState)(e.initialSong),n=Object(u.a)(t,2),i=n[0],o=n[1],c=function(e){o(e.clone())};return r.a.createElement(Xe,{elevation:3,"data-testid":"ChordPaper"},r.a.createElement(Te,{"data-testid":"Header",song:i,onSongChanged:c}),r.a.createElement(Se,{song:i,onSongChanged:c}),r.a.createElement(Qe,{song:i,onLoad:function(e){o(e.clone())},onNewSong:function(){o(new Ke)}}))},tt=["We're no strangers to love","You know the rules and so do I","A full commitment's what I'm thinking of","You wouldn't get this from any other guy","I just wanna tell you how I'm feeling","Gotta make you understand","Never gonna give you up","Never gonna let you down","Never gonna run around and desert you","Never gonna make you cry","Never gonna say goodbye","Never gonna tell a lie and hurt you"],nt=["A","Bb7","Cm","D/C#","Em7","Fmaj7","G^"],at=function(){var e=tt.map((function(e){return rt(e)}));return new Ke(e,{title:"Never Gonna Give You Up",performedBy:"Rick Astley",composedBy:"Stock Waterman",asHeardFrom:"https://www.youtube.com/watch?v=dM9zwZCOmjM"})},rt=function(e){var t=function(e,t){for(var n=$(e),a=[],r=0;r<n.length;r+=t){var i=n.slice(r,r+t);a.push(i.join(""))}return a}(e,4).map((function(e){return new te({chord:nt[Math.floor(Math.random()*nt.length)],lyric:e})}));return new ge(t)},it=n(109),ot=n.n(it),ct=n(200),lt=n(201),dt=n(202),ut=n(197),st=n(192),ht=n(207),mt=n(37),pt=n(116),yt=n.n(pt),ft=n(118),gt=n.n(ft),vt=n(113),Et=n.n(vt),bt=n(117),wt=n.n(bt),kt=n(114),Ot=n.n(kt),Ct=n(115),jt=n.n(Ct),Bt=n(158),Lt=n(112),St=n.n(Lt),xt=n(13),Ft=Object(x.a)((function(e){return{root:{margin:e.spacing(5),padding:e.spacing(5),minHeight:e.spacing(46),minWidth:e.spacing(92),position:"relative"}}}))(h.a),Wt=function(){return r.a.createElement(l.a,{container:!0,"data-testid":"Tutorial"},r.a.createElement(l.a,{item:!0,xs:3}),r.a.createElement(l.a,{item:!0,xs:6},r.a.createElement(Ft,null,r.a.createElement(S.a,null,"An Error Occurred Oh No"))),r.a.createElement(l.a,{item:!0,xs:3}))},Tt=n(199),At=n(110),Mt=n.n(At),Pt=n(111),It=n.n(Pt),Rt=Object(s.a)({root:{color:Mt.a[200]}})(It.a),Nt=Object(s.a)({root:{display:"inherit"}})(Tt.a),Dt=function(e){var t=Object(a.useState)(e.initialSong),n=Object(u.a)(t,2),i=n[0],o=n[1],c=Object(a.useState)(!1),l=Object(u.a)(c,2),d=l[0],s=l[1],m=function(t){d||void 0!==e.expectedSong&&e.expectedSong.contentEquals(t)&&s(!0)};return r.a.createElement(Nt,{badgeContent:r.a.createElement(Rt,null),invisible:!d},r.a.createElement(h.a,{elevation:1},r.a.createElement(Se,{song:i,onSongChanged:function(e){o(e.clone()),m(e)}})))},Ht=Object(x.a)((function(e){return{root:{color:e.palette.secondary.light}}}))(S.a),zt=Object(x.a)((function(e){return{root:{color:e.palette.primary.main}}}))(S.a),_t=function(){return r.a.createElement(S.a,null,"\xa0")},Vt=function(){return r.a.createElement(S.a,{variant:"h5"},"Learning Chord Paper")},qt=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,null,"Chord Paper aims to be as intuitive and handy as possible, but there could still be features that aren't obvious as we work out the kinks. Let's walk through the basics together by making some changes to chords and lyrics!"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Since Chord Paper is still in early stages, some of these could change in the future."))},Jt=[{title:"Starting",route:"/learn/start",component:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(Vt,null),r.a.createElement(_t,null),r.a.createElement(qt,null))}},{title:"Edit a Chord",route:"/learn/edit_chord",component:function(){var e=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly "}),new te({chord:"Bm",lyric:"appear?"})])]),t=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly "}),new te({chord:"B7",lyric:"appear?"})])]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{variant:"h6"},"Editing Chords"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Click on a chord to change it. Let's change the chord above"," ",r.a.createElement(Ht,{display:"inline"},"appear")," ","from ",r.a.createElement(zt,{display:"inline"},"Bm")," to"," ",r.a.createElement(zt,{display:"inline"},"B7"),"."),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Try it!"),r.a.createElement(Dt,{initialSong:e,expectedSong:t}))}},{title:"Remove a Chord",route:"/learn/remove_chord",component:function(){var e=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly "}),new te({chord:"B7",lyric:"appear?"})])]),t=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly appear?"})])]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{variant:"h6"},"Removing Chords"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Simply remove all the chord text when editing to clear the chord. Let's remove the"," ",r.a.createElement(zt,{display:"inline"},"B7"),"."),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Try it!"),r.a.createElement(Dt,{initialSong:e,expectedSong:t}))}},{title:"Add a Chord",route:"/learn/add_chord",component:function(){var e=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly appear?"})])]),t=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly "}),new te({chord:"B7",lyric:"appear?"})])]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{variant:"h6"},"Adding Chords"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Add a chord by hovering above a word, and clicking the outlined box. Let's add"," ",r.a.createElement(zt,{display:"inline"},"B7")," back above"," ",r.a.createElement(Ht,{display:"inline"},"appear"),"."),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Try it!"),r.a.createElement(Dt,{initialSong:e,expectedSong:t}))}},{title:"Edit Lyrics",route:"/learn/edit_lyrics",component:function(){var e=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly "}),new te({chord:"B7",lyric:"appear?"})])]),t=new Ke([new ge([new te({chord:"C^",lyric:"Why oh why do birds suddenly "}),new te({chord:"B7",lyric:"appear?"})])]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{variant:"h6"},"Editing Lyrics"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"You can edit the lyrics by clicking anywhere along the lyrics. Chord Paper will move chords along with lyrics when you edit them. Let's change the lyrics to:"),r.a.createElement(Ht,null,"Why oh why do birds suddenly appear?"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Try it!"),r.a.createElement(Dt,{initialSong:e,expectedSong:t}))}},{title:"Chord Positioning",route:"/learn/chord_positioning",component:function(){var e=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly "}),new te({chord:"",lyric:"appear?"})])]),t=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly ap-"}),new te({chord:"B7sus4",lyric:"pear?"}),new te({chord:"B7",lyric:" "})])]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{variant:"h6"},"Chord Positioning"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Sometimes you want to emphasize a chord landing on a specific syllable or between words. Without the overhead of standard notation, we can do this by breaking up lyrics and annotating spaces."),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Let's change the lyrics to:"),r.a.createElement(Ht,null,"Why do birds suddenly ap-pear?"),r.a.createElement(S.a,null,"And add a space after the"," ",r.a.createElement(Ht,{display:"inline"},"?")),r.a.createElement(S.a,null,"Then add"," ",r.a.createElement(zt,{display:"inline"},"B7sus4")," to"," ",r.a.createElement(Ht,{display:"inline"},"pear")),r.a.createElement(S.a,null,"And then, also add"," ",r.a.createElement(zt,{display:"inline"},"B7")," to the space after"," ",r.a.createElement(Ht,{display:"inline"},"?")," (this can be tricky due to the spacing. work in progress)"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Try it!"),r.a.createElement(Dt,{initialSong:e,expectedSong:t}))}},{title:"Adding New Line",route:"/learn/add_line",component:function(){var e=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly ap-"}),new te({chord:"B7sus4",lyric:"pear?"}),new te({chord:"B7",lyric:" "})])]),t=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly ap-"}),new te({chord:"B7sus4",lyric:"pear?"}),new te({chord:"B7",lyric:" "})]),new ge([new te({chord:"",lyric:"Every time you are near"})])]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{variant:"h6"},"Adding New Lines"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"You can add more lines by hovering below (or above) and existing line, and clicking the gray line or the add icon to the right."),r.a.createElement(S.a,null,"Let's add a line, and change the lyrics to:"),r.a.createElement(Ht,null,"Why do birds suddenly ap-pear?"),r.a.createElement(Ht,null,"Every time you are near"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Try it!"),r.a.createElement(Dt,{initialSong:e,expectedSong:t}))}},{title:"Removing a Line",route:"/learn/remove_line",component:function(){var e=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly ap-"}),new te({chord:"B7sus4",lyric:"pear?"}),new te({chord:"B7",lyric:" "})]),new ge([new te({chord:"",lyric:"Every time you are near"})])]),t=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly ap-"}),new te({chord:"B7sus4",lyric:"pear?"}),new te({chord:"B7",lyric:" "})])]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{variant:"h6"},"Removing Lines"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Similarly, you can remove a line by hovering over the line, and clicking the red remove icon to the right. Let's remove the second line of lyrics."),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Try it!"),r.a.createElement(Dt,{initialSong:e,expectedSong:t}))}},{title:"Pasting Lyrics",route:"/learn/paste_lyrics",component:function(){var e=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly ap-"}),new te({chord:"B7sus4",lyric:"pear?"}),new te({chord:"B7",lyric:" "})]),new ge]),t=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly ap-"}),new te({chord:"B7sus4",lyric:"pear?"}),new te({chord:"B7",lyric:" "})]),new ge([new te({chord:"",lyric:"Every time you are near"})]),new ge([new te({chord:"",lyric:"Just like me, they long to be"})]),new ge([new te({chord:"",lyric:"Close to you"})])]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{variant:"h6"},"Pasting Lyrics"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"It would be annoying to have to type out the lyrics. But we can paste it in! Copy these lyrics, click into the second line, and paste:"),r.a.createElement(Ht,{variantMapping:{body1:"div"}},"Every time you are near"),r.a.createElement(Ht,{variantMapping:{body1:"div"}},"Just like me, they long to be"),r.a.createElement(Ht,{variantMapping:{body1:"div"}},"Close to you"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Try it!"),r.a.createElement(Dt,{initialSong:e,expectedSong:t}))}},{title:"Merging Lines",route:"/learn/merge_lines",component:function(){var e=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds"})]),new ge([new te({chord:"",lyric:"suddenly "}),new te({chord:"B7",lyric:"appear?"})])]),t=new Ke([new ge([new te({chord:"C^",lyric:"Why do birds suddenly "}),new te({chord:"B7",lyric:"appear?"})])]);return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{variant:"h6"},"Merging Lines"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Sometimes the lyrics that we paste in is not the division we want. Let's merge the two lines. Click into the second line, move the cursor to the beginning of the line, and press"),r.a.createElement(S.a,null,"(CTRL+Backspace : Windows | CMD+Backspace : Mac)"),r.a.createElement(_t,null),r.a.createElement(S.a,null,"Try it!"),r.a.createElement(Dt,{initialSong:e,expectedSong:t}))}}],Ut=Object(x.a)({root:{color:"white"}})(St.a),Yt=Object(x.a)((function(e){return{root:{marginTop:e.spacing(5),marginBottom:e.spacing(5),padding:e.spacing(5),minHeight:e.spacing(46),width:e.spacing(92),position:"relative"}}}))(h.a),Gt=Object(x.a)((function(e){return{root:{position:"absolute",bottom:e.spacing(2),right:e.spacing(2)}}}))(Bt.a),Kt=function(e){var t=function(t){return t.route===e.route},n=Jt.find(t);if(void 0===n)return r.a.createElement(Wt,null);var a=Jt.findIndex(t),i=null;if(a<Jt.length-1){var o=Jt[a+1];i=r.a.createElement(mt.b,{to:o.route},r.a.createElement(Gt,{color:"primary"},r.a.createElement(Ut,null)))}return r.a.createElement(Yt,null,r.a.createElement(n.component,null),i)},Zt=Object(x.a)((function(e){return{root:{padding:e.spacing(3),color:b.a[600]}}}))(S.a),$t=function(){var e=Object(a.useState)(!1),t=Object(u.a)(e,2),n=t[0],i=t[1],o={variant:"h6"},c={textDecoration:"none",color:"inherit"},l=function(){i(!n)};return r.a.createElement(ht.a,{variant:"permanent",anchor:"left"},r.a.createElement(mt.b,{to:"/",style:c,"data-testid":"Menu-TitleButton"},r.a.createElement(Zt,{variant:"h5"},"Chord Paper")),r.a.createElement(ve.a,null),r.a.createElement(st.a,null,r.a.createElement(mt.b,{key:"/",to:"/",style:c,"data-testid":"Menu-HomeButton"},r.a.createElement(ct.a,{key:"Song",button:!0},r.a.createElement(dt.a,null,r.a.createElement(yt.a,null)),r.a.createElement(lt.a,{primary:"Song",primaryTypographyProps:o}))),r.a.createElement(mt.b,{key:"/demo",to:"/demo",style:c,"data-testid":"Menu-DemoButton"},r.a.createElement(ct.a,{key:"Demo",button:!0},r.a.createElement(dt.a,null,r.a.createElement(wt.a,null)),r.a.createElement(lt.a,{primary:"Demo",primaryTypographyProps:o}))),function(){var e=Jt.map((function(e){return{title:e.title,route:e.route}})).map((function(e){return r.a.createElement(mt.b,{key:e.route,to:e.route,style:c},r.a.createElement(ct.a,{button:!0},r.a.createElement(lt.a,{inset:!0,primary:e.title})))}));return r.a.createElement(r.a.Fragment,null,r.a.createElement(ct.a,{key:"Learn",button:!0,onClick:l},r.a.createElement(dt.a,null,r.a.createElement(Et.a,null)),r.a.createElement(lt.a,{primary:"Learn",primaryTypographyProps:o}),n?r.a.createElement(Ot.a,null):r.a.createElement(jt.a,null)),r.a.createElement(ut.a,{in:n,timeout:"auto"},r.a.createElement(st.a,null,e)))}(),r.a.createElement(mt.b,{key:"/about",to:"/about",style:c,"data-testid":"Menu-AboutButton"},r.a.createElement(ct.a,{key:"About",button:!0},r.a.createElement(dt.a,null,r.a.createElement(gt.a,null)),r.a.createElement(lt.a,{primary:"About",primaryTypographyProps:o})))))},Qt=Object(x.a)((function(e){return{root:{margin:e.spacing(5),padding:e.spacing(5),minHeight:e.spacing(46),minWidth:e.spacing(92)}}}))(h.a),Xt=function(){return r.a.createElement(l.a,{container:!0,"data-testid":"About"},r.a.createElement(l.a,{item:!0,xs:3}),r.a.createElement(l.a,{item:!0,xs:6},r.a.createElement(Qt,null,r.a.createElement(S.a,{variant:"h6"},"About Chord Paper"),r.a.createElement(S.a,{variant:"h6"},"\xa0"),r.a.createElement(S.a,null,"Chord Paper makes writing and reading chord sheets easier than the traditional monospace font formatting. It's a passion project born out of frustration at the clunkiness of writing chords on a computer."),r.a.createElement(S.a,null,"\xa0"),r.a.createElement(S.a,null,"Hope you will find that Chord Paper helps you focus more of your musical time on playing and listening, and less on formatting."))),r.a.createElement(l.a,{item:!0,xs:3}))},en=Object(x.a)((function(e){return{root:{position:"absolute",top:0,right:0,padding:e.spacing(1),color:b.a[600]}}}))(S.a),tn=function(){var e=null!=="0.6.9.21.ge87243e"?"0.6.9.21.ge87243e":"dev-build";return r.a.createElement(en,{variant:"subtitle2"},e)},nn=Object(x.a)({root:{backgroundImage:"url(".concat(ot.a,")"),minHeight:"100vh"}})(l.a);var an=function(){var e=Object(c.a)({palette:{primary:{main:"#4fc3f7",light:"#8bf6ff",dark:"#0093c4",contrastText:"#000000"},secondary:{main:"#844ffc",light:"#bb7eff",dark:"#4a1fc8",contrastText:"#ffffff"}},typography:{fontFamily:"Merriweather",fontWeightRegular:300}}),t=r.a.createElement(xt.c,null,r.a.createElement(xt.a,{key:"/",exact:!0,path:"/"},r.a.createElement(et,{initialSong:new Ke})),r.a.createElement(xt.a,{key:"/demo",exact:!0,path:"/demo"},r.a.createElement(et,{initialSong:at()})),Jt.map((function(e){return r.a.createElement(xt.a,{key:e.route,exact:!0,path:e.route},r.a.createElement(Kt,{route:e.route}))})),r.a.createElement(xt.a,{key:"/about",exact:!0,path:"/about"},r.a.createElement(Xt,null)));return r.a.createElement(d.a,{theme:e},r.a.createElement(Ze.a,null,r.a.createElement(mt.a,null,r.a.createElement($t,null),r.a.createElement(nn,{container:!0,justify:"center"},r.a.createElement(l.a,{item:!0},t)),r.a.createElement(tn,null))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(an,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[131,1,2]]]);
//# sourceMappingURL=main.374c5b95.chunk.js.map