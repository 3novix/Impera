# Impera
DeFi, SocialFi project for Moralis x Google 2022 Hackathon.
https://github.com/Prodyads/Impera/blob/main/README.md#using-the-app
## Quick links
- [Quick Introduction](https://github.com/Prodyads/Impera#introduction)
- [Using the app](https://github.com/Prodyads/Impera#using-the-app)
- [Create your first web3 Crowdfunding project](https://github.com/Prodyads/Impera#create-your-first-web3-project)
- [Extended Introduction](https://github.com/Prodyads/Impera#extended-introduction)
- [Team](https://github.com/Prodyads/Impera#team)
- [Development Journal](https://github.com/Prodyads/Imperaa#development-journal)

### Quick Introduction
Impera.io is a social crowdfunding web project made using Moralis.js SDK for the 2022 Moralis x Google Hackathon. This web app combines the connectivity of a typical social media application like Facebook and a crowdfunding aspect of a website like Kickstarter.

### Technologies Used
1. Moralis.js v1 SDK (Vanilla Javascript), for the backend(user authentication, database and transaction handling and resolving).
2. Ethers.js, used for creating a new wallet for a project.
3. QuillJs (A rich content editor), for writing projects' description.

### Using the app.
1. Sign up on the [homepage](https://prodyads.github.io/landingpage). A wallet is required to authenticate users on the platform, therefore it is an essential part of the application. Use Metamask or Trustwallet and accept the sign in messages (all fields, except 'about me' are required).
2. After the Authentication, you'll be taken to another page where you'll input both username and name. Clicking on next will take you to a new view, this is the page where you will select the branches you want to follow. (Currently, This cannot be changed by the user but will be implemented later, so you dont have to stress over it).
3.Once signup is complete, the page will load and redirect you to the homepage
4. Your profile can be seen on the first tab, Post on the second and Projects on the third.


### Create your first web3 Crowdfunding project
1. Click on the button on the top right corner of the page in the 'Projects' section. The button has a plus sign on it and a gradient background.
2. A dialog will pop up and you will be required to put input on the fields asked. NOTE: THE DEADLINE IS THE NUMBER OF MONTHS YOUR PROJECT WILL RECEIVE FUNDING, your PROJECTS CAN NEVER BE DELETED as it holds transactions that can be viewed overtime(EthTransactions).
3. The server loads for a few seconds after the 'create project' button has been clicked. Another view comes in, but this time its not asking for something, it is giving you something. For Test Case only, We decided to show that each projects created has a wallet where the funds are stored. When the app becomes live, the Wallet's Private Key and Recovery Phrase will not be given to the user until the deadline.
4. And that's you create a project! hassle-free, right?

###POINTS TO NOTE WHEN USING THE APP.
As stated its the first Social crowdfunding website to ever exist, and as such you wouldn't only be able to hold Campaigns(Projects) on it, you'll also be able to update users who follow your project. You can also tag a project too(using its ID, often written double dollar sign at its back), to maybe ask a question or just have some fun with other project creators.

### Extended Introduction
Using Polygon technology as its main track for transactions, Impera.io saves the you from high gas fee(transfer cost), which is mainly the issues with crowdfunding websites, Transfers as low as $1 are allowed on the app. Picture this, you have thousands of followers on Twitter, and each of them are interested in a project you recently pitched to them, not everyone of them would have as much freedom to give more to see said project come to fruition. This could lead to failure to meet the deadline, despite the number of backers you could've gained. And that is where Impera comes in, the app is built to take in transactions as low as a dollar while charging lesser fees than other crowdfunding websites. PLUS YOU GET TO HAVE A COOL PROJECT TAG you can show-off to your followers.

NOW REMAKE THE SITUATION - Your followers visit your project crowdfunding page, they go through a simple stressless signup process, get redirected to to your project and input the transaction amount of their choice, let's say one hundred out of that thousands sent $5, you'll end up with $500 more, even though the amounts contributed individually is not that high. What if a thousand followers each contribute a single dollar? You'll have A thousand dollars!


Users can follow and connect with their favorite creators more easily, while they keep tabs on the projects that interests them. and the creators can easily gather a crowd on a single platform, that is the core reason for the existence of Impera. Although 'Im'perfect, we are all 'Im'portant :)

### Team
* @victorlawrencw
* @code-kami

We did both the Frontend and Backend hand-in-hand. While Eniola(@code-kami) focusing on the sign up and user authentication, I(Victor Lawrence) took it up to write the main Impera pages.

### Development journal
We divided our schedule by weeks. The first week is for frontend, the following three weeks is for backend(since we still have so much to test on the app) and the remaining days for deployment and documentation.

Things were harder than expected and ended spending more than a week for frontend. THE SCHEDULE wasn't followed at all.
