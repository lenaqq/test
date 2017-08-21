  
let global_id_data_set;
let global_tag_data_set;

/*
 * Graph data construction functions
 */
function addNode(nodes, node_id) {
    try {
        nodes.add({
            id: node_id,
            label: node_id.toString()
        });
    }
    catch (err) {
        alert(err);
    }
}

function addNodeWithColor(nodes, node_id, color) {
    try {
        nodes.add({
            id: node_id,
            label: node_id.toString(),
            color: color
        });
    }
    catch (err) {
        alert(err);
    }
}
function addEdgeArrow(edges, node_from, node_to) {
    try {
        edges.add({
            from: node_from,
            to: node_to,
            arrows: 'to'
        });
    }
    catch (err) {
        alert(err);
    }
}

/*
 * build_id_list(following_list)
 *
 * Params:
 *		following_list; 
 *			eg, input = [[7015112,688483],[205754331,24830940],[183068454,1562971]]
 *
 * Return
*     Output: idlist = [7015112,688483,205754331,24830940]
 *
 */
function build_id_list(following_list, id_list) 
{
  	let new_id_list = [];
  	//print_list(following_list);

  	for (let i = 0; i < following_list.length; i++) 
  	{
  		let node_pair = following_list[i];
  		for (let j = 0; j < node_pair.length; j++)
  		{
  			if (id_list.indexOf(node_pair[j]) < 0 && new_id_list.indexOf(node_pair[j]) < 0)
  			{
				// id_list.push(node_pair[j]);
				new_id_list.push(node_pair[j]);
  			}
  		}
	}

  	return new_id_list; 
}

/*
 * build_unique_tag_list
 *
 * Tags are converted to lower cases. 
 * Should filter out symbols such as ?, :, , etc
 * maybe filter out # and @
 */
function build_unique_tag_list(tag_list)
{
	let unique_tag_list = [];

	for (i = 0; i < tag_list.length; i++)
	{
		for (j = 0; j < tag_list[i].length; j++)
		{
			tag = tag_list[i][j].toLowerCase();

			if (unique_tag_list.indexOf(tag) < 0)
				unique_tag_list.push(tag);
		}
	}

	return unique_tag_list;
}

function count_tags(id_list, tag_list, unique_tag_list, tag_count_list, tag_ref_id_list)
{
	for (id_idx = 0; id_idx < tag_list.length; id_idx++)
  //for (var tags of tag_list)
	{
		//tags = tag_list[id_idx];

		for (var one_tag of tag_list[id_idx]) // i = 0; i < tags.length; i++)
		{
  			tag_index = unique_tag_list.indexOf(one_tag.toLowerCase()); //tags[i]);

        if (tag_index >= 0)
        {
    				tag_count_list[tag_index]++;
            tag_ref_id_list[tag_index].push(id_list[id_idx]);
        }
		}
	}
}

/*
 * print_list
 */
function print_list(title, data_list) 
{
	try
	{
		text_elem = document.getElementById("logs");
		
		text_elem.innerHTML += RETURN_CHARS + title + ': (' + data_list.length + ')' + RETURN_CHARS + '[';

		for (i = 0; i < data_list.length; i++) 
		{
			text_elem.innerHTML += '(' + i + ')';	

			if (typeof data_list[i] === 'number' && data_list[i].length > 1) 
			{
				text_elem.innerHTML += '[';
				for (j = 0; j < data_list[i].length; j++) 
				{
			  		text_elem.innerHTML += data_list[i][j];

					if ((j + 1) < data_list[i].length)
						 text_elem.innerHTML += ','		
				}
				text_elem.innerHTML += ']';		
			}
			else 
			{
          if (typeof data_list[i] === 'Array')
				    text_elem.innerHTML += '[' + data_list[i] + ']';
          else
            text_elem.innerHTML += data_list[i];
			}
			
			if ((i + 1) < data_list.length)
				 text_elem.innerHTML += ','
		}
		text_elem.innerHTML += ']' + RETURN_CHARS;

		// text_elem.innerHTML += 'JSON' + RETURN_CHARS + JSON.stringify(data_list);
	}
	catch (err)
	{
		alert(err);
	}
}

function print_lists_to_var() 
{
    text_elem = document.getElementById("logs");
    text_elem.innerHTML += RETURN_CHARS + RETURN_CHARS + 'var test_samples = ' + RETURN_CHARS;

    text_elem.innerHTML += '[' + RETURN_CHARS;

    // id_list
    text_elem.innerHTML += '[' + twitter.data.id_list.join(', ') + ']';
    text_elem.innerHTML += ',' + RETURN_CHARS;

    // following list
    text_elem.innerHTML += '[' + RETURN_CHARS;

    for (data of twitter.data.following_list) 
        text_elem.innerHTML += '[' + data.join(', ') + '],';

    text_elem.innerHTML = text_elem.innerHTML.slice(1, text_elem.innerHTML.length - 1) + '],' + RETURN_CHARS;

    text_elem.innerHTML += JSON.stringify(twitter.data.id_tag_list);

    text_elem.innerHTML += RETURN_CHARS;
    text_elem.innerHTML += '];' + RETURN_CHARS;

}

function fetch_sample_promise() {

  store.sample().then(function(sampleData) {
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
  });
}

function fetch_sample_callback(network) {
  store.sample(function(sampleData) {
    store.tags(
      sampleData[0],
      function(tagData) {
        document.getElementById('logs').innerHTML +=
          '<h3>Sample</h3>'
          + JSON.stringify(sampleData)
          + '<h3>Tags for the first two people</h3>'
          + JSON.stringify(tagData);
          
          network.id_list = build_id_list(sampleData);
          network.following_list = sampleData;
      },
      function(error) {
        // No error is gonna happen but this function must be provided.
      }
    );
  });
}

