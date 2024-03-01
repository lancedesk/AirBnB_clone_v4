$(document).ready(function () {
    const amenities = {};
    let places = {};
    const searchPlaces = {};

    // Cache DOM elements
    const $apiStatus = $('#api_status');
    const $amenitiesHeader = $('.amenities H4');
    const $placesContainer = $('.places');
    const $checkboxes = $('input[type="checkbox"]');

    // Initialize checkboxes
    $checkboxes.prop('checked', false);

    // Toggle amenities
    $checkboxes.click(function () {
        const $checkbox = $(this);
        const dataId = $checkbox.attr('data-id');
        const dataName = $checkbox.attr('data-name');

        if ($checkbox.prop('checked')) {
            amenities[dataId] = dataName;
        } else {
            delete amenities[dataId];
        }

        updateAmenitiesHeader();
    });

    // Update amenities header
    function updateAmenitiesHeader() {
        $amenitiesHeader.text(Object.values(amenities).join(', '));
    }

    // Fetch API status
    $.ajax({
        type: 'GET',
        url: 'http://0.0.0.0:5001/api/v1/status/',
        success: function (data) {
            $apiStatus.toggleClass('available', data.status === 'OK');
            $apiStatus.toggleClass('not_available', data.status !== 'OK');
        },
        error: function () {
            $apiStatus.addClass('not_available');
        }
    });

    // Search button click handler
    $('.container .filters button').click(function () {
        searchPlaces.amenities = Object.keys(amenities);
        searchPlacesSearch();
    });

    // Initial places search
    searchPlacesSearch();

    // Perform places search
    function searchPlacesSearch() {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            url: 'http://0.0.0.0:5001/api/v1/places_search',
            data: JSON.stringify(searchPlaces),
            success: function (data) {
                places = data;
                renderPlaces();
            }
        });
    }

    // Render places
    function renderPlaces() {
        $placesContainer.empty();
        places.forEach(place => {
            const html = `
                <article>
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">
                            $${place.price_by_night}
                        </div>
                    </div>
                    <div class="information">
                        <div class="max_guest">
                            <i class="fa fa-users fa-3x" aria-hidden="true"></i>
                            <br />${place.max_guest} Guests
                        </div>
                        <div class="number_rooms">
                            <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
                            <br />${place.number_rooms} Bedrooms
                        </div>
                        <div class="number_bathrooms">
                            <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
                            <br />${place.number_bathrooms} Bathrooms
                        </div>
                    </div>
                    <div class="description">${place.description}</div>
                </article>
            `;
            $placesContainer.append(html);
        });
    }
});
