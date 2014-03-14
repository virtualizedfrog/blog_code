# -*- coding: utf-8 -*-

import sys
import zmq
import datetime
import TimestampData_pb2

context = zmq.Context()
socket = context.socket(zmq.SUB)
socket.connect("tcp://127.0.0.1:5000")
socket.setsockopt(zmq.SUBSCRIBE, "")

while True:
    rawdata = socket.recv()
    data = TimestampData_pb2.TimestampData()
    data.ParseFromString(rawdata)
    print datetime.datetime(1, 1, 1) + datetime.timedelta(microseconds = data.Timestamp / 10), data.Key, data.Data
