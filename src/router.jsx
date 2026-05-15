import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SignUp from './auth/SignUp';
import SignIn from './auth/SignIn';
import Quizes from './NavItem/Quizs/Quizes';
import SubCategory from './NavItem/Quizs/SubCategory';
import MainQuiz from './NavItem/Quizs/MainQuiz';
import QuizCard from './NavItem/Quizs/QuizCard';
import QuizQuestions from './NavItem/Quizs/QuizCard';
import QuizCreateForm from './NavItem/Quizs/QuizCreateForm';
import Home from './shared/Home/Home';
import Dashboard from './Dashboard/Dashboard';
import LiveQuizList from './LiveQuiz/LiveQuizList';
import LiveQuizLobby from './LiveQuiz/LiveQuizLobby';
import JoinQuiz from './LiveQuiz/JoinQuiz';
import LiveQuizPlay from './LiveQuiz/LiveQuizPlay';

const router = createBrowserRouter([
    {
        path:'/',
        Component:App,
        children:[
            {
                index:true,
                Component:Home,
            },
            {
                path:'login',
                Component:SignUp,
            },
            {
                path:'signIn',
                Component:SignIn,
            },
            {
                path:'quizzes',
                Component:Quizes,
            },
            {
                path:'quizzes/:Category',
                Component:SubCategory,
            },
            {
                path:'quizzes/:Category/:subCategory',
                Component:MainQuiz,
            },
            {
                path:'quizzes/quizCard/:id',
                Component:QuizQuestions
            },
            {
                path:'addQuiz',
                Component:QuizCreateForm,
            },
            {
                path:'live-quiz',
                Component:LiveQuizList,
            },
            {
                path:'live-quiz/lobby',
                Component:LiveQuizLobby,
            },
            {
                path:'live-quiz/join',
                Component:JoinQuiz
            },
            {
                path:'/live-quiz/play/:roomId',
                Component:LiveQuizPlay,
            }
        ]
    },
    {
        path:'/dashboard',
        Component:Dashboard,
    }
])
export default router;