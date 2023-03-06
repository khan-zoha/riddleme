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

const fs = require('fs');
var text = fs.readFileSync("eng_CRTqs.txt", 'utf-8');
let engQuestionBank = text.split('\n')

text = fs.readFileSync("eng_correct_ans.txt", 'utf-8');
let engAnswersBank = text.split('\n')

text = fs.readFileSync("urdu_CRTqs.txt", 'utf-8');
let urduQuestionBank = text.split('\n')

text = fs.readFileSync("urdu_correct_ans.txt", 'utf-8');
let urduAnswersBank = text.split('\n')

function updateQuestions(questionnumber,questionArr,answerArr){
    let randomnumber = Math.floor((Math.random() * temparr.length));
    // var question= "";

//while rnadom numbe is not unique CODE
randomNumList.push(randomnumber); //when unique found

    // if (questionnumber === 1){
    let question = questionArr[randomnumber];
    let answer = answerArr[randomnumber];
    // }
    // else if (questionnumber === 2){
    //     question = temparr[randomnumber]; 
    // }
    // else if (questionnumber === 3){
    //     question = temparr[randomnumber];
    // }
    // else if (questionnumber === 4){
    //     question = temparr[randomnumber];
    // }
    // else if (questionnumber === 5){
    //     question = temparr[randomnumber];
    // }
    // else if (questionnumber === 6){
    //     question = temparr[randomnumber];
    // }

    choosenQuestions.push(question);
    correctAnswers.push(answer);
    console.log(choosenQuestions, answer);
    return question;
}

app.get("/",(req,res)=>{
    res.render("home");
    // console.log(document.querySelectorAll(".button").length);
});

app.get("/questions",(req,res)=>{
    const questionnumber = req.params.questionnumber;
    console.log(questionnumber);
    if(!isStarted){
        // console.log("this is the first time the game has started")
        let questiontodisplaybydefault = updateQuestions(1,engQuestionBank, engAnswersBank);
        isStarted = true;
        res.render("questions", {question:questiontodisplaybydefault});
    }
    else{
        console.log("this is not the first time");
        nextCount+=1;
        console.log("this is the next count",nextCount);
        if(nextCount === 1){
            let questiontodisplaybydefault = updateQuestions(2,engQuestionBank, engAnswersBank);
            res.render("questions", {question:questiontodisplaybydefault});
        }
        else if (nextCount === 2){
            let questiontodisplaybydefault = updateQuestions(3,engQuestionBank, engAnswersBank);
            res.render("questions", {question:questiontodisplaybydefault});
        }
        else if (nextCount === 3){
            let questiontodisplaybydefault = updateQuestions(4,urduQuestionBank, urduAnswersBank);
            res.render("questions", {question:questiontodisplaybydefault});
        }
        else if (nextCount === 4){
            let questiontodisplaybydefault = updateQuestions(5,urduQuestionBank, urduAnswersBank);
            res.render("questions", {question:questiontodisplaybydefault});
        }
        else if (nextCount === 5){
            let questiontodisplaybydefault = updateQuestions(6,urduQuestionBank, urduAnswersBank);
            res.render("questions", {question:questiontodisplaybydefault});
        }
        else {
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
    score+=1;
    console.log(userAnswers);
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

app.post("/settings",(req,res)=>{
    console.log(req.body);
    let Name = req.body.Name;
    let gender = req.body.gender;
    console.log(Name,gender);
})

app.listen(3000,()=>{
    console.log("Server has started on port 3000");
});
