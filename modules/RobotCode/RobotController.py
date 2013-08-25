#Class that allow the user to control the robot with the arrow keys.
#It opens a GUI that must be selected to control the robot


from Robot import Robot
import serial
import threading
from Tkinter import *
from time import sleep

x = Robot()

root = Tk()

forward = False
backward = False
left = False
right = False
holdTimer = 0

root.title('Robot Controller')
Label(root, text='Click here to control the robot!\n\nUse the arrow keys to move and the space bar to stop\n\nClick The Exit Button To End Communication').pack(pady=10)

def keyDown(event):
    global forward
    global backward
    global left
    global right

    if event.char == '\xef\x9c\x80':
        x.forwardArrow()
        #forward = True
    elif event.char == ' ':
        x.stop()
    elif event.char == '\xef\x9c\x81':
        x.backwardArrow()
        #backward = True
    elif event.char == '\xef\x9c\x82':
        x.leftArrow(True)
        #left = True
    elif event.char == '\xef\x9c\x83':
        x.rightArrow(True)
        #right = True

def keyUp(event):
    global forward
    global backward
    global left
    global right

    if event.char == '\xef\x9c\x80':
        x.stop()
        forward = False
        print("stopUp!")
    elif event.char == '\xef\x9c\x81':
        x.stop()
        backward = False
    elif event.char == '\xef\x9c\x82':
        x.stop()
        left = False
    elif event.char == '\xef\x9c\x83':
        x.stop()
        right = False

frame = Frame(root, width=350, height=100)
frame.bind("<KeyPress>", keyDown)
#frame.bind("<KeyRelease>", keyUp)
frame.pack()
frame.focus_force()

root.mainloop()
    
