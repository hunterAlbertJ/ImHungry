let lat;
let lng;


const CONFIGURATION = {
    "capabilities": { "search": true, "distances": true, "directions": true, "contacts": true, "atmospheres": true, "thumbnails": true },
    "pois": [
    ],
    "centerMarker": { "icon": "circle" },
    "mapRadius": 2000,
    "mapOptions": { "center": { "lat": 48.8773, "lng": 2.33 }, "fullscreenControl": true, "mapTypeControl": true, "streetViewControl": false, "zoom": 16, "zoomControl": true, "maxZoom": 20, "mapId": "" },
    "mapsApiKey": 'AIzaSyC4D7W7xaZpT9B83u9G8vqtIaHzCsTbbS4'
};

async function initMap() {
    var holder = await navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        lat = position.coords.latitude
        lng = position.coords.longitude
        CONFIGURATION.mapOptions.center.lat = lat;
        CONFIGURATION.mapOptions.center.lng = lng;
        console.log(CONFIGURATION.mapOptions.center.lat)

        initMap2(CONFIGURATION.mapOptions.center.lat, CONFIGURATION.mapOptions.center.lng, CONFIGURATION);

    });




}
let map;
let service;
let infowindow;

function initMap2(lat, lng, CONFIGURATION) {

    console.log(lat, lng)
    let poiArr = [];
    const sydney = new google.maps.LatLng(lat, lng);


    map = new google.maps.Map(document.getElementById("map"), {
        center: sydney,
        zoom: 15,
    });
    console.log(map)
    var request = {
        location: sydney,
        radius: '10000',
        type: ['supermarket']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
                poiArr[poiArr.length] = { "placeId": results[i].place_id }
            }
            console.log(poiArr)
            CONFIGURATION.pois = poiArr
            new NeighborhoodDiscovery(CONFIGURATION);
        }
    });
}
let div = document.getElementById('head');


let test2 = document.createElement("script");
test2.setAttribute('id', "nd-place-results-tmpl")
test2.setAttribute('type', "text/x-handlebars-template")

test2.innerHTML =
      `{{#each places}}
        <li class="place-result">
          <div class="text">
            <button class="name">{{name}}</button>
            <div class="info">
              {{#if rating}}
                <span>{{rating}}</span>
                <img src="https://fonts.gstatic.com/s/i/googlematerialicons/star/v15/24px.svg" alt="rating" class="star-icon"/>
              {{/if}}
              {{#if numReviews}}
                <span>&nbsp;({{numReviews}})</span>
              {{/if}}
              {{#if priceLevel}}
                &#183;&nbsp;<span>{{#each dollarSigns}}\${{/each}}&nbsp;</span>
              {{/if}}
            </div>
            <div class="info">{{type}}</div>
          </div>
          <button class="photo" style="background-image:url({{photos.0.urlSmall}})" aria-label="show photo in viewer"></button>
        </li>
      {{/each}}`;

      div.appendChild(test2)


   
let test3 = document.createElement("script");
test3.setAttribute('id', "nd-place-details-tmpl")
test3.setAttribute('type', "text/x-handlebars-template")

test3.innerHTML = `<div class="navbar">
        <button class="back-button">
          <img class="icon" src="https://fonts.gstatic.com/s/i/googlematerialicons/arrow_back/v11/24px.svg" alt="back"/>
          Back
        </button>
      </div>
      <header>
        <h2>{{name}}</h2>
        <div class="info">
          {{#if rating}}
            <span class="star-rating-numeric">{{rating}}</span>
            <span>
              {{#each fullStarIcons}}
                <img src="https://fonts.gstatic.com/s/i/googlematerialicons/star/v15/24px.svg" alt="full star" class="star-icon"/>
              {{/each}}
              {{#each halfStarIcons}}
                <img src="https://fonts.gstatic.com/s/i/googlematerialicons/star_half/v17/24px.svg" alt="half star" class="star-icon"/>
              {{/each}}
              {{#each emptyStarIcons}}
                <img src="https://fonts.gstatic.com/s/i/googlematerialicons/star_outline/v9/24px.svg" alt="empty star" class="star-icon"/>
              {{/each}}
            </span>
          {{/if}}
          {{#if numReviews}}
            <a href="{{url}}" target="_blank">{{numReviews}} reviews</a>
          {{else}}
            <a href="{{url}}" target="_blank">See on Google Maps</a>
          {{/if}}
          {{#if priceLevel}}
            &#183;
            <span class="price-dollars">
              {{#each dollarSigns}}\${{/each}}
            </span>
          {{/if}}
        </div>
        {{#if type}}
          <div class="info">{{type}}</div>
        {{/if}}
        {{#if duration}}
          <div class="info">
            <img src="https://fonts.gstatic.com/s/i/googlematerialicons/directions_car/v11/24px.svg" alt="car travel" class="travel-icon"/>
            <span>&nbsp;{{duration.text}}</span>
          </div>
        {{/if}}
      </header>
      <div class="section">
        {{#if address}}
          <div class="contact">
            <img src="https://fonts.gstatic.com/s/i/googlematerialicons/place/v10/24px.svg" alt="Address" class="icon"/>
            <div class="text">
              {{address}}
            </div>
          </div>
        {{/if}}
        {{#if website}}
          <div class="contact">
            <img src="https://fonts.gstatic.com/s/i/googlematerialicons/public/v10/24px.svg" alt="Website" class="icon"/>
            <div class="text">
              <a href="{{website}}" target="_blank">{{websiteDomain}}</a>
            </div>
          </div>
        {{/if}}
        {{#if phoneNumber}}
          <div class="contact">
            <img src="https://fonts.gstatic.com/s/i/googlematerialicons/phone/v10/24px.svg" alt="Phone number" class="icon"/>
            <div class="text">
              {{phoneNumber}}
            </div>
          </div>
        {{/if}}
        {{#if openingHours}}
          <div class="contact">
            <img src="https://fonts.gstatic.com/s/i/googlematerialicons/schedule/v12/24px.svg" alt="Opening hours" class="icon"/>
            <div class="text">
              {{#each openingHours}}
                <div>
                  <span class="weekday">{{days}}</span>
                  <span class="hours">{{hours}}</span>
                </div>
              {{/each}}
            </div>
          </div>
        {{/if}}
      </div>
      {{#if photos}}
        <div class="photos section">
          {{#each photos}}
            <button class="photo" style="background-image:url({{urlSmall}})" aria-label="show photo in viewer"></button>
          {{/each}}
        </div>
      {{/if}}
      {{#if reviews}}
        <div class="reviews section">
          <p class="attribution">Reviews by Google users</p>
          {{#each reviews}}
            <div class="review">
              <a class="reviewer-identity" href="{{author_url}}" target="_blank">
                <div class="reviewer-avatar" style="background-image:url({{profile_photo_url}})"></div>
                <div class="reviewer-name">{{author_name}}</div>
              </a>
              <div class="rating info">
                <span>
                  {{#each fullStarIcons}}
                    <img src="https://fonts.gstatic.com/s/i/googlematerialicons/star/v15/24px.svg" alt="full star" class="star-icon"/>
                  {{/each}}
                  {{#each halfStarIcons}}
                    <img src="https://fonts.gstatic.com/s/i/googlematerialicons/star_half/v17/24px.svg" alt="half star" class="star-icon"/>
                  {{/each}}
                  {{#each emptyStarIcons}}
                    <img src="https://fonts.gstatic.com/s/i/googlematerialicons/star_outline/v9/24px.svg" alt="empty star" class="star-icon"/>
                  {{/each}}
                </span>
                <span class="review-time">{{relative_time_description}}</span>
              </div>
              <div class="info">{{text}}</div>
            </div>
          {{/each}}
        </div>
      {{/if}}
      {{#if html_attributions}}
        <div class="section">
          {{#each html_attributions}}
            <p class="attribution">{{{this}}}</p>
          {{/each}}
        </div>
      {{/if}}`;
   

      div.appendChild(test3)



function addMap(){
  console.log('cross file sharing')
}

// export {addMap}