# -*- coding: utf-8 -*-
"""
Created on Mon Jun 27 14:52:35 2016

@author: pierreucla
"""


def deconvolve(sig1, sig2,Fe) :
    
    n=len(sig2);
    K = 2**(n).bit_length() 
    fft1 = np.fft.fft(sig1,K)
    fft2 = np.fft.fft(sig2,K)
    """
    borneinf = int(20*K/Fe) + 2;
    bornesup = int(20000*K/Fe);
    
    """
    
    tmp = fft2 / fft1;
   
   """
   
    
    for k in range(borneinf):
        tmp[k] = 0;
       
    
    for k in range(bornesup,K):
        tmp[k] = 0;
       
     """
   
    return np.real(np.fft.ifft(tmp))