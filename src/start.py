#!/usr/bin/env python3

import os
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
import argparse


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

def main():
    parser = argparse.ArgumentParser(description="Start a simple HTTP server.")
    parser.add_argument('-p', '--port', type=int, default=8000, help='Port to run the server on (default: 8000)')
    parser.add_argument('-a', '--address', type=str, default='localhost', help='Host address (default: localhost)')
    args = parser.parse_args()
    serve(args.address, args.port)

def run_server():
    """Run the node backend in a new thread."""
    try:
        threading.Thread(target=lambda: os.system("node GameEngine/dist/server/bundle.server.es.js"), daemon=True).start()
    except Exception as e:
        print(f"Error starting the server: {e}")
    
def serve(host: str, port: int):
    serve_dir = os.path.dirname( os.path.abspath(__file__) )
    os.chdir(serve_dir)
    server_address = (host, port)
    print(f"Runing backend server")
    run_server()
    print(f"Server working on http://{host}:{port} -> {serve_dir}")
    httpd = HTTPServer(server_address, NoCacheHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(" Closing server...")


if __name__ == "__main__":
    main()