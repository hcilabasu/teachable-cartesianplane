from py4j.java_gateway import JavaGateway

gateway = JavaGateway()

def index():
	return dict()

def get():
	x, y = gateway.entry_point.getXAndY()
	return '{"x":' + str(x) + ',"y":' + str(y) + '}'