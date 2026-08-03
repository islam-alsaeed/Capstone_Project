from .attendance import attendance_bp
from .auth import auth_bp
from .employees import employees_bp

__all__ = [
    "attendance_bp",
    "auth_bp",
    "employees_bp",
]