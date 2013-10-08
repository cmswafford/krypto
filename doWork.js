self.addEventListener('message', function(e) {
  var solutions = [];
  var current_permutation;
  var i = 120;
  var tmp, r = [];

  current_permutation = e.data.numbers;
  do {
    r.push( current_permutation );
    solutions = merge( solutions, testAlgebra( current_permutation, e.data.target, e.data.find_all_solutions ) );
    tmp = current_permutation;
    current_permutation = next_permutation( 0, 120, tmp );
  } while( --i > 0 );
  self.postMessage( { 'solutions': solutions, 'target': e.data.target, 'r': r } );
}, false);

function merge(a, b) {
  for( i in b ) {
    a.push( b );
  }
  return a;
}

var testAlgebra = function(numbers, target, find_all_solutions) {
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

function reverse( data, i, j ) {
  if( arguments.length < 3 ) j = data.length;
  if( arguments.length < 2 ) i = 0;
  var aReversed = [];
  var aBuffer = [];
  for( x in data ) {
    if( x < i ) aReversed.push( data[x] );
    else if( x >= i && x < j ) aBuffer.push( data[x] );
    else {
      while( aBuffer.length > 0 ) {
        aReversed.push( aBuffer.pop() );
      }
      aReversed.push( data[x] );
    }
  }
  while( aBuffer.length > 0 ) {
    aReversed.push( aBuffer.pop() );
  }

  return aReversed;
};

function next_permutation(first, last, data) {
  var sType = typeof data;
  if( sType == 'string' )
    data = data.split('');
  else if( sType != 'object' )
    return false;

  if( first == last ) return false;
  var i = first;
  ++i;
  if( i == last ) return false;
  i = last;
  --i;
  for(;;) {
    var ii = i--; 4, 3
    if( data[i] < data[ii] ) {
      var j = last;
      while( !( data[i] < data[--j] ) );
      tmp = data[i]; data[i] = data[j]; data[j] = tmp; // iter_swap( i, j);
      data = reverse( data, ii, last );
      if( sType == 'string' )
        return data.join('');
      else
        return data;
      //return true;
    }
    if( i == first ) {
      data = reverse( data, first, last );
      if( sType == 'string' )
        return data.join('');
      else
        return data;
      //return false;
    }
  }
};
