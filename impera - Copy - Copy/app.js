
function ge(id){
    const el = document.getElementById(id);
    return el;
}
function gc(classname){
    const el = document.getElementsByClassName(classname);
    return el;
}

let search_placeholders = ["", 'projects', 'threads', 'users', 'trends', 'Impera'];

function toggler(curr, array){
    let cuup;
    let cu = array.indexOf(curr);
    if(curr == array[array.length-1]){cuup = array[0]}
    else{cuup = array[cu+1]}
    return cuup;
}
/*
setInterval(function(){
    toggler(curr, )
}, 100);
*/

setInterval(() => {
    let inoo = setInterval(() => {
        ge('sany').placeholder = "I'm searching... "+toggler(ge('sany').placeholder.slice(17), search_placeholders);
    }, 1000);
    setTimeout(()=>{
        clearInterval(inoo)
    }, 6000)
}, 20000);

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

const ls = localStorage;

function showToast(message, mtype, ftime, callback){
    let toasty= document.createElement('div');
    document.body.appendChild(toasty);
    toasty.className = "toast";
    
    let col_array = ['3px 0 0px 1px var(--blue)','0 -3px 0 1px var(--pink)','-3px 0 0 1px var(--orange)','0 3px 0 1px var(--yellow)'];
    switch(mtype){
        case 0: toasty.style.boxShadow='0px 0px 2px 2px var(--white), ' + col_array[mtype]; toasty.style.cursor='pointer'; break;
        case 1: toasty.style.boxShadow='0px 0px 2px 2px var(--white), ' + col_array[mtype]; toasty.style.cursor='pointer'; break;
        case 2: toasty.style.boxShadow='0px 0px 5px 2px var(--white), ' + col_array[mtype]; toasty.style.cursor='pointer'; break; 
        case 3:
        {
            let c = 0;
            //loading stuffs
            let loadingAnim = setInterval(function(){toasty.style.boxShadow='0px 0px 0px 2px var(--white), ' + col_array[c]; console.log('bS', col_array[c]); if(c<3){c++}else{c=0};  if(toasty.style.opacity=='0'){clearInterval(loadingAnim)}}, 100);
        }
        break};
        
        toasty.onclick = function(){
            toasty.style.opacity = '0%';
            setTimeout(function(){toasty.remove()}, 500);
            if(callback) callback();
        };
        toasty.onmouseover = function(){
            toasty.style.fontSize = '23px'
        }
        toasty.onmouseout = function(){toasty.style.fontSize = '20px'}
        
        toasty.innerHTML = message;
        toasty.style.opacity = '100%';
        
        setTimeout(function(){
            toasty.style.opacity = "0%";
            setTimeout(function(){toasty.remove()}, 500)
        }, ftime);
        return toasty
    }
    
    ge('pimg').onmouseover = function(evt){
        let now = 0;
        threshold(3, function(){
            /**Show the users profile**/
            ge('miniprofile').style.display = "block";
            ge('miniprofile').style.opacity = "1";
        });
        //let threshold = setInterval(function(){now++; if(now == 3){clearInterval(threshold);}}, 100)
    }
    ge('pimg').onmouseleave = function(){
        clearInterval(th);
        if(ge('miniprofile').display == "block" && ge('miniprofile').onmouseover == false){
            //fade away peacefully, I aint gonna do anything fancy with this
            ge('miniprofile').style.opacity = "0";
            setTimeout(function(){ge('miniprofile').style.display = "none"}, 200);
        }
    }

    //MAKING A TOOLTIP
    for(let y = 0; y<document.getElementsByTagName('button').length; y++){
        document.getElementsByTagName('button')[y].onmouseover = function(element){
            console.log(element);
            threshold(3, ()=>{
                ge('ctt').style.display = 'block';
                ge('ctt').style.opacity = '1';
            })
        }
    }

    function opentab(ent, tabn){
        //change the layout due to the device used being mobile -- USING A CLASSIC TAB FUNCTION FROM W3SCHOOLS
        let i, tab, tabb;
        
        tab = document.getElementsByClassName("rblocks");
        for (i = 0; i < tab.length; i++) {
            tab[i].style.display = "none";
        }
        
        tabb = document.getElementsByClassName("tabb");
        for (i = 0; i < tabb.length; i++) {
            tabb[i].className = tabb[i].className.replace(" gtext", "");
        }
        
        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tabn).style.display = "flex";
        ent.currentTarget.className += " gtext";
    }
    
    document.getElementById(tabn).getAttribute('data-title');
    async function remindme(projectID, notifon){
        if(notifon == 'false'){
            //if notification is off
            //save the projectID to the user's watchlist
            //const watchlist = new Moralis.Object.extend('Watchlist');
            //watchlist.set('watchlist', projectID);
            //watchlist.save;
        }
        else{
            //if notification is already on
        }
    }
    function readUserData(){
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