from pathlib import Path

import numpy as np
from deepface import DeepFace


MODEL_NAME = "Facenet"


def generate_face_embedding(
    image_path: str,
) -> list[float]:
    path = Path(image_path)

    if not path.exists():
        raise ValueError(
            "The face image file does not exist."
        )

    result = DeepFace.represent(
        img_path=str(path),
        model_name=MODEL_NAME,
        enforce_detection=True,
        align=True,
    )

    if not result:
        raise ValueError(
            "No face was detected in the image."
        )

    if len(result) > 1:
        raise ValueError(
            "Multiple faces were detected. "
            "Only one face is allowed."
        )

    embedding = result[0].get("embedding")

    if not embedding:
        raise ValueError(
            "DeepFace did not return an embedding."
        )

    return [
        float(value)
        for value in embedding
    ]


def calculate_cosine_distance(
    embedding_a: list[float],
    embedding_b: list[float],
) -> float:
    vector_a = np.asarray(
        embedding_a,
        dtype=np.float64,
    )

    vector_b = np.asarray(
        embedding_b,
        dtype=np.float64,
    )

    if vector_a.shape != vector_b.shape:
        raise ValueError(
            "Face embedding dimensions do not match."
        )

    norm_a = np.linalg.norm(vector_a)
    norm_b = np.linalg.norm(vector_b)

    if norm_a == 0 or norm_b == 0:
        raise ValueError(
            "A face embedding contains invalid values."
        )

    cosine_similarity = np.dot(
        vector_a,
        vector_b,
    ) / (norm_a * norm_b)

    cosine_similarity = np.clip(
        cosine_similarity,
        -1.0,
        1.0,
    )

    return float(
        1.0 - cosine_similarity
    )