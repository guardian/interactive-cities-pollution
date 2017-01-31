
		/*
			.transition()
			.duration(function(){

				let type = this.getAttribute('id');
				let path = d3_select(`.riskLineUser.${type}`).node();

				let length = path.getTotalLength();

				return maxTime / length * 10000;
			})
			.attrTween("transform", function(){
				let type = this.getAttribute('id');
				let path = d3_select(`.riskLineUser.${type}`).node();

				return translateAlong(path)();

			});

			*/
			
			// circle.transition()
			//       .duration(10000)
			//       .attrTween("transform", translateAlong(path.node()))
			//       .each("end", transition);