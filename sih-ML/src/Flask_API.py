from keras.optimizers import Adadelta
from keras.preprocessing.image import ImageDataGenerator
from keras.callbacks import ReduceLROnPlateau, ModelCheckpoint
from keras.models import Model
from keras.preprocessing.image import img_to_array
from keras.models import load_model
import numpy as np
from flask import Flask, render_template,request
import flask
from PIL import Image
import json
import requests
import cv2

image_size = (100, 100)  # width and height of the used images
input_shape = (100, 100, 3)  # the expected input shape for the trained models; since the images in the Fruit-360 are 100 x 100 RGB images, this is the required input shape
labels=['Banana', 'Nectarine', 'Tomato 3', 'Pear', 'Potato Red Washed', 'Pear Abate', 'Physalis with Husk', 'Mango', 'Grape White 3', 'Pitahaya Red', 'Pepper Red', 'Onion Red Peeled', 'Grapefruit White', 'Cactus fruit', 'Strawberry', 'Cherry 2', 'Mango Red', 'Tamarillo', 'Apple Red 1', 'Apple Golden 3', 'Grape Pink', 'Pineapple Mini', 'Pineapple', 'Cherry 1', 'Plum', 'Grape White', 'Quince', 'Nut Forest', 'Grape White 2', 'Tomato Maroon', 'Kohlrabi', 'Limes', 'Peach 2', 'Lychee', 'Plum 2', 'Lemon', 'Redcurrant', 'Beetroot', 'Apple Golden 1', 'Cherry Wax Yellow', 'Peach', 'Guava', 'Tomato Cherry Red', 'Carambula', 'Chestnut', 'Ginger Root', 'Orange', 'Nectarine Flat', 'Avocado', 'Banana Red', 'Pepper Yellow', 'Cauliflower', 'Huckleberry', 'Strawberry Wedge', 'Pear Williams', 'Physalis', 'Salak', 'Cantaloupe 2', 'Hazelnut', 'Potato White', 'Rambutan', 'Mandarine', 'Blueberry', 'Apricot', 'Eggplant', 'Cantaloupe 1', 'Lemon Meyer', 'Tomato 2', 'Apple Pink Lady', 'Mulberry', 'Peach Flat', 'Pepper Green', 'Cherry Rainier', 'Granadilla', 'Apple Red 3', 'Potato Sweet', 'Tomato 1', 'Apple Red Delicious', 'Clementine', 'Pear Red', 'Onion Red', 'Tangelo', 'Pear Monster', 'Walnut', 'Nut Pecan', 'Banana Lady Finger', 'Cherry Wax Red', 'Raspberry', 'Apple Granny Smith', 'Grapefruit Pink', 'Pear Kaiser', 'Melon Piel de Sapo', 'Cocos', 'Kaki', 'Grape White 4', 'Grape Blue', 'Kiwi', 'Cherry Wax Black', 'Apple Crimson Snow', 'Tomato 4', 'Dates', 'Tomato Yellow', 'Avocado ripe', 'Apple Red Yellow 1', 'Mangostan', 'Pear Forelle', 'Onion White', 'Papaya', 'Kumquats', 'Apple Red 2', 'Apple Red Yellow 2', 'Apple Braeburn', 'Potato Red', 'Plum 3', 'Maracuja', 'Pomelo Sweetie', 'Pepino', 'Pomegranate', 'Apple Golden 2', 'Passion Fruit']

def classify(image):
    image =cv2.imread('pear_abate.jpg')
    image = cv2.resize(image, (100, 100))
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    loaded_model = load_model("my_model_01.hdf5")
    y_pred=loaded_model.predict(image)
    y_pred = y_pred.argmax(axis=1)[0]
    print(labels[y_pred])
    return y_pred


user ={}
app = Flask(__name__)
data=[]
@app.route('/')
def index():
    return "Flask server"

@app.route('/query', methods = ['GET','POST'])
def postdata():
    data = request.get_json()
    url=data['url']
    filename = url.split("/")[-1]
    r = requests.get('http://52.66.72.209'+url, timeout=0.5)
    if r.status_code == 200:
        with open('../image/'+filename, 'wb') as f:
            f.write(r.content)
    image =cv2.imread('../image'+filename)
    res=classify(image)
    return json.dumps({"class":res})


if __name__ == "__main__":
    app.run(debug = True,host='0.0.0.0')
