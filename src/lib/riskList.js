import riskCurveData from '../data/riskCurveData.json'

export default function() {

  let lineTypes = ['r', 'p', 'h', 'l', 's'];


  function setUserData(userData){

    document.querySelector('.riskTypesContainer').classList.add('active');

    console.log(userData)

    let currentPoint = riskCurveData.filter(function(d){
			return (d.PM25 === userData.PM25) ? true : false;
		})[0];

    console.log(currentPoint)

    lineTypes.forEach(type =>{

      document.querySelector(`.riskType.${type} .gv-high-num`).innerHTML = `${currentPoint[type]}%`

      let w =  Math.ceil( currentPoint[type] *2/100 );

      document.querySelector(`.riskType.${type} .gv-ratings-css-top`).setAttribute('data-total', w)

    })




  }



  return {
    setUserData: setUserData
  }
}
