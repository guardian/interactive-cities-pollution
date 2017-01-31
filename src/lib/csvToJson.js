export default function (csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split("\t");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split("\t");

	  for(var j=0;j<headers.length;j++){
      if(j > 1){
        obj[headers[j]] = Number(currentline[j]);
      } else {
        obj[headers[j]] = currentline[j];
      }
		  
	  }

    obj.cityId = j;

	  result.push(obj);

  }
  
  return result; //JavaScript object
  //return JSON.stringify(result); //JSON
}