import React from 'react';
import "./DataTable.css";

const allSigns = {
  'D' : '|',
  'R' : '_',
  'U' : '|',
  'L' : '_'
  
}
const allMoves = []
export default class DataTable extends React.Component {
  constructor(props){
    super(props);
  }

  setMoves = () => {
    var visitedNodes = this.props.startingLoc;
    this.props.moves.map((val) => {
      let temp = {};
      if(val == 'D' && visitedNodes != {}){
        temp = {x: parseInt(visitedNodes.x)+1, y: parseInt(visitedNodes.y)};
      }
       else if (val == 'R' && visitedNodes != {})
        temp = {x: parseInt(visitedNodes.x), y: parseInt(visitedNodes.y)+1};
      visitedNodes= temp;
      if(allMoves.filter(pos => pos.x == temp.x && pos.y == temp.y).length == 0)
        allMoves.push({...temp, sign:allSigns[val]});
    })
  }
  
   setSigns = (row, col) => {
    if(this.props.impassables  && this.props.impassables.filter((val) => val.x == row && val.y == col).length > 0)
      return 'X'
     if(this.props.startingLoc && row == this.props.startingLoc.x && col == this.props.startingLoc.y)
      return 'S'
    if(this.props.endingLoc && row == this.props.endingLoc.x && col == this.props.endingLoc.y)
      return 'E';
     if(allMoves  && allMoves.filter((val) => val.x == row && val.y == col).length > 0)
      return allMoves.filter((val) => val.x == row && val.y == col)[0].sign
    

  }
 
  renderRows = (sideLength,step) => {
    if(this.props.moves.length !=0 )this.setMoves();
    const grid = [];
    for (let row = 0; row < sideLength; row++) {
      const currentRow = [];
      for (let col = 0; col < sideLength; col++) {
        currentRow.push(<td row = {row} col={col} key={row+''+col} >{this.setSigns(row, col)}</td>);
      } 
        grid.push(<tr key={row}>{currentRow}</tr>);
    }
    return grid;
  }
  shouldComponentUpdate(nextProps){
    return nextProps.moves.length === 0;
  }
  render() {
    return (
      <div style={{ width: '100%' }}>
        <table>
          <tbody>
            {this.renderRows(this.props.sideLength, this.props.step)}
          </tbody>
        </table>
      </div>
    );
  }
  
}
