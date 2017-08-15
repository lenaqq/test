/*
 * build_id_list(following_list)
 *
 * Params:
 *		following_list; 
 *			eg, input = 
						[
						[7015112,688483],
						[205754331,24830940],
						[183068454,1562971],
						[688483,5803082],
						[14127551,15859039],
						[12468982,5803082],
						[6475722,14236481],
						[1389501,24830940],
						[295,1000591],
						[202003,2695901]
						]
 *
 * Return
	Output: idlist = 
	[
	7015112,
	688483,
	205754331,
	24830940,
	183068454,
	1562971,
	5803082,
	14127551,
	15859039,
	12468982,
	6475722,
	14236481,
	1389501,
	295,
	1000591,
	202003,
	2695901
	]
 *
 */
function build_id_list(following_list) {
  	let id_list = [];

  	following_list.forEach( function(element) {
  		alert(element[0]);
  		alert(element[1]);
  	});	

  	return id_list; 
}

/*
function get_tags(id_list) {
        store.tags(sampleData[0]).then(
          function(tagData) {
            document.getElementById('demo-promise').innerHTML =
              '<h3>Sample</h3>'
              + JSON.stringify(sampleData)
              + '<h3>Tags for the first two people</h3>'
              + JSON.stringify(tagData);
          },
          function(error) {
            // No error is gonna happen.
          });
	store.tags(id_list, )
}
*/