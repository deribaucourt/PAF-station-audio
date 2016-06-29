# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import numpy as np

def deconvolve(sig1, sig2) :
    
    
    
    Fe=44100;
    n=len(sig2);
    K = 2**(n).bit_length() 
    fft1 = np.fft.fft(sig1,K)
    fft2 = np.fft.fft(sig2,K)
    borneinf = int(20*K/Fe) + 2;
    bornesup = int(20000*K/Fe);
    tmp = fft2 / fft1;
   
   """
    
    for k in range(borneinf):
        tmp[k] = 0;
       
    
    for k in range(bornesup,K):
        tmp[k] = 0;
       
     """
   
    return np.real(np.fft.ifft(tmp))


def test() :
    Fe=44100;
    t=[(i/Fe) for i in range(Fe)]
    
    x=[0 for k in range(Fe)];
    phase=[0 for k in range(Fe)];
    for n in range(2,Fe-1):
            phase[n]=2*np.pi*(20*t[n]+(10000-10)*(t[n]*t[n]))
            x[n]=np.sin(phase[n]);
            
    h = [1,0,0,0,0,1,1,1,1,0,0,0,1]
    
    y = np.convolve(x,h);
    z = deconvolve(x,y);
    
    return z
            
    
    