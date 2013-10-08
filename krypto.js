function KryptoGame(numbers, target) {
  // Wolfram Alpha API key
  this.appID = '6RPTAL-A95UL577RU';

  this.numbers = numbers ? numbers : this.generateRandomNumbers();
  this.target = target ? target : this.generateRandomTarget();
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

KryptoGame.prototype.findSolution = function() {
}
