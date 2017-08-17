    const return_chars = '&#13;&#10;';
	    
  	let tag_list;
  	let unique_tag_list;
  	let tag_count_list;
    let tag_ref_id_list;
    let global_id_data_set;

    /*
     * Twitter data fetching functions
     */
    function get_sample_data_following_list() 
    {
        let following_list;

        store.sample(function(sampleData) {
            following_list = sampleData;
        });
        
        return following_list;
    }

    function get_sample_data(following_list) 
    {
        store.sample(function(sampleData) 
        {
              following_list = sampleData;
        });
    }


    function get_tag_list(id_list) 
    {
    	let tag_list = [];

        store.tags(
        	id_list,
          	function(tagData) {
            	tag_list = tagData;
          	},
          	function(error) {
            // No error is gonna happen.
          	}
        );

        return tag_list;
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
            document.getElementById('demo-callback').innerHTML +=
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
     * find_following_ids_and_tags
     *
     * construct data set: [ [1, [4, 3, 6]], [3, [1, 2]], [5, []]]
     *
     * Params:
     *    network       containing id_list and following list
     *    id_tag_list   list of tags corresponding to the ids, fetched by get_tag_list() or store.tags()
     */
    function find_following_ids_and_tags(network, id_tag_list)
    {
        let id_list = network.id_list;
        let following_list = network.following_list;
        let data_set = [];

        for (i = 0; i < id_list.length; i++)
        {
            id = id_list[i];
            id_folowing_list = [];

            for (following_idx = 0; following_idx < following_list.length; following_idx++)
            {
                if (id === following_list[following_idx][0])   // compare 'from id'
                {
                    id_folowing_list.push(following_list[following_idx][1]); // add 'to id'
                }
            }

            data = [ id, id_folowing_list, id_tag_list[i] ];
            data_set.push(data);

            //id_table.row.add(data);
        }

        //id_table.draw();
        return data_set;

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
  			tag_index = unique_tag_list.indexOf(one_tag); //tags[i]);

  			if (tag_index >= 0)
        {
    				tag_count_list[tag_index]++;
            tag_ref_id_list[tag_index].push(id_list[id_idx]);
        }
		}
	}
}
/*
function build_unique_tag_list(tag_list)
{
	let unique_tag_list = [];

	for (i = 0; i < tag_list.length; i++)
	{
		let a = new Set(unique_tag_list);
		let b = new Set(tag_list[i]);

		union = new Set([...a, ...b]);
		unique_tag_list = Array.from(union);
	}

	return unique_tag_list;
}
*/

/*
 * print_list
 */
function print_list(title, data_list) 
{
	try
	{
		text_elem = document.getElementById("demo-callback");
		
		text_elem.innerHTML += return_chars + title + ': (' + data_list.length + ')' + return_chars + '[';

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
				text_elem.innerHTML += data_list[i];
			}
			
			if ((i + 1) < data_list.length)
				 text_elem.innerHTML += ','
		}
		text_elem.innerHTML += ']' + return_chars;

		// text_elem.innerHTML += 'JSON' + return_chars + JSON.stringify(data_list);
	}
	catch (err)
	{
		alert(err);
	}
 
	//ocument.getElementById('demo-callback').innerHTML += json_str;

    //build_id_list(JSON.stringify(sampleData));
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
