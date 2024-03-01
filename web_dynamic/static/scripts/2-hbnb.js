$(document).ready(function () {
  const amenities = {};
  const $apiStatus = $('#api_status');
  const $amenitiesHeader = $('.amenities H4');

  $apiStatus.addClass('not_available');

  $('input[type="checkbox"]').click(function () {
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

  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/status/'
  }).done(data => {
    $apiStatus.toggleClass('available', data.status === 'OK');
    $apiStatus.toggleClass('not_available', data.status !== 'OK');
  }).fail(() => {
    $apiStatus.addClass('not_available');
  });

  function updateAmenitiesHeader() {
    let amenitiesText = '';
    let count = 0;

    for (const value of Object.values(amenities)) {
      if (count > 0) {
        amenitiesText += ', ';
      }
      amenitiesText += value;
      count++;
    }

    $amenitiesHeader.text(amenitiesText);
  }
});
