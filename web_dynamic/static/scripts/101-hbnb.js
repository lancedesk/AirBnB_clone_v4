const checkedAmenities = {};
const checkedStates = {};
const checkedCities = {};

$(document).ready(function () {
    $('div.amenities input[type="checkbox"]').on('change', function () {
        updateCheckedValues(checkedAmenities, $(this));
    });

    $('div.locations input[type="checkbox"]').on('change', function () {
        const isChecked = $(this).is(':checked');
        const id = $(this).data('id');
        const name = $(this).data('name');

        if ($(this).parent().prop('tagName') === 'LI') {
            updateCheckedValues(checkedCities, $(this));
        } else {
            updateCheckedValues(checkedStates, $(this));
        }

        updateLocationsDisplay();
    });

    const url = 'http://localhost:5001/api/v1/status/';
    $.ajax({ 
        url,
        method: 'GET',
    }).done(function (data) {
        if (data.status === 'OK') {
            $('div#api_status').addClass('available');
            $('button').on('click', getPlaces);
            getPlaces();
        }
    });
});

function updateCheckedValues(checkedItems, checkbox) {
    const id = checkbox.data('id');
    const name = checkbox.data('name');
    const isChecked = checkbox.is(':checked');

    if (isChecked) {
        checkedItems[name] = id;
    } else {
        delete checkedItems[name];
    }
}

function updateLocationsDisplay() {
    const locations = Object.keys(checkedStates).join(', ') +
        Object.keys(checkedCities).join(', ');
    if (locations) {
        $('div.locations h4').text(locations);
    } else {
        $('div.locations h4').html('&nbsp;');
    }
}

function getPlaces() {
    const amenities = Object.values(checkedAmenities);
    const states = Object.values(checkedStates);
    const cities = Object.values(checkedCities);

    $.ajax({
        url: 'http://localhost:5001/api/v1/places_search',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ amenities, states, cities }),
    }).done(function (places) {
        renderPlaces(places);
    }).fail(function (error) {
        console.error('Failed to fetch places:', error);
    });
}

function renderPlaces(places) {
    const placesList = $('.places-list');
    placesList.empty();

    places.forEach(place => {
        placesList.append(buildPlaceHTML(place));
    });
}

function buildPlaceHTML(place) {
    return `
        <article>
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
            <div class="information">
                <div class="max_guest">${place.max_guest} Guests</div>
                <div class="number_rooms">${place.number_rooms} Bedroom</div>
                <div class="number_bathrooms">
                    ${place.number_bathrooms} Bathroom
                </div>
            </div>
            <div class="user">
                <p><span>Owner:</span> ${place.owner}</p>
            </div>
            <div class="description">
                <p>${place.description}</p>
            </div>
        </article>`;
}
