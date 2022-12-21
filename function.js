//MORALIS START
const alltags = Object.freeze(['art', 'gaming', 'music', 'design & tech', 'food & farms', 'film', 'books', 'programming']);
const list = Object.freeze({
    //'polygon':[137, 'Polygon', 'MATIC', 'MATIC', 'https://polygon-rpc.com', 'https://polygonscan.com', '0x89'],
    //'fantom' : [250, 'Fantom', 'FTM', 'FTM' , 'https://rpc.fantom.network', 'https://ftmscan.com/', '0xfa2'],
    'fantom':[4002, 'Fantom Testnet', 'FTM', 'FTM', 'https://rpc.testnet.fantom.network/', 'https://ftmscan.com/', '0xfa2'],
    'polygon':[80001, 'Mumbai Testnet', 'MATIC', 'MATIC', 'https://rpc-mumbai.maticvigil.com/', 'https://polygonscan.com', '0x13881']
})

let method = '';

const textlist = [
    'Join a community of creative individuals, share ideas, organize events and raise funds for your projects, on Impera, the first social crowdfunding website',
    'Enjoy the most of your support by attending exclusive events of projects you watch, and receive timely updates from your favorite creators when they post',
    `The first Social Crowdfunding platform designed on the best web3 tools to save transaction cost compared to popular services`,
    `Establish an unshakable connection between you and your followers`
]

//select niche
let nichelist = [];

function checkexistence(){
    if(nichelist.length>0){
        for(let r = 0; r<nichelist.length; r++){
            let item = nichelist[r];
            if(alltags.indexOf(item) < 0){return false}
        }
        return true
    }
    else{throw 'You have to choose at least one tag'}
}

if(Moralis != undefined){
    const appId = "001";
    const serverUrl = "https://dbserver-xebq.onrender.com/server";
    
    Moralis.initialize(appId);
    Moralis.serverURL = serverUrl;
    
    Moralis.start({serverUrl, appId});
}

Moralis.onAccountChanged(async function(account){
    const confirmed = confirm('Do you want to switch accounts?');
    if(confirmed){
        await Moralis.link(account).then(async ()=>{
            showToast('Wallet Switched!', 1, 5000);
            const getchain = Moralis.chainId;
            if(getchain != 137 && getchain != '0x89' && getchain != 250){
                await addNetwork('polygon')
            }
        })
    }
});

async function switchNetwork(network){
    const list = {'polygon':137, 'bnb':56, 'fantom':250}
    await Moralis.switchNetwork(list[network.toLowerCase()])
}
async function addNetwork(network){
    const selected = list[network.toLowerCase()];
    
    const chain = selected[0];
    const chainname = selected[1];
    const currname = selected[2]
    const currencys = selected[3];
    const rpcUrl = selected[4];
    const blockExUrl = selected[5];
    
    await Moralis.addNetwork(chain, chainname, currname, currencys, rpcUrl, blockExUrl).then(()=>{
        showToast('Connected to '+network+"!");
    })
}

const ethers = Moralis.web3Library;

async function handleAuth(provider){
    let chain = '0x1';
    if(provider == 'web3Auth') chain = '0x13881';

    await Moralis.enableWeb3({
        throwOnError: true,
        provider,
        chainId:chain,
        chainConfig:{
            chainNamespace: "eip155",
            chainId: "0x13881", // hex of 80001, polygon testnet
            rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
            displayName: "Polygon Mainnet",
            blockExplorer: "https://mumbai.polygonscan.com/",
            ticker: "MATIC",
            tickerName: "Matic",
          },
          clientId:"BPhIj4b_UpJHLqLT0RO7FSeqJA1al6oQe8mDb25Xi1tTDdmZa8JtTVYsODQ2xdQ1-SdWtRK1VvnwORC6zDz5xX8",
          appLogo:'https://impera.onrender.com/img/im.svg',
          loginMethodsOrder:["google", "facebook", "twitter", "email_passwordless"]
    });
    
    const { account, chainId } = Moralis;
    
    if (!account) {
        throw new Error("Connecting to chain failed, as no connected account was found");
    }
    if (!chainId) {
        throw new Error("Connecting to chain failed, as no connected chain was found");
    }
    
    const { message } = await Moralis.Cloud.run("requestMessage", {
        address: account,
        chain: parseInt(chainId, 16),
        network: "evm",
    });
    
    await Moralis.authenticate({
        signingMessage: message,
        throwOnError: true,
        provider,
        chainId:chainId,
        clientId:"BPhIj4b_UpJHLqLT0RO7FSeqJA1al6oQe8mDb25Xi1tTDdmZa8JtTVYsODQ2xdQ1-SdWtRK1VvnwORC6zDz5xX8",
        appLogo:'https://impera.onrender.com/img/im.svg',
        loginMethodsOrder:["google", "facebook", "twitter","email_passwordless"]
    }).then(async(user) => {
        const chainID = Moralis.chainId;
        console.log(user)
        console.log(chainID);

        profiled(user.id);
        method = provider;

        user.set('method', provider);
        user.save();

        if(chainID != 137 && chainID != '0x89'){
            await addNetwork('polygon testnet');
        }
    }, (reject)=>{
        showToast('Authentication failed', 2);
    });
}

// declare variables
let wordtwo = document.getElementById("wordtwo");

//we'll keep toggling values
function changeText(){
    times++;
    if(times == 4) times = 0
    document.getElementById('wordtwo').innerHTML = textlist[times];
}

async function profiled(proid){
    const query = new Moralis.Query('users');
    query.equalTo('user', proid);
    const results = await query.find();
    
    if(results.length == 0) changeToUp();
    else if(location.search != '') location.assign(location.search.slice(10)); 
    else location.assign('https://impera.onrender.com');
}

async function loginmeta(){
    let user = await Moralis.User.current();
    if (!user) {
        showToast('Authenticating...', 1);
        await handleAuth('metamask');
    }
    else{
        profiled(user.id)
    }
}
async function loginwallet(){
    let user = await Moralis.User.current();
    if (!user) {
        showToast('Authenticating...', 1);
        await handleAuth('web3Auth');
    }
    else{
        profiled(user.id)
    }
    changeToUp()
}

//code to change tab
//variables
let right = document.getElementById("right");
let upload = document.getElementById("upload");
let nichee = document.getElementById("niche");

function changeToUp(){
    right.style.display = "none";
    nichee.style.display = "none";
    upload.style.display = "flex"
}
async function changeToNi(){
    const name = document.getElementById('displayname').value;
    const username = document.getElementById('username').value;
    
    if(name.match(/^[A-Za-z\s]*$/) && username.match(/^[A-Za-z0-9_]*$/)){
        const ares = await checkpra(document.getElementById('username'));
        if(ares == true){
            upload.style.display = "none";
            right.style.display = "none";
            nichee.style.display = "flex"
        }
        else{document.getElementById('username').focus(); showToast('This user already exist')}
    }
    else if(!name.match(/^[A-Za-z\s]*$/)){
        showToast('name must be alphabets only');
        throw 'name must be alphabets only';
    }
    else if(!username.match(/^[A-Za-z0-9_]*$/)){
        showToast('username can only include letters and numbers');
        throw 'usernames can only be numbers and letters'
    }
}
//uploadimage
let currimg = 'img/profile2.jpg';
//let unprocessed = 'img/profile2.jpg';

let lfimg = document.getElementById("lfimg");
let mycanvas = document.getElementById("mycanvas");
let ccont = document.getElementById("ccont");
let casbtn = document.getElementById("casbtn");

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
            let replacer = document.getElementById("replacer");

            currimg = ress;
            //unprocessed = blob;
            
            replacer.src = currimg;
            
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

document.getElementById("p_image_input").onchange = async function(evt){
    const file = evt.target.files[0];
    
    await showcropper(URL.createObjectURL(file));
}

function niche(nm){
    nichename = nm.id
    if(nichelist.indexOf(nichename) == -1){
        if(nichelist.length<4){
            
            nichelist.push(nichename);
            nm.className = 'ring active';
        }
        else{showToast('only 4 max tags allowed', 1, 5000)}
        
    }
    else{
        nichelist.splice(nichelist.indexOf(nichename), 1);
        
        nm.className = 'ring';
    }
} 

async function checkpra(er){
    const ert = er.value;
    const chqq = new Moralis.Query('users');
    chqq.equalTo('username', ert);
    const chqqq = await chqq.first();
    
    if(chqqq!=undefined){document.getElementById('avail').style.background = 'red'; showToast('username taken </br> Hint: Use underscore'); return false} //name taken
    else document.getElementById('avail').style.background = '#1EB040'; return true
}

async function checkemail(ert){
    const chqq = new Moralis.Query('users');
    chqq.equalTo('ethAddress', ert);
    const chqqq = await chqq.first();
    
    if(chqqq!=undefined){document.getElementById('availe').style.background = 'red'; showToast('Email is already registered'); return false} //email registered
    else{document.getElementById('availe').style.background = '#1EB040'; return true}
}

async function psignUp(){
    const email = (document.getElementById('usernamel').value).toLowerCase();
    const password = document.getElementById('passwordx').value;
    
    if(email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && password.length > 5){
        const response = await checkemail(email);
        if(response == true) signUp(email, password);
        else document.getElementById('usernamel').focus()
    }
    else if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        showToast('Invalid Email');
        document.getElementById('usernamel').focus()
    }
    else if(password.length < 6){
        showToast('Your password should be more than 5 characters');
        document.getElementById('passwordx').focus()
    }
}
function plogIn(){
    const username = document.getElementById('usernamel').value;
    const password = document.getElementById('passwordx').value;
    
    if(username.length == 0){
        showToast('Your Username is blank');
        document.getElementById('usernamel').focus();
    }
    else if(password.length < 6){
        showToast('Incorrect password');
        document.getElementById('passwordx').focus();
        throw 'Your password should be more than 5 characters'
    }
    else loginWithUsername(username, password);
}

async function signUp(email, password){
    const user = new Moralis.User();
    user.set('username', email);
    user.set('email', email);
    user.set('password', password);
    user.set('method', 'email');
    method = 'email';
    try {
        await user.signUp();
        changeToUp();
        showToast('Signed up!', 1);
    } catch (error) {
        const code = error.code;
        const message = error.message;
        showToast(message)
    }
};

async function loginWithUsername(username, password){
    try {
        const user = await Moralis.User.logIn(username, password, { usePost: true });
        showToast('Welcome back');
        
        const query = new Moralis.Query('users');
        query.equalTo('user', user.id);
        const results = await query.find();
        
        if(results.length == 0) changeToUp();
        else if(location.search != '') location.assign(location.search.slice(10)); 
        else location.assign('index.html')
    } catch (error) {
        const code = error.code;
        const message = error.message;
        showToast(message)
    }
}

async function uploadImg(abi){
     const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API-Key': 'HLi1jr5lLYELJvuCIDVfWzGU3q1Yhj9Phsj2CE8IjH9m9QgxgEI1P4CeN8E68ZnF'
        },
        body: JSON.stringify(abi)
      };
      
      const tf = await fetch('https://deep-index.moralis.io/api/v2/ipfs/uploadFolder', options);
      const json = tf.json();
      return json[0].path;
}
async function newuser(){
    const userox = await Moralis.User.current();
    
    if(currimg.includes('img/profile2.jpg')/* || unprocessed.includes('img/profile2.jpg')*/){
        const nimg = await (await fetch(currimg)).blob();
        const nfile = new File([nimg], 'me.jpg', {type: nimg.type});
        
        currimg = await imageConversion.filetoDataURL(nfile);
        //unprocessed = await imageConversion.filetoDataURL(nfile)
    }
    
    //gather the stuffs first
    const name = document.getElementById('displayname').value;
    const pic = currimg; //this is a base64 image that has been cropped to square
    //const largep = unprocessed;
    const username = document.getElementById('username').value;
    const cuser = Moralis.User.current().id;
    let geth= '';
    if(userox.get('ethAddress') != '' && userox.get('ethAddress') != undefined){
        geth = userox.get('ethAddress');
        
    }
    else{
        //const newWallet = await ethers.Wallet.createRandom();
        //connect directly to the wallet
        //Moralis.enableWeb3({privateKey:newWallet.privateKey});
        geth = userox.get('username');
    }
    
    const tags = nichelist;
    const about = document.getElementById('sumitup').value;
    
    //then we check if its all good. name must be alphabets only, while username is alphanumeric, tags is 
    if(name.match(/^[A-Za-z\s]*$/) && username.match(/^[A-Za-z0-9]*$/) && typeof(tags) == 'object' && tags.length>0){
        if(tags == []){
            tags = alltags;
        }
        
        let iol = showToast(`Saving <object width="50px" type="image/svg+xml" data="img/loading.svg"></object>`, 20000);
        
            const abi = [
                {
                    path: `${cuser}/me.${pic.slice(pic.indexOf('/')+1, pic.indexOf(';'))}`,
                    content: pic
                }
            ]
        
        const path = await uploadImg(abi);
        
        
        /*const options2 = {
            abi: [
                {
                    path: `${cuser}/me_large.${largep.type.slice(largep.type.indexOf('/')+1)}`,
                    content: largep
                }
            ]
        };
        
        const path2 = await Moralis.Web3API.storage.uploadFolder(options2);*/
        
        const user = Moralis.User.current();
        user.set('tags', tags);
        user.set('username', username);
        user.set('method', method);
        await user.save().then(()=>{
            
            //then store them
            const users = Moralis.Object.extend('users');
            const newuser = new users();
            newuser.save({
                username:username,
                name: name,
                user:cuser,
                ethAddress:geth,
                about:about,
                image:path,
                //large_image:path2[0].path,
                watchlist:[],
                likes:[],
                likescomments:[],
                projects_backed:[],
                quoted:[],
                subscribed:[],
                backed:[]
            }).then(()=>{
                iol.innerHTML = 'Sign up complete';
                if(location.search != '') location.assign(location.search.slice(10));
                location.assign('');
            })
        })
    }
    else if(!name.match(/^[A-Za-z\s]*$/)){
        showToast('name must be alphabets only', 2);
        throw 'name must be alphabets only';
    }
    else if(!username.match(/^[A-Za-z0-9]*$/)){
        showToast('username can only include letters and numbers', 2);
        throw 'usernames can only be numbers and letters'
    }
    else if(tags.length < 1){
        showToast('Please, select at least one tag', 2)
    }
    else if(typeof(tags) != 'object'){
        throw 'reload the page'
    }
    else if(pic == ''){
        throw 'upload a pic'
    }
}

function showToast(message, mtype, dtime, callback){
    //SET DEFAULTS
    const ftime = dtime ?? 3000;
    
    let toasty= document.createElement('div');
    document.body.appendChild(toasty);
    toasty.className = "toast";
    let pmessage;
    
    let col_array = ['var(--color1)','var(--color2)','var(--color3)', '#ff0000'];
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
