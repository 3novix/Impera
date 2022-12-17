function ge(id){
    const el = document.getElementById(id);
    return el;
  }
  function gc(classname){
    const el = document.getElementsByClassName(classname);
    return el;
  }
  
  const ls = localStorage;
  const ss = sessionStorage;
  
  function themeaton(){
    let theme = ls.getItem('theme');
    
    if(theme == 'light' || theme == 'dark'){
      let meta = document.createElement('meta');
      meta.name = 'theme-color';
      if(theme == 'light'){
        let preload = document.createElement('link');
        preload.rel = 'preload';
        preload.as ='style';
        preload.href = 'https://impera.onrender.com/css/light.css';
        document.head.append(preload);
        
        let theme_e = document.createElement('link');
        theme_e.rel = 'stylesheet';
        theme_e.href = 'https://impera.onrender.com/css/light.css';
        document.head.append(theme_e);
        
        meta.content = '#ffffff';
      }
      else{
        let preload = document.createElement('link');
        preload.rel = 'preload';
        preload.as ='style';
        preload.href = 'https://impera.onrender.com/css/dark.css';
        document.head.append(preload);
        
        let theme_e = document.createElement('link');
        theme_e.rel = 'stylesheet';
        theme_e.href = 'https://impera.onrender.com/css/dark.css';
        document.head.append(theme_e);
        
        meta.content = '#000000';
      }
      document.head.append(meta)
    }
    else{ls.setItem('theme', 'dark'); themeaton(); ls.setItem('filter', '')}//default theme is dark
  }
  
  themeaton();

const loading_icon = `<?xml version="1.0" standalone="no"?>
<!-- Generator: SVG Circus (http://svgcircus.com) -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg id="SVG-Circus-fa77f5bc-24c6-645d-a6e9-2a494de3cdba" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
<circle id="actor_2" cx="50" cy="50" r="44" opacity="1" fill="rgba(156,111,77,0)" fill-opacity="1" stroke="rgba(124, 222, 246,0.5)" stroke-width="12" stroke-opacity="1" stroke-dasharray="100 100"></circle>
<circle id="actor_4" cx="51" cy="6" r="6" opacity="1" fill="rgb(255, 77, 181)" fill-opacity="1" stroke="rgba(235,191,156,1)" stroke-width="0" stroke-opacity="1" stroke-dasharray=""></circle>
<circle id="actor_1" cx="50" cy="50" r="35" opacity="1.00" fill="rgba(156,111,77,0)" fill-opacity="1" stroke="rgba(255, 77, 181, 1)" stroke-width="9" stroke-opacity="1" stroke-dasharray="100 100"></circle>
<circle id="actor_3" cx="50" cy="85" r="5" opacity="1" fill="rgb(124, 222, 246)" fill-opacity="1" stroke="rgba(83,251,110,1)" stroke-width="0" stroke-opacity="1" stroke-dasharray=""></circle>
<script type="text/ecmascript">
<![CDATA[(function(){
    var actors={};
    actors.actor_3={node:document.getElementById("SVG-Circus-fa77f5bc-24c6-645d-a6e9-2a494de3cdba").getElementById("actor_3"),type:"circle",cx:50,cy:85,dx:10,dy:6,opacity:1};
    actors.actor_1={node:document.getElementById("SVG-Circus-fa77f5bc-24c6-645d-a6e9-2a494de3cdba").getElementById("actor_1"),type:"circle",cx:50,cy:50,dx:70,dy:17,opacity:1.00};
    actors.actor_4={node:document.getElementById("SVG-Circus-fa77f5bc-24c6-645d-a6e9-2a494de3cdba").getElementById("actor_4"),type:"circle",cx:51,cy:6,dx:12,dy:13,opacity:1};
    actors.actor_2={node:document.getElementById("SVG-Circus-fa77f5bc-24c6-645d-a6e9-2a494de3cdba").getElementById("actor_2"),type:"circle",cx:50,cy:50,dx:88,dy:17,opacity:1};
    var tricks={};
    tricks.trick_1=(function(_,t){t=(function(n){return n})(t)%1,t=t*1%1,t=0>t?1+t:t;
    var a=(_.node,-36*Math.cos(-90*Math.PI/180)),i=36*Math.sin(-90*Math.PI/180);
    a+=36*Math.cos((-90-360*t*1)*Math.PI/180),i-=36*Math.sin((-90-360*t*1)*Math.PI/180),_._tMatrix[4]+=a,_._tMatrix[5]+=i});
    tricks.trick_2=(function(t,a){a=(function(n){return n})(a)%1,a=a*1%1,a=0>a?1+a:a;
    var M=a*1*360*Math.PI/180,i=t._tMatrix,_=Math.cos(M),c=Math.sin(M),x=-Math.sin(M),s=Math.cos(M),h=-t.cx*Math.cos(M)+t.cy*Math.sin(M)+t.cx,n=-t.cx*Math.sin(M)-t.cy*Math.cos(M)+t.cy,r=i[0]*_+i[2]*c,o=i[1]*_+i[3]*c,y=i[0]*x+i[2]*s,f=i[1]*x+i[3]*s,d=i[0]*h+i[2]*n+i[4],e=i[1]*h+i[3]*n+i[5];
    t._tMatrix[0]=r,t._tMatrix[1]=o,t._tMatrix[2]=y,t._tMatrix[3]=f,t._tMatrix[4]=d,t._tMatrix[5]=e});
    tricks.trick_3=(function(t,a){a=(function(n){return n})(a)%1,a=a*1%1,a=0>a?1+a:a;var M=a*-1*360*Math.PI/180,i=t._tMatrix,_=Math.cos(M),c=Math.sin(M),x=-Math.sin(M),s=Math.cos(M),h=-t.cx*Math.cos(M)+t.cy*Math.sin(M)+t.cx,n=-t.cx*Math.sin(M)-t.cy*Math.cos(M)+t.cy,r=i[0]*_+i[2]*c,o=i[1]*_+i[3]*c,y=i[0]*x+i[2]*s,f=i[1]*x+i[3]*s,d=i[0]*h+i[2]*n+i[4],e=i[1]*h+i[3]*n+i[5];
    t._tMatrix[0]=r,t._tMatrix[1]=o,t._tMatrix[2]=y,t._tMatrix[3]=f,t._tMatrix[4]=d,t._tMatrix[5]=e});
    tricks.trick_4=(function(_,t){t=(function(n){return n})(t)%1,t=t*1%1,t=0>t?1+t:t;
    var a=(_.node,-44*Math.cos(90*Math.PI/180)),i=44*Math.sin(90*Math.PI/180);
    a+=44*Math.cos((90-360*t*-1)*Math.PI/180),i-=44*Math.sin((90-360*t*-1)*Math.PI/180),_._tMatrix[4]+=a,_._tMatrix[5]+=i});
    var scenarios={};scenarios.scenario_1={actors: ["actor_3"],tricks: [{trick: "trick_1",start:0,end:1}],startAfter:0,duration:1000,actorDelay:0,repeat:0,repeatDelay:0};
    scenarios.scenario_2={actors: ["actor_1"],tricks: [{trick: "trick_2",start:0,end:1}],startAfter:0,duration:3100,actorDelay:0,repeat:0,repeatDelay:0};scenarios.scenario_3={actors: ["actor_2"],tricks: [{trick: "trick_3",start:0,end:1}],startAfter:0,duration:1000,actorDelay:0,repeat:0,repeatDelay:0};scenarios.scenario_4={actors: ["actor_4"],tricks: [{trick: "trick_4",start:0,end:1}],startAfter:0,duration:2000,actorDelay:0,repeat:0,repeatDelay:0};
    var _reqAnimFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.oRequestAnimationFrame,fnTick=function(t){var r,a,i,e,n,o,s,c,m,f,d,k,w;for(c in actors)actors[c]._tMatrix=[1,0,0,1,0,0];
    for(s in scenarios)for(o=scenarios[s],m=t-o.startAfter,r=0,a=o.actors.length;
    a>r;r++){if(i=actors[o.actors[r]],i&&i.node&&i._tMatrix)for(f=0,m>=0&&(d=o.duration+o.repeatDelay,o.repeat>0&&m>d*o.repeat&&(f=1),f+=m%d/o.duration),e=0,n=o.tricks.length;n>e;e++)k=o.tricks[e],w=(f-k.start)*(1/(k.end-k.start)),tricks[k.trick]&&tricks[k.trick](i,Math.max(0,Math.min(1,w)));
    m-=o.actorDelay}for(c in actors)i=actors[c],i&&i.node&&i._tMatrix&&i.node.setAttribute("transform","matrix("+i._tMatrix.join()+")");
    _reqAnimFrame(fnTick)};
    _reqAnimFrame(fnTick);})()
]]>
</script>
</svg>`;

const nblob = new Blob([loading_icon], {type:'text/html'});
const nlink = URL.createObjectURL(nblob);

const loadicon = `<object type="image/svg+xml" data="${nlink}"></object>`;
