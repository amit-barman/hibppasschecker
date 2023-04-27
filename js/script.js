/* check if the password breached
this function take two arguments
1. uri(string) = url of the api
2. passwordHash(string) = sha-1 hashed password */
const isBreach = async (uri, passwordHash) => {
	// get prefix(first 5 characters of the sha-1 hashed password)
	let firstHash = passwordHash.substring(0, 5).toUpperCase()
	// get suffix(rest 35 characters of the sha-1 hashed password)
	let restHash = passwordHash.substring(5, passwordHash.length).toUpperCase()
	let msg = "Password Not Breached"				// set default message
	let resp = await fetch(uri + firstHash);	// call the Api with first 5 characters of sha-1 hashed password
	let data = await resp.text();				// API returns the suffix of every hash beginning with the specified prefix
	let arrData = data.split('\n')				// split all the hash with new line
	arrData.forEach((val, key) => {
		// returned suffix looks like this --> 1e4c9b93f3f0682250b6cf8331b7ee68fd8:1000
		let hashTomatch = val.split(':')		// split each hash with ':'
		if( hashTomatch[0] == restHash ){		// match last 35 characters of our hashed password with returned suffix
			/*
			if match found update the default message
			hashTomatch[1] contain how many times the given hash appeared in the HIBP database
			replace function replace all new lines & tabs with a blank string ''
			*/
			msg = `Password Has Been Breached ${hashTomatch[1].replace(/[\r|\n|\t]/g, '')} times.`;
		}
	})
	// if the default message was updated its means the password has been breached
	if( msg != "Password Not Breached" ){
		document.body.style.backgroundColor = "#C70039"		// change background color
		msg = "😨 " + msg 									// add emoji at the beginning of the message
	} else {
		document.body.style.backgroundColor = "#2ECC71"
		msg = "😊 " + msg
	}
	document.querySelector('.data').innerText = msg 	// show output to Html page
}

/* calculate SHA-1 hash of a string
this function take one arguments
message(string) = password entered by the user
and return a hex string
*/
async function sha1Hash(message) {
	const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  	const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8); // hash the message
  	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  	const hashHex = hashArray
    	.map((b) => b.toString(16).padStart(2, "0"))
    	.join(""); // convert bytes to hex string
  	return hashHex;
}

// main function
function checkBreach(){
	let inputPass = document.querySelector(".pass").value	// get value of the password field
	const uri = 'https://api.pwnedpasswords.com/range/'		// HIBP API endpoint
	// call sha1hash function and pass the output to isBreach function
	sha1Hash(inputPass).then((hashPass) => {
		isBreach(uri, hashPass)
	})
}

// Example SHA-1 Hash : password => 5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8
