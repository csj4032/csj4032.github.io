---
title: "프록시 패턴 (Proxy Pattern)"
description: "프록시(Proxy) 패턴은 디자인 패턴 중 하나로, 실제 객체에 대한 접근을 제어하기 위해 대리자 객체를 사용하는 구조적 패턴이다. 이 패턴은 원래 객체와 동일한 인터페이스를 가진 프록시 객체를 두어, 클라이언트가 "
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223542243396"
---

프록시(Proxy) 패턴은 디자인 패턴 중 하나로, 실제 객체에 대한 접근을 제어하기 위해 대리자 객체를 사용하는 구조적 패턴이다. 이 패턴은 원래 객체와 동일한 인터페이스를 가진 프록시 객체를 두어, 클라이언트가 원래 객체에 직접 접근하지 않고 프록시 객체를 통해 접근하도록 합다.

## "보이지 않는 문지기가 실체를 수호하며, 진실에 이르는 길을 지혜롭게 안내한다"

프록시(Proxy) 패턴은 다양한 상황에서 유용하게 사용될 수 있습니다:

1. **지연 초기화(Lazy Initialization)**
  * 객체의 생성 비용이 크거나, 자원(메모리, CPU)을 많이 소모하는 경우, 객체를 즉시 생성하지 않고 실제로 필요할 때까지 지연시키는 것이 바람직할 수 있다. 이미지 로딩, 대규모 데이터베이스 연결, 외부 API 호출 등과 같이 시간이 많이 걸리는 작업에서, 프록시를 사용해 객체의 생성이나 초기화를 지연시킬 수 있다.
2. **접근 제어(Access Control)**
  * 민감한 정보나 중요한 리소스에 대한 접근을 제어해야 할 때, 프록시를 사용해 접근 권한을 관리할 수 있다. 사용자의 권한에 따라 객체에 대한 접근을 허용하거나 거부해야 하는 경우 보호 프록시(Protection Proxy)를 사용할 수 있다.
3. **원격 접근(Remote Access)**
  * 원격 서버나 네트워크에 위치한 객체에 접근해야 할 때, 프록시 패턴을 사용해 로컬 객체처럼 투명하게 원격 객체에 접근할 수 있다. 분산 시스템이나 클라이언트-서버 구조에서 원격 프록시(Remote Proxy)를 사용해 원격 서버의 객체를 로컬에서 작업하듯이 사용할 수 있다.
4. **캐싱(Cache)**
  * 자주 호출되거나 계산 비용이 높은 작업의 결과를 캐싱하여 성능을 향상시킬 수 있다. 프록시를 사용해 동일한 요청에 대해 이전에 계산된 결과를 반환함으로써 계산 비용을 절감하고 성능을 향상시킬 수 있다.
5. **로깅 및 모니터링(Logging and Monitoring)**
  * 실제 객체에 대한 접근을 감시하고, 모든 호출을 기록하거나 성능을 모니터링하는 경우에 프록시를 사용할 수 있다. 프록시를 사용해 실제 객체에 대한 모든 호출을 가로채어 로깅하거나, 호출 전에 추가적인 작업을 수행할 수 있다.
6. **스마트 참조(Smart Reference)**
  * 객체에 대한 참조가 접근될 때 추가적인 행동을 수행해야 할 때 사용된다. 예를 들어, 객체가 참조될 때마다 참조 횟수를 추적하거나, 필요에 따라 객체를 초기화할 수 있습니다. 객체에 대한 참조가 최초로 발생할 때 초기화를 수행하거나, 참조 횟수를 추적하는 경우에 스마트 프록시(Smart Proxy)를 사용할 수 있다.
7. **보안(Security)**
  * 민감한 데이터나 중요한 기능에 대한 접근을 보호하기 위해 사용된다. 프록시를 사용해 클라이언트가 직접 민감한 데이터에 접근하는 것을 방지하고, 대신 접근 전 필요한 인증이나 권한 검사를 수행할 수 있다.
8. **트랜잭션 관리(Transaction Management)**
  * 데이터베이스나 다른 시스템에서 트랜잭션을 관리하는 경우, 프록시를 통해 트랜잭션의 시작과 종료를 제어할 수 있다. 트랜잭션 시작 전에 트랜잭션을 열고, 메서드 호출이 완료된 후에 트랜잭션을 커밋하거나 롤백할 수 있도록 프록시를 사용할 수 있다.

## 장점

  1. **지연 초기화(Lazy Initialization)**
    * 프록시 패턴은 실제 객체의 생성과 초기화를 지연시킬 수 있다. 이를 통해, 객체가 실제로 필요할 때만 메모리와 리소스를 사용하게 되어 성능 최적화에 도움이 된다.
  2. **접근 제어(Access Control)**
    * 프록시 패턴은 실제 객체에 대한 접근을 제어할 수 있다. 이로 인해 특정 조건을 만족해야만 객체에 접근할 수 있도록 하거나, 접근을 제한할 수 있다.
  3. **로깅 및 모니터링(Logging and Monitoring)**
    * 프록시 객체를 통해 실제 객체에 대한 모든 호출을 가로채어 로깅하거나 모니터링할 수 있다. 이를 통해 시스템의 동작을 추적하거나 성능을 분석할 수 있다.
  4. **원격 접근(Remote Access)**
    * 원격 서버에 있는 객체에 로컬 객체처럼 접근할 수 있게 한다. 클라이언트는 로컬에서 작업하는 것처럼 원격 객체에 대해 작업을 수행할 수 있다.
  5. **스마트 참조(Smart Reference)**
    * 프록시 패턴은 객체에 대한 접근 시 추가적인 작업을 수행할 수 있다. 예를 들어, 참조 횟수를 추적하거나, 객체를 사용할 때 초기화를 수행할 수 있다.
  6. **메모리 관리**
    * 프록시 패턴은 메모리 관리 측면에서 유용할 수 있다. 가상 프록시(Virtual Proxy)를 통해 불필요한 객체 생성을 방지하고, 메모리 사용을 최적화할 수 있다.

## 단점

  1. **복잡성 증가**
    * 프록시 패턴을 적용하면 시스템의 구조가 복잡해질 수 있다. 프록시 객체가 추가되면서 클래스 간의 관계가 복잡해지고, 코드의 가독성이 떨어질 수 있다.
  2. **성능 저하**
    * 프록시 패턴은 실제 객체에 대한 호출을 가로채어 추가적인 작업을 수행하므로, 직접 객체에 접근하는 것보다 성능이 저하될 수 있다.
  3. **객체 생명 주기 관리의 어려움**
    * 프록시 패턴을 사용하면 실제 객체의 생명 주기를 추적하고 관리하기가 어려워질 수 있다. 프록시가 객체 생성을 지연시키거나 객체를 대체할 수 있기 때문에, 객체의 생성 시점과 소멸 시점을 명확히 알기 어려울 수 있다.
  4. **디버깅 어려움**
    * 프록시를 사용하면 실제 객체와 프록시 객체 사이에서 문제가 발생할 수 있으며, 이러한 문제를 디버깅하는 것이 복잡해질 수 있다.
  5. **추가 코드 및 유지보수 비용**
    * 프록시 패턴을 구현하면 추가적인 코드 작성이 필요하며, 이로 인해 코드베이스가 커지고 복잡해질 수 있습니다. 따라서 유지보수 비용이 증가할 수 있다.

## 예제: 원격 데이터베이스 서버와의 통신

이번 예제에서는 원격 데이터베이스 서버에 저장된 사용자 정보에 접근하는 시스템을 구현해보겠습니다. 이 시스템에서는 클라이언트가 원격 서버에 있는 사용자 정보를 가져오거나, 새로운 사용자 정보를 저장할 수 있습니다.

```java
import java.rmi.Remote;
import java.rmi.RemoteException;

public interface UserService extends Remote {
    User getUserById(int id) throws RemoteException;
    void saveUser(User user) throws RemoteException;
}
```

```java
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.HashMap;
import java.util.Map;

public class UserServiceImpl extends UnicastRemoteObject implements UserService {

    private Map<Integer, User> userDatabase = new HashMap<>();

    public UserServiceImpl() throws RemoteException {
        super();
    }

    @Override
    public User getUserById(int id) throws RemoteException {
        System.out.println("Fetching user with ID " + id + " from the database.");
        return userDatabase.get(id);
    }

    @Override
    public void saveUser(User user) throws RemoteException {
        System.out.println("Saving user with ID " + user.getId() + " to the database.");
        userDatabase.put(user.getId(), user);
    }
}
```

```java
import java.io.Serializable;

public class User implements Serializable {
    private int id;
    private String name;

    public User(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "'}";
    }
}
```

```java
import java.rmi.Naming;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;

public class UserServiceProxy {
    private UserService userService;

    public UserServiceProxy(String serverAddress, int port) {
        try {
            String url = "rmi://" + serverAddress + ":" + port + "/UserService";
            userService = (UserService) Naming.lookup(url);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public User getUserById(int id) {
        try {
            return userService.getUserById(id);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void saveUser(User user) {
        try {
            userService.saveUser(user);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
}
```

```java
import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class RMIServer {
    public static void main(String[] args) {
        try {
            LocateRegistry.createRegistry(1099); // RMI 레지스트리 생성
            UserService userService = new UserServiceImpl();
            Naming.rebind("UserService", userService);
            System.out.println("User Service is ready.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

```java
public class Client {
    public static void main(String[] args) {
        UserServiceProxy userService = new UserServiceProxy("localhost", 1099);

        User newUser = new User(1, "John Doe");
        userService.saveUser(newUser);  // 원격 서버에 사용자 저장

        User retrievedUser = userService.getUserById(1);  // 원격 서버에서 사용자 정보 가져오기
        System.out.println("Retrieved User: " + retrievedUser);
    }
}
```

![](/assets/images/posts/2024-08-09-프록시-패턴-Proxy-Pattern/01.png)

## 코드 설명

  1. **인터페이스 (UserService)**:
    * UserService 인터페이스는 원격 객체에서 구현해야 하는 메서드를 정의 이 인터페이스는 RMI(Remote Method Invocation)를 사용하여 원격 호출이 가능하도록 Remote 인터페이스를 상속받는다.
  2. **실제 객체 (UserServiceImpl)**:
    * UserServiceImpl 클래스는 UserService 인터페이스를 구현하여 실제 사용자 정보를 저장하고 조회하는 메서드를 정의 이 클래스는 원격 서버에서 동작하며, 클라이언트의 요청을 처리한다.
  3. **프록시 (UserServiceProxy)**:
    * UserServiceProxy 클래스는 클라이언트 측에서 원격 서버의 UserService 객체에 접근할 수 있도록 해준다. 이 프록시는 RMI를 사용하여 원격 서버와 통신하며, 클라이언트는 이 프록시를 통해 원격 서버의 메서드를 호출할 수 있다.
  4. **서버 초기화 (RMIServer)**:
    * RMIServer 클래스는 RMI 레지스트리를 생성하고, UserService 구현체를 등록한다. 클라이언트는 이 레지스트리를 통해 원격 객체에 접근할 수 있다.
  5. **클라이언트 (Client)**:
    * 클라이언트는 UserServiceProxy를 사용하여 원격 서버의 UserService 객체에 접근하고, 사용자 정보를 저장하거나 조회할 수 있다.

## 관련 패턴

  1. **데코레이터(Decorator) 패턴**
    * 데코레이터 패턴과 프록시 패턴은 모두 객체에 대한 접근을 간접적으로 관리하는 데 사용된다. 두 패턴 모두 실제 객체와 동일한 인터페이스를 구현하며, 요청을 처리할 때 추가 작업을 수행할 수 있다. 데코레이터 패턴은 런타임에 객체에 추가 기능(예: 로깅, 권한 검사)을 동적으로 추가하는 데 유용하며, 프록시 패턴은 이러한 기능을 추가하는 동시에 객체에 대한 접근을 제어하는 역할을 할 수 있다.
  2. **어댑터(Adapter)** 패턴
    * 어댑터 패턴은 호환되지 않는 두 클래스 간의 인터페이스를 맞추기 위해 사용되며, 프록시 패턴은 클라이언트가 실제 객체에 접근할 때 중간에서 인터페이스를 제공한다. 어댑터와 프록시 모두 클라이언트와 실제 객체 간의 중재자 역할을 하지만, 용도는 다르다. 어댑터는 주로 인터페이스 호환성 문제를 해결하는 데 사용되고, 프록시는 객체 접근을 제어하거나 기능을 보완하는 데 중점을 둔다. 어댑터 패턴은 클라이언트가 사용하려는 객체의 인터페이스를 변환하여 호환성을 제공할 때 유용하며, 프록시 패턴은 클라이언트가 객체에 접근하기 전에 추가 작업을 수행하거나 접근을 제한할 때 사용된다.
  3. **싱글톤(Singleton) 패턴**
    * 싱글톤 패턴은 특정 클래스의 인스턴스가 시스템 내에서 하나만 존재하도록 보장하는 패턴이다. 프록시 패턴은 이 싱글톤 객체에 대한 접근을 제어하는 데 사용할 수 있다. 프록시를 통해 싱글톤 객체에 접근할 때, 객체 생성을 지연시키거나 생성 비용을 줄일 수 있으며, 로깅이나 권한 검사와 같은 추가 작업을 수행할 수도 있다.
  4. **팩토리(Factory) 패턴**
    * 팩토리 패턴은 객체 생성 로직을 캡슐화하여 클라이언트 코드와 분리하는 패턴이다. 프록시 패턴은 팩토리 패턴과 함께 사용되어, 실제 객체 대신 프록시 객체를 생성할 수 있다. 프록시 객체는 팩토리 패턴을 통해 생성되며, 필요에 따라 실제 객체의 생성과 초기화를 관리할 수 있다. 팩토리 패턴을 사용해 객체 생성을 처리하고, 프록시 패턴을 통해 생성된 객체에 대한 접근을 제어하거나 추가 작업을 수행할 수 있다.
  5. **브리지(Bridge) 패턴**
    * 브리지 패턴은 추상화와 구현을 분리하여, 이들이 서로 독립적으로 변형될 수 있도록 하는 패턴이다. 프록시 패턴은 클라이언트와 실제 구현 사이에서 중재자 역할을 하며, 브리지 패턴을 통해 구현을 감추거나 클라이언트가 접근하기 전에 추가 작업을 수행할 수 있다. 브리지 패턴을 사용하면 클라이언트가 추상화된 인터페이스를 활용할 수 있고, 프록시 패턴을 통해 구현 세부사항에 접근하기 전에 필요한 작업을 처리할 수 있다.
  6. **컴포지트(Composite) 패턴**
    * 컴포지트 패턴은 객체들을 트리 구조로 구성하여, 개별 객체와 객체 그룹을 동일하게 처리할 수 있도록 돕는 패턴이다. 프록시 패턴은 이러한 구조에서 특정 객체나 객체 그룹에 대한 접근을 제어하는 역할을 할 수 있다. 컴포지트 패턴을 사용해 복잡한 객체 구조를 관리할 때, 프록시 패턴을 활용하면 개별 객체나 하위 트리에 대한 접근을 조절하거나 추가 작업을 수행할 수 있다.
