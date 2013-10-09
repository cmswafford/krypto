function KryptoGame(numbers, target, solution) {
  // Wolfram Alpha API key
  this.appID = '6RPTAL-A95UL577RU';

  this.numbers = numbers ? numbers : this.generateRandomNumbers();
  this.target = target ? target : this.generateRandomTarget();
  this.solution = arguments.length > 2 ? solution : null;
}

// Generate 5 random numbers (1-20)
KryptoGame.prototype.generateRandomNumbers = function() {
  var numbers = [];
  var n = 0;
  for(var i = 0; i < 5; i++) {
    // Generate a random number from 1-20
    do {
      n = (Math.floor(Math.random()*100%20))+1;
    } while($.inArray(n, numbers) >= 0)
    numbers[i] = n;
  }
  numbers = numbers.sort(function(a,b){ return a - b });
  return numbers;
}

// Generate random target (30-50)
KryptoGame.prototype.generateRandomTarget = function() {
  target = (Math.floor(Math.random()*105%21))+30;
  return target;
}

KryptoGame.prototype.validateSolution = function() {
  if( !this.solution ) return false;

  var ret = true;
  var numTest = /\d+/g
  var numbers_used = [];
  while( (match = numTest.exec(this.solution)) != null ) {
    numbers_used.push(parseInt(match[0]));
  }
  numbers_used.sort(function(a,b){ return a - b });

  if( !numbers_used.compare(this.numbers) ) {
    ret = false;
  }

  // Check which numbers were used and not used and style them accordingly
  for( i in this.numbers )
  {
    if( $.inArray(numbers[i], numbers_used) >= 0 )
    {
      $('#number-'+numbers[i]).addClass('used');
      $('#number-'+numbers[i]).removeClass('required');
    }
    else
    {
      $('#number-'+numbers[i]).removeClass('required');
      $('#number-'+numbers[i]).removeClass('used');
    }
  }

  if( ret !== false )
    $('#solution-input').attr('class','');
  else
    addFeedback('Check that your solution uses the numbers allowed once and only once');

  // Hide equal sign stuff
  $('#eq').hide();
  $('#ans').html('');
  $('#ans').attr('class','');
  return ret;
};

KryptoGame.prototype.findSolution = function() {
}
