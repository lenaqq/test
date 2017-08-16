    const return_chars = '&#13;&#10;';
	    
  	let tag_list;
  	let unique_tag_list;
  	let tag_count_list;

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
     * Event handlers
     */
    function add_network_handler()
    {
        let new_following_list = [];
        //get_sample_data(sample_data_network);
        new_following_list = get_sample_data_following_list();
        new_id_list = build_id_list
                      (
                          new_following_list, 
                          sample_data_network.id_list
                      );
              
        // Add nodes to network for drawing
        for (let i = 0; i < new_id_list.length; i++)
        {
            addNode(global_nodes, new_id_list[i]);
        }

        // Add edges to network for drawing
        for (let i = 0; i < new_following_list.length; i++)
        {
            if (sample_data_network.following_list.indexOf(new_following_list[i]) < 0)
            { 
                // add edge arrow and add following relation to sample_data_network.following_list
                addEdgeArrow
                (
                    global_edges,
                    new_following_list[i][0],         // from node
                    new_following_list[i][1]          // to node
                );
                sample_data_network.following_list.push(new_following_list[i]);
            }
        }

        // update global network data
        sample_data_network.id_list = sample_data_network.id_list.concat(new_id_list);
 
  	    tag_list = get_tag_list(sample_data_network.id_list);

  	    unique_tag_list = build_unique_tag_list(tag_list).sort();

  	    tags_count = unique_tag_list.length;

  	    // create tag_count_list with same length as unique_tag_list
  	    tag_count_list = new Array(tags_count);
  	    tag_count_list.fill(0);

  	    count_tags(tag_list, unique_tag_list, tag_count_list);

        let zip = (a1, a2,) => a1.map((x, i) => [x, a2[i], []]);
        let tag_data_set = zip(unique_tag_list, tag_count_list);

        let id_data_set = find_following_ids_and_tags(sample_data_network, tag_list);
        //let tag_data_set = [];

    /*
    var dataSet3 = [ ['aaaaaa', 4, [1, 2, 4]], ['xsdf', 2, []], ['sad', 3, [3, 54, 2, 3, 4, 5, 4]] ];

        $('#id_following_table').DataTable( {
            data: id_data_set,
            columns: [
                          { title: "Id" },
                          { title: "Following Id" },
                          { title: "Tags" }
                      ],
            destroy: true
          } );
*/
    //var dataSet3 = [ ['xxxxxxx', [1, 2, 4]], ['xsdf', []], ['sad',[3, 54, 2, 3, 4, 5, 4]] ];

        t = $('#id_following_table').DataTable( {
            data: id_data_set,
            columns: [
                        { title: "Id" },
                        { title: "Following Ids" },
                        { title: "Tags" }
                    ],
            destroy: true,
            scrollY: "300px",
            scrollCollapse: true,
            paging:         false
          } );


        $('#tag_table').DataTable( {
          data: tag_data_set,
          columns: [
                      { title: "Tag" },
                      { title: "Frequency" },
                      { title: "Referred Ids" },
                  ],
          destroy: true,
          scrollY: "300px",
          scrollCollapse: true,
          paging:         false
        } );
    }
    

    function clear_network_handler()
    {
    	global_nodes = new vis.DataSet();
    	global_edges = new vis.DataSet();

        // recompose the graph and layout
        container = document.getElementById('mynetwork');
        data = {
          nodes: global_nodes,
          edges: global_edges
        };
        options = {};
        network = new vis.Network(container, data, options);

        sample_data_network.id_list = [];
        sample_data_network.following_list = [];
	}

	function print_data_handler()
	{
	    print_list('ID LIST', sample_data_network.id_list);
	    print_list('FOLLOWING LIST', sample_data_network.following_list);
	    print_list("ID's TAG LIST", tag_list);
	    print_list('UNIQUE TAG LIST', unique_tag_list);
		print_list('TAG COUNT LIST', tag_count_list);
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
     */
    function find_following_ids_and_tags(network, tag_list)
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
                if (id === following_list[following_idx][0])   // compare from id
                {
                    id_folowing_list.push(following_list[following_idx][1]); // add to id
                }
            }

            data = [ id, id_folowing_list, tag_list[i] ];
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

function count_tags(tag_list, unique_tag_list, tag_count_list)
{
	for (id_idx = 0; id_idx < tag_list.length; id_idx++)
	{
		id_tag_list = tag_list[id_idx];

		for (i = 0; i < id_tag_list.length; i++)
		{
			tag_index = unique_tag_list.indexOf(id_tag_list[i]);

			if (tag_index >= 0)
				tag_count_list[tag_index]++;
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

function select_table(event)
{
  target_elem = event.target;

  if (target_elem.parentElement.firstElementChild == target_elem)
    alert("select_table: cell = " + target_elem.innerHTML);
  else
    alert("not first child");
}