from flask import Flask, request, jsonify, url_for,send_file, Response  
from time import perf_counter
from werkzeug.utils import secure_filename
import os
from flask_sqlalchemy import SQLAlchemy  
from flask_marshmallow import Marshmallow
import base64
from datetime import datetime
from flask_cors import CORS
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import utils, ec
from cryptography.hazmat.primitives.asymmetric.ec import EllipticCurvePublicNumbers
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import serialization

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/capstone'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy and Marshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)
app.app_context().push()

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Define the UserRegisterd model for database
class DoctorRegisterd(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(100), nullable=False)
    lname = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    public_key = db.Column(db.Text, nullable=True)
    private_key = db.Column(db.Text, nullable=True)
    password = db.Column(db.String(20), nullable=False)
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, fname,lname, specialization, email, public_key, private_key, password):
        self.fname = fname
        self.lname = lname
        self.public_key = public_key
        self.private_key = private_key
        self.specialization = specialization
        self.email = email
        self.password = password

class PatientRegisterd(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    aes_key = db.Column(db.Text, nullable=True)
    password = db.Column(db.String(20), nullable=False)
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, gender, age, email, aes_key, password):
        self.username = username
        self.gender = gender
        self.age = age
        self.email = email
        self.aes_key = aes_key
        self.password = password

class PatientMessage(db.Model):
    msg_id = db.Column(db.Integer, primary_key=True)
    patientName = db.Column(db.String(100), nullable=False)
    patientEmail = db.Column(db.String(100), nullable=False)
    patientAge = db.Column(db.Integer, nullable=False)
    patientGender = db.Column(db.String(100), nullable=False)
    image_path = db.Column(db.String(255), nullable=True)
    doctorName = db.Column(db.String(100), nullable=False)
    doctorEmail = db.Column(db.String(100), nullable=False)
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, patientName, patientEmail, patientAge, patientGender, image_path, doctorName , doctorEmail ):
        self.patientName = patientName
        self.patientEmail = patientEmail
        self.patientAge = patientAge
        self.patientGender = patientGender
        self.image_path = image_path
        self.doctorName = doctorName
        self.doctorEmail = doctorEmail

class DoctorRegisteredSchema(ma.Schema):
    class Meta:
        fields = ('id','fname','lname','specialization','email', 'public_key','private_key','password', 'date_registered')
doctor_Registered_schema = DoctorRegisteredSchema()
doctor_Registered_schemas = DoctorRegisteredSchema(many=True)

class PatientRegisteredSchema(ma.Schema):
    class Meta:
        fields = ('id','username','age', 'gender','email', 'aes_key','password', 'date_registered')
patient_Registered_schema = PatientRegisteredSchema()

class PatientMessageSchema(ma.Schema):
    class Meta:
        fields = ('msg_id','patientName','patientEmail', 'patientAge','patientGender','image_path', 'doctorName','doctorEmail', 'date_registered')
patient_Message_schemas = PatientMessageSchema(many=True)

@app.route('/fetchDoctors', methods=['GET'])
def fetchDoctors():
    allDoctors = DoctorRegisterd.query.all()
    return doctor_Registered_schemas.jsonify(allDoctors)

@app.route('/fetchPatient', methods=['POST'])
def fetchPatient():
    doc_email = request.json.get('doc_email')
    allPatients = PatientMessage.query.filter_by(doctorEmail=doc_email).all()

    serialized_data = patient_Message_schemas.dump(allPatients)

    # Update the image_path for each patient record
    for patient in serialized_data:
        if patient['image_path']:
            # Replace backslashes with forward slashes
            patient['image_path'] = patient['image_path'].replace('\\', '/')

    return jsonify(serialized_data)


@app.route('/decryptMessage', methods=['POST'])
def decryptMessage():
    msg_id = request.json.get('msg_id')

    # Fetch the patient message using the provided msg_id
    patient_message = PatientMessage.query.get(msg_id)

    if not patient_message:
        return jsonify({"error": "Message not found"})

    # Retrieve the patient's AES key from the database
    patient = PatientRegisterd.query.filter_by(email=patient_message.patientEmail).first()

    if not patient or not patient.aes_key:
        return jsonify({"error": "Patient AES key not found or invalid"})

    aes_key_hex = patient.aes_key
    aes_key = bytes.fromhex(aes_key_hex)

    try:
        with open(patient_message.image_path, 'rb') as f:
            ciphertext = f.read()

        # Extract IV, encrypted data, and tag from the ciphertext
        iv = ciphertext[:12]
        encrypted_data = ciphertext[12:-16]
        tag = ciphertext[-16:]

        # Decrypt the message using AES-GCM
        cipher = Cipher(algorithms.AES(aes_key), modes.GCM(iv, tag), backend=default_backend())
        decryptor = cipher.decryptor()
        start_time = perf_counter()  # Record the start time
        decrypted_data_temp = decryptor.update(encrypted_data) + decryptor.finalize()
        end_time = perf_counter()  # Record the end time
        time_taken = end_time - start_time
        time_taken_decimal = '{:.8f}'.format(time_taken)
        print("Time taken for AES decryption:", time_taken_decimal, "seconds")

        # Generate a unique filename for the decrypted image
        decrypted_filename = os.path.splitext(os.path.basename(patient_message.image_path))[0] + '_decrypted' + os.path.splitext(patient_message.image_path)[1]
        decrypted_filepath = os.path.join(app.config['UPLOAD_FOLDER'], decrypted_filename)

        with open(decrypted_filepath, 'wb') as f:
            f.write(decrypted_data_temp)

        # Return the decrypted image file as a response
        return send_file(decrypted_filepath, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)})

# Helper function to perform ECC encryption
def ecc_encrypt(selectedFile, public_key_pem):
    try:
        # Load the doctor's public key
        public_key = serialization.load_pem_public_key(public_key_pem, backend=default_backend())

        # Perform ECC encryption
        ciphertext = public_key.encrypt(
            selectedFile,
            ec.ECIES(hashes.SHA256())
        )

        return ciphertext
    except Exception as e:
        return str(e)

# Helper function to perform AES encryption
def aes_encrypt(selectedFile, aes_key):
    try:
        # Generate random IV
        iv = os.urandom(12)

        #Perform AES encryption
        cipher = Cipher(algorithms.AES(aes_key), modes.GCM(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        encrypted_data = encryptor.update(selectedFile) + encryptor.finalize()

        # Get the authentication tag
        tag = encryptor.tag

        # Concatenate IV, encrypted data, and tag
        ciphertext = iv + encrypted_data + tag

        return ciphertext
    except Exception as e:
        return str(e)


@app.route('/sendMessage', methods=['POST'])
def saveMessage():
    p_name = request.form.get('pName')
    p_email = request.form.get('pEmail')
    p_age = request.form.get('p_age')
    p_gender = request.form.get('p_gender') 
    doc_name = request.form.get('docName')
    doc_email = request.form.get('docEmail')

    # Processing the uploaded file
    selectedFile = request.files.get('message')
    if selectedFile:
        # Retrieve the doctor's public key from the database
        doctor = DoctorRegisterd.query.filter_by(email=doc_email).first()
        if doctor:
            public_key_pem = doctor.public_key.encode('utf-8')
            try:
                # Determine whether to use ECC or AES encryption based on the index
                if len(selectedFile.read()) % 2 == 0:
                    # Encrypt using ECC on even-indexed fragments
                    ciphertext = ecc_encrypt(selectedFile.read(), public_key_pem)
                else:
                    # Retrieve the patient's AES key from the database
                    patient = PatientRegisterd.query.filter_by(email=p_email).first()
                    if patient and patient.aes_key:
                        aes_key = bytes.fromhex(patient.aes_key)
                        # Encrypt using AES on odd-indexed fragments
                        ciphertext = aes_encrypt(selectedFile.read(), aes_key)
                    else:
                        return jsonify({"error": "Patient AES key not found or invalid"})
                
                # Generate a unique filename for the encrypted fragment
                filename = secure_filename(selectedFile.filename)
                encrypted_filename = os.path.splitext(filename)[0] + '_encrypted' + os.path.splitext(filename)[1]
                encrypted_filepath = os.path.join(app.config['UPLOAD_FOLDER'], encrypted_filename)
                
                # Save the encrypted fragment
                with open(encrypted_filepath, 'wb') as f:
                    f.write(ciphertext)
                    
                # Save the path of the encrypted fragment in the database
                new_message = PatientMessage(patientName=p_name, patientEmail=p_email, patientAge=p_age, patientGender=p_gender, doctorName=doc_name, doctorEmail=doc_email, image_path=encrypted_filepath)
                db.session.add(new_message)
                db.session.commit()
                return jsonify({"message": "Message posted successfully"})
            except Exception as e:
                return jsonify({"error": str(e)})
        else:
            return jsonify({"error": "Doctor not found"})
    else:
        return jsonify({"error": "No file uploaded"})



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
    
    # Generate ECC key pair
    private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())
    public_key = private_key.public_key()

    # Serialize the keys
    private_key_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    )
    public_key_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
        
    new_doctor = DoctorRegisterd(fname=fname,lname=lname, specialization=specialization, email=email, public_key=public_key_bytes.decode('utf-8'), private_key=private_key_bytes.decode('utf-8'), password=password)

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
    
    # Generate a random AES key
    aes_key = os.urandom(32)  # 256-bit key (32 bytes)

    # Encode the AES key as a hexadecimal string for storage
    aes_key_hex = aes_key.hex()
        
    new_patient = PatientRegisterd(username=username,age=age,gender=gender, email=email, aes_key=aes_key_hex, password=password)

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