import numpy as np
import csv
from google_images_download import google_images_download   #importing the library
Product_list =['Rice', 'Wheat', 'Maize', 'Millets','Pulses','Cotton', 'Jute', 'Sugarcane', 'Tobacco','Oilseeds','Tea', 'Coffee', 'Coconut', 'Rubber']
s=""
for i in range(len(Product_list)):
    Product_list[i]+=' crop'
for i in range(len(Product_list)):
    s+=Product_list[i]+','


response = google_images_download.googleimagesdownload()   #class instantiation

arguments = {"keywords":s,"limit":2000,"print_urls":True,"output_dir": 'crop_images'}   #creating list of arguments
paths = response.download(arguments)   #passing the arguments to the function
# print(paths)   #printing absolute paths of the downloaded images
