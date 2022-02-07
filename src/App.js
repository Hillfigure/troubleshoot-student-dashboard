import './App.css';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryGroup} from 'victory';
import csvData from "./wincdata.csv";
import { useEffect, useState } from 'react';
import { csv, style } from 'd3';

const App = () => {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nameList, setNameList] = useState(null);

  useEffect( () => { 
    setIsLoading(false);
    const getData = () => {csv(csvData).then((response) => {
        const cleanedData = response.map(row => {
          return {
              ...row,
              difficulty: +row.difficulty,
              funFactor: +row.funFactor,
          }
      })  
      setData(cleanedData)
      })
    }
    getData();
  }, [])


  // getAverage directly called in victorychart to test. That works
  const getAverage = () => {
    if(data){
      const grouped = data.reduce((acc, obj) => {
        let key = obj["assignment"]
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(obj)
        return acc
      }, {})
      const averages = []
      for (const assigment in grouped) {
        const {totalDiff, totalFun} = grouped[assigment].reduce((total, obj) => {
          
          total.totalDiff += obj.difficulty
          total.totalFun += obj.funFactor

          return total

        }, {totalDiff: 0, totalFun: 0})

        const averageDiff = Math.round(((totalDiff / grouped[assigment].length) + Number.EPSILON) * 100) / 100
        const averageFun = Math.round(((totalFun / grouped[assigment].length) + Number.EPSILON) * 100) / 100
        averages.push({ assignment: assigment, difficulty: averageDiff, funFactor: averageFun })
      }
      return averages;
    }
  }

  // const getStudent = (student) => {
  //   if(data){
  //     console.log(data)
  //   return data.filter((item) => item.name === student)
  //   }
  // }

  // PRINT NAMELIST
  const getNames = () => {
    const names = []
    if(data){
        data.map((student) => {
        if(!names.find(item => item === student.name)) {
          names.push(student.name)
        }
      }) 
      setNameList(names)
    }
  }

  // PREVENT RENDERLOOP
  if(!nameList){
    getNames();
  }

  return (
    <div className="App">
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={15}
        height={500}
        width={1000}
      >
        <VictoryLabel
          text={`Student Data`}
          textAnchor="middle"
          x={230}
          y={15}
        />
        <VictoryAxis 
          tickLabelComponent={<VictoryLabel angle={90}/>}
        />
        <VictoryAxis
          dependentAxis
        />
        <VictoryGroup offset={4}>
        <VictoryBar
          data={getAverage()}
          x="assignment"
          y="difficulty"
          className={style.visible}
        />
        <VictoryBar
          data={getAverage()}
          x="assignment"
          y="funFactor"
          className={style.visible}
        />
        </VictoryGroup>
      </VictoryChart>




      {/* THIS WORKS */}
      {!nameList && isLoading ? "Loading" : nameList}
      {/* THIS SAYS: NAMELIST=NULL */}
      {nameList.map(student => console.log(student))}



      <h1>useEffect on Plural</h1>
    </div>
  );
}

export default App;