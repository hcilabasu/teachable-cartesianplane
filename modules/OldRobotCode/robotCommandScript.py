import serial
import threading
from time import sleep

print ("Connecting to Robot")
tty = serial.Serial(port="/dev/tty.TAG-DevB", baudrate=115200, timeout=0.01)
print ("Connected to Robot")

def stop():
    tty.write(stopmotbSTR() + stopmotcSTR())
    
def stopmotbSTR():
    return (chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x01) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00))

def stopmotcSTR():
    return (chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x02) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00))

def forward():
    tty.write(chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x01) + chr(0x64) + chr(0x07) + chr(0x00) + chr(0x00) + chr(0x20) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x02) + chr(0x64) + chr(0x07) + chr(0x00) + chr(0x00) + chr(0x20) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00))
 
def beep():
    tty.write(chr(0x06)+chr(0x00)+chr(0x80)+chr(0x03)+chr(0x0B)+chr(0x02)+chr(0xF4)+chr(0x01))

def motbforwardSTR():
    return (chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x01) + chr(0x64) + chr(0x07) + chr(0x00) + chr(0x00) + chr(0x20) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00))
    
def motcforwardSTR():
    return (chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x02) + chr(0x64) + chr(0x07) + chr(0x00) + chr(0x00) + chr(0x20) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00))
    
def motbbackwardSTR():
    return (chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x01) + chr(0x9C) + chr(0x01) + chr(0x01) + chr(0x00) + chr(0x20) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00))

def motcbackwardSTR():
    return (chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x02) + chr(0x9C) + chr(0x01) + chr(0x01) + chr(0x00) + chr(0x20) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00))

def turnRightCMD():
    tty.write(motcbackwardSTR() + motbforwardSTR())

def turnLeftCMD():
    tty.write(motbbackwardSTR() + motcforwardSTR())
    
def backwardCMD():
    tty.write(motbbackwardSTR() + motcbackwardSTR())

def read():
    while True:
        data = tty.read(10)
        if len(data) > 0:
            print 'Got:', data,
            print data.encode("hex")
        sleep(0.1)

out = True
t1 = threading.Thread(target=read, args=())
t1.start()
while (out):
    print ("\nPlease select an option:")
    print ("0 - Stop")
    print ("1 - Forward")
    print ("2 - Turn Right")
    print ("3 - Turn Left")
    print ("4 - Backwards")
    print ("8 - Beep")
    print ("9 - Quit")
    option = int(input("Selection? "))
    if (option ==0):
        stop()
    elif (option==1):
        forward()
    elif(option==2):
        turnRightCMD()
    elif(option==3):
        turnLeftCMD()
    elif(option==4):
        backwardCMD()
    elif(option==5):
        t1 = threading.Thread(target=read, args=())
        tty.write(chr(0x02) + chr(0x00) + chr(0x01) + chr(0x9B))
    elif (option==8):
        beep()
    elif (option==9):
        out = False
        print ("\nClosing Connection with Robot\n")
        tty.close()
        print ("Connection Closed\n\n")
    else:
        print("Option not available")
    
    
    
