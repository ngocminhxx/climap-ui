
$('.ui.dropdown').dropdown();

$('.ui.checkbox').checkbox();

$('.circle-weekday')
  .popup({
    on: 'hover'
  })
  ;

$(document).ready(function () {
  $(".height-100").height($(window).height());
  $(window).resize(function () {
    $(".height-100").height($(window).height());
  });
});

$('.container-scroll').mousewheel(function (e, delta) {
  $(this).scrollLeft(this.scrollLeft + (-delta * 40));
  e.preventDefault();
});