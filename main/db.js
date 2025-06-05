var __path = process.cwd(),
      monk = require('monk'),
     { color } = require(__path + '/opoya/color.js')

// Connection
var url = 'https://example.com';
try {
if(url == 'https://example.com') throw console.log(color('Cek konfigurasi database','red'));
} catch (e) {
	return;
	}
var db = monk(url);

db.then(() => {
  console.log(color('Connected server, starting','green'))
})
.catch ((e) => {
	console.log(color('Error : '+ e +'\n\nGagal connect ke database','red'))
	})


module.exports = db
