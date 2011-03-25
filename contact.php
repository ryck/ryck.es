<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">

  <!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
       Remove this if you use the .htaccess -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title></title>
	<meta name="description" content="ryck.me">
	<meta name="author" content="Ricardo Gonzalez">

  <!-- Mobile viewport optimized: j.mp/bplateviewport -->
  <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <!-- Place favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon-precomposed" href="apple-touch-icon-iphone3.png" />
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="apple-touch-icon-ipad.png" />
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="apple-touch-icon-iphone4.png" />


  <!-- CSS: implied media="all" -->
  <link rel="stylesheet" href="css/style.css?v=2">

  <!-- Uncomment if you are specifically targeting less enabled mobile browsers
  <link rel="stylesheet" media="handheld" href="css/handheld.css?v=2">  -->

  <!-- All JavaScript at the bottom, except for Modernizr which enables HTML5 elements & feature detects -->
  <script src="js/libs/modernizr-1.7.min.js"></script>

</head>

<body>

<div id="wrapper">
    <div id="wrapper-content">
       
        
        <div id="header" class="clearfix">
            <nav>
                <ul class="menu">
                    <li><a href="/">Home</a></li>
                    <!--<li><a href="about">About</a><span>me &amp; myself </span></li>-->
                    <li class="active"><a href="resume">Résumé</a><span>experience</span></li>
                    <!--<li><a href="portfolio">Portfolio</a><span>last projects</span></li>-->
                    <li><a href="contact">Contact</a><span>reach me</span></li>
                </ul>
            </nav>
        </div>        
        <div id="content">

          <div id="contact">
                <?php
                   if ($_SERVER['REQUEST_METHOD'] != 'POST'){
                      $me = $_SERVER['PHP_SELF'];
                ?>

                  <form action="" method="post" id="info">
                  
                      <p id="name-wrap" class="slider">
                          <label for="name">Name</label>
                          <br>
                          <input type="text" id="name" name="name" required autofocus />
                      </p><!--/#name-wrap-->
                      
                      <p id="email-wrap"  class="slider">
                          <label for="email">E&ndash;mail</label>
                          <br>
                          <input type="email" id="email" name="email" required />
                      </p><!--/#email-wrap-->
                      
                      <p id="subject-wrap"  class="slider">
                          <label for="subject">Subject</label>
                          <br>
                          <input type="text" id="subject" name="subject" />
                      </p><!--/#subject-wrap-->                      
                                         
                      <p id="comment-wrap"  class="slider">
                          <label for="comment">Comment</label>
                          <br>
                          <textarea cols="53" rows="10" id="comment" name="comment" required></textarea>
                      </div><!--/#comment-wrap-->
                      
                      <p id="spam-wrap"  class="slider">
                          <label for="spam">2+3?</label>
                          <br>
                          <input type="number" id="spam" name="spam" required />
                      </p><!--/#spam-wrap-->   
                                            
                      <p id="button-wrap">
                          <!--<input type="submit" id="btn" name="btn" value="submit" />-->
                          <button type="submit" id="subContact" class="small awesome">submit</button> 
                      </p>
                  </form>

                  <?php
                     } else {
                        error_reporting(0);
                        $recipient = 'rickgc@gmail.com';
                        //$subject = '[ryck.me] ';
                        $subject = stripslashes($_POST['subject']);
                        $from = stripslashes($_POST['name']);
                        $msg = "Name: $from\n\nComment:\n".stripslashes($_POST['comment']);
                        if (mail($recipient, $subject, $msg))
                           echo '<div class="alert ok">Thanks. I will get in touch as soon as possible.</div>';
                        else
                           echo '<div class="alert ko">Error. Please try again.</div>';;
                  }
                  ?>

                </div>

        </div> <!-- content -->
        
        <footer>
            
        </footer>
         
    </div> <!-- wrapper-content -->
</div> <!-- wrapper -->

  <!-- JavaScript at the bottom for fast page loading -->

  <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if necessary -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.js"></script>
  <script>window.jQuery || document.write("<script src='js/libs/jquery-1.5.1.min.js'>\x3C/script>")</script>


  <!-- scripts concatenated and minified via ant build script-->
  <script src="js/plugins.js"></script>
  <script src="js/script.js"></script>
  <!-- end scripts-->


  <!--[if lt IE 7 ]>
    <script src="js/libs/dd_belatedpng.js"></script>
    <script>DD_belatedPNG.fix("img, .png_bg"); // Fix any <img> or .png_bg bg-images. Also, please read goo.gl/mZiyb </script>
  <![endif]-->


  <!-- mathiasbynens.be/notes/async-analytics-snippet Change UA-XXXXX-X to be your site's ID -->
  <script>
    var _gaq=[["_setAccount","UA-XXXXX-X"],["_trackPageview"]];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
    g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
    s.parentNode.insertBefore(g,s)}(document,"script"));
  </script>

</body>
</html>
