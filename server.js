//CLOUD CODE
//Gather and sort data on the cloud --> the multiple threads page doesnt need to have more than one comment per thread, to save user's data.
//While the Main Thread need to have multiple comment based on one thread. I aint stressing with showing repost(till I'm free to add other non-necessities).
Moralis.Cloud.define("threads", async (request) => {
  //Loads 10 Threads each time User gets close to the bottom. projects will have something similar too.
  const Threads = new Moralis.Query('Threads');
  Threads.containedIn("tags", request.params.tags); //note: tags in the parameter is an array, both in the user profile and in the projects and threads.
  Threads.skip(request.params.start);
  const results = await Threads.find();
  
  
  const newthreads = [];
  for (let i = 0; i < 10; ++i) {
    //It will skip the threads that already exist. i.e 10 by 10
    const contents = results[i].get('contents');
    const user = results[i].get('user');
    
    const qcomments = new Moralis.Query("Comments");
    qcomments.equalTo("thread", results.get(''));
    // comments now contains the comments for myPost
    const comments = query.find().then(()=>{

    });
    
    if(results[i].comments.length > 0){
      //load a single comment if the post has comment(s)
      const comm = results[i].comments;
      const clike = comm.get();
    }
    
    newthreads.push({user:user, contents:contents, likes:results[i].getLikes, requotes:results[i].reposts});
    
  }
  return newthreads;
});

Moralis.Cloud.define("notify", async (info) => {
  //ALWAYS REMEMBER ETH IS THE CURRENCY OF WEB3
  //here we send an email to the user, and also send the notification to the receivers account. we need to send a 'thank you for supporting x' message to the sender too.
  Moralis.Cloud.sendEmail({
    to: info.params.receiver,
    subject: "Fund Received - Impera",
    html: "Your project "+info.params.project_name+" just received "+info.params.amount+" from "+info.params.user
  });
  
  //Email for the sender.
  Moralis.Cloud.sendEmail({
    to: request.user.get("email"),
    subject: "Support sent",
    html: "Thank you for supporting "+info.params.user
  });
  
  //and add to users watchlist.
  const wl = Moralis.Object.extend('wl');
  const newp = new wl();
  
  newp.set('project', ''); //It would be better to just save the id rather than the whole thing.
  newp.save
},

{
  fields: {receiver:{required:true, type:String}, amount:{required:true, type:string}, user:{required:true}},
  requireUser: true,
});