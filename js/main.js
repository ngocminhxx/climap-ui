/*
 *
 * ----------------------------------------------- */
var isMobile = false;

$(function () {
  var breakpoint = 768;
  updateIsMobile();

  $(window).on('resize load', function () {
    updateIsMobile()
  });

  function updateIsMobile() {
    isMobile = $(window).width() < breakpoint;
  }
});


/*
 *
 * ----------------------------------------------- */
// $(function () {
//   var reSmooth = /^#sm-/;
//   var id;
//
//   $(window).on('load', function () {
//     if (reSmooth.test(location.hash)) {
//       id = '#' + location.hash.replace(reSmooth, '');
//
//       $.smoothScroll({
//         scrollTarget: id,
//         offset: -85
//       });
//     }
//   });
// });


/*
 *
 * ----------------------------------------------- */
// jQuery Smooth Scroll - v2.2.0 - 2017-05-05
// https://github.com/kswedberg/jquery-smooth-scroll
// $(function () {
//   $('[data-sm]').smoothScroll({
//     offset: -10,
//     beforeScroll: function(e) {
//       var scrollTarget = e.scrollTarget;
//
//       if (scrollTarget === '#form-title') {
//         if (isMobile) {
//           e.offset = -20;
//         } else {
//           e.offset = -30;
//         }
//       } else if (scrollTarget === '#section-media') {
//         e.offset = -10;
//       }
//     }
//   });
// });


/*
 *
 * ----------------------------------------------- */
// jQuery Validation Plugin
// https://jqueryvalidation.org/
// $(function () {
//   $('.container-form').validate({
//     rules: {
//       '問い合わせ内容': {
//         required: true
//       }
//     },
//     messages: {
//       '問い合わせ内容': {
//         required: "必須項目です。"
//       }
//     },
//     groups: {
//       username: "郵便番号1 郵便番号2"
//     },
//     errorPlacement: function (error, element) {
//       var $container = element.parents('tr').find('.error-container');
//
//       if (element.attr("name") === "問い合わせ内容") {
//         error.appendTo($container);
//       } else if (element.attr("name") === "郵便番号1" || element.attr("name") === "郵便番号2") {
//         error.appendTo($container);
//       } else {
//         error.insertAfter(element);
//       }
//     },
//     highlight: function (element) {
//       if (!($(element).hasClass('optional') && $(element).is(':blank'))) {
//         $(element).closest('.form-group').addClass('has-error');
//       }
//     },
//     unhighlight: function (element) {
//       if (!($(element).hasClass('optional') && $(element).is(':blank'))) {
//         $(element).closest('.form-group').removeClass('has-error');
//       }
//     }
//   });
//
//   $.validator.addMethod("custom-email", function (value, element) {
//     var emailArray = value.split('@');
//     // preg_match("/^[\.!#%&\-_0-9a-zA-Z\?\/\+]+\@[!#%&\-_0-9a-z]+(\.[!#%&\-_0-9a-z]+)+$/", "$str") && count($mailaddress_array) ==2
//
//     return this.optional(element) || (/^[\.!#%&\-_0-9a-zA-Z\?\/\+]+\@[!#%&\-_0-9a-z]+(\.[!#%&\-_0-9a-z]+)+$/.test(value) && emailArray.length === 2);
//   }, "正しいメールアドレスを入力して下さい。");
// });


/*
 * collapse animation for navbar dropdown
 * ----------------------------------------------- */
$(function () {
  if (isMobile) {
    $('[data-toggle-touch="collapse"]').on('touchstart', function (e) {
      $(this).parent().toggleClass('open-dropdown-xs').children('.collapse').collapse('toggle');

      e.preventDefault();
    });
  } else {
    $('[data-toggle-hover="collapse"]').parent().hover(
      function () {
        var $this = $(this);

        $this.addClass('open').children('.collapse').collapse('show');

        var timer = setInterval(function () {
          if ($this.hasClass('open') && ($this.children('.collapse-child').css('display') === 'none')) {
            $this.children('.collapse').collapse('show');
          }

          if ($this.children('.collapse').is(":visible")) {
            clearTimeout(timer);
          }
        }, 100);
      },
      function () {
        var $this = $(this);

        $this.removeClass('open');

        var timer = setInterval(function () {
          if (!$this.hasClass('open') && ($this.children('.collapse-child').css('display') === 'block')) {
            $this.children('.collapse').collapse('hide');
          }

          if ($this.children('.collapse').is(":hidden")) {
            clearTimeout(timer);
          }
        }, 100);
      }
    );
  }
});


/*
 * toggle btn
 * ----------------------------------------------- */
$(function () {
  var $menuTrigger = $('.menu-trigger');

  $('#navbar').on('show.bs.collapse hide.bs.collapse', function (e) {
    if ($(e.target).attr('id') === 'navbar') {
      $menuTrigger.toggleClass('active');
    }
  });
});


/*
 * Sync multi tab btn for Bootstrap tab.js
 * ---------------------------------------------------*/
$(function () {
  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    var $container = $(e.target).parents('[data-target="tab-container"]');
    $container.find('.active').removeClass('active');
    $container.find('[data-target="' + $(e.target).data('target') + '"]').parent('li').addClass('active');
  });
});


/*
 * Make header fixed after scroll
 * ----------------------------------------------- */
$(function () {
  if (isMobile) {
    var $win = $(window);
    var $cloneNavContainer = $('<div class="cloned-nav-container"></div>');
    var $nav = $('.section-contact');
    var $navCloned = $nav.clone(true);
    var scrolledClass = 'is-scrolled';

    if ($nav.length === 0) {
      return false;
    }

    var formTop = $('#section-form').offset().top - 780;


    $nav.parent().append($cloneNavContainer.append($navCloned));

    $win.on('load scroll', function () {
      var windowTop = $(window).scrollTop();

      if (windowTop < 600 || formTop < windowTop) {
        $cloneNavContainer.removeClass(scrolledClass);
      } else {
        $cloneNavContainer.addClass(scrolledClass);
      }
    });
  }
});


/*
 * PC CVエリア（header）
 * ----------------------------------------------- */

$(function () {
  var $jsHeader = $(".js-header");

  $(window).on('load scroll', function () {
    if (isMobile) {
      return false;
    }

    $jsHeader.each(function () {
      var scroll = $(window).scrollTop();
      var formOffset = $('#form-title').offset().top;

      if (scroll > 500) {
        $jsHeader.addClass('is-scrolled');
      } else {
        $jsHeader.removeClass('is-scrolled');
      }

      if (scroll > 600) {
        $jsHeader.addClass('is-transition');
      } else {
        $jsHeader.removeClass('is-transition');
      }

      if ((formOffset - 400) > scroll && scroll > 700) {
        $jsHeader.addClass('is-shown');
      } else {
        $jsHeader.removeClass('is-shown');
      }
    });
  });
});


/*
 * SP CVエリア（フッター追従ボタン）
 * ----------------------------------------------- */
$(function () {
  var $anchor = $('#section-form');

  $(window).on('load scroll', function () {
    if (!$anchor.length) {
      return false;
    }

    $(".js-cv").each(function () {
      var windowTop = $(window).scrollTop();
      var formTop = $anchor.offset().top - 780;

      if (windowTop < 90 || formTop < windowTop) {
        $(this).addClass('is-hidden');
      } else {
        $(this).removeClass('is-hidden');
      }
    });
  });
});
