import sendEvent from '../lib/event'
import geocode from '../lib/geocode'
import distance from '../lib/distance'
import toTitleCase from '../lib/toTitleCase'
import awesomeplete from 'awesomplete'


export default function (cities) {

    var listeners = [];
		var userLocationEl = document.querySelector('.js-gps');

    /* STANDFIRST BUTTON FUNCTIONALITY */
    var stBtns = document.querySelectorAll('.standfirst-button');

    [].forEach.call(stBtns, function(el) {
      el.addEventListener('click', e =>{

        let source = e.target || e.srcElement;
        let city = matchCity(source.getAttribute('data-city'));
        document.getElementById("awesomeplete_input").value = `${toTitleCase(city.city)}, ${city.country}`
        updateListeners(city);
      })
    });



		/* AUTO COMPLETE FUNCTIONALITY */
		//  https://www.sitepoint.com/javascript-autocomplete-widget-awesomplete/
		var input = document.getElementById("awesomeplete_input");
		var awesomplete = new Awesomplete(input, {
      list: cities,
		  autoFirst: true,
      minChars: 4,
      data: function (item, input) {
        return { label: `${toTitleCase(item.city)}, ${item.country}`, value: `${toTitleCase(item.city)}, ${item.country}` };
      }

		});

    // window.addEventListener('awesomplete-select', e => {
    //
    //   var city = matchCity(e.text.label)
    //   console.log('select', city)
    //   updateListeners(city);
    // })

    window.addEventListener('awesomplete-close', e => {
      //console.log(e)
      var city = matchCity(document.querySelector('.visually-hidden').innerHTML);


      document.getElementById("awesomeplete_input").value = `${toTitleCase(city.city)}, ${city.country}`
      console.log('close', city)
      updateListeners(city);
    })

    function matchCity (label){
      return cities.filter(c => {
        return (label == `${toTitleCase(c.city)}, ${c.country}`) ? true : false;
      })[0];
    }



    /* AUTO FIND FUNCTIONALITY */

    //get user location via browser lat/long
    var locateBtn = document.querySelector('.gv-locate-btn');
    locateBtn.addEventListener('click', loc => {
        locateBtn.setAttribute('data-focus', 'true');
        geocode(loc, (err, resp) => {
            if (!err) {
                var center = resp.features[0].center;
                sendEvent('location', {'latlng': [center[1], center[0]]});
            }
        });

    });

    //turn on the auto locate button if available
    if ('geolocation' in navigator) {
        userLocationEl.style.display = 'inline-block';
        userLocationEl.addEventListener('click', () => {
            userLocationEl.removeAttribute('data-has-error');
            userLocationEl.setAttribute('data-is-loading', '');

            navigator.geolocation.getCurrentPosition(function (position) {
                userLocationEl.removeAttribute('data-is-loading');
                sendEvent('location', {'latlng': [position.coords.latitude, position.coords.longitude]});

            }, function (err) {
                userLocationEl.removeAttribute('data-is-loading');
                userLocationEl.addAttribute('data-has-error', '');
            });

            userLocationEl.blur();

        });
    }

    //handle if the location event is returned
    window.addEventListener('location', evt => {

        var latlng = evt.detail.latlng;
        var rankedCities = cities
            .map(city => { return {city, 'distance': distance([city.lat, city.lon], latlng), 'name': toTitleCase(city.city) }; })
            .sort((a, b) => a.distance - b.distance);

        var city = rankedCities[0].city;
        var howFar = rankedCities[0].distance;

        document.getElementById("awesomeplete_input").value = `${toTitleCase(city.city)}, ${city.country}`
        updateListeners(city);
    });


    function registerListener(fn){
        listeners.push(fn);
    }

    function updateListeners(cityData){
        listeners.forEach(function(fn){
            fn(cityData)
        })
    }




    return {
        registerListener: registerListener
    }

}
