# Social Network Visualisation Web Application

SNetVis is a Social Network Visualisation web application for a small social network using some Twitter data. 

## Environment
Google Chrome Version 60.0.3112.101 or later. 
This application should work in browsers with ECMAScript 2015, but it has not been tested. 

## How to run the web application
* Download the project **test** from https://github.com/lenaqq/test and unzip in your test folder, eg, 'd:/tmp/coding-test'
* Drag the index.html to your Google Chrome browser or type 'file:///D:/tmp/coding-test/index.html' in your browser
* Check GUI section for web page layout and user interactions.

## GUI
### Web Page Layout
<img src="netvis_layout.png" alt="Drawing" style="width: 100%" border="1px"/><br>
The layout consists of four regions:
* Command list on the left: 
  * **Add**: Fetch ten 'following' relationships, build a new id list, and add new ids and relationships to the network. Tags for the new ids are also added. The updated network is displayed.
  * **Clear**: Clear the network to restart composing;
  * **Test**: Read relationships and tags from a test file which can contain any number of 'following' relationships. The current test file has 63 nodes, 95 relationships and 437 tags.
  * **Print**: Print data for debugging on a panel at the bottom (not shown in above image). This panel is displayed when the **Print** button is clicked. 
  * **Hide Print**: Hide Print data panel. 

  The last three buttons in grey should not be appeared in the released version. They are for test purpose only.

* Network view in the middle: the main view in this web page shows people's ids as nodes and the 'following' relationships as arrowed edges. Person A following person B is represented as an arrow from node idOfA to  node idOfB.
* Two tables on the right: Id Table at the top shows people's ids, 'following' ids and associated tags. Tag Table at the bottom shows unique tags, frequencies (number of tags referred by people), and people's ids referred to the corresponding tags.
* Statistic panel on the left-bottom: It shows total numbers of ids, 'following' relationships, tags, and the ids have most followers and ids have most followings.

### User Interactions
When **Add** button or **Test** button is clicked, the new network of nodes and edges will be displayed. The newly added nodes will be highlighted. You can visualise the network by the following actions with mouse's scrolling wheal and the left button:
* Zoom in and out of the network view by moving the mouse scroll wheel.
* Pan the network view by pressing mouse button on an empty area of the network view and drag. An empty area is anywhere but not a node nor an edge in the network view.
* Reset the colours of the nodes by clicking on an empty area. 
* Relayout the network by dragging a node. However, due to the physics model used by the network graphics library (Vis.js), the stablelised layout might be the same as before dragging the node. You can drag a node to a different position to avoid crossing arrows.
* Highlight a node and its 'following' nodes by clicking on a node.
* Highlight a node and its 'follower' nodes (opposite to 'following' nodes) by clicking on an id in the Id Table's first coloumn; Together with the 'following' ids in the next column in the Id Table you can view all directly related nodes of the selected node or id. 
* Highlight all nodes that referred to a selected tag by clicking on a tag in the Tag Table's first coloumn. You can see how many times of this tag has been referred and who referred this tag.
* Search id or tag from the tables. Id Table and Tag Table have their own search box.
* Sort data by clicking on a column header of the table, eg, sort ids in Id Table, sort tags in alphanumeric order and sort tag frequency in Tag Table. '#' tags and '@' tags can be grouped by sorting. Most referred tags can be ordered by sorting.

# Design
## Classes
Main classes are defined as below and an instance of the SocialNetwork is created for Twitter.

**class NetworkData**
>    Contains data for id_list, following_list, tag_list, and house keeping variables and data related functions.

**class NetworkView**
>    Contains all house keeping data for selected nodes and their followers and followings, tables, statistic panel in HTML document,  except network. 

**class VisNetworkView extends NetworkView**            // using Vis.js. It could use different network visualisation framework
>    Derived class from NetworkView. It contains network built by nodes and edges using vis.DataSet() and vis.Network() and all data from base class NetworkView.

**class SocialNetwork**
>    Contains NetworkData and VisNetworkView;

Create an instance of Twitter network:
    **twitter = new SocialNetwork();**

## Event Handlers
Event handlers are currently designed as global functions that can be set in the HTML file, index.html. The event handlers can access the 'twitter' instance to get both network data and network view.

## MVC
In terms of MVC architecure, the application is composed of:
* Model - class NetworkData
* View - class NetworkView
* Controller - event handlers

## Design Notes
* In a real social network which has more information about people and their relationships, a more general class of **NetworkData** can be defined to include **People** and **Relationships**. While the class **Person** has id, name, age, id photo, birth place, etc, the class **Relationship** can be defined with 1:1 or 1:m relationships. When visualising the network, people's photos can be displayed, or people can be grouped and viewed based on the age, birth place, even by the skin colour using the id photos. Thus, more interesting features can be discovered and studied.

* **VisNetworkView** can be configured using Vis's options. Multiple views can be designed to display the network in different ways such using different node shapes, colours, interactions and physics models. Multiple views can be displayed where each full view is displayed by selecting a corresponding tab (at the top of the network view). Or multiple views are displayed at the same time by tiled layout.

* When there are many nodes on the network view, highlighted node and its adjacent nodes for 'following' or 'follower' nodes might not be standout although their colour have been changed. One solution is to popup a small window to display only the selected node and its adjacent nodes in a circular layout.

* When zoom in and out, it is a best to have a small window at the corner of the network view to show the relative viewport to the whole network.

## Implementation
### Vis.js
Vis.js (version 4) is used for visualising the Twitter network (http://visjs.org). This is a powerful tool for 2D/3D graphs, timelines, and especially for network. It handles large amounts of dynamic data and the interaction with the data. It is easy to use comparing to D3. The network can handle a few thousand nodes and edges smoothly on any modern browser. To handle a larger amount of nodes, Network has clustering support. It uses HTML canvas for rendering. 
The default physics model used is BarnesHut, a quadtree based gravity model. This is the fastest, default and recommended solver for non-hierarchical layouts. The behaviour of the layout can be changed by configuring model's parameters such as gravity and spring properties.
Vis.js is dual licensed under both Apache 2.0 and MIT.

### DataTable
DataTables is a plug-in for the jQuery Javascript library, implemented by https://datatables.net/. Tables can be scrolled in both vertical and horizontal directions. Data in each column can be sorted the number of records or rows displayed displayed and a search box is embedded. 
It is MIT licensed.  

### Foundation
It is a responsive front-end framework for website design. Foundation's grid system is used for the web page layout.

### Source Files
* HTML file
  * index.html
* CSS file
  * netvis.css
* JavaScript files
  * store.js (provided by Data61)
  * network_data.js
  * network_view.js
  * social_network.js
  * event_handlers.js
  * helpers.js
* Test file
  * test_samples.js
* Image file
  * netvisicon.png

## Test
A test file 'test_samples.js' contains sample data of 'following' relationships and tags fetched for the ids identified from the 'following' relationship. These data are collected from runs of the application and printed to a variable 'test_samples'. 

**Test** button is used to add all the nodes and edges by reading the 'following' relationships and tags from 'test_samples.js'.

**Print** button can be used to flush out the id list, following list, unique tag list, construction of the network, etc. If you want to store the fetched sample data for future test, you can copy the text starting from 'var test_samples = ' to '];', and save it to test_samples.js. At the moment, only this file is read for testing. Other file formats including JSON format can be implemented in future. A file diallog box can be implemented to read any data file.

### Functional Test
Reading 'test_samples.js' and compare the printed data can be used for testing the correct construction of the network and tag references. 

### GUI Test
A sequence of actions is used to test the layout of the page, network view, tables, and statistic & print data panels. An examples of the action sequence could be: 
Add button, Add button, Reset, Add button, Reset, Click node, Click node, Zoom In/Out, Pan, Reset, Select Id, Select Id, Scroll Id Table, Sort Id, Search Id, Select Id, Select Tag, Select Tag, Select Id, Select Node, Clear button, Add button, Test button, Print button, Hide Print button. 

There is a know bug on reset selected node when clicking on an id from the Id Table or on a tag from the Tag Table. It is recommended to deselect the selected node by clicking on an empty area. Further investigation is required to look at Vis's APIs. 

### Performance Test
Performance test should be undertaken for large amounts of nodes. Auto adjustment of the parameters of the physics model based on the number of nodes in the network might be investigated to find best performance for network layout. 

### Web Browser
This application should work in browsers with ECMAScript 2015, it but has not been tested yet. 
It is not working on IE 11.


# Coding Task (from Alex)

The goal is to create a web application that visualises a small social network using some Twitter data.

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

## Environment

Two files are provided along with this coding task: `store.js` and `index.html`. The 'index.html' page is simply a demo of using `store.js`. You can start your coding from there. However, you can use any framework you wish to construct the app.

## Requirements

Please create a single page web application with the following functions:

1. An ADD button that can compose a social network by drawing samples from `store.js`. Repeatedly drawing samples should grow the social network.
2. A CLEAR button that can clear the social network data to restart composing.
3. A visualization of the social network.
4. A visualization of one statistic about the social network: tag frequencies. That is, for the current social network, display the aggregated tag frequencies of the whole network.
