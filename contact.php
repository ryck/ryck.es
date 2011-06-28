<?php session_start(); ?>
<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">

  <title>ryck.me - contact</title>
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
  <script src="js/libs/modernizr-2.0.min.js"></script>
  <script src="js/libs/respond.min.js"></script>

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

        <span class="honorific-prefix">Mr.</span>
        <a class="url fn" href="http://ryck.me/">Ricardo Gonzalez</a>
        &lt;<a class="email" href="mailto:info@ryck.me">info@ryck.me</a>&gt;
        <div class="role">Web Developer / Designer</div>
        <div class="nickname">Ryck</div>
        <div class="bday">1979-10-15</div>
        <div class="adr">
            <span class="region">London</span>
            
            <span class="postal-code">SW154AL</span>
            
            (<span class="country-name">UK</span>)
            <span class="geo">
            <span class="latitude">51.44769</span>
            <span class="longitude">-0.23619</span>
            </span>
        </div>
        
        <div class="tel"><span class="type">Mobile</span>: <span class="value">+4407783949781</span></div>
        <a class="url gtalk" href="xmpp:rickgc@gmail.com">gTalk</a> &mdash; <a class="url msn" href="msnim:chat?contact=rick_gc@hotmail.com">MSN</a>  &mdash; <a class="url skype" href="skype:ryckgc?call">Skype</a>

      </section>

      <section id="contact-form">

            <?php
			//init variables
			$cf = array();
			$sr = false;
			
			if(isset($_SESSION['cf_returndata'])){
				$cf = $_SESSION['cf_returndata'];
			 	$sr = true;
			}
            ?>
            <ul id="errors" class="<?php echo ($sr && !$cf['form_ok']) ? 'visible' : ''; ?>">
                <li id="info">There were some problems with your form submission:</li>
                <?php 
				if(isset($cf['errors']) && count($cf['errors']) > 0) :
					foreach($cf['errors'] as $error) :
				?>
                <li><?php echo $error ?></li>
                <?php
					endforeach;
				endif;
				?>
            </ul>
            <p id="success" class="<?php echo ($sr && $cf['form_ok']) ? 'visible' : ''; ?>">Thanks for your message! We will get back to you ASAP!</p>
            <form method="post" action="process.php" id="main-contact-form">
                <label for="name">Name: <span class="required">*</span></label>
                <input type="text" id="name" name="name" value="<?php echo ($sr && !$cf['form_ok']) ? $cf['posted_form_data']['name'] : '' ?>" placeholder="John Doe" required autofocus />
                
                <label for="email">Email Address: <span class="required">*</span></label>
                <input type="email" id="email" name="email" value="<?php echo ($sr && !$cf['form_ok']) ? $cf['posted_form_data']['email'] : '' ?>" placeholder="johndoe@example.com" required />
                             
                <label for="message">Message: <span class="required">*</span></label>
                <textarea id="message" name="message" placeholder="Your message must be greater than 20 charcters" required data-minlength="20"><?php echo ($sr && !$cf['form_ok']) ? $cf['posted_form_data']['message'] : '' ?></textarea>
                
                
                <input type="submit" value="Submit" id="submit" />
                <p id="req-field-desc"><span class="required">*</span> indicates a required field</p>
            </form>
            <span id="loading"></span>
            <?php unset($_SESSION['cf_returndata']); ?>


    
      </section>
    </div>
        
    <footer>
        
    </footer>
         
    </div> <!-- wrapper-content -->
</div> <!-- wrapper -->

  <!-- JavaScript at the bottom for fast page loading -->

  <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if necessary -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
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
