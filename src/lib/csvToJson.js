export function csvToJson(csv, delimeter){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(delimeter);

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(delimeter);

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

export function csvToKeyValue(csv, delimeter){
  var lines=csv.split("\n");

  var result = {};

  for(var i=1;i<lines.length;i++){


    var currentline=lines[i].split(delimeter);

    result [ lines[1] ] = result [ lines[0] ];

  }

  return result; //JavaScript object
}
