---
title: Edit Distance
description: Edit Distance
categories:
 - algorithm
tags:
 - Dynamic Programming
comments: true
---

# Edit Distance

```java

public class EditDistance {

	public static void main(String[] args) {
		EditDistance ed = new EditDistance();
    System.out.print(ed.getEditDistance("ABCD", "ABEF"));
  }

  public int getEditDistance(String str1, String str2) {
    int n = str1.length();
    int m = str2.length();
    int[][] distance = new int[n+1][m+1];

    for (int i = 0; i < n ; i++ ) {
      for (int j = 0; j < m; j++ ) {
        if(i == 0) {
          distance[i][j] = j;
        } else if(j == 0) {
          distance[i][j] = i;
        } else if(str1.chatAt(i-1) == str2.chatAt(j-1)) {
          distance[i][j] = distance[i-1][j-1];
        } else {
          distance[i][j] = 1 + Math.min(distance[i-1][j], Math.min(distance[i][j-1], distance[i-1][j-1]));
        }
      }
    }    
    return distance[n][m];
  }
}

```
