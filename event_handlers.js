let selected_and_following_node_ids = [];
let selected_and_follower_node_ids = [];
let selected_id_table_id_elem = null;
let selected_tag_table_id_elem = null;

/*
 * Event handlers
 */
function add_network_handler()
{
    // alert("add_network_handler");
    let new_following_list = [];
    //get_sample_data(sample_data_network);
    new_following_list = get_sample_data_following_list();
    new_id_list = build_id_list
                  (
                      new_following_list, 
                      sample_data_network.id_list
                  );
          
    // Add nodes to network for network view
    for (id of new_id_list)
    {
        addNodeWithColor(global_nodes, id, ADDED_NODE_COLOUR);
        selected_and_following_node_ids.push(id);
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
    network.fit();

    // update global network data
    sample_data_network.id_list = sample_data_network.id_list.concat(new_id_list);

    id_tag_list = get_tag_list(sample_data_network.id_list);

    unique_tag_list = build_unique_tag_list(id_tag_list).sort();

    tags_count = unique_tag_list.length;

    // create tag_count_list with same length as unique_tag_list
    tag_count_list = Array(tags_count);
    tag_count_list.fill(0);
    tag_ref_id_list = Array(tags_count);

    for (i = 0; i < tags_count; i++)
        tag_ref_id_list[i] = [];

    //tag_ref_id_list.fill(Array()); does not work

    count_tags(sample_data_network.id_list, id_tag_list, unique_tag_list, tag_count_list, tag_ref_id_list);

    let zip = (a1, a2, a3) => a1.map((x, i) => [x, a2[i], a3[i]]);
    let tag_data_set = zip(unique_tag_list, tag_count_list, tag_ref_id_list);
    
    global_id_data_set = find_following_ids_and_tags(sample_data_network, id_tag_list);

    $('#id_table').DataTable( {
        data: global_id_data_set,
        columns: [
                    { title: "Id" },
                    { title: "Following Ids" },
                    { title: "Tags" }
                ],
        destroy: true,
        scrollY: "300px",
        //scrollCollapse: true,
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
        //scrollCollapse: true,
        paging:         false
    } );
}


function clear_network_handler()
{
   global_nodes = new vis.DataSet();
   global_edges = new vis.DataSet();

    // recompose the graph and layout
    container = document.getElementById('twitter_network');
    data = {
      nodes: global_nodes,
      edges: global_edges
    };
    network = new vis.Network(container, data, options);

    sample_data_network.id_list = [];
    sample_data_network.following_list = [];

    global_id_data_set = [];

    $('#id_table').DataTable( {
        data: global_id_data_set,
        columns: [
                    { title: "Id" },
                    { title: "Following Ids" },
                    { title: "Tags" }
                ],
        destroy: true,
        scrollY: "300px",
        //scrollCollapse: true,
        paging:         false
      } );

    tag_data_set = [];
    
    $('#tag_table').DataTable( {
      data: tag_data_set,
      columns: [
                  { title: "Tag" },
                  { title: "Frequency" },
                  { title: "Referred Ids" },
              ],
      destroy: true,
      scrollY: "300px",
      //scrollCollapse: true,
      paging:         false
    } );        
}

function reset_color_for_selected_nodes(selected_node_ids)
{  
    for (i = 0; i < selected_node_ids.length; i++)
    { 
        node_id = selected_node_ids[i];
        console.log('remove ' + node_id);
        global_nodes.update([{id:node_id, color:{background:NODE_COLOUR}}]);
    }

    selected_node_ids = [];
}

function highlight_selected_node_and_following_nodes(id, selected_node_ids, selected_node_colour, adj_node_colour)
{
    //reset_color_for_selected_nodes(selected_node_ids);
    reset_color_for_all_selected_nodes_and_tds();

    // Highlight new selected nodes
    global_nodes.update([{id:id, color:{background:selected_node_colour}}]);
    selected_node_ids.push(id);

    id_idx = sample_data_network.id_list.indexOf(id);

    folowing_list = global_id_data_set[id_idx][1]; // following id list

    for (following_id of folowing_list)
    {
        global_nodes.update([{id:following_id, color:{background:adj_node_colour}}]); 
        selected_node_ids.push(following_id);
    }
}

function highlight_selected_node_and_follower_nodes(id, selected_node_ids, selected_node_colour, adj_node_colour)
{
    //reset_color_for_selected_nodes(selected_node_ids);
    reset_color_for_all_selected_nodes_and_tds();

    // Highlight new selected nodes
    global_nodes.update([{id:id, color:{background:selected_node_colour}}]);
    selected_node_ids.push(id);

    id_idx = sample_data_network.id_list.indexOf(id);

    folowing_list = global_id_data_set[id_idx][1]; // following id list

    for (following_relation of sample_data_network.following_list)
    {
        console.log(following_relation[0] + ', ' + following_relation[1]);
        if (id == following_relation[1])
        {
          global_nodes.update([{id:following_relation[0], color:{background:adj_node_colour}}]); 
          selected_node_ids.push(following_relation[0]);
        }
    }
}

/*
 * select_table
 *
 * Click on a table (as target element) will 
 *
 */
function select_id_table(event)
{
    event_elem = event.currentTarget;
    target_elem = event.target;

    if (target_elem.parentElement.firstElementChild === target_elem
            && target_elem.tagName === 'TD')
    {
        id = parseInt(target_elem.innerHTML);
        highlight_selected_node_and_follower_nodes
          (
              id, 
              selected_and_following_node_ids, 
              SELECTED_NODE_FOR_FOLLOWER_COLOUR,
              FOLLOWER_NODE_COLOUR
          );

        if (selected_id_table_id_elem != null)
            selected_id_table_id_elem.removeAttribute('bgColor');

        // set table cel colour
        target_elem.setAttribute('bgColor', SELECTED_NODE_FOR_FOLLOWER_COLOUR);

        selected_id_table_id_elem = target_elem;
    }
}

function select_tag_table(event)
{
    event_elem = event.currentTarget;
    target_elem = event.target;
    
    if (target_elem.parentElement.firstElementChild === target_elem
          && target_elem.tagName === 'TD')
    {
        tag_name = target_elem.innerHTML;

        tag_index = unique_tag_list.indexOf(tag_name);

        ref_id_list = tag_ref_id_list[tag_index];

        //reset_color_for_selected_nodes(selected_and_following_node_ids);
        reset_color_for_all_selected_nodes_and_tds();

        for (id of ref_id_list)
        {
          global_nodes.update([{id:id, color:{background:TAGGED_NODE_COLOUR}}]);
          selected_and_following_node_ids.push(id);
        }


        if (selected_tag_table_id_elem != null)
            selected_tag_table_id_elem.removeAttribute('bgColor');

        target_elem.setAttribute('bgColor', TAGGED_NODE_COLOUR);     

        selected_tag_table_id_elem = target_elem;     
    }
  }

function click_node_handler()
{
    network.on('click', function(properties) 
    {
        let ids = properties.nodes;

        if (ids.length === 0)
        {
            // deselecting nodes will reset collours to all selected nodes and table cells
            reset_color_for_all_selected_nodes_and_tds();
        }
        else
        {
            // highlight selected node and its followers
            let clicked_nodes = global_nodes.get(ids);

            console.log('clicked nodes:', clicked_nodes);

            for (i = 0; i < clicked_nodes.length; i++)
              highlight_selected_node_and_following_nodes
              (
                  clicked_nodes[i].id, 
                  selected_and_following_node_ids, 
                  SELECTED_NODE_FOR_FOLLOWING_COLOUR,
                  FOLLOWING_NODE_COLOUR
              );
        }
    });
}

function reset_color_for_all_selected_nodes_and_tds()
{
    reset_color_for_selected_nodes(selected_and_following_node_ids);
    reset_color_for_selected_nodes(selected_and_follower_node_ids);

    if (selected_id_table_id_elem != null)
        selected_id_table_id_elem.removeAttribute('bgColor');

    if (selected_tag_table_id_elem != null)
        selected_tag_table_id_elem.removeAttribute('bgColor');
}

function print_data_handler()
{
    print_list('ID LIST', sample_data_network.id_list);
    print_list('FOLLOWING LIST', sample_data_network.following_list);
    print_list("ID's TAG LIST", id_tag_list);
    print_list('UNIQUE TAG LIST', unique_tag_list);
    print_list('TAG COUNT LIST', tag_count_list);
}
