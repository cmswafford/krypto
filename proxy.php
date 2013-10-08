<?php

// Serve up the file as XML
header('Content-Type: text/xml');

$bCacheBreak = false;
if( isset($_GET['cache_break']) && $_GET['cache_break'] == true )
{
  $bCacheBreak = true;
  unset($_GET['cache_break']);
}

// Build the URL
$sURL = 'http://api.wolframalpha.com/v2/query?'.http_build_query($_GET);

$sHash = sha1($sURL);

$sFilename = __DIR__.'/cache/'.$sHash;
if( file_exists($sFilename) && $bCacheBreak !== true )
{
  $s = file_get_contents($sFilename);
}
else
{
  $s = file_get_contents($sURL);
  $f = fopen($sFilename, 'w');
  fwrite( $f, $s );
  fclose($f);
}

// Output the file
echo $s;
