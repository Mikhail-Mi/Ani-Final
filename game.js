import { getGoalsToWin } from "./setup";
let leftScore =0;
let rightScore =0;



function restartGame(){
    
}
function checkGoal(){

}
function checkWin(){
    if(leftScore=getGoalsToWin){
        return "left-won";
    }
    if(rightScore=getGoalsToWin){
        return "right-won";
    }
}