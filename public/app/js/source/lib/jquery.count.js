(function($) {
  $.fn.charCount = function(conf){
    var defaults = {
      allowed: 140,
      counterTarget: '#counter',
      cssWarning: 'warning'
    };

    var conf = $.extend(defaults, conf);

    function calculate(obj){
      var count = $(obj).val().length;
      var available = conf.allowed - count;
      if(available < 0){
        $(conf.counterTarget).addClass(conf.cssWarning);
      } else {
        $(conf.counterTarget).removeClass(conf.cssWarning);
      }
      $(conf.counterTarget).html(available);
    };

    this.each(function() {
      calculate(this);
      $(this).keyup(function(){calculate(this)});
      $(this).change(function(){calculate(this)});
    });

  };
})(jQuery);
