from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer
import json

ACTIVE_WPCLIENTS = set()

class SimpleEcho(WebSocket):

    def handleMessage(self):
        if self.data is None:
            self.data = ''
    
        print self.data
        # echo message back to client
        for client in self.server.connections.itervalues():
            if client != self:
                try:
                    #data = json.loads(self.data)
                    #if isinstance(data, dict):
                    #    if 'SELECTED' in data:
                    #        data['SELECTED']      
                    client.sendMessage(str(self.data))
                except Exception as n:
                    print 'err:',n

    def handleConnected(self):
        print self.address, 'connected'
        global ACTIVE_WPCLIENTS
        ACTIVE_WPCLIENTS.add(self.address)        
        for client in self.server.connections.itervalues():
            if client != self:
                try:
                    client.sendMessage(str(self.address[0]) + ' - connected')
                except Exception as n:
                    print 'err:',n

    def handleClose(self):
        print self.address, 'closed'
        for client in self.server.connections.itervalues():
            if client != self:
                try:
                    client.sendMessage(str(self.address[0]) + ' - disconnected')
                except Exception as n:
                    print 'err:', n

server = SimpleWebSocketServer('', 9000, SimpleEcho)
server.serveforever()
