from flask import Flask, render_template
from recognition.feature_extraction import recognize_face
from recognition.Store_employee import store_employee_data

app = Flask(__name__)
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register')
def register():
    embedding = recognize_face("output_images/face_3.jpg")
    store_employee_data(
        employee_id=2, 
        fist_name="Sam", 
        last_name="Doe", 
        facial_representation=embedding)
    
    return "Employee registered successfully!"

if __name__ == '__main__':
    app.run(debug=True)