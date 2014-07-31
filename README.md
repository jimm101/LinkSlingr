# LinkSlingr

This is a Chrome extension to open a web page on a remote computer.  

**NOTE:** A host computer is required.  [NodeJs]('http://nodejs.org') is required to run your own host.  

**NOTE:** I have not yet registered this plugin, so you need to do the manual install below.


## Geting Started

This plugin requires at least two computers, one as a host, and at least one clients.
Start by downloading the code.


### Set up a host

* Open a shell and navigate to the ``LinkSlingr/server`` directory.
* Run the host with ``$ node LinkSlingd.js``,
or use [forver](https://github.com/nodejitsu/forever) ``forever LinkSlingd.js``  

**NOTE:** You can also use the host as a client.


### Set up a client

* Navigate a chrome browser to chrome://extensions/.  
* Click ``developer mode``.  Click ``Load unpacked extension...`` and select the chrome_extension directory.
* Click Options.  Under ``LinkSlingr Server URL:`` enter ``host_ip:14014``.


## License

MIT
