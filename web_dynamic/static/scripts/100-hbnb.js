$(document).ready(function () {
  const amenities = {};
  const states = {};
  const cities = {};
  let places = {};

  // Initial setup
  $('.amenities input[type="checkbox"]').prop('checked', false);
  $('.container .filters h2 input[type="checkbox"]').prop('checked', false);
  $('.container .filters .popover li input[type="checkbox"]').prop('checked', false);
  $('#api_status').addClass('not_available');

  // Click event handler for state checkboxes
  $('.container .filters h2 input[type="checkbox"]').click(function () {
    const select = '.' + $(this).attr('data-id');
    if ($(this).prop('checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
      $(select).prop('checked', true);
    } else {
      $(select).prop('checked', false);
      delete states[$(this).attr('data-id')];
    }
    updateLocations();
  });

  // Click event handler for city checkboxes
  $('.container .filters .locations .popover li input[type="checkbox"]').click(function () {
    if ($(this).prop('checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    updateLocations();
  });

  // Click event handler for amenities checkboxes
  $('.amenities input[type="checkbox"]').click(function () {
    if ($(this).prop('checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    updateAmenities();
  });

  // AJAX request for API status
  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: function (data) {
      $('#api_status').toggleClass('available', data.status === 'OK');
      $('#api_status').toggleClass('not_available', data.status !== 'OK');
    }
  });

  // Click event handler for search button
  $('.container .filters button').click(function () {
    searchPlaces.amenities = Object.keys(amenities);
    searchPlaces.states = Object.keys(states);
    searchPlaces.cities = Object.keys(cities);

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: JSON.stringify(searchPlaces),
      success: function (data) {
        renderPlaces(data);
      }
    });
  });

  // Initial AJAX request for places
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    data: '{}',
    success: function (data) {
      renderPlaces(data);
    }
  });

  // Update amenities display
  function updateAmenities () {
    $('.amenities H4').text(Object.values(amenities).join(', '));
  }

  // Update locations display
  function updateLocations () {
    const locations = Object.values(states).concat(Object.values(cities));
    $('.locations H4').text(locations.join(', '));
  }

  // Render places
  function renderPlaces (data) {
    places = data;
    $('.places').empty();
    places.forEach((place) => {
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
                </article>`;
      $('.places').append(html);
    });
  }
});
