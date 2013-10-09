// Parse URL parameters into an associative array
var parseUrlParams = function(url) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
        query  = url.substring( url.indexOf('?')+1 )
    var urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}

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

// Compare two arrays to test if they are identical
Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { 
            if (!this[i].compare(testArr[i])) return false;
        }
        if (this[i] !== testArr[i]) return false;
    }
    return true;
}
