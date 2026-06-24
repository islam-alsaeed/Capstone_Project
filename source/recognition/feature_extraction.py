import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow logging
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN optimizations
import warnings
warnings.filterwarnings("ignore")  # Suppress warnings
import logging
logging.getLogger("tensorflow").setLevel(logging.ERROR)  # Suppress TensorFlow logging
from deepface import DeepFace

def recognize_face(image_path):
    image_path = image_path
    # I tried using Facenet but I will swith to ArcFace because it is more accurate and faster.
    model_name = "ArcFace"  # Options: VGG-Face, Facenet, OpenFace, DeepFace, DeepID, Dlib, ArcFace
    try:
        embedding = DeepFace.represent(
            img_path=image_path, 
            model_name=model_name,
            enforce_detection=True,
            align=True)
        # print("Type:", type(embedding))
        # print("outcome:", embedding)
        
        outcome = embedding[0]
        facial_representation = outcome['embedding']
        face_area = outcome["facial_area"]
        confidence = outcome["face_confidence"]

        print(f"==== {model_name} facial encoding successful ====")
        print(f"Vector length: {len(facial_representation)}")
        print(f"Facial area: {face_area}")
        print(f"Confidence: {confidence}")

        return facial_representation
        
    except Exception as e:
        print("Exception type:", type(e).__name__)
        print("Exception message:", str(e))
        return None
    
recognize_face("source/output_images/face_1.jpg")