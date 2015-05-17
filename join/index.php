<?php
header('Status: 301 Moved Permanently');
header('Location: https://okwolf.com/neqtr-test/join.html?'
	. $_SERVER['QUERY_STRING']);
?>