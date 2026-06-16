
import sys
# Tell Python to look into your User Roaming directory for packages
sys.path.append(r"C:\Users\islam\AppData\Roaming\Python\Python312\site-packages")

# Now it is safe to import DeepFace
from deepface import DeepFace
print("Success! DeepFace was successfully found and loaded.")

import cv2
from deepface import DeepFace

# 1. Start the webcam feed
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    try:
        # 2. Pass the raw OpenCV frame directly to DeepFace
        # We enforce_detection=False so the code doesn't crash if no face is in frame
        analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        
        # DeepFace returns a list of dictionaries (one per face)
        if analysis:
            dominant_emotion = analysis[0]['dominant_emotion']
            
            # 3. Draw the results onto the live OpenCV window
            cv2.putText(frame, f"Emotion: {dominant_emotion}", (50, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
    except Exception as e:
        # Handle cases where analysis fails or model is loading
        pass

    # Display the feed
    cv2.imshow("DeepFace Live Analysis", frame)

    # Press 'q' to break the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
