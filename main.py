#!/usr/bin/env python
# -*- coding: utf-8 -*- 

import datetime
from google.appengine.ext import db
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from google.appengine.api import users
from google.appengine.ext import ndb
import json
import logging
import random
import os
import sys
import urllib
import urllib2
import webapp2
import wsgiref.handlers
from webapp2_extras import sessions

WOLFRAM_ALPHA_APPID = '6RPTAL-A95UL577RU' #Q9868R-UHTWU2L6K2 (deprecated)

# Entity Models
class WolframQueries(db.Model):
  """Model for a Wolfram Alpha API query"""
  input = db.StringProperty()
  format = db.StringProperty()
  appid = db.StringProperty()
  response = db.TextProperty()

class Solutions(db.Model):
  """Model for a krypto solution"""
  number0 = db.IntegerProperty()
  number1 = db.IntegerProperty()
  number2 = db.IntegerProperty()
  number3 = db.IntegerProperty()
  number4 = db.IntegerProperty()
  target = db.IntegerProperty()
  solution = db.StringProperty()
  user = db.StringProperty()
  date = db.DateTimeProperty(auto_now_add=True)

# Taken from the webapp2 extrta session example
class BaseHandler(webapp2.RequestHandler):              
    def dispatch(self): # override dispatch
        # Get a session store for this request
        self.session_store = sessions.get_store(request=self.request)

        try:
            # Dispatch the request
            webapp2.RequestHandler.dispatch(self) # dispatch the main handler
        finally:
            # Save all sessions
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key
        return self.session_store.get_session()

class FullSheet(BaseHandler):
  def get(self):
    # If no game parameters have been supplied, generate a random game"""
    if not self.request.get('numbers'):
      game_parameters = SingleGame().generateGame()
      n = ','.join([str(s) for s in game_parameters['numbers']])
      self.redirect('/full-sheet?numbers=%s' % (n))
      return

    # Set author
    author = 'Your name...'
    if self.session.get('user'):
      author = self.session.get('user')

    # Generate a game to get 5 random numbers
    numbers = self.getNumbers()
    context = { 'numbers': numbers
               ,'author': author
               ,'target_range': range(30, 51)
    }

    self.response.out.write( template.render('full-sheet.html', context) )

  def getNumbers(self):
    givenNumbers = [ int(n) for n in self.request.get('numbers').split(',') ]
    numbers = []
    for n in givenNumbers:
      if n >= 1 and n <= 20 and n not in numbers:
        numbers.append(n)
        pass
      else:
        logging.error('%i is not a unique integer between 1 and 20' % n)

    if len(numbers) != 5:
      logging.error('Invalid list of numbers: %s' % self.request.get('numbers'))
    else:  
      return numbers

  def post(self):
    solutions = self.request.POST.getall('solution')
    for solution in solutions:
      print 'Solution: %s' % solution
      solution.put()
    #self.redirect('/?' + urllib.urlencode({'guestbook_name': guestbook_name}))

class HowToPlay(webapp2.RequestHandler):
  def get(self):
    self.response.out.write( template.render('how-to-play.html',{}) )

class SingleGame(BaseHandler):
  def generateGame(self):
    game = {'numbers': [], 'target': 0}
    n = []
    for i in range(5):
      while True:
        x = random.randint(1, 20)
        if x not in n:
          n.append(x)
          break
    game['numbers'] = sorted(n)
    game['target'] = random.randint(30, 50)
    return game

  def get(self):
    # If no game parameters have been supplied, generate a random game"""
    if not self.request.get('numbers'):
      game_parameters = self.generateGame()
      n = ','.join([str(s) for s in game_parameters['numbers']])
      self.redirect('/single-game?numbers=%s&target=%s' % (n, game_parameters['target']))
      return

    numbers = self.getNumbers()
    target = self.getTarget()
    author = 'Your name...'
    if self.session.get('user'):
      author = self.session.get('user')

    context = {'numbers': numbers
              ,'numbersCSV': ','.join([str(n) for n in numbers])
              ,'author': author
              ,'target': self.request.get('target')
    }
    self.response.out.write(template.render('single-game.html', context))

  def getNumbers(self):
    givenNumbers = [ int(n) for n in self.request.get('numbers').split(',') ]
    numbers = []
    for n in givenNumbers:
      if n >= 1 and n <= 20 and n not in numbers:
        numbers.append(n)
        pass
      else:
        logging.error('%i is not a unique integer between 1 and 20' % n)

    if len(numbers) != 5:
      logging.error('Invalid list of numbers: %s' % self.request.get('numbers'))
    else:  
      return numbers

  def getTarget(self):
    target = int(self.request.get('target'))
    if target >= 30 and target <= 50:
      return target
    else:
      logging.error('Target "%s" is not a valid integer between 30 and 50' % self.request.get('target'))
    return 0


class SaveSolution(BaseHandler):
  def checkUnique(self, numbers, target, solution):
    """Returns True if the solution is in the database. Otherwise False."""
    where = """where number0 = :n0
              AND number1 = :n1
              AND number2 = :n2
              AND number3 = :n3
              AND number4 = :n4
              AND target = :t
              AND solution = :s
            """
    kwargs = {'n0': numbers[0]
             ,'n1': numbers[1]
             ,'n2': numbers[2]
             ,'n3': numbers[3]
             ,'n4': numbers[4]
             ,'t': target
             ,'s': solution
            }
    results = Solutions.gql(where, **kwargs)
    if results.count() > 0:
      return False
    return True

  def post(self):
    """Saves solution to the database if it does not yet exist"""
    # Validate target value
    target = int(self.request.get('target'))
    if target < 30 or target > 50:
      self.response.out.write('Invalid target')
      logging.error('Invalid target')
      return

    # Validate number values and put in ascending order
    numbers = []
    for n in self.request.POST.getall('numbers[]'):
      n = int(n)
      if n < 0 or n > 20:
        self.response.out.write('Invalid number %i' % n)
        logging.error('Invalid number %i' % n)
        return
      numbers.append(n)
    numbers.sort()

    # Strip all whitespace from solution 
    solution = ''.join(self.request.get('solution').split())

    # Strip all whitespace from user 
    user = ''.join(self.request.get('user').split())
    if not user:
      if self.session['user']:
        user = self.session['user']
      else:
        user = 'Anonymous'
    else:
      self.session['user'] = user

    # If this solution hasn't been added to the database, add it
    if self.checkUnique(numbers, target, solution):
      logging.info('Saved solution %s=%i' % (solution, target))
      solution = Solutions(number0 = numbers[0]
                          ,number1 = numbers[1]
                          ,number2 = numbers[2]
                          ,number3 = numbers[3]
                          ,number4 = numbers[4]
                          ,target = target
                          ,solution = solution
                          ,user = user
      )
      solution.put()

      #session = get_current_session()
      #session.set('user', user)
    else:
      logging.error('This solution was already submitted')

    return

class Stats(webapp2.RequestHandler):
  def countSubmittedSolutions(self):
    numSolutions = Solutions.all().count()
    return numSolutions

  def get(self):
    leader = self.getLeader()
    numSubmittedSolutions = self.countSubmittedSolutions()

    context = {'numSubmittedSolutions': numSubmittedSolutions,
               'leaderName': leader['name'],
               'leaderSubmissions': leader['submissions']
    }

    self.response.out.write(template.render('stats.html', context))
    return

  def getLeader(self):
    leader = { 'name': '', 'submissions': 0 }
    leader['name'] = 'Clifton';
    leader['submissions'] = Solutions.all().filter('user =', leader['name']).count();
    return leader

class WolframClient(webapp2.RequestHandler):
  def get(self):
    """"""
    # Check if we've already sent this request before
    w = self.checkCache(self.request.get('input'))
    if not w:
      # Create object
      w = WolframQueries(input = self.request.get('input')
                        ,format = self.request.get('format')
                        ,response = ''
                        )
      # Get response
      w.response = self.queryWolfram( self.request.get('input'), self.request.get('format') )

      # Save object
      w.put()
 
    # Write data to output
    self.response.headers['Content-Type'] = 'text/xml'
    self.response.out.write(w.response)

  def queryWolfram(self, input, format):
    """Send API request to Wolfram Alpha"""

    # Set query parameters
    params = urllib.urlencode({'input': input
                              ,'format': format
                              ,'appid': WOLFRAM_ALPHA_APPID
                              })

    # Fetch URL and return page contents
    response = urllib2.urlopen('http://api.wolframalpha.com/v2/query?%s' % params)
    contents = response.read().decode('utf-8')
    return contents

  def checkCache(self, input):
    w = WolframQueries.all().filter('input = ', input).get()
    if w is None:
      return False
    else:
      return w

# Config options
config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'cryp7o!krypt0',
}

# Configure app routes
app = webapp2.WSGIApplication([('/', SingleGame)
                             ,('/full-sheet', FullSheet)
                             ,('/how-to-play', HowToPlay)
                             ,('/krypto', SingleGame)
                             ,('/save-solution', SaveSolution)
                             ,('/single-game', SingleGame)
                             ,('/stats', Stats)
                             ,('/wolfram-client', WolframClient)
                             ]
                             ,config=config
                             ,debug=True
)
