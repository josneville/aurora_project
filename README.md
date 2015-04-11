# Description
My project for Aurora Technologies

# Pre-requisites
For the project to work, you will need to have Node.JS, NPM and Neo4J Installed

# Stack
Front-End: AngularJS
Back-end: NodeJS + ExpressJS
Database: Neo4J

# Features
* Adding a single agent, multiple agents and single event as described by the document
* All data is streamed through sockets in REAL-TIME. Therefore, one never has to reload the page to see new nodes and relationships appear
* Search through any existing agent and it will show you all the relationships and nodes that are related to your search query. Just press enter after the search to see search results
* Validation
  * Only acceptable Events
  * Existence of all agent information for each agent in a given array
  * Check whether the worth/amount given is a valid number
  * Check if the fromAgent has enough worth to be able to make a transaction
* Mousing over on any node or relationship will give details above that specifics entities information
* All information is color-coded universally for a proper visualization

* Would have added the deletion feature (and have the code for it on the backend) but I realized that financial information is never really deletable. Once a transaction is made, it's remembered forever.
