//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require("lodash");
const firebase = require("firebase");
require("firebase/firestore");
const express_session = require('express-session');
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const app = express();

app.set('view engine','ejs');

app.use(passport.initialize());
app.use(passport.session());

function typeQuestions(thisQuestion,questonType, res){
    if(questonType === "S" || questonType === "SL" || questonType === "L"){
        res.render("questions", {question:thisQuestion});
    }
    else if(questonType === "N"){
        res.render("numQs", {question:thisQuestion});
    }
    else if(questonType === "B"){
        res.render("binaryQs", {question:thisQuestion});
    }
}

function typeQuestionsU(thisQuestion,questonType, res){
    if(questonType === "S" || questonType === "SL" || questonType === "L"){
        res.render("questionsU", {question:thisQuestion});
    }
    else if(questonType === "N"){
        res.render("numQsU", {question:thisQuestion});
    }
    else if(questonType === "B"){
        res.render("binaryQsU", {question:thisQuestion});
    }
}

// var firebaseConfig = {
//     apiKey: "AIzaSyC9qf4_5LM2aEFutUjhxQaQ-dMJm4aBOvg",
//     authDomain: "quizdb-882d3.firebaseapp.com",
//     projectId: "quizdb-882d3",
//     storageBucket: "quizdb-882d3.appspot.com",
//     messagingSenderId: "564365267566",
//     appId: "1:564365267566:web:69f7697879f83c698e8c7f",
//     measurementId: "G-85KSTBQZRG"
// };
var firebaseConfig = {
    apiKey: "AIzaSyA5pRVDTu_-igUdmyVfyyiv7JIhMTiQjSA",
    authDomain: "crt-game.firebaseapp.com",
    projectId: "crt-game",
    storageBucket: "crt-game.appspot.com",
    messagingSenderId: "671633668607",
    appId: "1:671633668607:web:4afb95bb255e2287fd8fca",
    measurementId: "G-J5RGGN76EF"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
const db = firebase.firestore();
db.settings({timestampsInSnapshots:true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new FacebookStrategy({
    clientID: "169253895322465",
    clientSecret: "8fcdb878d69be9fce03f72565c8294f8",
    callbackURL: "http://localhost:3000/auth/facebook/RiddleMe",
    profileFields:['id','displayName']
},

function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    done(null,profile);
}
));

let lang = "";
let nextCount = 0;
let score = 0;
let correctAnswers = [];
let choosenQuestions = [];
let selectedType = [];
let userAnswers = [];
let isStarted = false;
// let randomNumList = []; //so same questions in Eng/Urdu is not given to same user
let userName = "userName";
let userGender = "userGender";
let userAge = "Age";
let userCountry = "Country";
let userEdu = "Education";
let writeFileNo = 0;
let easyQuestionsV = [];
let mediumQuestionsV = [];
let hardQuestionsV = [];
let easyQuestionsN = [];
let mediumQuestionsN = [];
let hardQuestionsN = [];
let easyAnswersV = [];
let mediumAnswersV = [];
let hardAnswersV = [];
let easyAnswersN = [];
let mediumAnswersN = [];
let hardAnswersN = [];
let easyTypeV = [];
let mediumTypeV = [];
let hardTypeV = [];
let easyTypeN = [];
let mediumTypeN = [];
let hardTypeN = [];
// let questionBank = [];
// let answerBank = [];
// let typeList = [];
// let firstUseradded = false;
// let engQuestionBank = [];

// console.log("here ", engQuestionBank)

// const fs = require('fs');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const { runInNewContext } = require("vm");
const { concat } = require("lodash");
// var text = fs.readFileSync("eng_CRTqs.txt", 'utf-8');
//  engQuestionBank = text.split('\n')

// text = fs.readFileSync("eng_correct_ans.txt", 'utf-8');
// let engAnswersBank = text.split('\n')

// text = fs.readFileSync("Qtype.txt", 'utf-8');
// let engTypeList = text.split('\n')

// text = fs.readFileSync("urdu_CRTqs.txt", 'utf-8');
// let urduQuestionBank = text.split('\n')

// text = fs.readFileSync("urdu_correct_ans.txt", 'utf-8');
// let urduAnswersBank = text.split('\n')

// text = fs.readFileSync("QtypeU.txt", 'utf-8');
// let urduTypeList = text.split('\n')

// console.log(engQuestionBank);
// console.log("language ", lang)

function updateQuestions(questionArr,answerArr,typeArr){
    let randomnumber = Math.floor((Math.random() * questionArr.length));
    let question = questionArr[randomnumber];
    let answer = answerArr[randomnumber];
    let typeQ = typeArr[randomnumber];
    choosenQuestions.push(question);
    correctAnswers.push(answer);
    selectedType.push(typeQ);
    return [question,typeQ];
}


app.get("/",(req,res)=>{
    res.render("login");
});
app.get("/language",(req,res)=>{

    // const params = req.params.language;
    // console.log(params);
    res.render('language');
   
});


 
app.get("/homeU",(req,res)=>{
    res.render("homeU");
});
// app.get("/login",(req,res)=>{
//     res.render("login");
// });
app.get("/setting",(req,res)=>{
    // res.render("setting");
    // userName = req.body.Name;
    const docRef = db.collection('users').doc(userName);
    docRef.get().then((doc)=>{
        // console.log(doc);
        if(doc.exists){
            // console.log('HERE');
            let msg = "Sorry! That username already exists";
            res.render("setting",{errorMsg:msg});
        }
        else{
            // console.log('HERE123');
            let msg="";
            res.render("setting",{errorMsg:msg});

        }
    });
});



app.get("/home",(req,res)=>{
    console.log("here in home");
    res.render("home");
});

app.get("/leaderboard",(req,res)=>{
    res.render("leaderboard");
});

app.get("/consent",(req,res)=>{
    res.render("consent");
});

app.get("/consentU",(req,res)=>{
    res.render("consentU");
});

app.get("/underC",(req,res)=>{
    res.render("underC");
});

app.get("/DLsurveyU",(req,res)=>{
    res.render("DLsurveyU");
});

app.get("/binaryQs",(req,res)=>{
    res.render("binaryQs");
});

app.get("/numQs",(req,res)=>{
    res.render("numQs");
});

app.get("/binaryQsU",(req,res)=>{
    res.render("binaryQsU");
});

app.get("/numQsU",(req,res)=>{
    res.render("numQsU");
});

app.get("/digitalLiteracy",(req,res)=>{
    res.render("digitalLiteracy");
});

app.get('/auth/facebook',passport.authenticate('facebook',{ scope: ['user_friends', 'email'] }),function (req,res){
    console.log("this is the user",req.user);
});

app.get('/auth/facebook/RiddleMe', passport.authenticate('facebook', {failureRedirect: '/' }),
  function(req, res) {
    res.redirect("/language");
 });


// app.post("/login",(req,res)=>{
    
//     let btn = req.body.btn;
//     let email = req.body.email;
//     let pwd = req.body.pwd;
//     console.log("btn:",btn);
    
//     if(btn == "login"){
//         const signup = firebase.auth().signInWithEmailAndPassword(email,pwd);
//         // signup.catch(error => alert(error.message));
//         console.log("good");
//         res.redirect("/consent");
//     }
//     else if(btn == "signup"){
//         const signup = firebase.auth().createUserWithEmailAndPassword(email,pwd);
//         // signup.catch(error => alert(error.message));
//         console.log("good");
//         // alert("Sign up")
//         res.redirect("/consent");
//     }
//     else if(btn == "logout"){
//         const signup = firebase.auth().signOut();
//         res.redirect("/login");
//     }
//     else if(btn == "gmail"){

//         var provider = new firebase.auth.GoogleAuthProvider();
//         provider.addScope('profile');
//         provider.addScope('email');
//         firebase.auth().signInWithRedirect(provider);
//         // res.redirect("/consent");
//     }
//     else if(btn == "guest"){
//         res.redirect("/consent");
//     }
    
// }); 



app.get("/settingU",(req,res)=>{
    // res.render("settingU");
    const docRef = db.collection('users').doc(userName);
    docRef.get().then((doc)=>{
        console.log(doc);
        if(doc.exists){
            console.log('HERE');
            let msg = "Sorry! That username already exists";
            res.render("settingU",{errorMsg:msg});
        }
        else{
            console.log('HERE123');
            let msg="";
            res.render("settingU",{errorMsg:msg});

        }
    });

});



app.get("/scores",(req,res)=>{
    res.render("scores",{Score:score});
});

app.post("/language",(req,res)=>{
    lang = req.body.language;
    console.log(lang);
    if(lang == "eng"){
        db.collection("CRT_questions").doc("eng_crt_Qs").get().then((snapshot) => {
            easyQuestionsV = snapshot.data().easy_verbal;
            mediumQuestionsV = snapshot.data().medium_verbal;
            hardQuestionsV = snapshot.data().hard_verbal;
            easyQuestionsN = snapshot.data().easy_num;
            mediumQuestionsN = snapshot.data().medium_num;
            hardQuestionsN = snapshot.data().hard_num;
            
        });

        db.collection("CRT_questions").doc("eng_crt_ans").get().then((snapshot) => {
            easyAnswersV = snapshot.data().easy_verbal;
            mediumAnswersV = snapshot.data().medium_verbal;
            hardAnswersV = snapshot.data().hard_verbal;
            easyAnswersN = snapshot.data().easy_num;
            mediumAnswersN = snapshot.data().medium_num;
            hardAnswersN= snapshot.data().hard_num;
            
        });

        db.collection("CRT_questions").doc("eng_crt_type").get().then((snapshot) => {
            easyTypeV = snapshot.data().easy_verbal;
            mediumTypeV = snapshot.data().medium_verbal;
            hardTypeV = snapshot.data().hard_verbal;
            easyTypeN = snapshot.data().easy_num;
            mediumTypeN = snapshot.data().medium_num;
            hardTypeN = snapshot.data().hard_num;
            
        });

        res.redirect("/consent");
    }
    else{
        db.collection("CRT_questions").doc("urdu_crt_Qs").get().then((snapshot) => {
            easyQuestionsV = snapshot.data().easy_verbal;
            mediumQuestionsV = snapshot.data().medium_verbal;
            hardQuestionsV = snapshot.data().hard_verbal;
            easyQuestionsN = snapshot.data().easy_num;
            mediumQuestionsN = snapshot.data().medium_num;
            hardQuestionsN = snapshot.data().hard_num;
            
        });

        db.collection("CRT_questions").doc("urdu_crt_ans").get().then((snapshot) => {
            easyAnswersV = snapshot.data().easy_verbal;
            mediumAnswersV = snapshot.data().medium_verbal;
            hardAnswersV = snapshot.data().hard_verbal;
            easyAnswersN = snapshot.data().easy_num;
            mediumAnswersN = snapshot.data().medium_num;
            hardAnswersN= snapshot.data().hard_num;
            
        });

        db.collection("CRT_questions").doc("urdu_crt_type").get().then((snapshot) => {
            easyTypeV = snapshot.data().easy_verbal;
            mediumTypeV = snapshot.data().medium_verbal;
            hardTypeV = snapshot.data().hard_verbal;
            easyTypeN = snapshot.data().easy_num;
            mediumTypeN = snapshot.data().medium_num;
            hardTypeN = snapshot.data().hard_num;
            
        });
        res.redirect("/consentU");
    }
});
app.post("/setting",(req,res)=>{

    userName = req.body.Name;
    
    console.log("User:",userName);
    
    // if(!firstUseradded){

    //     db.collection("users").doc(userName).set({
    //         userName : req.body.Name,
    //         userGender : req.body.gender,
    //         userAge : req.body.age,
    //         userCountry : req.body.country,
    //         userEdu : req.body.education,
    //     }).then(()=>{
    //         console.log("user added successfully here in the first condition");
    //         firstUseradded = true;
    //         res.redirect("/home");
    //     });

    // }
    // else{
        const docRef = db.collection('users').doc(userName);
        docRef.get().then((doc)=>{
            if(doc.exists){
                console.log(doc.data());

                res.redirect("/setting");
            }
            else{
                db.collection("users").doc(userName).set({
                    userName : req.body.Name,
                    userGender : req.body.gender,
                    userAge : req.body.age,
                    userCountry : req.body.country,
                    userEdu : req.body.education,
                }).then(()=>{
                    console.log("user added successfully here in the first condition123");
                    res.redirect("/home");
                });

            }
        });
    // }
  

    // console.log(Name,gender,age, country, education);
});

app.post("/settingU",(req,res)=>{
    // console.log(req.body);
    // userName = req.body.Name;
    // userGender = req.body.gender;
    // userAge = req.body.age;
    // userCountry = req.body.country;
    // userEdu = req.body.education;
    // res.redirect("/homeU");

    userName = req.body.Name;
    
    console.log("User:",userName);
    
    const docRef = db.collection('users').doc(userName);
    docRef.get().then((doc)=>{
        if(doc.exists){
            console.log(doc.data());

            res.redirect("/settingU");
        }
        else{
            db.collection("users").doc(userName).set({
                userName : req.body.Name,
                userGender : req.body.gender,
                userAge : req.body.age,
                userCountry : req.body.country,
                userEdu : req.body.education,
            }).then(()=>{
                console.log("user added successfully here in the first condition123");
                res.redirect("/homeU");
            });

        }
    });

    // console.log(Name,gender,age, country, education);
}); 





app.get("/underC",(req,res)=>{
    res.redirect("/answers");
});

app.get("/answers",(req,res)=>{
    res.render("answers",{question1:choosenQuestions[0], useranswer1:userAnswers[0], crtanswer1:correctAnswers[0],
        question2:choosenQuestions[1], useranswer2:userAnswers[1], crtanswer2:correctAnswers[1],
        question3:choosenQuestions[2], useranswer3:userAnswers[2], crtanswer3:correctAnswers[2],
        question4:choosenQuestions[3], useranswer4:userAnswers[3], crtanswer4:correctAnswers[3],
        question5:choosenQuestions[4], useranswer5:userAnswers[4], crtanswer5:correctAnswers[4],
        question6:choosenQuestions[5], useranswer6:userAnswers[5], crtanswer6:correctAnswers[5]});

        db.collection('users').doc(userName).update({
            questions: choosenQuestions,
            answers: userAnswers
        }).then(()=>{
            console.log("user updated successfully");
            userName = "userName";
            choosenQuestions = [];
            userAnswers = [];
            correctAnswers = [];
        });

        //restarting the game
        
        isStarted =  false;
        nextCount = 0;
        score = 0;
        console.log("the game has restarted");
       
});

app.get("/questionsU",(req,res)=>{
    if(!isStarted){
        console.log(1);
        let [returnQuestion,qType] = updateQuestions(easyQuestionsV, easyAnswersV, easyTypeV);
        typeQuestionsU(returnQuestion, qType, res);
        isStarted = true;
        console.log("1 finish");
    }
    else{
        nextCount+=1;
        if(nextCount === 1){
            console.log(2);
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsV, mediumAnswersV, mediumTypeV);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("2 finish");
        }
        else if(nextCount === 2){
            console.log(3);
            let [returnQuestion,qType] = updateQuestions(hardQuestionsV, hardAnswersV, hardTypeV);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("3 finish");
        }
        else if(nextCount === 3){
            console.log(4);
            let [returnQuestion,qType] = updateQuestions(easyQuestionsN, easyAnswersN, easyTypeN);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("4 finish");
        }
        else if(nextCount === 4){
            console.log(5);
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsN, mediumAnswersN, mediumTypeN);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("5 finish");
        }
        else if(nextCount === 5){
            console.log(6);
            let [returnQuestion,qType] = updateQuestions(hardQuestionsN, hardAnswersN, hardTypeN);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("6 finish");
        }
        else {
            console.log("go to answers");
            // Creat and write file
            // let fs = require('fs');
            // let content = '\n' + '\n' + "Name: " + userName + " Gender: " + userGender + " Age: " + userAge + " Country: " + userCountry + " Education: " + userEdu;
            // let text = "";
            // for (let i = 0; i < choosenQuestions.length; i++) {
            //     let num = i+1;
            //     text += "Q" + num + ": " + choosenQuestions[i] + "\n";
            //     text += "User Answer: " +userAnswers[i] + "\n";
            //     text += "Correct Answer: " + correctAnswers[i] + "\n";
            // }
            // content += text;
            // if(writeFileNo === 0){
            //     fs.appendFile('user_data.txt', content, function (err) {
            //     if (err) throw err;
            //     writeFileNo+=1;
            // });}
            res.redirect("/DLsurveyU");
        }
    }
});

app.get("/DLsurveyU",(req,res)=>{
    res.redirect("/answersU");
    
});
app.get("/answersU",(req,res)=>{
    res.render("answersU",{question1:choosenQuestions[0], useranswer1:userAnswers[0], crtanswer1:correctAnswers[0],
        question2:choosenQuestions[1], useranswer2:userAnswers[1], crtanswer2:correctAnswers[1],
        question3:choosenQuestions[2], useranswer3:userAnswers[2], crtanswer3:correctAnswers[2],
        question4:choosenQuestions[3], useranswer4:userAnswers[3], crtanswer4:correctAnswers[3],
        question5:choosenQuestions[4], useranswer5:userAnswers[4], crtanswer5:correctAnswers[4],
        question6:choosenQuestions[5], useranswer6:userAnswers[5], crtanswer6:correctAnswers[5]});

        db.collection('users').doc(userName).update({
            questions: choosenQuestions,
            answers: userAnswers
        }).then(()=>{
            console.log("user updated successfully urdu");
            userName = "userName";
            choosenQuestions = [];
            userAnswers = [];
            correctAnswers = [];
        });

        //restarting the game 
        
        isStarted =  false;
        nextCount = 0;
        score = 0;
        console.log("the game has restarted urdu");

});

app.get("/questions",(req,res)=>{
    // const questionnumber = req.params.questionnumber;
    // console.log(questionnumber);
    if(!isStarted){
        // console.log("this is the first time the game has started")
        let [returnQuestion,qType] = updateQuestions(easyQuestionsV, easyAnswersV, easyTypeV);
        typeQuestions(returnQuestion, qType, res);
        isStarted = true;
        // if(qType === "S" || qType === "SL" || qType === "L"){
        //     res.render("questions", {question:questiontodisplaybydefault});
        // }
        // // else if(qType === "N"){
        // //     res.render("numQs", {question:questiontodisplaybydefault});
        // // }
        // else if(qType === "B"){
        //     res.render("binaryQs", {question:questiontodisplaybydefault});
        // }
    }
    else{
        // console.log("this is not the first time");
        nextCount+=1;
        // console.log("this is the next count",nextCount);
        if(nextCount === 1){
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsV, mediumAnswersV, mediumTypeV);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 2){
            let [returnQuestion,qType] = updateQuestions(hardQuestionsV, hardAnswersV, hardTypeV);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 3){
            let [returnQuestion,qType] = updateQuestions(easyQuestionsN, easyAnswersN, easyTypeN);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 4){
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsN, mediumAnswersN, mediumTypeN);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 5){
            let [returnQuestion,qType] = updateQuestions(hardQuestionsN, hardAnswersN, hardTypeN);
            typeQuestions(returnQuestion, qType, res);
        }
        else {
            //Creat and write file
            // let fs = require('fs');
            // let content = '\n' + '\n' + "Name: " + userName + " Gender: " + userGender + " Age: " + userAge + " Country: " + userCountry + " Education: " + userEdu;
            // let text = "";
            // for (let i = 0; i < choosenQuestions.length; i++) {
            //     let num = i+1;
            //     text += "Q" + num + ": " + choosenQuestions[i] + "\n";
            //     text += "User Answer: " +userAnswers[i] + "\n";
            //     text += "Correct Answer: " + correctAnswers[i] + "\n";
            // }
            // content += text;
            // if(writeFileNo === 0){
            //     fs.appendFile('user_data.txt', content, function (err) {
            //     if (err) throw err;
            //     writeFileNo+=1;
            //     // console.log('Saved!');
            // });}
            res.redirect("/underC");
        }
    }
});
app.post("/questions",(req,res)=>{
    let answer = req.body.answer;
    userAnswers.push(answer);
    res.redirect("/questions");
});

app.post("/binaryQs",(req,res)=>{
    let answer = req.body.answer;
    userAnswers.push(answer);
    res.redirect("/questions");
});

app.post("/numQs",(req,res)=>{
    let answer = req.body.answer;
    userAnswers.push(answer);
    res.redirect("/questions");
});

app.post("/questionsU",(req,res)=>{
    console.log("SL");
    let answer = req.body.answer;
    userAnswers.push(answer);
    console.log("SL");
    res.redirect("/questionsU");
});

app.post("/binaryQsU",(req,res)=>{
    console.log("B");
    let answer = req.body.answer;
    userAnswers.push(answer);
    console.log("B");
    res.redirect("/questionsU");
});

app.post("/numQsU",(req,res)=>{
    console.log("num");
    let answer = req.body.answer;

    userAnswers.push(answer);
    console.log("num");
    res.redirect("/questionsU");
});

app.post("/underC",(req,res)=>{
    // console.log(req.body);
    // var wifiORdata = req.body.wifiVSdata;
    // var userGoogle = req.body.google;
    // var userAssistance = req.body.assistance;
    // var userActivities = req.body.activities;

    db.collection('users').doc(userName).update({
        wifiordata: req.body.wifiVSdata,
        userGoogle: req.body.google,
        userAssistance: req.body.assistance,
        userActivities: req.body.activities
    }).then(()=>{
        console.log("user updated again successfully");
    })

    // console.log(wifiORdata, userGoogle, userAssistance, userActivities);
    res.redirect("/answers");
});

app.post("/DLsurveyU",(req,res)=>{
    // console.log(req.body);fs
    // var wifiORdata = req.body.wifiVSdata;
    // var userGoogle = req.body.google;
    // var userAssistance = req.body.assistance;
    // var userActivities = req.body.activities;

    db.collection('users').doc(userName).update({
        wifiordata: req.body.wifiVSdata,
        userGoogle: req.body.google,
        userAssistance: req.body.assistance,
        userActivities: req.body.activities
    }).then(()=>{
        console.log("user updated again successfully");
    })

    // console.log(wifiORdata, userGoogle, userAssistance, userActivities);
    res.redirect("/answersU");
});



app.listen(3001,()=>{
    console.log("Server has started on port 3000");
});
