<?php
header('Status: 301 Moved Permanently');
header('Location: https://neqtr.com/join.html?'
	. $_SERVER['QUERY_STRING']);
?>