var findSolution = function( numbers, target ) {
  // Set loader
  if( $('img.ajax-loader').length == 0 ) {
    $('#feedback').append('<img class="ajax-loader" src="ajax-loader.gif" alt="loading">');
  }

  // Find a solution
  worker.postMessage( { 'numbers': numbers, 'target': target, 'find_all_solutions': false } ); // Send data to our worker.
}

// Solution was accepted, now change the css a bit
var acceptSolution = function( kryptoGame )
{
  $('#solution-input').attr('class','correct');
  $('#eq').show();
  $('#ans').html(kryptoGame.target);
  $('#ans').attr('class','correct');
  addFeedback( 'Good job!', true);
  saveSolution(kryptoGame);
}

var saveSolution = function(kryptoGame) {
  data = {'target': kryptoGame.target
         ,'numbers': kryptoGame.numbers
         ,'solution': kryptoGame.solution
         ,'user': $('#solution-author').get(0).value
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

// Get the solution and check it
var submitSolution = function(kryptoGame)
{
  checkSolution(kryptoGame);
};

// Validate the solution to check the user has only used
// allowable numbers. Then send the solution to wolfram
var checkSolution = function(kryptoGame)
{
  if(!kryptoGame.validateSolution()) {
    return false;
  }

  var data = { input: kryptoGame.solution
              ,target: kryptoGame.target
              ,numbers: kryptoGame.numbers.join(',')
              ,format: 'plaintext'
             };

  $.get( 'wolfram-client', data, hCheckSolution );

  $('#eq').show();
  $('#ans').html('<img alt="loading" class="ajax-loader" src="ajax-loader.gif">');

  return true;
};

// Callback from Wolfram API
var hCheckSolution = function(data) {
  var urlParams = parseUrlParams(this.url);

  // Sometimes we get a document back that uses "Result" and other times it is "Exact result"
  var solutionResult = $($(data).find('pod[title="Result"] plaintext')[0]).text();
  if( !solutionResult ) solutionResult = $($(data).find('pod[title="Exact result"] plaintext')[0]).text();

  var target = urlParams['target'];
  var solution = urlParams['input'];
  var numbers = [];
  $(urlParams['numbers'].split(',')).each(function(i,e){numbers.push(parseInt(e));});

  var k = new KryptoGame(numbers, target, solution)
  k.validateSolution();
  
  solutionResult == target ? acceptSolution(k) : rejectSolution(k);
};
