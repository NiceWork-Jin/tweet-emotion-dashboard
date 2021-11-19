import socket
import time


class ServerSocket(object):
    def __init__(self, addr, port, backlog=2):
        self.addr = addr
        self.port = port
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((addr, port))
        server_socket.listen(backlog)
        print("listening....")
        self.client_server, self.addr = server_socket.accept()
        print(f"Connected by {self.addr[0]}:{self.addr[1]}")

    def write(self, msg):
        msg = msg + '\n'
        self.client_server.send(msg.encode('utf-8'))
        print("ServerSocket sent a message!")

    def fake_tweet_api(self):
        it = self.fake_tweet_load()
        while True:
            self.client_server.send(next(it).encode('utf-8'))
            time.sleep(1)

    def fake_tweet_load(self):
        with open('./data/sample_tweet.txt', 'r') as f:
            for x in f:
                if not x:
                    break
                yield x
