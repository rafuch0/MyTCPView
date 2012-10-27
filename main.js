var http = require('http');
var io = require('socket.io');
var util = require('util');
var pcap = require('pcap');

server = http.createServer(ServerMain);
server.listen('8081');

var tcpTracker = new pcap.TCP_tracker();
tcpTracker.on('start', startTracking);
tcpTracker.on('end', endTracking);

var pcapSession = pcap.createSession("eth0", "ip proto \\tcp");
pcapSession.on("packet", trackPacket);

var socket = io.listen(server);
socket.on('connection', NewClient);

var clients = new Array();
var tmpPacket;

var printProperties = ["src_name", "dst_name", "state", "send_bytes_payload", "recv_bytes_payload"];

setInterval(broadcastSessions, 1000);

function ServerMain(req, res)
{
	res.writeHead(200, {'Content-Type': 'text/html'});

	var pageData = '';

	pageData += '\
		<html><head> \
		<script src="/socket.io/socket.io.js"></script> \
		</head><body> \
		<script> \
			var socket = io.connect("/"); \
			var tmp; \
\
			function recvMsg(data) \
			{ \
				tmp = ""; \
				for(session in data.sessions) \
				{ \
					for(property in data.sessions[session]) \
					{ \
						tmp += property+"="+data.sessions[session][property]+" "; \
					} \
					tmp += "<br>"; \
				} \
\
				document.getElementById("pcap").innerHTML = tmp; \
			} \
\
			socket.on("pcapentry", recvMsg); \
		</script> \
		<div id="pcap"></div><br> \
		</body></html>\
	';

	res.end(pageData);
}

function NewClient(client)
{
	client.on('disconnect', function()
	{
		console.log('Client '+this.id+' Disconnected');
		clients = clients.splice(this);
	});

	client.id = clients.length+1;

	console.log('Client '+client.id+' Connected');

	clients.push(client);
}

function trackPacket(packet)
{
	packet = pcap.decode.packet(packet);
	tcpTracker.track_packet(packet);
}

var sendData;
function broadcastSessions()
{
	sendData = {};

	for(session in tcpTracker.sessions)
	{
		if(tcpTracker.sessions[session]['state'] == 'ESTAB')
		{
			sendData[session] = {};

			printProperties.every(
				function(entry)
				{
					sendData[session][entry] = tcpTracker.sessions[session][entry];
					return true;
				}
			);
		}
	}

	clients.every(
		function(entry)
		{
			entry.broadcast.volatile.emit('pcapentry', { sessions: sendData });
			return false;
		}
	);
}

function startTracking(session)
{
	broadcastSessions();
}

function endTracking(session)
{
	broadcastSessions();
}

