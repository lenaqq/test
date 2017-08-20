class SocialNetwork
{
    constructor()
    {
        this.data = new NetworkData();
        this.view = new VisNetworkView();
    }
}

const NODE_COLOUR                         = '#EAE7E4';
const ADDED_NODE_COLOUR                   = '#33BBAA';
const SELECTED_NODE_FOR_FOLLOWING_COLOUR  = '#33BBAA';
const SELECTED_NODE_FOR_FOLLOWER_COLOUR   = '#33BBAA';
const SELECTED_NODE_COLOUR                = '#33AFAA';
const TAGGED_NODE_COLOUR                  = '#FFAFAA';
const FOLLOWING_NODE_COLOUR               = '#E8C7BE';
const FOLLOWER_NODE_COLOUR                = '#E8C766';
const EDGE_COLOUR                         = '#9193FF';

const RETURN_CHARS = '&#13;&#10;';

let cell_bg_colour = '';

/*
 * Create an instance of SocialNetwork and initialise the view.
 */
var twitter = new SocialNetwork();

function start_netvis()
{
	twitter.view.init_view();
}