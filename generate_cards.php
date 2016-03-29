<?php

$outfile = 'data/cards.json';
$number_of_cards = isset($_GET['n']) ? $_GET['n'] : 10;
$cards =  get_rand_cards($number_of_cards);
shuffle($cards);

file_put_contents($outfile,json_encode($cards,JSON_PRETTY_PRINT));

pre(
    count($cards) . " <a href=\"$outfile\">cards</a> generated!",
    json_encode($cards,JSON_PRETTY_PRINT)
);

function get_rand_cards($n = 100)
{
    $result = array();
    $cities = get_rand_lines('data/cities.txt',$n+1);
    for($i=0;$i<$n;$i++){
        array_push($result,['from' => $i.' '.trim($cities[$i]),'to' => ($i+1).' '.trim($cities[$i+1]), 'ticket' => get_rand_type()]);
    }

    return $result;
}

function get_rand_type(){
    $rand = rand(0,2);
    if($rand == 0){
        return get_rand_bus();
    } elseif($rand == 1){
        return get_rand_train();
    } else {
        return get_rand_plane();
    }
}

function get_rand_bus(){
    return [
        "type" => "bus",
        "number" => get_rand_number(3,1),
        "spec" => get_rand_spec(),
        "seat" => get_rand_number(2,1)
    ];
}

function get_rand_train(){
    return [
        "type" => "train",
        "number" => get_rand_number(2,2),
        "spec" => get_rand_spec(),
        "seat" => get_rand_number(2,1)
    ];
}

function get_rand_plane(){
    return [
        "type" => "airplane",
        "number" => get_rand_number(2,2,true),
        "spec" => get_rand_spec(),
        "seat" => get_rand_number(2,1),
        "gate" => rand(0,35),
        "baggage" => get_rand_baggage()
    ];
}

// return XX00 if invert true or 00XX if invert false
function get_rand_number($n_numbers = 2, $n_letters = 2, $invert = false){
    $ABC = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    shuffle($ABC);
    $numbers = rand(intval(str_pad("1",$n_numbers,"0")),intval(str_pad("1",$n_numbers+1,"0"))-1);
    $letters = array_chunk($ABC, $n_letters)[0];
    return ($invert == true) ? join('',$letters).$numbers : $numbers.join('',$letters);
}

function get_rand_spec(){
    return "";
}

function get_rand_baggage(){
    return rand(1,2)%2 == 0 ? rand(0,400) : "auto";
}

function get_rand_lines($filename, $n = 100)
{
    $result = array();
    $lines = get_lines($filename);
    if(count($lines) < $n) die("Sorry, cities too few. Max cards than you can generate is ".(count($lines)-1));
    for($i=0;$i<$n;$i++){
        $index = rand(0,$n-1);
        if(!in_array($lines[$index],$result))array_push($result,$lines[$index]);
        else $i--;
    }
    return array_unique($result);
}

function get_lines($filename)
{
    $result = array();
    if (($handle = fopen($filename, "r")) !== FALSE) {
        while (($data = fgets($handle)) !== FALSE) {
            array_push($result, $data);
        }
        fclose($handle);
    }
    return $result;
}

function pre()
{
    $args = func_get_args();

    echo '<pre>'; // This is for correct handling of newlines
    if(end($args) === true)
    {
        array_pop($args);
        foreach ($args as $arg)
        {
            ob_start();
            var_dump($arg);
            $a=ob_get_contents();
            ob_end_clean();
            echo htmlspecialchars($a,ENT_QUOTES); // Escape every HTML special chars (especially > and < )
        }
    } else {
        foreach ($args as $tr)
        {
            echo print_r($tr,true) . "\n";
        }
    }
    echo '</pre>';
}
