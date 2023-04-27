let eyeicon = document.querySelector('#eye-icon')
let password = document.querySelector('.pass')

eyeicon.onclick = function(){
	if(password.type == 'password'){
		password.type = 'text'
		eyeicon.src = 'images/view.png'
	} else {
		password.type = 'password'
		eyeicon.src = 'images/hide.png'
	}
}