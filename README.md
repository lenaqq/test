# Social Network Visualisation 

This web application visualises a small social network using some Twitter data. 

## Requirement
Google Chrome Version 60.0.3112.101

## Web Page Layout
The layout of the web pages consists of four regions:
* Command list on the left: 
  * **Add**: Add ten following relationships to the network and associated tags;
  * **Clear**: Clear the network to restart composing;
  * **Test**: Read relationships and tags from a file. This is for test purpose only. It should not appeared in the released version;
  * **Print**: Print data for debugging, for test purpose only. It should not appeared in the released version.

* Network view in the middle: the main view in this web page showing the peoples ids as nodes, their following peoples and their followers represented by arrows connecting nodes. The nodes are identified by people's ids.
* Two tables on the right: Top table showing the people's ids, following ids and associated tags while the bottom table showing the tags, frequencies, and ids referred to the corresponding tags.
* Statistic panel on the left: shows total numbers of Ids, Relationships, tags, and the ids have most followers and ids has most followings.

## User Interactions
When Add button or Test button is clicked, the network of nodes and their relations will be displayed. The newly added nodes will be in dark green. You can do any of the following actions with mouse's scrolling wheal and the left button:
* Zoom in and out of the network view by mouse scroll wheel;
* Pan the network view by pressing mouse button and drag;
* Reset the nodes to creamy colour by clicking on white area (not on a node or edge); 
* Highlight a node and its following nodes (different from the selected node) by clicking a node;
* Relayout the network by drag a node. However, due to the physics model used by the network graphics library (Vis.js), the stablelised layout might be same as before you started dragging the node;
* Highlight a node and its followers (different from the selected node) by clicking on an id in the Id Table's first coloumn;
* Highlight all nodes whose ids referred to a tag selected by clicking referred by clicking on an id in the Tag Table's first coloumn;
* Search id or tag in any of the two tables;
* Sort Ids by clicking Id column of the Id Table;
* Sort Tags by clicking Tag column of the Tag Table;
* Sort Tag Frequency by clicking Fruequency column of the Tag Table;

## Implementation
### Vis.js
I have used Vis.js (version 4) to visualise networks. It is powerfull and easy to use. The network can handle a few thousand nodes and edges smoothly on any modern browser for up to using clustering. Network uses HTML canvas for rendering. 
The default physic model used is BarnesHut, a quadtree based gravity model. This is the fastest, default and recommended solver for non-hierarchical layouts. The behaviour of the layout can be changed by configuring model's parameters such as gravity and spring properties.

### DataTable
DataTables is a plug-in for the jQuery Javascript library, implemented by https://datatables.net/.

### Foundation

### Test
A test file 'test_samples.js' contains sample data of following relationships and tags fetched ten times using the sample() and tag() functions. Currently. 
The test button is used to add all the nodes obtained from the following relationships and tags.

Print button can be used to flush out the id list, following list, unique tag list, etc. If you want to store the data for future test, you can copy the text starting 'var test_samples = ' and end at '];'.

### To Do List
* Add a overview window to show the viewport in respect of the total view
* cursor of selected id or tag
* legends of colours
* Read test file from a dialogbox


## Data

The people in the network are represented by their integer IDs. There is only one kind of relationship between people: the following relationship. Person A following person B is represented as a two-element array: [idOfA, idOfB]. People in a social network can participate in discussons of some topics. Each topic is represented by a tag like "#programming". So each person can have a list of tags representing the topics in which they have been involved.

## Getting Data

We have prepared two simple functions for you to access the data. They are contained in the JavaScript file `store.js` packed with this coding task. After including this file into your web page, you will have a global object `window.store` which contains two function members:

    /**
     * Fetches a list of 10 random following relations in the network.
     *
     * If the successFn argument is provided, it is used as a callback function
     * which accepts the resulting data as its argument. If the successFn argument
     * is not provided, this function will return a Promise object which will be
     * resolved with the resulting data.
     *
     * The resulting data will look like this: [[7136782, 15903746], [1807861, 1374411], ...]
     *
     * @param {function} [successFn] - The optional callback function.
     * @return {?Promise}
     */
    function sample(sucessFn)

    /**
     * Get the list of tags of each person represented by their ID.
     *
     * If both the successFn argument and the failureFn argument are provided,
     * the successFn argument is used as a callback function which accepts the
     * resulting data as its argument, and the failureFn argument is used as
     * an error handler which accepts an Error object. If either of them is not
     * provided, this function will return a Promise object which will be resolved
     * with the resulting data or rejected with an Error object.
     *
     * The resulting data will look like:
     * [["#worldpeace", "#newyear"], ["@ruby", "#python", "@java"], ...]
     * which has the same length as the number of IDs provided in the ids argument.
     *
     * @param {number[]|string} ids - Either an array of integers or a string of
     *                                comma-seperated integers like "1,2,3".
     * @param {function} [sucessFn] - The optional callback function for resulting data.
     * @param {function} [failureFn] - The optional callback function for error handling.
     */
    function tags(ids, sucessFn, failureFn)

# Design
## Classes
```javascript
class NetworkData

class NetworkView

class VisNetworkView extends NetworkView       // using Vis.js. Ut could use different network display model

class SocialNetwork
{
    constructor()
    {
       this.data = new NetworkData();
       this.view = new VisNetworkView();
    }
}
```

## Environment

Two files are provided along with this coding task: `store.js` and `index.html`. The 'index.html' page is simply a demo of using `store.js`. You can start your coding from there. However, you can use any framework you wish to construct the app.

## Requirements

Please create a single page web application with the following functions:

1. An ADD button that can compose a social network by drawing samples from `store.js`. Repeatedly drawing samples should grow the social network.
2. A CLEAR button that can clear the social network data to restart composing.
3. A visualization of the social network.
4. A visualization of one statistic about the social network: tag frequencies. That is, for the current social network, display the aggregated tag frequencies of the whole network.
