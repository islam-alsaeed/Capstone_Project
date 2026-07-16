import cv2
import os
from deepface import DeepFace
output_path = "output_images"
if not os.path.exists(output_path):
    os.makedirs(output_path)


def capture_image(auto_capture):
    print("opencv version: "+cv2.__version__+" hello there")
    # connect to the webcam (0 is the default camera)

    #using pre-trained Haar Cascade model for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
   
    print("Press 's' to save the face snapshot, or 'q' to quit.")

    face_count = 0
    cap = cv2.VideoCapture(0)
    while True:
        # read a frame from the webcam
        returnn, frame = cap.read()
        
        if not returnn:
            print("Failed to capture video")
            break

        gray_scale = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces=face_cascade.detectMultiScale(gray_scale,1.3,5)

        # crop the face
        for (x, y, w, h) in faces:
            face_crop = frame[y:y+h, x:x+w]

        # display the frame in a window
        cv2.imshow('Webcam', frame)

        key=cv2.waitKey(1) & 0xFF
        # Press 's' to save the cropped face
        if auto_capture==False and key == ord('s') and len(faces) > 0:
            face_count += 1
            filename = os.path.join(output_path, f'face_{face_count}.jpg')
            cv2.imwrite(filename, face_crop)
            print(f"Face saved: {filename}")

        # Press the 'q' key to quit the capture
        if key == ord('q'):
            break
        
    # release the webcam and close the window
    cap.release()
    cv2.destroyAllWindows()
