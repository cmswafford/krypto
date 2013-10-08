/*
// Draw the game onto the screen
var displaySingleGame = function( krypto_game ) {
  // Set the values
  var list_items = '';
  for( i in krypto_game.numbers )
    list_items += '<li id="number-'+krypto_game.numbers[i]+'">'+krypto_game.numbers[i]+'</li>';
  $('#numbers').html('<ul>'+list_items+'</ul>');
}
*/

// Get the solution and check it
var submitSolution = function(kryptoGame)
{
  var solution = $('#solution-input').get(0).value;
  checkSolution(kryptoGame, solution);
};

// Solution was accepted, now change the css a bit
var acceptSolution = function( kryptoGame )
{
  $('#solution-input').attr('class','correct');
  $('#eq').show();
  $('#ans').html(kryptoGame.target);
  $('#ans').attr('class','correct');
  addFeedback( 'FTW!!! Good job!', true);
  saveSolution(kryptoGame);
}

var saveSolution = function(kryptoGame) {
  data = {'target': kryptoGame.target,
          'numbers': kryptoGame.numbers,
          'solution': $('#solution-input').get(0).value
  }
  $.post('save-solution', data);
}

// Solution was accepted, now make the player feel bad
var rejectSolution = function( ans )
{
  $('#solution-input').attr('class','incorrect');
  $('#eq').show();
  $('#ans').html(ans);
  $('#ans').attr('class','incorrect');
  addFeedback( 'FAIL. Try again.', true);
}

// Validate the input of the solution. Ensure the user used all numbers once
var validateSolution = function(kryptoGame, solution, live)
{
  if( !solution ) return false;

  var numTest = /\d/;
  var re = true;
  // Set live = false by default
  if( arguments.length < 2 )
    live = false;

  // Don't start highlighting numbers if the user is in the middle of typing an number
  if( live == true && numTest.test(solution.charAt(solution.length-1)) )
    return;

  // Create a space separated list of numbers used in this solution
  var t = '';
  var inPowerMode = false;
  for( i = 0; i < solution.length; i++ )
  {
    // Look for ^ character for power mode to allow the
    // free use of 1 to get the root feature in solutions
    if( solution.charAt(i) == '^' )
      inPowerMode = true;
    if( numTest.test(solution.charAt(i)) )
    {
      // Allow creating roots but the 1/ part is free!
      if( inPowerMode && solution.charAt(i) == 1 )
      {
        inPowerMode = false;
        continue;
      }
      t += solution.charAt(i);
    }
    else if( numTest.test(solution.charAt(i-1)) )
      t += ' ';
  }
  solution.replace('  ',' '); solution.replace('  ',' ');

  var numbers = kryptoGame.numbers
  var numbers_used = t.split(' ');
  var u = [];
  // Go through the numbers used and put valid ones in the var u
  for( i in numbers_used )
  {
    // Remove junk
    if( !numTest.test(numbers_used[i]) )
    {
      numbers_used.splice(i, 1);
      continue;
    }
    else
    {
      numbers_used[i] = parseInt(numbers_used[i]);
    }
    if( $.inArray( numbers_used[i], numbers ) >= 0 )
    {
      u.push(numbers_used[i]);
    }
  }

  // Check which numbers were used and not used and style them accordingly
  for( i in numbers )
  {
    if( $.inArray( numbers[i], u ) >= 0 )
    {
      $('#number-'+numbers[i]).addClass('used');
      $('#number-'+numbers[i]).removeClass('required');
    }
    else
    {
      $('#number-'+numbers[i]).removeClass('required');
      $('#number-'+numbers[i]).removeClass('used');
      if( live === false )
      {
        $('li#number-'+numbers[i]).addClass('required');
        re = false;
      }
    }
  }

  if( re !== false )
    $('#solution-input').attr('class','');

  // Hide equal sign stuff
  $('#eq').hide();
  $('#ans').html('');
  $('#ans').attr('class','');
  return re;
};

// Validate the solution to check the user has only used
// allowable numbers. Then send the solution to wolfram
var checkSolution = function(kryptoGame, solution)
{
  if( !validateSolution(kryptoGame, solution) ) {
    console.log('validateSolution returned false');
    return false;
  }
  var data = { input: solution
              ,format: 'plaintext'
             };
  $.get( 'wolfram-client', data, hCheckSolution );
  $('#eq').show();
  $('#ans').html('<img alt="loading" class="ajax-loader" src="ajax-loader.gif">');
  return true;
};

// Callback from Wolfram API
var hCheckSolution = function(data) {
  // Sometimes we get a document back that uses "Result" and other times it is "Exact result"
  var solutionResult = $($(data).find('pod[title="Result"] plaintext')[0]).text();
  if( !solutionResult ) solutionResult = $($(data).find('pod[title="Exact result"] plaintext')[0]).text();

  // Get the numbers used in the solution
  var solution = $($(data).find('pod[title="Input"] plaintext')[0]).text();
  var numbers = solution.match(/(\d+)/g);
  for(n in numbers) {
    numbers.push(parseInt(numbers[n]));
  }
  numbers.splice(0,5);

  var target = $('#target-number').html()

  var k = new KryptoGame(numbers, target)
  
  solutionResult == target ? acceptSolution(k) : rejectSolution(k);
};

    var findSolution = function( numbers, target ) {
      // Set loader
      if( $('img.ajax-loader').length == 0 ) {
        $('#feedback').append('<img class="ajax-loader" src="ajax-loader.gif" alt="loading">');
      }

      // Find a solution
      worker.postMessage( { 'numbers': numbers, 'target': target, 'find_all_solutions': false } ); // Send data to our worker.
    }
