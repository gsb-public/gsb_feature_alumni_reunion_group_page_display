(function ($) {
 /**
  * Behaviour for Reunion Finder block.
  */
  Drupal.behaviors.gsb_reunion_finder = {

    attach: function (context, settings) {

      var delay = (function() {
        var timer = 0;
        return function(callback, ms){
          clearTimeout(timer);
          timer = setTimeout(callback, ms);
        };
      })();

      var isNumeric = function(num) {
        return (num >=0 || num < 0);
      };

      $('#programYear').keyup(function() {
        $('#noReunionPage').hide();
        var programYearValue = $('#programYear').val();
        if (!isNumeric(programYearValue)) {
          console.log('program year: not numeric = ' + programYearValue);
          $('#gotoReunion').hide();
          $('#programYear').addClass('error');
          $('#programYearError').show();
          return;
        }
        if (programYearValue.length != 4) {
          console.log('program year: incorrect length = ' + programYearValue);
          $('#gotoReunion').hide();
          $('#programYear').addClass('error');
          $('#programYearError').show();
          return;
        }
        $('#programYear').removeClass('error');
        $('#programYearError').hide();
        var currentYear = new Date().getFullYear();
        if (programYearValue > currentYear + 2) {
          // consider out of range and report no alias found
          console.log('out of range - alumni reunion alias lookup alias = no alias found');
          $('#noReunionPage').show();
          return;
        }
        delay(function(){
          var programYearValue = $('#programYear').val();
          var programSelectValue = $('#programSelect').val();
          var getURL = "/" + "alumni-reunion-lookup-alias" + "/" + programSelectValue + "/" + programYearValue;
          var alumni_alias =
            jQuery.getJSON(getURL, function(data) {
              if (data.alumni_reunion_alias) {
                console.log('alumni reunion alias lookup alias = ' + data.alumni_reunion_alias);
                $('#gotoReunion').attr('href', '/' + data.alumni_reunion_alias.toLowerCase());
                $('#gotoReunion').show();
              }
              else {
                console.log('alumni reunion alias lookup alias = no alias found');
                $('#noReunionPage').show();
              }
            })
            .fail(function() {
              console.log('failed alumni reunion alias lookup');
            });
        }, 500 );
      });

      $('#programSelect').change(function () {
        $('#programYear').val('');
        var programSelectValue = $('#programSelect').val();
        $('#gotoReunion').hide();
        if (programSelectValue == 'MBA') {
          $('#programYear').show();
          $('#label_programYear').show();
        }
        else {
          $('#programYear').hide();
          $('#label_programYear').hide();
        }
        $('#noReunionPage').hide();
        $('#programYear').removeClass('error');
        $('#programYearError').hide();
        if (programSelectValue != '' && programSelectValue != 'MBA') {
            var programYearValue = 'noyr';
            var programSelectValue = $('#programSelect').val();
            var getURL = "/" + "alumni-reunion-lookup-alias" + "/" + programSelectValue + "/" + programYearValue;
            var alumni_alias =
            jQuery.getJSON(getURL, function(data) {
              if (data.alumni_reunion_alias) {
                console.log('alumni reunion alias lookup alias = ' + data.alumni_reunion_alias);
                $('#gotoReunion').attr('href', '/' + data.alumni_reunion_alias.toLowerCase());
                $('#gotoReunion').show();
              }
              else {
                console.log('alumni reunion alias lookup alias = no alias found');
                $('#noReunionPage').show();
              }
            })
            .fail(function() {
              console.log('failed alumni reunion alias lookup');
            });
        }
      });

    } // end attach

  }

})(jQuery);