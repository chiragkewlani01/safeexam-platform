import secrets
import string

def generate_exam_code(length: int = 8) -> str:
    """Generate a random alphanumeric exam code"""
    characters = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))
