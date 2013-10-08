// Add a message to the feedback box
var addFeedback = function( message, clear )
{
  if( arguments < 2 )
    clear = false;
  if( clear === true )
    $('#feedback').html('<li>'+message+'</li>');
  else
    $('#feedback').append('<li>'+message+'</li>');

  // Keep the bottom viewable
  $('#feedback').get(0).scrollTop = $('#feedback').get(0).scrollHeight;
}

/*
// Global vars
var target = 0;
var numbers = [];
var i = 0;
var numTest = /\d/;

// Draw the game onto the screen
var displayGame = function ( data ) {
  // Set the values
  $('#target-number').html(data.target);
  var list_items = '';
  for( i in data.numbers )
    list_items += '<li id="number-'+data.numbers[i]+'">'+data.numbers[i]+'</li>';
  $('#numbers').html('<ul>'+list_items+'</ul>');
}

// Get numbers for a new game
var newGame = function( type )
{
  numbers = [];
  var n = 0;
  for( i = 0; i < 5; i++ )
  {
    // Generate a random number from 1-20
    var j = 0;
    do
      n = (Math.floor(Math.random()*100%20))+1;
    while( $.inArray(n, numbers) >= 0 )
    numbers[i] = n;
  }
  numbers = numbers.sort( function(a,b){ return a - b } );

  // Generate a random target number from 30-50
  target = (Math.floor(Math.random()*100%21))+30;
  var o = { numbers: numbers, target: target };
  return o;
};

// Get the solution and check it
var submitSolution = function( )
{
  var solution = $('#solution-input').get(0).value;
  checkSolution(solution);
};

// Solution was accepted, now change the css a bit
var acceptSolution = function( ans )
{
  $('#solution-input').attr('class','correct');
  $('#eq').show();
  $('#ans').html(ans);
  $('#ans').attr('class','correct');
  addFeedback( 'FTW!!! Good job!', true);
  saveSolution(ans);
}

var saveSolution = function(target) {
  data = {'target': target,
          'numbers': numbers,
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
var validateSolution = function( solution, live )
{
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
var checkSolution = function( solution )
{
  if( !validateSolution(solution) )
    return false;
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
  var r = $($(data).find('pod[title="Result"] plaintext')[0]).text();
  if( !r ) $($(data).find('pod[title="Exact result"] plaintext')[0]).text();

  var t = $('#target-number').html()
  
  r == t ? acceptSolution(r) : rejectSolution(r);
};

// Add a message to the feedback box
var addFeedback = function( message, clear )
{
  if( arguments < 2 )
    clear = false;
  if( clear === true )
    $('#feedback').html('<li>'+message+'</li>');
  else
    $('#feedback').append('<li>'+message+'</li>');

  // Keep the bottom viewable
  $('#feedback').get(0).scrollTop = $('#feedback').get(0).scrollHeight;
}

var worker = null;
$(document).ready( function($) {
  // Initialize facebox
  $('a[rel*=facebox]').facebox()

  // Make the buttons shiney
  $('input[type="submit"], input[type="button"]').each( function() { $(this).button(); } );

  // Preload ajax-loader.gif
  if( document.images ) {
    var img = new Image();
    img.src = 'ajax-loader.gif';
  }

  worker = new Worker('doWork.js');

  function handleWorkerResponse( data ) {
    var solutions = data.solutions;
    var target = data.target;

    $('img.ajax-loader').remove();
    $('#target-'+data.target+' input[type="text"]').val(solutions[0]);

    if( solutions.length > 0 )
      addFeedback( 'Found a valid solution! ' + solutions[0] + ' = ' + target );
    else
      addFeedback( 'No solution found for ' + target );

    console.log('Worker said: ', data )
    $('#solution-input').val( solutions[0] );
  }

  worker.addEventListener('message', function(e) { handleWorkerResponse( e.data ); }, false);

} );

var findSolution = function( numbers, target ) {
  // Set loader
  if( $('img.ajax-loader').length == 0 ) {
    $('#feedback').append('<img class="ajax-loader" src="ajax-loader.gif" alt="loading">');
  }

  // Find a solution
  worker.postMessage( { 'numbers': numbers, 'target': target, 'find_all_solutions': false } ); // Send data to our worker.
}
*/
