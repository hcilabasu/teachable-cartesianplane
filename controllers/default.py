import os
import socket
from xmlrpclib import ServerProxy
from gluon.shell import exec_environment
from gluon.contrib.websocket_messaging import websocket_send

filename = os.path.join(request.folder, 'static', 'geoApp.html')
server = ServerProxy('http://127.0.0.1:8000/GeogebraInterface/default/call/xmlrpc')

__current_ip = '127.0.0.1'
# __current_ip = '169.254.67.33'
__socket_group_name = 'applet'
__socket_port = '8888'

# -*- coding: utf-8 -*-
### required - do no delete
def user(): return dict(form=auth())
def download(): return response.download(request,db)
def call(): 
    session.forget()
    return service()
### end requires
def index():
    #Adrin added this for prompts
    # prompts = db(db.problemPrompts).select()
    # return dict(prompts=prompts)
    return dict() #original before Adrin changed it.
    
def applet():
    #Adrin added this for prompts
    prompts = db(db.problemPrompts).select()

    promptsJSON = "["
    promptsJSON += ",".join([stringifyPrompts(p) for p in prompts])
    promptsJSON += "]"

    return dict(applet=XML(open(filename).read()), ip=__current_ip, port=__socket_port, group_name=__socket_group_name, prompts=promptsJSON)

#Adrin added this
def stringifyPrompts(prompt):
    json = '"'
    json += prompt.problemId
    json += '"'

    
    # json += '": {"label":"'
    # json += prompt.label
    # json += '",'
    # json += '"parameters":['
    # json += ",".join(['"' + p + '"' for p in prompt.parameters])
    # json += '],'
    # json += '"steps":['
    # json += ",".join(['"' + s + '"' for s in prompt.steps])
    # json += '],'
    # json += '"trigger":"'
    # json += prompt.trigger
    # json += '",'
    # json += '"origin":"'
    # json += prompt.origin
    # json += '"'
    # json += '}'
    return json
    
def loadOptions():
    websocket_send('http://' + __current_ip + ':' + __socket_port, response.json(request.vars), 'mykey', 'interface')
    
    # return server.loadOptions(response.json(request.vars))
    ##return(response.json(request.vars))
    
    ##
    ##return server.loadOptions(request.vars)
    ##s.update(value="3")
    ##return server.loadOptions()

    
def echo():
    return "Hello World"
   
def program():
    return dict()

def error():
    return dict()

## the server polls for an update to the current step
def pollForEvent():
    return db(db.menuOptions2.name == 'test').select()[0].value

def post_Solution_Check():
    #current_problem = db(db.problemBank.id == session.problemNum).select()[0]
    #currentProblemJSON = stringifyProblem(current_problem, "check")
    #return dict(problems=currentProblemJSON)
    #session.problemNum = request.vars.index
    #data = currentProblemJSON
    data = request.vars.data
    # The group name 'interface' is what mobile is registered to. You can see it in the config file on the mobile side.
    websocket_send('http://' + __current_ip + ':' + __socket_port, data, 'mykey', 'interface')
    # websocket_send('http://localhost:' + __socket_port, data,'mykey', __socket_group_name)

def set_Problem_Number():
   data = request.vars.data
   websocket_send('http://' + __current_ip + ':' + __socket_port, data, 'mykey', 'interface')

def log():
    data = request.vars.data
    websocket_send('http://' + __current_ip + ':' + __socket_port, data, 'mykey', 'interface')

def send_data_to_mobile():
    data = request.vars.data
    websocket_send('http://' + __current_ip + ':' + __socket_port, data, 'mykey', 'interface')

## executes the current step on the server
## TODO remove.
@service.xmlrpc
def executeEvent(data):
    ''' DEPRECATED '''
    db.menuOptions2.update_or_insert(db.menuOptions2.name=='test', name='test', value=data)
    websocket_send('http://' + __current_ip + ':' + __socket_port, data, 'mykey', __socket_group_name)
    return data

@service.xmlrpc
def executeSteps(data):
    ''' DEPRECATED '''
    websocket_send('http://' + __current_ip + ':' + __socket_port, data, 'mykey', __socket_group_name)
    return data