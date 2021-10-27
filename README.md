### READEME.md

# flask_dashboard
하나의 대시보드 화면에 여러 개의 차트를 비동기적으로 업데이트 합니다.
- Flask Server는 서드 파티의 연산기로부터 데이터를 지속적으로 업데이트 합니다.
- 대시보드는 지속적으로 Flask Server에 최신 요청합니다.

# jupyter_preprocessingWithSpark
- 구조화된 스파크 스트리밍 전처리 과정을 주피터 노트북을 통해 확인할 수 있습니다.
- 데이터는 소켓으로부터 가져옵니다. tweetpy2Spark를 실행함으로써, 소켓을 생성하고 트위터로부터 데이터를 가져옵니다.

# tweepy2Spark
- 소켓을 생성한 뒤 트위터로 데이터를 가져옵니다. 가져온 데이터는 구조화된 스파크 스트리밍을 통해 처리합니다.
