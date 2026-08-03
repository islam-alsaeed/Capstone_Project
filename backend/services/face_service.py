from pathlib import Path

from deepface import DeepFace


def generate_face_embedding(
    image_path: str,
) -> list[float]:
    path = Path(image_path)

    if not path.exists():
        raise ValueError("The employee image file does not exist.")

    result = DeepFace.represent(
        img_path=str(path),
        model_name="Facenet",
        enforce_detection=True,
        align=True,
    )

    if not result:
        raise ValueError("No face was detected in the image.")

    first_face = result[0]

    embedding = first_face.get("embedding")

    if not embedding:
        raise ValueError(
            "DeepFace did not return a face embedding."
        )

    return embedding