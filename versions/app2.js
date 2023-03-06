//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require("lodash");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let nextCount = 0;
let score = 0;
let correctAnswers = [];
let choosenQuestions = [];
let userAnswers = [];
let isStarted = false;
let randomNumList = []; //so same questions in Eng/Urdu is not given to same user
let userName = "userName";
let userGender = "userGender";
let writeFileNo = 0;

const fs = require('fs');
var text = fs.readFileSync("eng_CRTqs.txt", 'utf-8');
let engQuestionBank = text.split('\n')

text = fs.readFileSync("eng_correct_ans.txt", 'utf-8');
let engAnswersBank = text.split('\n')

text = fs.readFileSync("urdu_CRTqs.txt", 'utf-8');
let urduQuestionBank = text.split('\n')

text = fs.readFileSync("urdu_correct_ans.txt", 'utf-8');
let urduAnswersBank = text.split('\n')

function updateQuestions(questionArr,answerArr){
    let randomFound = false;
    let randomnumber = 0;
    if(randomNumList.length === 0)
    {
        randomnumber = Math.floor((Math.random() * questionArr.length));
    }
    else{
        while (1) { //while rnadom numbe is not unique CODE
            // console.log("Hereeeee")
            randomFound = false;
            randomnumber = Math.floor((Math.random() * questionArr.length));
            for (let i = 0; i < randomNumList.length; i++) {
                if(randomNumList[i] === randomnumber)
                {
                    randomFound = true;
                }
            }
            if(!randomFound)
            {
                break;
            }
        }
    }
    
    randomNumList.push(randomnumber); //when unique found

    let question = questionArr[randomnumber];
    let answer = answerArr[randomnumber];

    choosenQuestions.push(question);
    correctAnswers.push(answer);
    // console.log(choosenQuestions, answer);
    return question;
}

app.get("/home",(req,res)=>{
    res.render("home");
    // console.log(document.querySelectorAll(".button").length);
});

app.get("/",(req,res)=>{
    res.render("setting");
    // console.log(document.querySelectorAll(".button").length);
});

app.post("/",(req,res)=>{
    // console.log(req.body);
    let Name = req.body.Name;
    let gender = req.body.gender;
    userName = Name;
    userGender = gender;
    res.redirecst("/home");
    console.log(Name,gender);
})

app.get("/questions",(req,res)=>{
    // const questionnumber = req.params.questionnumber;
    // console.log(questionnumber);
    if(!isStarted){
        // console.log("this is the first time the game has started")
        let questiontodisplaybydefault = updateQuestions(engQuestionBank, engAnswersBank);
        isStarted = true;
        res.render("questions", {question:questiontodisplaybydefault});
    }
    else{
        // console.log("this is not the first time");
        nextCount+=1;
        // console.log("this is the next count",nextCount);
        if(nextCount === 1 || nextCount === 2){
            let questiontodisplaybydefault = updateQuestions(engQuestionBank, engAnswersBank);
            res.render("questions", {question:questiontodisplaybydefault});
        }
        else if (nextCount === 3 || nextCount === 4 || nextCount === 5){
            let questiontodisplaybydefault = updateQuestions(urduQuestionBank, urduAnswersBank);
            res.render("questions", {question:questiontodisplaybydefault});
        }
        else {
            //Creat and write file
            let fs = require('fs');
            let content = '\n' + '\n' + "Name: " + userName + " Gender: " + userGender + '\n';
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

            res.render("answers",{question1:choosenQuestions[0], useranswer1:userAnswers[0], crtanswer1:correctAnswers[0],
                                    question2:choosenQuestions[1], useranswer2:userAnswers[1], crtanswer2:correctAnswers[1],
                                    question3:choosenQuestions[2], useranswer3:userAnswers[2], crtanswer3:correctAnswers[2],
                                    question4:choosenQuestions[3], useranswer4:userAnswers[3], crtanswer4:correctAnswers[3],
                                    question5:choosenQuestions[4], useranswer5:userAnswers[4], crtanswer5:correctAnswers[4],
                                    question6:choosenQuestions[5], useranswer6:userAnswers[5], crtanswer6:correctAnswers[5]});
        }
    }
});

app.post("/questions",(req,res)=>{
    let answer = req.body.answer;
    userAnswers.push(answer);
    // score+=1;
    // console.log(userAnswers);
    res.redirect("/questions");
    // let questiontodisplay = updateQuestions(nextCount,score,randomnumber,)
})

app.get("/scores",(req,res)=>{
    res.render("scores",{Score:score});
})

app.get("/settings",(req,res)=>{
    res.render("setting");
})

app.get("/answers",(req,res)=>{
    res.render("answers");
})

app.listen(3000,()=>{
    // console.log("Server has started on port 3000");
});
