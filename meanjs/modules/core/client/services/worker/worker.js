function process(myData) {
	$http.post('/measurements/' + localStorage.getItem('currentDB') + '/data',myData);
}
self.addEventListener('message', function(e) {
	self.postMessage(process(e.data.myData));
}, false);