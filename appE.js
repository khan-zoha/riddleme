//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require("lodash");
const firebase = require("firebase");
require("firebase/firestore");

const app = express();

app.set('view engine','ejs');

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
const db = firebase.firestore();
db.settings({timestampsInSnapshots:true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let lang = "";
let nextCount = 0;
let score = 0;
let correctAnswers = [];
let choosenQuestions = [];
let selectedType = [];
let userAnswers = [];
let isStarted = false;
let randomNumList = []; //so same questions in Eng/Urdu is not given to same user
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
let questionBank = [];
let answerBank = [];
let typeList = [];
let firstUseradded = false;

const fs = require('fs');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const { runInNewContext } = require("vm");
var text = fs.readFileSync("eng_CRTqs.txt", 'utf-8');
let engQuestionBank = text.split('\n')

text = fs.readFileSync("eng_correct_ans.txt", 'utf-8');
let engAnswersBank = text.split('\n')

text = fs.readFileSync("Qtype.txt", 'utf-8');
let engTypeList = text.split('\n')

text = fs.readFileSync("urdu_CRTqs.txt", 'utf-8');
let urduQuestionBank = text.split('\n')

text = fs.readFileSync("urdu_correct_ans.txt", 'utf-8');
let urduAnswersBank = text.split('\n')

text = fs.readFileSync("QtypeU.txt", 'utf-8');
let urduTypeList = text.split('\n')

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
// console.log(engQuestionBank);
// console.log("language ", lang)

function updateQuestions(questionArr,answerArr,typeArr){
    console.log("in");
    // let randomFound = false;
    // let randomnumber = 0;
    // if(randomNumList.length === 0)
    // {
    //     console.log("iffff");
    let randomnumber = Math.floor((Math.random() * questionArr.length));
    // }
    // else{
    //     while (1) { //while rnadom numbe is not unique CODE
    //         // console.log("Hereeeee")
    //         console.log("whileee");
    //         randomFound = false;
    //         randomnumber = Math.floor((Math.random() * questionArr.length));
    //         for (let i = 0; i < randomNumList.length; i++) {
    //             console.log("forrr");
    //             if(randomNumList[i] === randomnumber)
    //             {
    //                 console.log("if222");
    //                 randomFound = true;
    //             }
    //         }
    //         if(!randomFound)
    //         {
    //             console.log("if23333");
    //             break;
    //         }
    //     }
    // }
    console.log("OUT WHILE");
    // randomNumList.push(randomnumber); //when unique found

    let question = questionArr[randomnumber];
    let answer = answerArr[randomnumber];
    let typeQ = typeArr[randomnumber];

    choosenQuestions.push(question);
    correctAnswers.push(answer);
    selectedType.push(typeQ);

    console.log("OUTTTT",question);
    return [question,typeQ];
}

app.get("/home",(req,res)=>{
    res.render("home");
});

app.get("/homeU",(req,res)=>{
    res.render("homeU");
});

app.get("/",(req,res)=>{
    res.render("language");
})

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

app.get("/settingU",(req,res)=>{
    res.render("settingU");
});

app.get("/setting",(req,res)=>{
    res.render("setting",{userExists:""});
    // if(!firstUseradded){
    //     res.render("setting",{userExists:""});

    // }
    // else{
    //     const docRef = db.collection('users').doc(userName);
    //     docRef.get().then((doc)=>{
    //         if(doc.exists){
    //             console.log(doc.data());
    //             // window.document.getElementByID("userExists").style.display = 'block';
    //             res.redirect("/setting");
    //             res.render("setting",{userExists:"Sorry! That username already exists."});
    //         }
    //         else{
    //             res.render("setting",{userExists:""});

    //         }
    //     });
    // }
});

app.get("/scores",(req,res)=>{
    res.render("scores",{Score:score});
});

app.post("/language",(req,res)=>{
    lang = req.body.language;
    console.log(lang);
    if(lang == "eng"){
        easyQuestionsV = engQuestionBank.slice(0,9);
        mediumQuestionsV = engQuestionBank.slice(9, 17);
        hardQuestionsV = engQuestionBank.slice(17,20);
        easyQuestionsN = engQuestionBank.slice(20,23);
        mediumQuestionsN = engQuestionBank.slice(23, 31);
        hardQuestionsN = engQuestionBank.slice(31,35);

        easyAnswersV = engAnswersBank.slice(0,9);
        mediumAnswersV = engAnswersBank.slice(9, 17);
        hardAnswersV = engAnswersBank.slice(17,20);
        easyAnswersN = engAnswersBank.slice(20,23);
        mediumAnswersN = engAnswersBank.slice(23, 31);
        hardAnswersN = engAnswersBank.slice(31,35);

        easyTypeV = engTypeList.slice(0,9);
        mediumTypeV = engTypeList.slice(9, 17);
        hardTypeV = engTypeList.slice(17,20);
        easyTypeN = engTypeList.slice(20,23);
        mediumTypeN = engTypeList.slice(23, 31);
        hardTypeN = engTypeList.slice(31,35);
        res.redirect("/setting");
    }
    else{
        easyQuestionsV = urduQuestionBank.slice(0,10);
        mediumQuestionsV = urduQuestionBank.slice(10, 16);
        hardQuestionsV = urduQuestionBank.slice(16,19);
        easyQuestionsN = urduQuestionBank.slice(19,20);
        mediumQuestionsN = urduQuestionBank.slice(20, 23);
        hardQuestionsN = urduQuestionBank.slice(23,25);

        easyAnswersV = urduAnswersBank.slice(0,10);
        mediumAnswersV = urduAnswersBank.slice(10, 16);
        hardAnswersV = urduAnswersBank.slice(16,19);
        easyAnswersN = urduAnswersBank.slice(19,20);
        mediumAnswersN = urduAnswersBank.slice(20, 23);
        hardAnswersN = urduAnswersBank.slice(23,25);

        easyTypeV = urduTypeList.slice(0,10);
        mediumTypeV = urduTypeList.slice(10, 16);
        hardTypeV = urduTypeList.slice(16,19);
        easyTypeN = urduTypeList.slice(19,20);
        mediumTypeN = urduTypeList.slice(20, 23);
        hardTypeN = urduTypeList.slice(23,25);
        res.redirect("/settingU");
    }
});
app.post("/setting",(req,res)=>{

    userName = req.body.Name;
    
    console.log("this is the first time",userName);
    
    if(!firstUseradded){

        db.collection("users").doc(userName).set({
            userName : req.body.Name,
            userGender : req.body.gender,
            userAge : req.body.age,
            userCountry : req.body.country,
            userEdu : req.body.education,
        }).then(()=>{
            console.log("user added successfully here in the first condition");
            firstUseradded = true;
            res.redirect("/home");
        });

    }
    else{
        const docRef = db.collection('users').doc(userName);
        docRef.get().then((doc)=>{
            if(doc.exists){
                console.log(doc.data());
                // window.document.getElementByID("userExists").style.display = 'block';
                // res.redirect("/setting");
                res.render("setting",{userExists:"Sorry! That username already exists."});
                
            }
            else{
                db.collection("users").doc(userName).set({
                    userName : req.body.Name,
                    userGender : req.body.gender,
                    userAge : req.body.age,
                    userCountry : req.body.country,
                    userEdu : req.body.education,
                }).then(()=>{
                    console.log("user added successfully here in the first condition2");
                    res.redirect("/home");
                });

            }
        });
    }
  

    // console.log(Name,gender,age, country, education);
});

app.post("/settingU",(req,res)=>{
    // console.log(req.body);
    userName = req.body.Name;
    userGender = req.body.gender;
    userAge = req.body.age;
    userCountry = req.body.country;
    userEdu = req.body.education;
    res.redirect("/homeU");

    // console.log(Name,gender,age, country, education);
}); 

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
            let fs = require('fs');
            let content = '\n' + '\n' + "Name: " + userName + " Gender: " + userGender + " Age: " + userAge + " Country: " + userCountry + " Education: " + userEdu;
            let text = "";
            for (let i = 0; i < choosenQuestions.length; i++) {
                let num = i+1;
                text += "Q" + num + ": " + choosenQuestions[i] + "\n";
                text += "User Answer: " +userAnswers[i] + "\n";
                text += "Correct Answer: " + correctAnswers[i] + "\n";
            }
            content += text;
            if(writeFileNo === 0){
                fs.appendFile('user_data.txt', content, function (err) {
                if (err) throw err;
                writeFileNo+=1;
                // console.log('Saved!');
            });}
            res.redirect("/underC");
            // res.render("answers",{question1:choosenQuestions[0], useranswer1:userAnswers[0], crtanswer1:correctAnswers[0],
            //                         question2:choosenQuestions[1], useranswer2:userAnswers[1], crtanswer2:correctAnswers[1],
            //                         question3:choosenQuestions[2], useranswer3:userAnswers[2], crtanswer3:correctAnswers[2],
            //                         question4:choosenQuestions[3], useranswer4:userAnswers[3], crtanswer4:correctAnswers[3],
            //                         question5:choosenQuestions[4], useranswer5:userAnswers[4], crtanswer5:correctAnswers[4],
            //                         question6:choosenQuestions[5], useranswer6:userAnswers[5], crtanswer6:correctAnswers[5]});
        }
    }
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
            questions:choosenQuestions,
            answers: userAnswers
        }).then(()=>{
            console.log("user updated successfully");
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
            //Creat and write file
            let fs = require('fs');
            let content = '\n' + '\n' + "Name: " + userName + " Gender: " + userGender + " Age: " + userAge + " Country: " + userCountry + " Education: " + userEdu;
            let text = "";
            for (let i = 0; i < choosenQuestions.length; i++) {
                let num = i+1;
                text += "Q" + num + ": " + choosenQuestions[i] + "\n";
                text += "User Answer: " +userAnswers[i] + "\n";
                text += "Correct Answer: " + correctAnswers[i] + "\n";
            }
            content += text;
            if(writeFileNo === 0){
                fs.appendFile('user_data.txt', content, function (err) {
                if (err) throw err;
                writeFileNo+=1;
            });}
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
    var wifiORdata = req.body.wifiVSdata;
    var userGoogle = req.body.google;
    var userAssistance = req.body.assistance;
    var userActivities = req.body.activities;

    db.collection('users').doc(userName).update({
        wifiordata:req.body.wifiVSdata,
        userGoogle : req.body.google,
        userAssistance : req.body.assistance,
        userActivities : req.body.activities
    }).then(()=>{
        console.log("user updated again successfully");
    })

    // console.log(wifiORdata, userGoogle, userAssistance, userActivities);
    res.redirect("/answers");
});

app.post("/DLsurveyU",(req,res)=>{
    // console.log(req.body);
    var wifiORdata = req.body.wifiVSdata;
    var userGoogle = req.body.google;
    var userAssistance = req.body.assistance;
    var userActivities = req.body.activities;

    // console.log(wifiORdata, userGoogle, userAssistance, userActivities);
    res.redirect("/answersU");
});




app.listen(3000,()=>{
    console.log("Server has started on port 3000");
});
