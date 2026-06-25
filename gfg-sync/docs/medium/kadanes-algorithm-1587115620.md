# Maximum Subarray Sum - Kadane's Algorithm

**Difficulty:** Medium
**Topics:** Arrays, Dynamic Programming, Data Structures, Algorithms
**Link:** [GFG Problem](<https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1>)

## Problem Statement

You are given an integer array arr[]. You need to find the maximum sum of a subarray (containing at least one element) in the array arr[].



## Examples

Examples:

Input: arr[] = [2, 3, -8, 7, -1, 2, 3]
Output: 11
Explanation: The subarray [7, -1, 2, 3] has the largest sum 11.
Input: arr[] = [-2, -4]
Output: -2
Explanation: The subarray [-2] has the largest sum -2.
Input: arr[] = [5, 4, 1, 7, 8]
Output: 25
Explanation: The subarray [5, 4, 1, 7, 8] has the largest sum 25.

## Constraints

- 1 ≤ arr.size() ≤ 105
- -104 ≤ arr[i] ≤ 104

## Solution

```java
class Solution {
    int maxSubarraySum(int[] arr) {
        // Code here
        int sum = arr[0];
        int currentsum = arr[0];
        for (int i = 1; i < arr.length; i++){
            currentsum = Math.max(arr[i],currentsum + arr[i]);
            sum = Math.max(sum,currentsum);
        }
        return sum;
    }
    
}
```

---
_Synced on 2026-06-25_
