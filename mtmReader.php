<?php
  // Kevin Pham
  // This program is an API for reading data about auction items.  It does
  // not modify the original files.  Returns a list of items if passed "all"
  // for "item" parameter.  Returns more specific information if specific item
  // requested (by number).

  if (isset($_GET["item"])) {
    $item = $_GET["item"];
    if ($item !== "all" && !is_numeric($item)) {
      error("The passed 'item' parameter must be a positive number or 'all'");
    }else if ($item === "all") {
      print_all();
    }else {
      if ($item <= 0 || !file_exists("items/" . $item . ".txt")) {
        error("That's an invalid item number");
      }else {
        print_item($item);
      }
    }
  }else {
    error("Please pass an 'item' parameter");
  }

  // Prints all items' names, img links, and highest bid in JSON format.
  function print_all() {
    $files = glob("items/*");
    $output = [];
    for ($i = 0; $i < count($files); $i++) {
      $contents = file($files[$i], FILE_IGNORE_NEW_LINES);
      $result = ["id" => intval(basename($files[$i])),
                 "name" => $contents[0],
                 "img" => $contents[2],
                 "super-silent" => ($contents[3] === "true"),
                 "cap" => intval($contents[4]),
                 "bid" => intval(explode(" - ", $contents[5])[1])];
      array_push($output, $result);
    }
    header("Content-type: application/json");
    echo json_encode(["data" => $output]);
  }

  // Prints info for item with passed id number in JSON format.
  // Files must be in "items/" folder and contain name, description,
  // a link to an image, true/false identifying super-silent, and the
  // top 3 bids.  Each data point must be on a new line.
  function print_item($num) {
    $contents = file("items/" . $num . ".txt", FILE_IGNORE_NEW_LINES);
    $output = [];
    $output["name"] = $contents[0];
    $output["description"] = $contents[1];
    $output["image"] = $contents[2];
    $output["super"] = ($contents[3] === "true");
    $output["cap"] = intval($contents[4]);
    $output["bids"] = [];
    for ($i = 5; $i < count($contents); $i++) {
      $split = explode(" - ", $contents[$i]);
      array_push($output["bids"], ["name" => $split[0], "bid" => intval($split[1])]);
    }
    header("Content-type: application/json");
    echo json_encode($output);
  }

  // Prints error with headers for given message.
  function error($msg) {
    header("HTTP/1.1 400 Invalid request");
    header("Content-type: text/plain");
    echo $msg;
  }
?>