from flask import Flask, request, jsonify  # Flask for creating the web application
from flask_sqlalchemy import SQLAlchemy  # SQLAlchemy for database interaction
from flask_marshmallow import Marshmallow
import base64
from datetime import datetime
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/capstone'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy and Marshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)
app.app_context().push()


# Define the UserRegisterd model for database
class DoctorRegisterd(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(100), nullable=False)
    lname = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, fname,lname, specialization, email, password):
        self.fname = fname
        self.lname = lname
        self.specialization = specialization
        self.email = email
        self.password = password

class PatientRegisterd(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, gender, age, email, password):
        self.username = username
        self.gender = gender
        self.age = age
        self.email = email
        self.password = password

class PatientMessage(db.Model):
    msg_id = db.Column(db.Integer, primary_key=True)
    patientName = db.Column(db.String(100), nullable=False)
    patientEmail = db.Column(db.String(100), nullable=False)
    encrypted_Message = db.Column(db.BLOB, nullable=False)
    encrypted_key = db.Column(db.String(100), nullable=False)
    doctorName = db.Column(db.String(100), nullable=False)
    doctorEmail = db.Column(db.String(100), nullable=False)
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, patientName,patientEmail, encrypted_Message, encrypted_Key, doctorName , doctorEmail ):
        self.patientName = patientName
        self.patientEmail = patientEmail
        self.encrypted_Message = encrypted_Message
        self.encrypted_Key = encrypted_Key
        self.doctorName = doctorName
        self.doctorEmail = doctorEmail

class DoctorRegisteredSchema(ma.Schema):
    class Meta:
        fields = ('id','fname','lname','specialization','email', 'password', 'date_registered')
doctor_Registered_schema = DoctorRegisteredSchema()
doctor_Registered_schemas = DoctorRegisteredSchema(many=True)

class PatientRegisteredSchema(ma.Schema):
    class Meta:
        fields = ('id','username','age', 'gender','email', 'password', 'date_registered')
patient_Registered_schema = PatientRegisteredSchema()

@app.route('/fetchDoctors', methods=['GET'])
def fetchDoctors():
    allDoctors = DoctorRegisterd.query.all()
    return doctor_Registered_schemas.jsonify(allDoctors)

@app.route('/sendMessage', methods=['POST'])
def saveMessage():
    p_name = request.json.get('pName')
    p_email = request.json.get('pEmail')
    p_message_base64 = request.json.get('message')
    doc_name = request.json.get('docName')
    doc_email = request.json.get('docEmail')
    key = "key"

    # Decode base64 string to get binary image data
    p_message_binary = base64.b64decode(p_message_base64)

    new_message = PatientMessage(patientName=p_name, patientEmail=p_email,encrypted_Message=p_message_binary, encrypted_Key=key, doctorName=doc_name, doctorEmail=doc_email)
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"message":"Message posted successfully"})


@app.route('/doctorRegistration', methods=['POST'])
def doctorRegister():
    fname = request.json.get('fname')
    lname = request.json.get('lname')
    email = request.json.get('email')
    specialization = request.json.get('specialization')
    password = request.json.get('password')

    #perform validation
    if not fname:
        return jsonify({'error': 'Invalid username'})
    if not lname:
        return jsonify({'error': 'Invalid username'})
    if not email:
        return jsonify({'error': 'Invalid email'})
    if not specialization:
        return jsonify({'error': 'Invalid specialization'})
    if not password:
        return jsonify({'error': 'Invalid password'})
    
    doctor = DoctorRegisterd.query.filter_by(email=email).first()
    if doctor:
        return jsonify({"error":"Email has already been registered"})
        
    new_doctor = DoctorRegisterd(fname=fname,lname=lname, specialization=specialization, email=email, password=password)

    db.session.add(new_doctor)
    db.session.commit()
    return jsonify({"message":"Doctor Registration successful"})

@app.route('/doctorLogin', methods=['POST'])
def doctorLogin():
    email = request.json.get('email')
    password = request.json.get('password')

    errors = []
    if not email:
        errors.append('Fill email field')
    if not password:
        errors.append('Fill password')
    if errors:
        return jsonify({'errors':errors})

    doctor = DoctorRegisterd.query.filter_by(email=email).first()

    if doctor and doctor.password==password:
        return doctor_Registered_schema.jsonify(doctor)
    else:
        return jsonify({'error': 'Invalid Login'})


@app.route('/patientRegistration', methods=['POST'])
def patientRegister():
    username = request.json.get('username')
    age = request.json.get('age')
    gender = request.json.get('gender')
    email = request.json.get('email')
    password = request.json.get('password')

    #perform validation
    if not username:
        return jsonify({'error': 'Invalid username'})
    if not age:
        return jsonify({'error': 'Invalid age'})
    if not gender:
        return jsonify({'error': 'Invalid gender'})
    if not email:
        return jsonify({'error': 'Invalid email'})
    if not password:
        return jsonify({'error': 'Invalid password'})
    
    patient = PatientRegisterd.query.filter_by(email=email).first()
    if patient:
        return jsonify({"error":"Email has already been registered"})
        
    new_patient = PatientRegisterd(username=username,age=age,gender=gender, email=email, password=password)

    db.session.add(new_patient)
    db.session.commit()
    return jsonify({"message":"Patient Registration successful"})

@app.route('/patientLogin', methods=['POST'])
def patientLogin():
    email = request.json.get('email')
    password = request.json.get('password')

    errors = []
    if not email:
        errors.append('Fill email field')
    if not password:
        errors.append('Fill password')
    if errors:
        return jsonify({'errors':errors})

    patient = PatientRegisterd.query.filter_by(email=email).first()

    if patient and patient.password==password:
        return patient_Registered_schema.jsonify(patient)
    else:
        return jsonify({'error': 'Invalid Login'})

if __name__ == "__main__":
    app.run(port= 5000, debug=True)