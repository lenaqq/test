/*
 * Event handlers
 */
function add_network_handler()
{
    let new_following_list = [];
    new_following_list = twitter.data.get_sample_data_following_list();
    new_id_list = build_id_list(new_following_list, twitter.data.id_list);
          
    // Add nodes to network for network view
    twitter.view.add_nodes_to_view(new_id_list);

    // Add edges to network view and data
    for (let rel of new_following_list)
    {
        if (twitter.data.following_list.indexOf(rel) < 0)
        { 
            // add edge arrow and add following relation to twitter.data.following_list
            addEdgeArrow
            (
                twitter.view.global_edges,
                rel[0],         // from node
                rel[1]          // to node
            );
            twitter.data.following_list.push(rel);
        }
    }

    // twitter.view.network.fit();

    // add new id list to network data
    twitter.data.id_list = twitter.data.id_list.concat(new_id_list);

    // update global network data
    let tag_list = twitter.data.get_tag_list(twitter.data.id_list);

    twitter.view.global_tag_data_set = twitter.data.build_tag_list(tag_list);
    twitter.view.global_id_data_set = twitter.data.find_following_ids_and_tags();

    twitter.view.update_tables_and_stats(twitter.data);
}

function test_handler()
{
    clear_network_handler();

    // get sample data from test_samples
    let new_following_list = test_samples[1];
    id_tag_list = test_samples[2];

    twitter.data.id_list = [];
    twitter.data.following_list = [];

    new_id_list = build_id_list
                  (
                      new_following_list, 
                      twitter.data.id_list
                  );
    
    sample_id_list = test_samples[0];

    if (new_id_list.length != sample_id_list.length || new_id_list.every((v,i)=> v != sample_id_list[i]))
    {
        alert("build_id_list() returns different id list from test_samples's id list.");
        return;
    }
        
    // Add nodes to network for network view
    for (id of new_id_list)
    {
        addNodeWithColor(twitter.view.global_nodes, id, ADDED_NODE_COLOUR);
        twitter.view.selected_and_following_node_ids.push(id);
    }

    // Add edges to network for drawing
    for (let i = 0; i < new_following_list.length; i++)
    {
        if (twitter.data.following_list.indexOf(new_following_list[i]) < 0)
        { 
            // add edge arrow and add following relation to twitter.data.following_list
            addEdgeArrow
            (
                twitter.view.global_edges,
                new_following_list[i][0],         // from node
                new_following_list[i][1]          // to node
            );
            twitter.data.following_list.push(new_following_list[i]);
        }
    }
    // network.fit();

    // update global network data
    twitter.data.id_list = twitter.data.id_list.concat(new_id_list);
    
    // update global network data
    let tag_list = twitter.data.get_tag_list(twitter.data.id_list);

    twitter.view.global_tag_data_set = twitter.data.build_tag_list(tag_list);
    twitter.view.global_id_data_set = twitter.data.find_following_ids_and_tags();

    twitter.view.update_tables_and_stats(twitter.data);
}

function clear_network_handler()
{
   twitter.view.global_nodes = new vis.DataSet();
   twitter.view.global_edges = new vis.DataSet();

    // recompose the graph and layout
    container = document.getElementById('twitter_network');
    data = {
        nodes: twitter.view.global_nodes,
        edges: twitter.view.global_edges
    };

    twitter.view.network = new vis.Network(container, data, twitter.view.options);

    click_node_handler();

    twitter.data.clear();
    twitter.view.clear();

    $('#id_table').DataTable( {
        data: [],
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
      data: [],
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

    $('#num_ids').html(twitter.data.id_list.length.toString());
    $('#num_edges').html(twitter.data.following_list.length.toString());
    $('#num_tags').html(twitter.data.unique_tag_list.length.toString());

    $('#statpanel-1').attr('style', 'visibility:hidden');
    $('#statpanel-2').attr('style', 'visibility:hidden');


    text_elem = document.getElementById("logs");
    text_elem.innerHTML = '';

}

/*
 * select_table
 *
 * Click on a table (as target element) will 
 *
 */
function select_id_table_handler(event)
{
    event_elem = event.currentTarget;
    target_elem = event.target;

    if (target_elem.parentElement.firstElementChild === target_elem
            && target_elem.tagName === 'TD')
    {
        id = parseInt(target_elem.innerHTML);
        twitter.view.highlight_selected_node_and_follower_nodes
        (
            id, 
            twitter.data,
            twitter.view.selected_and_following_node_ids, 
            SELECTED_NODE_FOR_FOLLOWER_COLOUR,
            FOLLOWER_NODE_COLOUR
        );

        if (twitter.view.selected_id_table_id_elem != null)
            twitter.view.selected_id_table_id_elem.removeAttribute('bgColor');

        // set table cel colour
        target_elem.setAttribute('bgColor', SELECTED_NODE_FOR_FOLLOWER_COLOUR);

        twitter.view.selected_id_table_id_elem = target_elem;
    }
}

function select_tag_table_handler(event)
{
    event_elem = event.currentTarget;
    target_elem = event.target;
    
    if (target_elem.parentElement.firstElementChild === target_elem
          && target_elem.tagName === 'TD')
    {
        tag_name = target_elem.innerHTML;

        tag_index = twitter.data.unique_tag_list.indexOf(tag_name);

        ref_id_list = twitter.data.tag_ref_id_list[tag_index];

        //reset_color_for_selected_nodes(selected_and_following_node_ids);
        twitter.view.reset_color_for_all_selected_nodes_and_tds();

        for (id of ref_id_list)
        {
          twitter.view.global_nodes.update([{id:id, color:{background:TAGGED_NODE_COLOUR}}]);
          twitter.view.selected_and_following_node_ids.push(id);
        }


        if (twitter.view.selected_tag_table_id_elem != null)
            twitter.view.selected_tag_table_id_elem.removeAttribute('bgColor');

        target_elem.setAttribute('bgColor', TAGGED_NODE_COLOUR);     

        twitter.view.selected_tag_table_id_elem = target_elem;     
    }
  }

function click_node_handler()
{
    twitter.view.network.on('click', function(properties) 
    {
        let ids = properties.nodes;

        if (ids.length === 0)
        {
            // deselecting nodes will reset collours to all selected nodes and table cells
            twitter.view.reset_color_for_all_selected_nodes_and_tds();
        }
        else
        {
            // highlight selected node and its followers
            let clicked_nodes = twitter.view.global_nodes.get(ids);

            // console.log('clicked nodes:', clicked_nodes);
            for (node of clicked_nodes)
                twitter.view.highlight_selected_node_and_following_nodes
                (
                    node.id,
                    twitter.data,
                    twitter.view.selected_and_following_node_ids, 
                    SELECTED_NODE_FOR_FOLLOWING_COLOUR,
                    FOLLOWING_NODE_COLOUR
                );
        }
    });
}

function print_data_handler()
{
    $("#print_data_area").attr('style', 'display:block');

    if (twitter.data.id_list.length > 0)
    {
        print_list('ID LIST', twitter.data.id_list);
        print_list('FOLLOWING LIST', twitter.data.following_list);
        print_list("ID's TAG LIST", twitter.data.id_tag_list);
        print_list('UNIQUE TAG LIST', twitter.data.unique_tag_list);
        print_list('TAG COUNT LIST', twitter.data.tag_count_list);

        text_elem.innerHTML += RETURN_CHARS + 'Id TABLE: ' + RETURN_CHARS + JSON.stringify(twitter.view.global_id_data_set);
        text_elem.innerHTML += RETURN_CHARS + 'Tag TABLE: ' + RETURN_CHARS + JSON.stringify(twitter.view.global_tag_data_set);

        print_lists_to_var();
    }
}

function hide_print_data_area_handler()
{
    $("#print_data_area").attr('style', 'display:none');
}

// Functions 
function change_active_colour(event) 
{
    event_elem = event.currentTarget;
    target_elem = event.target;

    if (target_elem.parentElement.firstElementChild === target_elem
            && target_elem.tagName === 'TD')
    {    
        //cell_bg_colour = target_elem.parentElement.getAttribute("bgColor");
        if (target_elem.parentElement.className == 'even')
            cell_bg_colour = '#F!F1F1';
        else
            cell_bg_colour = 'white';

        target_elem.setAttribute("bgcolor", SELECTED_NODE_FOR_FOLLOWER_COLOUR);
    }
}

function change_inactive_colour(event) 
{
    event_elem = event.currentTarget;
    target_elem = event.target;

    if (target_elem.parentElement.firstElementChild === target_elem
            && target_elem.tagName === 'TD')
    {     
        if (cell_bg_colour != '')
            target_elem.setAttribute("bgColor", cell_bg_colour);
    }
}
