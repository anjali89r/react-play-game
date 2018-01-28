import React from 'react';
import './App.css';
import _ from 'lodash'
//import Person from './Person/Person';

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {
  return (
    <div className="col-5">
     {_.range(props.randomNumberOfStars).map(i =>
     	<i key={i} className="fa fa-star"></i>
     )}
    </div>
  );
};

const Button = (props) => {
	let button;
  switch(props.answerIsCorrect) {
  	case true:
    	button =
        <button className="btn btn-success" onClick={props.acceptAnswer}>
          <i className="fa fa-check"></i>
        </button>;
      break;
  	case false:
    	button =
        <button className="btn btn-danger">
          <i className="fa fa-times"></i>
        </button>;
      break;
  	default:
    	button =
        <button className="btn"
        				onClick={props.checkAnswer}
        				disabled={props.selectedNum.length === 0}>
          =
        </button>;
      break;
  }
  return (
    <div className="col-2 text-center">
      {button}
      <br/>
     <button className="btn btn-warning btn-sm refresh" onClick={props.redraw} disabled={props.redraws===0}>{props.redraws} <i className="fa fa-refresh"></i></button>

    </div>

  );
};

const Answer = (props) => {
  return (
    <div className="col-5">
      {props.selectedNum.map((num,i)=>
      	<span key={i} onClick={() => props.unselectNumber(num)}>{num}</span>
      )}
    </div>
  );
};

const Numbers = (props) => {
	const numClassName = (num)=>{
  	if(props.usedNum.indexOf(num) >= 0){
    	return 'used';
    }
    if(props.selectedNum.indexOf(num) >= 0){
    	return 'selected';
    }
  }
  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((num,i)=>
        <span key={i} onClick={()=>props.onSelectNum(num)} className={numClassName(num)}>{num}</span>
        )}
      </div>
    </div>
  );
};
Numbers.list = _.range(1,10);

const DoneStatus = (props) => {
	return(<div className="text-center">
  	<div>{props.doneStatus}</div>
      <button className="btn btn-success text-center" onClick={props.resetGame}>Play Again</button>

    </div>
  );
};
class Game extends React.Component {
	static initialState = () => ({
  	selectedNum: [],
    numberOfStars : 1+Math.floor(Math.random()*9),
    answerIsCorrect: null,
    usedNum: [],
    redraws: 5,
    doneStatus: null,
  });
  state = Game.initialState();
  resetGame = () => this.setState(Game.initialState());
   selectNum = (num)=>{
   if(this.state.selectedNum.indexOf(num) >= 0){return;}
  	this.setState(prevState =>({
    answerIsCorrect: null,
    	selectedNum: prevState.selectedNum.concat(num)
    }))
  }
  unselectNumber = (clickedNumber) => {
    this.setState(prevState => ({
    answerIsCorrect: null,

      selectedNum: prevState.selectedNum
                                .filter(number => number !== clickedNumber)
    }));
  };
  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.numberOfStars ===
      	prevState.selectedNum.reduce((acc, n) => acc + n, 0)
    }));
  };

  acceptAnswer = ()=>{
  	this.setState(prevState=>({
    	usedNum: prevState.usedNum.concat(prevState.selectedNum),
      selectedNum:[],
      numberOfStars : 1+Math.floor(Math.random()*9),
       answerIsCorrect: null

    }), this.updateDoneStatus)
  }
  redraw = ()=>{
  if(this.state.redraws === 0){return;}
  	this.setState(prevState=>({
    	numberOfStars : 1+Math.floor(Math.random()*9),
      answerIsCorrect: null,
      selectedNum:[],
      redraws: prevState.redraws-1,
    }),this.updateDoneStatus)
  }
  possibleSolutions = ({numberOfStars, usedNum}) => {
    const possibleNumbers = _.range(1,10).filter(num =>{
      return usedNum.indexOf(num) === -1
    })
   return possibleCombinationSum(possibleNumbers, numberOfStars)
  }

  updateDoneStatus = () => {
    this.setState(prevState => {
      if(prevState.usedNum.length === 9 || !this.possibleSolutions(prevState)){
        return {
          doneStatus: 'Great job!'
        }
      }
      if (prevState.redraws === 0 && !this.possibleSolutions(prevState)){
        return{
          doneStatus: 'Game Over!'
        }
      }
    })
  }

  render() {
    return (
      <div className="container">
        <h3>Play </h3>
        <hr />
        <div className="row">
          <Stars randomNumberOfStars={this.state.numberOfStars} />
          <Button selectedNum={this.state.selectedNum} checkAnswer={this.checkAnswer} 				 answerIsCorrect={this.state.answerIsCorrect} acceptAnswer={this.acceptAnswer} redraws={this.state.redraws} redraw={this.redraw}/>
          <Answer selectedNum={this.state.selectedNum} unselectNumber={this.unselectNumber} />
        </div>
        <br /><br/>
        {this.state.doneStatus ? <DoneStatus doneStatus={this.state.doneStatus} resetGame={this.resetGame}/> :
        		 <Numbers selectedNum={this.state.selectedNum} onSelectNum={this.selectNum} usedNum={this.state.usedNum}/>
          }


      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Game />
      </div>
    );
  }
}

export default App;
