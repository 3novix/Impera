const search_placeholders = ["Search users and projects...", '@for_users', '$$ for projects', 'Impera'];
const alltags = Object.freeze(['art', 'gaming', 'music', 'design and tech', 'food and farms', 'film', 'books', 'programming', 'sports']);
//Will add photography too, although its also an art.
const currency = ['$', 'eth'];
const filters = Object.freeze(['Oldest', 'Newest', '']);
const ethers = Moralis.web3Library;

//simple emojis. Will add search functions later
const emojis = Object.freeze([
    '3d-fluency-anxious-face-with-sweat.png',
    '3d-fluency-confetti.png',
    '3d-fluency-exploding-head.png',
    '3d-fluency-eyes.png',
    '3d-fluency-face-holding-back-tears.png',
    '3d-fluency-face-savoring-food.png',
    '3d-fluency-face-with-tears-of-joy.png',
    '3d-fluency-ghost.png',
    '3d-fluency-grinning-face.png',
    '3d-fluency-loudly-crying-face.png',
    '3d-fluency-lying-face.png',
    '3d-fluency-melting-face.png',
    '3d-fluency-pouting-face.png',
    '3d-fluency-saluting-face.png',
    '3d-fluency-smiling-face-with-heart-eyes.png',
    '3d-fluency-smiling-face-with-hearts.png',
    '3d-fluency-smiling-face-with-smiling-eyes.png',
    '3d-fluency-star-struck.png',
    '3d-fluency-thinking-face.png',
    '3d-fluency-winking-face.png',
    '3d-fluency-winking-face-with-tongue.png'
]);

const prelink = 'https://impera.onrender.com/static/emojis/';

//Contract for transfering tokens
const contractAddress = Object.freeze({
    '0x89':'0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    '137':'0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    '0xfa':'0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
    '250':'0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
    'polygon':'0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    'fantom':'0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
    '0x1':'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
});

const networklist = Object.freeze({
    //'polygon':[137, 'Polygon', 'MATIC', 'MATIC', 'https://polygon-rpc.com', 'https://polygonscan.com', '0x89'],*/
    'fantom' : [250, 'Fantom', 'FTM', 'FTM' , 'https://rpc.fantom.network', 'https://ftmscan.com/', '0xfa'],
    'polygon':[80001, 'Mumbai Testnet', 'MATIC', 'MATIC', 'https://rpc-mumbai.maticvigil.com/', 'https://polygonscan.com', '0x13881']
    //'fantom':[4002, 'Fantom Testnet', 'FTM', 'FTM', 'https://rpc.testnet.fantom.network/', 'https://ftmscan.com/', '0xfa2']
})

let currparams = {};
let expanded = false;
let nichelist = [];
let hs1 = [];//Trying out double state method. for different tabs of the app. This will be hectic at first but it should work best
let hs2 = [];
let current_user = '';
let targeted;
let linktoshare;
let connectivity = true;
let currt;

const ppACL = new Moralis.ACL();
ppACL.setPublicReadAccess(true);
ppACL.setPublicWriteAccess(false);
ppACL.setWriteAccess(Moralis.User.current().id, true);

async function requestUser(){
    const usersl = new Moralis.Query('users');
    usersl.equalTo('username', globalid);
    usersl.select('username', 'image', 'name', 'user');
    const user = await usersl.first();
    
    return {id:user.id, username:user.get('username'), img:user.get('image'), name:user.get('name')}
}

window.onoffline = function(){
    showToast('Offline', 2, 3000);
    connectivity = false
}
window.ononline = function(){
    showToast('Online', 1, 3000);
    connectivity = true
}

function qs(res){
    return ge(document.querySelectorAll(res))
}
function qso(its) {
    const fer = document.querySelector(its);
    return fer
}
function toggler(curr, array){
    let cuup;
    let cu = array.indexOf(curr);
    if(curr == array[array.length-1]){cuup = array[0]}
    else{cuup = array[cu+1]}
    return cuup;
}

//will move it later
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function findPos(obj){
    let curleft = 0;
    let curtop = 0;
    let curWidth = 0;
    const topo = obj.getBoundingClientRect();
    curleft = topo.left;
    curtop = topo.top;
    curWidth = topo.width;
    return [curleft, curtop, topo.y, topo.x, curWidth, topo.right];
}

//A simple show toast function... works perfectly now
window.onmouseover = function(evt){
    document.getElementById('ttpos').style.display = 'none';
    
    let vel = evt.target;
    clearTimeout(currt);
    
    const gA = vel.getAttribute('title');
    
    if(gA != null && vel.className.includes('la-')){
        vel.setAttribute('titlex', gA);
        vel.removeAttribute('title');
    }
    if(vel.getAttribute('titlex') != '' && vel.getAttribute('titlex') != null && (vel.className.includes('la-') || vel.getAttribute('titlex') != null)){
        currt = setTimeout(()=>{
            let ttip = document.getElementById('ttpos');
            document.getElementById('tooltip').innerHTML = vel.getAttribute('titlex');
            
            const npos = findPos(vel);
            ttip.style.display = 'flex';
            
            if(evt.y+ttip.clientHeight < (0.9*window.innerHeight)){
                ttip.style.top = (npos[1]+vel.clientHeight+10).toString()+'px';
                ttip.style.left = ((npos[0] - 50) + (npos[4]/2)).toString()+'px';
                ttip.style.width = vel.style.width;
            }
            else{
                ttip.style.top = (npos[1]-30).toString()+'px';
                ttip.style.left = ((npos[0] - 50) + (npos[4]/2)).toString()+'px';
                ttip.style.width = vel.style.width;
            }
            
            if(evt.x+ttip.clientWidth > (0.9*window.innerWidth)){
                ttip.style.left = (npos[5] - (ge('tooltip').clientWidth+5)).toString()+'px';
            }
        }, 1000);
    }
    else if (vel.parentNode.className.includes('underp')){
        //I can make a small user card show here
        //later
    }
}

window.onwheel = function(){
    if(ge('smalinks').style.display == 'flex'){ge('smalinks').style.display = 'none'}
    clearTimeout(currt);
    ge('ttpos').style.display = 'none';
}
window.onmouseup = function(){
    clearTimeout(currt);
    ge('ttpos').style.display = 'none';
}
/**********************/
//some data to take note of
//**V**V*******V*THE USER NAME IS ALSO THE VISIBLE USER ID***********************/
//user is an object.
//user contains parameter
//the project name should be the project id by which a project can be tagged, that will make it easier
/**********************/

//Capture screen width and height. And manipulate somethings
function screen(){
    let gdw = window.innerWidth;
    
    let scr = '';
    if(gdw < 480) scr = 'mobile';
    else if(gdw > 1201) scr = 'ls';
    else if(gdw < 1200 && gdw >= 480) scr = 'tablet';
    
    return scr
}

async function done(){
    if(Moralis != null){
        const uitm = Moralis.User.current();
        if(uitm){
            const sudet = await requestUser();
            //replace images and profiles with user details
            ge('usicon').src = sudet.img;
            ge('usicon').alt = sudet.name+'(me)';
            ge('usicon').onclick = function(){openuser(globalid)};
            ge('iasn').src = sudet.img;
            ge('iasn').alt = sudet.name+'(me)';
            ge('hjkd').src = sudet.img;
            ge('hjkd').alt = sudet.name+'(me)';
        }
    }
    
    const provider = await Moralis.User.current().get('method');

    console.log(provider);

    const getth = Moralis.User.current().get('ethAddress');
    
    if(getth != undefined && getth.length > 10){
        await Moralis.enableWeb3({
            throwOnError: true,
            provider,
        }).then(()=>{}, ()=>{
            showToast('Cannot Connect provider', 2);
        })
    }
    
    const locval = location.pathname;
    
    console.log(locval);

    if(locval.includes('/project/')){
        const lino = locval.split('/')[2];
        await openproject(lino)
    }
    else if(locval.includes('/me/')){
        const lino = locval.split('/')[2];
        await openuser(lino)
    }
    else if(locval.includes('/post/')){
        const lino = locval.split('/')[2];
        await openpost(lino)
    }
    else if(locval.includes('/home')){
        await initialize(); //this will load home screen... that is without much.
    }
    else if(locval.includes('/posts')){
        //format {user}, if empty, then it loads posts around alone
        if(locval.includes('/me/')){
            const lino = locval.split('/')[2];
            await initialize({user:lino, type:'posts'})
        }
        else{
            await initialize({user:'', type:'posts'})
        }
    }
    else if(locval.includes('/projects')){
        if(locval.includes('/me/')){
            const lino = locval.split('/')[2];
            await initialize({user:lino, type:'projects'})
        }
        else{
            await initialize({user:'', type:'projects'})
        }
    }
    else if(locval.indexOf('/writepost') > -1) {await initialize(); opendialog('writepost')}
    else if(locval.indexOf('/newproject') > -1) {await initialize(); opendialog('newproject');}
    else if(locval.indexOf('/newevent') > -1) {await initialize(); opendialog('events');}
    else {await initialize(); console.log('its here')}
    
    //close loading screen and set up other stuffs.
    ge('startscreen').style.opacity = 0;
    setTimeout(function(){
        ge('startscreen').style.display = "none";
    }, 2000);
    
    //after all things have settled down
    for(let emo in emojis){
        const emoji = prelink+emojis[emo];
        let yur = document.createElement('img');
        yur.src=emoji;
        yur.className = 'emojis';
        yur.onclick = function(){addemoji(emoji)};
        
        ge('emojibox').append(yur);
    }
}
function toggleemojis(){
    if(ge('emojiparent').style.display == 'none') ge('emojiparent').style.display = 'block'
    else ge('emojiparent').style.display = 'none'
}
function addemoji(ltoemo){
    fetch(ltoemo).then((res)=>{return res.blob()}).then(async (retu)=>{
        const tis = new File([retu], (ltoemo.slice(ltoemo.lastIndexOf('/')+1)).replace('-', ' '), {type:'image/png'});
        const dt = new DataTransfer();
        dt.items.add(tis);
        ge('attacj').files = dt.files;
    })
}
async function initialize(specifics){
    console.log(specifics)
    //replace the 'no state' to 'home' state to initialize the app
    if(!specifics){
        history.replaceState({type:'home', data:'none'}, '', location.origin+'/home');
        hs1.push('home');
        current_user = '';
        console.log('initalized');
        
        opentab('home');
        //await sethome(tpppr);
    }
    else{
        const tpppr = {user:specifics.user, start:0, me:globalid};
        
        switch(specifics.type){
            case 'posts':{
                //opentab('ibczo-2');
                console.log('loading posts');
                await loadPosts(tpppr);
            }break;
            case 'projects':{
                //opentab('iht7k');
                console.log('loading projects');
                await allprojectsload(tpppr)
            }break;
        }
        //specifics is a object
        const state = {type:specifics.type, data:specifics.user};
        history.replaceState(state, null, location.href);
    }
    
    //Tells the user if there is a new post
    const Qx = new Moralis.Query('Posts');
    Qx.containedIn('tags', Moralis.User.current().get('tags'));
    Qx.descending('createdAt');
    
    const postsSubscription = await Qx.subscribe();
    postsSubscription.on('create', async function(newPost){
        if(wl.indexOf(newPost.get('referred')) > -1){
            const nq = new Moralis.Query('users');
            nq.equalTo('username', globalid);
            const nqr = await nq.find();
            if((ge('postsholder').getBoundingClientRect()).height != 0 && (ge('ibczo-2').getBoundingClientRect()).height != 0){
                const wl = nqr.get('watchlist');                                
                //show a quick notification
                showToast(`@${newPost.get('idu')} just made a new post`, 1, 5000, async function(){
                    ge('postsholder').parentElement.scrollTo({top:0, behavior:'smooth'});
                    const tagsu = Moralis.User.current().get('tags');
                    const tpppr = {tags:tagsu, start:0, me:globalid};
                    
                    await loadPosts(tpppr)
                });
            }
        }
    });
}
async function cperlink(){
    await navigator.clipboard.writeText('https://impera.onrender.com/me/'+globalid);
    showToast('Link copied');
}
async function sethome(new_params, son){
    switchviews('keeperx', ['homestuffs']);
    
    if(!son){
            const state = {type:'home', data:new_params};
            if(hs1.length != 0) history.pushState(state, '', location.origin+'/home');
            else{history.replaceState(state, '', location.origin+'/home')}
    }

    //hell with first stop
    const ouruser = await requestUser();
    ge('hppa').src = ouruser.img;
    ge('hmyname').innerText = ouruser.name;
    ge('hmyusername').innerText = '@'+ouruser.username;
    
    //FIRST STOP... New users
    const query = new Moralis.Query('users');
    query.descending('createdAt');
    query.limit(10);
    const results = await query.find();
    
    for(let w in results){
        const res = results[w];
        const usernamex = res.get('username');
        const namex = res.get('name');
        const pfp = res.get('image');
        
        const nel = document.createElement('div');
        nel.onclick = function(){openuser(usernamex)};
        nel.className = 'column center clxdf';
        nel.style.gap = '10px';
        
        const template = `
        <div class="underp"><img src="${pfp}"/></div>
        <p style="font-size: 14px;">${namex}</p>
        <p class="gtext">@${usernamex}</p>
        `;
        nel.innerHTML = template;
        ge('newerusers').append(nel)
    }
    
    //now New Posts
    try {
        const responsex = await Moralis.Cloud.run('posts', new_params);
        const response = responsex;
        
        if(response == 'no posts'){
            sethome({tags:alltags, start:0, me:globalid});
            return ''
        }
        
        let ltl = 5;
        if(response.length < 5) ltl = response.length;
        
        for(let r = 0; r<ltl; r++){
            const pics = response[r].attachments; //a string
            const contents = await processtext(response[r].contents); //multiline string
            const likes = response[r].likes;//an array of userids that likes the stuffs
            const quoio = response[r].requotes;
            const timep = await processdate(response[r].createdat);
            const user = await getuserdetails(response[r].idu);
            const options = await geifme(response[r].idu, 'post');
            const referedto = response[r].referred;
            
            let apics = '';
            
            //process pics
            if(pics != ''){
                apics+=import_attachments(pics)
            }
            
            let referedtoh='';
            
            //process projects being referred to
            if(referedto != ''){
                const pre = new Moralis.Query('Projects');
                //pre.id = referedto;
                await pre.get(referedto).then((resso)=>{
                    if(resso == undefined){referedtoh = ''}
                    else{referedtoh = `<div onclick="openproject('${resso.id}')" class="underp"><div style="background: center / contain no-repeat url('${resso.get('image')}');" class="projects-pic"></div></div>`}
                });
                
            }
            
            if(response[r].commentcount == undefined) response[r].commentcount = 0;
            
            //process the contents... coloring the username and stuffs
            //contents.indexOf('$')(contents.indexOf()), contents.indexOf('$'););
            const cel = document.createElement('div');
            cel.className = 'posts';
            cel.onclick = function(){openpost(response[r].id)};
            cel.setAttribute('pindex', 'pindex'+r.toString());
            cel.innerHTML = `
            <div class="postsin">
            <div class="sosmm"></div>
            <div class="userstalk">
            <div onclick="openuser('${user.username}')" class="underp"><img class="posterpic" src="${user.image}"/></div>
            <span class="asl gbv" style="width: 2.5px;"></span>
            ${referedtoh}
            </div>
            
            <div class="mpost">
            <div class="postUser"><p class="hhname">${user.name}</p><span class="hdivider"></span><p onclick="openuser('${user.username}')" class="username col3"> @${user.username}</p><div style="flex-grow:5;"><button title='more' onclick="ooca(this, event)" class="acol2 actions user-options la la-ellipsis-h"></button>
            <div onclick='ooca()' posd="${response[r].id}" class="moreoptions">
            ${options}
            </div>
            </div></div>
            <div onclick="openpost('${response[r].id}')" class="postContents">${contents}</div>
            <div class="postattachments"><div class="inside">${apics}</div></div>
            <div class="refered"></div>
            <div><p class="time">${timep}</p></div>
            <div class="postActions">
            <!--contains actions related to the post... i.e like, share, save and reply/comment-->
            <button title='comment' onclick="actions('${response[r].id}', 'comment', this)" class="actions acol6 la la-comment"><span class="countso">${processnumbers(response[r].commentcount)}</span></button>
            <button title='quote' onclick="actions('${response[r].id}', 'quote', this)" class="actions acol5 las la-quote-right ${response[r].quoted}"><span class="countso">${processnumbers(quoio)}</span></button>
            <button title='like' onclick="actions('${response[r].id}', 'like', this)" class="actions acol4 la la-heart ${response[r].liked}"><span class="countso">${processnumbers(likes)}</span></button>
            <button title='share' onclick="actions('${response[r].id}', 'share', this)" class="actions acol7 la la-share"></button>
            </div>
            </div>
            </div>
            `;
            ge('rentposts').append(cel);
        }
    } catch (error){
        const code = error.code;
        const message = error.message;
        console.log(code, message);
        showToast('Something went wrong', 2, 5000, function(){location.reload()});
        showToast('Click to Reload', 2, 5000, function(){location.reload()});
    }
    
    switchviews('homestuffs', ['keeperx']);
}

Moralis.onAccountChanged(async function(account){
    const confirmed = confirm('Do you want to switch wallet accounts?');
    if(confirmed){
        //await Moralis.unlink(Moralis.User.current().get('ethAddress'));
        await Moralis.link(account, {signingMessage:'Link your account to Impera to transfer FTM and Matic tokens'}).then(async ()=>{
            showToast('Wallet Switched!', 1, 5000);
            const getchain = Moralis.chainId;
            if(getchain != 137 && getchain != '0x89' && getchain != 80001 && getchain != '0x13881' && getchain != 250 && getchain != '0xfa' && getchain != 4002 && getchain != '0xfa2'){
                await addNetwork('polygon')
            }
        })
    }
})

Moralis.onChainChanged(async (new_chain) => {
    console.log(new_chain);
    const getchain = new_chain;
    if(getchain != 137 && getchain != '0x89' && getchain != 80001 && getchain != '0x13881' && getchain != 250 && getchain != '0xfa' && getchain != 4002 && getchain != '0xfa2'){
        await addNetwork('polygon'); //currently on testnet
    }
});

async function switchNetwork(network){
    await Moralis.switchNetwork(networklist[network.toLowerCase()][0])
}
async function addNetwork(network){
    const selected = networklist[network.toLowerCase()];
    
    const chain = selected[0];
    const chainname = selected[1];
    const currname = selected[2]
    const currencys = selected[3];
    const rpcUrl = selected[4];
    const blockExUrl = selected[5];
    
    await Moralis.addNetwork(chain, chainname, currname, currencys, rpcUrl, blockExUrl).then(()=>{
        showToast('Connected to '+selected[1]+"!");
    })
}

async function logout(){
    await Moralis.User.logOut().then(()=>{
        console.log('Logged out')
        //return to homepage.
        location.assign('https://impera.onrender.com/auth');
    })
}

function render(ns){
    const status = navigator.onLine;
    const type = ns.type;
    const data = ns.data;
    
    if(type != 'dialog'){
        closedialog(); //dialogs doesnt lead to a flat page
    }
    //we process all the users interactions here
    if(type == 'dialog'){
        //name of the dialog
        opendialog(data)
    }
    if(type == 'me'){
        if(status == true) openuser(data, 1)
        else{opentab('usertab');
        switchviews('usersstuffs', ['editme']);
    }
}
if(type == 'project'){
    if(status == true) openproject(data, 0);
    else{
        opentab('iht7k');
        switchviews('overview', ['allprojs']);
    }
    ge('backbutton2').style.display = 'block';
}
if(type == 'post'){
    if(status == true) openpost(data, 0);
    else{
        opentab('ibczo-2');
        switchviews('mainpost', ['postsholder']);
        
        ge('newposter').onclick = function(){
            const optx = {postid:data};
            opendialog('writepost',optx)
        }
    }
    ge('backbutton').style.display = 'block';
    
    /*
    //if it happens to finish loading and user data is on.
    if(navigator.onLine == false && ns.cached != undefined){
        ge('mainpost').innerHTML = ss.getItem(ns.cached)
    }
    else if(navigator.onLine == true){
        
    }
    else{ge('postsholder').innerHTML = ''}
    */
}
if(type == 'posts'){
    opentab('ibczo-2');
    switchviews('postsholder', ['mainpost']);
    ge('backbutton').style.display = 'none';
    
    ge('newposter').onclick = function() {
        opendialog('writepost')
    }
    
    //using session storage for this. probably not
    //document.getElementById('ibczo-2').scrollTo({top:data, left:0, behavior:'auto'})
}
if(type == 'projects'){
    opentab('iht7k');
    switchviews('allprojs', ['overview']);
    
    //and for this too
    //document.getElementById('iht7k').scrollTo({top:ss('scroll'), left:0, behavior:'auto'})
}
//the initial state of things
if(type == 'home'){
    opentab('home')
    //home();
}
if(type == 'editme'){
    opentab('userstab');
    switchviews('editme', ['usersstuffs']);
}
}
window.onpopstate = function(wh){
    if(wh.state){
        let ns = wh.state;
        render(ns)
    }
}
function savestate(state){
    if(hs1.length != 0) {history.pushState(state, '', location.origin+'/me/'+state.data)}
    else {history.replaceState(state, '', location.origin+'/me/'+state.data)}
    hs1.push(state);
}
function home(){
    current_user = '';
}
function closeuser(){
    if(ge('usertab').style.display == 'flex'){ge('usertab').style.display = 'none'}
}

async function tip(amount){
    const bal = amount ?? ge('tipamount').value;

    if(bal == null || bal == undefined){showToast("You can't tip $0"); return false}

    const pnal = bal/syncprice();
    const waddress = ge('viewedwallet').getAttribute('wallet');
    
    // sending 0.5 native currency
    const options = {
        type: "native",
        amount: Moralis.Units.ETH(bal),
        receiver: waddress,
    };
    let transaction = await Moralis.transfer(options);

    await transaction.wait(2).then(()=>{
        showToast('$'+syncprice(bal)+' tip sent!', 3, 10000);
    }, ()=>{
        showToast('Something went wrong', 2, 10000);
    })
}
async function syncprice(value){
    const mul = value ?? 1;
    let chainx = testchains();
    if(chainx == undefined){chainx = '0x1'}
    
    const options = {
        address: contractAddress[chainx],
        chain: '0x1',
        exchange: 'uniswap-v3',
    };
    const price = await Moralis.Web3API.token.getTokenPrice(options);
    
    if(chainx == '0x1') return 1/price.usdPrice;
    
    return price.usdPrice*mul
}

async function convertTokens(network, token){
    const tk = token ?? 1;
    
    switch (network){
        case 'polygon':
        {
            //Get token price on PancakeSwap v2 BSC
            const options = {
                address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
                chain: '0x1',
                exchange: 'uniswap-v3',
            };
            const matic = Moralis.Units.FromWei((await Moralis.Web3API.token.getTokenPrice(options)).nativePrice.value);
            
            const options2 = {
                address: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
                chain: '0x1',
                exchange: 'uniswap-v3',
            };
            const ftm = Moralis.Units.FromWei((await Moralis.Web3API.token.getTokenPrice(options2)).nativePrice.value);
            
            return (Number(matic)/Number(ftm))*tk
        }
        case 'fantom':
        {
            //Get token price on PancakeSwap v2 BSC
            const options = {
                address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
                chain: '0x1',
                exchange: 'uniswap-v3',
            };
            const matic = Moralis.Units.FromWei((await Moralis.Web3API.token.getTokenPrice(options)).nativePrice.value);
            
            const options2 = {
                address: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
                chain: '0x1',
                exchange: 'uniswap-v3',
            };
            const ftm = Moralis.Units.FromWei((await Moralis.Web3API.token.getTokenPrice(options2)).nativePrice.value);
            
            return (Number(ftm)/Number(matic))*tk
        }
        //FROM ETH TO MATIC AND FTM
        case 'fromEth':{
            //Get Eth price for a token
            const options = {
                address: contractAddress[testchains()],
                chain: '0x1',
                exchange: 'uniswap-v3',
            };
            const price = await Moralis.Web3API.token.getTokenPrice(options);
            
            return (Number(Moralis.Units.FromWei(price.nativePrice.value))*tk).toString()
        }
        //FROM MATIC AND FTM TO ETH ... FOR SAVING THE FUND TRANSFERED AS ETH
        case 'toEth':{
            //Get token price on PancakeSwap v2 BSC
            const options = {
                address: contractAddress[testchains()],
                chain: '0x1',
                exchange: 'uniswap-v3',
            };
            const price = await Moralis.Web3API.token.getTokenPrice(options);
            
            return Number(Moralis.Units.FromWei(price.nativePrice.value))*tk
        }
        //FROM ETH TO USD
        case 'toUsd':{
            const options = {
                address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                chain: '0x1',
                exchange: 'uniswap-v3',
            };
            const price = await Moralis.Web3API.token.getTokenPrice(options);
            
            return price.usdPrice*tk
        }
        default:{
            //Get token price on PancakeSwap v2 BSC
            const options = {
                address: '0x1',
                chain: 'eth',
                exchange: exchange,
            };
            const price = await Moralis.Web3API.token.getTokenPrice(options);
            
            return price*tk
        }
    }
}
function showproops(){
    
}
async function openuser(usernid, son){
    if(this.event) this.event.stopPropagation();
    
    const me = (await requestUser()).username;
    
    ge('lscreen').style.display = 'flex';
    switchviews('usersstuffs', ['editme']);
    opentab('usertab');
    
    const userid = usernid;
    //userid is username. the public variable everyone has access to!
    if(!son){
        const state = {type:'me', data:userid};
        if(hs1.length != 0) {history.pushState(state, '', location.origin+'/me/'+userid)}
        else {history.replaceState(state, '', location.origin+'/me/'+userid);}
        hs1.push(state);
        
        current_user = userid;
    }
    
    const userq = new Moralis.Query('users');
    userq.equalTo('username', userid);
    const resultsq = await userq.first();
    
    if(resultsq == undefined){
        showToast(`User with username @${userid} doesn't exist`);
        return false
    }
    
    const fuis = (resultsq.createdAt).toString();
    const nfuis = fuis.slice(fuis.indexOf(' '), fuis.indexOf(':')-3);
    const frrf = resultsq.get('ethAddress');
    if(!(frrf.includes('.') && frrf.includes('@'))){
        if(me == userid){
            ge('wareti').innerText = 'Connect Wallet';
            showToast(loadicon);
            ge('usereth').onclick = async function(){
                await handleAuth('metamask').then(async()=>{
                    const myq = new Moralis.Query('users');
                    myq.equalTo('username', globalid);
                    const rs = await myq.first();
                    
                    rs.set('ethAddress', await Moralis.User.current().get('ethAddress'));
                    await rs.save();
                    location.reload()
                }, (error)=>{
                    showToast('Error...')
                })
            }
        }
        else{
            ge('wareti').innerText = resultsq.get('ethAddress');
            ge('usereth').onclick = async function(){
                copytext(resultsq.get('ethAddress'))
            }
        }
    }
    else{
        if(me == userid){
            ge('usereth').onclick = function() {
                opendialog('wallet', 0)//0 means 'mine'
            }}
            else{
                ge('usereth').onclick = function() {
                    opendialog('wallet', {wallet:resultsq.get('ethAddress')})//object is 'someone else'
                }
            }
        }
        if(userid == globalid){
            //Allow the user to edit it
            ge('editbtn').style.display = 'flex'
        }
        else{ge('editbtn').style.display = 'none'}
        
        ge('usersince').innerText = nfuis;
        ge('usersusername').innerText = "@"+resultsq.get('username');
        ge('usersname').innerText = resultsq.get('name');
        ge('profiimg').src = resultsq.get('image');
        
        ge('ipl6i').onclick = async function(){
            const params = {
                user: userid,
                me:me
            }
            await loadPosts(params, 'all');
        };
        
        ge('ipl6i2').onclick = async function(){
            const params = {
                user: userid,
                me:me,
                start:0
            }
            await allprojectsload(params, 'all');
        };
        
        if(resultsq.get('about') != '') ge('descrip').innerText = resultsq.get('about');
        else{ge('descrip').innerHTML = "<span style='padding:3px; color:var(--sec); opacity:0.5'>Hi, I'm using Impera</span>"};
        
        let wle = '<span style="width:100%; text-align:center">no project in watchlist<span>';
        let remover = '';
        
        //Watchlist done!
        if(globalid == resultsq.get('username')) remover = '<button onclick="removewl(this.parentElement)" class="actions acol1 la la-times"></button>';
        console.log(resultsq.get('watchlist').length);
        if(resultsq.get('watchlist').length>0){
            ge('wllson').innerHTML = '';
            await wl(usernid, resultsq.get('watchlist'), remover);
        }
        else{
            ge('wllson').innerHTML = wle;
        }
        console.log(usernid)
        
        try {
            const response = await Moralis.Cloud.run('userinfo', {user:userid}); //response is an object
            ge('followingC').innerHTML = response.projects;
            ge('backings').innerHTML = response.supported;
            ge('backers').innerHTML = response.backers;
            
        } catch (error) {
            const code = error.code;
            const message = error.message;
            return false
        }
        //now we load other things associated with the user
        ge('lscreen').style.display = 'none';
        return true
    }
    async function loadme(){
        if(screen()=='tablet' || screen()=='ls'){
            ge('usertab').style.display = 'block';
            ge('iht7k').style.display = 'none';
        }
    }
    async function removewl(el){
        //watchlist is an array of project ids
        const allusers = new Moralis.Query('users');//then we find the current user and remove his stuff
        allusers.equalTo('username', globalid);
        const owl = await allusers.first();
        owl.remove('watchlist', el.id);
        await owl.save().then(()=>{
            el.remove()
        })
    }
    function copytext(){
        const tlink = ge('wareti').innerText;
        navigator.clipboard.writeText(tlink);
        showToast('address copied, view on blockchain?', 1, 5000, function(){
            //show on blockchain.com
            window.open(''+tlink, '_blank')
        })
    }
    function random_string(){
        return Math.random().toString(36).slice(2)
    }
    function switchviews(view1, views){
        for(let nui = 0; nui<views.length; nui++){
            ge(views[nui]).style.display = 'none';
        }
        ge(view1).style.display = 'flex';
    }
    async function openpost(postid, son){
        closedialog();
        
        ss.setItem('post_scroll', document.getElementById('ibczo-2').scrollTop);
        opentab('ibczo-2');
        switchviews('mainpost', ['postsholder']);
        
        if(!son){
            const state = {type:'post', data:postid};
            if(hs1.length != 0){history.pushState(state, '', location.origin+'/post/'+postid)}
            else{backlook = `<button onclick='hisory.back()' class="actions acol4 la la-home"></button>`; history.replaceState(state, '', location.origin+'/post/'+postid);}
            hs1.push(state)
        }
        
        ge('backbutton').style.display = 'block';
        
        //EMPTY EVERYTHING BEFORE PROCEEDING.
        ge('maincontents').innerHTML = loadicon;
        ge('pimg').src = 'https://impera.onrender.com/img/profile2.jpg';
        ge('pname').innerHTML = 'Loading...';
        ge('pusername').innerHTML = ' @Loading...';
        ge('tsauce').innerHTML = '';
        ge('comment-butt').onclick = function(){showToast(`Reload page, you're offline`)};
        ge('rethdi').style.display = 'none';
        ge('mops').innerHTML = '';
        
        ge('cups').innerText = '';
        let tyu = showToast(loadicon);
        tyu.style.height = '60px';
        
        const post = new Moralis.Query('Posts');
        await post.get(postid).then(
            async (result) => {
                //once back button is pressed, simply go back and do the thing
                ge('backbutton').style.display = 'block;'
                
                ge('newposter').onclick = function(){
                    const optx = {postid:result.id};
                    opendialog('writepost',optx)
                }
                
                const pcontent = await processtext(result.get('contents'));
                const pattached = result.get('attachments');
                const pdate = result.createdAt;
                let referred;
                const puser = await getuserdetails(result.get('idu'));
                const options = await geifme(puser.username, 'post');
                
                if(result.get('projectID') != null && result.get('projectID') != ''){
                    referred = result.get('projectID');
                    const q123 = new Moralis.Query('Projects');
                    await q123.get(referred).then((loac)=>{
                        ge('referredto').setAttribute('style', `background: center / contain no-repeat url('${loac.get('image')}');" class="projects-pic`);
                        ge('rethdi').onclick = function(){openproject(loac.id)};
                        ge('rethdi').style.display = 'flex';
                    },()=>{
                        ge('referredto').style = '';
                        ge('rethdi').onclick = function(){};
                        ge('rethdi').style.display = 'none'    
                    });
                }
                else{
                    referred = '';
                    ge('referredto').src = '';
                    ge('rethdi').onclick = function(){};
                    ge('rethdi').style.display = 'none'
                }
                
                if(pattached!=''){
                    ge('ertyw').innerHTML = `<img src="${pattached}"/>`;
                }
                else{ge('ertyw').innerHTML = ``}
                
                gc('classf')[0].style.display = 'none';
                ge('mops').innerHTML = options;
                
                ge('maincontents').innerHTML = pcontent;
                ge('pimg').src = puser.image;
                ge('pname').innerHTML = puser.name;
                ge('pusername').innerHTML = ' @'+puser.username;
                ge('tsauce').innerHTML = await processdate(pdate);
                ge('comment-butt').onclick = function(){opendialog('writepost', {postid:postid})};
                
                //load all comments at once
                const comments = await Moralis.Cloud.run('loadcomments', {post:postid, start:0});
                if(comments != 'no comments' && comments != null){
                    
                    ge('comment-butt').firstChild.innerHTML = processnumbers(comments.length);
                    ///load all comments and append them as html objects
                    for(let coms; coms<comments.length; coms++){
                        //note: nothing happens when you click a comment
                        const comm = comments[coms];
                        
                        let nceel = createElement('div');
                        nceel.className = 'tcomments opxx';
                        nceel.id = comm.id;
                        const ud = await getuserdetails(comm.idu);
                        const options = await geifme(ud.username, 'comment');
                        
                        const commentiin = `
                        <div class="sosmm"></div>
                        <div class="userstalk" style="height: auto;">
                        <div class="underp"><img class="posterpic" src="${ud.image}"/></div>
                        <span class="asl gb"></span>
                        </div>
                        
                        <div class="mpost">
                        <div class="postUser"><p class="hhname" onclick="openuser('${ud.username}')">${ud.name}</p><span class="hdivider"></span><p class="username col3" onclick="openuser('${ud.username}')"> &#64;${ud.username}</p>
                        <div style="flex-grow:2;"><button onclick="ooca(this, event)" class="acol2 actions user-options"><div style="z-index: 7;" class="la la-ellipsis-h"></div></button>
                        <div class="moreoptions" commd="${comm.id}">
                        ${options}
                        </div>
                        </div></div>
                        <div class="postContents">${processtext(comm.contents)}</div>
                        <div class="postattachments"><div class="inside"><img src="${comm.attachments}"/></div></div>
                        <div><p class="time">${processdate(comm.createdat)}</p></div>
                        <div class="postActions">
                        <button title="reply" onclick="opendialog('writepost', {postid:${postid}, comid:'${comm.id}'})" class="actions acol2 las la-quote-right"></button>
                        <button title="like" onclick="actions('${comm.id}', 'like', this,  'comments')" class="actions acol4 la la-heart ${comm.likedc}"><span title="likes" class="countso">${processnumbers(comm.likes)}</span></button>
                        <button title="Take snapshot" onclick="actions('${comm.id}', 'save', this,  'comments')" class="actions acol7 las la-download"></button>
                        </div>
                        </div>
                        `;
                        
                        nceel.innerHTML = commentiin;
                        ge('comments_section').append(nceel)
                    }
                    createMeta({pop:'post', content:result.get('contents'), attachments:result.get('attachments'), poster:{name:puser.name, username:puser.username, image:puser.image}});
                }
                else if(comments == 'no comments'){
                    ge('comments_section').innerHTML = '<span style="width:100%; line-height:50px; text-align:center; font-size:14px; padding-right:40px">No comments yet.<span>'
                }
                else if(comments == null){
                    showToast('something went wrong, click to reload', 2, 3000, function(){
                        openpost(postid)
                    })
                }
                if(!son){
                    let identifier = random_string();
                    console.log(ge('mainpost').outerHTML);
                    ss.setItem(identifier, ge('mainpost').outerHTML);
                    history.replaceState({type:'post', data:postid, cached:identifier}, '', location.origin+'/post/'+postid)
                }
                tyu.remove();
            },
            (error) =>{
                tyu.remove();
                showToast('network connection lost, click to reload', 2, 5000, function(){
                    openpost(postid);
                });
                return 'error'
            }
            );
        }
        
        async function loadcomments(commentx){
            const comm = commentx;
            
            let nceel = createElement('div');
            nceel.className = 'tcomments opxx';
            nceel.id = comm.id;
            const ud = await getuserdetails(comm.get('idu'));
            const options = await geifme(ud.username, 'comment');
            
            const commentiin = `
            <div class="sosmm"></div>
            <div class="userstalk" style="height: auto;">
            <div class="underp"><img class="posterpic" src="${ud.image}"/></div>
            <span class="asl gb"></span>
            </div>
            
            <div class="mpost">
            <div class="postUser"><p class="hhname" onclick="openuser('${ud.username}')">${ud.name}</p><span class="hdivider"></span><p class="username col3" onclick="openuser('${ud.username}')"> &#64;${ud.username}</p>
            <div style="flex-grow:2;"><button onclick="ooca(this, event)" class="acol2 actions user-options"><div style="z-index: 7;" class="la la-ellipsis-h"></div></button>
            <div class="moreoptions" commd="${comm.id}">
            ${options}
            </div>
            </div></div>
            <div class="postContents">${processtext(comm.get('contents'))}</div>
            <div class="postattachments"><div class="inside"><img src="${comm.get('attachments')}"/></div></div>
            <div><p class="time">${processdate(comm.createdAt)}</p></div>
            <div class="postActions">
            <button title="reply" onclick="opendialog('writepost', {postid:${comm.get('post')}, comid:'${comm.id}'})" class="actions acol2 las la-quote-right"></button>
            <button title="like" onclick="actions('${comm.id}', 'like', this,  'comments')" class="actions acol4 la la-heart"><span title="likes" class="countso">${processnumbers(comm.get('likes'))}</span></button>
            <button title="Take snapshot" onclick="actions('${comm.id}', 'save', this,  'comments')" class="actions acol7 las la-download"></button>
            </div>
            </div>
            `;
            
            nceel.innerHTML = commentiin;
            ge('comments_section').prepend(nceel);
            
        }
        
        async function delete_post(postID){
            //DELETES THE USER'S POST
            const prid = new Moralis.Query('Posts');
            await prid.get(postID).then((tth)=>{
                tth.destroy()
            })
        }
        
        async function delete_comment(commID){
            //DELETES THE USER'S POST
            const prid = new Moralis.Query('Comments');
            await prid.get(commID).then((tth)=>{
                tth.destroy()
            })
        }
        
        //Wachlist add and remove
        async function addtowl(projectID){
            if(this.event) this.event.stopPropagation();
            if(projectID == ''){return false};
            
            const quser = new Moralis.Query('users');
            quser.equalTo('username', globalid);
            const re = await quser.first();
            
            if(re.get('watchlist').indexOf(projectID) == -1){
                re.addUnique('watchlist', projectID);
                await re.save().then(()=>{
                    showToast('added to watchist!', 1, 3000);
                    document.getElementsByName(projectID)[0].className+='lq'
                });
            }
            else{
                //remove from wlv
                re.remove('watchlist', projectID);
                await re.save().then(()=>{
                    showToast('removed from watchist!', 2, 3000);
                    document.getElementsByName(projectID)[0].className = document.getElementsByName(projectID)[0].className.replace('lq', '')
                });
            }
        }
        
        function ooca(csre){
            if(this.event) this.event.stopPropagation();
            
            if(csre){
                let css = csre.nextElementSibling;
                if(css.style.display != 'flex'){
                    css.style.display = 'flex';
                    
                    window.onclick = function(event) {
                        css.style.display = "none";
                    }
                }
                else{
                    css.style.display = 'none'
                }
            }
            else{
                this.event.target.style.display = 'none'
            }
            
        }
        function niche(nm){
            const nichename = nm.name.toLowerCase();
            if(nichelist.indexOf(nichename) == -1){
                if(nichelist.length<4){
                    
                    nichelist.push(nichename);
                    nm.className = 'niche active';
                }
                else{showToast('only 4 max tags allowed', 2, 5000)}
                
            }
            else{
                nichelist.splice(nichelist.indexOf(nichename), 1);
                
                nm.className = 'niche';
            }
        }
        setInterval(() => {
            let inoo = setInterval(() => {
                ge('sany2').placeholder = toggler(ge('sany2').placeholder, search_placeholders);
                
            }, 1000);
            setTimeout(()=>{
                clearInterval(inoo)
            }, 6000)
        }, 20000);
        
        async function more_projects(params){
            params.start = ge('projectsin').childElementCount-1;
            const imparams = params;
            //user is at the bottom, so load more, that is if there is more content to load
            allprojectsload(imparams);
        }
        
        async function more_posts(params){
            params.start = ge('postsholder').childElementCount-1;
            const imparams = params;
            await loadPosts(imparams);
            //ge('loader').style.display = 'none'
        }
        
        async function openproject(projid, son){
            //son = save or not
            if(this.event) this.event.stopPropagation()
            if(!navigator.onLine) showToast(`You're offline`);
            
            closedialog();
            opentab('iht7k');
            ge('backbutton2').style.display = 'block';
            
            if(!son){
                //we push a state here
                const state = {type:'project', data:projid};
                if(hs1.length != 0){history.pushState(state, '', location.origin+'/project/'+projid)}
                else {history.replaceState(state, '', location.origin+'/project/'+projid);}
                
                hs1.push(state);
            }
            
            ge('large_title').innerText = 'Loading.. please wait';
            ge('project-id').innerText = '$$'+projid;
            ge('namexp').innerText = '...';
            ge('usernamexp').innerText = '@...';
            ge('udhfb').src = 'https://impera.onrender.com/img/profile2.jpg';
            ge('offiimg').src = 'https://impera.onrender.com/img/profile2.jpg';
            ge('tags-con').innerHTML = loadicon;
            ge('summarys').innerHTML = 'loading...';
            ge('pro_content').innerHTML = loadicon;
            ge('relpro').onclick = function(){};
            ge('titlep').innerText = 'Loading...';
            ge('socialis').setAttribute('link', 'no link');
            ge('nobcs').innerHTML = '&#183;&#183;&#183;';
            ge('fnums').innerHTML = '&#183;&#183;&#183;';
            ge('wachs').innerHTML = '&#183;&#183;&#183;';
            ge('final_goal').innerHTML = '$...';
            ge('atwy').setAttribute('project-id', '');
            ge('projects-transactions').innerHTML = `loading...`
            
            var quill_read = new Quill('#pro_content', {
                theme: 'snow',
                readOnly:true
            })
            quill_read.disable();
            
            //we load a single project and show it
            const params =  {
                id:projid
            };
            try {
                console.log(params);
                const response = await Moralis.Cloud.run('loadproject', params);
                switchviews('overview', ['allprojs']);
                
                const gethp = await convertTokens('polygon'); //matic conversion rate from ftm e.g
                const gethp2 = await convertTokens('fantom'); //ftm conversion rate from matic
                const getaup = await syncprice();
                const currchain = testchains();
                
                let total = 0;
                if(response.funded != 0){
                    if(currchain == 'polygon') total+=response.funded
                    else total+=response.funded*gethp
                }
                
                if(response.fundedfantom != 0){
                    if(currchain == 'fantom') total+=response.fundedfantom;
                    else total+=response.fundedfantom*gethp2
                }
                
                let totald = getaup*total; //total amount in dollars
                
                //convert to percentage
                const percent = ((Number(totald)/Number(response.goal))*100).toString();
                
                if(percent > 150){ //150 cuz the value might reduce later
                    //fund not!
                    ge('fundbox').style.display = 'none'
                }
                else{
                    ge('fundbox').style.display = 'flex'
                }

                //test for deadline...
                const dl = await checkdeadline(response.createdAt, response.get('deadline'));
                if(dl == 'Concluded'){
                    ge('fundbox').style.display = 'none'
                }
                else{
                    ge('fundbox').style.display = 'flex'
                }

                const isme = new Moralis.Query('users');
                isme.equalTo('username', globalid);
                const mex = await isme.first();
                
                ge('large_title').innerText = response.title;
                ge('project-id').innerText = '$$'+response.id;
                const ouser = await getuserdetails(response.idu);
                ge('offiimg').src = response.image;
                ge('namexp').innerText = ouser.name;
                ge('usernamexp').innerText = '@'+ouser.username;
                ge('udhfb').src = ouser.image;
                ge('socialis').setAttribute('link', 'https://impera.onrender.com/project/'+response.id);
                ge('nobcs').innerHTML = processnumbers(response.backers);
                ge('nobcs').setAttribute('titlex', response.backers);
                ge('wachs').innerHTML = processnumbers(response.watchers).toString();
                ge('titlep').innerText = response.title;
                ge('wachs').setAttribute('titlex', response.watchers);
                ge('atwy').setAttribute('project-id', response.id);
                ge('loadalltrans').setAttribute('projectId', response.id);
                
                const range = percent < 101 ? percent : 100;
                ge('ranged').style.width = range.toString()+'%';
                
                let ttexts = '';
                
                for(let hjk = 0; hjk<response.tags.length;hjk++){
                    const pret = response.tags[hjk];
                    let wwgs = `<div class="tags"><p>${pret}</p></div>`;
                    ttexts+=wwgs;
                }
                
                ge('tags-con').innerHTML = ttexts;
                ge('summarys').innerText = response.summary;
                if(response.summary == '') ge('summarys').innerHTML = '<span style="opacity: 0.7">No summary provided</span>';
                
                quill_read.setContents(response.contents);
                ge('relpro').onclick = function(){
                    ge('postsholder').innerHTML = '';
                    loadPosts({project:response.id, start:0});
                }
                
                let suffix = ' MATIC';
                if(testchains() == 'fantom') suffix = ' FTM';
                
                //We are saving the goal in dollars... Funded is in in matic or ftm. PERFECT
                ge('fnums').innerHTML = '$'+processnumbers(totald).toString()+' &#126; <span style="font-size:15px; opacity:0.7; color:var(--sec)">'+total+suffix+'</span>';
                ge('fnums').setAttribute('titlex', (total).toString()+' '+suffix);
                ge('final_goal').innerHTML = '$'+processnumbers(response.goal)+' &#126; <span style="font-size:15px; opacity:0.7; color:var(--sec)">'+(response.goal/await syncprice())+suffix+'</span>'
                
                if((mex.get('watchlist')).indexOf(response.id)){
                    ge('atwy').className+=' lq'
                }
                
                const transactions = response.transactions;
                if(transactions == []){ge('projects-transactions').innerHTML = `<p style="width:100%; text-align:center; line-height:50px">No transactions yet</p>`}
                else{
                    ge('projects-transactions').innerHTML = ``
                    
                    for(let fr in transactions){
                        const transaction = transactions[fr];
                        const getud = await getuserdetails(transaction.get('sender'));
                        
                        let new_amount = 0;
                        if(transaction.network == 'polygon'){
                            if(currchain == 'polygon') new_amount = transaction.amount;
                            else new_amount=transaction.amount*gethp;
                        }
                        
                        if(transaction.network == 'fantom'){
                            if(currchain == 'fantom') new_amount=transaction.amount;
                            else new_amount=transaction.amount*gethp2;
                        }
                        
                        const indolls = new_amount*getaup;
                        
                        const ner = document.createElement('div');
                        ner.className = 'wllist';
                        ner.innerHTML = `<div class="trtle" onclick='openuser('${transaction.sender}')'><img style="width:50px; border-radius:100%; margin: 0px 5px" src="${getud.image}"/>${getud.name}</div><div class="subbo">${transaction.sender}</div><div class='amoe'>$${indolls} &#126; ${new_amount} ${suffix}</div>`;
                        ge('projects-transactions').append(ner);
                    }
                }
                ge('kdpa').src = 'https://impera.onrender.com/img/polygonicon.svg';
                if(testchains() == 'fantom') ge('kdpa').src = 'https://impera.onrender.com/img/fantomicon.svg';
                
            } catch (error) {
                if(navigator.onLine == true){
                    //that project never existed
                    ge('large_title').innerText = 'No Project';
                    ge('namexp').innerText = '...';
                    ge('usernamexp').innerText = '@...';
                    ge('udhfb').src = 'https://impera.onrender.com/img/profile2.jpg';
                    ge('offiimg').src = 'https://impera.onrender.com/img/profile2.jpg';
                    ge('tags-con').innerHTML = 'Contains no tags';
                    ge('summarys').innerHTML = 'no summary';
                    ge('pro_content').innerHTML = 'This Project does not exist';
                    ge('socialis').setAttribute('link', 'no link');
                    ge('titlep').innerText = 'Not Found';
                    ge('nobcs').innerHTML = '&#183;&#183;&#183;';
                    ge('fnums').innerHTML = '&#183;&#183;&#183;';
                    ge('wachs').innerHTML = '&#183;&#183;&#183;';
                    ge('final_goal').innerHTML = '...eth'; 
                    ge('atwy').setAttribute('project-id', '');
                    ge('projects-transactions').innerHTML = `no transactions recorded.`
                }
                const message = error.message;
                showToast(message, 2, 5000)
            }
        }
        async function loadTransactions(){
            if(navigator.onLine){return false}
            
            const gethp = await convertTokens('polygon'); //matic conversion rate from ftm e.g
            const gethp2 = await convertTokens('fantom'); //ftm conversion rate from matic
            const currchain = testchains();
            
            let suffix = ' MATIC';
            if(testchains() == 'fantom') suffix = ' FTM';
            
            let txu = showToast(loadicon, null, 10000);
            try {
                const transactions = await Moralis.Cloud.run('allTransactions', {id:ge('loadalltrans').getAttribute('projectId')});
                if(transactions == []){ge('projects-transactions').innerHTML = `<p style="width:100%; text-align:center; line-height:50px">No transactions yet</p>`}
                else{ge('projects-transactions').innerHTML = ``}
                
                for(let fr in transactions){
                    const transaction = transactions[fr];
                    const getud = await getuserdetails(transaction.get('sender'));
                    
                    let new_amount = 0;
                    if(transaction.network == 'polygon'){
                        if(currchain == 'polygon') new_amount = transaction.amount;
                        else new_amount=transaction.amount*gethp;
                    }
                    
                    if(transaction.network == 'fantom'){
                        if(currchain == 'fantom') new_amount=transaction.amount;
                        else new_amount=transaction.amount*gethp2;
                    }
                    
                    const ner = document.createElement('div');
                    ner.className = 'wllist';
                    ner.innerHTML = `<div class="trtle" onclick='openuser('${transaction.sender}')'><img style="width:50px; border-radius:100%; margin: 0px 5px" src="${getud.image}"/>${getud.name}</div><div class="subbo">${transaction.sender}</div><div class='amoe'>${new_amount} ${suffix}</div>`;
                    ge('projects-transactions').append(ner);
                }
                
                txu.remove()
            } catch (error){
                showToast(`Can't get any transactions`, 2)
            }
        }
        
        //perfectly done
        async function allprojectsload(elap, son){
            ge('lh2').innerHTML = loadicon;
            if((ge('iht7k').getBoundingClientRect()).height == 0){ opentab('iht7k'); switchviews('allprojs', ['overview'])}

            
            //elap is the element to append them to
            let c = document.getElementsByClassName('projects').length;
            let forx = current_user;
            let tagsl;
            
            let params = {};

            if(!son){
                const state = {type:'projects', data:params};
                if(hs1.length != 0){history.pushState(state, '', location.origin+'/projects')}
                else{history.replaceState(state, '', location.origin+'/projects')}
                hs1.push(state)
            } 

            if(globalid) tagsl = await Moralis.User.current().get('tags');
            else tagsl = alltags //All the available tags
            
            if(elap!=undefined) params = elap;
            else{
                params.user = forx, //This tells if we are loading the projects for a user or normally, and since we can load posts for projects too, we'll have to include that as an option
                params.start = c,
                params.tags = tagsl //this is an array
            }
            try {
                const responsex = await Moralis.Cloud.run('projects', params);
                const response = responsex;
                
                
                switchviews('allprojs', ['overview']);
                
                if(response == 'no projects'){ge('lh2').innerHTML = `<p style="width:100%; text-align:center">${response}</p>`; return ''}
                else{ge('lh2').innerHTML = loadicon}

                console.log(response);
                
                const mex = new Moralis.Query('users');
                mex.equalTo('username', globalid);
                mex.select('watchlist');
                const me = await mex.first();
                
                const gethp = await convertTokens('polygon'); //matic conversion rate from ftm e.g
                const gethp2 = await convertTokens('fantom'); //ftm conversion rate from matic
                const getaup = await syncprice();
                const currchain = testchains();
                const watchlist = me.get('watchlist'); //its an array
                
                //await appendProject(response, opt);
                
                for(let r = 0; r<response.length; r++){
                    let cnpe = document.createElement('div');
                    const res = response[r];
                    cnpe.id = res.id;
                    const owner = await getuserdetails(res.idu);
                    cnpe.className = 'projects';
                    cnpe.onclick = function(){openproject(res.id)};
                    
                    console.log('appending...')
                    let total = 0;
                    if(res.funded != 0){
                        if(currchain == 'polygon') total+=res.funded
                        else total+=res.funded*gethp
                    }
                    
                    if(res.fundedfantom != 0){
                        if(currchain == 'fantom') total+=res.fundedfantom;
                        else total+=res.fundedfantom*gethp2
                    }
                    
                    let totald = getaup*total; //total amount in dollars
                    
                    //convert to percentage
                    const percent = ((Number(totald)/Number(res.goal))*100).toString();
                    
                    let addte;
                    
                    if(watchlist.indexOf(res.id) > -1){
                        addte = `<button name="${res.id}" project-id="${res.id}" title='remove from watchlist' class="actions acol7 la la-bell lq" onclick="addtowl(this.getAttribute('project-id'))"></button>`
                    }
                    else{
                        addte = `<button name="${res.id}" project-id="${res.id}" title='add to watchlist' class="actions acol7 la la-bell" onclick="addtowl(this.getAttribute('project-id'))"></button>`
                    }
                    
                    let datas = `
                    <div class="pr-contents">
                    <div class="imgc"><img alt="${res.title}" src="${res.image}"/></div>
                    <p class="summary">${res.summary}</p>
                    </div>
                    
                    <div style="display:flex; width: 100%; flex-direction:column; align-items:center; justify-content:center; height: 10px;"><span class="hdivider full"></span></div>
                    
                    <div class="bottoms">
                    <div class="loi underp"><img alt="${owner.username}" onclick="openuser('${owner.username}');" class="userimg" src="${owner.image}"/></div>
                    
                    <div class="boto2">
                    <div class="btokd"><p>${res.title}</p><p class='col1' title='completion'>${percent}%</p></div>
                    <div class="project-info-tab">
                    <div class="iald">${processnumbers(res.backers)} backers</div>
                    <div class="iald la-">$${processnumbers(totald).toString()} funded</div>
                    ${addte}
                    </div>
                    </div>
                    
                    </div>`;
                    
                    cnpe.innerHTML = datas;
                    ge('projectsin').append(cnpe);
                    console.log('appended')
                }
                ge('lh2').innerHTML = '';
                if(response.length < 10){/***LOADED ALL THE PROJECTS***/ge('lh2').innerHTML = `<p style="width:100%; text-align:center">No more projects</p>`}
                else{
                    ge('lh2').innerHTML = `<div onclick="await more_projects(${JSON.stringify(params)})" class="malf"><button class="invertio"><p>Load More</p></button></div>`
                }
                
                const posterslist = [];
                if(ge('recentcreators').innerHTML == ''){
                    for(let r = 0; r<response.length; r++){
                        if(posterslist.indexOf(response[r].idu) == -1){
                            posterslist.push(response[r].idu);                                        
                            if(posterslist.length>5) break;
                            
                            const resuser = await getuserdetails(response[r].idu)
                            
                            let erid = document.createElement('div');
                            erid.className = 'underp';
                            erid.innerHTML = `<img class="posterpic" src="${resuser.image}"/>`;
                            erid.onclick = function(){
                                openuser(resuser.username)
                            }
                            ge('recentcreators').append(erid)
                        }
                    }
                }
                
            } catch (error) {
                const code = error.code;
                const message = error.message;
                console.log(error)
                showToast('click to reload', 3, 5000, function(){
                    allprojectsload(params)
                });
                return false
            }
            return true
        }
        async function appendProject(response, opt){
            
            for(let r = 0; r<response.length; r++){
                let cnpe = document.createElement('div');
                const res = response[r];
                cnpe.id = res.id;
                const owner = await getuserdetails(res.idu);
                cnpe.className = 'projects';
                cnpe.onclick = function(){openproject(res.id)};
                const percent = ((Number(res.funded)/Number(res.goal))*100).toString();
                
                let addte;
                
                if(watchlist.indexOf(res.id) > -1){
                    addte = `<button name="${res.id}" project-id="${res.id}" title='remove from watchlist' class="actions acol7 la la-bell lq" onclick="addtowl(this.getAttribute('project-id'))"></button>`
                }
                else{
                    addte = `<button name="${res.id}" project-id="${res.id}" title='add to watchlist' class="actions acol7 la la-bell" onclick="addtowl(this.getAttribute('project-id'))"></button>`
                }
                
                let datas = `
                <div class="pr-contents">
                <div class="imgc"><img alt="${res.title}" src="${res.image}"/></div>
                <p class="summary">${res.summary}</p>
                </div>
                
                <div style="display:flex; width: 100%; flex-direction:column; align-items:center; justify-content:center; height: 10px;"><span class="hdivider full"></span></div>
                
                <div class="bottoms">
                <div class="loi underp"><img alt="${owner.username}" onclick="openuser('${owner.username}');" class="userimg" src="${owner.image}"/></div>
                
                <div class="boto2">
                <div class="btokd"><p>${res.title}</p><p class='col1' title='completion'>${percent}%</p></div>
                <div class="project-info-tab">
                <div class="iald">${processnumbers(res.backers)} backers</div>
                <div title="${res.funded.toFixed(6)} eth" class="iald la-">$${processnumbers(gethp*res.funded)} funded</div>
                ${addte}
                </div>
                </div>
                
                </div>`;
                
                cnpe.innerHTML = datas;
                ge('projectsin').append(cnpe);
            }
            if(response.length < 10){/***LOADED ALL THE PROJECTS***/ge('lh2').innerHTML = `<p style="width:100%; text-align:center">No more projects</p>`}
            else{
                ge('lh2').innerHTML = `<div onclick="await more_projects(${params})" class="malf"><button class="invertio"><p>Load More</p></button></div>`
            }
        }
        function threshold(limit, callback){
            let counter = 0;
            const th = setInterval(function(){
                counter++;
                if(counter == limit){
                    clearInterval(th);
                    callback()
                }
            }, 1000)
        }
        
        function laststep(){
            ge('secondstep').style.display = 'none';
            ge('firststep').style.display = 'flex';
            {
                ge('lastbar').style.display = 'none';
                ge('firstbar').style.display = 'block'
            }
            return false
        }
        function nextstep(){
            ge('firststep').style.display = 'none';
            ge('secondstep').style.display = 'block';
            {
                ge('firstbar').style.display = 'none';
                ge('lastbar').style.display = 'block'
            }
            return false
        }
        let quilled;
        
        function testchains(hex){
            const getchain = Moralis.chainId;
            if(getchain == 137 || getchain == '0x89' || getchain == 80001 || getchain == '0x13881'){
                if(hex) return '0x13881'
                else return 'polygon'
            }
            else if(getchain == '0xfa' || getchain == 250 || getchain == '0xfa2' || getchain == 4002){
                if(hex) return '0xfa2'
                else return 'fantom'
            }
            else{
                showToast('Click to Change network', 2, 10000, function(){
                    addNetwork('polygon');
                });
                return '0x1'
            }
        }
        ge('tokenbal').onclick = async function(){ge('ownedtokens').innerText = await getTokenBalance()}
        
        async function getTokenBalance(){
            const options = {
                chain: testchains('hex')
            };
            const balances = await Moralis.Web3API.account.getNativeBalance(options);
            return Moralis.Units.FromWei(balances.balance);
        }
        function howtotorus(){
            let temp = `
            <h3>Instructions</h3>
            <p>- Click 'Manage Wallet'</p>
            <p>- Use The same login method you use for our website</p>
            <p>- And wait for it to finish loading</p>
            <p>- After a few seconds(depending on your connection speed), It will close the tab and proceed</p>
            <p>- And Done!</p>
            <p>You can fund your wallet from</p>
            `;
            showToast(temp, undefined, 30000);
        }
        async function opendialog(curr, opt){
            if(curr == 'newproject'){
                if(document.querySelector('.ql-toolbar.ql-snow') == null){
                    const toolbarOptions = [
                        ['bold', 'italic', 'underline'],
                        ['blockquote', 'code-block'],
                        
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        
                        ['link', 'image', 'video'],
                        [{ 'header': [1, 2, 3, false] }],
                        
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                        
                        ['clean']
                    ];
                    
                    quilled = new Quill('#editor', {
                        modules: {
                            toolbar: toolbarOptions
                        },
                        placeholder: 'About project...',
                        theme: 'snow'
                    });
                }
                laststep();
                
                ge('oplas').src = 'https://impera.onrender.com/img/polygonicon.svg';
                if(testchains() == 'fantom') ge('oplas').src = 'https://impera.onrender.com/img/fantomicon.svg';
            }
            
            const state = {type: 'dialog', data:curr};
            history.pushState(state, curr, location.origin+location.pathname+'/'+curr);
            hs1.push(state);
            
            if(curr == 'events'){
                comingsoon();
                //laod his/her data
                loadevents(); // returns an array of data containing name, start, end, and type and project its linked to
            }
            if(curr == 'wallet'){
                if(opt == 0){
                    //when the wallet is mine
                    ge('myethaddress').innerText = await Moralis.User.current().get('ethAddress');
                    switchviews('mywallet', ['viewedwallet']);
                    
                    ge('whose').innerText = 'My Wallet';
                    
                    //Supports both testnet and mainnet
                    if(testchains() == 'polygon'){
                        //Polygon
                        ge('current_chain').innerText = 'Polygon';
                        //I'll run a request for how much the user has
                        ge('ownedtokens').innerText = await getTokenBalance();
                        ge('currencyoftoken').innerText = 'MATIC';
                        ge('tokenIcon').src='https://impera.onrender.com/img/fantom-logo-white.svg';
                        
                        const methodUsed = Moralis.User.current().get('method');
                        if(methodUsed == 'metamask') {ge('switcher').style.display = 'flex'; ge('orjfn').style.display = 'none'}
                        else if(methodUsed == 'web3Auth') {ge('switcher').style.display = 'none'; ge('orjfn').style.display = 'flex'}
                        ge('switcher').onclick = function(){addNetwork('fantom')}
                    }
                    else if(testchains() == 'fantom'){
                        //Fantom
                        ge('current_chain').innerText = 'Fantom';
                        //I'll run a request for how much the user has 
                        ge('ownedtokens').innerText = await getTokenBalance();
                        ge('currencyoftoken').innerText = 'FTM';
                        ge('tokenIcon').src='https://impera.onrender.com/img/Polygon_blockchain_logo2.png';
                        
                        const methodUsed = Moralis.User.current().get('method');
                        if(methodUsed == 'metamask') ge('switcher').style.display = 'flex';
                        else if(methodUsed == 'web3Auth') ge('switcher').style.display = 'none';
                        ge('switcher').onclick = function(){addNetwork('polygon')}
                    }
                }
                else if(opt.user){
                    switchviews('viewedwallet', ['mywallet']);
                    ge('whose').innerText = 'Wallet';
                    const bcl = "https://www.blockchain.com/eth/address/"+opt.wallet
                    ge('vobc').href = bcl;
                    
                    ge('hiswalletadd').innerText = opt.wallet;
                    ge('viewedwallet').setAttribute('wallet', opt.wallet);

                    ge('oplas3').src = 'https://impera.onrender.com/img/polygonicon.svg';
                    if(testchains() == 'fantom') ge('oplas3').src = 'https://impera.onrender.com/img/fantomicon.svg';    
                }
                else if(opt.project){
                    switchviews('viewedwallet', ['mywallet']);
                    const bcl = "https://www.blockchain.com/eth/address/"+opt.wallet
                    ge('vobc').href = '';
                    
                    ge('hiswalletadd').innerText = opt.wallet;
                    ge('viewedwallet').setAttribute('wallet', opt.wallet);
                }
            }
            if(curr == 'writepost'){
                if(opt!=undefined){
                    ge('wiww').innerText = 'Write Comment';
                    
                    ge('posterre').onclick = function(){submit_comment(opt.postid)};
                    
                    if(opt['comid']!=undefined){
                        ge('wiww').innerText = 'Compose Reply';
                        ge('posterre').onclick = function(){submit_comment(opt.postid, opt.comid)};
                        ge('eewi').innerText = 'Reply';
                    }
                }
                else{
                    ge('wiww').innerText = 'Write Post';
                    ge('posterre').onclick = function(){submit_post();}
                    ge('eewi').innerText = 'Post';
                }
            }
            //qs('.dialogs').style.opacity = '0';
            for(let q = 0; q<document.getElementsByClassName('dialogs').length; q++){
                document.getElementsByClassName('dialogs')[q].style.opacity = '0%';
                document.getElementsByClassName('dialogs')[q].style.display = 'none';
            }
            
            ge(curr).style.display = 'flex';
            ge(curr).style.opacity = '100%';
            
            window.onclick = function(event) {
                //Close when user clicks outside the dialog box
                if (event.target == ge(curr)) {
                    closedialog(curr)
                }
            }
        }
        
        async function loadevents(){
            const Events = new Moralis.Query('Events');
            Events.equalTo('creator', (await requestUser()).username);
            const eresults = await Events.find();
            
            const appe = ge('appe');
            appe.innerHTML = '';
            
            if(eresults.length == 0){
                appe.value = 'No Projects'
            }
            else{
                for(let rle = 0; rle<eresults.length; rle++){
                    const reso = eresults[rle].get('title');
                    appe.innerHTML += `
                    <div class="">"${reso}"</div>
                    `}
                }
                
                const Pev = new Moralis.Query('Projects');
                Pev.equalTo('idu', globalid);
                const results = await Pev.find();
                
                const yops = ge('yourprojects');
                yops.innerHTML = '';
                
                if(results.length == 0){
                    yops.value = 'No Projects'
                }
                else{
                    for(let rle = 0; rle<results.length; rle++){
                        const reso = results[rle].get('title');
                        yops.innerHTML += `
                        <option value="${reso}"></option>
                        `}
                    }
                }
                /** window.onclick = function(wha){
                    if(wha.target == ge()){}
                }**/
                function nicheclear(){
                    for(let rt = 0; rt < document.getElementsByClassName('niche').length; rt++){
                        document.getElementsByClassName('niche')[rt].className = 'niche';
                    }
                }
                function closedialog(OPx){
                    const OP = OPx ?? '';
                    if(hs1.length == 0){history.replaceState({type:'home', data:''}, null, location.origin+'/home');}
                    else{history.back()}
                    
                    for(let q = 0; q<document.getElementsByClassName('dialogs').length; q++){
                        document.getElementsByClassName('dialogs')[q].style.opacity = '0';
                        setTimeout(() =>{document.getElementsByClassName('dialogs')[q].style.display = 'none';}, 200)
                    }
                    
                    if(OP == 'wallet'){};
                    if(OP == 'writepost'){ge('writepost').removeAttribute('postid'); ge('writepost').removeAttribute('comid')}
                    if(OP == 'newproject'){nichelist = []; nicheclear()}
                }
                
                function calctexthe(value){
                    let nolb = (value.match(/\n/g) || []).length;
                    let nhh = 20 + nolb * 20 + 12 + 2;
                    return nhh
                }
                ge('writecontent').addEventListener('keyup', ()=>{
                    ge('writecontent').style.height = calctexthe(ge('writecontent').value)+'px';
                });
                
                function showToast(message, mtype, dtime, callback){
                    //SET DEFAULT TIME
                    const ftime = dtime ?? 3000;
                    
                    let toasty= document.createElement('div');
                    ge('toaster').append(toasty);
                    toasty.className = "toast";
                    let pmessage;
                    
                    let col_array = ['var(--color1)','var(--color2)','var(--color3)', 'var(--sec)', '#ff0000'];
                    if(mtype)
                    if(mtype == 0) pmessage = '<span class="indi" style="background:'+col_array[mtype]+'"></span>'+message;
                    else pmessage ='<span class="indi" style="background:'+col_array[mtype]+'"></span>'+message;
                    else if(!mtype) pmessage = message;
                    
                    toasty.onclick = function(){
                        toasty.style.opacity = '0%';
                        setTimeout(function(){toasty.remove()}, 500);
                        if(callback) callback();
                    };
                    
                    toasty.innerHTML = pmessage;
                    toasty.style.opacity = '100%';
                    
                    setTimeout(function(){
                        toasty.style.opacity = "0%";
                        setTimeout(function(){toasty.remove()}, 500)
                    }, ftime);
                    return toasty
                }
                
                async function opentab(tabn, ent){
                    //change the layout due to the device used being mobile -- USING A CLASSIC TAB FUNCTION FROM W3SCHOOLS
                    let i, tabs, tabb;
                    
                    tabs = document.getElementsByClassName("rblocks");
                    for (i = 0; i < tabs.length; i++) {
                        tabs[i].style.display = "none";
                    }
                    
                    tabb = document.getElementsByClassName("tabb");
                    for (i = 0; i < tabb.length; i++) {
                        tabb[i].className = tabb[i].className.replace(" active", "");
                    }
                    
                    // Show the current tab, and add an "active" class to the button that opened the tab
                    ge(tabn).style.display = "flex";
                    //if(screen() == 'tablet') ge('suui').style.display = 'flex'; gc('')[0]
                    
                    if(tabn == 'messaging'){
                        showToast('Coming soon', 1, 7000)
                    }
                    
                    if(ent)ent.className += " active";
                    if(tabn == 'ibczo-2' && ge('postsholder').childElementCount<2){
                        const tagsu = Moralis.User.current().get('tags');
                        const params = {tags:tagsu, start:0, me:globalid};            
                        await loadPosts(params);
                    }
                    else if(tabn == 'iht7k' && ge('projectsin').childElementCount<2){
                        const tagsu = Moralis.User.current().get('tags');
                        const params = {tags:tagsu, start:0, me:globalid};            
                        await allprojectsload(params);
                    }
                    else if(tabn == 'home' && ge('newerusers').innerHTML == ''){
                        //we load all things that needs loading here
                        const tagsu = Moralis.User.current().get('tags');
                        const tpppr = {tags:tagsu, start:0, me:globalid};
                        
                        await sethome(tpppr);
                    }
                }
                
                //FOR FILTERING THE PROJECTS
                async function filterprojects(ent){
                    //change the layout due to the device used being mobile -- USING A CLASSIC TAB FUNCTION FROM W3SCHOOLS
                    let i, tabb;
                    
                    tabb = document.getElementsByClassName("pfilterb");
                    for (i = 0; i < tabb.length; i++) {
                        tabb[i].className = tabb[i].className.replace(" active", "");
                    }
                    
                    //remove all child elements under the main projects div
                    ge('projectsin').innerHTML = '';
                    
                    ls.setItem('filter', ent.innerText.toLowerCase());
                    //HERE WE TELL OUR MORALIS SERVER TO FILTER ITS LIST OF PROJECTS HOWEVER THE USER DESIRES IT
                    const params =  {
                        sortby: ls.getItem('filter'),
                        tags: user.get('tags'),
                        start: ge('projectsin').childElementCount//its 0
                    };
                    allprojectsload(params);
                    
                    // Show the current tab, and add an "active" class to the button that opened the tab
                    ent.className += " active";
                }
                
                async function readUserData(){
                    //Here I read all user data for the homepage. Its the same for mobile and larger screens
                    const targetCount = 2000;
                    
                    let countAnim = setInterval(function(){
                        //To perform animations of charts and numbers
                        //followers and following count
                        let currentCount = 0;
                        if(currentCount<targetCount){
                            switch(currentCount){
                                case currentCount>999: ((currentCount/1000).toString())+"k";
                                ge('')
                                break;
                                case currentCount>999999:; break;
                            }
                        }
                        clearInterval(countAnim);
                    }, 20)
                }
                
                function removeimg(){
                    ge('replacer').src = '';
                    ge('replacer').style.display = 'none';
                    ge('special1').style.display = 'flex';
                    ge('p_image_input').value = ''
                }
                async function compress(file){
                    const resized = await imageConversion.compressAccurately(file,200);
                    return await imageConversion.filetoDataURL(resized);
                }
                async function showcropper(img){
                    showToast('Crop your Avatar', 3, 10000);
                    
                    document.getElementById('cropperx').style.display = 'flex';
                    
                    const holder = document.getElementById('inna');
                    const x = holder.clientWidth;
                    const y = holder.clientHeight;
                    
                    holder.style.background = `center / cover no-repeat url('${img}')`;
                    
                    let crp = new Croppie(holder, {
                        enableExif:true,
                        viewport: {width: x-20, height: y-20, type:'circle'},
                        boundary: {width: x, height: y},
                        showZoomer: false,
                        enableOrientation:true
                    });
                    crp.bind({
                        url: img
                    });
                    
                    document.getElementById('crop-done').onclick = function(){
                        crp.result('blob').then(async function(blob){
                            const res = await imageConversion.compressAccurately(blob,150);
                            const ress = await imageConversion.filetoDataURL(res);
                            let replacer = document.getElementById("lsjdo");
                            
                            replacer.src = ress;
                            
                            document.getElementById('destroyer').click()
                        })
                    }
                    
                    document.getElementById('destroyer').onclick = function(){
                        crp.destroy();
                        document.getElementById('cropperx').style.display = 'none';
                    }
                    
                    document.getElementById('rotatel').onclick = function(){
                        crp.rotate(90);
                    }
                    document.getElementById('rotater').onclick = function(){
                        crp.rotate(-90);
                    }
                }
                ge('newimageuploader').onchange = async function(){
                    const file = evt.target.files[0];
                    
                    await showcropper(URL.createObjectURL(file));
                }
                document.getElementById('p_image_input').onchange = async function(evt){
                    //replace a the element behind with the image.
                    const file = evt.target.files[0];
                    
                    let ress= file;
                    if((file.type).includes('image')) ress = await compress(file)
                    
                    //CHANGE THE ELEMENTS THERE
                    ge('special1').style.display = 'none';
                    ge('replacer').src = ress;
                    ge('replacer').style.display = 'block';
                    
                }
                
                function zoom(iel, action, ev){
                    if(iel != null){
                        if(action == 'in'){
                            ge('zoomer').innerHTML = iel.outerHTML;
                            ge('zoomer').style.display = 'block';
                            ge('zoomer').style.left = (ev.pageX - (ge('zoomer').clientWidth/2))+'px';
                        }
                        else if(action == 'out'){
                            ge('zoomer').innerHTML = '';
                            ge('zoomer').style.display = 'none';
                        }
                    }
                }
                
                
                document.getElementById('attachb').onchange = async function(evt){
                    ge('images-s').style.display = 'flex';
                    
                    const files = evt.target.files[0];
                    
                    let ress= files;
                    if((files.type).includes('image')) ress = await compress(files)
                    else ress = await imageConversion.filetoDataURL(files);
                    
                    ss.setItem('lastImage', files.name);
                    ge('images-s').innerHTML = '';
                    //if(files.length > 1){}//multiple files
                    
                    const cr = document.createElement('div');
                    cr.className = 'imgs';
                    cr.onclick = function(thi){
                        ge('attachb').value = '';
                        thi.target.remove();
                        if(ge('images-s').innerHTML == '') ge('images-s').style.display = 'none';
                    }
                    cr.innerHTML = `<img id='posyo' class='samples' src="${ress}"/>`;
                    ge('images-s').append(cr);
                }
                
                async function submit_post(){
                    const iofr = await Moralis.User.current().get('tags');
                    
                    //this is perfect
                    const texts = ge('writecontent').value;
                    let attachments = '';
                    let referredto = '';
                    
                    let attachment_name = ((ss.getItem('lastImage')).includes('3d-') ? ss.getItem('lastImage')+random_string() : random_string());
                    
                    if(ge('posyo') != null){
                        const imgx =  ge('posyo').src;
                        const options = {
                            abi: [
                                {
                                    path: `${globalid}/posts/${attachment_name}.${imgx.slice(imgx.indexOf('/')+1, imgx.indexOf(';'))}`,
                                    content: imgx,
                                },
                            ],
                        };
                        const path = await Moralis.Web3API.storage.uploadFolder(options);
                        
                        attachments = path[0].path;
                    }
                    
                    if(texts.indexOf('$$') > -1){
                        console.log('reder')
                        let sliced = texts.slice(texts.indexOf('$$'));
                        let rfto = sliced.slice(2, sliced.indexOf(' '));
                        const q232 = new Moralis.Query('Projects');
                        await q232.get(rfto).then((gotten)=>{
                            referredto = gotten.id
                        },()=>{
                            referredto = ''
                        })
                    }
                    
                    if(texts.length > 3){
                        let tyu = showToast(loadicon);
                        
                        const userInfo = await requestUser();
                        const posts = Moralis.Object.extend('Posts');
                        const post = new posts();
                        post.set('contents', texts);
                        post.set('attachments', attachments);
                        post.set('user', userInfo);
                        post.set('idu', userInfo.username);
                        post.set('referred', referredto);
                        post.setACL(ppACL);
                        post.set('tags', iofr);
                        
                        const context = { referred: referredto };
                        await post.save(null, {context:context}).then(async (saved)=>{
                            tyu.remove();
                            //prependpost(saved);
                            closedialog('writecontent');
                            clearContent();
                            showToast('Post posted', 1, 3000, function(){
                                openpost(saved.id)
                            });
                            await loadPosts({start:0, tags:Moralis.User.current().get('tags'), me:globalid})
                        })
                        return post
                    }
                    else if(texts.length < 4){
                        showToast('Your post should contain at least 4 characters', 4, 5000);
                    }
                }
                
                async function submit_comment(postid, comid){
                    if(comid == undefined){comid = ``}
                    else{comid = comid+`
                    
                    `}
                    //this is perfect
                    const texts = co
                    mid+ge('writecontent').value;
                    
                    let attachments = '';
                    let attachment_name = ((ss.getItem('lastImage')).includes('3d-') ? ss.getItem('lastImage')+random_string() : random_string());
                    
                    if(ge('posyo') != null){
                        const imgx =  ge('posyo').src;
                        const options = {
                            abi: [
                                {
                                    path: `${globalid}/posts/${attachment_name}.${imgx.slice(imgx.indexOf('/')+1, imgx.indexOf(';'))}`,
                                    content: imgx,
                                },
                            ],
                        };
                        const path = await Moralis.Web3API.storage.uploadFolder(options);
                        
                        attachments = path[0].path;
                    }
                    
                    if(texts.length > 3){
                        const userInfo = await requestUser();
                        const comments = Moralis.Object.extend('Comments');
                        const comment = new comments();
                        comment.set('contents', await processtext(texts));
                        comment.set('attachments', attachments);
                        comment.set('user', userInfo);
                        comment.set('post', postid);
                        comment.set('idu', userInfo.username);
                        comment.setACL(ppACL);
                        
                        const afcontext = {uI:userInfo, pid:postid, cid:comid};
                        await comment.save(null, {context:afcontext}).then((saved)=>{
                            closedialog('writecontent');
                            if((ge('postsholder').getBoundingClientRect()).height > 3){
                                loadPosts({start:0, tags:Moralis.User.current().get('tags')})
                            }
                            else openpost(postid);
                            
                            showToast('comment posted', 1, 3000, function(){
                                openpost(postid);
                            });
                            
                            prependcomment(saved);
                        })
                        return comment
                    }
                    else if(texts.length < 4){
                        showToast('Your comment should contain at least 4 characters', 4, 5000);
                    }
                }
                
                function prependcomment(){
                    ge('comments_section').innerHTML = '';
                    loadcomments();
                }
                async function prependpost(saved){
                    const pics = saved.get('attachments'); //a string
                    const contents = await processtext(saved.get('contents')); //multiline string
                    const timep = await processdate(saved.createdAt);
                    const user = await getuserdetails(saved.get('idu'));
                    const referedto = saved.get('referred');
                    let apics = '';
                    
                    let referedtoh='';
                    
                    //process pics
                    if(pics != ''){
                        //we create an element for the pictures and add them to the main html
                        apics += `<img src="${pics}"/>`;
                    }
                    
                    //process projects being referred to
                    if(referedto != '' && referedto != undefined){
                        const pre = new Moralis.Query('Projects');
                        pre.id = referedto;
                        const resso = await pre.first();
                        
                        referedtoh = `<div onclick="openproject('${resso.id}')" class="underp"><img src="${resso.get('image')}" class="projects-pic"/></div>`;
                    }
                    
                    const cel = document.createElement('div');
                    cel.className = 'posts';
                    cel.id = saved.id;
                    cel.onclick = function(){openpost(saved.id)};
                    cel.innerHTML = `
                    <div class="postsin">
                    <div class="sosmm"></div>
                    <div class="userstalk">
                    <div onclick="openuser('${user.username}')" class="underp"><img class="posterpic" src="${user.image}"/></div>
                    <span class="asl gbv" style="width: 2.5px;"></span>
                    ${referedtoh}
                    </div>
                    
                    <div class="mpost">
                    <div class="postUser"><p class="hhname">${user.name}</p><span class="hdivider"></span><p onclick="openuser('${user.username}')" class="username col3"> ${user.username}</p><div style="flex-grow:5;"><button title='more' onclick="ooca(this, event)" class="acol2 actions user-options la la-ellipsis-h"></button>
                    <div onclick='ooca()' class="moreoptions"><button onclick="actions('${saved.id}', 'save')"><div>Save post</div></button><button><div>Hide</div></button><button onclick="actions('${saved.id}', 'markasspam')"><div>Mark as spam</div></button></div>
                    </div></div>
                    <div onclick="openpost('${saved.id}')" class="postContents">${contents}</div>
                    <div class="postattachments"><div class="inside">${apics}</div></div>
                    <div class="refered"></div>
                    <div><p class="time">${timep}</p></div>
                    <div class="postActions">
                    <!--contains actions related to the post... i.e like, share, save and reply/comment-->
                    <button title='comment' onclick="opentab('writepost', {postid:})" class="actions acol6 la la-comment"><span class="countso"></span></button>
                    <button title='quote' onclick="actions('${saved.id}', 'quote', this)" class="actions acol5 las la-quote-right"><span class="countso"></span></button>
                    <button title='like' onclick="actions('${saved.id}', 'like', this)" class="actions acol2 la la-heart"><span class="countso"></span></button>
                    <button title='share' onclick="actions('${saved.id}', 'share', this)" class="actions acol7 la la-share"></button>
                    </div>
                    </div>
                    </div>
                    `;
                    ge('postsholder').prepend(cel);
                }
                
                async function loadNofications(){
                    const params =  {userSelf: (await requestUser()).username}
                    try {
                        const response = await Moralis.Cloud.run('notifications', params);
                        if(response.length == 0){
                            //make an element to tell the user he is lonely
                            return false
                        }
                        ge('listern').innerHTML = '';
                        //continue normally
                        
                        for(let li = 0; li<response.length; li++){
                            const lity = response[li].type;
                            const lime = response[li].message;
                            
                            const lie = document.createElement();
                            lie.className = 'listed';
                            lie.innerHTML = `<div class="title">${lity}</div><div class="stuvs">${lime}</div>`;
                            ge('listern').prepend(lie);
                        }
                    } catch (error) {
                        const code = error.code;
                        const message = error.message;
                    }
                }
                
                ///
                ///////
                ///////////////
                //FUNCTIONS HANDLING TAGS. User tags(@), Post tags(#), Project tags(double $), numbers and dates//
                function usertags(txt){
                    if(txt.indexOf('@') == 0){
                        //Red
                        return `<span onclick="openuser()" class="">${txt}</span>`
                    }
                    else{return txt}
                }
                
                async function posttags(txt){
                    if(txt.indexOf('##') == 0){
                        //Purple
                        const comments = new Moralis.Query('Comments');
                        await posts.get(txt.slice(2)).then((psc)=>{
                            return `<span class="quotes"><p onclick="openuser()" class="col3">&#64;${psc.get('user').username}</p><p>${psc.get('contents')}</p></span>`
                        },
                        ()=>{
                            return txt
                        })
                    }
                    else{return txt}
                }
                
                async function projecttags(txt){
                    if(txt.indexOf('$$') == 0){
                        //Blue
                        return `<span onclick="openproject(this.innerHTML.slice(2))" class="">${txt}<span>`
                    }
                    else{return txt}
                }
                
                async function lflinks(txt){
                    //check for links
                    if(txt.indexOf('http') == 0 && txt.indexOf('.') > -1){
                        return `<a href="${txt}">'${txt}'</a>`
                    }
                    else{return txt}
                }
                async function processtext(texts){
                    const split = texts.split(' ');
                    let processed = '';
                    for(let prt = 0; prt<split.length; prt++){
                        //check for all tags
                        split[prt] = await projecttags(split[prt]);
                        split[prt] = await usertags(split[prt]);
                        split[prt] = await posttags(split[prt]);
                        split[prt] = await lflinks(split[prt]);
                        
                        processed+=' '+split[prt]
                    }
                    return processed.replaceAll('\n', '</br>');
                }
                
                function processnumbers(num){
                    if(Number(num).toFixed(0)>999){
                        return (num/1000).toString()+'k'
                    }
                    else if(Number(num).toFixed(0)>999999){
                        return (num/100000).toString()+'M'
                    }
                    else{
                        return num.toString()
                    }
                }
                
                function appm(apmm){
                    let apmmx = apmm.split(':')[0];
                    if(Number(apmmx) > 12){
                        let dlt = Number(apmmx) - 12;
                        return dlt.toString()+':'+apmm.split(':')[1]+' PM'
                    }
                    else if(Number(apmmx) == 0){
                        return '12'+':'+apmm.split(':')[1]+' AM'
                    }
                    else{
                        return apmm+' AM'
                    }
                }
                
                async function processdate(date){
                    //first convert to local time.
                    const lt = String(new Date(date+' UTC'));
                    // process it like a normal text.
                    const fslice = lt.slice(lt.indexOf(' ')+1, lt.lastIndexOf(':')); //we remove the last part
                    const timep = fslice.slice(fslice.lastIndexOf(' ')+1);
                    let datep = fslice.slice(0, fslice.lastIndexOf(' '));
                    
                    //console.log(Date.now() - Date.parse(date+' UTC'));
                    if((Date.now() - Date.parse(date+' UTC')) < 31557600000) datep = datep.slice(0, -5); // posted not more than a year ago
                    
                    const nda = `&#183; ${appm(timep)} &#183; ${datep}`;
                    return nda
                }
                
                //ENDS HERE
                //////////////
                ///////
                ///
                
                /************/
                /*** BACKEND CODES! ***/
                /***********/
                async function remos() {
                    ge('searchbody').innerHTML = '';
                }
                async function search(){
                    if(ge('searchtop').innerHTML.indexOf(`<object width="50px" type="image/svg+xml" data="https://impera.onrender.com/img/loading.svg"></object>`) == -1){
                    //show the loader
                    ge('searchtop').innerHTML = `<object width="50px" type="image/svg+xml" data="https://impera.onrender.com/img/loading.svg"></object>`;
                }
                const sval = ge('sany2').value;
                await remos();//clear the existing searched stuffs
                
                if(sval.length < 3){return false}
                
                if(sval.indexOf('$$') == 0){
                    const cond1 = new Moralis.Query("Projects");
                    cond1.equalTo("keywords", sval.slice(2));
                    
                    const cond2 = new Moralis.Query("Projects");
                    cond2.startsWith("summary", sval.slice(2));
                    
                    const orq = Moralis.Query.or(cond1, cond2);
                    await orq.find().then(async function(wefound){
                        await remos();
                        //const fou = [];
                        if(wefound.length == 0){nosf(); return false}
                        
                        //wefound is an array containg all the stuffs we are getting from the database.
                        for(let c = 0; c<wefound.length; c++){
                            const ima = wefound[c].get('image');
                            const name = wefound[c].get('title');
                            const username = 'by @'+wefound[c].get('username');
                            const sume = wefound[c].get('summary') == '' ? 'No summary for this project.' : wefound[c].get('summary');
                            
                            const seael = document.createElement('div');
                            seael.className = 'searchresults';
                            seael.innerHTML = `<div onclick="await openproject('${wefound[c].id}')" class="searchimg" style="border-radius:5px"><img style="border-radius:5px" src="${ima}"/></div><div class="searchdetails"><div class="setop"><p>${name}</p><p class="col3">@${username}</p></div><div class="sebot"><p>${sume}</p></div></div>`
                            
                            ge('searchbody').append(seael)
                        }
                    })
                }
                if(sval.indexOf('@') == 0){
                    if(ge('searchbody').innerHTML != ''){ge('searchbody').innerHTML = ''}
                    
                    const search = new Moralis.Query("users");
                    search.startsWith("username", sval.slice(1));
                    search.find().then(async function(wefound){
                        await remos();
                        if(wefound.length == 0){nosf(); return false}
                        
                        //wefound is an array containg all the stuffs we are getting from the database.
                        for(let c = 0; c<wefound.length; c++){
                            const ima = wefound[c].get('image');
                            const name = wefound[c].get('name');
                            const username = wefound[c].get('username');
                            const about = wefound[c].get('about')  == '' ? 'I wrote nothing about myself ;)' : wefound[c].get('about');
                            
                            const seael = document.createElement('div');
                            seael.className = 'searchresults';
                            seael.innerHTML = `<div onclick="await openuser('${wefound[c].id}')" class="searchimg" style="border-radius:100%"><img style="border-radius:100%" src="${ima}"/></div><div class="searchdetails"><div class="setop"><p>${name}</p><p class="col3"> @${username}</p></div><div class="sebot"><p>${about}</p></div></div>`
                            
                            ge('searchbody').append(seael)
                        }
                    })
                }
                
                if(sval.indexOf('@') == -1 && sval.indexOf('$$') == -1){
                    
                    //TO SEARCH FOR USER
                    const userssearch = new Moralis.Query("users");
                    userssearch.startsWith("username", sval);
                    
                    const usersnname = new Moralis.Query('users');
                    usersnname.startsWith('name', sval);
                    
                    const bothx = Moralis.Query.or(userssearch, usersnname);
                    const usersfound = await bothx.find();
                    
                    //TO SEARCH FOR PROJECTS
                    const search = new Moralis.Query("Projects");
                    search.equalTo("keywords", sval);
                    
                    const sear2 = new Moralis.Query("Projects");
                    sear2.fullText("summary", sval);
                    
                    const bothv = Moralis.Query.or(search, sear2);
                    const projfound = await bothv.find();
                    
                    await remos();
                    
                    if(usersfound.length>0 || projfound>0){
                        if(usersfound.length>0){
                            for(let c = 0; c<usersfound.length; c++){
                                const ima = usersfound[c].get('image');
                                const name = usersfound[c].get('name');
                                const username = usersfound[c].get('username');
                                const about = usersfound[c].get('about')  == '' ? 'I wrote nothing about myself ;)' : usersfound[c].get('about');
                                
                                const seael = document.createElement('div');
                                seael.className = 'searchresults';
                                seael.innerHTML = `<div onclick="await openuser('${wefound[c].id}')" class="searchimg" style="border-radius:100%"><div class="underp siba"><img style="border-radius:100%" src="${ima}"/></div></div><div class="searchdetails"><div class="setop"><p>${name}</p><p class="col3"> @${username}</p></div><div class="sebot"><p>${about}</p></div></div>`
                                
                                ge('searchbody').prepend(seael)
                            }
                        }
                        
                        if(projfound.length>0){
                            for(let c = 0; c<projfound.length; c++){
                                const ima = projfound[c].get('image');
                                const name = projfound[c].get('title');
                                const username = 'by @'+projfound[c].get('username');
                                const sume = projfound[c].get('summary') == '' ? 'No summary for this project.' : projfound[c].get('summary');
                                
                                const seael = document.createElement('div');
                                seael.className = 'searchresults';
                                seael.innerHTML = `<div onclick="await openproject('${wefound[c].id}')" class="searchimg" style="border-radius:none"><img style="border-radius:none" src="${ima}"/></div><div class="searchdetails"><div class="setop"><p>${name}</p><p class="col3">${username}</p></div><div class="sebot"><p>${sume}</p></div></div>`
                                
                                ge('searchbody').prepend(seael)
                            }
                        }
                    }
                    else{nosf()}
                    
                    
                }
                //NO SEARCH FOUND... SO WE SHOW THAT IN THE SEARCHBODY
                return false;
            }
            function nosf(){
                showToast('No search found', 2, 5000)
                ge('searchtop').innerHTML = '<p>No search results</p>';
            }
            function openmenu(){
                if(screen() == 'ls' || screen() == 'tablet'){
                    window.open('index.html/home', '_self');
                }
                else if(screen() == 'mobile'){
                    if(ge('suui').style.display == 'none' || ge('suui').style.display == '') ge('suui').style.display = 'flex';
                    else ge('suui').style.display = 'none'
                }
            }
            async function equithis(obj, currency){
                if(currency == 'dollar'){
                    //for converting to erc20
                    const con = await syncprice(obj.value);
                    ge('equivalent').value = String(con)
                }
                else{
                    const con = obj.value/await syncprice();
                    ge('tipamount').value = String(con)
                }
            }
            function expandprojects(){
                expanded = true;
                console.log(ge('projectsin').className)
                if(screen() == 'tablet' || screen() == 'ls'){
                    if(ge('projectsin').className.indexOf('expanded') == -1){
                        ge('usertab').style.display = 'none';
                        ge('suui').style.display = 'flex';
                        
                        //add a class to show its expanded
                        ge('projectsin').className ='filters expanded';
                    }
                    else{
                        ge('projectsin').className='filters'
                        ge('ibczo-2').style.display = 'flex';
                        if(screen() == 'ls') ge('usertab').style.display = 'flex';    
                    }
                }
                /*
                else if(ge('projectsin').className == 'expanded'){
                    ge('ibczo-2').style.display = 'flex';
                    if(screen() == 'ls') ge('usertab').style.display = 'none';
                }*/
            }
            function searchfocused(wb){
                if(screen() == 'tablet' || screen() == 'ls'){
                    if(wb == undefined){
                        ge('sparent').className+=' activa';
                        ge('searchbox').style.top = (ge('sany').offsetTop+60).toString()+'px';
                        ge('searchbox').style.left = (ge('suui').offsetTop).toString()+'px';
                    }
                    else {
                        ge('suui').className+=' active';
                        ge('searchbox').style.top = (ge('sparent2').offsetTop+60).toString()+'px';
                        ge('searchbox').style.left = (ge('sparent2').offsetLeft).toString()+'px';
                    }
                }
                else{
                    ge('suui').className+=' active';
                    ge('searchbox').style.top = (ge('sparent2').offsetTop+60).toString()+'px';
                }
                ge('searchbox').style.display = 'block';
            }
            function searchblurred(wb){
                if(wb == undefined) ge('sparent').className = 'samewidther sparent';
                else ge('suui').className ='';
                
                setTimeout(function(){
                    ge('searchbox').style.display = 'none';
                }, 500)
            }
            
            /******** START PROJECTS INPUT FIELD ********/
            function pfocused(xele){
                xele.parentElement.className = 'input-box active';
            }
            function offfocused(xele){
                xele.parentElement.className = 'input-box';
            }
            async function checkpra(er){
                const ert = er.value;
                ge('inkeys').value = ert;
                const chqq = new Moralis.Query('Projects');
                chqq.equalTo('title', ert);
                const chqqq = await chqq.first();
                if(chqqq!=undefined) ge('avail').style.background = 'red'; //name taken
                else ge('avail').style.background = '#1EB040';
            }
            function loading(message){
                let lr = document.getElementById('loader');
                ge('tebe').innerHTML = '';
                if(message){
                    ge('tebe').innerText = message;
                }
                if(lr.style.display != 'flex'){
                    lr.style.display = 'flex'
                }
                else{
                    if(!message) lr.style.display = 'none';
                }
                return ge('tebe')
            }
            function checkexistence(){
                //checks if all the input tags are present.
                if(nichelist.length>0){
                    for(let r = 0; r<nichelist.length; r++){
                        let item = nichelist[r];
                        if(alltags.indexOf(item) < 0){return false}
                    }
                    return true
                }
                else{throw 'You have to choose at least one tag'}
            }
            async function submit_project(){
                const pname = document.getElementById('inppname').value;
                const pgoal = Number(document.getElementById('ingoaldolls').value);
                const deadline = document.getElementById('deadline').value;
                const pimage = document.getElementById('replacer').src;
                const summary = ge('sumitup').value;
                const keywords = (ge('inkeys').value).split(',');
                const tags = nichelist;
                
                const userinfo = await requestUser();
                
                const chqq = new Moralis.Query('Projects');
                chqq.equalTo('title', pname);
                const taken = await chqq.first();
                
                if(taken){
                    showToast(`The project title '+${pname}' is taken`, 2, 5000);
                    laststep();
                    ge('p_name').focus();
                    return false;
                }
                
                if(quilled.getLength() > 200 && (pimage != null && pimage != '') && (pname.length < 21 && pname.length > 3 && (pname).match(/^[A-Za-z0-9\s]*$/)) && deadline.match(/^[1-9]*$/) && (nichelist.length<5 && nichelist.length>0 && checkexistence()==true)){ 
                    const contents = quilled.getContents();
                    loading('Creating Project...');
                    
                    const imgx =  pimage;
                    const options = {
                        abi: [
                            {
                                path: `${globalid}/projects/${random_string()}.${imgx.slice(imgx.indexOf('/')+1, imgx.indexOf(';'))}`,
                                content: imgx,
                            },
                        ],
                    };
                    const path = await Moralis.Web3API.storage.uploadFolder(options);
                    
                    loading('Creating Wallet...');
                    const newWallet = await ethers.Wallet.createRandom();
                    loading('Wallet created');
                    
                    const rphrase = newWallet.mnemonic.phrase;
                    const priKey = newWallet.privateKey;
                    
                    const projects = Moralis.Object.extend('Projects');
                    
                    const project = new projects();
                    project.set('title', pname);
                    project.set('image', path[0].path);
                    project.set('contents', contents);
                    project.set('user', userinfo);
                    project.set('goal', pgoal);
                    project.set('idu', userinfo.username);
                    project.set('address', newWallet.address);
                    project.set('keywords', keywords);
                    project.set('summary', summary);
                    project.set('tags', tags);
                    project.set('deadline', Number(deadline)); //deadline is a number, in months
                    project.setACL(ppACL);
                    
                    loading('Saving...');
                    
                    await project.save().then(async (saved)=>{
                        //Since its still Alpha the user will get his details.
                        //Once we are mainnet, the infos will be hidden until the deadline
                        loading();
                        
                        try {
                            await Moralis.Cloud.run('privatesave', {pid:saved.id, privateKey:priKey, mnemonic:rphrase});
                        } catch (error) {
                            const code = error.code;
                            const message = error.message;
                        }
                        
                        ge('prikey').innerText = priKey;
                        ge('mnemonics').innerText = rphrase;
                        
                        opendialog('privateinfod');
                        clearForms();
                        
                        showToast('Project created', 1, 3000, function(){
                            openproject(saved.id)
                        })
                    }, (err)=>{
                        loading();
                        console.log(err.message);
                        console.log(err.code);
                        showToast('Something went wrong', 4, 3000)
                    })
                }
                else if(!pname.match(/^[A-Za-z0-9\s]*$/)){
                    showToast('only alphanumeric inputs are allowed', 4);
                    laststep();
                    ge('inppname').focus()
                }
                else if(pname == ''){
                    showToast('Title is a requirement', 2);
                    laststep();
                    ge('inppname').focus()
                }
                else if(pname.length > 20 && pname.length < 4){
                    showToast('Title should be more than 3 characters', 2);
                    laststep();
                    ge('inppname').focus()
                }
                else if(quilled.getLength() < 201){
                    showToast('Description is lesser than 200 characters', 2);
                    ge('editor').firstChild.focus();
                }
                else if(pimage == null || pimage == ''){
                    showToast('Project image is required', 2);
                    laststep();
                    ge('lfimg').focus()
                }
                else if(nichelist.length>4 && nichelist<1){
                    showToast('Please select at least one tag', 2);
                    laststep();
                }
                else if(!deadline.match(/^[1-9]*$/)){
                    showToast('Deadline must be in number', 2);
                    laststep()
                }
            }
            
            
            function clearForms(){
                const fele = gc('input-box');
                for(let yu = 0; yu < fele.length; yu++){
                    if(fele[yu].parentElement.id == 'simpleinputs' || fele[yu].parentElement.id == 'secondstep'){
                        fele[yu].children[1].value = '';}
                    }
                    ge('sumitup').innerText = ''
                    ge('replacer').src = '';
                    removeimg()
                }
                /******* END OF PROJECTS INPUT FIELD STUFFS *******/
                
                function clearContent(){
                    ge('writecontent').value = '';
                    ge('images-s').innerHTML = ''
                }
                
                async function newev(){
                    showToast('You must have a project to create an event', 2, 5000);
                    ge('ev').style.display = 'block';
                    ge('createe').style.display = 'none';
                    ge('closeee').style.display = 'block';
                    
                    const ee = new Moralis.Query('Projects');
                    ee.equalTo('', theuser())
                    const results = await ee.find();
                }
                
                async function closenewev(){
                    ge('ev').style.display = 'none';
                    ge('closeee').style.display = 'none'
                    ge('createe').style.display = 'block';
                }
                
                async function createnewevent(){
                    const date = ge('').value;
                    const time = ge('').value;
                    const type = ge('').value;
                    const project = ge('').value;
                    
                    const cfyp = new Moralis.Query('Projects');
                    cfyp.equalTo('idu', (await requestUser()).username);
                    cfyp.first().then(async ()=>{
                        
                        const oppai = Moralis.Object.extend('Events');
                        const breasts = new oppai();
                        
                        breasts.set('date', date);
                        breasts.set('time',time);
                        breasts.set('project', project);
                        breasts.set('type', 'type');
                        breasts.setACL(ppACL);
                        
                        breasts.save().then(()=>{showToast('Event created', 1, 3000)})
                    }
                    )
                }
                async function shareproject(ty){
                    const plink = ge('socialis').getAttribute('link');
                    if(plink == 'no link'){return false}
                    
                    //make the buttons head to their respective pages
                    if(ty == 'twitter'){window.open(`https://twitter.com/intent/tweet?text=Check out this project ${plink}`, '_blank')}
                    else if(ty == 'facebook'){window.open(`https://facebook.com/sharer.php?u=${plink}`, '_blank')}
                    else if(ty == 'email'){let me = await requestUser(); location.href(`mailto:?subject=Recommendation from ${me.name} - Impera.io &body=<div><h1>From ${me.name} - <a href=https://impera.onrender.com/me/"${me.username}" style="color:rgb(255,77,181)">@${me.username}<a></h1><p>Check out this project on Impera <a>${plink}</a></p></div>`)}
                    else if(ty == 'link'){
                        //copy link to clipboard
                        navigator.clipboard.writeText(location.href)
                        showToast('link copied', 2, 5000);
                    }
                }
                
                async function sharepost(ty){
                    const plink = linktoshare;
                    
                    //make the buttons head to their respective pages
                    if(ty == 'twitter'){window.open(`https://twitter.com/intent/tweet?text=Check out this post ${plink}`, '_blank')}
                    else if(ty == 'facebook'){window.open(`https://facebook.com/sharer.php?u=Check out this post ${plink}`, '_blank')}
                    else if(ty == 'link'){
                        //copy link to clipboard
                        navigator.clipboard.writeText(linktoshare);
                        showToast('link copied', 2, 5000, function(){
                            window.open(linktoshare, '_blank')
                        });
                    }
                }
                
                function createMeta(obj){
                    const pop = obj.pop;//pop means post or project.
                    const content = (String(obj.content).substring(0, 50)+'...');
                    const poster = obj.poster; //an object with username, name and image
                    const attachments = obj.attachments ?? 'https://impera.onrender.com/img/card.img';
                    
                    //const meta1 = document.createElement('meta');
                    //We append metadata here. useful for social sharing.
                    const metatext = `
                    <meta name="keywords" content="Impera, Social kickstarter, social crowdfunding, ${poster.name}, ${poster.username}">
                    <meta name="description" content="A ${pop} by ${poster.name}">
                    
                    <meta name="twitter:card" content="${attachments}">
                    <meta name="twitter:title" content="a ${pop} by ${poster.name}">
                    <meta name="twitter:description" content="${content}">
                    <meta name="twitter:site" content="@CSS">
                    <meta name="twitter:image" content="${poster.image}">
                    
                    <meta name="og:card" content="${attachments}">
                    <meta name="og:description" content="${content}">
                    <meta name="og:title" content="a ${pop} by ${poster.name}">
                    <meta name="og:type" content="website">
                    <meta name="og:description" content="${content}">
                    <meta name="og:site" content="@CSS">
                    <meta name="og:image" content="${poster.image}">
                    
                    `;
                    
                    document.head.innerHTML+=metatext
                }
                
                async function actions(postId, type, el, poc){
                    this.event.stopPropagation();
                    const tar = this.event.target;
                    
                    let tyu = showToast(loadicon);
                    tyu.style.height = '60px';
                    
                    //keeping the code as compact as possible
                    const user = await Moralis.User.current();
                    if(!user){return}
                    const userthings = new Moralis.Query('users');
                    //get the user's and edit it accordingly
                    userthings.equalTo('user', user.id);
                    if(poc == 'post' || poc == undefined) userthings.select('likes', 'quoted');
                    else if(poc == 'comments') userthings.select('likescomments', 'quoted');
                    const usersc = await userthings.first();
                    
                    const params = {
                        postId:postId,
                        username: usersc.get('username')
                    }
                    switch(type){
                        case 'comment':{
                            opendialog('writecontent', {postid:postId})
                        } break;
                        case 'like':{
                            const likes = usersc.get('likes');
                            if(likes.indexOf(postId) != -1){
                                params.wh = 'remove';
                                //remove it
                                try {
                                    if(poc != 'comments') await Moralis.Cloud.run('like', params);
                                    else await Moralis.Cloud.run('like_comment', params);
                                    
                                } catch (error) {
                                    const code = error.code;
                                    const message = error.message;
                                    console.log(message)
                                }
                                
                                usersc.remove('likes', postId);
                                usersc.save().then(()=>{
                                    el.className = el.className.replace('lq', '');
                                    el.childNodes[0].innerText = (Number(el.lastChild.innerText)-1).toString()
                                })
                            }
                            else{
                                params.wh = 'add';
                                try {
                                    if(poc != 'comments')await Moralis.Cloud.run('like', params);
                                    else await Moralis.Cloud.run('like_comment', params);
                                    
                                } catch (error) {
                                    const code = error.code;
                                    const message = error.message;
                                    console.log(message)
                                }
                                
                                //add user's like
                                usersc.addUnique('likes', postId);
                                usersc.save().then(()=>{
                                    el.className+= 'lq'
                                    el.childNodes[0].innerText = (Number(el.lastChild.innerText)+1).toString()
                                })
                            }
                        } break;
                        case 'quote':{
                            const quoted = usersc.get('quoted');
                            if(quoted.indexOf(postId) != -1){
                                params.wh = 'remove'
                                try {
                                    await Moralis.Cloud.run('quote', params)
                                } catch (error) {
                                    const code = error.code;
                                    const message = error.message;
                                }
                                
                                usersc.remove('quoted', user.id);
                                usersc.save().then(async ()=>{
                                    el.className = el.className.replace('lq', '');;
                                    el.childNodes[0].innerText = (Number(el.lastChild.innerText)-1).toString()
                                    /*
                                    //then we delete the post.
                                    const thwd = new Moralis.Query('Posts');
                                    const delat = await thwd.get(postId)
                                    delat.destroy();
                                    */
                                })
                            }
                            else{
                                params.wh = 'add'
                                try {
                                    await Moralis.Cloud.run('quote', params)
                                } catch (error) {
                                    const code = error.code;
                                    const message = error.message;
                                }
                                
                                //let user copy post post it on users account
                                usersc.addUnique('quoted', user.id);
                                usersc.save().then(()=>{
                                    el.classList[4] = 'lq';
                                    el.childNodes[0].innerText = (Number(el.lastChild.innerText)+1).toString()
                                    //simply copy all the data.
                                })
                            }
                        } break;
                        case 'share':{
                            //bring out a small box containing links.
                            const link = location.origin+"/post/"+postId;
                            linktoshare = link;
                            
                            const np = findPos(tar);
                            
                            ge('smalinks').style.left = (np[0] - 90).toString()+'px';
                            ge('smalinks').style.top = (np[1]-45).toString()+'px';
                            ge('smalinks').style.display = 'flex';
                            
                            window.onclick = function(){
                                ge('smalinks').style.display = "none";
                            }
                        } break;
                        case 'mas':{
                            document.getElementById(postId).childNodes[0].childNodes[0].remove();
                            tyu.innerHTML = 'Marked as spam';
                            tar.parentElement.style.display = 'none'
                        } break;
                        case 'hide':{
                            //remove the said element
                            ge(postId).remove();
                            tar.parentElement.style.display = 'none'
                        } break;
                        case 'save':{
                            let wts;
                            if(poc == 'post' || poc == undefined){
                                const pocq = new Moralis.Query('Posts');
                                wts = await pocq.get(postId);
                            }
                            else{
                                const pocq = new Moralis.Query('Comments');
                                wts = await pocq.get(postId);
                            }
                            const ud = await getuserdetails(wts.get('idu'));
                            
                            let att = '';
                            if(wts.get('attachments') != '' || wts.get('attachments') != undefined) att = import_attachments(wts.get('attachments'));
                            
                            const html = `
                            <style>
                            
                            :root{
                                --col1:29, 155, 240;
                                --col2:255, 77, 181;
                                --col3:179, 29, 236;
                                --primary:230, 230, 230;
                                --secondary:0, 0, 0;
                                --color1:rgb(var(--col1));
                                --color2:rgb(var(--col2));
                                --color3:rgb(var(--col3));
                                --gray1:rgba(107, 107, 107, 0.41);
                                --shadow:rgba(0,0,0,0.4);
                                --gray2:rgba(113, 113, 113, 0.462);
                                --gray3:#222222;
                                --gray4:#3f3f3f;
                                --thread:#222222;
                                --darkg:rgb(19, 19, 19);
                                --pri:rgb(var(--secondary));
                                --sec:rgb(var(--primary));
                                --pri9:rgb(127, 127, 127);
                                --gradi: linear-gradient(135deg, var(--color1), var(--color3), var(--color2));
                                --grad3: linear-gradient(45deg, var(--color2), var(--color3), var(--color1));
                                --grad4: linear-gradient(225deg, var(--color2), var(--color3), var(--color1));
                                --bwe:10px 0px;
                                --custom: rgba(0,0,0,0.4);
                            }
                            .row{
                                display: flex;
                                flex-direction: row;
                            }
                            .column{
                                display: flex;
                                flex-direction: column;
                            }
                            span{
                                color: #eeeeee
                            }
                            .content img{
                                border-radius:10px;
                                margin-top:5px
                            }
                            </style>
                            <div style="width: 300px; padding: 3px; display: flex; justify-content: center; align-items: center; background: var(--grad3);">
                            <div class="column" style="display: flex; width: 294px; flex-direction: column; gap: 2px; align-items: stretch; border-radius: 25px; background-color: #090909; padding: 2px;">
                            <div class="row" style="display: flex; flex-direction: row; width: 100%; height: 50px; gap: 3px;">
                            <div style="background: var(--grad3); border-radius: 25px; padding: 2px;"><img width="40px" height="40px" src="${ud.image}"/></div>
                            <div class="column">
                            <p style="font-size: 1.1rem;">${ud.name}</p>
                            <p style="color: var(--color2);">@${ud.username}</p>
                            </div>
                            <div><img height="30px" style="margin-top: 5px;" src="https://impera.onrender.com/img/im.svg"/></div>
                            </div>
                            
                            <div style="padding-top: 3px;" class="column content">
                            ${await processtext(wts.get('content'))}
                            ${att}
                            </div>
                            <div class="row">
                            <div>${wts.get('likes').length}<span> likes</span></div><span>${await processdate(wts.createdAt)}</span>
                            </div>
                            
                            </div>
                            </div>
                            `;
                            //Takes pic of a post or comment
                            const json = {
                                html: html
                            };
                            
                            const options = {
                                method: 'POST',
                                body: JSON.stringify(json),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Basic ' + btoa('ef960b44-435e-4066-958c-331a12fae556:5aae2ea0-9457-486e-bc11-2e8ffd8d3606')
                                }
                            }
                            
                            fetch('https://hcti.io/v1/image', options)
                            .then(res => {
                                if (res.ok) {
                                    return res.json();
                                } else {
                                    return Promise.reject(res.status);
                                }
                            })
                            .then(data => {
                                // Image URL is available here
                                console.log(data.url);
                                
                                var link = document.createElement("a");
                                document.body.appendChild(link);
                                link.download = `${postId}.jpg`;
                                link.href = data.url;
                                link.target = '_blank';
                                link.click();
                            })
                            .catch(err => console.error(err));
                        } break;
                        case 'tags':{
                            //show related tags
                            const tagsg = new Moralis.Query('Posts');
                            await tagsg.get(postId).then(async (objx)=>{
                                let nds = document.createElement('div');
                                nds.className = 'smallpops';
                                
                                const thetags = objx.get('tags');
                                for(let vf = 0; vf<thetags.length; vf++){
                                    let lgi = document.createElement('div');
                                    lgi.className = 'taggy';
                                    lgi.innerHTML = `${thetags[vf]} <button title="Uninterested in '${thetags[vf]}'" ttr='${thetags[vf]}' class="actions acol2 la la-times" onclick="actions(this.getAttribute('ttr'), 'remove tag')"></button>`
                                    nds.append(lgi);
                                }
                                
                                window.onclick = function(){nds.remove()};
                                
                                nds.style.display = 'flex';
                                document.body.append(nds);
                            })
                        } break;
                        case 'remove tag':{
                            const thisuser = Moralis.User.current();
                            thisuser.remove('tags', postId);
                            await thisuser.save().then(()=>{showToast('Tag removed', 1, 5000)})
                        } break;
                        case 'delete':{
                            if(poc == 'comment') delete_comment(postId)
                            else delete_post(postId)
                        } break;
                    }
                    
                    setTimeout(function(){tyu.remove()}, 1000)
                }
                function comingsoon(){
                    showToast('coming soon', 3, 10000)
                }
                
                async function theuser(){
                    return globalid; 
                }
                
                async function loadProjects(params){
                    const fil = localStorage.getItem('filter');
                    const conp = ge('projectsin').childElementCount-1;
                    
                    //Must always be loaded 10 each time
                    let paramsc = {}
                    if(params != undefined &&  typeof(params) == 'object') paramsc = params
                    else paramsc.start = conp; paramsc.sortby = fil;
                    try {
                        console.log(paramsc)
                        const response = await Moralis.Cloud.run('projects', paramsc);
                        console.log(response);
                        if(response == 'no projects'){ge('projectsin').innerHTML+= `<p id="fals" style="width:100%; text-align:center">${response}</p>`; return ''}
                        else{if(ge('fals') != null) ge('fals').remove()}
                        
                        for(loi=0;loi<response.length;loi++){
                            const resp = response[loi];
                            console.log(resp);
                            const puserr = await getuserdetails(resp.idu);
                            const perc = ((resp.funded/resp.goal)*100);
                            
                            let df = document.createElement('div');
                            df.onclick = function(){openproject(resp.id)};
                            
                            df.className = 'gjs-row projects';
                            df.innerHTML = `
                            <div id="${resp.id}" class="gjs-cell innerboxes">
                            <div class="pr-contents">
                            <img alt="project image" src="${resp.image}"/>
                            <p class="summary">${resp.summary}</p>
                            </div>
                            
                            <div style="display:flex; width: 100%; flex-direction:column; align-items:center; justify-content:center; height: 10px;"><span class="hdivider full"></span></div>
                            
                            <div class="bottoms">
                            <div onclick="openuser('${puserr.username}')" class="loi underp"><img class="userimg" src="${puserr.image}"/></div>
                            
                            <div class="boto2">
                            <div class="btokd"><p>${resp.title}</p><p>${resp.percent}</p></div>
                            <div class="project-info-tab">
                            <div class="iald">${processnumbers(resp.backers)} backers</div>
                            <div class="iald">$${processnumbers(resp.funded)} Funded</div>
                            <button data-project="${resp.id}" class="actions acol7" onclick="addtowl(this.getAttribute('data-project'))"><i class="la la-bell"></i></button>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            `;
                            ge('projectsin').append(df)
                        }
                    } catch (error) {
                        const code = error.code;
                        const message = error.message;
                    }
                }
                
                async function getuserdetails(idu){
                    const udetails = new Moralis.Query('users');
                    udetails.equalTo('username', idu);
                    const result = await udetails.first();
                    
                    return {image:result.get('image'), username:result.get('username'), name:result.get('name')}
                }
                async function proas(){
                    //process all forms of attachments here.
                    //image quality will be reduced, unlike other file type
                    
                }
                function ramwords(){
                    //send request to bannerbear api to generate text to post and we will use the user's tags too
                    fetch('bannerbear link', {}).then(res =>{
                        if(res.ok){
                            return res.json()
                        }
                    }).then(words => {
                        const generated = words.output;
                        ge('writecontent').value = generated
                    }).catch(err =>{
                        showToast('connect to the internet', 2, 5000);
                    })
                }
                async function geifme(them, poc){
                    switch(poc){
                        case "post":{
                            const dme = (await requestUser()).username;
                            if(dme == them){
                                return `
                                <button onclick="actions(this.parentElement.getAttribute('posd'), 'save')"><div>Save post</div></button>
                                <button onclick="actions(this.parentElement.getAttribute('posd'), 'delete')"><div style="color:red">Delete post</div></button>
                                <button onclick="actions(this.parentElement.getAttribute('posd'), 'hide')"><div>Hide</div></button>
                                `;
                            }
                            else{
                                return `
                                <button onclick="actions(this.parentElement.getAttribute('posd'), 'save')"><div>Save post</div></button>
                                <button onclick="actions(this.parentElement.getAttribute('posd'), 'hide')"><div>Hide post</div></button>
                                <button onclick="actions(this.parentElement.getAttribute('posd'), 'mas')"><div>Mark as spam</div></button>
                                <button onclick="actions(this.parentElement.getAttribute('posd'), 'tags')"><div>Related tags</div></button>
                                `;
                            }} break;
                            case "comment": {
                                if(dme == them){
                                    return `
                                    <button onclick="actions(this.parentElement.getAttribute('commd'), 'delete', this, 'comments')"><div style="color:red">Delete comment</div></button>
                                    <button id="hidepost" title='Removes your comment from view' onclick="actions(this.parentElement.getAttribute('commd'), 'hide', this, 'comments')"><div>Hide</div></button>
                                    `;
                                }
                                else{
                                    return `
                                    <button id="hidepost" onclick="actions(this.parentElement.getAttribute('commd'), 'hide', this, 'comments')"><div>Hide comment</div></button>
                                    <button onclick="actions(this.parentElement.getAttribute('commd'), 'mas', this, 'comments')"><div>Mark as spam</div></button>
                                    `;
                                }} break;
                            }
                        }
                        async function openeditor(){
                            switchviews('editme', ['usersstuffs', 'lscreen']);
                            
                            const nqe = new Moralis.Query('users');
                            nqe.equalTo('username', globalid);
                            const nqer = await nqe.first();
                            
                            ge('myname').value = nqer.get('name');
                            ge('myusername').value = nqer.get('username');
                            ge('allaboutme').value = nqer.get('about');
                        }
                        
                        async function savenewprofile() {
                            const getName = ge('myname').value;
                            const getAbout = ge('allaboutme').value;
                            
                            if(getName == ''){
                                showToast('Name cannot be empty', 2, 5000);
                                ge('myname').focus();
                            }
                            else if(getName.length < 4){
                                showToast('Name is too short', 2, 5000);
                                ge('myname').focus();
                            }
                            else if(!getName.match(/^[A-Za-z\s]*$/)){
                                showToast('Name must not contain special characters', 2, 5000);
                                ge('myname').focus();
                            }
                            else{
                                //save if its good enough
                                const nqe = new Moralis.Query('users');
                                nqe.equalTo('username', globalid);
                                const nqer = await nqe.first();
                                
                                nqer.set('name', getName);
                                nqer.set('about', getAbout);
                                
                                await nqer.save().then(()=>{
                                    showToast('Profile updated!', 1, 5000, function(){
                                        openuser();
                                    })
                                }, ()=>{})
                            }
                        }
                        function import_attachments(attax){
                            //we create an element for the attachments and add them to the main html
                            if((attax.includes('png') || attax.includes('jpg') || attax.includes('jpeg') || attax.includes('image')) && attax.indexOf('3d-') == -1){
                                //for normal pics
                                return `<img src="${attax}"/>`
                            }
                            else if(attax.indexOf('3d-') != -1){
                                //For 3d emojis
                                return `<img src="${attax}" style="outline:none; border:none; width:200px; height:200px"/>`
                            }
                            else if(attax.includes('.mp4')){
                                //for videos
                                return `<video src="${attax}" autoplay></video>`
                            }
                            else if(attax.includes('.mp3')){
                                //music
                                //later
                            }
                            else if(attax.includes('.gif')){
                                //gif manipulations
                                //later
                            }
                            else return ''
                        }
                        
                        async function loadPosts(params, son){
                            ge('lh1').innerHTML = loadicon;
                            ge('cups').innerText = 'Posts';
                            ge('backbutton').style.display = 'none';
                            if((ge('ibczo-2').getBoundingClientRect()).height == 0){opentab('ibczo-2'); switchviews('postsholder', ['mainpost'])}
                            
                            if(!son){
                                const state = {type:'posts', data:params};
                                if(hs1.length != 0){history.pushState(state, '', location.origin+'/posts')}
                                else{history.replaceState(state, '', location.origin+'/posts')}
                                hs1.push(state)
                            }
                            ge('newposter').onclick = function() {
                                opendialog('writepost')
                            }
                            let new_params = params;
                            if(params==undefined){
                                //Must always be loaded 10 each time
                                let tagsz;
                                if(Moralis.User.current()) tagsz = await Moralis.User.current().get('tags');
                                else tagsz = alltags //All the available tags
                                
                                let c = ge('postsholder').childElementCount-1;
                                new_params = {
                                    start:c,
                                    tags: tagsz,
                                    me: globalid
                                }
                            }
                            else{new_params = params}
                            if(!new_params.me) new_params.me = globalid;
                            
                            //if(new_params.start == 0){ge('postsholder').innerHTML = '<div id="lh1" class="loaderholder"></div>'}
                            try {
                                
                                const responsex = await Moralis.Cloud.run('posts', new_params);
                                const response = responsex;
                                
                                if(response == 'no posts'){ge('lh1').innerHTML = `<p style="width:100%; text-align:center">${response}</p>`; return ''}
                                else{ge('lh1').innerHTML = loadicon}
                                
                                for(let r = 0; r<response.length; r++){
                                    const pics = response[r].attachments; //a string
                                    const contents = await processtext(response[r].contents); //multiline string
                                    const likes = response[r].likes;//an array of userids that likes the stuffs
                                    const quoio = response[r].requotes;
                                    const timep = await processdate(response[r].createdat);
                                    const user = await getuserdetails(response[r].idu);
                                    const options = await geifme(response[r].idu, 'post');
                                    const referedto = response[r].referred;
                                    
                                    let comment = '';
                                    let apics = '';
                                    
                                    //process pics
                                    if(pics != ''){
                                        apics+=import_attachments(pics)
                                    }
                                    
                                    //process comments
                                    if(response[r].comment.contents != ''){
                                        console.log(response[r].comment)
                                        const comm = response[r].comment;
                                        const cdfu = await getuserdetails(comm.idu);
                                        const cpt = await processdate(comm.createdat);
                                        const gyd = await geifme(cdfu.username, 'comment', comm.id);
                                        
                                        comment = `
                                        <div comindex="${r}" class="tcomments">
                                        <div class="sosmm"></div>
                                        <div class="userstalk" style="height: auto;">
                                        <div class="underp"><img class="posterpic" src="${cdfu.image}"/></div><span class="asl gb"></span>
                                        <div class="underp"><img onclick="openuser('${comm.user.username}')" class="posterpic" src="${user.image}"/></div>
                                        </div>
                                        <div class="mpost">
                                        <div class="postUser"><p class="hhname" onclick="openuser('${cdfu.username}')">${cdfu.name}</p><span class="hdivider"></span><p class="username col3" onclick="openuser()"> @${cdfu.username}</p><div style="flex-grow:5;">
                                        <button onclick="ooca(this)" title='more' class="acol2 actions user-options la la-ellipsis-h"></button>
                                        <div onclick="ooca()" commd="${comm.id}" class="moreoptions">
                                        ${gyd}
                                        </div>
                                        </div></div>
                                        <div id="${comm.id}" class="postContents">${processtext(comm.contents)}</div>
                                        <div class="postattachments"><div class="inside"><img src="${comm.attachments}"/></div></div>
                                        <div class="refered"></div>
                                        <div><p class="time">${cpt}</p></div>
                                        <div class="postActions">
                                        <!--contains actions related to the post... i.e like, share, save and reply/comment-->
                                        <button title="reply" onclick="opendialog('writepost', {postid:${response[r].id}, comid:'${comm.id}'})" class="actions acol2 las la-quote-right ${comm.quoted}"></button>
                                        <button title="like" onclick="actions('${comm.id}', 'like', this,  'comments')" class="actions acol4 la la-heart ${comm.likedc}"><span class="countso">${processnumbers(comm.likes)}</span></button>
                                        <button title="Take snapshot" onclick="actions('${comm.id}', 'save', this,  'comments')" class="actions acol7 las la-download"></button>
                                        </div>
                                        </div>
                                        </div>
                                        `
                                    }
                                    let referedtoh='';
                                    
                                    //process projects being referred to
                                    if(referedto != ''){
                                        const pre = new Moralis.Query('Projects');
                                        //pre.id = referedto;
                                        await pre.get(referedto).then((resso)=>{
                                            if(resso == undefined){referedtoh = ''}
                                            else{referedtoh = `<div onclick="openproject('${resso.id}')" class="underp"><div style="background: center / contain no-repeat url('${resso.get('image')}');" class="projects-pic"></div></div>`}
                                        });
                                        
                                    }
                                    
                                    if(response[r].commentcount == undefined) response[r].commentcount = 0;
                                    
                                    //process the contents... coloring the username and stuffs
                                    //contents.indexOf('$')(contents.indexOf()), contents.indexOf('$'););
                                    const cel = document.createElement('div');
                                    cel.className = 'posts';
                                    cel.id = response[r].id;
                                    cel.onclick = function(){openpost(response[r].id)};
                                    cel.setAttribute('pindex', 'pindex'+r.toString());
                                    cel.innerHTML = `
                                    <div class="postsin">
                                    <div class="sosmm"></div>
                                    <div class="userstalk">
                                    <div onclick="openuser('${user.username}')" class="underp"><img class="posterpic" src="${user.image}"/></div>
                                    <span class="asl gbv" style="width: 2.5px;"></span>
                                    ${referedtoh}
                                    </div>
                                    
                                    <div class="mpost">
                                    <div class="postUser"><p class="hhname">${user.name}</p><span class="hdivider"></span><p onclick="openuser('${user.username}')" class="username col3"> @${user.username}</p><div style="flex-grow:5;"><button title='more' onclick="ooca(this, event)" class="acol2 actions user-options la la-ellipsis-h"></button>
                                    <div onclick='ooca()' posd="${response[r].id}" class="moreoptions">
                                    ${options}
                                    </div>
                                    </div></div>
                                    <div onclick="openpost('${response[r].id}')" class="postContents">${contents}</div>
                                    <div class="postattachments"><div class="inside">${apics}</div></div>
                                    <div class="refered"></div>
                                    <div><p class="time">${timep}</p></div>
                                    <div class="postActions">
                                    <!--contains actions related to the post... i.e like, share, save and reply/comment-->
                                    <button title='comment' onclick="actions('${response[r].id}', 'comment', this)" class="actions acol6 la la-comment"><span class="countso">${processnumbers(response[r].commentcount)}</span></button>
                                    <button title='quote' onclick="actions('${response[r].id}', 'quote', this)" class="actions acol5 las la-quote-right ${response[r].quoted}"><span class="countso">${processnumbers(quoio)}</span></button>
                                    <button title='like' onclick="actions('${response[r].id}', 'like', this)" class="actions acol4 la la-heart ${response[r].liked}"><span class="countso">${processnumbers(likes)}</span></button>
                                    <button title='share' onclick="actions('${response[r].id}', 'share', this)" class="actions acol7 la la-share"></button>
                                    </div>
                                    ${comment}
                                    </div>
                                    </div>
                                    `;
                                    ge('postsholder').append(cel);
                                }
                                ge('lh1').innerHTML = '';
                                if(response.length < 10){/***LOADED ALL THE POSTS***/ge('lh1').innerHTML = `<p style="width:100%; text-align:center">No more posts</p>`}
                                else{
                                    ge('lh1').innerHTML = `<div onclick="await more_posts(${JSON.stringify(new_params)})" class="malf"><button class="invertio"><p>Load More</p></button></div>`
                                }
                                
                                const posterslist = [];
                                if(ge('recentuser').innerHTML == ''){
                                    for(let r = 0; r<response.length; r++){
                                        if(posterslist.indexOf(response[r].idu) == -1){
                                            posterslist.push(response[r].idu);                                        
                                            if(posterslist.length>5) break;
                                            
                                            const resuser = await getuserdetails(response[r].idu)
                                            
                                            
                                            let erid = document.createElement('div');
                                            erid.className = 'underp';
                                            erid.innerHTML = `<img class="posterpic" src="${resuser.image}"/>`;
                                            erid.onclick = function(){
                                                openuser(resuser.username)
                                            }
                                            ge('recentuser').append(erid)
                                        }
                                    }
                                }
                                return true
                            } catch (error){
                                const code = error.code;
                                const message = error.message;
                                console.log(message);
                                //if(current_user != '')
                                ge('lh1').innerHTML = `<div onclick="await loadPosts(${JSON.stringify(new_params)})" class="malf"><button class="invertio"><p><i style="margin-right: 5px; font-size:18px" class="las la-redo-alt"></i>Reload</p></button></div>`;
                                return false
                            }
                        }
                        function optioned(){
                            this.event.stopPropagation()
                        }
                        
                        async function currcon(elx, obj, conve){
                            if(conve == 'dollar'){
                               //converting from dollar
                                const con = obj.value/await syncprice();
                                ge(elx).value = String(con)                                
                            }
                            else{
                               //for converting from other chains
                                const con = await syncprice(obj.value);
                                ge(elx).value = String(con)
                            }
                        }
                        
                        function strinkit(){
                            ge('dersu').style.display = 'none';
                            ge('dersu2').style.display = 'none';
                            ge('dersutop').style.display = 'none';
                        }
                        async function fund(){
                            const me = (await requestUser()).username;
                            
                            if((await Moralis.User.current().get('ethAddress')).match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
                                //connect to wallet
                                showToast('No wallet found', 2, 2000);
                                setTimeout(() => {
                                    showToast('Click to connect Wallet', 2, 10000, async function(){
                                        //will check more on linking a wallet
                                        await handleAuth('metamask').then(()=>{
                                            showToast('Wallet Connected', 3)
                                        }, ()=>{
                                            showToast('Wallet not Connected', 2)
                                        })
                                    });
                                }, 2000);
                                
                                return false;
                            }
                            else{
                                //check if he is using polygon or fantom
                                if(testchains() != 'polygon' && testchains() != 'fantom'){
                                    showToast('You are not on a supported network', 2, function(){
                                        addNetwork('polygon');
                                    });
                                    showToast('Click to switch', 3, 10000)
                                }
                            }
                            
                            if(ge('dersu').style.display == 'none'){
                                ge('dersu').style.display = 'flex';
                                ge('dersu2').style.display = 'flex';
                                ge('dersutop').style.display = 'flex';
                                ge('oplas2').src = 'https://impera.onrender.com/img/polygonicon.svg';
                                if(testchains() == 'fantom') ge('oplas2').src = 'https://impera.onrender.com/img/fantomicon.svg';
                                return false
                            }
                            
                            const amount = ge('fundinput').value;
                            const pid = ge('project-id').innerHTML.slice(2);
                            
                            const tbal = await getTokenBalance()
                            console.log(tbal);
                            
                            if(amount > tbal){
                                showToast('Your Wallet Balance is lesser than your input', 2);
                                return false
                            }
                            
                            const proje = new Moralis.Query('Projects');
                            await proje.get(pid).then(async (wwg)=>{
                                const eth = amount;
                                const receipent = wwg.get('address');
                                
                                //sending ETH to the user.
                                const options = {
                                    type: "native",
                                    amount: Moralis.Units.ETH(eth),
                                    receiver: receipent,
                                };
                                
                                const nts = showToast(loadicon, null, 20000);
                                
                                let transaction = await Moralis.transfer(options);
                                const result = await transaction.wait(2);
                                
                                showToast('Awaiting confirmation...', 1);
                                
                                result.then(async()=>{
                                    //const options = {method: 'GET', headers: {accept: 'application/json', 'X-API-Key': 'test'}};
                                    
                                    /*transvalue = await fetch(`https://deep-index.moralis.io/api/v2/transaction/${receipt.transactionHash}?chain=${testchains('hex')}`, options)
                                    .then(response => response.json())
                                    .then(response => console.log(response))
                                    .catch(err => console.error(err));
                                    */
                                    
                                    //notify the receiver while also notifying the sender, using cloud code. but first show a toast.
                                    showToast(amount.toString()+' '+networklist[testchains()][6]+' sent', 1, 5000, ()=>{
                                        /**when the user clicks the toast**/
                                    });
                                    
                                    const network = testchains();
                                    //Now Cloud code. A simple message for the receiver
                                    //must convert to eth before saving
                                    await Moralis.Cloud.run('notify', {id:pid, amount:eth, network:network, receiver:receipent, user:globalid});
                                    
                                    nts.remove();
                                    addtowl(pid);
                                })
                            },(error)=>{
                                if(error.code == 101) showToast('Something went wrong');
                                return false})
                            }
                            
                            async function getUserProfile(){
                                const User = Moralis.User.current();
                                User.get('username');
                                User.get('ethAddress');
                                User.get('balance');
                            }
                            
                            //I mustn't forget to add watchlist funtions. The user can keep tabs on the projects of their choice.
                            async function wl(thisuser, uwl, rev){
                                let iii;
                                //the watchlist contains only a link to the respective project
                                if(uwl != undefined){const wl = new Moralis.Query('users');
                                wl.equalTo('user', thisuser);
                                iii = await wl.find();
                            }
                            else{iii = uwl}
                            for(let f = 0; f<iii.length; f++){
                                //we get the project for each watchlist array key. iii is project id
                                const proj = new Moralis.Query('Projects');
                                await proj.get(iii[f]).then((apl)=>{
                                    
                                    //create an element for each project in the wl
                                    const tit = apl.get('title');
                                    
                                    const deadline = apl.get('deadline');
                                    const crat = apl.createdAt;
                                    //const funded = apl[f].funded;
                                    //const ba = apl[f].backers;
                                    const goal = apl.get('goal');
                                    //const per = (funded/goal)*100;
                                    
                                    //we create an element for the list of projects in his/her watchlist.
                                    const newel = document.createElement('div');
                                    newel.className = 'wllist';
                                    newel.innerHTML = `<div class="trtle">${tit}</div><div class="subbo">${checkdeadline(crat, deadline)}</div>${rev}`;
                                    ge('wllson').append(newel)
                                })
                            }}
                            
                            async function checkdeadline(created, deadline){
                                let de = new Date(created+' UTC');
                                let der = de.setMonth(de.getMonth() + deadline);
                                
                                if(new Date()>der){return 'Concluded'}
                                else{return 'Ongoing'}
                            }
                            