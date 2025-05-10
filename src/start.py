#!/usr/bin/env python3

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


serve_dir = os.path.dirname( os.path.abspath(__file__) )
os.chdir(serve_dir)

host = "0.0.0.0"
port = 8000
server_address = (host, port)

print(f"Server working on http://{host}:{port} -> {serve_dir}")
httpd = HTTPServer(server_address, NoCacheHandler)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print(" Closing server...")
