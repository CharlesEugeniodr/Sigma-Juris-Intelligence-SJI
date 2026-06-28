import time

class TokenBlacklist:
    def __init__(self):
        self._blacklist = {}  # token_jti -> expiry_timestamp
    
    def add(self, token: str, expires_at: float):
        self._blacklist[token] = expires_at
        self._cleanup()
    
    def is_blacklisted(self, token: str) -> bool:
        return token in self._blacklist
    
    def _cleanup(self):
        now = time.time()
        self._blacklist = {k: v for k, v in self._blacklist.items() if v > now}

token_blacklist = TokenBlacklist()
