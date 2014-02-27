# -*- coding: utf-8 -*-

import zmq

context = zmq.Context()
socket = context.socket(zmq.SUB)

socket.setsockopt(zmq.SUBSCRIBE, "")
socket.connect("tcp://127.0.0.1:5000")

while True:
    timestring = socket.recv_string()
    print timestring