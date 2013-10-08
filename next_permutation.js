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

function next_permutation( first, last, data ) {
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

 /*
var firstN = [ 10, 20, 30, 40, 50 ];
var n = [ 10, 20, 30, 40, 50 ];
var i = 120;
do {
  n = next_permutation( 0, 5, n );
  console.log( n );
  console.log( firstN );
} while( i-- > 0 );// while( next_permutation( 0, 5, n ) != firstN );

n = next_permutation( 0, 5, n );
console.log( n );
n = next_permutation( 0, 5, n );
console.log( n );
n = next_permutation( 0, 5, n );
console.log( n );
n = next_permutation( 0, 5, n );
console.log( n );
n = next_permutation( 0, 5, n );
console.log( n );
*/
