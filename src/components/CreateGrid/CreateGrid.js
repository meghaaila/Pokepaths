import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DataTable from "../DataTable/DataTable";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'auto auto'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return ['Set grid length', 'Number of impassable squares', 'Coordinates of impassable squares','Start square position', 'End square position'];
}



export default function CreateGrid() {
  const classes = useStyles();
  const [flag, setFlag] = React.useState(true)
  const [activeStep, setActiveStep] = React.useState(0);
  const [sideLength, setGridLength] = React.useState(0);
  const [numberOfImpassables, setNumberOfImpassables] = React.useState(0);
  const [impassables, setImpassables] = React.useState([]);
  const [startingLoc, setStart] = React.useState({});
  const [endingLoc, setEnd] = React.useState({});
  const [moves, setMoves] = React.useState([]);
  const steps = getSteps();

  const handleChange = (e) => {
    //console.log(gridValues);
    let pos;
    switch (activeStep) {
      case 0 : return setGridLength(parseInt(e.target.value));
      case 1: return setNumberOfImpassables(e.target.value);
      case 2: pos = e.target.value.split(' ');
      return setImpassables((prevState) => [...prevState, {x: parseInt(pos[0]), y: parseInt(pos[1]) }])
      case 3: pos = e.target.value.split(' ');
      return setStart(() => ({x: parseInt(pos[0]), y: parseInt(pos[1]) }))
      case 4: pos = e.target.value.split(' ');
      return setEnd(() => ({x: parseInt(pos[0]), y: parseInt(pos[1]) }))
    }
  }

  const handleNext = () => {
    if(activeStep == 4){
      const params = {
        sideLength : sideLength, 
        impassables: impassables, 
        startingLoc:startingLoc,
        endingLoc:endingLoc
      };
      setFlag(false);
      axios.post('https://frozen-reef-96768.herokuapp.com/find-path', params).then(res => {
        //console.log(res)
        setMoves(res.data.moves);
       // console.log(moves)
        setFlag(true)
      })
       .catch((error) => {
         console.error(error);
       });

    }
    else
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const setImpassablesTag = () => {
    const squares =[];
    for(let i=0;i<parseInt(numberOfImpassables);i++){
      squares.push(<div>
        <TextField id={"impass"+i} name="setImpassables" label="Position X Y" type="text" onBlur= {handleChange}/>
        </div>)
    }
    return squares;
  }

  const getStepContent = (step) =>{
  switch (step) {
    case 0:
      return  <TextField id="sideLength" label="Grid length" type="number" value ={sideLength} onChange = {handleChange}/>;
    case 1:
      return <TextField id="numberOfImpassables" label="Impassable squares" value ={numberOfImpassables} type="number" onChange = {handleChange}/>
    case 2:
      return <div>{setImpassablesTag()}</div>

    case 3:
      return <div>
        <TextField id="startingLoc" label="Position X Y" type="text" onBlur= {handleChange}/>
        </div>
    case 4:
      return <div>
        <TextField id="endingLoc" label="Position X Y" type="text" onBlur = {handleChange}/>
        </div>
  }
}


  return (
    <div className={classes.root}>
      <div>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
      {flag && <DataTable sideLength={sideLength} impassables= {impassables} numberOfImpassables={numberOfImpassables}
      startingLoc = {startingLoc} endingLoc={endingLoc} step={activeStep} moves={moves}/>}
    </div>
  );
}
