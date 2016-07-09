
// Load the JavaScript SDK (asynchronously)
window.fbAsyncInit = function() {
  FB.init({
    appId      : '289986431354164',  // Obtained at registration
    xfbml      : true,
    version    : 'v2.6'
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Only works after `FB.init` is called 
function login(response) {
  FB.login(function(response) {
    if (response.authResponse) {
      console.log('Welcome!  Fetching your information.... ');
      // This call will only work if you accept the permission request
      FB.api('/me', function(response) {
       console.log('Good to see you, ' + response.name + '.');
      });
      getBirthdays();
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  }, {scope:'user_friends'});
}

function getBirthdays() {
  FB.api('/me/friends', function(response) {
    if (response && !response.error) {
        console.log("You have " + response.summary.total_count + " friends")
      }
  });
}



