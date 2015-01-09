(function ($) {
 /**
  * Behaviour for Reunion Finder block.
  */
  Drupal.behaviors.gsb_reunion_finder = {

    attach: function (context, settings) {

      // the delay function used to watch user's keyups in
      // the program year field
      var delay = (function() {
        var timer = 0;
        return function(callback, ms){
          clearTimeout(timer);
          timer = setTimeout(callback, ms);
        };
      })();

      // isNumberic function to check if the user has
      // entered a numeric value for the program year field
      var isNumeric = function(num) {
        return (num >=0 || num < 0);
      };

      var getAlias = function(getURL) {
        // make the ajax call to get the alias path for the program
        jQuery.getJSON(getURL, function(data) {
          if (data.alumni_reunion_alias) {
            console.log('alumni reunion alias lookup alias = ' + data.alumni_reunion_alias);
            // set the href for the gotoReunion button/link and show it
            $('#gotoReunion').attr('href', '/' + data.alumni_reunion_alias.toLowerCase());
            $('#gotoReunion').show();
          }
          else {
            // since no alias was found... show the 'no reunion page' error text
            console.log('alumni reunion alias lookup alias = no alias found');
            $('#noReunionPage').show();
          }
        })
        .fail(function() {
          console.log('failed alumni reunion alias lookup');
        });
      };

      // when a new char has been typed into the program year field
      $('#programYear').keyup(function() {
        // get the selected program
        var programSelectValue = $('#programSelect').val();
        // get the program year
        var programYearValue = $('#programYear').val();

        $('#noReunionPage').hide();

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
        // delay a bit before continuing with checking the
        // entered program year value
        delay(function() {
          // make the ajax call to get the alias path for the program
          var getURL = "/" + "alumni-reunion-lookup-alias" + "/" + programSelectValue + "/" + programYearValue;
          getAlias(getURL);
        }, 500 );
      });

      // when a new program is selected...
      // we want to update the gotoReunion button/link to have the correct alias path
      // for the selected program.
      $('#programSelect').change(function () {
        // get the selected program
        var programSelectValue = $('#programSelect').val();
        // hide the gotoReunion button/link and...
        // the 'no reunion page' error text
        $('#gotoReunion').hide();
        $('#noReunionPage').hide();
        // clear the program year value, error settings and...
        $('#programYear').val('');
        $('#programYear').removeClass('error');
        $('#programYearError').hide();
        // ...show the program year field if the user has selected the MBA program
        if (programSelectValue == 'MBA') {
          $('#programYear').show();
          $('#label_programYear').show();
        }
        else {
          $('#programYear').hide();
          $('#label_programYear').hide();
        }
        if (programSelectValue != '' && programSelectValue != 'MBA') {
          // set the program year to something, so we can pass two arguments to
          // drupal hook menu land
          var programYearValue = 'na';
          // make the ajax call to get the alias path for the program
          var getURL = "/" + "alumni-reunion-lookup-alias" + "/" + programSelectValue + "/" + programYearValue;
          getAlias(getURL);
        }
      });

    } // end attach

  }

})(jQuery);