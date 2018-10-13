$(document).ready(function () {
  $(".height-100").height($(window).height());
  $(window).resize(function () {
    $(".height-100").height($(window).height());
  });
});
