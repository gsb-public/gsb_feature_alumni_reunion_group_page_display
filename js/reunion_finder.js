(function ($) {
 /**
  * Behaviour for Reunion Finder block.
  */
  Drupal.behaviors.gsb_reunion_finder = {

    attach: function (context, settings) {

      var aliases = settings.alumni_reunion_group_page_alias;

      var PROGRAM_MBA = 'MBA';
      var PROGRAM_MSX = 'MSx';
      var PROGRAM_SLOAN = 'Sloan';
      var PROGRAM_PHD = 'PhD';
      var PROGRAM_SEP = 'SEP';

      // seems like we need to do this show/hide trickyness
      // to have the gotoReunion button/link show correctly
      // later in the process
      $('#gotoReunion').show();
      $('#gotoReunion').hide();

      // the delay function used to watch user's keyups in
      // the program year field
      var delay = (function(callback, ms) {
        var timer = 0;
        return function(callback, ms){
          clearTimeout(timer);
          timer = setTimeout(callback, ms);
        };
      })();

      // isNumberic function - check if the user has
      // entered a numeric value for the program year field
      var isNumeric = function(num) {
        return (num >=0 || num < 0);
      };

      // validateProgramYear function - validate the program year,
      // checking... if numeric and if length has 4 digits
      var validateProgramYear = function(programYearValue) {
        if (!isNumeric(programYearValue)) {
          $('#gotoReunion').hide();
          $('#programYear').addClass('error');
          $('#programYearError').show();
          return false;
        }
        if (programYearValue.length != 4) {
          $('#gotoReunion').hide();
          $('#programYear').addClass('error');
          $('#programYearError').show();
          return false;
        }
        return true;
      }

      // checkRangeProgramYear function - if program year entered is
      // more than 2 years into current year, then sets an error
      var checkRangeProgramYear = function(programYearValue) {
        var currentYear = new Date().getFullYear();
        if (programYearValue > currentYear + 2) {
          // consider out of range and report no alias found
          $('#noReunionPage').show();
          return false;
        }
        return true;
      }

      // getAlias function - gets the reunion alias and sets the gotoReunion button/link
      var getAlias = function(aliases, programSelectValue, programYearValue) {

        if (programSelectValue == PROGRAM_SLOAN) {
          programSelectValue = PROGRAM_MSX;
        }

        // attempt to lookup the alias to an existing page with the year
        var reunion_alias = '';
        for (var index = 0; index < aliases.length; index++) {
          if (aliases[index].program_year == programSelectValue + programYearValue) {
            reunion_alias = aliases[index].alias;
            reunion_alias = reunion_alias.toLowerCase();
            break;
          }
        }

        // if we weren't able to find a page, then set the alias to other possible defaults
        if (reunion_alias == '') {
          var currentYear = new Date().getFullYear();
          if (programSelectValue == PROGRAM_MBA && programYearValue < currentYear - 50) {
            reunion_alias = 'half-century-club';
          }
          if (programSelectValue == PROGRAM_MSX && programYearValue < currentYear - 50) {
            reunion_alias = 'all-sloan-msx';
          }
          if (programSelectValue == PROGRAM_SEP || programSelectValue == PROGRAM_PHD) {
            reunion_alias = 'alumni-weekend';
          }
        }

        if (reunion_alias != '') {
          // set the href for the gotoReunion button/link and show it
          $('#gotoReunion').attr('href', '/alumni/reunions/' + reunion_alias);
          //$('#gotoReunion').hide();
          delay(function() {
            $('#gotoReunion').show();
          }, 42 );
        }
        else {
          // since no alias was found... show the 'no reunion page' error text
          $('#noReunionPage').show();
        }

      };

      // when a new char has been typed into the program year field
      // we first do some basic and range validation before...
      // trying to get the alias and update the gotoReunion button/link
      // to have the correct alias path
      $('#programYear').keyup(function() {
        // get the selected program
        var programSelectValue = $('#programSelect').val();
        // get the program year
        var programYearValue = $('#programYear').val();
        // hide the 'no reunion page' error text
        $('#noReunionPage').hide();
        // clear the program year error settings
        $('#programYear').removeClass('error');
        $('#programYearError').hide();
        // delay a bit before continuing with checking the
        // entered program year value
        delay(function() {
          // do some basic validate of the program year value
          if (!validateProgramYear(programYearValue)) {
            // program year is invalid, bye
            return;
          }
          // check the program year range
          if (!checkRangeProgramYear(programYearValue)) {
            // program year is out of range, bye
            return;
          }
          // make the ajax call to get the alias path for the program
          getAlias(aliases, programSelectValue, programYearValue);
        }, 500 );
      });

      // when the user presses the enter key, go to the reunion page
      $(document).keypress(function (e) {
        if (e.which == 13) {
          if ($('#gotoReunion').css('display') != 'none') {
            $('#gotoReunion')[0].click();
            return false;
          }
        }
      });

      // when a new program is selected...
      // we want to update the gotoReunion button/link to have the correct alias path
      // for the selected program.
      $('#programSelect').change(function () {
        programSelectChange();
      });

      var programSelectChange = function() {

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
        // ...show the program year field if the user has selected the MBA, MSx or Sloan program
        if (programSelectValue == PROGRAM_SLOAN) {
          programSelectValue = PROGRAM_MSX;
        }
        if (programSelectValue == PROGRAM_MBA || programSelectValue == PROGRAM_MSX) {
          $('#programYear').show();
          $('#label_programYear').show();
        }
        else {
          $('#programYear').hide();
          $('#label_programYear').hide();
        }
        if (programSelectValue != '' && programSelectValue != PROGRAM_MBA && programSelectValue != PROGRAM_MSX) {
          // set the program year to something, so we can pass two arguments to
          // drupal hook menu land
          var programYearValue = '';
          // make the ajax call to get the alias path for the program
          getAlias(aliases, programSelectValue, programYearValue);
        }

      };

      delay(function() {
        programSelectChange();
      }, 500 );

    } // end attach

  }

})(jQuery);
