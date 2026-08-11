---
title: "어댑터 패턴 (Adapter Pattern)"
description: "어댑터(Adapter) 패턴은 구조 패턴 중 하나로, 기존 클래스의 인터페이스를 클라이언트에서 기대하는 다른 인터페이스로 변환합니다. 이 패턴은 클래스들이 호환성이 없어서 함께 작동할 수 없는 경우에 유용합니다. 어"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223539366820"
---

어댑터(Adapter) 패턴은 구조 패턴 중 하나로, 기존 클래스의 인터페이스를 클라이언트에서 기대하는 다른 인터페이스로 변환합니다. 이 패턴은 클래스들이 호환성이 없어서 함께 작동할 수 없는 경우에 유용합니다. 어댑터 패턴을 사용하면 기존 클래스들을 변경하지 않고도 클라이언트가 요구하는 형태로 클래스들을 사용할 수 있습니다.

## "본질은 유지하되, 형태는 변화한다."

어댑터(Adapter) 패턴은 다음과 같은 상황에서 사용하기 좋습니다:

  1. 기존 클래스를 재사용하고 싶을 때
    * 이미 잘 정의되고 검증된 클래스를 재사용하고 싶지만, 해당 클래스의 인터페이스가 현재 프로젝트나 시스템에서 기대하는 인터페이스와 맞지 않는 경우에 유용합니다. 어댑터 패턴을 사용하면 기존 클래스를 수정하지 않고도 원하는 형태로 사용할 수 있습니다.
  2. 서드 파티 라이브러리와의 통합
    * 외부에서 제공받은 라이브러리나 API의 인터페이스가 우리가 사용하는 인터페이스와 다를 때, 직접 수정할 수 없는 서드 파티 라이브러리를 어댑터 패턴을 통해 우리의 인터페이스에 맞출 수 있습니다.
  3. 여러 클래스의 인터페이스를 통일하고 싶을 때
    * 다양한 클래스들이 비슷한 작업을 수행하지만 인터페이스가 다른 경우, 어댑터 패턴을 사용하여 공통된 인터페이스를 정의하고 각 클래스에 대한 어댑터를 작성함으로써 통일된 방식으로 처리할 수 있습니다.
  4. 기존 코드와의 호환성 유지
    * 새로운 시스템이나 모듈을 구축하면서 기존 시스템과의 호환성을 유지해야 할 때 어댑터 패턴을 사용하여 새로운 인터페이스를 제공하고, 기존 시스템을 변경하지 않고도 호환성을 유지할 수 있습니다.
  5. 인터페이스 변환이 필요한 경우
    * 특정 클래스가 필요한 인터페이스를 제공하지 않는 경우, 어댑터 패턴을 통해 그 인터페이스를 변환하여 제공할 수 있습니다. 이를 통해 클래스 간의 상호 작용을 가능하게 합니다.

## 장점

  1. **재사용성 증가**: 기존 클래스를 수정하지 않고도 재사용할 수 있으므로, 코드 재사용성이 높아진다. 레거시 시스템과의 통합에서 유용
  2. **유연성 향상**: 서로 호환되지 않는 인터페이스를 가진 클래스들을 어댑터를 통해 사용할 수 있음. 이를 통해 시스템의 유연성이 향상
  3. **단일 책임 원칙 준수**: 어댑터 패턴을 사용하면 클래스는 자신의 본래 기능에 집중할 수 있고, 어댑터 클래스는 인터페이스 변환 작업에 집중할 수 있음. 이는 코드의 책임을 명확하게 분리
  4. **코드 변경 최소화**: 기존 코드를 수정하지 않고 새로운 기능을 추가하거나, 새로운 인터페이스에 맞출 수 있음 이는 유지보수 비용을 줄이고 코드 안정성을 높임
  5. **표준 인터페이스 제공**: 다양한 클래스들이 공통된 인터페이스를 통해 사용될 수 있으므로, 클라이언트 코드가 특정 구현에 종속되지 않고 표준 인터페이스를 통해 작업할 수 있음

## 단점

  1. **복잡성 증가**: 어댑터 클래스가 추가되면서 클래스의 수가 증가하고, 코드가 복잡해질 수 있음. 특히 여러 개의 어댑터가 필요한 경우 관리가 어려워질 수 있음.
  2. **성능 오버헤드**: 어댑터를 통해 간접적으로 메서드를 호출하기 때문에 약간의 성능 오버헤드가 발생할 수 있음 이는 성능이 중요한 시스템에서는 문제가 될 수 있음
  3. **유지보수 어려움**: 여러 어댑터가 존재하면 어떤 어댑터가 어떤 역할을 하는지 파악하기 어려워질 수 있음 이는 유지보수와 디버깅을 복잡하게 만들 수 있음
  4. **새로운 인터페이스 설계 필요**: 어댑터 패턴을 사용하려면 공통 인터페이스를 새로 설계해야 하는데, 이는 초기 설계 단계에서 추가적인 작업이 필요하게 만듬

## 예시 코드

가정해봅시다. 우리가 사용하는 MediaPlayer 인터페이스가 있는데, 새로운 오디오 형식인 vlc와 mp4 파일을 재생할 수 있는 AdvancedMediaPlayer 인터페이스를 통합하고자 합니다.

이 예제는 어댑터 패턴이 어떻게 기존 클래스를 변경하지 않고도 새로운 인터페이스에 맞게 사용하는지 보여줍니다.

## 구성 요소

  1. Target 인터페이스 (MediaPlayer)
  2. Adaptee 클래스 (AdvancedMediaPlayer 및 그 구현)
  3. Adapter 클래스 (MediaAdapter)
  4. Client 클래스 (AudioPlayer)

```java
// Target 인터페이스
public interface MediaPlayer {
    void play(String audioType, String fileName);
}

// Adaptee 인터페이스
public interface AdvancedMediaPlayer {
    void playVlc(String fileName);
    void playMp4(String fileName);
}

// Adaptee 구현 클래스 1
public class VlcPlayer implements AdvancedMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file. Name: " + fileName);
    }

    @Override
    public void playMp4(String fileName) {
        // do nothing
    }
}

// Adaptee 구현 클래스 2
public class Mp4Player implements AdvancedMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        // do nothing
    }

    @Override
    public void playMp4(String fileName) {
        System.out.println("Playing mp4 file. Name: " + fileName);
    }
}

// Adapter 클래스
public class MediaAdapter implements MediaPlayer {
    AdvancedMediaPlayer advancedMediaPlayer;

    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMediaPlayer = new VlcPlayer();
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMediaPlayer = new Mp4Player();
        }
    }

    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMediaPlayer.playVlc(fileName);
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMediaPlayer.playMp4(fileName);
        }
    }
}

// Client 클래스
public class AudioPlayer implements MediaPlayer {
    MediaAdapter mediaAdapter;

    @Override
    public void play(String audioType, String fileName) {
        // 기본적으로 mp3 파일 재생
        if (audioType.equalsIgnoreCase("mp3")) {
            System.out.println("Playing mp3 file. Name: " + fileName);
        }
        // mediaAdapter를 사용하여 vlc나 mp4 파일 재생
        else if (audioType.equalsIgnoreCase("vlc") || audioType.equalsIgnoreCase("mp4")) {
            mediaAdapter = new MediaAdapter(audioType);
            mediaAdapter.play(audioType, fileName);
        } else {
            System.out.println("Invalid media. " + audioType + " format not supported");
        }
    }
}

// 사용 예
public class AdapterPatternDemo {
    public static void main(String[] args) {
        AudioPlayer audioPlayer = new AudioPlayer();

        audioPlayer.play("mp3", "beyond_the_horizon.mp3");
        audioPlayer.play("mp4", "alone.mp4");
        audioPlayer.play("vlc", "far_far_away.vlc");
        audioPlayer.play("avi", "mind_me.avi");
    }
}
```

## 설명

  * MediaPlayer 인터페이스: 클라이언트가 기대하는 인터페이스
  * AdvancedMediaPlayer 인터페이스: 새로운 형식의 오디오 파일을 재생하기 위한 인터페이스
  * VlcPlayer 및 Mp4Player 클래스: AdvancedMediaPlayer 인터페이스를 구현하여 각각 vlc와 mp4 파일을 재생
  * MediaAdapter 클래스: MediaPlayer 인터페이스를 구현하고, AdvancedMediaPlayer 객체를 포함하여 요청을 적절한 형식으로 변환
  * AudioPlayer 클래스: 클라이언트 클래스이며, 기본적으로 mp3 파일을 재생하며, MediaAdapter를 통해 다른 형식의 파일도 재생 가능

![어댑터 패턴 클래스 다이어그램](/assets/images/posts/2024-08-07-어댑터-패턴-Adapter-Pattern/01.png)

## 관련 패턴

1. 브리지(Bridge) 패턴
  * 인터페이스와 구현을 분리하여 각각 독립적으로 변형할 수 있게 합니다. 어댑터와 달리 처음부터 인터페이스를 설계
2. 데코레이터(Decorator) 패턴
  * 객체에 새로운 기능을 동적으로 추가할 수 있게 합니다. 어댑터가 인터페이스 변환에 중점을 두는 반면, 데코레이터는 기능 확장에 중점
3. 퍼사드(Facade) 패턴
  * 서브시스템의 복잡한 인터페이스를 단순화하여 제공합니다. 어댑터가 특정 클래스를 변환하는 반면, 퍼사드는 여러 클래스의 집합에 대한 단순한 인터페이스를 제공
4. 프록시(Proxy) 패턴
  * 다른 객체에 대한 접근을 제어하는 대리자를 제공합니다. 어댑터가 인터페이스를 변환하는 것과 달리, 프록시는 접근 제어나 추가 기능을 제공
