$(document).ready(function () {
  console.log('entre');

  const amenities = {};
  const $amenitiesHeader = $('.amenities H4');

  $('input[type="checkbox"]').click(function () {
    const $checkbox = $(this);
    const id = $checkbox.attr('data-id');
    const name = $checkbox.attr('data-name');

    if ($checkbox.prop('checked')) {
      amenities[id] = name;
    } else {
      delete amenities[id];
    }

    updateAmenitiesHeader();
  });

  function updateAmenitiesHeader () {
    $amenitiesHeader.text(Object.values(amenities).join(', '));
  }
});
