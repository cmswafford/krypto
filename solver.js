//var equations = [];
//var variables = { a:0, b:0, c:0, d:0, e:0 };

// Try all operators
var findSolution = function( numbers, target ) {
  // Set variables
  /*variables.a = numbers[0]; variables.b = numbers[1]; variables.c = numbers[2]; variables.d = numbers[3]; variables.e = numbers[4];
  var i = 0;
  do {
    var s = testAlgebra( [a, b, c, d, e], target, false );
    i++;
    a = Math.floor(i/120);
  } while ( s.length == 0 );
  */

  // Set loader
  if( $('img.ajax-loader').length == 0 ) {
    $('#feedback').append('<img class="ajax-loader" src="ajax-loader.gif" alt="loading">');
  }

  // Find a solution
  worker.postMessage( { 'numbers': numbers, 'target': target, 'find_all_solutions': false } ); // Send data to our worker.
};

/*
function handleWorkerResponse( data ) {
  var solutions = data.solutions;
  var target = data.target;

  $('img.ajax-loader').remove();

  if( solutions.length > 0 )
    addFeedback( 'Found a valid solution! ' + solutions[0] + ' = ' + target );
  else
    addFeedback( 'No solution found for ' + target );

  console.log('Worker said: ', data )
  $('#solution-input').val( solutions[0] );
}

var testAllNumberCombinations = function( numbers, target, find_all_solutions )
{
  true;
}


/*var testAlgebra = function( numbers, target, find_all_solutions )
{
  if( arguments.length < 3 )
    find_all_solutions = false;

  var solutions = [];
  var i = 0, j = 0, k = 0, m = 0, x = 0;
  var a = '', b = '', c = '', d = '', e = '';
  var test = 0;
  for( i=0; i < 4; i++ )
  {
    b = a;
    b += numbers[0];
    if( i == 0 ) b += '+';
    else if( i == 1 ) b += '-';
    else if( i == 2 ) b += '*';
    else if( i == 3 ) b += '/';

    for( j=0; j < 4; j++ )
    {
      c = b;
      c += numbers[1];
      if( j == 0 ) c += '+';
      else if( j == 1 ) c += '-';
      else if( j == 2 ) c += '*';
      else if( j == 3 ) c += '/';

      for( k=0; k < 4; k++ )
      {
        d = c;
        d += numbers[2];
        if( k == 0 ) d += '+';
        else if( k == 1 ) d += '-';
        else if( k == 2 ) d += '*';
        else if( k == 3 ) d += '/';

        for( m=0; m < 4; m++ )
        {
          e = d;
          e += numbers[3];
          if( m == 0 ) e += '+';
          else if( m == 1 ) e += '-';
          else if( m == 2 ) e += '*';
          else if( m == 3 ) e += '/';
          e += numbers[4];

          test = eval(e);
          //addFeedback(e+' = '+test);
          if( test == target )
          {
            solutions.push(e);
            if( find_all_solutions )
              return solutions;
          }
        }
      }
    }
  }
  return solutions;
};
*/
/*
var simulate = function( games ) {
  if( !games ) return false;
  var i = 0, x = 0;
  var g = {};
  var r = [];
  var s = [];
  addFeedback('<img alt="loading" class="ajax-loader" src="ajax-loader.gif">');
  for( i=0; i < games; i++ )
  {
    g = newGame('single',true);
    s = testAlgebra(g.numbers,g.target,true);
    r.push({numbers: g.numbers, target: g.target, solutions: s});
  }

  for( i in r )
  {
    if( r[i].solutions.length > 0 )
      x++;
  }

  $('img.ajax-loader').remove();
  addFeedback(x+' out of '+games+' games were solved.');
  return r;
};*/
