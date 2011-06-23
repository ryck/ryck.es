<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">

  <title>ryck.es - contact</title>
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
  <link rel="stylesheet" href="css/style.css?v=5">

  <!-- Uncomment if you are specifically targeting less enabled mobile browsers
  <link rel="stylesheet" media="handheld" href="css/handheld.css?v=2">  -->

  <!-- All JavaScript at the bottom, except for Modernizr which enables HTML5 elements & feature detects -->
  <script src="js/libs/modernizr-1.7.min.js"></script>

</head>

<body id="contact">

<div id="wrapper">
    <div id="wrapper-content">
       
        
        <div id="header" class="clearfix">
            <aside id="header-logo">
              <figure>
                <a href="home" title="ryck"><img src="img/logodr-128r.png" alt="ryck" width="64" height="64"></a>
              </figure>
            </aside>
        
            <nav id="main-menu">    
              <ul class="tabs">
                <li><a href="home">Home</a></li>
                <li><a href="resume">Résumé</a></li>
                <li><a href="portfolio">Portfolio</a></li>
                <li><a class="active" href="contact">Contact</a></li>
              </ul>
            </nav>       
        </div>        
    <div id="content" class="clearfix">
      <section id="contact-info">
        
      </section>

      <section id="contact-form">

    <ul id="errors" class="">
        <li id="info">There were some problems with your form submission:</li>
    </ul>
    <p id="success">Thanks for your message! We will get back to you ASAP!</p>
    <form method="post" action="process.php">
        <label for="name">Name: <span class="required">*</span></label>
        <input type="text" id="name" name="name" value="" placeholder="John Doe" required="required" autofocus="autofocus" />

        <label for="email">Email Address: <span class="required">*</span></label>
        <input type="email" id="email" name="email" value="" placeholder="johndoe@example.com" required="required" />

        <label for="message">Message: <span class="required">*</span></label>
        <textarea id="message" name="message" placeholder="Your message must be greater than 20 charcters" required="required" data-minlength="20"></textarea>

        <span id="loading"></span>
        <input type="submit" value="Holla!" id="submit-button" />
        <p id="req-field-desc"><span class="required">*</span> indicates a required field</p>
    </form>
</div>

    
      </section>
    </div>
        
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
    var _gaq=[["_setAccount","UA-24074929-1"],["_trackPageview"]];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
    g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
    s.parentNode.insertBefore(g,s)}(document,"script"));
  </script>

</body>
</html>
