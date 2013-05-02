#Class that allow the user to control the robot with the arrow keys.
#It opens a GUI that must be selected to control the robot


from Robot import Robot
import serial
import threading
from Tkinter import *
from time import sleep

x = Robot()

root = Tk()

root.title('Robot Controller')
Label(root, text='Click here to control the robot!\n\nUse the arrow keys to move and the space bar to stop\n\nClick The Exit Button To End Communication').pack(pady=10)

def key(event):
    if event.char == '\xef\x9c\x80':
        x.forwardArrow()
    elif event.char == ' ':
        x.stop()
    elif event.char == '\xef\x9c\x81':
        x.backwardArrow()
    elif event.char == '\xef\x9c\x82':
        x.turnLeft()
    elif event.char == '\xef\x9c\x83':
        x.turnRight()

frame = Frame(root, width=350, height=100)
frame.bind("<Key>", key)
frame.pack()
frame.focus_force()

root.mainloop()
    
