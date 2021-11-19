import json

from tweetListener import TweetListener
from serverSocket import ServerSocket


def load_my_auth():
    """
    [Note] auth.txt location is different by person. I stored my auth.txt separated from the Project for security.
    Plus, You should enter your consumer_key, consumer_secret, access_token, access_token_secret got from Tweet Developer
    into "auth.txt" without line-break.


    :return
        {
        "consumer_key":"_________",
        "consumer_secret":"__________",
        "access_token":"_____________",
        "access_token_secret":"____________"
        }
    """

    with open('/Users/seongjin/programming/secure_info/auth.txt', 'r') as f:
        return json.load(f)


if __name__ == '__main__':
    """
    These two lines are for testing Tweepy flowing well.
    Tweets can check on the command.
    [Note] Tweets don't head into Spark.
    """
    # tweetListener = TweetListener('print', load_my_auth())
    # tweetListener.filter(track=['squid game'], languages=['en'])

    """
    Fake Tweet API.
    You can use it instead of real tweet API.
    """
    s_socket = ServerSocket('localhost', 9999)
    s_socket.fake_tweet_api()

    """
    Launch Tweepy and send data to Spark for preprocessing.
    You should launch structuredStreaming.py after main.py is started in this Project.    
    """
    # s_socket = ServerSocket('localhost', 9999)
    # tweetListener = TweetListener(s_socket, load_my_auth())
    # tweetListener.filter(track=['NewYork'], languages=['en'])

