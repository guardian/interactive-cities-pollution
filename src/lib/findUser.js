import madlib from '../lib/madlib'
import sendEvent from '../lib/event'
import geocode from '../lib/geocode'
import distance from '../lib/distance'
import toTitleCase from '../lib/toTitleCase'
import awesomeplete from 'awesomplete'


export default function (cities) {

    var listeners = [];
		var userLocationEl = document.querySelector('.js-gps');

    window.addEventListener('show-force', evt => {
        document.querySelector('.placeholder').style.display = 'none';
        document.querySelector('.data').style.display = 'block';
    });



		/* AUTO COMPLETE FUNCTIONALITY */

		var input = document.getElementById("awesomeplete_input");
		var awesomplete = new Awesomplete(input, {

		  autoFirst: true
		});
		awesomplete.list = ["China", "India", "Japan", "Russia", "UK", "USA"];




    /* AUTO FIND FUNCTIONALITY */

    //get user location via browser lat/long
    madlib(document.querySelector('.js-postcode'), loc => {

        geocode(loc, (err, resp) => {
            if (!err) {
                var center = resp.features[0].center;
                sendEvent('location', {'latlng': [center[1], center[0]]});
            }
        });

    });

    //turn on the auto locate button if available
    if ('geolocation' in navigator) {
        userLocationEl.style.display = 'block';
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


        console.log(rankedCities[0])
        updateListeners(rankedCities[0].city);
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
