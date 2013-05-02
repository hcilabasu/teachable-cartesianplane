import serial
import threading
from Tkinter import *
from time import sleep

print ("Connecting to Robot")
tty = serial.Serial(port="/dev/tty.TAG-DevB", baudrate=115200, timeout=0.01)
print ("Connected to Robot")
    
def stopmotbSTR():
    return (chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x01) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00))

def stopmotcSTR():
    return (chr(0x0C) + chr(0x00) + chr(0x80) + chr(0x04) + chr(0x02) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00) + chr(0x00))

def stop():
    self._tty.write(self.stopmotbSTR() + self.stopmotcSTR())

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

#out = True
#t1 = threading.Thread(target=read, args=())
#t1.start()
root = Tk()
prefor = False

def key(event):
    if event.char == '\xef\x9c\x80':
        forward()
    elif event.char == ' ':
        stop()
    elif event.char == '\xef\x9c\x81':
        backwardCMD()
    elif event.char == '\xef\x9c\x82':
        turnLeftCMD()
    elif event.char == '\xef\x9c\x83':
        turnRightCMD()

frame = Frame(root, width=100, height=100)
frame.bind("<Key>", key)
frame.pack()
frame.focus_force()

root.mainloop()
    
    
