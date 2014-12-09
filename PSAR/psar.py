# -*- coding: utf-8 -*-

"""
http://virtualizedfrog.wordpress.com/   2014


Translated from http://www.amibroker.com/library/detail.php?id=268
Requires pandas to load csv files, and matplotlib to chart the data

The main expects table.csv file. Valid files can be downloaded on Yahoo Finance
eg: http://real-chart.finance.yahoo.com/table.csv?s=%5EGSPC&ignore=.csv
"""

import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt

def psar(barsdata, iaf = 0.02, maxaf = 0.2):
    length = len(barsdata)
    dates = list(barsdata['Date'])
    high = list(barsdata['High'])
    low = list(barsdata['Low'])
    close = list(barsdata['Close'])
    psar = close[0:len(close)]
    psarbull = [None] * length
    psarbear = [None] * length
    bull = True
    af = iaf
    ep = low[0]
    hp = high[0]
    lp = low[0]
    
    for i in range(2,length):
        if bull:
            psar[i] = psar[i - 1] + af * (hp - psar[i - 1])
        else:
            psar[i] = psar[i - 1] + af * (lp - psar[i - 1])
        
        reverse = False
        
        if bull:
            if low[i] < psar[i]:
                bull = False
                reverse = True
                psar[i] = hp
                lp = low[i]
                af = iaf
        else:
            if high[i] > psar[i]:
                bull = True
                reverse = True
                psar[i] = lp
                hp = high[i]
                af = iaf
    
        if not reverse:
            if bull:
                if high[i] > hp:
                    hp = high[i]
                    af = min(af + iaf, maxaf)
                if low[i - 1] < psar[i]:
                    psar[i] = low[i - 1]
                if low[i - 2] < psar[i]:
                    psar[i] = low[i - 2]
            else:
                if low[i] < lp:
                    lp = low[i]
                    af = min(af + iaf, maxaf)
                if high[i - 1] > psar[i]:
                    psar[i] = high[i - 1]
                if high[i - 2] > psar[i]:
                    psar[i] = high[i - 2]
                    
        if bull:
            psarbull[i] = psar[i]
        else:
            psarbear[i] = psar[i]

    return {"dates":dates, "high":high, "low":low, "close":close, "psar":psar, "psarbear":psarbear, "psarbull":psarbull}

if __name__ == "__main__":
    import sys
    import os
    
    if len(sys.argv) < 2:
        sys.exit("Usage: %s datafile.csv" % sys.argv[0])
    if not os.path.exists(sys.argv[1]):
        sys.exit("Error: can't open file '%s': No such file" % sys.argv[1])

    barsdata = pd.read_csv('table.csv')
    #Reindex the data: ascending dates are expected in the function
    barsdata = barsdata.reindex(index=barsdata.index[::-1])
    #Convert strings to actual timestamps
    barsdata['Date'] = [datetime.strptime(x, '%Y-%m-%d') for x in barsdata['Date']]

    startidx = 0
    endidx = len(barsdata)
    
    result = psar(barsdata)
    dates = result['dates'][startidx:endidx]
    close = result['close'][startidx:endidx]
    psarbear = result['psarbear'][startidx:endidx]
    psarbull = result['psarbull'][startidx:endidx]
    
    plt.plot(dates, close)
    plt.plot(dates, psarbull)
    plt.plot(dates, psarbear)
    plt.grid()
    plt.show()
