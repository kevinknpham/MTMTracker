<?php
// Kevin Pham
// An API that can be used to update data used by MTM Tracker.

if (isset($_POST["password"])) {
  if ($_POST["password"] === "19fishsticks") {
    if (isset($_POST["item"]) && isset($_POST["paddle"]) && isset($_POST["bid"])) {
      updateBids($_POST["item"], $_POST["paddle"], $_POST["bid"]);
    }else {
      error("Please set 'item', 'paddle', and 'bid' parameters for the item to be changed.");
    }
  }else {
    error("Password incorrect.");
  }
}else {
  error("Please pass in a 'password' parameter.");
}

function updateBids($item, $paddle, $bid) {
  $file_name = "../items/" . $item . ".txt";
  if (file_exists($file_name)) {
    $contents = file($file_name, FILE_IGNORE_NEW_LINES);
    $highest = explode(" - ", $contents[5]);
    if ($highest[0] === "Starting bid" || ($highest[1] < $bid && $contents[4] >= $bid)) {
      $file = fopen($file_name, "w") or error("Can't open file.");
      for ($i = 0; $i < count($contents) && $i < 5; $i++) {
        fwrite($file, $contents[$i] . "\n");
      }
      fwrite($file, $paddle . " - " . $bid . "\n");
      for ($i = 5; ($i < count($contents) - 1) || ($i < 7); $i++) {
        fwrite($file, $contents[$i]);
        if (($i != count($contents) - 2) && ($i < 6)) {
          fwrite($file, "\n");
        }
      }
      header("Content-type: text/plain");
      echo "Success!  The bid was added.";
    }else {
      error("Invalid bid");
    }
  }else {
    error("That item number does not exist.");
  }
}

// Prints error with headers for given message.
function error($msg) {
  header("HTTP/1.1 400 Invalid request");
  header("Content-type: text/plain");
  echo $msg;
}

?>