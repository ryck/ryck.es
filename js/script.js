$(function(){

    hideUrlBar();

    $('textarea').growingTextarea();

    $('hgroup').click(function () {
        $(this).siblings('article').slideToggle('fast');
        $(this).siblings('hr').toggle();
    });

/*
    window.addEventListener('load', function() {
      window.setTimeout(function() {
        var bubble = new google.bookmarkbubble.Bubble();

        var parameter = 'bmb=1';

        bubble.hasHashParameter = function() {
          return window.location.hash.indexOf(parameter) != -1;
        };

        bubble.setHashParameter = function() {
          if (!this.hasHashParameter()) {
            window.location.hash += parameter;
          }
        };

        bubble.showIfAllowed();
      }, 1000);
    }, false);
*/

});
