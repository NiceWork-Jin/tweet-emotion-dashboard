# Overview

트위터의 특정 키워드에 대한 사용자의 반응을 대시보드를 통해 나타냅니다.

# 실행 결과
<img width="454" alt="dashboard_result" src="https://user-images.githubusercontent.com/42059680/141749397-0177095b-cb1b-4745-a174-633b65d80abd.png">

# Skill/Verion
- Python 3.8
- Spark 3.2
- Tweepy 4.3.0
- JavaScript
- Chart.js 3.2.0
- HTML
- CSS

# Work Environment
- Mac m1 (Single machine)
- Pycharm
- Jupyter Notebook (작업 코드 디버깅)

# Architecture
![full_architecture](https://user-images.githubusercontent.com/42059680/141749305-4c7c8edc-e404-464b-b441-fa9c07bcb83f.jpeg)
- 데이터 수집
    - 트위터의 실시간 데이터를 수집을 위해 Tweepy 라이브러리를 사용했습니다.
    - 수집된 데이터는 TCP 통신을 통하여 Spark로 전달됩니다.
- 데이터 처리
    - Spark Structured Streaming을 통해 데이터를 처리합니다.
    - 처리된 데이터는 초/분 단위로 Web API에 전달됩니다.
- 대시보드 표현
    - 대시보드는 주기적으로 Web API에 데이터를 요구합니다.
    - Web API는 Spark로부터 받은 데이터를 대시보드에 제공합니다.
    - Web API는 Flask로 구현했습니다.
    - DashBoard는 JavaScript의 Chart.js를 주로 사용했습니다.

# 데이터 수집
## Architecture
![source_architecture](https://user-images.githubusercontent.com/42059680/141751257-370f4874-367f-43cd-a7b3-320bd2f678a4.jpeg)
트위터 데이터는 TCP 통신을 통해 스파크로 전달 됩니다. 따라서 트위터에 데이터를 요청하기 전에 소켓 간에 연결 객체를 생성합니다. 양측 소켓이 연결되고 나면, 서버는 트위터에 데이터를 요청합니다. 서버는 트위터에서 수신 받은 데이터를 연결된 소켓 객체를 통해 클라이언트로 전달합니다. 데이터 전송을 멈추고 싶다면, 클라이언트 측에서 소켓을 닫습니다.

## Code explantion
[tweepy2Spark](https://github.com/nicework-jin/tweet-emotion-dashboard/tree/master/tweepy2Spark)를 통해 확인할 수 있습니다. 

(주의!) TweetListener.py를 사용하기 위해 [main.py](http://main.py)의 load_my_auth()에서 요구하는 정보를 채워 넣습니다. 작성자는 키 값 보안을 위해 별도의 텍스트 파일을 생성하여 저장 했습니다.

1. [main.py](http://main.py)을 실행하면 서버 소켓이 생성되고, 클라이언트가 연결되기를 기다립니다. 
2. 클라이언트 연결을 위해 [structuredStreaming.py](https://github.com/nicework-jin/tweet-emotion-dashboard/blob/master/tweepy2Spark/structuredStreaming.py)를 실행합니다.
    1. 자동으로 서버 소켓과 연결되고, [tweetListener.py](https://github.com/nicework-jin/tweet-emotion-dashboard/blob/master/tweepy2Spark/tweetListener.py)를 통해 데이터를 요청/응답받게 됩니다. 
3. 데이터 전송을 멈추기 위해 클라이언트([structuredStreaming.py](https://github.com/nicework-jin/tweet-emotion-dashboard/blob/master/tweepy2Spark/structuredStreaming.py)) 측에서 중단 합니다.

# 데이터 처리
## Architecture
![data_process_architecture](https://user-images.githubusercontent.com/42059680/141749385-593762c7-f45d-4bd8-adac-6513bdba3303.jpeg)

스파크 세션을 생성하고, [main.py](http://main.py)을 통해 트위터 데이터를 전송 받습니다. 전송받은 데이터는 스파크의 구조화된 스트리밍을 통해 전처리 했습니다. 전처리된 데이터는 Web API인 *[http://localhost:5000/](http://localhost:5000/~~)location 로 전달됩니다. 따라서 반드시 [tweetListener.py](https://github.com/nicework-jin/tweet-emotion-dashboard/blob/master/tweepy2Spark/tweetListener.py)를 실행하기 전에 Web API를 실행시켜 5000번 포트를 열어둬야 합니다.
- 참고로 앞에서 언급한 주소에서 location은 실제 주소를 의미하지 않습니다. 해당 주소는 전달하고자 하는 데이터의 종류에 따라 다른 값을 가집니다.  각 location에 대해서는 "대시보드"에서 설명합니다.

## Code explantion
[structuredStreaming.py](https://github.com/nicework-jin/tweet-emotion-dashboard/blob/master/tweepy2Spark/structuredStreaming.py)를 통해 확인할 수 있습니다.
코드 작성은 크게 4 단계로 나뉩니다. 목적에 따라 다양한 형식의 데이터 프레임 변환이 이뤄날 수 있지만, 큰 틀에서 벗어나지 않습니다. 
1. 스파크 세션 활성화 & 데이터 읽기(소켓)
2. UDF를 통한 데이터 전처리
3. 윈도우 함수를 통한 집계 처리
4. foreachBatch를 통한 재집계 & 데이터 쓰기(HTTP/POST)

# 대시보드
## Architecture
![dashboard_architecture](https://user-images.githubusercontent.com/42059680/141749418-9185f2c1-8985-46c2-beef-c6202cf9d7b8.jpeg)
대시보드는 Web API와 View로 구성되어 있습니다. Web API를 동작시키면 자동으로 뷰가 활성화 됩니다. 뷰는 차트의 성격에 따라 주기적으로 Web API에 데이터를 요청하게 됩니다. 그리고 Web API는 현재 보유한 데이터를 대시보드로 전송합니다. 스파크에서 주기적으로 Web API에 데이터를 전송하고 있으므로, 데이터는 계속적으로 갱신 됩니다. 이 때, 데이터의 타임스탬프는 대시보드에 도착한 시각이 아니라 데이터가 발생된 시각을 기준으로 합니다. 그렇지 않으면, 전송 지연이 발생 했을 시에 정확한 정보 파악이 어려워질 수 있습니다.

## Code explantion
[flask_dashboard](https://github.com/nicework-jin/tweet-emotion-dashboard/tree/master/flask_dashboard)를 통해 확인할 수 있습니다. 대시보드의 기본 포트는 5000번을 사용 합니다. 따라서 [http://localhost:5000/location의](http://localhost:5000/location의) 형식을 가지고 있습니다. 이 때, location은 의미에 따라 다른 값을 가집니다. 하지만 여전히 일관된 규칙을 가지고 있습니다. location이 update로 시작하는 경우에는 spark가 web API로 데이터를 전송할 때 사용 됩니다. refresh로 시작하는 경우에는 뷰에서 Web API로 데이터를 요청할 때 사용되는 주소입니다. 

### Location별 설명
/update_react_num_per_sec : "긍정, 중립, 부정 개수 / 최근 1초"를 전송 받음
데이터 형식: {"positive": 0, "neutral": 0, "negative": 0, "createdAtArray": [], "scoreArray": []}
* createdAtArray의 원소는 Date iso 형식을 따름
* ScoreArray의 각 원소는 positive, neutral, negative의 평균 점수를 나타냄.
* createdAtArray와 ScoreArray는 서로 매칭되어 표현되므로, 동일한 개수가 입력되어야 함.

/update_react_num_per_min : "긍정, 중립, 부정 개수 / 최근 1분"를 전송 받음
데이터 형식: {"positive": 0, "neutral": 0, "negative": 0}

/update_top_five_hashtags_per_min : "가장 많이 언급된 해쉬태그 탑 파이브 / 1분"를 전송 받음
데이터 형식: {'hashtag01': 0, 'hashtag02': 0, 'hashtag03': 0, 'hashtag04': 0, 'hashtag05': 0} 

/refresh_react_num_per_sec : "react_num_per_sec"를 view에 전시
/refresh_react_num_per_min : "react_num_per_min"를 view에 전시
/refresh_top_five_hashtags_per_min : "top_five_hashtags_per_min"를 view에 전시

### 대시보드 실행 방법
대시보드는 터미널을 통해 실행시킬 수 있습니다. 
- 터미널에서 flask_dashboard 폴더가 저장된 이전 폴더로 이동합니다.
- MAC의 경우에는 FLASK_APP=flask_dashboard FLASK_ENV=development flask run를 cmd에 입력합니다.
- Windows의 경우에는 아래 세 줄을 차례로 명령합니다.
    - export FLASK_APP=flask_dashboard
    - export FLASK_ENV=development
    - flask run
