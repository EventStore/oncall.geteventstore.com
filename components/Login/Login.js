function base_auth_string(a,b){var c=a+":"+b,d=btoa(c);userAccessKey="Basic"+d}define(["libs/knockout"],function(a){return function(b){var c=this;c.canLogin=b.selectedCallback||function(){},c.username=a.observable(""),c.password=a.observable(""),c.loginError=a.observable(!1),c.isLoggingIn=a.observable(!1),console.log("LoginViewModel Params: "+b),c.checkLogin=function(){var a=new XMLHttpRequest;base_auth_string(c.username(),c.password()),console.log(userAccessKey),a.open("GET",window.Config.APIBaseUrl+"login/",!0),a.setRequestHeader("Content-Type","application/json"),a.setRequestHeader("Authorization",userAccessKey),a.onload=function(){this.status>=200&&this.status<400?(c.loginError(!1),c.canLogin(!0),c.isLoggingIn(!1),window.Config.lastDate=moment().format()):(c.loginError(!0),c.canLogin(!1),c.isLoggingIn(!1))},console.log("Sending LoginRequest"),a.send(),c.isLoggingIn(!0)}}});