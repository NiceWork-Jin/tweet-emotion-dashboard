import json
import tweepy


class TweetListener(tweepy.Stream):
    def __init__(self, s_socket, auth):
        super(TweetListener, self).__init__(
            auth['consumer_key'],
            auth['consumer_secret'],
            auth['access_token'],
            auth['access_token_secret']
        )
        self.s_socket = s_socket

    def on_status(self, status):
        data = status._json
        if self.s_socket == "print":
            # This is for FakeData_generator printing on the cmd.
            print(data)
        else:
            self.s_socket.write(str(data))

