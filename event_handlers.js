let selected_node_ids = [];

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
    container = document.getElementById('twitter_network');
    data = {
      nodes: global_nodes,
      edges: global_edges
    };
    options = {};
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
        scrollCollapse: true,
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
      scrollCollapse: true,
      paging:         false
    } );        
}

function reset_color_for_selected_nodes()
{  
    for (i = 0; i < selected_node_ids.length; i++)
    { 
        node_id = selected_node_ids[i];
        global_nodes.update([{id:node_id, color:{background:'#2870B2'}}]);
    }

    selected_node_ids = [];
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
        reset_color_for_selected_nodes();

        // Highlight new selected nodes
        id = parseInt(target_elem.innerHTML);
        selected_node_ids.push(id);

        global_nodes.update([{id:id, color:{background:'#FF0077'}}]);
        selected_node_ids.push(id);

        id_idx = sample_data_network.id_list.indexOf(id);

        folowing_list = global_id_data_set[id_idx][1]; // following id list

        for (following_id of folowing_list)
        {
            global_nodes.update([{id:following_id, color:{background:'#5500DD'}}]); 
            selected_node_ids.push(following_id);
        }
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

          reset_color_for_selected_nodes();

          for (id of ref_id_list)
          {
            global_nodes.update([{id:id, color:{background:'#FF0077'}}]);
            selected_node_ids.push(id);
          }
      }
  }

function print_data_handler()
{
    print_list('ID LIST', sample_data_network.id_list);
    print_list('FOLLOWING LIST', sample_data_network.following_list);
    print_list("ID's TAG LIST", id_tag_list);
    print_list('UNIQUE TAG LIST', unique_tag_list);
    print_list('TAG COUNT LIST', tag_count_list);
}

function reset_colors()
{

}