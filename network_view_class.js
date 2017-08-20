/*
 * NetworkView
 * 
 * The network view contains the region for draw the network, id table and tag tables on the right,
 * display panel for some statistics on the left, and data print area at the bottom.
 */
class NetworkView
{
    constructor()
    {
        this.selected_and_following_node_ids = [];
        this.selected_and_follower_node_ids = [];
        this.selected_id_table_id_elem = null;
        this.selected_tag_table_id_elem = null;
    }

    clear()
    {
        this.selected_and_following_node_ids = [];
        this.selected_and_follower_node_ids = [];
        this.selected_id_table_id_elem = null;
        this.selected_tag_table_id_elem = null;      
    }

    update_tables(global_id_data_set, tag_data_set)
    {
        /*
         * Update view
         */
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
            paging:         false,
            "dom": '<"toolbar_id_table">frtip'        
          } );
        $("div.toolbar_id_table").html('<b>Id Table</b>');   

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
            paging:         false,
            "dom": '<"toolbar_tag_table">frtip'
        } );

        $("div.toolbar_tag_table").html('<b>Tag Table</b>');           
    }

    update_stats(network_data)
    {
        $('#num_ids').html(network_data.id_list.length.toString());
        $('#num_edges').html(network_data.following_list.length.toString());
        $('#num_tags').html(network_data.unique_tag_list.length.toString());

        let max_id_follower_pair_list;
        let max_id_following_pair_list;
        let max_ids_followers = '';;
        let max_ids_followings = '';
        let num_followers = 0;
        let num_followings = 0;

        if (network_data.id_list.length > 0)
        {
            max_id_follower_pair_list = network_data.find_most_followed_id();
            if (max_id_follower_pair_list.length > 0)
            {
                max_ids_followers = max_id_follower_pair_list[0].join(', ');
                num_followers = max_id_follower_pair_list[1];
            }

            max_id_following_pair_list = network_data.find_most_following_id();
            if (max_id_following_pair_list.length > 0)
            {
                max_ids_followings = max_id_following_pair_list[0].join(', ');
                num_followings = max_id_following_pair_list[1];
            }

            $('#most_followed_id').html(max_ids_followers.toString());
            $('#num_followers').html(num_followers.toString());
            $('#statpanel-1').attr('style', 'visibility:visible');

            $('#most_following_id').html(max_ids_followings.toString()); 
            $('#num_followings').html(num_followings);
            $('#statpanel-2').attr('style', 'visibility:visible');            
        }
        else
        {
            $('#statpanel-1').attr('style', 'visibility:hidden');
            $('#statpanel-2').attr('style', 'visibility:hidden');
        }
    }   

    update_tables_and_stats(network_data, global_id_data_set, tag_data_set) 
    {
        this.update_stats(network_data);
        this.update_tables(global_id_data_set, tag_data_set);
    }
}

/*
 * VisNetworkView
 *
 * Derived from NetworkView class. It uses Vis.js for display network.
 *
 */
class VisNetworkView extends NetworkView
{
    constructor()
    {
        super();
        // Vis network data
        this.global_nodes = null;
        this.global_edges = null;    
        this.network = null;
        this.option = null;
    }

    init_view()
    {
        this.global_nodes = new vis.DataSet();
        this.global_edges = new vis.DataSet(); 

        /*
         * Create network using Vis.js
         */
        let container = document.getElementById('twitter_network');
        let data = { 
            nodes: this.global_nodes,
            edges: this.global_edges
        };
        
        this.options = {
            //autoResize: false,
            //width: '100%', 
            //height: '100%',     
            nodes: {
                color: { 
                    background: NODE_COLOUR,
                    highlight: { 
                        background: SELECTED_NODE_COLOUR,
                        border: '4px'  
                    }
                },
                // borderWidth:4,
                //size:30,
                // font:{ color:'#eeeeee' }
            },
            edges: {
                color: EDGE_COLOUR
            },
            interaction:{
                hover: true
            }
        };
        
        this.network = new vis.Network(container, data, this.options);
        this.network.fit();

        /*
         * Set onclick node event listner
         */
        this.network.on('click', function(properties) 
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

                for (let node of clicked_nodes)
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

        this.update_tables([], []);
        this.update_stats(twitter.data);

        $("#print_data_area").attr('style', 'display:block');

    }

    add_nodes_to_view(new_id_list)
    {
      for (let id of new_id_list)
      {
          addNodeWithColor(this.global_nodes, id, ADDED_NODE_COLOUR);
          this.selected_and_following_node_ids.push(id);
      }
    }

    reset_color_for_selected_nodes(selected_node_ids)
    {  
        for (i = 0; i < selected_node_ids.length; i++)
        { 
            let node_id = selected_node_ids[i];
            // console.log('remove ' + node_id);
            twitter.view.global_nodes.update([{id:node_id, color:{background:NODE_COLOUR}}]);
        }

        selected_node_ids = [];
    }

    reset_color_for_all_selected_nodes_and_tds()
    {
        this.reset_color_for_selected_nodes(this.selected_and_following_node_ids);
        this.reset_color_for_selected_nodes(this.selected_and_follower_node_ids);

        if (this.selected_id_table_id_elem != null)
            this.selected_id_table_id_elem.removeAttribute('bgColor');

        if (this.selected_tag_table_id_elem != null)
            this.selected_tag_table_id_elem.removeAttribute('bgColor');
    }

    highlight_selected_node_and_following_nodes(id, network_data, selected_node_ids, selected_node_colour, adj_node_colour)
    {
        //reset_color_for_selected_nodes(selected_node_ids);
        this.reset_color_for_all_selected_nodes_and_tds();

        // Highlight new selected nodes
        this.global_nodes.update([{id:id, color:{background:selected_node_colour}}]);
        selected_node_ids.push(id);

        let id_idx = network_data.id_list.indexOf(id);
        let folowing_list = global_id_data_set[id_idx][1]; // following id list

        for (let following_id of folowing_list)
        {
            twitter.view.global_nodes.update([{id:following_id, color:{background:adj_node_colour}}]); 
            selected_node_ids.push(following_id);
        }
    }

    highlight_selected_node_and_follower_nodes(id, network_data, selected_node_ids, selected_node_colour, adj_node_colour)
    {
        //reset_color_for_selected_nodes(selected_node_ids);
        this.reset_color_for_all_selected_nodes_and_tds();

        // Highlight new selected nodes
        this.global_nodes.update([{id:id, color:{background:selected_node_colour}}]);
        selected_node_ids.push(id);

        id_idx = network_data.id_list.indexOf(id);

        let folowing_list = global_id_data_set[id_idx][1]; // following id list

        for (let following_relation of network_data.following_list)
        {
            // sole.log(following_relation[0] + ', ' + following_relation[1]);
            if (id == following_relation[1])
            {
              this.global_nodes.update([{id:following_relation[0], color:{background:adj_node_colour}}]); 
              selected_node_ids.push(following_relation[0]);
            }
        }
    }
}
