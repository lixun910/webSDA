import websocket
import thread
import time
import json
import pysal

SELECT_IDS = []

def on_message(ws, message):
  data = json.loads(message)
  print message
  global SELECT_IDS
  SELECT_IDS = data['SELECTED']

def on_error(ws, error):
    print error

def on_close(ws):
    print "### closed ###"

def on_open(ws):
    def run(*args):
        while True:
            time.sleep(10)
            #ws.send("Hello %d" % i)
            ws.send("{'SELECTED':['06053']}")     
        time.sleep(1)
        ws.close()
        print "thread terminating..."
    thread.start_new_thread(run, ())


if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://localhost:9000/",
                                on_message = on_message,
                                on_error = on_error,
                                on_close = on_close)
    ws.on_open = on_open

    shp = pysal.open(pysal.examples.get_path("NAT.shp"))
    dbf = pysal.open(pysal.examples.get_path("NAT.dbf"))
    #w = pysal.rook_from_shapefile(pysal.examples.get_path("NAT.shp"))
    #hist = dbf.by_col("STATE_FIPS")
    #xs = [dbf.by_col("STATE_FIPS"),dbf.by_col("FIPS"),dbf.by_col("HR60")]
   
    ws.run_forever()
    
