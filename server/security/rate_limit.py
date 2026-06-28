import time
from collections import defaultdict
from fastapi import HTTPException, Request

class RateLimiter:
    def __init__(self, max_attempts: int = 5, window_seconds: int = 300):
        self.max_attempts = max_attempts
        self.window = window_seconds
        self._attempts = defaultdict(list)  # IP -> [timestamps]
    
    def check(self, request: Request):
        ip = request.client.host if request.client else 'unknown'
        now = time.time()
        # Clean old attempts
        self._attempts[ip] = [t for t in self._attempts[ip] if now - t < self.window]
        if len(self._attempts[ip]) >= self.max_attempts:
            raise HTTPException(
                status_code=429,
                detail=f'Muitas tentativas. Tente novamente em {self.window // 60} minutos.'
            )
        self._attempts[ip].append(now)
    
    def reset(self, request: Request):
        ip = request.client.host if request.client else 'unknown'
        self._attempts.pop(ip, None)

login_limiter = RateLimiter(max_attempts=5, window_seconds=300)
